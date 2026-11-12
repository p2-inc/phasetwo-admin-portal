import i18next, { type TFunction } from "i18next";
import { beforeAll, describe, expect, it } from "vitest";
import { resolveClientName } from "./client-name";

let t: TFunction;

beforeAll(async () => {
  const i18n = i18next.createInstance();
  await i18n.init({
    lng: "en",
    resources: {
      en: {
        translation: {
          "client_account-console": "Account Console",
        },
      },
    },
  });
  t = i18n.t;
});

describe("resolveClientName", () => {
  it("translates a ${key} bundle reference", () => {
    expect(
      resolveClientName(
        {
          clientId: "account-console",
          clientName: "${client_account-console}",
        },
        t,
      ),
    ).toBe("Account Console");
  });

  it("falls back to clientId for an unknown bundle reference", () => {
    expect(
      resolveClientName(
        { clientId: "my-app", clientName: "${client_my-app}" },
        t,
      ),
    ).toBe("my-app");
  });

  it("shows a plain-text name as-is", () => {
    expect(
      resolveClientName({ clientId: "my-app", clientName: "My App: Prod" }, t),
    ).toBe("My App: Prod");
  });

  it("does not treat a plain name that matches a translation key as a key", () => {
    expect(
      resolveClientName(
        { clientId: "x", clientName: "client_account-console" },
        t,
      ),
    ).toBe("client_account-console");
  });

  it.each([undefined, "", "   "])(
    "uses clientId when the name is %j",
    (clientName) => {
      expect(resolveClientName({ clientId: "my-app", clientName }, t)).toBe(
        "my-app",
      );
    },
  );

  it("returns an empty string when there is no name or clientId", () => {
    expect(resolveClientName({}, t)).toBe("");
  });
});
