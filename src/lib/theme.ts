
import { Environment, PortalThemeTokenName } from "@/config";

export type PortalStyles = Environment["styles"];

/**
 * Built from the same union that types `styles.v2`, so a token can never
 * exist here without being a settable v2 attribute (and vice versa).
 */
export type ThemeTokens = Record<PortalThemeTokenName, string>;

/**
 * The foregrounds that always derive from their own background — rather than
 * standing alone as a default pair — are absent here and resolved by
 * contrast: primaryForeground, ctaForeground, darkCtaForeground.
 */
export const DEFAULT_TOKENS: Omit<
  ThemeTokens,
  "primaryForeground" | "ctaForeground" | "darkCtaForeground"
> = {
  primary: "#1570c2",
  cta: "#252627",
  background: "#ffffff",
  foreground: "#09090b",
  muted: "#f4f4f5",
  border: "#e4e4e7",
  radius: "0.5rem",
  darkBackground: "#09090b",
  darkForeground: "#fafafa",
  darkCta: "#ffffff",
};

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
 * Per token: v2 attribute -> legacy derivation -> built-in default.
 * Only `primary` (primaryColor700) and `cta` (secondaryColor900) derive from
 * a legacy key — see the note at the top of this file. All other legacy keys
 * are ignored. A value that fails validation is treated as unset.
 *
 * Each foreground auto-contrasts against its own background when the realm
 * set that background but left the text color unset — otherwise a lone
 * v2.background="#111827" would keep the default near-black foreground at
 * 1.12:1. The built-in defaults are already contrasting pairs, so the
 * derivation only kicks in for an explicitly set background; a background
 * that fails validation is unset, and its default pair still holds.
 * See derivedForeground for why only hex backgrounds are derived from.
 */
export function resolveTokens(styles: PortalStyles | undefined): ThemeTokens {
  const s = styles ?? {};
  const v2 = s.v2 ?? {};

  const primary = pick(
    isColor,
    v2.primary,
    s.primary700,
    DEFAULT_TOKENS.primary
  );
  const cta = pick(isColor, v2.cta, s.secondary900, DEFAULT_TOKENS.cta);
  const darkCta = pick(isColor, v2.darkCta, DEFAULT_TOKENS.darkCta);
  const setBackground = pick(isColor, v2.background);
  const setDarkBackground = pick(isColor, v2.darkBackground);
  const background = pick(isColor, setBackground, DEFAULT_TOKENS.background);
  const darkBackground = pick(
    isColor,
    setDarkBackground,
    DEFAULT_TOKENS.darkBackground
  );
  return {
    primary,
    primaryForeground: pick(
      isColor,
      v2.primaryForeground,
      contrastForeground(primary)
    ),
    cta,
    ctaForeground: pick(isColor, v2.ctaForeground, contrastForeground(cta)),
    background,
    foreground: pick(
      isColor,
      v2.foreground,
      derivedForeground(setBackground),
      DEFAULT_TOKENS.foreground
    ),
    muted: pick(isColor, v2.muted, DEFAULT_TOKENS.muted),
    border: pick(isColor, v2.border, DEFAULT_TOKENS.border),
    radius: pick(isLength, v2.radius, DEFAULT_TOKENS.radius),
    darkBackground,
    darkForeground: pick(
      isColor,
      v2.darkForeground,
      derivedForeground(setDarkBackground),
      DEFAULT_TOKENS.darkForeground
    ),
    darkCta,
    darkCtaForeground: pick(
      isColor,
      v2.darkCtaForeground,
      contrastForeground(darkCta)
    ),
  };
}

/**
 * Emit CSS variable definitions for the resolved tokens. The variable
 * names/derivations mirror the defaults in src/index.css; when every token
 * is at its default the visual result is identical to no injection.
 *
 * The dark surfaces lift `darkBackground` toward its own contrasting color
 * rather than toward a literal `white`: a realm may set darkBackground to a
 * light value, and mixing that toward white would collapse every surface
 * onto the background (#f5f5f5 -> #f6f6f6, 1.01:1). Against the default dark
 * base this still resolves to white, so the emitted CSS is unchanged.
 * The *-foreground mixes need no such fix — they are already expressed
 * against their own token pair rather than a literal.
 *
 * The --sidebar-* family is derived from the tokens above rather than from
 * v2 attributes of its own: the sidebar is a recessed surface, so it reuses
 * `muted` (the dark surface mix in dark mode) with `border` as its hover
 * tint, and takes the brand `primary` for its active item and focus ring.
 * A realm therefore brands the sidebar by branding primary/muted/border,
 * and the token set stays pared down.
 */
export function tokensToCss(t: ThemeTokens): string {
  const darkContrast = contrastForeground(t.darkBackground);
  const darkSurface = `color-mix(in srgb, ${t.darkBackground} 88%, ${darkContrast})`;
  return `:root {
  --background: ${t.background};
  --foreground: ${t.foreground};
  --card: ${t.background};
  --card-foreground: ${t.foreground};
  --popover: ${t.background};
  --popover-foreground: ${t.foreground};
  --primary: ${t.primary};
  --primary-foreground: ${t.primaryForeground};
  --cta: ${t.cta};
  --cta-foreground: ${t.ctaForeground};
  --secondary: ${t.muted};
  --secondary-foreground: ${t.foreground};
  --muted: ${t.muted};
  --muted-foreground: color-mix(in srgb, ${t.foreground} 55%, ${t.background});
  --accent: ${t.muted};
  --accent-foreground: ${t.foreground};
  --border: ${t.border};
  --input: ${t.border};
  --ring: ${t.primary};
  --radius: ${t.radius};
  --sidebar: ${t.muted};
  --sidebar-foreground: ${t.foreground};
  --sidebar-primary: ${t.primary};
  --sidebar-primary-foreground: ${t.primaryForeground};
  --sidebar-accent: ${t.border};
  --sidebar-accent-foreground: ${t.foreground};
  --sidebar-border: ${t.border};
  --sidebar-ring: ${t.primary};
}
.dark {
  --background: ${t.darkBackground};
  --foreground: ${t.darkForeground};
  --card: ${t.darkBackground};
  --card-foreground: ${t.darkForeground};
  --popover: ${t.darkBackground};
  --popover-foreground: ${t.darkForeground};
  --primary: ${t.primary};
  --primary-foreground: ${t.primaryForeground};
  --cta: ${t.darkCta};
  --cta-foreground: ${t.darkCtaForeground};
  --secondary: ${darkSurface};
  --secondary-foreground: ${t.darkForeground};
  --muted: ${darkSurface};
  --muted-foreground: color-mix(in srgb, ${t.darkForeground} 65%, ${t.darkBackground});
  --accent: ${darkSurface};
  --accent-foreground: ${t.darkForeground};
  --border: ${darkSurface};
  --input: ${darkSurface};
  --ring: ${t.primary};
  --sidebar: ${darkSurface};
  --sidebar-foreground: ${t.darkForeground};
  --sidebar-primary: ${t.primary};
  --sidebar-primary-foreground: ${t.primaryForeground};
  --sidebar-accent: ${darkSurface};
  --sidebar-accent-foreground: ${t.darkForeground};
  --sidebar-border: ${darkSurface};
  --sidebar-ring: ${t.primary};
}
`;
}
