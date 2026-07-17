import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  DEFAULT_TOKENS,
  contrastForeground,
  resolveTokens,
  tokensToCss,
} from "./theme";

describe("resolveTokens", () => {
  it("returns built-in defaults when styles are empty", () => {
    const t = resolveTokens({});
    expect(t).toEqual({
      primary: "#1570c2",
      primaryForeground: "#ffffff",
      cta: "#252627",
      ctaForeground: "#ffffff",
      background: "#ffffff",
      foreground: "#09090b",
      muted: "#f4f4f5",
      border: "#e4e4e7",
      radius: "0.5rem",
      darkBackground: "#09090b",
      darkForeground: "#fafafa",
      darkCta: "#ffffff",
      darkCtaForeground: "#18181b",
    });
  });

  it("derives only primary and cta from the legacy ramp; surfaces stay neutral", () => {
    const t = resolveTokens({
      primary700: "#c2410c",
      secondary900: "#1c1917",
      // Incidental legacy keys: a dropdown ring-offset, a search-icon color,
      // a modal tint, the CTA's hover shade. None of these were surfaces in
      // the pre-shadcn portal, so none may repaint background/foreground.
      primary100: "#fff7ed",
      primary200: "#ffedd5",
      primary900: "#431407",
      primary400: "#fb923c",
      primary500: "#f97316",
      primary600: "#ea580c",
      secondary800: "#292524",
    });
    expect(t.primary).toBe("#c2410c"); // the brand accent
    expect(t.cta).toBe("#1c1917"); // the black CTA button's face
    expect(t.background).toBe("#ffffff");
    expect(t.foreground).toBe("#09090b");
    expect(t.muted).toBe("#f4f4f5");
    expect(t.darkBackground).toBe("#09090b");
    expect(t.border).toBe("#e4e4e7");
    expect(t.radius).toBe("0.5rem");
    expect(t.darkForeground).toBe("#fafafa");
    // derived from resolved primary (dark orange -> white text)
    expect(t.primaryForeground).toBe("#ffffff");
    // derived from resolved cta (near-black -> white text)
    expect(t.ctaForeground).toBe("#ffffff");
    // secondaryColor800 was the legacy hover shade; hover is now derived
    // from cta itself, so it reaches no token.
    expect(Object.values(t)).not.toContain("#292524");
    // the dark CTA was hardcoded white and has no legacy fallback
    expect(t.darkCta).toBe("#ffffff");
    expect(t.darkCtaForeground).toBe("#18181b");
  });

  it("prefers v2 over legacy primary, per token independently", () => {
    const t = resolveTokens({
      primary700: "#c2410c",
      primary100: "#fff7ed",
      v2: {
        primary: "#16a34a",
        background: "#fafafa",
        radius: "0.25rem",
      },
    });
    expect(t.primary).toBe("#16a34a"); // v2 wins over legacy primary700
    expect(t.background).toBe("#fafafa"); // only v2 can set a surface
    expect(t.radius).toBe("0.25rem");
    expect(t.muted).toBe("#f4f4f5"); // untouched tokens keep defaults
    expect(t.border).toBe("#e4e4e7");
    // foreground is not "untouched": it follows the background the realm set
    expect(t.foreground).toBe("#18181b");
  });

  /*
    Every v2 token at a distinct sentinel, so that a token reading the wrong
    v2 key (or a typo'd key silently resolving to the default) fails here
    rather than shipping. The values are deliberately meaningless — this
    asserts wiring, not aesthetics.
  */
  it("maps every v2 token through to its own output token", () => {
    const t = resolveTokens({
      v2: {
        primary: "#010203",
        primaryForeground: "#040506",
        cta: "#191a1b",
        ctaForeground: "#1c1d1e",
        background: "#070809",
        foreground: "#0a0b0c",
        muted: "#0d0e0f",
        border: "#101112",
        radius: "1.5rem",
        darkBackground: "#131415",
        darkForeground: "#161718",
        darkCta: "#1f2021",
        darkCtaForeground: "#222324",
      },
    });
    expect(t).toEqual({
      primary: "#010203",
      primaryForeground: "#040506",
      cta: "#191a1b",
      ctaForeground: "#1c1d1e",
      background: "#070809",
      foreground: "#0a0b0c",
      muted: "#0d0e0f",
      border: "#101112",
      radius: "1.5rem",
      darkBackground: "#131415",
      darkForeground: "#161718",
      darkCta: "#1f2021",
      darkCtaForeground: "#222324",
    });
  });

  it("uses explicit v2 primaryForeground over auto-contrast", () => {
    const t = resolveTokens({
      v2: { primary: "#f9fafb", primaryForeground: "#123456" },
    });
    expect(t.primaryForeground).toBe("#123456");
  });

  it("derives a dark primaryForeground from a light primary", () => {
    const t = resolveTokens({ v2: { primary: "#fde047" } });
    expect(t.primary).toBe("#fde047");
    // light yellow brand -> near-black text, not the #ffffff default
    expect(t.primaryForeground).toBe("#18181b");
    const css = tokensToCss(t);
    expect(css).toContain("--primary: #fde047;");
    expect(css).toContain("--primary-foreground: #18181b;");
  });

  it("derives a dark primaryForeground from a light legacy primary700", () => {
    const t = resolveTokens({ primary700: "#f9fafb" });
    expect(t.primaryForeground).toBe("#18181b");
  });

  it("ignores empty-string values", () => {
    const t = resolveTokens({ primary700: "", v2: { primary: "  " } });
    expect(t.primary).toBe("#1570c2");
  });
});

