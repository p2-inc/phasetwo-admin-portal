import { Fragment, useState } from "react";
import SectionHeader from "@/components/navs/section-header";
import ActivityLoader from "@/components/loaders/activity";
import ActivityItem from "@/components/elements/activity/item";
import ConfirmationModal from "@/components/elements/confirmation-modal";
import {
  useDeleteCurrentSessionMutation,
  useDeleteSessionMutation,
  useGetDevicesQuery,
  DeviceRepresentation,
  SessionRepresentation,
  ClientRepresentation,
} from "@/store/apis/profile";
import { config } from "@/config";
import { keycloakService } from "@/keycloak";
import TimeUtil from "@/services/time-util";
import Button from "@/components/elements/forms/buttons/button";
import { Smartphone, Monitor } from "lucide-react";
import { useTranslation } from "react-i18next";
import { TFuncKey } from "i18next";

type SignOutSessionState = {
  device: DeviceRepresentation;
  session: SessionRepresentation;
};

const ActivityProfile = () => {
  const { t } = useTranslation();
  const [showSignOutAllConfModal, setShowSignOutAllConfModal] = useState(false);
  const [showSignOutSession, setShowSignOutSession] = useState<boolean>(false);
  const [signOutSessionData, setSignOutSessionData] =
    useState<SignOutSessionState>();
  const { data: devices = [], isFetching } = useGetDevicesQuery({
    realm: config.env.realm,
  });
  const [deleteSessions] = useDeleteCurrentSessionMutation();
  const [deleteSession] = useDeleteSessionMutation();
  const { features: featureFlags } = config.env;

  const signOutAll = () => {
    deleteSessions({
      realm: config.env.realm,
    }).then(() => {
      keycloakService.logout();
    });
  };

  const signOutSession = (
    device: DeviceRepresentation,
    session: SessionRepresentation
  ) => {
    deleteSession({
      realm: config.env.realm,
      sessionId: session.id!,
    }).then(() => {
      //refresh devices? automatic?
      //ContentAlert.success('signedOutSession', [session.browser, device.os]);
    });
  };

  const time = (time: number | undefined): string => {
    if (time === undefined) return "";
    else return TimeUtil.format(time * 1000);
  };

  const elementId = (
    item: string,
    session: SessionRepresentation,
    element: string = "session"
  ): string => {
    return `${element}-${session.id?.substring(0, 7)}-${item}`;
  };

  const findDeviceTypeIcon = (
    session: SessionRepresentation,
    device: DeviceRepresentation
  ): React.ReactNode => {
    if (device.mobile) {
      return <Smartphone id={elementId("icon-mobile", session, "device")} />;
    }
    return <Monitor id={elementId("icon-desktop", session, "device")} />;
  };

  const findOS = (device: DeviceRepresentation): string => {
    if (device.os?.toLowerCase().includes("unknown")) {
      //return Msg.localize('unknownOperatingSystem');
      return "Unknown";
    }
    return device.os ?? "";
  };

  const findOSVersion = (device: DeviceRepresentation): string => {
    if (device.osVersion?.toLowerCase().includes("unknown")) return "";

    return device.osVersion ?? "";
  };

  const makeClientsString = (clients: ClientRepresentation[]): string => {
    let clientsString = "";
    clients.forEach((client: ClientRepresentation, index: number) => {
      let clientName: string;
      if (
        client.hasOwnProperty("clientName") &&
        client.clientName !== undefined &&
        client.clientName !== ""
      ) {
        clientName = t(client.clientName as TFuncKey);
      } else {
        clientName = client.clientId ?? "";
      }
      clientsString += clientName;
      if (clients.length > index + 1) clientsString += ", ";
    });
    return clientsString;
  };

  const isShowSignOutAll = (devices: DeviceRepresentation[]): boolean => {
    if (devices.length === 0) return false;
    if (devices.length > 1) return true;
    if (devices[0]?.sessions && devices[0]?.sessions.length > 1) return true;
    return false;
  };

  return (
    <>
      {featureFlags.deviceActivityEnabled && (
        <div>
          {showSignOutAllConfModal && (
            <ConfirmationModal
              open={showSignOutAllConfModal}
              close={() => setShowSignOutAllConfModal(false)}
              buttonTitle={t("signOutAllDevices")}
              buttonId="sign-out-all"
              modalTitle={t("signOutAllDevices")}
              modalMessage={t(
                "thisActionWillSignOutAllTheDevicesThatHaveSignedInToYourAccountIncludingTheCurrentDeviceYouAreUsing"
              )}
              onContinue={() => signOutAll()}
            />
          )}
          {showSignOutSession && signOutSessionData && (
            <ConfirmationModal
              open={!!showSignOutSession}
              close={() => {
                setShowSignOutSession(false);
                setSignOutSessionData(undefined);
              }}
              modalTitle={t("signOut")}
              modalMessage={t("signOutThisSessionQuestion")}
              onContinue={() =>
                signOutSession(
                  signOutSessionData.device,
                  signOutSessionData.session
                )
              }
            />
          )}
          <div className="mb-12">
            <SectionHeader
              title={t("deviceActivity")}
              description={t("signOutOfAnyUnfamiliarDevices")}
            />
            {isShowSignOutAll(devices) && (
              <div className="mt-3">
                <Button
                  onClick={() => setShowSignOutAllConfModal(true)}
                  isBlackButton
                >
                  {t("signOutAllDevices")}
                </Button>
              </div>
            )}
          </div>
          <div className="w-full rounded border border-gray-200 bg-gray-50 dark:border-zinc-600 dark:bg-p2dark-1000">
            {isFetching ? (
              <ActivityLoader />
            ) : (
              devices.map(
                (device: DeviceRepresentation, deviceIndex: number) => (
                  <div
                    className="divide-y dark:divide-zinc-600"
                    key={device.lastAccess}
                  >
                    {device.sessions!.map(
                      (
                        session: SessionRepresentation,
                        sessionIndex: number
                      ) => (
                        <Fragment
                          key={
                            "device-" + deviceIndex + "-session-" + sessionIndex
                          }
                        >
                          <div>
                            <div className="items-center space-y-2 px-4 pt-3 md:flex md:justify-between md:space-y-0">
                              <div className="md:flex md:items-center">
                                <div className="py-2 dark:text-zinc-200 md:py-0">
                                  {findDeviceTypeIcon(session, device)}
                                </div>
                                <div className="space-y-2 text-sm font-semibold text-secondary-900 dark:text-zinc-200 md:pl-2">
                                  <span
                                    id={elementId("browser", session)}
                                    className="pf-u-mr-md session-title"
                                  >
                                    {findOS(device)} {findOSVersion(device)} /{" "}
                                    {session.browser}
                                  </span>
                                </div>
                              </div>
                              {!session.current && (
                                <Button
                                  onClick={() => {
                                    setShowSignOutSession(true);
                                    setSignOutSessionData({
                                      device,
                                      session,
                                    });
                                  }}
                                  isCompact
                                >
                                  {t("signOutSession")}
                                </Button>
                              )}
                              {session.current && (
                                <span
                                  id={elementId("current-badge", session)}
                                  className="flex items-center space-x-2 rounded border border-primary-700/30 bg-primary-700/10 px-3 py-1 text-xs font-medium text-primary-700 dark:text-zinc-200"
                                >
                                  <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-700 opacity-75"></span>
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-700"></span>
                                  </span>
                                  <span>{t("currentSession")}</span>
                                </span>
                              )}
                            </div>
                            <div className="p-4 md:grid md:grid-cols-5">
                              <div className="">
                                <ActivityItem title={t("ipAddress")}>
                                  {session.ipAddress}
                                </ActivityItem>
                              </div>
                              <div className="">
                                <ActivityItem title={t("lastAccessed")}>
                                  {time(session.lastAccess)}
                                </ActivityItem>
                              </div>
                              <div className="">
                                <ActivityItem title={t("clients")}>
                                  {session.clients &&
                                    makeClientsString(session.clients)}
                                </ActivityItem>
                              </div>
                              <div className="">
                                <ActivityItem title={t("started")}>
                                  {time(session.started)}
                                </ActivityItem>
                              </div>
                              <div className="">
                                <ActivityItem title={t("expires")}>
                                  {time(session.expires)}
                                </ActivityItem>
                              </div>
                            </div>
                          </div>
                        </Fragment>
                      )
                    )}
                  </div>
                )
              )
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ActivityProfile;
