import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";
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
            className="flex w-full items-center rounded-md border-2 border-border px-4 py-2 text-sm font-medium text-foreground"
            onClick={toggleMenu}
          >
            <div className="flex flex-1 items-center">
              {activeItem.icon && (
                <activeItem.icon
                  className="-ml-1 mr-3 h-6 w-6 shrink-0"
                  aria-hidden="true"
                />
              )}
              {t(activeItem?.name)}
            </div>
            <div className="shrink-0">
              <ChevronIcon className="rotate-90 stroke-muted-foreground" />
            </div>
          </button>
        )}
      </div>
      <div className={cn("space-y-1 p-2", { "hidden md:block": !isOpen })}>
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "group flex items-center rounded-md px-3 py-2 text-sm transition",
                {
                  "bg-accent text-accent-foreground":
                    isActive && !item.href.startsWith("#"),
                  "text-muted-foreground hover:bg-accent hover:text-accent-foreground":
                    !isActive,
                }
              )
            }
            onClick={toggleMenu}
          >
            <>
              {item.icon && (
                <item.icon
                  className="-ml-1 mr-3 h-6 w-6 shrink-0"
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