/*
  Realm attribute values reach a <style> element verbatim, so anything that
  could close the rule early (and silently void the rest of the block) must
  be rejected at resolution time and fall back as if unset.
*/
describe("resolveTokens value validation", () => {
  it("rejects a value that closes the rule and falls back to the default", () => {
    const t = resolveTokens({ v2: { primary: "red}" } });
    expect(t.primary).toBe("#1570c2");
    expect(tokensToCss(t)).not.toContain("red}");
  });

  it("rejects a value carrying extra declarations", () => {
    const t = resolveTokens({ v2: { background: "#fff; --foreground: #fff" } });
    expect(t.background).toBe("#ffffff");
    expect(tokensToCss(t)).not.toContain(";  --foreground: #fff");
  });

  it("rejects a value with a closing brace and a trailing block", () => {
    const t = resolveTokens({
      v2: { darkBackground: "#000} .dark { --primary: red" },
    });
    expect(t.darkBackground).toBe("#09090b");
    // the .dark block survives intact, with the default applied
    const css = tokensToCss(t);
    expect(css).not.toContain("--primary: red");
    expect(css).toContain(".dark {");
    expect(css).toContain("--background: #09090b;");
  });

  it("rejects an invalid radius and falls back to the default", () => {
    const t = resolveTokens({ v2: { radius: "0.5rem; color: red" } });
    expect(t.radius).toBe("0.5rem");
    expect(tokensToCss(t)).not.toContain("color: red");
  });

  it("rejects a radius that is not a CSS length", () => {
    expect(resolveTokens({ v2: { radius: "huge" } }).radius).toBe("0.5rem");
    expect(resolveTokens({ v2: { radius: "12" } }).radius).toBe("0.5rem");
  });

  it("accepts documented and pragmatic color formats", () => {
    const t = resolveTokens({
      v2: {
        primary: "#16a34a",
        background: "white",
        foreground: "rgb(9 9 11 / 90%)",
        muted: "oklch(0.97 0 0)",
      },
    });
    expect(t.primary).toBe("#16a34a");
    expect(t.background).toBe("white");
    expect(t.foreground).toBe("rgb(9 9 11 / 90%)");
    expect(t.muted).toBe("oklch(0.97 0 0)");
  });

  it("accepts valid radius lengths", () => {
    expect(resolveTokens({ v2: { radius: "0" } }).radius).toBe("0");
    expect(resolveTokens({ v2: { radius: "4px" } }).radius).toBe("4px");
    expect(resolveTokens({ v2: { radius: "0.25rem" } }).radius).toBe("0.25rem");
    expect(resolveTokens({ v2: { radius: "1em" } }).radius).toBe("1em");
  });

  it("rejects nested functions, comments and markup in color values", () => {
    const styles = [
      "var(--x)",
      "rgb(var(--x))",
      "url(javascript:alert(1))",
      "#fff /* } */",
      "</style><script>alert(1)</script>",
      "#ggg",
    ];
    for (const primary of styles) {
      const t = resolveTokens({ v2: { primary } });
      expect(t.primary).toBe("#1570c2");
      expect(tokensToCss(t)).not.toContain(primary);
    }
  });

  it("falls back to the legacy value when the v2 value is invalid", () => {
    const t = resolveTokens({
      primary700: "#c2410c",
      v2: { primary: "red}" },
    });
    // rejected exactly as if unset — legacy is the next candidate
    expect(t.primary).toBe("#c2410c");
  });
});

