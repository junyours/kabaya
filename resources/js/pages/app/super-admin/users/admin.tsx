import AppLayout from "@/layouts/app-layout";
import { DataTable } from "@/components/table/data-table";
import InputError from "@/components/input-error";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import {
    Eye,
    Loader2,
    MoreHorizontal,
    Pencil,
    Plus,
    ShieldCheck,
    UserRound,
} from "lucide-react";
import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

type Admin = {
    id: number;
    id_number: string | null;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    suffix: string | null;
    user_name: string;
    email: string;
    mobile_number: string | null;
    is_verified: boolean;
    is_resident: boolean;
    role: string;
    created_at: string;
};

const adminSchema = z.object({
    first_name: z
        .string()
        .trim()
        .min(1, "First name is required.")
        .max(255, "First name is too long."),
    middle_name: z
        .string()
        .trim()
        .max(255, "Middle name is too long.")
        .optional()
        .or(z.literal("")),
    last_name: z
        .string()
        .trim()
        .min(1, "Last name is required.")
        .max(255, "Last name is too long."),
    suffix: z
        .string()
        .trim()
        .max(50, "Suffix is too long.")
        .optional()
        .or(z.literal("")),
    user_name: z
        .string()
        .trim()
        .min(3, "Username must be at least 3 characters.")
        .max(255, "Username is too long."),
    email: z
        .string()
        .trim()
        .email("Please enter a valid email address.")
        .max(255, "Email is too long."),
});

type AdminForm = z.infer<typeof adminSchema>;

const defaultValues: AdminForm = {
    first_name: "",
    middle_name: "",
    last_name: "",
    suffix: "",
    user_name: "",
    email: "",
};

