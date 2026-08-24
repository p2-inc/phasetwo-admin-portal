import React from "react";
import AppSidebar from "../navs/desktop-sidebar-nav";
import { IconType } from "../icons";
import { Building2, User } from "lucide-react";
import { config } from "@/config";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
const { features: featureFlags } = config.env;

export type NavigationItem = {
  name: string;
  href: string;
  icon: IconType;
  iconClass?: string;
  isActive: boolean;
};

const SIDEBAR_COOKIE_NAME = "sidebar_state";

function getSidebarDefaultOpen(): boolean {
  if (typeof document === "undefined") return false;
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${SIDEBAR_COOKIE_NAME}=(true|false)`)
  );
  return match ? match[1] === "true" : false;
}

export default function Layout({ children }: { children: React.ReactElement }) {
  const navigation: NavigationItem[] = [
    {
      name: "profile",
      href: "/profile",
      icon: User,
      iconClass: "stroke-current",
      isActive: featureFlags.profileEnabled,
    },
    {
      name: "organizations",
      href: "/organizations",
      icon: Building2,
      iconClass: "fill-current",
      isActive: featureFlags.organizationsEnabled,
    },
  ];

  return (
    <SidebarProvider defaultOpen={getSidebarDefaultOpen()} className="h-svh">
      <AppSidebar navigation={navigation.filter((n) => n.isActive)} />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4">
          <SidebarTrigger />
        </header>
        <div className="flex-1 overflow-y-auto pb-20">
          <main className="m-auto max-w-7xl">{children}</main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
