
import type { Environment } from "@/config";
import {
  BASE_TOKENS,
  darkTokenName,
  DERIVED_TOKENS,
  PORTAL_COLOR_TOKENS,
  type BaseToken,
  type DerivedToken,
  type PortalColorToken,
  type PortalThemeTokenName,
} from "@/lib/tokens";

export type PortalStyles = Environment["styles"];

/**
 * Built from the same union that types `styles.v2`, so a token can never
 * exist here without being a settable v2 attribute (and vice versa).
 */
export type ThemeTokens = Record<PortalThemeTokenName, string>;

/**
 * Derivation is a fallback, not a lock: a surface uses the explicit token when the
 * realm set it, and otherwise computes it from the base token named here. This is
 * what keeps a lone custom `primary` moving the focus ring, and a lone custom
 * `background` moving the card surface.
 */
export const DERIVED_FROM: Record<DerivedToken, BaseToken> = {
  card: "background",
  cardForeground: "foreground",
  accent: "muted",
  accentForeground: "foreground",
  input: "border",
  ring: "primary",
};

/**
 * Brand colour is mode-independent: when the realm sets one of these for light and
 * leaves the dark override unset, dark mode inherits the light value rather than
 * dropping back to the stock dark palette. Surface and neutral tokens never inherit
 * — a light background must not light up dark mode.
 */
const BRAND_TOKENS: readonly BaseToken[] = ["primary", "secondary"];

/** Base-token defaults for light mode. */
export const LIGHT_DEFAULTS: Record<BaseToken, string> = {
  background: "#ffffff",
  foreground: "#09090b",
  primary: "#1570c2",
  primaryForeground: "#ffffff",
  secondary: "#f4f4f5",
  secondaryForeground: "#18181b",
  muted: "#f4f4f5",
  mutedForeground: "#71717a",
  border: "#e4e4e7",
};

/** Base-token defaults for dark mode. */
export const DARK_DEFAULTS: Record<BaseToken, string> = {
  background: "#09090b",
  foreground: "#fafafa",
  primary: "#1570c2",
  primaryForeground: "#ffffff",
  secondary: "#27272a",
  secondaryForeground: "#fafafa",
  muted: "#27272a",
  mutedForeground: "#a1a1aa",
  border: "#27272a",
};

export const DEFAULT_RADIUS = "0.5rem";

/** Parse #rgb or #rrggbb into [r, g, b]; null for anything else. */
function parseHex(color: string): [number, number, number] | null {
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(color.trim());
  if (!m) return null;
  let hex = m[1];
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  }
  return [
    parseInt(hex.slice(0, 2), 16),
    parseInt(hex.slice(2, 4), 16),
    parseInt(hex.slice(4, 6), 16),
  ];
}

/** WCAG relative luminance, 0 (black) to 1 (white). */
function relativeLuminance([r, g, b]: [number, number, number]): number {
  const [lr, lg, lb] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
}

/** Readable foreground (near-black or white) for the given background. */
export function contrastForeground(background: string): string {
  const rgb = parseHex(background);
  // Non-hex (e.g. a CSS color function) — assume a dark brand color.
  if (!rgb) return "#ffffff";
  return relativeLuminance(rgb) >= 0.5 ? "#18181b" : "#ffffff";
}

/*
  Value validation.

  Token values come from realm attributes and are interpolated verbatim into
  a <style> element, so an unchecked value like `red}` closes the :root rule
  early and silently voids every declaration after it (including the whole
  .dark block). A value is only accepted when it matches one of the shapes
  below — none of which can carry `;`, `{`, `}`, `<` or a nested `(` — so a
  malformed attribute can never restructure the stylesheet.
*/

/** #rgb or #rrggbb — the documented format for realm color attributes. */
const HEX_COLOR = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

/** A bare CSS color keyword: `red`, `transparent`, `currentcolor`. */
const COLOR_KEYWORD = /^[a-z]+$/i;

/**
 * A single color function whose arguments are limited to numbers, units,
 * percentages and separators. `(` is excluded, so nothing can nest inside
 * (no var(), no url()); `*` and `\` are excluded, so no comments or escapes.
 */
const COLOR_FUNCTION =
  /^(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch)\([0-9a-z%.,+\-/ ]*\)$/i;

/** A CSS length for --radius: `0`, `4px`, `0.5rem`, `1em`. */
const CSS_LENGTH = /^(?:0|[0-9]*\.?[0-9]+(?:px|rem|em))$/;

