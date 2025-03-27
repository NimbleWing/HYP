import { ElementType } from "react";
import {
    PiChartLineUpDuotone,
    PiChatCenteredDotsDuotone,
    PiFilesDuotone,
    PiLockKeyDuotone,
    PiShieldCheckDuotone,
    PiSquaresFourDuotone,
    PiStarDuotone,
    PiTableDuotone,
    PiUserPlusDuotone,
    PiUsersDuotone,
} from "react-icons/pi";
import {
    LuFolderSearch2
} from "react-icons/lu";
import { paths } from "@routes/paths";

interface MenuItem {
    header: string;
    section: {
        name: string;
        href: string;
        icon: ElementType;
        dropdownItems?: {
            name: string;
            href: string;
            badge?: string;
        }[];
    }[];
}

export const menu: MenuItem[] = [
    {
        header: "Overview",
        section: [
            {
                name: "Welcome",
                href: paths.dashboard.home,
                icon: PiStarDuotone,
            },
            {
                name: "Documentation",
                href: paths.dashboard.home,
                icon: PiFilesDuotone,
            }
        ]
    },
    {
        header: "Apps",
        section: [
            {
                name: "Quick Search",
                href: paths.dashboard.apps.quickSearch,
                icon: LuFolderSearch2,
            }
        ]
    },
    {
        header: "Management",
        section: [
            {
                name: "Customers",
                icon: PiUsersDuotone,
                href: paths.dashboard.home,
                dropdownItems: [
                    {
                        name: "list",
                        href: paths.dashboard.home,
                    }
                ]
            }
        ]
    },
    {
        header: "Widgets",
        section: [
            {
                name: "Charts",
                href: paths.dashboard.home,
                icon: PiChartLineUpDuotone,
            },
            {
                name: "Metrics",
                href: paths.dashboard.home,
                icon: PiSquaresFourDuotone,
            },
            {
                name: 'Tables',
                href: paths.dashboard.home,
                icon: PiTableDuotone,
            },
        ]
    },
    {
        header: 'Authentication',
        section: [
            {
                name: 'Register',
                href: paths.dashboard.home,
                icon: PiUserPlusDuotone,
            },
            {
                name: 'Login',
                href: paths.dashboard.home,
                icon: PiShieldCheckDuotone,
            },
            {
                name: 'Forgot Password',
                href: paths.dashboard.home,
                icon: PiLockKeyDuotone,
            },
            {
                name: 'OTP',
                href: paths.dashboard.home,
                icon: PiChatCenteredDotsDuotone,
            },
        ],
    },
]