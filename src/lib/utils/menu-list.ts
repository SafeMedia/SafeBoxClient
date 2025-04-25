import {
    Settings,
    LayoutGrid,
    LucideIcon,
    TestTubeDiagonal,
} from "lucide-react";
import { useTranslation } from "react-i18next";

type Submenu = {
    href: string;
    label: string;
    active?: boolean;
    requiresAuth?: boolean;
};

type Menu = {
    href: string;
    label: string;
    active?: boolean;
    icon: LucideIcon;
    submenus?: Submenu[];
    requiresAuth?: boolean;
};

type Group = {
    groupLabel: string;
    menus: Menu[];
};

export function getMenuList(_pathname: string): Group[] {
    const { t } = useTranslation();
    return [
        {
            groupLabel: "",
            menus: [
                {
                    href: "/",
                    label: t("dashboard"),
                    icon: LayoutGrid,
                    submenus: [],
                },

                {
                    href: "",
                    label: t("examples"),
                    icon: TestTubeDiagonal,
                    submenus: [
                        {
                            href: "download-single",
                            label: t("downloadSingle"),
                        },
                    ],
                },
            ],
        },
        {
            groupLabel: t("other"),
            menus: [
                {
                    href: "/settings/status",
                    label: t("settings"),
                    icon: Settings,
                },
            ],
        },
    ];
}
