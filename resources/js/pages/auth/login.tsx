import { CardContent, CardFooter } from "@/components/ui/card";
import AuthLayout from "@/layouts/auth-layout";
import { useForm } from "@inertiajs/react";
import { FormEvent, ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InputError from "@/components/input-error";
import { Eye, EyeOff, LockKeyhole, UserRound } from "lucide-react";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, clearErrors } = useForm({
        user_name: "",
        password: "",
    });

    const handleLogin = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        clearErrors();

        post(route("login"), {
            preserveScroll: true,
        });
    };

    return (
        <form onSubmit={handleLogin}>
            <CardContent className="space-y-5 px-6 pt-6 sm:px-8 sm:pt-7">
                {/* Username */}
                <div className="space-y-2">
                    <Label htmlFor="user_name" className="text-sm font-medium">
                        Username
                    </Label>

                    <div className="relative">
                        <UserRound className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                        <Input
                            id="user_name"
                            name="user_name"
                            type="text"
                            value={data.user_name}
                            onChange={(e) =>
                                setData("user_name", e.target.value)
                            }
                            placeholder="Enter your username"
                            autoComplete="username"
                            autoFocus
                            disabled={processing}
                            className="h-11 pl-10 transition-shadow focus-visible:ring-2"
                        />
                    </div>

                    <InputError message={errors.user_name} />
                </div>

                {/* Password */}
                <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                        Password
                    </Label>

                    <div className="relative">
                        <LockKeyhole className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            disabled={processing}
                            className="h-11 pl-10 pr-11 transition-shadow focus-visible:ring-2"
                        />

                        <button
                            type="button"
                            tabIndex={-1}
                            onClick={() => setShowPassword((value) => !value)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                            aria-label={
                                showPassword ? "Hide password" : "Show password"
                            }
                        >
                            {showPassword ? (
                                <EyeOff className="size-4" />
                            ) : (
                                <Eye className="size-4" />
                            )}
                        </button>
                    </div>

                    <InputError message={errors.password} />
                </div>

                {/* Security message */}
                <div className="rounded-lg border bg-muted/40 px-3.5 py-3">
                    <p className="text-xs leading-relaxed text-muted-foreground">
                        Your account credentials are protected. Never share your
                        password with anyone.
                    </p>
                </div>
            </CardContent>

            <CardFooter className="px-6 pb-6 pt-5 sm:px-8 sm:pb-8">
                <Button
                    type="submit"
                    disabled={processing}
                    className="h-11 w-full font-medium shadow-sm transition-all hover:shadow-md"
                >
                    {processing ? (
                        <>
                            <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            Signing in...
                        </>
                    ) : (
                        "Sign in"
                    )}
                </Button>
            </CardFooter>
        </form>
    );
}

Login.layout = (page: ReactNode) => <AuthLayout>{page}</AuthLayout>;
