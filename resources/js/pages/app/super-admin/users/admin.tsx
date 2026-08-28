import AppLayout from "@/layouts/app-layout";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import {
    Check,
    Clipboard,
    Loader2,
    MoreHorizontal,
    Plus,
    ShieldCheck,
    UserRound,
} from "lucide-react";
import { ReactNode, useState } from "react";

import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import InputError from "@/components/input-error";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { toast } from "sonner";
import { cn } from "@/lib/utils";

/*
|--------------------------------------------------------------------------
| Types
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| Validation
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| Component
|--------------------------------------------------------------------------
*/

export default function Admin() {
    const queryClient = useQueryClient();

    const [openSheet, setOpenSheet] = useState(false);

    const [page, setPage] = useState(1);

    const [search, setSearch] = useState("");

    const [copied, setCopied] = useState(false);

    const [generatedPassword, setGeneratedPassword] = useState<string | null>(
        null,
    );

    /*
    |--------------------------------------------------------------------------
    | Form
    |--------------------------------------------------------------------------
    */

    const adminForm = useForm<AdminForm>({
        resolver: zodResolver(adminSchema),

        defaultValues: {
            first_name: "",
            middle_name: "",
            last_name: "",
            suffix: "",
            user_name: "",
            email: "",
        },
    });

    const {
        register,
        handleSubmit,
        reset,
        setError,
        clearErrors,
        formState: { errors },
    } = adminForm;

    /*
    |--------------------------------------------------------------------------
    | Open Sheet
    |--------------------------------------------------------------------------
    */

    const handleOpenSheet = () => {
        clearErrors();

        reset({
            first_name: "",
            middle_name: "",
            last_name: "",
            suffix: "",
            user_name: "",
            email: "",
        });

        setOpenSheet(true);
    };

    /*
    |--------------------------------------------------------------------------
    | Close Sheet
    |--------------------------------------------------------------------------
    */

    const handleCloseSheet = () => {
        if (createMutation.isPending) {
            return;
        }

        setOpenSheet(false);

        clearErrors();

        reset({
            first_name: "",
            middle_name: "",
            last_name: "",
            suffix: "",
            user_name: "",
            email: "",
        });
    };

    /*
    |--------------------------------------------------------------------------
    | Create Admin
    |--------------------------------------------------------------------------
    */

    const createMutation = useMutation({
        mutationFn: async (formData: AdminForm) => {
            const response = await axios.post(
                "/super-admin/users/add-admin",
                formData,
            );

            return response.data;
        },

        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: ["admins"],
            });

            /*
             * Get generated password from backend.
             */
            setGeneratedPassword(response?.temporary_password ?? null);

            setOpenSheet(false);

            reset({
                first_name: "",
                middle_name: "",
                last_name: "",
                suffix: "",
                user_name: "",
                email: "",
            });

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

    const processing = createMutation.isPending;

    /*
    |--------------------------------------------------------------------------
    | Submit
    |--------------------------------------------------------------------------
    */

    const onSubmit = (formData: AdminForm) => {
        createMutation.mutate(formData);
    };

    /*
    |--------------------------------------------------------------------------
    | Fetch Admins
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | Copy Password
    |--------------------------------------------------------------------------
    */

    const copyPassword = async () => {
        if (!generatedPassword) {
            return;
        }

        try {
            await navigator.clipboard.writeText(generatedPassword);

            setCopied(true);

            toast.success("Password copied to clipboard.");

            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch (error) {
            console.error("Failed to copy password:", error);

            toast.error("Unable to copy password.");
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Columns
    |--------------------------------------------------------------------------
    */

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
                        <div
                            className="
                                flex
                                size-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-primary/10
                                text-primary
                            "
                        >
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

            cell: () => {
                return (
                    <Badge
                        variant="outline"
                        className="
                            gap-1.5
                            rounded-full
                            border-primary/20
                            bg-primary/5
                            px-2.5
                            py-1
                            text-xs
                            font-medium
                            text-primary
                        "
                    >
                        <ShieldCheck className="size-3.5" />
                        Administrator
                    </Badge>
                );
            },
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
                                    onClick={() => {
                                        toast.info(
                                            `Admin account: ${admin.user_name}`,
                                        );
                                    }}
                                >
                                    <UserRound className="size-4" />
                                    View account
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
        },
    ];

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <>
            <div className="space-y-5">
                {/* Header */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-xl font-semibold tracking-tight">
                        Admin Accounts
                    </h1>

                    <p className="text-sm text-muted-foreground">
                        Manage administrator accounts and system access.
                    </p>
                </div>

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

                {/* Generated Password */}
                {generatedPassword && (
                    <Card className="border-primary/30">
                        <div className="p-5 sm:p-6">
                            <div className="flex gap-3">
                                <div
                                    className="
                                        flex
                                        size-10
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-primary/10
                                        text-primary
                                    "
                                >
                                    <Check className="size-5" />
                                </div>

                                <div>
                                    <h2 className="text-sm font-semibold">
                                        Admin account created
                                    </h2>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        A temporary password has been generated.
                                        Copy it now because it will not be
                                        displayed again.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5">
                                <Label>Temporary Password</Label>

                                <div className="mt-2 flex gap-2">
                                    <div className="min-w-0 flex-1 rounded-lg border bg-muted/30 px-3 py-2.5">
                                        <code className="block break-all text-sm">
                                            {generatedPassword}
                                        </code>
                                    </div>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={copyPassword}
                                        className="shrink-0"
                                    >
                                        {copied ? (
                                            <>
                                                <Check className="mr-2 size-4" />
                                                Copied
                                            </>
                                        ) : (
                                            <>
                                                <Clipboard className="mr-2 size-4" />
                                                Copy
                                            </>
                                        )}
                                    </Button>
                                </div>

                                <div className="mt-4 rounded-lg bg-amber-500/10 p-3 text-xs leading-5 text-amber-700 dark:text-amber-400">
                                    <strong>Important:</strong> Save or securely
                                    provide this temporary password to the new
                                    administrator. It cannot be recovered after
                                    this page is refreshed.
                                </div>
                            </div>
                        </div>
                    </Card>
                )}
            </div>

            {/* Add Admin Sheet */}
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
                        <SheetTitle className="text-lg">Add Admin</SheetTitle>

                        <SheetDescription>
                            Create a new administrator account. The role,
                            verification, and password are automatically
                            configured.
                        </SheetDescription>
                    </SheetHeader>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex min-h-0 flex-1 flex-col"
                    >
                        <div className="flex-1 overflow-y-auto">
                            <div className="space-y-7 px-6 py-6">
                                {/* Personal Information */}
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

                                    {/* First Name */}
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

                                    {/* Middle Name */}
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

                                    {/* Last Name */}
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

                                    {/* Suffix */}
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

                                {/* Account Information */}
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

                                    {/* Username */}
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

                                    {/* Email */}
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

                                    {/* Automatic Configuration */}
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
                                                    automatically be assigned
                                                    the Admin role, marked as
                                                    verified, and receive a
                                                    secure generated password.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
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
                                            Creating...
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
