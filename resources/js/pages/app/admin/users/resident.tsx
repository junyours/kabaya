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
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import AppLayout from "@/layouts/app-layout";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import {
    CheckCircle2,
    Eye,
    Fingerprint,
    MapPin,
    MoreHorizontal,
    ShieldCheck,
    UserRound,
    UserRoundCheck,
    UserRoundX,
    Users,
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
    is_verified: number | null;
    is_resident: number | boolean | null;
};

type ResidentResponse = {
    data: Resident[];
    current_page: number;
    last_page: number;
    total: number;
};

function getFullName(resident: Resident) {
    return [
        resident.first_name,
        resident.middle_name,
        resident.last_name,
        resident.suffix,
    ]
        .filter(Boolean)
        .join(" ");
}

function VerificationBadge({ status }: { status: number | null }) {
    if (status === 1) {
        return (
            <Badge
                variant="outline"
                className="gap-1.5 rounded-full border-emerald-200 bg-emerald-50 px-2.5 py-1 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400"
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
                className="gap-1.5 rounded-full border-orange-200 bg-orange-50 px-2.5 py-1 text-orange-700 dark:border-orange-900 dark:bg-orange-950/40 dark:text-orange-400"
            >
                <ShieldCheck className="size-3.5" />
                Semi Verified
            </Badge>
        );
    }

    return (
        <Badge
            variant="outline"
            className="gap-1.5 rounded-full border-red-200 bg-red-50 px-2.5 py-1 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400"
        >
            <UserRoundX className="size-3.5" />
            Not Verified
        </Badge>
    );
}

function ResidencyBadge({
    isResident,
}: {
    isResident: number | boolean | null;
}) {
    if (isResident === 1 || isResident === true) {
        return (
            <Badge
                variant="outline"
                className="gap-1.5 rounded-full border-blue-200 bg-blue-50 px-2.5 py-1 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-400"
            >
                <UserRoundCheck className="size-3.5" />
                Resident
            </Badge>
        );
    }

    return (
        <Badge
            variant="outline"
            className="gap-1.5 rounded-full border-muted-foreground/20 bg-muted px-2.5 py-1 text-muted-foreground"
        >
            <UserRoundX className="size-3.5" />
            Not Resident
        </Badge>
    );
}

function DetailItem({ label, value }: { label: string; value: ReactNode }) {
    return (
        <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">{label}</p>
            <div className="break-words text-sm font-medium">
                {value || "Not available"}
            </div>
        </div>
    );
}

