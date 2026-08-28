import { NavUser } from "@/components/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar";
import { usePage } from "@inertiajs/react";
import Icon from "../../../public/images/wonderful-opol.png";
import NavItem from "@/components/nav-item";

export function AppSidebar() {
    const user = usePage().props.auth.user;

    return (
        <Sidebar
            collapsible="icon"
            variant="sidebar"
            className="border-r border-sidebar-border"
        >
            {/* Brand */}
            <SidebarHeader className="border-b border-sidebar-border">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            className="
                                h-14 rounded-xl
                                hover:bg-sidebar-accent
                                data-[state=open]:bg-sidebar-accent
                            "
                        >
                            <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary/10">
                                <img
                                    src={Icon}
                                    alt={import.meta.env.VITE_APP_NAME}
                                    className="size-8 object-contain"
                                />
                            </div>

                            <div className="grid min-w-0 flex-1 text-left leading-tight">
                                <span className="truncate text-sm font-bold">
                                    {import.meta.env.VITE_APP_NAME}
                                </span>

                                <span className="truncate text-[11px] text-sidebar-foreground/50">
                                    Administration Portal
                                </span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {/* Navigation */}
            <SidebarContent className="px-2 py-3">
                <NavItem user={user} />
            </SidebarContent>

            {/* User */}
            <SidebarFooter className="border-t border-sidebar-border p-2">
                <NavUser user={user} />
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}
