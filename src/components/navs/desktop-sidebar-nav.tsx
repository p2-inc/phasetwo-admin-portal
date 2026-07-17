import Button from "@/components/elements/forms/buttons/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { config } from "@/config";
import useUser from "@/components/utils/useUser";
import { keycloak, keycloakService } from "@/keycloak";
import { ExternalLink } from "lucide-react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { DoubleSlashBrandIcon, FullBrandIcon } from "../icons";
import { NavigationItem } from "../layouts/layout";

import { useTranslation } from "react-i18next";
import ThemePicker from "./components/theme-picker";
import { useTheme } from "@/components/utils/useTheme";

type Props = {
  navigation: NavigationItem[];
};

const AppSidebar: React.FC<Props> = ({ navigation }) => {
  const { user, fullName } = useUser();
  const { theme, changeTheme } = useTheme();
  const location = useLocation();

  const { t } = useTranslation();
  const { appiconUrl, logoUrl } = config.env;

  const isActive = (href: string) =>
    location.pathname === href || location.pathname.startsWith(`${href}/`);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center py-2 pl-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:pl-0">
          {/* Expanded branding */}
          <div className="flex items-center group-data-[collapsible=icon]:hidden">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Logo"
                className="w-auto max-w-[160px]"
              />
            ) : (
              <FullBrandIcon />
            )}
          </div>
          {/* Collapsed branding */}
          <div className="hidden items-center justify-center group-data-[collapsible=icon]:flex">
            {appiconUrl ? (
              <img src={appiconUrl} alt="App Icon" className="size-6" />
            ) : (
              <DoubleSlashBrandIcon />
            )}
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.href)}
                    tooltip={t(item.name)}
                  >
                    <NavLink to={item.href}>
                      <item.icon />
                      <span>{t(item.name)}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent"
                >
                  <div className="grid size-8 shrink-0 place-items-center rounded-full border border-primary bg-card text-sm font-semibold text-foreground">
                    {fullName().substring(0, 1)}
                  </div>
                  <div className="grid flex-1 text-left leading-tight">
                    <span className="truncate text-sm font-semibold text-foreground">
                      {fullName()}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user?.email}
                    </span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="start"
                sideOffset={8}
                className="w-72 divide-y divide-border rounded-lg px-5 py-0 shadow-lg"
              >
                <div className="py-5">
                  <div className="font-semibold text-foreground">
                    {fullName()}
                  </div>
                  <div className="overflow-hidden text-ellipsis whitespace-nowrap text-sm text-muted-foreground">
                    {user?.email}
                  </div>
                </div>
                <div className="py-1">
                  <DropdownMenuItem asChild>
                    <Link
                      to="/"
                      className="group -mx-3 flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm text-muted-foreground transition hover:bg-accent hover:text-foreground"
                    >
                      <div>{t("returnToHomepage")}</div>
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </DropdownMenuItem>
                </div>
                <div className="relative flex items-center justify-between py-2">
                  <ThemePicker theme={theme} changeTheme={changeTheme} />
                </div>
                <div className="py-5">
                  <a href={keycloak.createLogoutUrl()}>
                    <Button
                      className="w-full"
                      onClick={() => keycloakService.logout()}
                      title={t("logOut")}
                    >
                      {t("logOut")}
                    </Button>
                  </a>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