/*
  A realm that sets a surface but not its text color must still get readable
  text: the built-in foreground defaults only pair with the built-in
  background defaults.
*/
describe("resolveTokens foreground auto-contrast", () => {
  it("derives a readable foreground from a dark v2.background", () => {
    const t = resolveTokens({ v2: { background: "#111827" } });
    expect(t.background).toBe("#111827");
    // the near-black default would be 1.12:1 here
    expect(t.foreground).toBe("#ffffff");
  });

  it("derives a readable darkForeground from a light v2.darkBackground", () => {
    const t = resolveTokens({ v2: { darkBackground: "#f5f5f5" } });
    expect(t.darkBackground).toBe("#f5f5f5");
    expect(t.darkForeground).toBe("#18181b");
  });

  it("prefers an explicit foreground over the derived one", () => {
    const t = resolveTokens({
      v2: { background: "#111827", foreground: "#94a3b8" },
    });
    expect(t.foreground).toBe("#94a3b8");
  });

  it("keeps the default pair when the background is unset", () => {
    expect(resolveTokens({}).foreground).toBe("#09090b");
    expect(resolveTokens({}).darkForeground).toBe("#fafafa");
  });

  it("keeps the default pair when the background is invalid", () => {
    // rejected exactly as if unset, so the default pair still holds
    const t = resolveTokens({ v2: { background: "#fff; --foreground: #fff" } });
    expect(t.background).toBe("#ffffff");
    expect(t.foreground).toBe("#09090b");
  });

  it("does not guess a foreground for an unmeasurable background", () => {
    // contrastForeground assumes dark for non-hex; deriving here would put
    // #ffffff text on a `white` background
    const t = resolveTokens({ v2: { background: "white" } });
    expect(t.background).toBe("white");
    expect(t.foreground).toBe("#09090b");
  });
});

/*
  The neutral CTA button. `cta` is the only token besides `primary` with a
  legacy fallback (secondaryColor900); the dark CTA was a hardcoded white in
  the pre-shadcn portal, so `darkCta` has no legacy source.
*/
describe("resolveTokens cta", () => {
  it("derives cta from the legacy secondaryColor900", () => {
    const t = resolveTokens({ secondary900: "#1c1917" });
    expect(t.cta).toBe("#1c1917");
    expect(t.ctaForeground).toBe("#ffffff");
  });

  it("prefers v2.cta over the legacy secondaryColor900", () => {
    const t = resolveTokens({
      secondary900: "#1c1917",
      v2: { cta: "#4c1d95" },
    });
    expect(t.cta).toBe("#4c1d95");
  });

  it("falls back to the legacy value when v2.cta is invalid", () => {
    const t = resolveTokens({
      secondary900: "#1c1917",
      v2: { cta: "red}" },
    });
    // rejected exactly as if unset — legacy is the next candidate
    expect(t.cta).toBe("#1c1917");
  });

  it("falls back to the built-in default when the legacy value is invalid", () => {
    const t = resolveTokens({ secondary900: "not a color" });
    expect(t.cta).toBe("#252627");
  });

  it("defaults to the portal's near-black CTA with white text", () => {
    const t = resolveTokens({});
    expect(t.cta).toBe("#252627");
    expect(t.ctaForeground).toBe("#ffffff");
  });

  it("derives a dark ctaForeground from a light v2.cta", () => {
    const t = resolveTokens({ v2: { cta: "#fde047" } });
    expect(t.cta).toBe("#fde047");
    // light yellow CTA -> near-black text, not the #ffffff default
    expect(t.ctaForeground).toBe("#18181b");
  });

  it("uses an explicit v2.ctaForeground over auto-contrast", () => {
    const t = resolveTokens({ v2: { cta: "#fde047", ctaForeground: "#123456" } });
    expect(t.ctaForeground).toBe("#123456");
  });

  it("defaults darkCta to white with near-black text", () => {
    const t = resolveTokens({});
    expect(t.darkCta).toBe("#ffffff");
    expect(t.darkCtaForeground).toBe("#18181b");
  });

  it("does not derive darkCta from any legacy key", () => {
    // the pre-shadcn dark CTA was hardcoded white, never realm-configurable
    const t = resolveTokens({ secondary900: "#1c1917", secondary800: "#292524" });
    expect(t.darkCta).toBe("#ffffff");
  });

  it("derives a light darkCtaForeground from a dark v2.darkCta", () => {
    const t = resolveTokens({ v2: { darkCta: "#111827" } });
    expect(t.darkCta).toBe("#111827");
    expect(t.darkCtaForeground).toBe("#ffffff");
  });

  it("resolves cta and darkCta independently", () => {
    const t = resolveTokens({ v2: { cta: "#4c1d95" } });
    expect(t.cta).toBe("#4c1d95");
    expect(t.darkCta).toBe("#ffffff");
  });
});

