import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { config } from "@/config";
import { fetchRealmMessages, type RealmMessages } from "@/lib/realm-messages";

const NO_MESSAGES: RealmMessages = {};
const cache = new Map<string, Promise<RealmMessages>>();

const load = (locale: string): Promise<RealmMessages> => {
  let messages = cache.get(locale);
  if (!messages) {
    const { authServerUrl, realm } = config.env;
    messages = fetchRealmMessages({ authServerUrl, realm, locale }).catch(
      (err) => {
        console.warn("Unable to load realm localization texts", err);
        cache.delete(locale);
        return NO_MESSAGES;
      },
    );
    cache.set(locale, messages);
  }
  return messages;
};

/**
 * The realm's localization texts for the Portal's current language. Empty
 * until they load, and when they can't be loaded.
 */
export const useRealmMessages = (): RealmMessages => {
  const { i18n } = useTranslation();
  const locale = i18n.language;
  const [loaded, setLoaded] = useState<{
    locale: string;
    messages: RealmMessages;
  }>();

  useEffect(() => {
    if (!locale) return;
    let current = true;
    load(locale).then((messages) => {
      if (current) setLoaded({ locale, messages });
    });
    return () => {
      current = false;
    };
  }, [locale]);

  return loaded?.locale === locale ? loaded.messages : NO_MESSAGES;
};
