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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";

import AppLayout from "@/layouts/app-layout";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { ColumnDef } from "@tanstack/react-table";

import axios from "axios";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    AlertCircle,
    Check,
    ExternalLink,
    FileCheck2,
    FileImage,
    Loader2,
    MoreHorizontal,
    ShieldCheck,
    UserRound,
    UserRoundCheck,
    UserRoundX,
    X,
} from "lucide-react";

import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";

import debounce from "lodash/debounce";

/*
|--------------------------------------------------------------------------
| Types
|--------------------------------------------------------------------------
*/

interface UserVerification {
    id: number;

    id_type: string;
    id_number: string;

    first_name: string;
    middle_name: string | null;
    last_name: string;

    date_of_birth: string;
    address: string | null;

    id_front_image: string | null;
    id_back_image: string | null;
    face_image: string | null;

    status: "pending" | "approved" | "rejected";

    remarks: string | null;

    verified_at: string | null;
    rejected_at: string | null;
}

interface User {
    id: number;

    id_number: string;

    first_name: string;
    middle_name: string | null;
    last_name: string;
    suffix: string | null;

    sex: string | null;
    marital_status: string | null;
    birth_date: string | null;
    religion: string | null;

    profile_picture: string | null;

    mobile_number: string | null;
    mobile_verified_at: string | null;

    email: string | null;
    email_verified_at: string | null;

    province: string | null;
    municipality: string | null;
    barangay: string | null;
    street_name: string | null;
    postal_code: string | null;

    is_verified: number | null;

    latest_verification: UserVerification | null;
}

interface PaginatedResponse {
    data: User[];
    current_page: number;
    last_page: number;
    total: number;
}

/*
|--------------------------------------------------------------------------
| Google Drive image
|--------------------------------------------------------------------------
*/

const googleDriveImage = (fileId: string | null | undefined) => {
    if (!fileId) {
        return null;
    }

    return `https://lh3.googleusercontent.com/d/${fileId}`;
};

/*
|--------------------------------------------------------------------------
| Full name
|--------------------------------------------------------------------------
*/

function getFullName(user: User) {
    return [user.first_name, user.middle_name, user.last_name, user.suffix]
        .filter(Boolean)
        .join(" ");
}

/*
|--------------------------------------------------------------------------
| Verification Status Badge
|--------------------------------------------------------------------------
*/

function StatusBadge({
    status,
}: {
    status?: UserVerification["status"] | null;
}) {
    if (!status) {
        return (
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
                <span className="size-1.5 rounded-full bg-muted-foreground" />
                No Request
            </Badge>
        );
    }

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
    }[status];

    return (
        <Badge
            variant="outline"
            className={`
                gap-1.5
                rounded-full
                px-2.5
                py-1
                text-xs
                font-medium
                ${config.className}
            `}
        >
            <span className={`size-1.5 rounded-full ${config.dot}`} />

            {config.label}
        </Badge>
    );
}

/*
|--------------------------------------------------------------------------
| Columns
|--------------------------------------------------------------------------
*/