/*
  index.css carries the same defaults as DEFAULT_TOKENS, so an unbranded
  realm renders identically whether or not the <style> element is injected.
  The two are declared in different files and have drifted before, so the
  cta pair is pinned here in both directions.

  Scoped to the cta variables: the surface variables are not comparable this
  way, because tokensToCss derives several of them with color-mix() where
  index.css carries a static approximation (--muted-foreground, and the
  .dark surfaces).
*/
describe("index.css / DEFAULT_TOKENS parity", () => {
  const css = readFileSync(
    fileURLToPath(new URL("../index.css", import.meta.url)),
    "utf8"
  );
  const block = (selector: string) => {
    const start = css.indexOf(selector);
    expect(start, `${selector} block not found in index.css`).toBeGreaterThan(
      -1
    );
    return css.slice(start, css.indexOf("}", start));
  };

  it("declares the light cta pair at the DEFAULT_TOKENS values", () => {
    const root = block(":root {");
    expect(root).toContain(`--cta: ${DEFAULT_TOKENS.cta};`);
    expect(root).toContain(
      `--cta-foreground: ${contrastForeground(DEFAULT_TOKENS.cta)};`
    );
  });

  it("declares the dark cta pair at the DEFAULT_TOKENS values", () => {
    const dark = block(".dark {");
    expect(dark).toContain(`--cta: ${DEFAULT_TOKENS.darkCta};`);
    expect(dark).toContain(
      `--cta-foreground: ${contrastForeground(DEFAULT_TOKENS.darkCta)};`
    );
  });

  it("exposes the cta pair to Tailwind so bg-cta/text-cta-foreground compile", () => {
    const theme = css.slice(css.indexOf("@theme inline {"));
    expect(theme).toContain("--color-cta: var(--cta);");
    expect(theme).toContain("--color-cta-foreground: var(--cta-foreground);");
  });

  /*
    The shadcn Sidebar styles itself exclusively with these eight variables.
    Without the @theme inline entries the bg-sidebar/text-sidebar-foreground
    utilities it hardcodes do not compile and it renders unstyled, so each
    one is pinned here.
  */
  it("exposes the sidebar family to Tailwind so bg-sidebar compiles", () => {
    const theme = css.slice(css.indexOf("@theme inline {"));
    for (const name of [
      "sidebar",
      "sidebar-foreground",
      "sidebar-primary",
      "sidebar-primary-foreground",
      "sidebar-accent",
      "sidebar-accent-foreground",
      "sidebar-border",
      "sidebar-ring",
    ]) {
      expect(theme).toContain(`--color-${name}: var(--${name});`);
    }
  });

  /*
    The sidebar carries no v2 tokens, so its light defaults are exactly the
    tokens it derives from — unlike the dark block, where tokensToCss uses a
    color-mix() against a static approximation in index.css.
  */
  it("declares the light sidebar family at the DEFAULT_TOKENS values", () => {
    const root = block(":root {");
    expect(root).toContain(`--sidebar: ${DEFAULT_TOKENS.muted};`);
    expect(root).toContain(`--sidebar-foreground: ${DEFAULT_TOKENS.foreground};`);
    expect(root).toContain(`--sidebar-primary: ${DEFAULT_TOKENS.primary};`);
    expect(root).toContain(
      `--sidebar-primary-foreground: ${contrastForeground(
        DEFAULT_TOKENS.primary
      )};`
    );
    expect(root).toContain(`--sidebar-accent: ${DEFAULT_TOKENS.border};`);
    expect(root).toContain(
      `--sidebar-accent-foreground: ${DEFAULT_TOKENS.foreground};`
    );
    expect(root).toContain(`--sidebar-border: ${DEFAULT_TOKENS.border};`);
    expect(root).toContain(`--sidebar-ring: ${DEFAULT_TOKENS.primary};`);
  });

  it("emits the same light sidebar values it declares when nothing is branded", () => {
    // the injected stylesheet at defaults must be a no-op over index.css
    const emitted = tokensToCss(resolveTokens({}));
    const emittedRoot = emitted.slice(
      emitted.indexOf(":root {"),
      emitted.indexOf(".dark {")
    );
    const root = block(":root {");
    for (const decl of [
      `--sidebar: ${DEFAULT_TOKENS.muted};`,
      `--sidebar-primary: ${DEFAULT_TOKENS.primary};`,
      `--sidebar-border: ${DEFAULT_TOKENS.border};`,
      `--sidebar-ring: ${DEFAULT_TOKENS.primary};`,
    ]) {
      expect(emittedRoot).toContain(decl);
      expect(root).toContain(decl);
    }
  });

  it("emits the same cta values it declares when nothing is branded", () => {
    // the injected stylesheet at defaults must be a no-op over index.css
    const emitted = tokensToCss(resolveTokens({}));
    const root = block(":root {");
    const dark = block(".dark {");
    for (const decl of [`--cta: ${DEFAULT_TOKENS.cta};`]) {
      expect(emitted).toContain(decl);
      expect(root).toContain(decl);
    }
    for (const decl of [`--cta: ${DEFAULT_TOKENS.darkCta};`]) {
      expect(emitted).toContain(decl);
      expect(dark).toContain(decl);
    }
  });
});

