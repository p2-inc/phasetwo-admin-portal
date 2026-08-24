import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  DARK_DEFAULTS,
  DEFAULT_RADIUS,
  LIGHT_DEFAULTS,
  contrastForeground,
  resolveTokens,
  tokensToCss,
} from "./theme";
import { darkTokenName, PORTAL_COLOR_TOKENS } from "./tokens";

describe("resolveTokens", () => {
  it("returns built-in defaults when styles are empty", () => {
    const t = resolveTokens({});
    expect(t).toEqual({
      background: "#ffffff",
      foreground: "#09090b",
      primary: "#1570c2",
      primaryForeground: "#ffffff",
      secondary: "#f4f4f5",
      secondaryForeground: "#18181b",
      muted: "#f4f4f5",
      mutedForeground: "#71717a",
      border: "#e4e4e7",
      // Derived from their base token when unset.
      card: "#ffffff",
      cardForeground: "#09090b",
      accent: "#f4f4f5",
      accentForeground: "#09090b",
      input: "#e4e4e7",
      ring: "#1570c2",
      darkBackground: "#09090b",
      darkForeground: "#fafafa",
      darkPrimary: "#1570c2",
      darkPrimaryForeground: "#ffffff",
      darkSecondary: "#27272a",
      darkSecondaryForeground: "#fafafa",
      darkMuted: "#27272a",
      darkMutedForeground: "#a1a1aa",
      darkBorder: "#27272a",
      darkCard: "#09090b",
      darkCardForeground: "#fafafa",
      darkAccent: "#27272a",
      darkAccentForeground: "#fafafa",
      darkInput: "#27272a",
      darkRing: "#1570c2",
      radius: "0.5rem",
      fontFamily: "",
    });
  });

  it("covers every token in the shared vocabulary", () => {
    // Guards against a token being added to the vocabulary but never resolved.
    const t = resolveTokens({});
    for (const token of PORTAL_COLOR_TOKENS) {
      expect(t[token], token).toBeTruthy();
      expect(t[darkTokenName(token)], darkTokenName(token)).toBeTruthy();
    }
  });

  it("keeps the base defaults in step with the light and dark palettes", () => {
    const t = resolveTokens({});
    for (const [token, value] of Object.entries(LIGHT_DEFAULTS)) {
      expect(t[token as keyof typeof LIGHT_DEFAULTS], token).toBe(value);
    }
    for (const [token, value] of Object.entries(DARK_DEFAULTS)) {
      expect(t[darkTokenName(token as never)], token).toBe(value);
    }
    expect(t.radius).toBe(DEFAULT_RADIUS);
  });

  it("derives only primary from the legacy ramp; surfaces stay neutral", () => {
    const t = resolveTokens({
      primary700: "#c2410c",
      // secondary900 was the `cta` fallback. cta folded into primary, so this
      // key now reaches no token at all -- a realm that only customised it must
      // set theme.v2.primary instead.
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
    expect(t.primary).toBe("#c2410c"); // the brand accent, the one survivor
    expect(t.background).toBe("#ffffff");
    expect(t.foreground).toBe("#09090b");
    expect(t.muted).toBe("#f4f4f5");
    expect(t.secondary).toBe("#f4f4f5");
    expect(t.darkBackground).toBe("#09090b");
    expect(t.border).toBe("#e4e4e7");
    expect(t.radius).toBe("0.5rem");
    expect(t.darkForeground).toBe("#fafafa");
    // derived from resolved primary (dark orange -> white text)
    expect(t.primaryForeground).toBe("#ffffff");
    // ring follows the branded primary; card/accent/input stay neutral
    expect(t.ring).toBe("#c2410c");
    expect(t.card).toBe("#ffffff");
    expect(t.accent).toBe("#f4f4f5");
    expect(t.input).toBe("#e4e4e7");
    // Neither dropped legacy key may reach any token.
    expect(Object.values(t)).not.toContain("#1c1917");
    expect(Object.values(t)).not.toContain("#292524");
  });

  it("carries a branded light primary into dark mode", () => {
    // Brand colour is mode-independent: the dark override was not set, so it
    // inherits rather than reverting to the default blue.
    const t = resolveTokens({ v2: { primary: "#7c3aed" } });
    expect(t.darkPrimary).toBe("#7c3aed");
    expect(t.darkRing).toBe("#7c3aed");
  });

  it("prefers an explicit dark brand override over the light value", () => {
    const t = resolveTokens({
      v2: { primary: "#7c3aed", darkPrimary: "#a78bfa" },
    });
    expect(t.primary).toBe("#7c3aed");
    expect(t.darkPrimary).toBe("#a78bfa");
  });

  it("does not carry a light surface token into dark mode", () => {
    // A light background must never light up dark mode.
    const t = resolveTokens({ v2: { background: "#fef9c3" } });
    expect(t.background).toBe("#fef9c3");
    expect(t.darkBackground).toBe("#09090b");
    expect(t.darkCard).toBe("#09090b");
  });

  it("keeps the dark palette for brand tokens when nothing is set", () => {
    const t = resolveTokens({});
    expect(t.darkSecondary).toBe("#27272a");
  });

  it("derives a token from its base only while it is unset", () => {
    const derived = resolveTokens({ v2: { border: "#ff0000" } });
    expect(derived.input).toBe("#ff0000"); // follows border
    const explicit = resolveTokens({
      v2: { border: "#ff0000", input: "#00ff00" },
    });
    expect(explicit.input).toBe("#00ff00"); // explicit wins
    expect(explicit.border).toBe("#ff0000");
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
    // One distinct value per token, so a mis-wired token shows up as a swap
    // rather than as a passing test.
    const v2 = Object.fromEntries(
      PORTAL_COLOR_TOKENS.flatMap((token, i) => [
        [token, `#${String(i + 10).padStart(2, "0")}0000`],
        [darkTokenName(token), `#00${String(i + 10).padStart(2, "0")}00`],
      ])
    );
    const t = resolveTokens({ v2: { ...v2, radius: "1.5rem" } });

    for (const [token, value] of Object.entries(v2)) {
      expect(t[token as keyof typeof t], token).toBe(value);
    }
    expect(t.radius).toBe("1.5rem");
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
describe("resolveTokens secondary", () => {
  // `cta` folded into `primary`; `secondary` is now a settable token of its own
  // rather than an alias of `muted`. Its default is still the muted neutral, so
  // an unbranded realm looks exactly as it did.
  it("defaults to the muted neutral in both modes", () => {
    const t = resolveTokens({});
    expect(t.secondary).toBe("#f4f4f5");
    expect(t.secondary).toBe(t.muted);
    expect(t.darkSecondary).toBe("#27272a");
    expect(t.darkSecondary).toBe(t.darkMuted);
  });

  it("can be branded independently of muted", () => {
    const t = resolveTokens({ v2: { secondary: "#4c1d95" } });
    expect(t.secondary).toBe("#4c1d95");
    expect(t.muted).toBe("#f4f4f5");
  });

  it("auto-contrasts its foreground when branded", () => {
    const t = resolveTokens({ v2: { secondary: "#4c1d95" } });
    expect(t.secondaryForeground).toBe("#ffffff");
  });

  it("uses an explicit secondaryForeground over auto-contrast", () => {
    const t = resolveTokens({
      v2: { secondary: "#4c1d95", secondaryForeground: "#fde047" },
    });
    expect(t.secondaryForeground).toBe("#fde047");
  });

  it("is mode-independent like primary", () => {
    const t = resolveTokens({ v2: { secondary: "#4c1d95" } });
    expect(t.darkSecondary).toBe("#4c1d95");
  });

  it("resolves light and dark independently when both are set", () => {
    const t = resolveTokens({
      v2: { secondary: "#4c1d95", darkSecondary: "#c4b5fd" },
    });
    expect(t.secondary).toBe("#4c1d95");
    expect(t.darkSecondary).toBe("#c4b5fd");
  });

  it("takes no legacy fallback", () => {
    // secondaryColor900 fed the old `cta` and is deliberately dropped.
    const t = resolveTokens({ secondary900: "#1c1917" });
    expect(t.secondary).toBe("#f4f4f5");
  });

  it("emits the secondary pair in both blocks", () => {
    const css = tokensToCss(
      resolveTokens({ v2: { secondary: "#4c1d95", darkSecondary: "#c4b5fd" } })
    );
    const darkIdx = css.indexOf(".dark {");
    expect(css.slice(0, darkIdx)).toContain("--secondary: #4c1d95;");
    expect(css.slice(darkIdx)).toContain("--secondary: #c4b5fd;");
  });

  it("no longer emits a cta variable", () => {
    const css = tokensToCss(resolveTokens({}));
    expect(css).not.toContain("--cta");
  });
});
/*
  index.css carries the same defaults as the LIGHT_DEFAULTS / DARK_DEFAULTS
  palettes, so an unbranded realm renders identically whether or not the
  <style> element is injected. The two are declared in different files and have
  drifted before, so every variable is pinned here in both directions.

  This used to be scoped to the cta pair only, because tokensToCss derived
  several surfaces with color-mix() where index.css carried a static
  approximation. Now that each token resolves per mode, the emitted CSS and the
  stylesheet are directly comparable and the whole palette is checked.
*/
describe("index.css / default palette parity", () => {
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

  /** `primaryForeground` -> `--primary-foreground`. */
  const cssVar = (token: string) =>
    `--${token.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`;

  it("emits exactly what index.css declares when nothing is branded", () => {
    const emitted = tokensToCss(resolveTokens({}));
    const emittedLight = emitted.slice(0, emitted.indexOf(".dark {"));
    const emittedDark = emitted.slice(emitted.indexOf(".dark {"));

    for (const [token, value] of Object.entries(LIGHT_DEFAULTS)) {
      const decl = `${cssVar(token)}: ${value};`;
      expect(block(":root {"), decl).toContain(decl);
      expect(emittedLight, decl).toContain(decl);
    }
    for (const [token, value] of Object.entries(DARK_DEFAULTS)) {
      const decl = `${cssVar(token)}: ${value};`;
      expect(block(".dark {"), decl).toContain(decl);
      expect(emittedDark, decl).toContain(decl);
    }
  });

  it("declares the default radius", () => {
    expect(block(":root {")).toContain(`--radius: ${DEFAULT_RADIUS};`);
    expect(tokensToCss(resolveTokens({}))).toContain(
      `--radius: ${DEFAULT_RADIUS};`
    );
  });

  it("no longer carries a cta pair in either direction", () => {
    expect(css).not.toContain("--cta");
    expect(tokensToCss(resolveTokens({}))).not.toContain("--cta");
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

  it("derives the sidebar family from the tokens it shadows", () => {
    // The sidebar has no tokens of its own: it is a recessed surface reusing
    // muted, with border as its hover tint and primary for active/focus.
    const t = resolveTokens({});
    const emitted = tokensToCss(t);
    const light = emitted.slice(0, emitted.indexOf(".dark {"));
    expect(light).toContain(`--sidebar: ${t.muted};`);
    expect(light).toContain(`--sidebar-foreground: ${t.foreground};`);
    expect(light).toContain(`--sidebar-primary: ${t.primary};`);
    expect(light).toContain(`--sidebar-accent: ${t.border};`);
    expect(light).toContain(`--sidebar-ring: ${t.ring};`);
  });

  it("moves the sidebar when the tokens it shadows are branded", () => {
    const emitted = tokensToCss(
      resolveTokens({ v2: { muted: "#ede9fe", primary: "#4c1d95" } })
    );
    const light = emitted.slice(0, emitted.indexOf(".dark {"));
    expect(light).toContain("--sidebar: #ede9fe;");
    expect(light).toContain("--sidebar-primary: #4c1d95;");
    expect(light).toContain("--sidebar-ring: #4c1d95;");
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
  it("reads dark surfaces from their own tokens, not from darkBackground", () => {
    // These used to be synthesised by lifting darkBackground with color-mix(),
    // because there was no dark token set to read. There is now, so a realm that
    // sets only darkBackground leaves the other dark surfaces on their defaults
    // rather than dragging them along.
    const css = tokensToCss(resolveTokens({ v2: { darkBackground: "#f5f5f5" } }));
    const dark = css.slice(css.indexOf(".dark {"));
    expect(css).not.toContain("color-mix");
    expect(dark).toContain("--background: #f5f5f5;");
    expect(dark).toContain(`--muted: ${DARK_DEFAULTS.muted};`);
    expect(dark).toContain(`--border: ${DARK_DEFAULTS.border};`);
  });

  it("emits realm-set dark surfaces into the dark block only", () => {
    const css = tokensToCss(
      resolveTokens({ v2: { darkMuted: "#1e293b", darkBorder: "#334155" } })
    );
    const root = css.slice(css.indexOf(":root {"), css.indexOf(".dark {"));
    const dark = css.slice(css.indexOf(".dark {"));
    expect(dark).toContain("--muted: #1e293b;");
    expect(dark).toContain("--border: #334155;");
    expect(root).toContain(`--muted: ${LIGHT_DEFAULTS.muted};`);
    expect(root).toContain(`--border: ${LIGHT_DEFAULTS.border};`);
  });

  it("omits --font-sans unless the realm set a font", () => {
    expect(tokensToCss(resolveTokens({}))).not.toContain("--font-sans");
    const branded = tokensToCss(
      resolveTokens({ v2: { fontFamily: '"Inter", sans-serif' } })
    );
    expect(branded).toContain('--font-sans: "Inter", sans-serif;');
  });

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
  /*
    --cta is one of the few variables whose value differs between the two
    blocks (the CTA inverts in dark mode), so asserting it is present is not
    enough: each block must carry its own pair.
  */
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
