import { PropsWithChildren } from "react";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export default function AuthLayout({ children }: PropsWithChildren) {
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-muted/30 px-4 py-8">
            {/* Background decoration */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -left-32 -top-32 size-72 rounded-full bg-primary/5 blur-3xl" />
                <div className="absolute -bottom-32 -right-32 size-72 rounded-full bg-primary/5 blur-3xl" />
            </div>

            <div className="relative z-10 w-full max-w-[420px]">
                {/* Logo / Brand */}
                <div className="mb-8 flex flex-col items-center text-center">
                    <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                        <ShieldCheck className="size-7" />
                    </div>

                    <h1 className="text-2xl font-bold tracking-tight">
                        Admin Portal
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage your system securely
                    </p>
                </div>

                {/* Login Card */}
                <Card className="overflow-hidden border-border/60 bg-background/95 shadow-xl shadow-black/5 backdrop-blur">
                    <CardHeader className="space-y-2 px-6 pb-2 pt-6 sm:px-8 sm:pt-8">
                        <CardTitle className="text-xl font-semibold">
                            Welcome back
                        </CardTitle>

                        <CardDescription className="leading-relaxed">
                            Sign in to your account to continue to the
                            administration portal.
                        </CardDescription>
                    </CardHeader>

                    {children}
                </Card>

                {/* Footer */}
                <p className="mt-6 text-center text-xs text-muted-foreground">
                    Protected access · © {new Date().getFullYear()}
                </p>
            </div>
        </div>
    );
}
