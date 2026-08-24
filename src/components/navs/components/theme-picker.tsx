import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Theme as ThemeType, Themes } from "@/components/utils/useTheme";
import { useTranslation } from "react-i18next";

export default function ThemePicker({
  theme,
  changeTheme,
}: {
  theme: ThemeType;
  changeTheme: (theme: ThemeType) => void;
}) {
  const { t } = useTranslation();
  const currentTheme = Themes.find((t) => t.key === theme)!;

  return (
    <>
      <div className="text-sm text-foreground">{t("theme")}</div>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center space-x-2 rounded-sm border border-border px-2 py-1 text-sm text-foreground hover:border-muted-foreground">
          <div>{currentTheme.icon}</div>
          <div>{t(currentTheme.name)}</div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {Themes.map((item) => (
            <DropdownMenuItem
              key={item.key}
              onSelect={() => changeTheme(item.key)}
              className="flex cursor-pointer items-center space-x-2 text-sm"
            >
              <div>{item.icon}</div>
              <div>{t(item.name)}</div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
