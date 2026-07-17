> :rocket: **Try it for free** in Phase Two's [Keycloak as a service](https://phasetwo.io/dashboard/?utm_source=github&utm_medium=readme&utm_campaign=admin-portal).

# Phase Two Admin Portal

More self-serve. More better.

The Phase Two Admin Portal ties together functionality from the Keycloak Account Console and [Phase Two Organizations](https://github.com/p2-inc/keycloak-orgs) to allow your customers' users to self-manage as much of their account and organization functionality as is possible.

The Portal is deployed as a Keycloak extension, much like the Account Console, and is available at `https://{host}/{relative-path}/realms/{realm}/portal/`. Note that we are considering making this a drop-in replacement for the Account Console that can be selected simply in _Realm Settings_->_Themes_, but this would make it impossible to use both at the same time.

![ezgif-4-811bfaae78](https://user-images.githubusercontent.com/244253/235351276-85504b5a-a669-4dc1-950d-5881dd20c926.gif)

## Quick start

The easiest way to get started is our [Docker image](https://quay.io/repository/phasetwo/phasetwo-keycloak?tab=tags). Documentation and examples for using it are in the [phasetwo-containers](https://github.com/p2-inc/phasetwo-containers) repo. The most recent version of this extension is included.

```bash
docker run --name phasetwo_test --rm -p 8080:8080 \
    -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin -e KC_HTTP_RELATIVE_PATH=/auth \
    quay.io/phasetwo/phasetwo-keycloak:$VERSION \
    start-dev --spi-email-template-provider=freemarker-plus-mustache --spi-email-template-freemarker-plus-mustache-enabled=true
```

## Configuration

### Requirements

Because this extension relies on the APIs provided by the [keycloak-orgs](https://github.com/p2-inc/keycloak-orgs) extension, it is required to deploy them in the same Keycloak.

### Visibility

Most of the visibility of functionality in the Portal is controlled by user permissions. However, it is also possible to control visibility through Realm Attributes. These attributes may be set manually, or by using the [Phase Two extensions to the Keycloak Admin UI](https://github.com/p2-inc/keycloak-ui/) (**Styles**->_Portal_ tab), which must also be installed in the same Keycloak.

![image](https://github.com/p2-inc/phasetwo-admin-portal/assets/93841792/a4977fe4-40ab-4c33-9e5c-790a60dd1f4a.png)

When setting the attributes manually, the values are:
| Key | Description | Default |
|---|---|---|
| `_providerConfig.portal.profile.enabled` | Profile section (whole) | `true` |
| `_providerConfig.portal.profile.password.enabled` | Password update | `true` |
| `_providerConfig.portal.profile.twofactor.enabled` | 2fa create/update | `true` |
| `_providerConfig.portal.profile.activity.enabled` | Device activity | `true` |
| `_providerConfig.portal.profile.linked.enabled` | Linked accounts | `true` |
| `_providerConfig.portal.org.enabled` | Organizations section (whole) | `true` |
| `_providerConfig.portal.org.details.enabled` | Details edit | `true` |
| `_providerConfig.portal.org.members.enabled` | Members list | `true` |
| `_providerConfig.portal.org.invitations.enabled` | Invitations | `true` |
| `_providerConfig.portal.org.domains.enabled` | Domains | `true` |
| `_providerConfig.portal.org.sso.enabled` | SSO (requires idp-wizard extension) | `true` |
| `_providerConfig.portal.org.events.enabled` | Events | `true` |
| `_providerConfig.portal.org.attributes.enabled` | Attributes editor (organization settings) | `true` |

### Style

It is also possible to add branding to the portal. It is recommended these, along with logos, are set through the [Phase Two extensions to the Keycloak Admin UI](https://github.com/p2-inc/keycloak-ui/), as there are other options there that are reused in Login forms styling, and the UI extensions also ensure that the attributes are set with appropriate values.

The Portal is built on [shadcn/ui](https://ui.shadcn.com/) components that read their colors from CSS variables. Realm branding is applied at runtime by resolving a small set of theme tokens and injecting a `<style>` element that overwrites those variables (defaults live in [src/index.css](src/index.css), resolution logic in [src/lib/theme.ts](src/lib/theme.ts)).

#### Theme tokens (recommended)

Each token is set with the `_providerConfig.assets.portal.v2.` prefix, e.g. `_providerConfig.assets.portal.v2.primary`. Colors are `#rgb`/`#rrggbb` hex values.

| Key | Drives | Legacy fallback | Default |
|---|---|---|---|
| `_providerConfig.assets.portal.v2.primary` | `--primary`, `--ring` | `primaryColor700` | `#1570c2` |
| `_providerConfig.assets.portal.v2.primaryForeground` | `--primary-foreground` | _(none)_ | auto-contrast of `primary` |
| `_providerConfig.assets.portal.v2.cta` | `--cta` | `secondaryColor900` | `#252627` |
| `_providerConfig.assets.portal.v2.ctaForeground` | `--cta-foreground` | _(none)_ | auto-contrast of `cta` |
| `_providerConfig.assets.portal.v2.background` | `--background`, `--card`, `--popover` | _(none)_ | `#ffffff` |
| `_providerConfig.assets.portal.v2.foreground` | `--foreground`, `--card-foreground`, `--popover-foreground` | _(none)_ | `#09090b` |
| `_providerConfig.assets.portal.v2.muted` | `--muted`, `--secondary`, `--accent` | _(none)_ | `#f4f4f5` |
| `_providerConfig.assets.portal.v2.border` | `--border`, `--input` | _(none)_ | `#e4e4e7` |
| `_providerConfig.assets.portal.v2.radius` | `--radius` | _(none)_ | `0.5rem` |
| `_providerConfig.assets.portal.v2.darkBackground` | `--background`, `--card`, `--popover` (dark mode) | _(none)_ | `#09090b` |
| `_providerConfig.assets.portal.v2.darkForeground` | `--foreground` (dark mode) | _(none)_ | `#fafafa` |
| `_providerConfig.assets.portal.v2.darkCta` | `--cta` (dark mode) | _(none)_ | `#ffffff` |
| `_providerConfig.assets.portal.v2.darkCtaForeground` | `--cta-foreground` (dark mode) | _(none)_ | auto-contrast of `darkCta` |

`cta` is the neutral emphasized action button — black in light mode, white in dark mode by default — distinct from the brand-colored `primary`. Its hover state is derived from the token itself (`bg-cta/90`) rather than from a separate shade.

If a foreground token (`primaryForeground`, `ctaForeground`, `darkCtaForeground`) is not set, a readable near-black or white is computed from the relative luminance of its background token (`primary`, `cta`, `darkCta` respectively). Related variables such as `--muted-foreground` are derived from the tokens above.

#### Legacy keys

These keys are built off of the [Tailwind color](https://tailwindcss.com/docs/customizing-colors) formatting, with the lowest color being lightest and the highest being darkest. They are preserved for compatibility and remain readable, but only `primaryColor700` and `secondaryColor900` still have an effect on the portal: they are the fallbacks for the `primary` and `cta` tokens when `v2.primary` / `v2.cta` are not set. The rest are accepted and ignored — see [Precedence](#precedence). Realms that want custom surfaces (background, foreground, muted, dark mode) must set the `v2` tokens above.

| Key | Description | Default |
|---|---|---|
| `_providerConfig.assets.portal.primaryColor100` | Primary color - 100 | `[empty]` |
| `_providerConfig.assets.portal.primaryColor200` | Primary color - 200 | `[empty]` |
| `_providerConfig.assets.portal.primaryColor400` | Primary color - 400 | `[empty]` |
| `_providerConfig.assets.portal.primaryColor500` | Primary color - 500 | `[empty]` |
| `_providerConfig.assets.portal.primaryColor600` | Primary color - 600 | `[empty]` |
| `_providerConfig.assets.portal.primaryColor700` | Primary color - 700 | `[empty]` |
| `_providerConfig.assets.portal.primaryColor900` | Primary color - 900 | `[empty]` |
| `_providerConfig.assets.portal.secondaryColor800` | Secondary color - 800 | `[empty]` |
| `_providerConfig.assets.portal.secondaryColor900` | Secondary color - 900 | `[empty]` |
| `_providerConfig.assets.portal.css` | CSS override | `[empty]` |

#### Precedence

Every token resolves independently, in this order:

1. the `v2` attribute, if set;
2. otherwise, for `primary` and `cta` only, the matching legacy key — `primaryColor700` and `secondaryColor900` respectively — if set;
3. otherwise the built-in default.

`primary` and `cta` are the only tokens with a legacy fallback. Every other legacy key — `primaryColor100`, `primaryColor200`, `primaryColor400`, `primaryColor500`, `primaryColor600`, `primaryColor900`, and `secondaryColor800` — is still read from the realm attributes but no longer affects rendering: in the pre-shadcn portal those keys styled incidental details (a dropdown ring offset, a search icon, a modal tint) rather than surfaces, so promoting them to `--background`/`--foreground` would repaint the whole page with a color that never had that role. `secondaryColor800` is ignored for a different reason: it was the CTA button's hover shade, and the hover is now derived from `cta` itself. A realm that wants custom surfaces sets the `v2` tokens explicitly.

#### Custom CSS

`_providerConfig.assets.portal.css` is appended last, after the generated variables, so it overrides both the tokens and the built-in defaults. Target the CSS variables or standard selectors:

```css
:root {
  --primary: #7c3aed;
  --radius: 0.25rem;
}
.dark {
  --background: #0b1923;
}
```

> **Breaking change.** Custom CSS that targeted the old generated utility classes — `.bg-primary-700`, `.text-primary-500`, `.bg-primary-gradient`, and friends — no longer has any effect, because components now use semantic shadcn/ui classes (`bg-primary`, `text-muted-foreground`, …). Migrate that CSS to the variables above. Realms that customized `primaryColor100` or `primaryColor900` will see neutral surfaces after upgrading — their brand primary is preserved via `primaryColor700`, and their CTA button color via `secondaryColor900` — so set the matching `v2` tokens to restore custom surfaces.

## Developers

### Getting Started

First, setup:

```bash
yarn
```

Then, start a Keycloak server (use hosted [Phase Two](https://phasetwo.io/dashboard/) for easy testing), create a public OIDC client with `http://localhost:3000` Root URL, and update the `public/keycloak.json` file with the client config.

Also update the `initialEnvironment` object in [src/config.ts](src/config.ts) to reflect your local configuration. This fallback config is used when a runtime `environment` object is not injected, so values such as `realm`, `authServerUrl`, `baseUrl`, and `supportedLocales` should match your setup.

Finally, run the development server:

```bash
yarn dev
```

You mill most likely need to use the fully qualified portal url [http://localhost:3000/auth/realms/master/portal](http://localhost:3000/auth/realms/master/portal).

### Build the extension

```bash
mvn clean package
```

Put the jar in `target/admin-portal-{version}.jar` in the `providers/` directory of your Keycloak distribution.

### Code formatting

The build enforces Google Java formatting standards via [Spotless](https://github.com/diffplug/spotless). Use `mvn spotless:check` to verify formatting and `mvn spotless:apply` to fix it.

To enforce formatting automatically before every push, install the provided git pre-push hook:

```
mvn spotless:install-git-pre-push-hook
```

When you push, the hook runs `spotless:check`. If violations are found, it automatically runs `spotless:apply`, aborts the push, and lets you review and commit the formatted files before retrying.

---

All documentation, source code and other files in this repository are Copyright 2023 Phase Two, Inc.
