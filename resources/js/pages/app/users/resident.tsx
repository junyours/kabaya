import { DataTable } from "@/components/table/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AppLayout from "@/layouts/app-layout";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import {
    CheckCircle2,
    Eye,
    MoreHorizontal,
    ShieldCheck,
    UserRound,
    UserRoundCheck,
    UserRoundX,
} from "lucide-react";
import { ReactNode, useEffect, useMemo, useState } from "react";
import debounce from "lodash/debounce";

type Resident = {
    id: number;
    id_number: string;
    last_name: string;
    first_name: string;
    middle_name: string | null;
    suffix: string | null;
    is_verified: number;
    is_resident: number;
};

type ResidentResponse = {
    data: Resident[];
    current_page: number;
    last_page: number;
    total: number;
};

export default function Resident() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    /*
     * ----------------------------------------
     * Search
     * ----------------------------------------
     */

    const debouncedSearchFn = useMemo(
        () =>
            debounce((value: string) => {
                setDebouncedSearch(value);
                setPage(1);
            }, 500),
        [],
    );

    useEffect(() => {
        return () => {
            debouncedSearchFn.cancel();
        };
    }, [debouncedSearchFn]);

    const handleSearch = (value: string) => {
        setSearch(value);
        debouncedSearchFn(value);
    };

    /*
     * ----------------------------------------
     * Fetch Residents
     * ----------------------------------------
     */

    const fetchResidents = async ({
        queryKey,
    }: {
        queryKey: readonly unknown[];
    }): Promise<ResidentResponse> => {
        const [, currentPage, currentSearch] = queryKey;

        const response = await axios.get("/api/users/residents", {
            params: {
                page: currentPage,
                search: currentSearch,
            },
        });

        return response.data;
    };

    const { data, isLoading, isFetching, isError } = useQuery({
        queryKey: ["residents", page, debouncedSearch],
        queryFn: fetchResidents,

        // Keep the previous page visible while loading
        // the next page.
        placeholderData: (previousData) => previousData,

        staleTime: 30_000,
    });

    /*
     * ----------------------------------------
     * Columns
     * ----------------------------------------
     */

    const columns = useMemo<ColumnDef<Resident>[]>(
        () => [
            /*
             * ID Number
             */
            {
                accessorKey: "id_number",
                header: "ID Number",

                cell: ({ row }) => (
                    <span className="font-mono text-xs font-medium">
                        {row.original.id_number}
                    </span>
                ),
            },

            /*
             * Resident
             *
             * Combine first + middle + last name
             * into a cleaner presentation.
             */
            {
                id: "resident",
                header: "Resident",

                cell: ({ row }) => {
                    const resident = row.original;

                    const middleName = resident.middle_name
                        ? ` ${resident.middle_name}`
                        : "";

                    const suffix = resident.suffix
                        ? `, ${resident.suffix}`
                        : "";

                    return (
                        <div className="flex min-w-[220px] items-center gap-3">
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                <UserRound className="size-4 text-primary" />
                            </div>

                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium">
                                    {resident.last_name}, {resident.first_name}
                                    {middleName}
                                    {suffix}
                                </p>

                                <p className="mt-0.5 text-xs text-muted-foreground">
                                    Resident ID #{resident.id}
                                </p>
                            </div>
                        </div>
                    );
                },
            },

            /*
             * Verification Status
             */
            {
                accessorKey: "is_verified",
                header: "Verification",

                cell: ({ row }) => {
                    const status = row.original.is_verified;

                    if (status === 1) {
                        return (
                            <Badge
                                variant="outline"
                                className="
                                    gap-1.5
                                    rounded-full
                                    border-emerald-200
                                    bg-emerald-50
                                    px-2.5
                                    py-1
                                    text-emerald-700
                                    dark:border-emerald-900
                                    dark:bg-emerald-950/40
                                    dark:text-emerald-400
                                "
                            >
                                <CheckCircle2 className="size-3.5" />
                                Fully Verified
                            </Badge>
                        );
                    }

                    if (status === 0) {
                        return (
                            <Badge
                                variant="outline"
                                className="
                                    gap-1.5
                                    rounded-full
                                    border-orange-200
                                    bg-orange-50
                                    px-2.5
                                    py-1
                                    text-orange-700
                                    dark:border-orange-900
                                    dark:bg-orange-950/40
                                    dark:text-orange-400
                                "
                            >
                                <ShieldCheck className="size-3.5" />
                                Semi Verified
                            </Badge>
                        );
                    }

                    return (
                        <Badge
                            variant="outline"
                            className="
                                gap-1.5
                                rounded-full
                                border-red-200
                                bg-red-50
                                px-2.5
                                py-1
                                text-red-700
                                dark:border-red-900
                                dark:bg-red-950/40
                                dark:text-red-400
                            "
                        >
                            <UserRoundX className="size-3.5" />
                            Not Verified
                        </Badge>
                    );
                },
            },

            /*
             * Residential Status
             */
            {
                accessorKey: "is_resident",
                header: "Residency",

                cell: ({ row }) => {
                    const isResident = row.original.is_resident === 1;

                    return isResident ? (
                        <Badge
                            variant="outline"
                            className="
                                gap-1.5
                                rounded-full
                                border-blue-200
                                bg-blue-50
                                px-2.5
                                py-1
                                text-blue-700
                                dark:border-blue-900
                                dark:bg-blue-950/40
                                dark:text-blue-400
                            "
                        >
                            <UserRoundCheck className="size-3.5" />
                            Resident
                        </Badge>
                    ) : (
                        <Badge
                            variant="outline"
                            className="
                                gap-1.5
                                rounded-full
                                border-muted-foreground/20
                                bg-muted
                                px-2.5
                                py-1
                                text-muted-foreground
                            "
                        >
                            <UserRoundX className="size-3.5" />
                            Not Resident
                        </Badge>
                    );
                },
            },

            /*
             * Actions
             */
            {
                id: "actions",
                header: "",

                cell: ({ row }) => {
                    const resident = row.original;

                    return (
                        <div className="flex justify-end">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="
                                            size-8
                                            rounded-lg
                                        "
                                    >
                                        <MoreHorizontal className="size-4" />

                                        <span className="sr-only">
                                            Open actions
                                        </span>
                                    </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent
                                    align="end"
                                    className="w-48"
                                >
                                    <DropdownMenuLabel className="text-xs text-muted-foreground">
                                        Resident Actions
                                    </DropdownMenuLabel>

                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem
                                        className="gap-2"
                                        onClick={() => {
                                            console.log(
                                                "View resident:",
                                                resident.id,
                                            );
                                        }}
                                    >
                                        <Eye className="size-4" />
                                        View Details
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    );
                },
            },
        ],
        [],
    );

    /*
     * ----------------------------------------
     * Error
     * ----------------------------------------
     */

    if (isError) {
        return (
            <Card className="border-destructive/30 p-6">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
                        <UserRoundX className="size-6 text-destructive" />
                    </div>

                    <h3 className="mt-4 text-sm font-semibold">
                        Unable to load residents
                    </h3>

                    <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                        Something went wrong while loading the residents. Please
                        try again.
                    </p>

                    <Button
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        onClick={() => window.location.reload()}
                    >
                        Try Again
                    </Button>
                </div>
            </Card>
        );
    }

    return (
        <div className="space-y-5">
            {/* Page Header */}
            <div className="flex flex-col gap-1">
                <h1 className="text-xl font-semibold tracking-tight">
                    Residents
                </h1>

                <p className="text-sm text-muted-foreground">
                    Manage resident records and verification status.
                </p>
            </div>

            {/* Statistics */}
            <div className="grid gap-3 sm:grid-cols-3">
                <Card className="border-border/60 shadow-sm">
                    <div className="flex items-center gap-3 p-4">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                            <UserRound className="size-5 text-primary" />
                        </div>

                        <div>
                            <p className="text-xs text-muted-foreground">
                                Total Residents
                            </p>

                            <p className="text-lg font-semibold">
                                {data?.total ?? 0}
                            </p>
                        </div>
                    </div>
                </Card>

                <Card className="border-border/60 shadow-sm">
                    <div className="flex items-center gap-3 p-4">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10">
                            <CheckCircle2 className="size-5 text-emerald-600" />
                        </div>

                        <div>
                            <p className="text-xs text-muted-foreground">
                                Fully Verified
                            </p>

                            <p className="text-lg font-semibold">—</p>
                        </div>
                    </div>
                </Card>

                <Card className="border-border/60 shadow-sm">
                    <div className="flex items-center gap-3 p-4">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-orange-500/10">
                            <ShieldCheck className="size-5 text-orange-600" />
                        </div>

                        <div>
                            <p className="text-xs text-muted-foreground">
                                Pending Verification
                            </p>

                            <p className="text-lg font-semibold">—</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Residents Table */}
            <Card className="overflow-hidden border-border/60 shadow-sm">
                <div className="p-4 sm:p-6">
                    <DataTable
                        columns={columns}
                        data={data?.data ?? []}
                        page={page}
                        lastPage={data?.last_page ?? 1}
                        setPage={setPage}
                        search={search}
                        setSearch={handleSearch}
                        isLoading={isLoading || isFetching}
                        searchPlaceholder="Search residents..."
                        emptyMessage="No residents found."
                        emptyDescription={
                            search
                                ? "Try adjusting your search criteria."
                                : "There are no resident records to display."
                        }
                    />
                </div>
            </Card>
        </div>
    );
}

Resident.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
