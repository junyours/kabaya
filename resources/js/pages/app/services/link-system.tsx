import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AppLayout from "@/layouts/app-layout";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import {
    ExternalLink,
    FileImage,
    Loader2,
    MoreHorizontal,
    Plus,
    SquarePen,
} from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import InputError from "@/components/input-error";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type System = {
    id: number;
    label: string;
    icon: string;
    href: string;
    is_active: boolean;
};

const systemSchema = z.object({
    label: z.string().trim().min(1, "The system name is required."),

    icon: z.any(),

    href: z
        .string()
        .trim()
        .min(1, "The web link is required.")
        .url("Please enter a valid web link."),

    is_active: z.string().min(1, "Please select a status."),
});

type SystemForm = z.infer<typeof systemSchema>;

export default function LinkSystem() {
    const queryClient = useQueryClient();

    const [openSheet, setOpenSheet] = useState(false);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [editingSystem, setEditingSystem] = useState<System | null>(null);

    const systemForm = useForm<SystemForm>({
        resolver: zodResolver(systemSchema),
        defaultValues: {
            label: "",
            icon: "",
            href: "",
            is_active: "",
        },
    });

    const {
        handleSubmit,
        setValue,
        watch,
        clearErrors,
        setError,
        reset,
        formState: { errors },
    } = systemForm;

    const selectedIcon = watch("icon");

    /*
     * ----------------------------------------
     * Sheet
     * ----------------------------------------
     */

    const handleOpenSheet = (system?: System) => {
        clearErrors();

        if (system) {
            setEditingSystem(system);

            reset({
                label: system.label,
                icon: "",
                href: system.href,
                is_active: system.is_active ? "1" : "0",
            });
        } else {
            setEditingSystem(null);

            reset({
                label: "",
                icon: "",
                href: "",
                is_active: "",
            });
        }

        setOpenSheet(true);
    };

    const handleCloseSheet = () => {
        if (processing) {
            return;
        }

        setOpenSheet(false);
        setEditingSystem(null);
        clearErrors();

        reset({
            label: "",
            icon: "",
            href: "",
            is_active: "",
        });
    };

    /*
     * ----------------------------------------
     * Add
     * ----------------------------------------
     */

    const addMutation = useMutation({
        mutationFn: async (formData: SystemForm) => {
            const response = await axios.post(
                "/api/services/add/link-systems",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            );

            return response.data;
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["link-systems"],
            });

            setOpenSheet(false);
            setEditingSystem(null);

            reset({
                label: "",
                icon: "",
                href: "",
                is_active: "",
            });

            toast.success("Link system added successfully.");
        },

        onError: (error: any) => {
            const serverErrors = error?.response?.data?.errors;

            if (serverErrors) {
                Object.keys(serverErrors).forEach((field) => {
                    setError(field as keyof SystemForm, {
                        type: "server",
                        message: serverErrors[field][0],
                    });
                });
            } else {
                toast.error(
                    "Something went wrong while adding the link system.",
                );
            }
        },
    });

    /*
     * ----------------------------------------
     * Update
     * ----------------------------------------
     */

    const updateMutation = useMutation({
        mutationFn: async (formData: SystemForm) => {
            const response = await axios.post(
                `/api/services/update/link-systems/${editingSystem?.id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            );

            return response.data;
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["link-systems"],
            });

            setOpenSheet(false);
            setEditingSystem(null);

            reset({
                label: "",
                icon: "",
                href: "",
                is_active: "",
            });

            toast.success("Link system updated successfully.");
        },

        onError: (error: any) => {
            const serverErrors = error?.response?.data?.errors;

            if (serverErrors) {
                Object.keys(serverErrors).forEach((field) => {
                    setError(field as keyof SystemForm, {
                        type: "server",
                        message: serverErrors[field][0],
                    });
                });
            } else {
                toast.error(
                    "Something went wrong while updating the link system.",
                );
            }
        },
    });

    const processing = addMutation.isPending || updateMutation.isPending;

    /*
     * ----------------------------------------
     * Submit
     * ----------------------------------------
     */

    const onSubmit = (formData: SystemForm) => {
        /*
         * Icon is only required when creating.
         */
        if (!editingSystem) {
            if (!(formData.icon instanceof File)) {
                setError("icon", {
                    type: "manual",
                    message: "The system icon is required.",
                });

                return;
            }
        }

        if (editingSystem) {
            updateMutation.mutate(formData);
        } else {
            addMutation.mutate(formData);
        }
    };

    /*
     * ----------------------------------------
     * Query
     * ----------------------------------------
     */

    const fetchSystems = async ({
        queryKey,
    }: {
        queryKey: readonly unknown[];
    }) => {
        const [, currentPage, currentSearch] = queryKey;

        const response = await axios.get("/api/services/link-systems", {
            params: {
                page: currentPage,
                search: currentSearch,
            },
        });

        return response.data;
    };

    const { data, isLoading, isFetching } = useQuery({
        queryKey: ["link-systems", page, search],
        queryFn: fetchSystems,
        placeholderData: (previousData) => previousData,
    });

    /*
     * ----------------------------------------
     * Columns
     * ----------------------------------------
     */

    const columns: ColumnDef<System>[] = [
        {
            accessorKey: "icon",
            header: "System",

            cell: ({ row }) => {
                const system = row.original;

                return (
                    <div className="flex min-w-[220px] items-center gap-3">
                        <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-muted/30">
                            {system.icon ? (
                                <img
                                    src={`https://lh3.googleusercontent.com/d/${system.icon}`}
                                    alt={system.label}
                                    className="size-8 object-contain"
                                />
                            ) : (
                                <FileImage className="size-5 text-muted-foreground" />
                            )}
                        </div>

                        <div className="min-w-0">
                            <p className="truncate text-sm font-medium">
                                {system.label}
                            </p>

                            <p className="truncate text-xs text-muted-foreground">
                                External system
                            </p>
                        </div>
                    </div>
                );
            },
        },

        {
            accessorKey: "href",
            header: "Web Link",

            cell: ({ row }) => {
                const system = row.original;

                return (
                    <div className="flex max-w-[320px] items-center gap-2">
                        <a
                            href={system.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={system.href}
                            className="
                                truncate
                                text-sm
                                text-muted-foreground
                                transition-colors
                                hover:text-primary
                                hover:underline
                            "
                        >
                            {system.href}
                        </a>

                        <ExternalLink className="size-3.5 shrink-0 text-muted-foreground" />
                    </div>
                );
            },
        },

        {
            accessorKey: "is_active",
            header: "Status",

            cell: ({ row }) => {
                const system = row.original;

                return (
                    <Badge
                        variant="outline"
                        className={cn(
                            "gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                            system.is_active
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400"
                                : "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400",
                        )}
                    >
                        <span
                            className={cn(
                                "size-1.5 rounded-full",
                                system.is_active
                                    ? "bg-emerald-500"
                                    : "bg-red-500",
                            )}
                        />

                        {system.is_active ? "Active" : "Inactive"}
                    </Badge>
                );
            },
        },

        {
            id: "actions",
            header: "",

            cell: ({ row }) => {
                const system = row.original;

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
                                    Actions
                                </DropdownMenuLabel>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem
                                    onClick={() => handleOpenSheet(system)}
                                    className="gap-2"
                                >
                                    <SquarePen className="size-4" />
                                    Edit system
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
        },
    ];

    /*
     * ----------------------------------------
     * Icon preview
     * ----------------------------------------
     */

    const iconPreview =
        selectedIcon instanceof File
            ? URL.createObjectURL(selectedIcon)
            : editingSystem?.icon
              ? `https://lh3.googleusercontent.com/d/${editingSystem.icon}`
              : null;

    useEffect(() => {
        return () => {
            if (selectedIcon instanceof File) {
                const preview = URL.createObjectURL(selectedIcon);

                URL.revokeObjectURL(preview);
            }
        };
    }, [selectedIcon]);

    /*
     * ----------------------------------------
     * Render
     * ----------------------------------------
     */

    return (
        <>
            <div className="space-y-5">
                {/* Page Header */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-xl font-semibold tracking-tight">
                        Link Systems
                    </h1>

                    <p className="text-sm text-muted-foreground">
                        Manage external systems and services available to
                        residents.
                    </p>
                </div>

                {/* Data Table */}
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
                            searchPlaceholder="Search link systems..."
                            emptyMessage="No link systems found."
                            emptyDescription="Add a link system to make it available in your services."
                            button={
                                <Button
                                    onClick={() => handleOpenSheet()}
                                    className="h-10 w-full gap-2 sm:w-auto"
                                >
                                    <Plus className="size-4" />
                                    Add Link System
                                </Button>
                            }
                        />
                    </div>
                </Card>
            </div>

            {/* Add / Edit Sheet */}
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
                            {editingSystem
                                ? "Edit Link System"
                                : "Add Link System"}
                        </SheetTitle>

                        <SheetDescription>
                            {editingSystem
                                ? "Update the details of this linked system."
                                : "Add an external system to your services."}
                        </SheetDescription>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto">
                        <div className="space-y-7 px-6 py-6">
                            {/* Icon */}
                            <div className="space-y-3">
                                <div>
                                    <Label className="text-sm font-medium">
                                        System Icon
                                    </Label>

                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Upload a PNG, JPG, or WEBP image.
                                    </p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-muted/30">
                                        {iconPreview ? (
                                            <img
                                                src={iconPreview}
                                                alt="Icon preview"
                                                className="size-11 object-contain"
                                            />
                                        ) : (
                                            <FileImage className="size-6 text-muted-foreground" />
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <Input
                                            type="file"
                                            accept="image/png,image/jpeg,image/webp"
                                            disabled={processing}
                                            onChange={(e) => {
                                                const file =
                                                    e.target.files?.[0];

                                                if (file) {
                                                    setValue("icon", file, {
                                                        shouldValidate: true,
                                                    });
                                                }
                                            }}
                                            className="cursor-pointer"
                                        />

                                        {editingSystem && (
                                            <p className="mt-1.5 text-[11px] text-muted-foreground">
                                                Leave empty to keep the current
                                                icon.
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <InputError
                                    message={errors.icon?.message?.toString()}
                                />
                            </div>

                            <div className="border-t" />

                            {/* System Information */}
                            <div className="space-y-5">
                                <div>
                                    <h3 className="text-sm font-semibold">
                                        System Information
                                    </h3>

                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Enter the basic information for this
                                        system.
                                    </p>
                                </div>

                                {/* System Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="label">System Name</Label>

                                    <Input
                                        id="label"
                                        placeholder="e.g. Student Portal"
                                        value={watch("label")}
                                        disabled={processing}
                                        onChange={(e) =>
                                            setValue("label", e.target.value, {
                                                shouldValidate: true,
                                            })
                                        }
                                    />

                                    <InputError
                                        message={errors.label?.message}
                                    />
                                </div>

                                {/* Web Link */}
                                <div className="space-y-2">
                                    <Label htmlFor="href">Web Link</Label>

                                    <Input
                                        id="href"
                                        type="url"
                                        placeholder="https://example.com"
                                        value={watch("href")}
                                        disabled={processing}
                                        onChange={(e) =>
                                            setValue("href", e.target.value, {
                                                shouldValidate: true,
                                            })
                                        }
                                    />

                                    <InputError
                                        message={errors.href?.message}
                                    />
                                </div>

                                {/* Status */}
                                <div className="space-y-2">
                                    <Label>Status</Label>

                                    <Select
                                        value={watch("is_active")}
                                        disabled={processing}
                                        onValueChange={(value) =>
                                            setValue("is_active", value, {
                                                shouldValidate: true,
                                            })
                                        }
                                    >
                                        <SelectTrigger className="h-10">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectItem value="1">
                                                <div className="flex items-center gap-2">
                                                    <span className="size-2 rounded-full bg-emerald-500" />
                                                    Active
                                                </div>
                                            </SelectItem>

                                            <SelectItem value="0">
                                                <div className="flex items-center gap-2">
                                                    <span className="size-2 rounded-full bg-red-500" />
                                                    Inactive
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <InputError
                                        message={errors.is_active?.message}
                                    />
                                </div>
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
                                type="button"
                                onClick={handleSubmit(onSubmit)}
                                disabled={processing}
                                className="w-full sm:w-auto"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin" />

                                        {editingSystem
                                            ? "Updating..."
                                            : "Saving..."}
                                    </>
                                ) : editingSystem ? (
                                    "Update System"
                                ) : (
                                    "Add System"
                                )}
                            </Button>
                        </div>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </>
    );
}

LinkSystem.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
