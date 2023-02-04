import cs from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChevronIcon, DoubleSlashBrandIcon, FullBrandIcon } from "../icons";
import { NavigationItem, User } from "../layouts/layout";

type Props = {
  menuCollapsed: boolean;
  setMenuCollapsed: (collapsed: boolean) => void;
  navigation: NavigationItem[];
  user: User;
};

const DesktopSidebarNav: React.FC<Props> = ({
  menuCollapsed,
  setMenuCollapsed,
  navigation,
  user,
}) => {
  const { asPath } = useRouter();

  return (
    <>
      {/* If using a mobile view: <div className="hidden lg:flex lg:flex-shrink-0"> */}
      <div className="flex flex-shrink-0">
        <div
          className={cs(
            "flex w-[70px] flex-col transition-[width] duration-150 ease-in-out",
            {
              "w-64": !menuCollapsed,
            }
          )}
        >
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-gray-50">
            <div className="flex-1">
              {menuCollapsed ? (
                <div
                  className="group flex items-center justify-center py-4 pt-8 hover:cursor-pointer "
                  onClick={() => setMenuCollapsed(!menuCollapsed)}
                >
                  <DoubleSlashBrandIcon />
                  <ChevronIcon className="stroke-gray-400 group-hover:stroke-gray-600 " />
                </div>
              ) : (
                <div
                  className="group flex items-center justify-between py-4 px-4 pt-8 hover:cursor-pointer"
                  onClick={() => setMenuCollapsed(!menuCollapsed)}
                >
                  <FullBrandIcon />
                  <ChevronIcon className="rotate-180 stroke-gray-400 group-hover:stroke-gray-600 " />
                </div>
              )}
              <nav
                aria-label="Sidebar"
                className={cs("flex flex-col items-center space-y-3 py-6", {
                  "px-4": !menuCollapsed,
                })}
              >
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cs(
                      "flex items-center rounded-lg border-2 border-gray-200 p-[14px] text-sm transition-colors hover:border-gray-300 hover:bg-white",
                      {
                        "border-blue-400 bg-white hover:border-blue-400":
                          asPath === item.href,
                        "w-full": !menuCollapsed,
                      }
                    )}
                  >
                    <item.icon className="h-[18] w-[18]" aria-hidden="true" />
                    <span className="sr-only">{item.name}</span>
                    {!menuCollapsed && (
                      <span className="pl-2">{item.name}</span>
                    )}
                  </Link>
                ))}
              </nav>
            </div>
            <div
              className={cs("flex pb-5", {
                "flex-shrink-0": menuCollapsed,
              })}
            >
              <Link
                href="#"
                className={cs("flex", {
                  "items-center px-6": !menuCollapsed,
                  "w-full flex-shrink-0": menuCollapsed,
                })}
              >
                <div className="mx-auto block grid h-8 w-8 place-items-center rounded-full bg-white text-sm">
                  {user.name.substring(0, 1)}
                </div>
                {!menuCollapsed && <p className="ml-2 text-sm">{user.name}</p>}
                <div className="sr-only">
                  <p>{user.name}</p>
                  <p>Account settings</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DesktopSidebarNav;