function isColor(value: string): boolean {
  return (
    HEX_COLOR.test(value) ||
    COLOR_KEYWORD.test(value) ||
    COLOR_FUNCTION.test(value)
  );
}

function isLength(value: string): boolean {
  return CSS_LENGTH.test(value);
}

/**
 * Foreground derived from a background the realm set explicitly, or "" to
 * fall through to the built-in default.
 *
 * Only hex backgrounds are measurable: contrastForeground assumes "dark" for
 * anything else, which is a fair guess for a brand color but would put white
 * text on `white`. So a keyword/color-function background keeps the default
 * foreground rather than a guessed one.
 */
function derivedForeground(background: string): string {
  return HEX_COLOR.test(background) ? contrastForeground(background) : "";
}

/**
 * First candidate that is non-empty and passes `isValid`. A value that fails
 * validation is skipped exactly as if it were unset, falling through to the
 * legacy value or the built-in default — it never reaches the stylesheet.
 */
function pick(
  isValid: (value: string) => boolean,
  ...candidates: (string | undefined)[]
): string {
  for (const c of candidates) {
    const value = c?.trim();
    if (value && isValid(value)) return value;
  }
  return "";
}

/**
 * Resolve the effective theme tokens from realm styles.
 *
 * Per token, first valid candidate wins: the `theme.v2.*` attribute, then the one
 * legacy key that still maps (`primary` <- `primaryColor700`), then a derivation,
 * then the built-in default. A value that fails validation is treated as unset.
 *
 * The old `secondaryColor900` fallback is gone with `cta`: that token folded into
 * `primary`, so a realm that only ever customised it should set `theme.v2.primary`.
 * Every other legacy key styled incidental details and is ignored.
 *
 * Dark mode resolves independently against the dark defaults, except for the brand
 * tokens, which inherit their light value when the realm left the dark override
 * unset. Foregrounds auto-contrast against whatever their background resolved to,
 * including an inherited brand colour, so a pale brand never keeps white text.
 */
export function resolveTokens(styles: PortalStyles | undefined): ThemeTokens {
  const s = styles ?? {};
  const v2 = s.v2 ?? {};

  const attr = (token: PortalThemeTokenName): string | undefined => v2[token];

  /** One mode's colours. `lightExplicit` is set only when resolving dark. */
  function resolveMode(
    dark: boolean,
    lightExplicit?: Partial<Record<PortalColorToken, string>>
  ) {
    const defaults = dark ? DARK_DEFAULTS : LIGHT_DEFAULTS;
    const out = {} as Record<PortalColorToken, string>;
    const explicit: Partial<Record<PortalColorToken, string>> = {};

    for (const token of BASE_TOKENS) {
      const v = pick(isColor, attr(dark ? darkTokenName(token) : token));
      // `primary` keeps its one surviving legacy fallback.
      const legacy =
        !dark && token === "primary" ? pick(isColor, s.primary700) : "";
      let set = v || legacy;
      // Brand colour is mode-independent; read the light *explicit* value so an
      // all-default realm stays on the dark palette, and so the foreground below
      // contrasts against a value the realm actually chose.
      if (!set && dark && lightExplicit && BRAND_TOKENS.includes(token)) {
        set = lightExplicit[token] ?? "";
      }
      if (set) explicit[token] = set;
      out[token] = set || defaults[token];
    }

    // A foreground the realm left unset contrasts against its own background.
    //
    // The brand pairs use contrastForeground, which assumes a dark colour when
    // the value is not measurable hex -- a fair bet for a brand accent, and what
    // the login theme's resolver does too. `foreground` uses derivedForeground
    // instead, which declines to guess: backgrounds are usually light, so
    // assuming dark would put white text on `background: white`.
    for (const [fg, bg] of [
      ["primaryForeground", "primary"],
      ["secondaryForeground", "secondary"],
    ] as const) {
      if (!explicit[fg] && explicit[bg]) {
        out[fg] = contrastForeground(out[bg]);
      }
    }
    if (!explicit.foreground && explicit.background) {
      const derived = derivedForeground(out.background);
      if (derived) out.foreground = derived;
    }

    for (const token of DERIVED_TOKENS) {
      const from = DERIVED_FROM[token];
      const set = pick(isColor, attr(dark ? darkTokenName(token) : token));
      if (set) explicit[token] = set;
      out[token] = set || out[from];
    }

    return { out, explicit };
  }

  const light = resolveMode(false);
  const dark = resolveMode(true, light.explicit);

  const tokens = {} as ThemeTokens;
  for (const token of PORTAL_COLOR_TOKENS) {
    tokens[token] = light.out[token];
    tokens[darkTokenName(token) as keyof ThemeTokens] = dark.out[token];
  }
  tokens.radius = pick(isLength, attr("radius"), DEFAULT_RADIUS);
  tokens.fontFamily = (attr("fontFamily") ?? "").trim();
  return tokens;
}

