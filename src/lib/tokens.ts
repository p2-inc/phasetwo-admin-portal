/**
 * The brand-token vocabulary, shared verbatim with the login theme and the
 * control-plane editor.
 *
 * Deliberately its own module with no imports: `config.ts` reads a global the
 * Keycloak template injects at module scope, so anything importing a *runtime*
 * value from it inherits that dependency and cannot be loaded in isolation. The
 * token list is needed at runtime by the resolver, so it lives here instead and
 * `config.ts` takes only the types, which erase at compile time.
 *
 * Kept in the same order as `LoginThemeCss.BASE_TOKENS` + `DERIVED_FROM` in the
 * keycloak-themes extension, so every surface resolves the same attribute to the
 * same value.
 */

/** The nine tokens carrying a static default. */
export const BASE_TOKENS = [
  "background",
  "foreground",
  "primary",
  "primaryForeground",
  "secondary",
  "secondaryForeground",
  "muted",
  "mutedForeground",
  "border",
] as const;

export type BaseToken = (typeof BASE_TOKENS)[number];

/** Tokens with no static default: they derive from a base token when unset. */
export const DERIVED_TOKENS = [
  "card",
  "cardForeground",
  "accent",
  "accentForeground",
  "input",
  "ring",
] as const;

export type DerivedToken = (typeof DERIVED_TOKENS)[number];

export const PORTAL_COLOR_TOKENS = [
  ...BASE_TOKENS,
  ...DERIVED_TOKENS,
] as const;

export type PortalColorToken = BaseToken | DerivedToken;

/** `primary` -> `darkPrimary`. */
export type PortalDarkColorToken = `dark${Capitalize<PortalColorToken>}`;

export type PortalThemeTokenName =
  | PortalColorToken
  | PortalDarkColorToken
  | "radius"
  | "fontFamily";

export const darkTokenName = (token: PortalColorToken): PortalDarkColorToken =>
  `dark${token.charAt(0).toUpperCase()}${token.slice(1)}` as PortalDarkColorToken;