export default function Resident() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [selectedResident, setSelectedResident] = useState<Resident | null>(
        null,
    );
    const [detailsOpen, setDetailsOpen] = useState(false);

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

    const handleViewDetails = (resident: Resident) => {
        setSelectedResident(resident);
        setDetailsOpen(true);
    };

    const fetchResidents = async ({
        queryKey,
    }: {
        queryKey: readonly unknown[];
    }): Promise<ResidentResponse> => {
        const [, currentPage, currentSearch] = queryKey;

        const response = await axios.get("/admin/api/users/residents", {
            params: {
                page: currentPage,
                search: currentSearch,
            },
        });

        return response.data;
    };

    const { data, isLoading, isFetching, isError, refetch } = useQuery({
        queryKey: ["residents", page, debouncedSearch],
        queryFn: fetchResidents,
        placeholderData: (previousData) => previousData,
        staleTime: 30_000,
    });

    const columns = useMemo<ColumnDef<Resident>[]>(
        () => [
            {
                accessorKey: "id_number",
                header: "ID Number",
                cell: ({ row }) => (
                    <span className="font-mono text-xs font-medium">
                        {row.original.id_number || "N/A"}
                    </span>
                ),
            },
            {
                id: "resident",
                header: "Resident",
                cell: ({ row }) => {
                    const resident = row.original;

                    return (
                        <div className="flex min-w-[220px] items-center gap-3">
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                <UserRound className="size-4 text-primary" />
                            </div>

                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium">
                                    {resident.last_name}, {resident.first_name}
                                    {resident.middle_name
                                        ? ` ${resident.middle_name}`
                                        : ""}
                                    {resident.suffix
                                        ? `, ${resident.suffix}`
                                        : ""}
                                </p>

                                <p className="mt-0.5 text-xs text-muted-foreground">
                                    Resident ID #{resident.id}
                                </p>
                            </div>
                        </div>
                    );
                },
            },
            {
                accessorKey: "is_verified",
                header: "Verification",
                cell: ({ row }) => (
                    <VerificationBadge status={row.original.is_verified} />
                ),
            },
            {
                accessorKey: "is_resident",
                header: "Residency",
                cell: ({ row }) => (
                    <ResidencyBadge isResident={row.original.is_resident} />
                ),
            },
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
                                        className="size-8 rounded-lg"
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
                                        onSelect={() =>
                                            handleViewDetails(resident)
                                        }
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
                        Something went wrong while loading residents. Please try
                        again.
                    </p>

                    <Button
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        onClick={() => refetch()}
                    >
                        Try Again
                    </Button>
                </div>
            </Card>
        );
    }

    const fullyVerifiedCount =
        data?.data.filter((resident) => resident.is_verified === 1).length ?? 0;

    const pendingVerificationCount =
        data?.data.filter(
            (resident) =>
                resident.is_verified === 0 || resident.is_verified === null,
        ).length ?? 0;

    return (
        <div className="space-y-5">
            <div className="flex flex-col gap-1">
                <h1 className="text-xl font-semibold tracking-tight">
                    Residents
                </h1>

                <p className="text-sm text-muted-foreground">
                    Manage resident records and verification status.
                </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
                <Card className="border-border/60 shadow-sm">
                    <div className="flex items-center gap-3 p-4">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                            <Users className="size-5 text-primary" />
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

                            <p className="text-lg font-semibold">
                                {fullyVerifiedCount}
                            </p>
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
                                Not Fully Verified
                            </p>

                            <p className="text-lg font-semibold">
                                {pendingVerificationCount}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

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

            <Sheet open={detailsOpen} onOpenChange={setDetailsOpen}>
                <SheetContent
                    side="right"
                    className="flex w-full flex-col overflow-y-auto sm:max-w-lg"
                >
                    {selectedResident && (
                        <>
                            <SheetHeader className="pr-8">
                                <div className="mb-2 flex size-12 items-center justify-center rounded-xl bg-primary/10">
                                    <UserRound className="size-6 text-primary" />
                                </div>

                                <SheetTitle className="text-xl">
                                    Resident Details
                                </SheetTitle>

                                <SheetDescription>
                                    View the resident's profile, verification
                                    status, and residency information.
                                </SheetDescription>
                            </SheetHeader>

                            <div className="mt-6 space-y-6">
                                <div className="flex items-start gap-3 rounded-xl border bg-muted/30 p-4">
                                    <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                        <UserRound className="size-5 text-primary" />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <h3 className="break-words font-semibold">
                                            {getFullName(selectedResident)}
                                        </h3>

                                        <p className="mt-1 text-xs text-muted-foreground">
                                            Resident ID #{selectedResident.id}
                                        </p>

                                        <p className="mt-1 font-mono text-xs text-muted-foreground">
                                            {selectedResident.id_number ||
                                                "No ID number"}
                                        </p>
                                    </div>
                                </div>

                                <section className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Fingerprint className="size-4 text-primary" />
                                        <h3 className="text-sm font-semibold">
                                            Personal Information
                                        </h3>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <DetailItem
                                            label="First Name"
                                            value={selectedResident.first_name}
                                        />

                                        <DetailItem
                                            label="Middle Name"
                                            value={selectedResident.middle_name}
                                        />

                                        <DetailItem
                                            label="Last Name"
                                            value={selectedResident.last_name}
                                        />

                                        <DetailItem
                                            label="Suffix"
                                            value={selectedResident.suffix}
                                        />

                                        <DetailItem
                                            label="Resident Record ID"
                                            value={`#${selectedResident.id}`}
                                        />

                                        <DetailItem
                                            label="ID Number"
                                            value={selectedResident.id_number}
                                        />
                                    </div>
                                </section>

                                <Separator />

                                <section className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck className="size-4 text-primary" />
                                        <h3 className="text-sm font-semibold">
                                            Verification Status
                                        </h3>
                                    </div>

                                    <div className="rounded-xl border p-4">
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium">
                                                    Account Verification
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Resident identity
                                                    verification level
                                                </p>
                                            </div>

                                            <VerificationBadge
                                                status={
                                                    selectedResident.is_verified
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="rounded-xl border p-4">
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium">
                                                    Residency Status
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Resident eligibility status
                                                </p>
                                            </div>

                                            <ResidencyBadge
                                                isResident={
                                                    selectedResident.is_resident
                                                }
                                            />
                                        </div>
                                    </div>
                                </section>

                                <Separator />

                                <section className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="size-4 text-primary" />
                                        <h3 className="text-sm font-semibold">
                                            Residency Information
                                        </h3>
                                    </div>

                                    <div className="rounded-xl border border-dashed p-4">
                                        <div className="flex gap-3">
                                            <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

                                            <div>
                                                <p className="text-sm font-medium">
                                                    Municipality / Address
                                                </p>
                                                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                                    Detailed address information
                                                    is not included in the
                                                    current residents API
                                                    response. Only the residency
                                                    status is available here.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <div className="rounded-lg bg-muted/50 p-3">
                                    <p className="text-xs leading-relaxed text-muted-foreground">
                                        This information reflects the resident
                                        data returned by the current API.
                                        Additional profile fields can be
                                        displayed when the API includes them.
                                    </p>
                                </div>

                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => setDetailsOpen(false)}
                                >
                                    Close Details
                                </Button>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}

Resident.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