function createColumns(onView: (user: User) => void): ColumnDef<User>[] {
    return [
        /*
         * Resident
         */
        {
            id: "resident",
            header: "Resident",

            cell: ({ row }) => {
                const user = row.original;

                return (
                    <div className="flex min-w-[240px] items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-muted">
                            {user.profile_picture ? (
                                <img
                                    src={
                                        googleDriveImage(
                                            user.profile_picture,
                                        ) ?? ""
                                    }
                                    alt={getFullName(user)}
                                    className="size-full object-cover"
                                />
                            ) : (
                                <UserRound className="size-5 text-muted-foreground" />
                            )}
                        </div>

                        <div className="min-w-0">
                            <p className="truncate text-sm font-medium">
                                {getFullName(user)}
                            </p>

                            <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                                {user.id_number}
                            </p>
                        </div>
                    </div>
                );
            },
        },

        /*
         * ID Type
         */
        {
            id: "id_type",
            header: "ID Type",

            cell: ({ row }) => {
                const verification = row.original.latest_verification;

                return verification?.id_type ? (
                    <div className="flex items-center gap-2">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                            <FileCheck2 className="size-4 text-primary" />
                        </div>

                        <div>
                            <p className="text-sm font-medium">
                                {verification.id_type}
                            </p>

                            <p className="font-mono text-[11px] text-muted-foreground">
                                {verification.id_number}
                            </p>
                        </div>
                    </div>
                ) : (
                    <span className="text-sm text-muted-foreground">N/A</span>
                );
            },
        },

        /*
         * Status
         */
        {
            id: "status",
            header: "Status",

            cell: ({ row }) => (
                <StatusBadge
                    status={row.original.latest_verification?.status}
                />
            ),
        },

        /*
         * Submitted
         */
        {
            id: "submitted",
            header: "Submitted",

            cell: ({ row }) => {
                const verification = row.original.latest_verification;

                if (!verification) {
                    return (
                        <span className="text-sm text-muted-foreground">—</span>
                    );
                }

                if (verification.status === "approved") {
                    return (
                        <span className="text-sm text-muted-foreground">
                            Completed
                        </span>
                    );
                }

                if (verification.status === "rejected") {
                    return (
                        <span className="text-sm text-muted-foreground">
                            Review required
                        </span>
                    );
                }

                return (
                    <span className="text-sm text-muted-foreground">
                        Pending review
                    </span>
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
                const user = row.original;

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

                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel className="text-xs text-muted-foreground">
                                    Verification
                                </DropdownMenuLabel>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem
                                    onClick={() => onView(user)}
                                    className="gap-2"
                                >
                                    <FileCheck2 className="size-4" />
                                    Review Details
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
        },
    ];
}

/*
|--------------------------------------------------------------------------
| Main
|--------------------------------------------------------------------------
*/

export default function UserVerification() {
    const queryClient = useQueryClient();

    const [page, setPage] = useState(1);

    const [search, setSearch] = useState("");

    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const [sheetOpen, setSheetOpen] = useState(false);

    const [rejectOpen, setRejectOpen] = useState(false);

    const [remarks, setRemarks] = useState("");

    const [residentStatus, setResidentStatus] = useState<"yes" | "no" | "">("");

    /*
     * ----------------------------------------
     * Search
     * ----------------------------------------
     */

    const debouncedSearchFn = useMemo(
        () =>
            debounce((value: string) => {
                setPage(1);
                setDebouncedSearch(value);
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
     * Fetch
     * ----------------------------------------
     */

    const fetchUserVerification = async ({
        queryKey,
    }: {
        queryKey: readonly unknown[];
    }): Promise<PaginatedResponse> => {
        const [, currentPage, currentSearch] = queryKey;

        const { data } = await axios.get("/api/requests/user-verifications", {
            params: {
                page: currentPage,
                search: currentSearch,
            },
        });

        return data;
    };

    const { data, isLoading, isFetching, isError } = useQuery({
        queryKey: ["user-verifications", page, debouncedSearch],

        queryFn: fetchUserVerification,

        placeholderData: (previousData) => previousData,

        staleTime: 30_000,
    });

    /*
     * ----------------------------------------
     * View
     * ----------------------------------------
     */

    const handleView = useCallback(async (user: User) => {
        try {
            const { data } = await axios.get(
                `/api/requests/user-verifications/${user.id}`,
            );

            setSelectedUser(data.data);
            setSheetOpen(true);
        } catch (error) {
            console.error("Failed to load verification", error);
        }
    }, []);

    /*
     * ----------------------------------------
     * Approve
     * ----------------------------------------
     */

    const approveMutation = useMutation({
        mutationFn: async ({
            verificationId,
            isResident,
        }: {
            verificationId: number;
            isResident: boolean;
        }) => {
            const { data } = await axios.post(
                `/api/requests/user-verifications/${verificationId}/approve`,
                {
                    is_resident: isResident,
                },
            );

            return data;
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["user-verifications"],
            });

            setSheetOpen(false);
            setSelectedUser(null);
            setResidentStatus("");
        },

        onError: (error) => {
            console.error("Approval failed", error);
        },
    });

    /*
     * ----------------------------------------
     * Reject
     * ----------------------------------------
     */

    const rejectMutation = useMutation({
        mutationFn: async ({
            verificationId,
            remarks,
        }: {
            verificationId: number;
            remarks: string;
        }) => {
            const { data } = await axios.post(
                `/api/requests/user-verifications/${verificationId}/reject`,
                {
                    remarks,
                },
            );

            return data;
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["user-verifications"],
            });

            setRejectOpen(false);
            setSheetOpen(false);
            setSelectedUser(null);
            setRemarks("");
        },

        onError: (error) => {
            console.error("Rejection failed", error);
        },
    });

    /*
     * ----------------------------------------
     * Columns
     * ----------------------------------------
     */

    const columns = useMemo(() => createColumns(handleView), [handleView]);

    const verification = selectedUser?.latest_verification;

    /*
     * ----------------------------------------
     * Error state
     * ----------------------------------------
     */

    if (isError) {
        return (
            <div className="space-y-5">
                <PageHeader />

                <Card className="border-destructive/30">
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
                            <AlertCircle className="size-6 text-destructive" />
                        </div>

                        <h3 className="mt-4 text-sm font-semibold">
                            Unable to load verification requests
                        </h3>

                        <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                            Something went wrong while loading the verification
                            requests.
                        </p>
                    </div>
                </Card>
            </div>
        );
    }

    /*
     * ----------------------------------------
     * Render
     * ----------------------------------------
     */

    return (
        <>
            <div className="space-y-5">
                {/* Page Header */}
                <PageHeader />

                {/* Table */}
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
                            emptyMessage="No verification requests found."
                            emptyDescription={
                                search
                                    ? "Try adjusting your search criteria."
                                    : "There are currently no verification requests."
                            }
                        />
                    </div>
                </Card>
            </div>

            {/* ===================================================== */}
            {/* VERIFICATION SHEET */}
            {/* ===================================================== */}

            <Sheet
                open={sheetOpen}
                onOpenChange={(open) => {
                    setSheetOpen(open);

                    if (!open) {
                        setSelectedUser(null);
                        setResidentStatus("");
                    }
                }}
            >
                <SheetContent
                    side="right"
                    className="flex w-full flex-col p-0 sm:max-w-xl"
                >
                    {selectedUser && verification && (
                        <>
                            {/* Sheet Header */}
                            <div className="border-b px-6 py-5">
                                <SheetHeader>
                                    <div className="flex items-start gap-4">
                                        {/* Avatar */}
                                        <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-muted">
                                            {selectedUser.profile_picture ? (
                                                <img
                                                    src={
                                                        googleDriveImage(
                                                            selectedUser.profile_picture,
                                                        ) ?? ""
                                                    }
                                                    alt={getFullName(
                                                        selectedUser,
                                                    )}
                                                    className="size-full object-cover"
                                                />
                                            ) : (
                                                <UserRound className="size-6 text-muted-foreground" />
                                            )}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <SheetTitle className="truncate">
                                                Verification Review
                                            </SheetTitle>

                                            <SheetDescription className="mt-1 truncate">
                                                {getFullName(selectedUser)}
                                            </SheetDescription>

                                            <div className="mt-3">
                                                <StatusBadge
                                                    status={verification.status}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </SheetHeader>
                            </div>

                            {/* Sheet Body */}
                            <div className="flex-1 overflow-y-auto">
                                <div className="space-y-7 px-6 py-6">
                                    {/* ================================= */}
                                    {/* REVIEW NOTICE */}
                                    {/* ================================= */}

                                    {verification.status === "pending" && (
                                        <div className="flex gap-3 rounded-xl border border-orange-200 bg-orange-50 p-4 dark:border-orange-900 dark:bg-orange-950/30">
                                            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-orange-600" />

                                            <div>
                                                <p className="text-sm font-medium text-orange-900 dark:text-orange-300">
                                                    Verification requires review
                                                </p>

                                                <p className="mt-1 text-xs leading-relaxed text-orange-700 dark:text-orange-400">
                                                    Review the resident's
                                                    submitted information and
                                                    identification documents
                                                    before making a decision.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* ================================= */}
                                    {/* USER INFORMATION */}
                                    {/* ================================= */}

                                    <DetailSection
                                        title="Resident Information"
                                        description="Information currently stored in the resident's account."
                                    >
                                        <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
                                            <Info
                                                label="ID Number"
                                                value={selectedUser.id_number}
                                            />

                                            <Info
                                                label="Full Name"
                                                value={getFullName(
                                                    selectedUser,
                                                )}
                                            />

                                            <Info
                                                label="Sex"
                                                value={selectedUser.sex}
                                            />

                                            <Info
                                                label="Birth Date"
                                                value={selectedUser.birth_date}
                                            />

                                            <Info
                                                label="Marital Status"
                                                value={
                                                    selectedUser.marital_status
                                                }
                                            />

                                            <Info
                                                label="Religion"
                                                value={selectedUser.religion}
                                            />

                                            <Info
                                                label="Mobile"
                                                value={
                                                    selectedUser.mobile_number
                                                }
                                            />

                                            <Info
                                                label="Email"
                                                value={selectedUser.email}
                                            />

                                            <div className="sm:col-span-2">
                                                <Info
                                                    label="Address"
                                                    value={[
                                                        selectedUser.street_name,
                                                        selectedUser.barangay,
                                                        selectedUser.municipality,
                                                        selectedUser.province,
                                                        selectedUser.postal_code,
                                                    ]
                                                        .filter(Boolean)
                                                        .join(", ")}
                                                />
                                            </div>
                                        </div>
                                    </DetailSection>

                                    {/* ================================= */}
                                    {/* SUBMITTED ID */}
                                    {/* ================================= */}

                                    <DetailSection
                                        title="Submitted Identification"
                                        description="Information extracted from the submitted identification."
                                    >
                                        <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
                                            <Info
                                                label="ID Type"
                                                value={verification.id_type}
                                            />

                                            <Info
                                                label="ID Number"
                                                value={verification.id_number}
                                            />

                                            <Info
                                                label="First Name"
                                                value={verification.first_name}
                                            />

                                            <Info
                                                label="Middle Name"
                                                value={verification.middle_name}
                                            />

                                            <Info
                                                label="Last Name"
                                                value={verification.last_name}
                                            />

                                            <Info
                                                label="Date of Birth"
                                                value={
                                                    verification.date_of_birth
                                                }
                                            />

                                            <div className="sm:col-span-2">
                                                <Info
                                                    label="Address"
                                                    value={verification.address}
                                                />
                                            </div>
                                        </div>
                                    </DetailSection>

                                    {/* ================================= */}
                                    {/* DOCUMENTS */}
                                    {/* ================================= */}

                                    <DetailSection
                                        title="Identification Documents"
                                        description="Review the submitted ID and face image."
                                    >
                                        <div className="space-y-5">
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <VerificationImage
                                                    title="ID Front"
                                                    fileId={
                                                        verification.id_front_image
                                                    }
                                                />

                                                <VerificationImage
                                                    title="ID Back"
                                                    fileId={
                                                        verification.id_back_image
                                                    }
                                                />
                                            </div>

                                            <VerificationImage
                                                title="Face Image"
                                                fileId={verification.face_image}
                                            />
                                        </div>
                                    </DetailSection>

                                    {/* ================================= */}
                                    {/* PREVIOUS REMARKS */}
                                    {/* ================================= */}

                                    {verification.remarks && (
                                        <DetailSection
                                            title="Previous Remarks"
                                            description="Reason or notes recorded during the previous review."
                                        >
                                            <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
                                                <div className="flex gap-3">
                                                    <AlertCircle className="mt-0.5 size-4 shrink-0 text-red-600" />

                                                    <p className="text-sm leading-relaxed text-red-700 dark:text-red-400">
                                                        {verification.remarks}
                                                    </p>
                                                </div>
                                            </div>
                                        </DetailSection>
                                    )}
                                </div>
                            </div>

                            {/* ================================= */}
                            {/* ACTION FOOTER */}
                            {/* ================================= */}

                            {verification.status === "pending" && (
                                <div className="border-t bg-background px-6 py-4">
                                    <div className="space-y-4">
                                        {/* Resident Status */}
                                        <div className="space-y-2">
                                            <div>
                                                <p className="text-sm font-medium">
                                                    Is this person a resident?
                                                </p>

                                                <p className="text-xs text-muted-foreground">
                                                    Confirm whether the
                                                    applicant is a registered
                                                    resident before approving
                                                    the verification.
                                                </p>
                                            </div>

                                            <Select
                                                value={residentStatus}
                                                onValueChange={(
                                                    value: "yes" | "no",
                                                ) => setResidentStatus(value)}
                                                disabled={
                                                    approveMutation.isPending ||
                                                    rejectMutation.isPending
                                                }
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select resident status" />
                                                </SelectTrigger>

                                                <SelectContent>
                                                    <SelectItem value="yes">
                                                        Yes — Resident
                                                    </SelectItem>

                                                    <SelectItem value="no">
                                                        No — Not a Resident
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Actions */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <Button
                                                variant="outline"
                                                className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                onClick={() =>
                                                    setRejectOpen(true)
                                                }
                                                disabled={
                                                    approveMutation.isPending ||
                                                    rejectMutation.isPending
                                                }
                                            >
                                                <X className="size-4" />
                                                Reject
                                            </Button>

                                            <Button
                                                disabled={
                                                    approveMutation.isPending ||
                                                    rejectMutation.isPending ||
                                                    !residentStatus
                                                }
                                                onClick={() => {
                                                    if (
                                                        !verification ||
                                                        !residentStatus
                                                    ) {
                                                        return;
                                                    }

                                                    approveMutation.mutate({
                                                        verificationId:
                                                            verification.id,
                                                        isResident:
                                                            residentStatus ===
                                                            "yes",
                                                    });
                                                }}
                                            >
                                                {approveMutation.isPending ? (
                                                    <Loader2 className="size-4 animate-spin" />
                                                ) : (
                                                    <Check className="size-4" />
                                                )}

                                                {approveMutation.isPending
                                                    ? "Approving..."
                                                    : "Approve"}
                                            </Button>
                                        </div>

                                        {!residentStatus && (
                                            <p className="text-center text-xs text-muted-foreground">
                                                Select the resident status
                                                before approving.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </SheetContent>
            </Sheet>

            {/* ===================================================== */}
            {/* REJECT DIALOG */}
            {/* ===================================================== */}

            <AlertDialog
                open={rejectOpen}
                onOpenChange={(open) => {
                    if (!rejectMutation.isPending) {
                        setRejectOpen(open);
                    }
                }}
            >
                <AlertDialogContent className="sm:max-w-md">
                    <AlertDialogHeader>
                        <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-destructive/10">
                            <AlertCircle className="size-5 text-destructive" />
                        </div>

                        <AlertDialogTitle>
                            Reject Verification?
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            This will reject the resident's verification
                            request. Please provide a clear reason so the
                            resident knows what needs to be corrected.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="space-y-2">
                        <Textarea
                            placeholder="Example: The submitted ID is blurry. Please upload a clearer image."
                            value={remarks}
                            onChange={(event) => setRemarks(event.target.value)}
                            rows={5}
                            disabled={rejectMutation.isPending}
                        />

                        <p className="text-right text-[11px] text-muted-foreground">
                            {remarks.length}/500
                        </p>
                    </div>

                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={rejectMutation.isPending}>
                            Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={
                                rejectMutation.isPending || !remarks.trim()
                            }
                            onClick={(event) => {
                                event.preventDefault();

                                if (!verification) {
                                    return;
                                }

                                rejectMutation.mutate({
                                    verificationId: verification.id,
                                    remarks: remarks.trim(),
                                });
                            }}
                        >
                            {rejectMutation.isPending && (
                                <Loader2 className="size-4 animate-spin" />
                            )}

                            {rejectMutation.isPending
                                ? "Rejecting..."
                                : "Reject Verification"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

/*
|--------------------------------------------------------------------------
| Page Header
|--------------------------------------------------------------------------
*/

function PageHeader() {
    return (
        <div className="flex flex-col gap-1">
            <h1 className="text-xl font-semibold tracking-tight">
                User Verifications
            </h1>

            <p className="text-sm text-muted-foreground">
                Review resident identity information and submitted
                identification documents.
            </p>
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Detail Section
|--------------------------------------------------------------------------
*/

function DetailSection({
    title,
    description,
    children,
}: {
    title: string;
    description?: string;
    children: ReactNode;
}) {
    return (
        <section className="space-y-3">
            <div>
                <h3 className="text-sm font-semibold">{title}</h3>

                {description && (
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>

            <div className="rounded-xl border bg-card p-4">{children}</div>
        </section>
    );
}

/*
|--------------------------------------------------------------------------
| Info
|--------------------------------------------------------------------------
*/

function Info({ label, value }: { label: string; value?: string | null }) {
    return (
        <div className="min-w-0 space-y-1">
            <p className="text-xs font-medium text-muted-foreground">{label}</p>

            <p className="break-words text-sm font-medium">{value || "N/A"}</p>
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Verification Image
|--------------------------------------------------------------------------
*/

function VerificationImage({
    title,
    fileId,
}: {
    title: string;
    fileId?: string | null;
}) {
    const imageUrl = googleDriveImage(fileId);

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{title}</p>

                {imageUrl && (
                    <a
                        href={imageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="
                            rounded-md
                            p-1.5
                            text-muted-foreground
                            transition-colors
                            hover:bg-muted
                            hover:text-foreground
                        "
                        title={`Open ${title}`}
                    >
                        <ExternalLink className="size-4" />
                    </a>
                )}
            </div>

            <div className="group relative overflow-hidden rounded-xl border bg-muted/30">
                {imageUrl ? (
                    <>
                        <img
                            src={imageUrl}
                            alt={title}
                            className="
                                max-h-72
                                min-h-40
                                w-full
                                object-contain
                                transition-transform
                                duration-300
                                group-hover:scale-[1.02]
                            "
                        />
                    </>
                ) : (
                    <div className="flex min-h-40 flex-col items-center justify-center gap-2 text-center">
                        <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                            <FileImage className="size-5 text-muted-foreground" />
                        </div>

                        <p className="text-xs text-muted-foreground">
                            No image submitted
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

UserVerification.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
