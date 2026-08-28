import {
    KeyRound,
    LayoutDashboard,
    LinkIcon,
    UserCheck,
    Users,
    type LucideIcon,
} from "lucide-react";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import { Link, usePage } from "@inertiajs/react";
import { useIsMobile } from "@/hooks/use-mobile";

type NavItem = {
    title: string;
    url: string;
    icon: LucideIcon;
};

type NavGroup = {
    name: string;
    items: NavItem[];
};

const navSuperAdmin: NavGroup[] = [
    {
        name: "Main",
        items: [
            {
                title: "Dashboard",
                url: "/super-admin/dashboard",
                icon: LayoutDashboard,
            },
        ],
    },
    {
        name: "Users",
        items: [
            {
                title: "Admin",
                url: "/super-admin/users/admin",
                icon: Users,
            },
        ],
    },
    {
        name: "Clients",
        items: [
            {
                title: "Keys",
                url: "/super-admin/clients/keys",
                icon: KeyRound,
            },
        ],
    },
];

const navAdmin: NavGroup[] = [
    {
        name: "Main",
        items: [
            {
                title: "Dashboard",
                url: "/dashboard",
                icon: LayoutDashboard,
            },
        ],
    },
    {
        name: "Users",
        items: [
            {
                title: "Residents",
                url: "/users/residents",
                icon: Users,
            },
        ],
    },
    {
        name: "Services",
        items: [
            {
                title: "Link Systems",
                url: "/services/link-systems",
                icon: LinkIcon,
            },
        ],
    },
    {
        name: "Requests",
        items: [
            {
                title: "User Verifications",
                url: "/requests/user-verifications",
                icon: UserCheck,
            },
        ],
    },
];

export default function NavItem({
    user,
}: {
    user: {
        role: string;
    };
}) {
    const { setOpenMobile } = useSidebar();
    const isMobile = useIsMobile();
    const { url } = usePage();

    const navItems: NavGroup[] =
        user.role === "super_admin" ? navSuperAdmin : navAdmin;

    return (
        <div className="space-y-5">
            {navItems.map((group) => (
                <SidebarGroup key={group.name} className="p-0">
                    <SidebarGroupLabel
                        className="
                            mb-1 px-3
                            text-[10px]
                            font-semibold
                            uppercase
                            tracking-[0.12em]
                            text-sidebar-foreground/45
                        "
                    >
                        {group.name}
                    </SidebarGroupLabel>

                    <SidebarMenu className="gap-1">
                        {group.items.map((item) => {
                            const isActive =
                                url === item.url ||
                                url.startsWith(`${item.url}/`);

                            const Icon = item.icon;

                            return (
                                <SidebarMenuItem
                                    key={item.title}
                                    onClick={() => {
                                        if (isMobile) {
                                            setOpenMobile(false);
                                        }
                                    }}
                                >
                                    <SidebarMenuButton
                                        asChild
                                        tooltip={item.title}
                                        isActive={isActive}
                                        className="
                                            group relative
                                            h-10
                                            rounded-lg
                                            px-3
                                            font-medium
                                            text-sidebar-foreground/70
                                            transition-all
                                            duration-200

                                            hover:bg-sidebar-accent
                                            hover:text-sidebar-accent-foreground

                                            data-[active=true]:bg-primary/10
                                            data-[active=true]:font-semibold
                                            data-[active=true]:text-primary
                                        "
                                    >
                                        <Link href={item.url}>
                                            <span
                                                className="
                                                    absolute
                                                    left-0
                                                    top-1/2
                                                    h-5
                                                    w-0.5
                                                    -translate-y-1/2
                                                    rounded-full
                                                    bg-primary
                                                    opacity-0
                                                    transition-opacity
                                                    group-data-[active=true]:opacity-100
                                                "
                                            />

                                            <Icon
                                                className="
                                                    size-[18px]
                                                    shrink-0
                                                    transition-transform
                                                    duration-200
                                                    group-hover:scale-105
                                                "
                                                strokeWidth={1.8}
                                            />

                                            <span className="truncate">
                                                {item.title}
                                            </span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            ))}
        </div>
    );
}
