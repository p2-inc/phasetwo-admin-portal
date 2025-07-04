import { NavLink, useLocation } from "react-router-dom";
import cs from "classnames";
import { useState } from "react";
import { ChevronIcon } from "@/components/icons";
import { useTranslation } from "react-i18next";

export type NavigationItem = {
  name: string;
  href: string;
  icon?: React.ForwardRefExoticComponent<
    React.SVGProps<SVGSVGElement> & {
      title?: string | undefined;
      titleId?: string | undefined;
    }
  >;
  isActive: boolean;
};

type Props = {
  navigation: NavigationItem[];
};

const SecondaryMainContentNav: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const [isOpen, setOpen] = useState(false);
  const location = useLocation();
  const activeItem = navigation.find(
    (f) => f.href === location.pathname
  ) as NavigationItem;

  function toggleMenu() {
    setOpen(!isOpen);
  }

  return (
    <nav className="mb-4">
      <div className="md:hidden">
        {activeItem && (
          <button
            className="flex w-full items-center rounded-md border-2 border-gray-200 px-4 py-2 text-sm font-medium dark:border-zinc-600 dark:text-zinc-200"
            onClick={toggleMenu}
          >
            <div className="flex flex-1 items-center">
              {activeItem.icon && (
                <activeItem.icon
                  className={cs("-ml-1 mr-3 h-6 w-6 flex-shrink-0")}
                  aria-hidden="true"
                />
              )}
              {t(activeItem?.name)}
            </div>
            <div className="flex-shrink-0">
              <ChevronIcon className="rotate-90 stroke-gray-600" />
            </div>
          </button>
        )}
      </div>
      <div className={cs("space-y-1 p-2", { "hidden md:block": !isOpen })}>
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cs(
                "group flex items-center rounded-md px-3 py-2 text-sm transition",
                {
                  "bg-gray-100 text-gray-900 dark:bg-zinc-800 dark:text-zinc-200":
                    isActive && !item.href.startsWith("#"),
                  "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-zinc-200":
                    !isActive,
                }
              )
            }
            onClick={toggleMenu}
          >
            <>
              {item.icon && (
                <item.icon
                  className={cs("-ml-1 mr-3 h-6 w-6 flex-shrink-0")}
                  aria-hidden="true"
                />
              )}
              <span className="truncate">{t(item.name)}</span>
            </>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default SecondaryMainContentNav;
