import SecondaryMainContentMenuArea from "@/components/layouts/secondary-main-content-menu-area";
import TopHeader from "@/components/navs/top-header";
import {
  KeyRound,
  Grid2x2Plus,
  CircleUserRound,
  Smartphone,
} from "lucide-react";
import FixedWidthMainContent from "@/components/layouts/fixed-width-main-content-area";
import PrimaryContentArea from "@/components/layouts/primary-content-area";
import SecondaryMainContentNav, {
  NavigationItem,
} from "@/components/navs/secondary-main-content-nav";
import { Outlet } from "react-router-dom";
import { config } from "@/config";
import { useTranslation } from "react-i18next";
const { features: featureFlags } = config.env;

const navigation: NavigationItem[] = [
  {
    name: "general",
    href: "/profile/general",
    icon: CircleUserRound,
    isActive: true,
  },
  {
    name: "signingIn",
    href: "/profile/signin",
    icon: KeyRound,
    isActive: true,
  },
  {
    name: "deviceActivity",
    href: "/profile/activity",
    icon: Smartphone,
    isActive: featureFlags.deviceActivityEnabled,
  },
  {
    name: "linkedAccounts",
    href: "/profile/linked",
    icon: Grid2x2Plus,
    isActive: featureFlags.linkedAccountsEnabled,
  },
];

export default function Profile() {
  const { t } = useTranslation();
  return (
    <>
      <TopHeader header={t("profile")} />
      <FixedWidthMainContent>
        {/* Secondary menu */}
        <SecondaryMainContentMenuArea>
          <SecondaryMainContentNav
            navigation={navigation.filter((n) => n.isActive)}
          />
        </SecondaryMainContentMenuArea>

        {/* Primary content */}
        <PrimaryContentArea>
          <Outlet />
        </PrimaryContentArea>
      </FixedWidthMainContent>
    </>
  );
}
