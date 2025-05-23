package io.phasetwo.portal;

import com.fasterxml.jackson.core.io.JsonStringEncoder;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.base.Strings;
import com.google.common.collect.ImmutableMap;
import jakarta.activation.MimetypesFileTypeMap;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.PathSegment;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriInfo;
import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Method;
import java.net.URI;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.Properties;
import java.util.function.Function;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import lombok.extern.jbosslog.JBossLog;
import org.keycloak.forms.login.LoginFormsProvider;
import org.keycloak.forms.login.freemarker.FreeMarkerLoginFormsProvider;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.services.Urls;
import org.keycloak.services.cors.Cors;
import org.keycloak.services.managers.AppAuthManager;
import org.keycloak.services.managers.Auth;
import org.keycloak.services.managers.AuthenticationManager;
import org.keycloak.services.resource.AccountResourceProvider;
import org.keycloak.services.resource.RealmResourceProvider;
import org.keycloak.services.resources.RealmsResource;
import org.keycloak.theme.Theme;

@JBossLog
public class PortalResourceProvider implements AccountResourceProvider, RealmResourceProvider {

  private static ObjectMapper mapper = new ObjectMapper();

  private final KeycloakSession session;
  private final String authRealmOverride;
  private final AppAuthManager authManager;
  private Auth auth;

  public PortalResourceProvider(KeycloakSession session, String authRealmOverride) {
    this.session = session;
    this.authRealmOverride = authRealmOverride;
    this.authManager = new AppAuthManager();
  }

  public void init() {
    AuthenticationManager.AuthResult authResult =
        authManager.authenticateIdentityCookie(session, session.getContext().getRealm());
    if (authResult != null) {
      auth =
          new Auth(
              session.getContext().getRealm(),
              authResult.getToken(),
              authResult.getUser(),
              session.getContext().getClient(),
              authResult.getSession(),
              true);
    }
  }

  @Override
  public Object getResource() {
    return this;
  }

  private void setupCors() {
    Cors.builder().allowAllOrigins().allowedMethods(METHODS).auth().add();
  }

  private String getRealmName(RealmModel realm) {
    if (!Strings.isNullOrEmpty(realm.getDisplayName())) {
      return realm.getDisplayName();
    } else {
      return realm.getName();
    }
  }

  public static final String[] METHODS = {
    "GET", "HEAD", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"
  };

  @OPTIONS
  @Path("{any:.*}")
  public Response preflight() {
    log.debug("CORS OPTIONS preflight request");
    return Cors.builder().auth().allowedMethods(METHODS).preflight().add(Response.ok());
  }

  /**
   * something is seriously wrong since resteasy reactive upgrade. catch-all and regex paths no
   * longer work from annotations. This is a hack to get v23 working in the meantime.
   */
  @GET
  @Path("{path:.+}")
  public Response router(@PathParam("path") String path) throws Exception {
    UriInfo uriInfo = session.getContext().getUri();
    log.debugf("param path %s", path);
    log.debugf("absolutePath %s", uriInfo.getAbsolutePath());
    log.debugf("path %s", uriInfo.getPath());
    log.debugf("baseUri %s", uriInfo.getBaseUri());
    log.debugf("segments %s", uriInfo.getPathSegments());
    log.debugf("requestUri %s", uriInfo.getRequestUri());

    if (path == null || "".equals(path) || "/".equals(path)) return portal();
    if (path.startsWith("/")) {
      path = path.substring(1);
    }

    // staticResources
    if (Pattern.matches("^(asset-manifest|logo|manifest|static|locales|favicon).*", path)) {
      Response response = staticResources(path);
      if (response != null) {
        log.debugf("returning response %d for path %s", response.getStatus(), path);
        return response;
      }
    }

    // forward
    if (Pattern.matches("^(profile|organizations).*", path)) {
      Response response = forward();
      if (response != null) {
        log.debugf("forwarding response %d for path %s", response.getStatus(), path);
        return response;
      }
    }

    return portal();
  }

  @GET
  @Path("{path: ^(profile|organizations).*}")
  @Produces(MediaType.TEXT_HTML)
  public Response forward() {
    return portal();
  }

