import { useState } from "react";

import { CloudIcon, GaugeIcon, IconType, PeopleIcon } from "./icons";
import DesktopSidebarNav from "./navs/desktop-sidebar-nav";

export type User = {
  name: string;
  email: string;
};

const user = {
  name: "Garth Patil",
  email: "garth@phasetwo.io",
};

export type NavigationItem = {
  name: string;
  href: string;
  icon: IconType;
  isActive?: boolean;
};

const navigation: NavigationItem[] = [
  { name: "Dashboard", href: "#", icon: GaugeIcon },
  { name: "Deployments", href: "#", icon: CloudIcon },
  { name: "Organizations", href: "#", icon: PeopleIcon, isActive: true },
];

export default function Layout({ children }) {
  const [menuCollapsed, setMenuCollapsed] = useState(true);

  return (
    <>
      <div className="flex h-full">
        {/* Static sidebar for desktop */}
        <DesktopSidebarNav
          navigation={navigation}
          user={user}
          setMenuCollapsed={setMenuCollapsed}
          menuCollapsed={menuCollapsed}
        />

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <main className="flex flex-1 overflow-hidden">
            {/* Secondary menu */}
            <aside className="order-first block flex-shrink-0">
              <div className="relative flex h-full w-72 flex-col overflow-y-auto border-r border-gray-200 bg-white">
                Secondary Menu
              </div>
            </aside>

            {/* Primary content */}
            <section
              aria-labelledby="primary-heading"
              className="flex h-full min-w-0 flex-1 flex-col overflow-y-auto "
            >
              {children}
            </section>
          </main>
        </div>
      </div>
    </>
  );
}
