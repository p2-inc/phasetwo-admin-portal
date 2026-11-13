import { describe, expect, it, vi } from "vitest";
import { fetchRealmMessages, pickRealmMessages } from "./realm-messages";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status });

describe("pickRealmMessages", () => {
  it("keeps only keys the realm overrides", () => {
    expect(
      pickRealmMessages(
        [
          { key: "my_client", value: "My Client" },
          { key: "client_account", value: "Account" },
        ],
        [
          { key: "my_client", value: "My Client", source: "REALM" },
          { key: "client_account", value: "Account", source: "THEME" },
        ],
      ),
    ).toEqual({ my_client: "My Client" });
  });

  it("takes the value Keycloak resolved for the locale, not a fallback locale's", () => {
    expect(
      pickRealmMessages(
        [{ key: "my_client", value: "Mon client" }],
        [
          { key: "my_client", value: "My Client", source: "REALM" },
          { key: "my_client", value: "Mon client", source: "REALM" },
        ],
      ),
    ).toEqual({ my_client: "Mon client" });
  });

  it("returns nothing when the realm has no overrides", () => {
    expect(
      pickRealmMessages(
        [{ key: "client_account", value: "Account" }],
        [{ key: "client_account", value: "Account", source: "THEME" }],
      ),
    ).toEqual({});
  });
});

describe("fetchRealmMessages", () => {
  it("loads the realm's texts for the locale from Keycloak's resources endpoint", async () => {
    const fetchFn = vi.fn(async (url: string | URL | Request) =>
      String(url).endsWith("?source=true")
        ? json([{ key: "my_client", value: "x", source: "REALM" }])
        : json([{ key: "my_client", value: "Mon client" }]),
    );

    await expect(
      fetchRealmMessages({
        authServerUrl: "https://kc.example/auth",
        realm: "my realm",
        locale: "fr",
        fetchFn,
      }),
    ).resolves.toEqual({ my_client: "Mon client" });

    expect(fetchFn.mock.calls.map(([url]) => url).sort()).toEqual([
      "https://kc.example/auth/resources/my%20realm/account/fr",
      "https://kc.example/auth/resources/my%20realm/account/fr?source=true",
    ]);
  });

  it("rejects when Keycloak returns an error", async () => {
    await expect(
      fetchRealmMessages({
        authServerUrl: "https://kc.example/",
        realm: "r",
        locale: "en",
        fetchFn: async () => json({}, 404),
      }),
    ).rejects.toThrow("404");
  });
});