  @GET
  @Produces(MediaType.TEXT_HTML)
  public Response portal() {
    init();
    RealmModel realm = session.getContext().getRealm();
    Theme theme = getTheme("portal");
    UriInfo uriInfo = session.getContext().getUri();
    URI authUrl = uriInfo.getBaseUri();
    URI portalBaseUrl =
        uriInfo
            .getBaseUriBuilder()
            .path(RealmsResource.class)
            .path(realm.getName())
            .path("portal")
            .path("/")
            .build(realm);
    String portalResources =
        Urls.themeRoot(authUrl).getPath() + "/" + "admin-portal" + "/" + theme.getName();

    Locale locale = Locale.of("en");
    try {
      if (auth != null && auth.getUser() != null) {
        locale = session.getContext().resolveLocale(auth.getUser());
      } else {
        locale = Locale.of(realm.getDefaultLocale() != null ? realm.getDefaultLocale() : "en");
      }
    } catch (Exception e) {
      log.warn("Unable to determine locale.");
    }

    try {
      String referer =
          session
              .getContext()
              .getHttpRequest()
              .getHttpHeaders()
              .getRequestHeaders()
              .getFirst("Referer");
      PortalEnvironment env =
          new PortalEnvironment()
              .realm(realm.getName())
              .locale(locale.toLanguageTag())
              .authServerUrl(
                  authUrl.getPath().endsWith("/") ? authUrl.toString() : authUrl.toString() + "/")
              .baseUrl(portalBaseUrl.toString())
              .resourceUrl(portalResources)
              .refererUrl(referer)
              .isRunningAsTheme(true)
              .supportedLocales(getSupportedLocales(realm, locale))
              .styles(new PortalEnvironment.CustomTheme());
      Optional.ofNullable(realm.getName()).ifPresent(a -> env.name(a));
      Optional.ofNullable(realm.getDisplayName()).ifPresent(a -> env.displayName(a));
      Optional.ofNullable(realm.getAttribute(String.format("_providerConfig.assets.logo.url")))
          .ifPresent(a -> env.logoUrl(a));
      Optional.ofNullable(realm.getAttribute(String.format("_providerConfig.assets.favicon.url")))
          .ifPresent(a -> env.faviconUrl(a));
      Optional.ofNullable(realm.getAttribute(String.format("_providerConfig.assets.appicon.url")))
          .ifPresent(a -> env.appiconUrl(a));
      Optional.ofNullable(
              realm.getAttribute(String.format("_providerConfig.assets.portal.primaryColor100")))
          .ifPresent(a -> env.getStyles().setPrimary100(a));
      Optional.ofNullable(
              realm.getAttribute(String.format("_providerConfig.assets.portal.primaryColor200")))
          .ifPresent(a -> env.getStyles().setPrimary200(a));
      Optional.ofNullable(
              realm.getAttribute(String.format("_providerConfig.assets.portal.primaryColor400")))
          .ifPresent(a -> env.getStyles().setPrimary400(a));
      Optional.ofNullable(
              realm.getAttribute(String.format("_providerConfig.assets.portal.primaryColor500")))
          .ifPresent(a -> env.getStyles().setPrimary500(a));
      Optional.ofNullable(
              realm.getAttribute(String.format("_providerConfig.assets.portal.primaryColor600")))
          .ifPresent(a -> env.getStyles().setPrimary600(a));
      Optional.ofNullable(
              realm.getAttribute(String.format("_providerConfig.assets.portal.primaryColor700")))
          .ifPresent(a -> env.getStyles().setPrimary700(a));
      Optional.ofNullable(
              realm.getAttribute(String.format("_providerConfig.assets.portal.primaryColor900")))
          .ifPresent(a -> env.getStyles().setPrimary900(a));
      Optional.ofNullable(
              realm.getAttribute(String.format("_providerConfig.assets.portal.secondaryColor800")))
          .ifPresent(a -> env.getStyles().setSecondary800(a));
      Optional.ofNullable(
              realm.getAttribute(String.format("_providerConfig.assets.portal.secondaryColor900")))
          .ifPresent(a -> env.getStyles().setSecondary900(a));
      Optional.ofNullable(realm.getAttribute(String.format("_providerConfig.assets.portal.css")))
          .ifPresent(a -> env.getStyles().setCustomCSS(a));
      env.setFeatures(PortalFeatures.fromSession(session, auth));

      String envStr =
          new String(JsonStringEncoder.getInstance().quoteAsString(mapper.writeValueAsString(env)));
      log.debugf("set environment string to %s", envStr);
      String authUrlAttribute =
          authUrl.getPath().endsWith("/")
              ? authUrl.toString().substring(0, authUrl.toString().length() - 1)
              : authUrl.toString();
      String realmName = getRealmName(realm);
      LoginFormsProvider form =
          session
              .getProvider(LoginFormsProvider.class)
              .setAttribute("environment", envStr)
              .setAttribute("authUrl", authUrlAttribute)
              .setAttribute(
                  "faviconUrl",
                  Optional.ofNullable(realm.getAttribute("_providerConfig.assets.favicon.url"))
                      .orElse(
                          String.format(
                              "%s/realms/%s/portal/favicon.ico",
                              authUrlAttribute, realm.getName())))
              .setAttribute(
                  "appiconUrl",
                  Optional.ofNullable(realm.getAttribute("_providerConfig.assets.appicon.url"))
                      .orElse(
                          String.format(
                              "%s/realms/%s/portal/logo192.png",
                              authUrlAttribute, realm.getName())))
              .setAttribute("displayName", realmName)
              .setAttribute("realmName", realm.getName());
      FreeMarkerLoginFormsProvider fm = (FreeMarkerLoginFormsProvider) form;
      Method processTemplateMethod = getProcessTemplateMethod(fm);
      processTemplateMethod.setAccessible(true);
      Response resp =
          (Response)
              processTemplateMethod.invoke(
                  fm, theme, "portal.ftl", session.getContext().resolveLocale(null));
      return resp;
    } catch (Exception e) {
      log.warn("Could not call processTemplate on FreeMarkerLoginFormsProvider", e);
    }
    return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
  }

