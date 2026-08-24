import { config } from "@/config";
import { resolveTokens, tokensToCss } from "@/lib/theme";

/**
 * Applies realm branding: resolves theme tokens from config.env.styles
 * (v2 attributes -> legacy attributes -> defaults) and mounts a single
 * <style> element in <head> that overrides the CSS variables defined in
 * src/index.css. Realm custom CSS is appended last so it wins over both.
 *
 * Call this synchronously before the first render. config.env.styles is
 * populated at module load (from the Freemarker-injected `environment`
 * global), so branding must not wait on the Keycloak round-trip — doing so
 * paints the whole auth flow in default Phase Two blue and then flashes to
 * the realm's brand. Idempotent: repeat calls rewrite the same element.
 */
export function applyTheme(): void {
  const { styles } = config.env;

  let css = tokensToCss(resolveTokens(styles));
  if (styles?.customCSS) {
    css += `\n${styles.customCSS}`;
  }

  const existing = document.getElementById("portal-theme");
  if (existing) {
    existing.textContent = css;
    return;
  }

  const styleElement = document.createElement("style");
  styleElement.id = "portal-theme";
  styleElement.textContent = css;
  document.head.appendChild(styleElement);
}
