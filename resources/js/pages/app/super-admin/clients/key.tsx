import AppLayout from "@/layouts/app-layout";
import { usePage } from "@inertiajs/react";
import axios from "axios";
import { ReactNode, useState } from "react";

import {
    AlertTriangle,
    Check,
    Clipboard,
    KeyRound,
    RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

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

import { PageProps } from "@/types";

export default function Key() {
    const { apiClient } = usePage<PageProps>().props;

    const [showGenerateDialog, setShowGenerateDialog] = useState(false);

    const [processing, setProcessing] = useState(false);

    const [copied, setCopied] = useState(false);

    const [generatedKey, setGeneratedKey] = useState<string | null>(null);

    /**
     * Copy API key
     */
    const copyKey = async (key: string) => {
        if (!key) {
            return;
        }

        try {
            await navigator.clipboard.writeText(key);

            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch (error) {
            console.error("Failed to copy API key:", error);
        }
    };

    /**
     * Generate new API key
     */
    const generateKey = async () => {
        try {
            setProcessing(true);

            const response = await axios.post(
                "/super-admin/clients/keys/generate",
            );
            setGeneratedKey(response.data.api_key);
            setShowGenerateDialog(false);
        } catch (error) {
            console.error("Failed to generate API key:", error);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <div className="mx-auto w-full max-w-3xl space-y-6 p-6">
                {/* Header */}
                <div>
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <KeyRound className="size-5" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight">
                                API Key
                            </h1>

                            <p className="text-sm text-muted-foreground">
                                Manage the API key used by external systems.
                            </p>
                        </div>
                    </div>
                </div>

                {/* API Access */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <KeyRound className="size-5 text-primary" />
                            API Access
                        </CardTitle>

                        <CardDescription>
                            Generate an API key that an external system can use
                            to access your API.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        {apiClient ? (
                            <div className="rounded-xl border border-destructive/20 bg-destructive/[0.03] p-4">
                                <div className="flex gap-3">
                                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                                        <AlertTriangle className="size-4" />
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium">
                                            Regenerate API key
                                        </p>

                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Generating a new key will
                                            immediately invalidate the current
                                            key.
                                        </p>
                                    </div>
                                </div>

                                <Button
                                    type="button"
                                    variant="destructive"
                                    className="mt-4"
                                    onClick={() => setShowGenerateDialog(true)}
                                >
                                    <RefreshCw className="mr-2 size-4" />
                                    Generate New API Key
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-10 text-center">
                                <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <KeyRound className="size-6" />
                                </div>

                                <h3 className="font-semibold">No API key</h3>

                                <p className="mt-1 max-w-md text-sm text-muted-foreground">
                                    Generate an API key to allow an external
                                    system to securely access your API.
                                </p>

                                <Button
                                    type="button"
                                    className="mt-5"
                                    onClick={() => setShowGenerateDialog(true)}
                                >
                                    <KeyRound className="mr-2 size-4" />
                                    Generate API Key
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Newly Generated API Key */}
                {generatedKey && (
                    <Card className="border-primary/30">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Check className="size-5 text-primary" />
                                New API Key
                            </CardTitle>

                            <CardDescription>
                                Copy this key now. The secret will not be
                                displayed again.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <div className="rounded-xl border bg-muted/30 p-3">
                                <div className="flex items-start gap-2">
                                    <code className="min-w-0 flex-1 break-all px-2 py-1 text-sm">
                                        {generatedKey}
                                    </code>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => copyKey(generatedKey)}
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
                            </div>

                            <div className="mt-4 rounded-lg bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-400">
                                <strong>Important:</strong> Save this API key
                                securely. The secret cannot be recovered after
                                leaving this page.
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Confirmation Dialog */}
            <AlertDialog
                open={showGenerateDialog}
                onOpenChange={setShowGenerateDialog}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Generate a new API key?
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            This will permanently delete the current API key and
                            create a new one. Any external system using the
                            current key will immediately lose access.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={processing}>
                            Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction
                            disabled={processing}
                            onClick={(event) => {
                                event.preventDefault();

                                generateKey();
                            }}
                        >
                            {processing ? (
                                <>
                                    <RefreshCw className="mr-2 size-4 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <KeyRound className="mr-2 size-4" />
                                    Generate New Key
                                </>
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

Key.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