export default function Admin() {
    const queryClient = useQueryClient();

    const [openSheet, setOpenSheet] = useState(false);
    const [openAccountSheet, setOpenAccountSheet] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
    const [viewingAdmin, setViewingAdmin] = useState<Admin | null>(null);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");

    const adminForm = useForm<AdminForm>({
        resolver: zodResolver(adminSchema),
        defaultValues,
    });

    const {
        register,
        handleSubmit,
        reset,
        setError,
        clearErrors,
        formState: { errors },
    } = adminForm;

    const fetchAdmins = async ({
        queryKey,
    }: {
        queryKey: readonly unknown[];
    }) => {
        const [, currentPage, currentSearch] = queryKey;

        const response = await axios.get("/super-admin/users/get-admin", {
            params: {
                page: currentPage,
                search: currentSearch,
            },
        });

        return response.data;
    };

    const { data, isLoading, isFetching } = useQuery({
        queryKey: ["admins", page, search],
        queryFn: fetchAdmins,
        placeholderData: (previousData) => previousData,
    });

    const createMutation = useMutation({
        mutationFn: async (formData: AdminForm) => {
            const response = await axios.post(
                "/super-admin/users/add-admin",
                formData,
            );

            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admins"],
            });

            setOpenSheet(false);
            setSelectedAdmin(null);
            reset(defaultValues);

            toast.success("Admin account created successfully.");
        },
        onError: (error: any) => {
            const serverErrors = error?.response?.data?.errors;

            if (serverErrors) {
                Object.keys(serverErrors).forEach((field) => {
                    setError(field as keyof AdminForm, {
                        type: "server",
                        message: serverErrors[field][0],
                    });
                });

                return;
            }

            toast.error(
                error?.response?.data?.message ??
                    "Something went wrong while creating the admin account.",
            );
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({
            id,
            formData,
        }: {
            id: number;
            formData: AdminForm;
        }) => {
            const response = await axios.post(
                `/super-admin/users/update-admin/${id}`,
                formData,
            );

            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admins"],
            });

            setOpenSheet(false);
            setSelectedAdmin(null);
            reset(defaultValues);

            toast.success("Admin account updated successfully.");
        },
        onError: (error: any) => {
            const serverErrors = error?.response?.data?.errors;

            if (serverErrors) {
                Object.keys(serverErrors).forEach((field) => {
                    setError(field as keyof AdminForm, {
                        type: "server",
                        message: serverErrors[field][0],
                    });
                });

                return;
            }

            toast.error(
                error?.response?.data?.message ??
                    "Something went wrong while updating the admin account.",
            );
        },
    });

    const processing = createMutation.isPending || updateMutation.isPending;

    const handleOpenSheet = () => {
        setSelectedAdmin(null);
        clearErrors();
        reset(defaultValues);
        setOpenSheet(true);
    };

    const handleEditAdmin = (admin: Admin) => {
        setSelectedAdmin(admin);
        clearErrors();

        reset({
            first_name: admin.first_name ?? "",
            middle_name: admin.middle_name ?? "",
            last_name: admin.last_name ?? "",
            suffix: admin.suffix ?? "",
            user_name: admin.user_name ?? "",
            email: admin.email ?? "",
        });

        setOpenSheet(true);
    };

    const handleViewAdmin = (admin: Admin) => {
        setViewingAdmin(admin);
        setOpenAccountSheet(true);
    };

    const handleCloseSheet = () => {
        if (processing) {
            return;
        }

        setOpenSheet(false);
        setSelectedAdmin(null);
        clearErrors();
        reset(defaultValues);
    };

    const handleCloseAccountSheet = () => {
        setOpenAccountSheet(false);
        setViewingAdmin(null);
    };

    const onSubmit = (formData: AdminForm) => {
        if (selectedAdmin) {
            updateMutation.mutate({
                id: selectedAdmin.id,
                formData,
            });

            return;
        }

        createMutation.mutate(formData);
    };

    const columns: ColumnDef<Admin>[] = [
        {
            accessorKey: "first_name",
            header: "Administrator",
            cell: ({ row }) => {
                const admin = row.original;

                const fullName = [
                    admin.first_name,
                    admin.middle_name,
                    admin.last_name,
                    admin.suffix,
                ]
                    .filter(Boolean)
                    .join(" ");

                return (
                    <div className="flex min-w-[240px] items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <UserRound className="size-5" />
                        </div>

                        <div className="min-w-0">
                            <p className="truncate text-sm font-medium">
                                {fullName}
                            </p>

                            <p className="truncate text-xs text-muted-foreground">
                                @{admin.user_name}
                            </p>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => {
                const admin = row.original;

                return (
                    <div className="max-w-[280px]">
                        <p className="truncate text-sm">{admin.email}</p>

                        {admin.mobile_number && (
                            <p className="truncate text-xs text-muted-foreground">
                                {admin.mobile_number}
                            </p>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: "role",
            header: "Role",
            cell: () => (
                <Badge
                    variant="outline"
                    className="gap-1.5 rounded-full border-primary/20 bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary"
                >
                    <ShieldCheck className="size-3.5" />
                    Administrator
                </Badge>
            ),
        },
        {
            accessorKey: "is_verified",
            header: "Status",
            cell: ({ row }) => {
                const admin = row.original;

                return (
                    <Badge
                        variant="outline"
                        className={cn(
                            "gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                            admin.is_verified
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400"
                                : "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400",
                        )}
                    >
                        <span
                            className={cn(
                                "size-1.5 rounded-full",
                                admin.is_verified
                                    ? "bg-emerald-500"
                                    : "bg-red-500",
                            )}
                        />

                        {admin.is_verified ? "Verified" : "Unverified"}
                    </Badge>
                );
            },
        },
        {
            id: "actions",
            header: "",
            cell: ({ row }) => {
                const admin = row.original;

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

                            <DropdownMenuContent align="end" className="w-44">
                                <DropdownMenuLabel className="text-xs text-muted-foreground">
                                    Account
                                </DropdownMenuLabel>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem
                                    onClick={() => handleViewAdmin(admin)}
                                >
                                    <Eye className="size-4" />
                                    View Account
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onClick={() => handleEditAdmin(admin)}
                                >
                                    <Pencil className="size-4" />
                                    Edit Admin
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
        },
    ];

    const viewingFullName = viewingAdmin
        ? [
              viewingAdmin.first_name,
              viewingAdmin.middle_name,
              viewingAdmin.last_name,
              viewingAdmin.suffix,
          ]
              .filter(Boolean)
              .join(" ")
        : "";

    return (
        <>
            <div className="space-y-5">
                <div className="flex flex-col gap-1">
                    <h1 className="text-xl font-semibold tracking-tight">
                        Admin Accounts
                    </h1>

                    <p className="text-sm text-muted-foreground">
                        Manage administrator accounts and system access.
                    </p>
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
                            setSearch={setSearch}
                            isLoading={isLoading || isFetching}
                            searchPlaceholder="Search administrators..."
                            emptyMessage="No admin accounts found."
                            emptyDescription="Create an admin account to give someone access to the administration system."
                            button={
                                <Button
                                    onClick={handleOpenSheet}
                                    className="h-10 w-full gap-2 sm:w-auto"
                                >
                                    <Plus className="size-4" />
                                    Add Admin
                                </Button>
                            }
                        />
                    </div>
                </Card>
            </div>

            <Sheet
                open={openAccountSheet}
                onOpenChange={(open) => {
                    if (!open) {
                        handleCloseAccountSheet();
                    }
                }}
            >
                <SheetContent
                    side="right"
                    className="flex w-full flex-col p-0 sm:max-w-md"
                >
                    <SheetHeader className="border-b px-6 py-5">
                        <SheetTitle className="text-lg">
                            Account Details
                        </SheetTitle>

                        <SheetDescription>
                            View administrator account information.
                        </SheetDescription>
                    </SheetHeader>

                    {viewingAdmin && (
                        <div className="flex-1 overflow-y-auto">
                            <div className="space-y-6 px-6 py-6">
                                <div className="flex flex-col items-center rounded-2xl border bg-muted/20 p-6 text-center">
                                    <div className="flex size-20 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                        <UserRound className="size-10" />
                                    </div>

                                    <h2 className="mt-4 text-lg font-semibold">
                                        {viewingFullName}
                                    </h2>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        @{viewingAdmin.user_name}
                                    </p>

                                    <Badge
                                        variant="outline"
                                        className="mt-3 gap-1.5 rounded-full border-primary/20 bg-primary/5 px-3 py-1 text-primary"
                                    >
                                        <ShieldCheck className="size-3.5" />
                                        Administrator
                                    </Badge>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-sm font-semibold">
                                            Personal Information
                                        </h3>

                                        <p className="mt-1 text-xs text-muted-foreground">
                                            Basic information of the
                                            administrator.
                                        </p>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground">
                                                First Name
                                            </p>

                                            <p className="text-sm font-medium">
                                                {viewingAdmin.first_name || "—"}
                                            </p>
                                        </div>

                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground">
                                                Middle Name
                                            </p>

                                            <p className="text-sm font-medium">
                                                {viewingAdmin.middle_name ||
                                                    "—"}
                                            </p>
                                        </div>

                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground">
                                                Last Name
                                            </p>

                                            <p className="text-sm font-medium">
                                                {viewingAdmin.last_name || "—"}
                                            </p>
                                        </div>

                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground">
                                                Suffix
                                            </p>

                                            <p className="text-sm font-medium">
                                                {viewingAdmin.suffix || "—"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t" />

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-sm font-semibold">
                                            Account Information
                                        </h3>

                                        <p className="mt-1 text-xs text-muted-foreground">
                                            Login and account details.
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground">
                                                Username
                                            </p>

                                            <p className="text-sm font-medium">
                                                @{viewingAdmin.user_name}
                                            </p>
                                        </div>

                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground">
                                                Email Address
                                            </p>

                                            <p className="break-all text-sm font-medium">
                                                {viewingAdmin.email || "—"}
                                            </p>
                                        </div>

                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground">
                                                Mobile Number
                                            </p>

                                            <p className="text-sm font-medium">
                                                {viewingAdmin.mobile_number ||
                                                    "—"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t" />

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-sm font-semibold">
                                            Account Status
                                        </h3>

                                        <p className="mt-1 text-xs text-muted-foreground">
                                            Current administrator account
                                            status.
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between rounded-xl border p-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={cn(
                                                    "flex size-9 items-center justify-center rounded-lg",
                                                    viewingAdmin.is_verified
                                                        ? "bg-emerald-500/10 text-emerald-600"
                                                        : "bg-red-500/10 text-red-600",
                                                )}
                                            >
                                                <ShieldCheck className="size-4" />
                                            </div>

                                            <div>
                                                <p className="text-sm font-medium">
                                                    Verification
                                                </p>

                                                <p className="text-xs text-muted-foreground">
                                                    Account verification status
                                                </p>
                                            </div>
                                        </div>

                                        <Badge
                                            variant="outline"
                                            className={cn(
                                                "rounded-full",
                                                viewingAdmin.is_verified
                                                    ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400"
                                                    : "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400",
                                            )}
                                        >
                                            {viewingAdmin.is_verified
                                                ? "Verified"
                                                : "Unverified"}
                                        </Badge>
                                    </div>

                                    <div className="flex items-center justify-between rounded-xl border p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                <UserRound className="size-4" />
                                            </div>

                                            <div>
                                                <p className="text-sm font-medium">
                                                    Resident Status
                                                </p>

                                                <p className="text-xs text-muted-foreground">
                                                    Registered resident account
                                                </p>
                                            </div>
                                        </div>

                                        <Badge
                                            variant="outline"
                                            className="rounded-full"
                                        >
                                            {viewingAdmin.is_resident
                                                ? "Resident"
                                                : "Non-resident"}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="border-t" />

                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">
                                        Account Created
                                    </p>

                                    <p className="text-sm font-medium">
                                        {viewingAdmin.created_at
                                            ? new Date(
                                                  viewingAdmin.created_at,
                                              ).toLocaleString()
                                            : "—"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <SheetFooter className="border-t px-6 py-4">
                        <div className="flex w-full gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCloseAccountSheet}
                                className="flex-1"
                            >
                                Close
                            </Button>

                            {viewingAdmin && (
                                <Button
                                    type="button"
                                    onClick={() => {
                                        handleCloseAccountSheet();
                                        handleEditAdmin(viewingAdmin);
                                    }}
                                    className="flex-1 gap-2"
                                >
                                    <Pencil className="size-4" />
                                    Edit Account
                                </Button>
                            )}
                        </div>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            <Sheet
                open={openSheet}
                onOpenChange={(open) => {
                    if (!open) {
                        handleCloseSheet();
                    }
                }}
            >
                <SheetContent
                    side="right"
                    className="flex w-full flex-col p-0 sm:max-w-md"
                >
                    <SheetHeader className="border-b px-6 py-5">
                        <SheetTitle className="text-lg">
                            {selectedAdmin ? "Edit Admin" : "Add Admin"}
                        </SheetTitle>

                        <SheetDescription>
                            {selectedAdmin
                                ? "Update the administrator account information."
                                : "Create a new administrator account. The role, verification, and password are automatically configured."}
                        </SheetDescription>
                    </SheetHeader>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex min-h-0 flex-1 flex-col"
                    >
                        <div className="flex-1 overflow-y-auto">
                            <div className="space-y-7 px-6 py-6">
                                <div className="space-y-5">
                                    <div>
                                        <h3 className="text-sm font-semibold">
                                            Personal Information
                                        </h3>

                                        <p className="mt-1 text-xs text-muted-foreground">
                                            Enter the administrator's basic
                                            information.
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="first_name">
                                            First Name
                                        </Label>

                                        <Input
                                            id="first_name"
                                            placeholder="Juan"
                                            disabled={processing}
                                            {...register("first_name")}
                                        />

                                        <InputError
                                            message={errors.first_name?.message}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="middle_name">
                                            Middle Name
                                            <span className="ml-1 text-muted-foreground">
                                                (Optional)
                                            </span>
                                        </Label>

                                        <Input
                                            id="middle_name"
                                            placeholder="Dela"
                                            disabled={processing}
                                            {...register("middle_name")}
                                        />

                                        <InputError
                                            message={
                                                errors.middle_name?.message
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="last_name">
                                            Last Name
                                        </Label>

                                        <Input
                                            id="last_name"
                                            placeholder="Cruz"
                                            disabled={processing}
                                            {...register("last_name")}
                                        />

                                        <InputError
                                            message={errors.last_name?.message}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="suffix">
                                            Suffix
                                            <span className="ml-1 text-muted-foreground">
                                                (Optional)
                                            </span>
                                        </Label>

                                        <Input
                                            id="suffix"
                                            placeholder="Jr."
                                            disabled={processing}
                                            {...register("suffix")}
                                        />

                                        <InputError
                                            message={errors.suffix?.message}
                                        />
                                    </div>
                                </div>

                                <div className="border-t" />

                                <div className="space-y-5">
                                    <div>
                                        <h3 className="text-sm font-semibold">
                                            Account Information
                                        </h3>

                                        <p className="mt-1 text-xs text-muted-foreground">
                                            Set the login information for the
                                            administrator.
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="user_name">
                                            Username
                                        </Label>

                                        <Input
                                            id="user_name"
                                            placeholder="juan.admin"
                                            autoComplete="username"
                                            disabled={processing}
                                            {...register("user_name")}
                                        />

                                        <InputError
                                            message={errors.user_name?.message}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">
                                            Email Address
                                        </Label>

                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="admin@example.com"
                                            autoComplete="email"
                                            disabled={processing}
                                            {...register("email")}
                                        />

                                        <InputError
                                            message={errors.email?.message}
                                        />
                                    </div>

                                    {!selectedAdmin && (
                                        <div className="rounded-xl border bg-muted/30 p-4">
                                            <div className="flex gap-3">
                                                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                    <ShieldCheck className="size-4" />
                                                </div>

                                                <div>
                                                    <p className="text-sm font-medium">
                                                        Automatic Account Setup
                                                    </p>

                                                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                                        This account will
                                                        automatically be
                                                        assigned the Admin role,
                                                        marked as verified, and
                                                        receive a secure
                                                        generated password.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {selectedAdmin && (
                                        <div className="rounded-xl border bg-primary/5 p-4">
                                            <div className="flex gap-3">
                                                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                    <Pencil className="size-4" />
                                                </div>

                                                <div>
                                                    <p className="text-sm font-medium">
                                                        Editing Account
                                                    </p>

                                                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                                        Update the
                                                        administrator's personal
                                                        and account information.
                                                        The password will not be
                                                        changed.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <SheetFooter className="border-t px-6 py-4">
                            <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCloseSheet}
                                    disabled={processing}
                                    className="w-full sm:w-auto"
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full gap-2 sm:w-auto"
                                >
                                    {processing ? (
                                        <>
                                            <Loader2 className="size-4 animate-spin" />
                                            {selectedAdmin
                                                ? "Updating..."
                                                : "Creating..."}
                                        </>
                                    ) : selectedAdmin ? (
                                        <>
                                            <Pencil className="size-4" />
                                            Save Changes
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="size-4" />
                                            Create Admin
                                        </>
                                    )}
                                </Button>
                            </div>
                        </SheetFooter>
                    </form>
                </SheetContent>
            </Sheet>
        </>
    );
}

Admin.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