  Method getProcessTemplateMethod(FreeMarkerLoginFormsProvider provider)
      throws NoSuchMethodException {
    Class<?> clazz = provider.getClass();
    StringBuilder o = new StringBuilder();
    while (clazz != null) {
      o.append(clazz.getSimpleName()).append("->");
      try {
        Method method =
            clazz.getDeclaredMethod("processTemplate", Theme.class, String.class, Locale.class);
        return method;
      } catch (NoSuchMethodException ignore) {
      }
      clazz = clazz.getSuperclass();
    }
    throw new NoSuchMethodException(
        String.format("Unable to find processTemplate method in hierarchy %s", o.toString()));
  }

  Map<String, String> getSupportedLocales(RealmModel realm, Locale locale) {
    Properties messages = new Properties();
    if (!Strings.isNullOrEmpty(realm.getDefaultLocale())) {
      messages.putAll(realm.getRealmLocalizationTextsByLocale(realm.getDefaultLocale()));
    }
    if (locale != null) {
      messages.putAll(realm.getRealmLocalizationTextsByLocale(locale.toLanguageTag()));
    }
    return realm
        .getSupportedLocalesStream()
        .collect(
            Collectors.toMap(Function.identity(), l -> messages.getProperty("locale_" + l, l)));
  }

  @GET
  @Path("{path: ^(asset-manifest|logo|manifest|static|locales|favicon).*}")
  public Response staticResources(@PathParam("path") final String path) throws IOException {
    String fileName = getLastPathSegment(session.getContext().getUri());
    Theme theme = getTheme("portal");
    InputStream resource = theme.getResourceAsStream(path);
    String mimeType = getMimeType(fileName);
    log.debugf("%s [%s] (%s)", path, mimeType, null == resource ? "404" : "200");
    return null == resource
        ? Response.status(Response.Status.NOT_FOUND).build()
        : Response.ok(resource, mimeType).build();
  }

  @GET
  @Path("/keycloak.json")
  @Produces(MediaType.APPLICATION_JSON)
  public Response keycloakJson() {
    setupCors();
    RealmModel realm = session.getContext().getRealm();
    UriInfo uriInfo = session.getContext().getUri();
    Map json =
        ImmutableMap.of(
            "realm",
            authRealmOverride,
            "auth-server-url",
            getBaseUrl(uriInfo),
            "resource",
            "admin-portal");
    return Response.ok(json).build();
  }

  private static String getBaseUrl(UriInfo uriInfo) {
    String u = uriInfo.getBaseUri().toString();
    if (u != null && u.endsWith("/")) u = u.substring(0, u.length() - 1);
    return u;
  }

  private static String getOrigin(UriInfo uriInfo) {
    return uriInfo.getBaseUri().resolve("/").toString();
  }

  private Theme getTheme(String name) {
    try {
      return session.theme().getTheme(name, Theme.Type.LOGIN);
    } catch (IOException e) {
      throw new WebApplicationException(Response.Status.INTERNAL_SERVER_ERROR);
    }
  }

  private String getLastPathSegment(UriInfo uriInfo) {
    List<PathSegment> segs = uriInfo.getPathSegments();
    if (segs != null && segs.size() > 0) {
      return segs.get(segs.size() - 1).getPath();
    }
    return null;
  }

  private static final String MIME_TYPES =
      "text/javascript js\n"
          + "text/css css\n"
          + "font/woff woff\n"
          + "font/woff2 woff2\n"
          + "application/json json webmanifest map\n"
          + "image/svg+xml svg\n";

  private String getMimeType(String fileName) {
    MimetypesFileTypeMap map = new MimetypesFileTypeMap();
    map.addMimeTypes(MIME_TYPES); // loading from mime.types on classpath not working
    return map.getContentType(fileName);
  }

  @Override
  public void close() {}
}