describe("contrastForeground", () => {
  it("picks white on dark backgrounds", () => {
    expect(contrastForeground("#1570c2")).toBe("#ffffff");
    expect(contrastForeground("#000")).toBe("#ffffff");
  });
  it("picks near-black on light backgrounds", () => {
    expect(contrastForeground("#f9fafb")).toBe("#18181b");
    expect(contrastForeground("#fff")).toBe("#18181b");
  });
  it("falls back to white for non-hex values", () => {
    expect(contrastForeground("oklch(0.6 0.1 240)")).toBe("#ffffff");
  });
});

describe("tokensToCss", () => {
  it("emits :root and .dark blocks with the resolved values", () => {
    const css = tokensToCss(resolveTokens({ v2: { primary: "#16a34a" } }));
    expect(css).toContain(":root {");
    expect(css).toContain(".dark {");
    expect(css).toContain("--primary: #16a34a;");
    expect(css).toContain("--ring: #16a34a;");
    expect(css).toContain("--radius: 0.5rem;");
  });

  /*
    The dark surfaces are derived by lifting darkBackground away from itself.
    Mixing toward a literal `white` only works while the base is dark — a
    light darkBackground would land every surface on top of the background.
  */
  it("lifts dark surfaces away from a light dark base", () => {
    const t = resolveTokens({ v2: { darkBackground: "#f5f5f5" } });
    const css = tokensToCss(t);
    const mix = "color-mix(in srgb, #f5f5f5 88%, #18181b)";
    // #f5f5f5 88% white would be #f6f6f6 on a #f5f5f5 background — 1.01:1
    expect(css).not.toContain("88%, white)");
    expect(css).toContain(`--border: ${mix};`);
    expect(css).toContain(`--input: ${mix};`);
    expect(css).toContain(`--muted: ${mix};`);
    expect(css).toContain(`--secondary: ${mix};`);
    expect(css).toContain(`--accent: ${mix};`);
    // the sidebar is one of those surfaces, so it lifts with them
    expect(css).toContain(`--sidebar: ${mix};`);
    expect(css).toContain(`--sidebar-accent: ${mix};`);
    expect(css).toContain(`--sidebar-border: ${mix};`);
  });

  it("still lifts dark surfaces toward white on the default dark base", () => {
    const css = tokensToCss(resolveTokens({}));
    // unchanged from the literal-white behavior, just spelled as a hex
    const mix = "color-mix(in srgb, #09090b 88%, #ffffff)";
    expect(css).toContain(`--border: ${mix};`);
    expect(css).toContain(`--muted: ${mix};`);
  });

  /*
    --cta is one of the few variables whose value differs between the two
    blocks (the CTA inverts in dark mode), so asserting it is present is not
    enough: each block must carry its own pair.
  */
  it("emits the cta pair in both :root and .dark, per mode", () => {
    const css = tokensToCss(resolveTokens({}));
    const root = css.slice(css.indexOf(":root {"), css.indexOf(".dark {"));
    const dark = css.slice(css.indexOf(".dark {"));
    expect(root).toContain("--cta: #252627;");
    expect(root).toContain("--cta-foreground: #ffffff;");
    expect(dark).toContain("--cta: #ffffff;");
    expect(dark).toContain("--cta-foreground: #18181b;");
  });

  it("emits realm-set cta values into their own blocks", () => {
    const css = tokensToCss(
      resolveTokens({ v2: { cta: "#fde047", darkCta: "#111827" } })
    );
    const root = css.slice(css.indexOf(":root {"), css.indexOf(".dark {"));
    const dark = css.slice(css.indexOf(".dark {"));
    expect(root).toContain("--cta: #fde047;");
    expect(root).toContain("--cta-foreground: #18181b;"); // auto-contrast
    expect(dark).toContain("--cta: #111827;");
    expect(dark).toContain("--cta-foreground: #ffffff;");
  });

  it("emits a legacy-derived cta", () => {
    const css = tokensToCss(resolveTokens({ secondary900: "#1c1917" }));
    expect(css).toContain("--cta: #1c1917;");
  });

  /*
    The sidebar has no v2 tokens of its own — it is derived, so branding
    only reaches it through primary/muted/border/foreground. These pin each
    derivation to its source token in both blocks; a sidebar variable wired
    to the wrong token (or dropped) fails here rather than shipping a
    sidebar that ignores the realm's brand.
  */
  it("emits the sidebar family in both :root and .dark", () => {
    const css = tokensToCss(resolveTokens({}));
    const root = css.slice(css.indexOf(":root {"), css.indexOf(".dark {"));
    const dark = css.slice(css.indexOf(".dark {"));
    for (const name of [
      "--sidebar",
      "--sidebar-foreground",
      "--sidebar-primary",
      "--sidebar-primary-foreground",
      "--sidebar-accent",
      "--sidebar-accent-foreground",
      "--sidebar-border",
      "--sidebar-ring",
    ]) {
      expect(root, `${name} missing from :root`).toContain(`${name}:`);
      expect(dark, `${name} missing from .dark`).toContain(`${name}:`);
    }
  });

  it("tracks a custom v2.primary through the sidebar in both blocks", () => {
    const css = tokensToCss(resolveTokens({ v2: { primary: "#16a34a" } }));
    const root = css.slice(css.indexOf(":root {"), css.indexOf(".dark {"));
    const dark = css.slice(css.indexOf(".dark {"));
    // the active item and the focus ring follow the brand, in both modes
    expect(root).toContain("--sidebar-primary: #16a34a;");
    expect(root).toContain("--sidebar-ring: #16a34a;");
    expect(dark).toContain("--sidebar-primary: #16a34a;");
    expect(dark).toContain("--sidebar-ring: #16a34a;");
    // and its foreground follows the auto-contrast of that brand
    expect(root).toContain("--sidebar-primary-foreground: #ffffff;");
    expect(dark).toContain("--sidebar-primary-foreground: #ffffff;");
  });

  it("derives the light sidebar surface from muted, border and foreground", () => {
    const css = tokensToCss(
      resolveTokens({
        v2: { muted: "#eef2ff", border: "#c7d2fe", foreground: "#1e1b4b" },
      })
    );
    const root = css.slice(css.indexOf(":root {"), css.indexOf(".dark {"));
    expect(root).toContain("--sidebar: #eef2ff;"); // recessed surface = muted
    expect(root).toContain("--sidebar-foreground: #1e1b4b;");
    expect(root).toContain("--sidebar-accent: #c7d2fe;"); // hover tint = border
    expect(root).toContain("--sidebar-accent-foreground: #1e1b4b;");
    expect(root).toContain("--sidebar-border: #c7d2fe;");
  });

  it("derives the dark sidebar foreground from darkForeground", () => {
    const css = tokensToCss(resolveTokens({ v2: { darkForeground: "#e0f2fe" } }));
    const dark = css.slice(css.indexOf(".dark {"));
    expect(dark).toContain("--sidebar-foreground: #e0f2fe;");
    expect(dark).toContain("--sidebar-accent-foreground: #e0f2fe;");
  });

  it("emits the same variable list regardless of the dark base", () => {
    const names = (css: string) =>
      [...css.matchAll(/--[a-z-]+(?=:)/g)].map((m) => m[0]);
    const light = resolveTokens({ v2: { darkBackground: "#f5f5f5" } });
    expect(names(tokensToCss(light))).toEqual(
      names(tokensToCss(resolveTokens({})))
    );
  });
});
