import type { TFunction } from "i18next";

const BUNDLE_REFERENCE = /^\$\{(.+)\}$/;

type ClientLike = {
  clientId?: string;
  clientName?: string;
};

/**
 * Resolve a human-readable label for a client returned by the Keycloak
 * account API.
 *
 * Keycloak returns the raw `client.getName()`, which may be:
 * - a message bundle reference such as `${client_account-console}`, which is
 *   unwrapped and looked up in the Portal's translations;
 * - plain text, which is shown as-is;
 * - empty, in which case the `clientId` is used.
 *
 * Bundle references that have no translation also fall back to `clientId`.
 */
export const resolveClientName = (
  client: ClientLike,
  t: TFunction,
): string => {
  const clientId = client.clientId ?? "";
  const name = client.clientName?.trim();
  if (!name) return clientId;

  const match = BUNDLE_REFERENCE.exec(name);
  if (!match) return name;

  const key = match[1]!;
  return t(key, { defaultValue: clientId || key });
};
