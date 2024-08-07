import Keycloak, { KeycloakLoginOptions } from "keycloak-js";

export class KeycloakService {
  private keycloakAuth: Keycloak;

  public constructor(keycloak: Keycloak) {
    this.keycloakAuth = keycloak;
  }

  public authenticated(): boolean {
    return this.keycloakAuth.authenticated
      ? this.keycloakAuth.authenticated
      : false;
  }

  public audiencePresent(): boolean {
    if (this.keycloakAuth.tokenParsed) {
      const audience = this.keycloakAuth.tokenParsed["aud"];
      return (
        audience === "account" ||
        (Array.isArray(audience) && audience.indexOf("account") >= 0)
      );
    }
    return false;
  }

  public login(options?: KeycloakLoginOptions): void {
    this.keycloakAuth.login(options);
  }

  public logout(): void {
    this.keycloakAuth.logout();
  }

  public account(): void {
    this.keycloakAuth.accountManagement();
  }

  public authServerUrl(): string | undefined {
    console.log("authServerUrl", this.keycloakAuth.authServerUrl);
    const authServerUrl = this.keycloakAuth.authServerUrl;
    return authServerUrl!.charAt(authServerUrl!.length - 1) === "/"
      ? authServerUrl
      : authServerUrl + "/";
  }

  public realm(): string | undefined {
    return this.keycloakAuth.realm;
  }

  public getToken(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (this.keycloakAuth.token) {
        this.keycloakAuth
          .updateToken(5)
          .then(() => {
            resolve(this.keycloakAuth.token as string);
          })
          .catch(() => {
            reject("Failed to refresh token");
          });
      } else {
        reject("Not logged in");
      }
    });
  }
}
