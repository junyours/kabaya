import AppLayout from "@/layouts/app-layout";
import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import {
    CheckCircle2,
    Eye,
    EyeOff,
    KeyRound,
    Loader2,
    LockKeyhole,
    ShieldCheck,
} from "lucide-react";

import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

/*
|--------------------------------------------------------------------------
| Validation
|--------------------------------------------------------------------------
*/

const changePasswordSchema = z
    .object({
        current_password: z.string().min(1, "Current password is required."),

        password: z.string().min(8, "Password must be at least 8 characters."),

        password_confirmation: z
            .string()
            .min(1, "Please confirm your new password."),
    })
    .refine((data) => data.password === data.password_confirmation, {
        message: "Passwords do not match.",
        path: ["password_confirmation"],
    });

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

/*
|--------------------------------------------------------------------------
| Component
|--------------------------------------------------------------------------
*/

export default function ChangePassword() {
    /*
    |--------------------------------------------------------------------------
    | Password Visibility
    |--------------------------------------------------------------------------
    */

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const [showPasswordConfirmation, setShowPasswordConfirmation] =
        useState(false);

    /*
    |--------------------------------------------------------------------------
    | Form
    |--------------------------------------------------------------------------
    */

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<ChangePasswordForm>({
        resolver: zodResolver(changePasswordSchema),

        defaultValues: {
            current_password: "",
            password: "",
            password_confirmation: "",
        },
    });

    /*
    |--------------------------------------------------------------------------
    | Submit
    |--------------------------------------------------------------------------
    */

    const onSubmit = async (formData: ChangePasswordForm) => {
        try {
            await axios.post("/settings/change-password", formData);

            reset();

            toast.success("Password changed successfully.");
        } catch (error: any) {
            const serverErrors = error?.response?.data?.errors;

            if (serverErrors) {
                Object.keys(serverErrors).forEach((field) => {
                    setError(field as keyof ChangePasswordForm, {
                        type: "server",
                        message: serverErrors[field][0],
                    });
                });

                return;
            }

            toast.error(
                error?.response?.data?.message ??
                    "Something went wrong while changing your password.",
            );
        }
    };

    return (
        <div className="mx-auto w-full max-w-2xl">
            <div className="space-y-6">
                {/* Header */}

                <div>
                    <div className="flex items-center gap-3">
                        <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <KeyRound className="size-5" />
                        </div>

                        <div>
                            <h1 className="text-xl font-semibold tracking-tight">
                                Change Password
                            </h1>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Update your password to keep your account
                                secure.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form Card */}

                <Card className="overflow-hidden border-border/60 shadow-sm">
                    {/* Card Header */}

                    <div className="border-b px-5 py-5 sm:px-6">
                        <div className="flex items-start gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <LockKeyhole className="size-5" />
                            </div>

                            <div>
                                <h2 className="text-sm font-semibold">
                                    Password Information
                                </h2>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Enter your current password and choose a new
                                    secure password.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6 px-5 py-6 sm:px-6"
                    >
                        {/* Current Password */}

                        <div className="space-y-2">
                            <Label htmlFor="current_password">
                                Current Password
                            </Label>

                            <div className="relative">
                                <Input
                                    id="current_password"
                                    type={
                                        showCurrentPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Enter your current password"
                                    autoComplete="current-password"
                                    disabled={isSubmitting}
                                    className="pr-11"
                                    {...register("current_password")}
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowCurrentPassword(
                                            !showCurrentPassword,
                                        )
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                                    tabIndex={-1}
                                >
                                    {showCurrentPassword ? (
                                        <EyeOff className="size-4" />
                                    ) : (
                                        <Eye className="size-4" />
                                    )}
                                </button>
                            </div>

                            <InputError
                                message={errors.current_password?.message}
                            />
                        </div>

                        {/* Divider */}

                        <div className="border-t" />

                        {/* New Password */}

                        <div className="space-y-2">
                            <Label htmlFor="password">New Password</Label>

                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your new password"
                                    autoComplete="new-password"
                                    disabled={isSubmitting}
                                    className="pr-11"
                                    {...register("password")}
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                                    tabIndex={-1}
                                >
                                    {showPassword ? (
                                        <EyeOff className="size-4" />
                                    ) : (
                                        <Eye className="size-4" />
                                    )}
                                </button>
                            </div>

                            <InputError message={errors.password?.message} />
                        </div>

                        {/* Confirm Password */}

                        <div className="space-y-2">
                            <Label htmlFor="password_confirmation">
                                Confirm New Password
                            </Label>

                            <div className="relative">
                                <Input
                                    id="password_confirmation"
                                    type={
                                        showPasswordConfirmation
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Confirm your new password"
                                    autoComplete="new-password"
                                    disabled={isSubmitting}
                                    className="pr-11"
                                    {...register("password_confirmation")}
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPasswordConfirmation(
                                            !showPasswordConfirmation,
                                        )
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                                    tabIndex={-1}
                                >
                                    {showPasswordConfirmation ? (
                                        <EyeOff className="size-4" />
                                    ) : (
                                        <Eye className="size-4" />
                                    )}
                                </button>
                            </div>

                            <InputError
                                message={errors.password_confirmation?.message}
                            />
                        </div>

                        {/* Password Requirements */}

                        <div className="rounded-xl border bg-muted/30 p-4">
                            <div className="flex gap-3">
                                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <ShieldCheck className="size-4" />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-sm font-medium">
                                        Password Requirements
                                    </p>

                                    <div className="mt-3 space-y-2 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="size-3.5 text-primary" />
                                            At least 8 characters
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="size-3.5 text-primary" />
                                            Use a strong and unique password
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="size-3.5 text-primary" />
                                            Confirm your new password correctly
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}

                        <div className="flex flex-col-reverse gap-2 border-t pt-5 sm:flex-row sm:justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => reset()}
                                disabled={isSubmitting}
                                className="w-full sm:w-auto"
                            >
                                Reset
                            </Button>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full gap-2 sm:w-auto"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin" />
                                        Changing Password...
                                    </>
                                ) : (
                                    <>
                                        <KeyRound className="size-4" />
                                        Change Password
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
}

ChangePassword.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
