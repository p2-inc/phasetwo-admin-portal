export type RealmMessages = Record<string, string>;

type KeySource = {
  key: string;
  value: string;
  source?: "THEME" | "REALM";
};

type FetchRealmMessagesOptions = {
  /** Keycloak base URL, such as `https://host/auth/`. */
  authServerUrl: string;
  realm: string;
  locale: string;
  fetchFn?: typeof fetch;
};

const getJson = async (
  url: string,
  fetchFn: typeof fetch,
): Promise<KeySource[]> => {
  const response = await fetchFn(url, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(`${response.status} loading ${url}`);
  }
  return response.json();
};

/**
 * Keep only the messages the realm overrides.
 *
 * `sourced` (from `?source=true`) says which keys have a realm override, but
 * it lists one entry per locale in the fallback chain in no particular order,
 * so its values can't be trusted. `resolved` holds the value Keycloak picks
 * for the locale after applying that chain.
 */
export const pickRealmMessages = (
  resolved: KeySource[],
  sourced: KeySource[],
): RealmMessages => {
  const realmKeys = new Set(
    sourced.filter((m) => m.source === "REALM").map((m) => m.key),
  );
  const messages: RealmMessages = {};
  for (const { key, value } of resolved) {
    if (realmKeys.has(key) && typeof value === "string") {
      messages[key] = value;
    }
  }
  return messages;
};

/**
 * Load the realm's localization texts (Realm settings > Localization > Realm
 * overrides) for a locale.
 *
 * This uses the public endpoint Keycloak's own account console loads its
 * messages from, so it exposes nothing that Keycloak doesn't already.
 */
export const fetchRealmMessages = async ({
  authServerUrl,
  realm,
  locale,
  fetchFn = fetch,
}: FetchRealmMessagesOptions): Promise<RealmMessages> => {
  const base = authServerUrl.endsWith("/")
    ? authServerUrl
    : `${authServerUrl}/`;
  const url = `${base}resources/${encodeURIComponent(
    realm,
  )}/account/${encodeURIComponent(locale)}`;
  const [resolved, sourced] = await Promise.all([
    getJson(url, fetchFn),
    getJson(`${url}?source=true`, fetchFn),
  ]);
  return pickRealmMessages(resolved, sourced);
};
