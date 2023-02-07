import Layout from "@/components/layouts/layout";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

import { KeycloakClient, KeycloakService } from '../services/keycloak.service';
import { KeycloakContext } from '../services/KeycloakContext';
import { AccountServiceClient } from '../services/account.service';
import { AccountServiceContext } from '../services/AccountServiceContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

/*
import Keycloak, { KeycloakLoginOptions } from "keycloak-js";

//declare const keycloak: KeycloakClient;
const keycloak = new Keycloak('keycloak.json');

export default function App({ Component, pageProps }: AppProps) {
  const keycloakService = new KeycloakService(keycloak);
  return (
    <KeycloakContext.Provider value={keycloakService}>
      <AccountServiceContext.Provider value={new AccountServiceClient(keycloakService)}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AccountServiceContext.Provider>
    </KeycloakContext.Provider>
  );
}


*/