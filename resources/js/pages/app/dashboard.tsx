import AppLayout from "@/layouts/app-layout";
import { Link } from "@inertiajs/react";
import React, { ReactPortal } from "react";

import {
    ArrowUpRight,
    CheckCircle2,
    Clock3,
    Link2,
    MoreHorizontal,
    ShieldCheck,
    UserCheck,
    Users,
    UserX,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";

import { Separator } from "@/components/ui/separator";

import { Progress } from "@/components/ui/progress";

import { cn } from "@/lib/utils";

/*
|--------------------------------------------------------------------------
| TYPES
|--------------------------------------------------------------------------
*/

type VerificationStatus = "not_verified" | "semi_verified" | "fully_verified";

type DashboardProps = {
    dashboard: {
        statistics: {
            total_residents: number;

            not_verified: number;

            semi_verified: number;

            fully_verified: number;

            total_systems: number;

            active_systems: number;
        };

        verification: {
            percentage: number;

            total: number;

            not_verified: number;

            semi_verified: number;

            fully_verified: number;
        };

        recent_requests: {
            id: number;

            name: string;

            id_type: string;

            status: VerificationStatus;

            created_at: string | null;
        }[];

        recent_activity: {
            id: number;

            status: VerificationStatus;

            title: string;

            description: string;

            created_at: string | null;
        }[];

        systems: {
            id: number;

            name: string;

            href: string | null;

            active: boolean;
        }[];
    };
};

/*
|--------------------------------------------------------------------------
| STAT CARD
|--------------------------------------------------------------------------
*/

type StatCardProps = {
    title: string;

    value: string;

    description: string;

    icon: React.ElementType;

    iconClassName?: string;
};

function StatCard({
    title,
    value,
    description,
    icon: Icon,
    iconClassName,
}: StatCardProps) {
    return (
        <Card
            className="
                border-border/60
                shadow-sm
                transition-shadow
                hover:shadow-md
            "
        >
            <CardContent className="p-5">
                <div className="flex items-start justify-between">
                    <div className="space-y-3">
                        <p
                            className="
                                text-sm
                                font-medium
                                text-muted-foreground
                            "
                        >
                            {title}
                        </p>

                        <div>
                            <h3
                                className="
                                    text-2xl
                                    font-bold
                                    tracking-tight
                                "
                            >
                                {value}
                            </h3>
                        </div>

                        <p
                            className="
                                text-xs
                                text-muted-foreground
                            "
                        >
                            {description}
                        </p>
                    </div>

                    <div
                        className={cn(
                            `
                                flex
                                size-11
                                items-center
                                justify-center
                                rounded-xl
                                bg-muted
                            `,
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

/*
|--------------------------------------------------------------------------
| STATUS BADGE
|--------------------------------------------------------------------------
*/

function StatusBadge({ status }: { status: VerificationStatus }) {
    const config = {
        not_verified: {
            label: "Not Verified",

            className: `
                    border-orange-200
                    bg-orange-50
                    text-orange-700
                    dark:border-orange-900
                    dark:bg-orange-950/40
                    dark:text-orange-400
                `,

            dot: "bg-orange-500",
        },

        semi_verified: {
            label: "Semi Verified",

            className: `
                    border-blue-200
                    bg-blue-50
                    text-blue-700
                    dark:border-blue-900
                    dark:bg-blue-950/40
                    dark:text-blue-400
                `,

            dot: "bg-blue-500",
        },

        fully_verified: {
            label: "Fully Verified",

            className: `
                    border-emerald-200
                    bg-emerald-50
                    text-emerald-700
                    dark:border-emerald-900
                    dark:bg-emerald-950/40
                    dark:text-emerald-400
                `,

            dot: "bg-emerald-500",
        },
    };

    const item = config[status];

    return (
        <Badge
            variant="outline"
            className={cn(
                `
                    gap-1.5
                    rounded-full
                    px-2.5
                    py-1
                    text-xs
                    font-medium
                `,
                item.className,
            )}
        >
            <span className={cn("size-1.5 rounded-full", item.dot)} />

            {item.label}
        </Badge>
    );
}

/*
|--------------------------------------------------------------------------
| ACTIVITY ITEM
|--------------------------------------------------------------------------
*/

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
                    `
                        flex
                        size-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-muted
                    `,
                    iconClassName,
                )}
            >
                <Icon className="size-4" />
            </div>

            <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{title}</p>

                <p
                    className="
                        mt-0.5
                        text-xs
                        text-muted-foreground
                    "
                >
                    {description}
                </p>
            </div>

            <span
                className="
                    shrink-0
                    text-[11px]
                    text-muted-foreground
                "
            >
                {time}
            </span>
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| TIME AGO
|--------------------------------------------------------------------------
*/

function formatTimeAgo(date: string | null) {
    if (!date) {
        return "";
    }

    const now = new Date();

    const past = new Date(date);

    const difference = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (difference < 60) {
        return "Just now";
    }

    const minutes = Math.floor(difference / 60);

    if (minutes < 60) {
        return `${minutes}m ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
        return `${hours}h ago`;
    }

    const days = Math.floor(hours / 24);

    if (days < 7) {
        return `${days}d ago`;
    }

    const weeks = Math.floor(days / 7);

    if (weeks < 4) {
        return `${weeks}w ago`;
    }

    return past.toLocaleDateString();
}

/*
|--------------------------------------------------------------------------
| DASHBOARD
|--------------------------------------------------------------------------
*/

export default function Dashboard({ dashboard }: DashboardProps) {
    const {
        statistics,
        verification,
        recent_requests,
        recent_activity,
        systems,
    } = dashboard;

    /*
    |--------------------------------------------------------------------------
    | ACTIVITY CONFIG
    |--------------------------------------------------------------------------
    */

    const activityConfig = {
        not_verified: {
            icon: Clock3,

            className: `
                    bg-orange-50
                    text-orange-600
                    dark:bg-orange-950/40
                    dark:text-orange-400
                `,
        },

        semi_verified: {
            icon: UserCheck,

            className: `
                    bg-blue-50
                    text-blue-600
                    dark:bg-blue-950/40
                    dark:text-blue-400
                `,
        },

        fully_verified: {
            icon: CheckCircle2,

            className: `
                    bg-emerald-50
                    text-emerald-600
                    dark:bg-emerald-950/40
                    dark:text-emerald-400
                `,
        },
    };

    return (
        <div className="space-y-6">
            {/* =====================================================
                HEADER
            ====================================================== */}

            <div
                className="
                    flex
                    flex-col
                    gap-4
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
            >
                <div>
                    <h1
                        className="
                            text-2xl
                            font-bold
                            tracking-tight
                        "
                    >
                        Dashboard
                    </h1>

                    <p
                        className="
                            mt-1
                            text-sm
                            text-muted-foreground
                        "
                    >
                        Welcome back. Here's an overview of your platform.
                    </p>
                </div>

                <Button variant="outline" className="gap-2" asChild>
                    <Link href="/residents">
                        View Residents
                        <ArrowUpRight className="size-4" />
                    </Link>
                </Button>
            </div>

            {/* =====================================================
                STATISTICS
            ====================================================== */}

            <div
                className="
                    grid
                    gap-4
                    sm:grid-cols-2
                    xl:grid-cols-4
                "
            >
                <StatCard
                    title="Total Residents"
                    value={statistics.total_residents.toLocaleString()}
                    description="Registered residents"
                    icon={Users}
                    iconClassName="
                        bg-primary/10
                        text-primary
                    "
                />

                <StatCard
                    title="Not Verified"
                    value={statistics.not_verified.toLocaleString()}
                    description="Awaiting verification"
                    icon={Clock3}
                    iconClassName="
                        bg-orange-50
                        text-orange-600
                        dark:bg-orange-950/40
                        dark:text-orange-400
                    "
                />

                <StatCard
                    title="Fully Verified"
                    value={statistics.fully_verified.toLocaleString()}
                    description="Successfully verified"
                    icon={ShieldCheck}
                    iconClassName="
                        bg-emerald-50
                        text-emerald-600
                        dark:bg-emerald-950/40
                        dark:text-emerald-400
                    "
                />

                <StatCard
                    title="Linked Systems"
                    value={statistics.total_systems.toLocaleString()}
                    description={`${statistics.active_systems} active services`}
                    icon={Link2}
                    iconClassName="
                        bg-blue-50
                        text-blue-600
                        dark:bg-blue-950/40
                        dark:text-blue-400
                    "
                />
            </div>

            {/* =====================================================
                MAIN CONTENT
            ====================================================== */}

            <div
                className="
                    grid
                    gap-6
                    lg:grid-cols-7
                "
            >
                {/* =================================================
                    VERIFICATION OVERVIEW
                ================================================== */}

                <Card
                    className="
                        border-border/60
                        shadow-sm
                        lg:col-span-4
                    "
                >
                    <CardHeader
                        className="
                            flex
                            flex-row
                            items-center
                            justify-between
                        "
                    >
                        <div>
                            <CardTitle className="text-base">
                                Verification Overview
                            </CardTitle>

                            <p
                                className="
                                    mt-1
                                    text-xs
                                    text-muted-foreground
                                "
                            >
                                Current resident verification status
                            </p>
                        </div>

                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs"
                            asChild
                        >
                            <Link href="/residents">
                                View all
                                <ArrowUpRight
                                    className="
                                        ml-1
                                        size-3.5
                                    "
                                />
                            </Link>
                        </Button>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* PROGRESS */}

                        <div className="space-y-2">
                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                "
                            >
                                <span
                                    className="
                                        text-sm
                                        font-medium
                                    "
                                >
                                    Full verification completion
                                </span>

                                <span
                                    className="
                                        text-sm
                                        font-semibold
                                    "
                                >
                                    {verification.percentage}%
                                </span>
                            </div>

                            <Progress
                                value={verification.percentage}
                                className="h-2"
                            />

                            <p
                                className="
                                    text-xs
                                    text-muted-foreground
                                "
                            >
                                {verification.fully_verified.toLocaleString()}

                                {" of "}

                                {verification.total.toLocaleString()}

                                {" residents are fully verified."}
                            </p>
                        </div>

                        <Separator />

                        {/* STATUS CARDS */}

                        <div
                            className="
                                grid
                                gap-3
                                sm:grid-cols-3
                            "
                        >
                            {/* NOT VERIFIED */}

                            <div
                                className="
                                    rounded-xl
                                    border
                                    bg-muted/20
                                    p-4
                                "
                            >
                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                    "
                                >
                                    <div
                                        className="
                                            flex
                                            size-8
                                            items-center
                                            justify-center
                                            rounded-lg
                                            bg-orange-100
                                            text-orange-600
                                            dark:bg-orange-950/50
                                            dark:text-orange-400
                                        "
                                    >
                                        <Clock3 className="size-4" />
                                    </div>

                                    <span
                                        className="
                                            text-xs
                                            font-medium
                                            text-muted-foreground
                                        "
                                    >
                                        Not Verified
                                    </span>
                                </div>

                                <p
                                    className="
                                        mt-3
                                        text-xl
                                        font-bold
                                    "
                                >
                                    {verification.not_verified.toLocaleString()}
                                </p>

                                <p
                                    className="
                                        text-xs
                                        text-muted-foreground
                                    "
                                >
                                    Residents
                                </p>
                            </div>

                            {/* SEMI VERIFIED */}

                            <div
                                className="
                                    rounded-xl
                                    border
                                    bg-muted/20
                                    p-4
                                "
                            >
                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                    "
                                >
                                    <div
                                        className="
                                            flex
                                            size-8
                                            items-center
                                            justify-center
                                            rounded-lg
                                            bg-blue-100
                                            text-blue-600
                                            dark:bg-blue-950/50
                                            dark:text-blue-400
                                        "
                                    >
                                        <UserCheck className="size-4" />
                                    </div>

                                    <span
                                        className="
                                            text-xs
                                            font-medium
                                            text-muted-foreground
                                        "
                                    >
                                        Semi Verified
                                    </span>
                                </div>

                                <p
                                    className="
                                        mt-3
                                        text-xl
                                        font-bold
                                    "
                                >
                                    {verification.semi_verified.toLocaleString()}
                                </p>

                                <p
                                    className="
                                        text-xs
                                        text-muted-foreground
                                    "
                                >
                                    Residents
                                </p>
                            </div>

                            {/* FULLY VERIFIED */}

                            <div
                                className="
                                    rounded-xl
                                    border
                                    bg-muted/20
                                    p-4
                                "
                            >
                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                    "
                                >
                                    <div
                                        className="
                                            flex
                                            size-8
                                            items-center
                                            justify-center
                                            rounded-lg
                                            bg-emerald-100
                                            text-emerald-600
                                            dark:bg-emerald-950/50
                                            dark:text-emerald-400
                                        "
                                    >
                                        <CheckCircle2 className="size-4" />
                                    </div>

                                    <span
                                        className="
                                            text-xs
                                            font-medium
                                            text-muted-foreground
                                        "
                                    >
                                        Fully Verified
                                    </span>
                                </div>

                                <p
                                    className="
                                        mt-3
                                        text-xl
                                        font-bold
                                    "
                                >
                                    {verification.fully_verified.toLocaleString()}
                                </p>

                                <p
                                    className="
                                        text-xs
                                        text-muted-foreground
                                    "
                                >
                                    Residents
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* =================================================
                    RECENT REQUESTS
                ================================================== */}

                <Card
                    className="
                        border-border/60
                        shadow-sm
                        lg:col-span-3
                    "
                >
                    <CardHeader
                        className="
                            flex
                            flex-row
                            items-center
                            justify-between
                        "
                    >
                        <div>
                            <CardTitle className="text-base">
                                Recent Residents
                            </CardTitle>

                            <p
                                className="
                                    mt-1
                                    text-xs
                                    text-muted-foreground
                                "
                            >
                                Latest resident verification activity
                            </p>
                        </div>

                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/residents">
                                <MoreHorizontal className="size-4" />
                            </Link>
                        </Button>
                    </CardHeader>

                    <CardContent>
                        <div className="space-y-5">
                            {recent_requests.length === 0 && (
                                <p
                                    className="
                                        py-6
                                        text-center
                                        text-sm
                                        text-muted-foreground
                                    "
                                >
                                    No recent residents found.
                                </p>
                            )}

                            {recent_requests.map((request, index) => (
                                <div key={request.id}>
                                    <div
                                        className="
                                                flex
                                                items-center
                                                gap-3
                                            "
                                    >
                                        <div
                                            className="
                                                    flex
                                                    size-9
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-full
                                                    bg-primary/10
                                                    text-primary
                                                "
                                        >
                                            <UserCheck className="size-4" />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p
                                                className="
                                                        truncate
                                                        text-sm
                                                        font-medium
                                                    "
                                            >
                                                {request.name}
                                            </p>

                                            <p
                                                className="
                                                        text-xs
                                                        text-muted-foreground
                                                    "
                                            >
                                                {request.id_type}
                                            </p>
                                        </div>

                                        <StatusBadge status={request.status} />
                                    </div>

                                    {index < recent_requests.length - 1 && (
                                        <Separator className="mt-5" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* =====================================================
                BOTTOM SECTION
            ====================================================== */}

            <div
                className="
                    grid
                    gap-6
                    lg:grid-cols-7
                "
            >
                {/* =================================================
                    RECENT ACTIVITY
                ================================================== */}

                <Card
                    className="
                        border-border/60
                        shadow-sm
                        lg:col-span-4
                    "
                >
                    <CardHeader>
                        <CardTitle className="text-base">
                            Recent Activity
                        </CardTitle>

                        <p
                            className="
                                mt-1
                                text-xs
                                text-muted-foreground
                            "
                        >
                            Latest actions across the platform
                        </p>
                    </CardHeader>

                    <CardContent>
                        <div className="space-y-5">
                            {recent_activity.length === 0 && (
                                <p
                                    className="
                                        py-6
                                        text-center
                                        text-sm
                                        text-muted-foreground
                                    "
                                >
                                    No recent activity found.
                                </p>
                            )}

                            {recent_activity.map((activity) => {
                                const config = activityConfig[activity.status];

                                return (
                                    <ActivityItem
                                        key={activity.id}
                                        icon={config.icon}
                                        title={activity.title}
                                        description={activity.description}
                                        time={formatTimeAgo(
                                            activity.created_at,
                                        )}
                                        iconClassName={config.className}
                                    />
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* =================================================
                    LINKED SYSTEMS
                ================================================== */}

                <Card
                    className="
                        border-border/60
                        shadow-sm
                        lg:col-span-3
                    "
                >
                    <CardHeader>
                        <CardTitle className="text-base">
                            Linked Systems
                        </CardTitle>

                        <p
                            className="
                                mt-1
                                text-xs
                                text-muted-foreground
                            "
                        >
                            Connected services available to residents
                        </p>
                    </CardHeader>

                    <CardContent>
                        <div className="space-y-4">
                            {systems.length === 0 && (
                                <p
                                    className="
                                        py-6
                                        text-center
                                        text-sm
                                        text-muted-foreground
                                    "
                                >
                                    No linked systems found.
                                </p>
                            )}

                            {systems.map((system) => (
                                <div
                                    key={system.id}
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                    "
                                >
                                    <div
                                        className="
                                            flex
                                            size-9
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-lg
                                            border
                                            bg-muted/30
                                        "
                                    >
                                        <Link2
                                            className="
                                                size-4
                                                text-muted-foreground
                                            "
                                        />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p
                                            className="
                                                truncate
                                                text-sm
                                                font-medium
                                            "
                                        >
                                            {system.name}
                                        </p>

                                        <p
                                            className="
                                                text-xs
                                                text-muted-foreground
                                            "
                                        >
                                            {system.active
                                                ? "Active"
                                                : "Inactive"}
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
