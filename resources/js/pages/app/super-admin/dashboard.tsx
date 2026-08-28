import AppLayout from "@/layouts/app-layout";
import { ReactPortal } from "react";
import {
    ArrowUpRight,
    CheckCircle2,
    Clock3,
    Link2,
    MoreHorizontal,
    ShieldCheck,
    UserCheck,
    Users,
    XCircle,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type StatCardProps = {
    title: string;
    value: string;
    description: string;
    icon: React.ElementType;
    iconClassName?: string;
    trend?: string;
};

function StatCard({
    title,
    value,
    description,
    icon: Icon,
    iconClassName,
    trend,
}: StatCardProps) {
    return (
        <Card className="border-border/60 shadow-sm transition-shadow hover:shadow-md">
            <CardContent className="p-5">
                <div className="flex items-start justify-between">
                    <div className="space-y-3">
                        <p className="text-sm font-medium text-muted-foreground">
                            {title}
                        </p>

                        <div className="flex items-end gap-2">
                            <h3 className="text-2xl font-bold tracking-tight">
                                {value}
                            </h3>

                            {trend && (
                                <span className="mb-0.5 text-xs font-medium text-emerald-600">
                                    {trend}
                                </span>
                            )}
                        </div>

                        <p className="text-xs text-muted-foreground">
                            {description}
                        </p>
                    </div>

                    <div
                        className={cn(
                            "flex size-11 items-center justify-center rounded-xl bg-muted",
                            iconClassName,
                        )}
                    >
                        <Icon className="size-5" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function StatusBadge({
    status,
}: {
    status: "pending" | "approved" | "rejected";
}) {
    const config = {
        pending: {
            label: "Pending",
            className:
                "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900 dark:bg-orange-950/40 dark:text-orange-400",
            dot: "bg-orange-500",
        },
        approved: {
            label: "Approved",
            className:
                "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400",
            dot: "bg-emerald-500",
        },
        rejected: {
            label: "Rejected",
            className:
                "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400",
            dot: "bg-red-500",
        },
    };

    const item = config[status];

    return (
        <Badge
            variant="outline"
            className={cn(
                "gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                item.className,
            )}
        >
            <span className={cn("size-1.5 rounded-full", item.dot)} />
            {item.label}
        </Badge>
    );
}

function ActivityItem({
    icon: Icon,
    title,
    description,
    time,
    iconClassName,
}: {
    icon: React.ElementType;
    title: string;
    description: string;
    time: string;
    iconClassName?: string;
}) {
    return (
        <div className="flex gap-3">
            <div
                className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-full bg-muted",
                    iconClassName,
                )}
            >
                <Icon className="size-4" />
            </div>

            <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{title}</p>

                <p className="mt-0.5 text-xs text-muted-foreground">
                    {description}
                </p>
            </div>

            <span className="shrink-0 text-[11px] text-muted-foreground">
                {time}
            </span>
        </div>
    );
}

export default function Dashboard() {
    return (
        <div className="space-y-6">
            {/* =====================================================
                HEADER
            ====================================================== */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Dashboard
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Welcome back. Here's an overview of your platform.
                    </p>
                </div>

                <Button variant="outline" className="gap-2">
                    View Reports
                    <ArrowUpRight className="size-4" />
                </Button>
            </div>

            {/* =====================================================
                STATISTICS
            ====================================================== */}

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Total Residents"
                    value="12,480"
                    description="Registered residents"
                    trend="+8.2%"
                    icon={Users}
                    iconClassName="bg-primary/10 text-primary"
                />

                <StatCard
                    title="Verified Residents"
                    value="9,842"
                    description="Successfully verified"
                    trend="+5.4%"
                    icon={ShieldCheck}
                    iconClassName="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                />

                <StatCard
                    title="Pending Requests"
                    value="186"
                    description="Awaiting verification"
                    icon={Clock3}
                    iconClassName="bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400"
                />

                <StatCard
                    title="Linked Systems"
                    value="8"
                    description="Available services"
                    icon={Link2}
                    iconClassName="bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                />
            </div>

            {/* =====================================================
                MAIN CONTENT
            ====================================================== */}

            <div className="grid gap-6 lg:grid-cols-7">
                {/* ================================================
                    VERIFICATION OVERVIEW
                ================================================= */}

                <Card className="lg:col-span-4 border-border/60 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-base">
                                Verification Overview
                            </CardTitle>

                            <p className="mt-1 text-xs text-muted-foreground">
                                Current resident verification status
                            </p>
                        </div>

                        <Button variant="ghost" size="sm" className="text-xs">
                            View all
                            <ArrowUpRight className="ml-1 size-3.5" />
                        </Button>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Progress */}

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">
                                    Verification completion
                                </span>

                                <span className="text-sm font-semibold">
                                    78.9%
                                </span>
                            </div>

                            <Progress value={78.9} className="h-2" />

                            <p className="text-xs text-muted-foreground">
                                9,842 of 12,480 residents have completed
                                verification.
                            </p>
                        </div>

                        <Separator />

                        {/* Status cards */}

                        <div className="grid gap-3 sm:grid-cols-3">
                            <div className="rounded-xl border bg-muted/20 p-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex size-8 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400">
                                        <Clock3 className="size-4" />
                                    </div>

                                    <span className="text-xs font-medium text-muted-foreground">
                                        Pending
                                    </span>
                                </div>

                                <p className="mt-3 text-xl font-bold">186</p>

                                <p className="text-xs text-muted-foreground">
                                    Requests
                                </p>
                            </div>

                            <div className="rounded-xl border bg-muted/20 p-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                                        <CheckCircle2 className="size-4" />
                                    </div>

                                    <span className="text-xs font-medium text-muted-foreground">
                                        Approved
                                    </span>
                                </div>

                                <p className="mt-3 text-xl font-bold">9,842</p>

                                <p className="text-xs text-muted-foreground">
                                    Residents
                                </p>
                            </div>

                            <div className="rounded-xl border bg-muted/20 p-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex size-8 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400">
                                        <XCircle className="size-4" />
                                    </div>

                                    <span className="text-xs font-medium text-muted-foreground">
                                        Rejected
                                    </span>
                                </div>

                                <p className="mt-3 text-xl font-bold">72</p>

                                <p className="text-xs text-muted-foreground">
                                    Requests
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* ================================================
                    RECENT REQUESTS
                ================================================= */}

                <Card className="lg:col-span-3 border-border/60 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-base">
                                Recent Requests
                            </CardTitle>

                            <p className="mt-1 text-xs text-muted-foreground">
                                Latest verification activity
                            </p>
                        </div>

                        <Button variant="ghost" size="icon">
                            <MoreHorizontal className="size-4" />
                        </Button>
                    </CardHeader>

                    <CardContent>
                        <div className="space-y-5">
                            <div className="flex items-center gap-3">
                                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <UserCheck className="size-4" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium">
                                        Juan Dela Cruz
                                    </p>

                                    <p className="text-xs text-muted-foreground">
                                        Philippine National ID
                                    </p>
                                </div>

                                <StatusBadge status="pending" />
                            </div>

                            <Separator />

                            <div className="flex items-center gap-3">
                                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <UserCheck className="size-4" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium">
                                        Maria Santos
                                    </p>

                                    <p className="text-xs text-muted-foreground">
                                        Driver's License
                                    </p>
                                </div>

                                <StatusBadge status="approved" />
                            </div>

                            <Separator />

                            <div className="flex items-center gap-3">
                                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <UserCheck className="size-4" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium">
                                        Pedro Garcia
                                    </p>

                                    <p className="text-xs text-muted-foreground">
                                        UMID
                                    </p>
                                </div>

                                <StatusBadge status="rejected" />
                            </div>

                            <Separator />

                            <div className="flex items-center gap-3">
                                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <UserCheck className="size-4" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium">
                                        Ana Reyes
                                    </p>

                                    <p className="text-xs text-muted-foreground">
                                        National ID
                                    </p>
                                </div>

                                <StatusBadge status="pending" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* =====================================================
                BOTTOM SECTION
            ====================================================== */}

            <div className="grid gap-6 lg:grid-cols-7">
                {/* ================================================
                    ACTIVITY
                ================================================= */}

                <Card className="lg:col-span-4 border-border/60 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base">
                            Recent Activity
                        </CardTitle>

                        <p className="mt-1 text-xs text-muted-foreground">
                            Latest actions across the platform
                        </p>
                    </CardHeader>

                    <CardContent>
                        <div className="space-y-5">
                            <ActivityItem
                                icon={CheckCircle2}
                                title="Verification approved"
                                description="Maria Santos' identity verification was approved."
                                time="5m ago"
                                iconClassName="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                            />

                            <ActivityItem
                                icon={UserCheck}
                                title="New verification request"
                                description="Juan Dela Cruz submitted an identity verification request."
                                time="18m ago"
                                iconClassName="bg-primary/10 text-primary"
                            />

                            <ActivityItem
                                icon={XCircle}
                                title="Verification rejected"
                                description="Pedro Garcia's verification was rejected."
                                time="42m ago"
                                iconClassName="bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400"
                            />

                            <ActivityItem
                                icon={Users}
                                title="New resident registered"
                                description="A new resident account was created."
                                time="1h ago"
                                iconClassName="bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* ================================================
                    SYSTEMS
                ================================================= */}

                <Card className="lg:col-span-3 border-border/60 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base">
                            Linked Systems
                        </CardTitle>

                        <p className="mt-1 text-xs text-muted-foreground">
                            Connected services available to residents
                        </p>
                    </CardHeader>

                    <CardContent>
                        <div className="space-y-4">
                            {[
                                {
                                    name: "Resident Portal",
                                    users: "8,421 users",
                                    active: true,
                                },
                                {
                                    name: "Student Portal",
                                    users: "5,218 users",
                                    active: true,
                                },
                                {
                                    name: "Health Services",
                                    users: "3,842 users",
                                    active: true,
                                },
                                {
                                    name: "Business Permit",
                                    users: "1,921 users",
                                    active: false,
                                },
                            ].map((system) => (
                                <div
                                    key={system.name}
                                    className="flex items-center gap-3"
                                >
                                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-muted/30">
                                        <Link2 className="size-4 text-muted-foreground" />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium">
                                            {system.name}
                                        </p>

                                        <p className="text-xs text-muted-foreground">
                                            {system.users}
                                        </p>
                                    </div>

                                    <span
                                        className={cn(
                                            "size-2 rounded-full",
                                            system.active
                                                ? "bg-emerald-500"
                                                : "bg-muted-foreground/40",
                                        )}
                                    />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

Dashboard.layout = (page: ReactPortal) => <AppLayout children={page} />;