/**
 * Emit CSS variable definitions for the resolved tokens. Names and derivations
 * mirror the defaults in src/index.css, so when every token is at its default the
 * result is identical to no injection at all.
 *
 * Every token now resolves per mode, so the dark block reads its own `dark*` values
 * instead of re-deriving surfaces from `darkBackground` with a colour-mix. The one
 * mix that remains is the `--sidebar` tint, which has no token of its own.
 *
 * The --sidebar-* family is derived rather than settable: the sidebar is a recessed
 * surface, so it reuses `muted` with `border` as its hover tint and takes `primary`
 * for its active item and focus ring. A realm brands the sidebar by branding
 * primary/muted/border, and the token set stays pared down.
 *
 * `--font-sans` is only emitted when the realm set a font, so an unset value leaves
 * the stylesheet's own stack alone rather than blanking it.
 */
export function tokensToCss(t: ThemeTokens): string {
  const block = (
    scope: string,
    c: {
      background: string;
      foreground: string;
      card: string;
      cardForeground: string;
      primary: string;
      primaryForeground: string;
      secondary: string;
      secondaryForeground: string;
      muted: string;
      mutedForeground: string;
      accent: string;
      accentForeground: string;
      border: string;
      input: string;
      ring: string;
    },
    extra = ""
  ) => `${scope} {
  --background: ${c.background};
  --foreground: ${c.foreground};
  --card: ${c.card};
  --card-foreground: ${c.cardForeground};
  --popover: ${c.card};
  --popover-foreground: ${c.cardForeground};
  --primary: ${c.primary};
  --primary-foreground: ${c.primaryForeground};
  --secondary: ${c.secondary};
  --secondary-foreground: ${c.secondaryForeground};
  --muted: ${c.muted};
  --muted-foreground: ${c.mutedForeground};
  --accent: ${c.accent};
  --accent-foreground: ${c.accentForeground};
  --border: ${c.border};
  --input: ${c.input};
  --ring: ${c.ring};
  --sidebar: ${c.muted};
  --sidebar-foreground: ${c.foreground};
  --sidebar-primary: ${c.primary};
  --sidebar-primary-foreground: ${c.primaryForeground};
  --sidebar-accent: ${c.border};
  --sidebar-accent-foreground: ${c.foreground};
  --sidebar-border: ${c.border};
  --sidebar-ring: ${c.ring};${extra}
}`;

  const light = {
    background: t.background,
    foreground: t.foreground,
    card: t.card,
    cardForeground: t.cardForeground,
    primary: t.primary,
    primaryForeground: t.primaryForeground,
    secondary: t.secondary,
    secondaryForeground: t.secondaryForeground,
    muted: t.muted,
    mutedForeground: t.mutedForeground,
    accent: t.accent,
    accentForeground: t.accentForeground,
    border: t.border,
    input: t.input,
    ring: t.ring,
  };

  const dark = {
    background: t.darkBackground,
    foreground: t.darkForeground,
    card: t.darkCard,
    cardForeground: t.darkCardForeground,
    primary: t.darkPrimary,
    primaryForeground: t.darkPrimaryForeground,
    secondary: t.darkSecondary,
    secondaryForeground: t.darkSecondaryForeground,
    muted: t.darkMuted,
    mutedForeground: t.darkMutedForeground,
    accent: t.darkAccent,
    accentForeground: t.darkAccentForeground,
    border: t.darkBorder,
    input: t.darkInput,
    ring: t.darkRing,
  };

  const extras =
    `\n  --radius: ${t.radius};` +
    (t.fontFamily ? `\n  --font-sans: ${t.fontFamily};` : "");

  return `${block(":root", light, extras)}
${block(".dark", dark)}
`;
}
