import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
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
    Check,
    ExternalLink,
    Loader2,
    MoreHorizontal,
    ShieldAlert,
    ShieldCheck,
    X,
} from "lucide-react";

import { ReactPortal, useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { debounce } from "lodash";

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
| Status badge
|--------------------------------------------------------------------------
*/

function StatusBadge({ status }: { status?: UserVerification["status"] }) {
    if (!status) {
        return (
            <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-600">
                No Request
            </span>
        );
    }

    return (
        <span
            className={cn(
                "rounded-full px-2 py-1 text-xs font-semibold capitalize",
                status === "pending" && "bg-orange-100 text-orange-600",
                status === "approved" && "bg-green-100 text-green-600",
                status === "rejected" && "bg-red-100 text-red-600",
            )}
        >
            {status}
        </span>
    );
}

/*
|--------------------------------------------------------------------------
| Columns
|--------------------------------------------------------------------------
*/

function createColumns(onView: (user: User) => void): ColumnDef<User>[] {
    return [
        {
            accessorKey: "id_number",
            header: "ID Number",
        },

        {
            accessorKey: "last_name",
            header: "Last Name",
        },

        {
            accessorKey: "first_name",
            header: "First Name",
        },

        {
            accessorKey: "middle_name",
            header: "Middle Name",

            cell: ({ row }) => row.original.middle_name ?? "N/A",
        },

        {
            accessorKey: "suffix",
            header: "Suffix",

            cell: ({ row }) => row.original.suffix ?? "N/A",
        },

        {
            id: "id_type",
            header: "ID Type",

            cell: ({ row }) =>
                row.original.latest_verification?.id_type ?? "N/A",
        },

        {
            id: "status",
            header: "Verification Status",

            cell: ({ row }) => (
                <StatusBadge
                    status={row.original.latest_verification?.status}
                />
            ),
        },

        {
            id: "actions",

            cell: ({ row }) => {
                const user = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>

                            <DropdownMenuItem onClick={() => onView(user)}>
                                View Details
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
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

    /*
    |--------------------------------------------------------------------------
    | Fetch users
    |--------------------------------------------------------------------------
    */

    const fetchUserVerification = async ({
        queryKey,
    }: any): Promise<PaginatedResponse> => {
        const [_key, currentPage, currentSearch] = queryKey;

        const { data } = await axios.get("/api/requests/user-verifications", {
            params: {
                page: currentPage,
                search: currentSearch,
            },
        });

        return data;
    };

    const { data, isLoading } = useQuery({
        queryKey: ["user-verifications", page, debouncedSearch],

        queryFn: fetchUserVerification,
    });

    /*
    |--------------------------------------------------------------------------
    | Search
    |--------------------------------------------------------------------------
    */

    const debouncedSearchFn = useMemo(
        () =>
            debounce((value: string) => {
                setPage(1);
                setDebouncedSearch(value);
            }, 500),

        [],
    );

    const handleSearch = (value: string) => {
        setSearch(value);
        debouncedSearchFn(value);
    };

    /*
    |--------------------------------------------------------------------------
    | View details
    |--------------------------------------------------------------------------
    */

    const handleView = async (user: User) => {
        try {
            const { data } = await axios.get(
                `/api/requests/user-verifications/${user.id}`,
            );

            setSelectedUser(data.data);

            setSheetOpen(true);
        } catch (error) {
            console.error("Failed to load verification", error);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Approve
    |--------------------------------------------------------------------------
    */

    const approveMutation = useMutation({
        mutationFn: async (verificationId: number) => {
            const { data } = await axios.post(
                `/api/requests/user-verifications/${verificationId}/approve`,
            );

            return data;
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["user-verifications"],
            });

            setSheetOpen(false);
            setSelectedUser(null);
        },

        onError: (error) => {
            console.error("Approval failed", error);
        },
    });

    /*
    |--------------------------------------------------------------------------
    | Reject
    |--------------------------------------------------------------------------
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
    |--------------------------------------------------------------------------
    | Columns
    |--------------------------------------------------------------------------
    */

    const columns = useMemo(() => createColumns(handleView), []);

    const verification = selectedUser?.latest_verification;

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <>
            <Card className="p-4">
                <DataTable
                    columns={columns}
                    data={data?.data ?? []}
                    page={page}
                    lastPage={data?.last_page ?? 1}
                    setPage={setPage}
                    search={search}
                    setSearch={handleSearch}
                />
            </Card>

            {/* ===================================================== */}
            {/* VERIFICATION SHEET */}
            {/* ===================================================== */}

            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetContent
                    side="right"
                    className="w-full overflow-y-auto sm:max-w-xl"
                >
                    {selectedUser && verification && (
                        <div className="space-y-6">
                            <SheetHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <SheetTitle>
                                            Verification Request
                                        </SheetTitle>

                                        <SheetDescription>
                                            Review the user's submitted identity
                                            information.
                                        </SheetDescription>
                                    </div>

                                    <StatusBadge status={verification.status} />
                                </div>
                            </SheetHeader>

                            {/* ================================= */}
                            {/* USER INFORMATION */}
                            {/* ================================= */}

                            <section className="space-y-3">
                                <h3 className="text-sm font-semibold">
                                    User Information
                                </h3>

                                <div className="rounded-xl border p-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <Info
                                            label="ID Number"
                                            value={selectedUser.id_number}
                                        />

                                        <Info
                                            label="Name"
                                            value={[
                                                selectedUser.first_name,
                                                selectedUser.middle_name,
                                                selectedUser.last_name,
                                                selectedUser.suffix,
                                            ]
                                                .filter(Boolean)
                                                .join(" ")}
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
                                            value={selectedUser.marital_status}
                                        />

                                        <Info
                                            label="Religion"
                                            value={selectedUser.religion}
                                        />

                                        <Info
                                            label="Mobile"
                                            value={selectedUser.mobile_number}
                                        />

                                        <Info
                                            label="Email"
                                            value={selectedUser.email}
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* ================================= */}
                            {/* VERIFICATION INFORMATION */}
                            {/* ================================= */}

                            <section className="space-y-3">
                                <h3 className="text-sm font-semibold">
                                    Submitted Information
                                </h3>

                                <div className="rounded-xl border p-4">
                                    <div className="grid grid-cols-2 gap-4">
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
                                            value={verification.date_of_birth}
                                        />

                                        <div className="col-span-2">
                                            <Info
                                                label="Address"
                                                value={verification.address}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* ================================= */}
                            {/* ID IMAGES */}
                            {/* ================================= */}

                            <section className="space-y-3">
                                <h3 className="text-sm font-semibold">
                                    Submitted Images
                                </h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <VerificationImage
                                        title="ID Front"
                                        fileId={verification.id_front_image}
                                    />

                                    <VerificationImage
                                        title="ID Back"
                                        fileId={verification.id_back_image}
                                    />

                                    <div className="col-span-2">
                                        <VerificationImage
                                            title="Face"
                                            fileId={verification.face_image}
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* ================================= */}
                            {/* REMARKS */}
                            {/* ================================= */}

                            {verification.remarks && (
                                <section className="space-y-2">
                                    <h3 className="text-sm font-semibold">
                                        Previous Remarks
                                    </h3>

                                    <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
                                        {verification.remarks}
                                    </div>
                                </section>
                            )}

                            {/* ================================= */}
                            {/* ACTIONS */}
                            {/* ================================= */}

                            {verification.status === "pending" && (
                                <div className="sticky bottom-0 -mx-6 border-t bg-background px-6 py-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        <Button
                                            variant="destructive"
                                            onClick={() => setRejectOpen(true)}
                                        >
                                            <X className="mr-2 h-4 w-4" />
                                            Reject
                                        </Button>

                                        <Button
                                            onClick={() =>
                                                approveMutation.mutate(
                                                    verification.id,
                                                )
                                            }
                                            disabled={approveMutation.isPending}
                                        >
                                            {approveMutation.isPending ? (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            ) : (
                                                <Check className="mr-2 h-4 w-4" />
                                            )}
                                            Approve
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </SheetContent>
            </Sheet>

            {/* ===================================================== */}
            {/* REJECT DIALOG */}
            {/* ===================================================== */}

            <AlertDialog open={rejectOpen} onOpenChange={setRejectOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Reject Verification</AlertDialogTitle>

                        <AlertDialogDescription>
                            Please provide a reason for rejecting this
                            verification request.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <Textarea
                        placeholder="Example: The ID image is blurry or the information does not match."
                        value={remarks}
                        onChange={(event) => setRemarks(event.target.value)}
                        rows={5}
                    />

                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>

                        <AlertDialogAction
                            className="bg-destructive hover:bg-destructive/90"
                            disabled={rejectMutation.isPending}
                            onClick={(event) => {
                                event.preventDefault();

                                if (!verification) {
                                    return;
                                }

                                rejectMutation.mutate({
                                    verificationId: verification.id,

                                    remarks,
                                });
                            }}
                        >
                            {rejectMutation.isPending && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Reject Verification
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

/*
|--------------------------------------------------------------------------
| Info
|--------------------------------------------------------------------------
*/

function Info({ label, value }: { label: string; value?: string | null }) {
    return (
        <div className="space-y-1">
            <p className="text-xs text-muted-foreground">{label}</p>

            <p className="text-sm font-medium">{value || "N/A"}</p>
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
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <ExternalLink className="h-4 w-4" />
                    </a>
                )}
            </div>

            <div className="overflow-hidden rounded-xl border bg-muted">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={title}
                        className="max-h-80 w-full object-contain"
                    />
                ) : (
                    <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
                        No image
                    </div>
                )}
            </div>
        </div>
    );
}

UserVerification.layout = (page: ReactPortal) => <AppLayout children={page} />;
