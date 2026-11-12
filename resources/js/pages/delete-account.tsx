import { Head } from "@inertiajs/react";
import {
    AlertCircle,
    CheckCircle2,
    Clock,
    FileText,
    LockKeyhole,
    Mail,
    ShieldCheck,
    Trash2,
    UserRound,
} from "lucide-react";

const deletionSteps = [
    "Open the Kabaya mobile application and navigate to Account Settings.",
    "Select the Delete Account option.",
    "Provide the required account information to verify your identity.",
    "Submit your account deletion request.",
    "Wait for the Kabaya administrator to review and process your request.",
    "You will receive confirmation once your account deletion is completed.",
];

const deletedData = [
    "Personal information and account profile",
    "Registered email address and contact information",
    "Resident identification and account details",
    "Uploaded identification documents",
    "Selfie and facial verification photographs",
    "Authentication credentials and associated device information",
    "Other personal information associated with your account",
];

const retainedData = [
    {
        title: "Official and Government Records",
        description:
            "Records that must be preserved under applicable laws, regulations, or government records retention requirements.",
    },
    {
        title: "Security and Fraud Prevention",
        description:
            "Information necessary to investigate security incidents, prevent fraudulent activities, or comply with legal obligations.",
    },
];

export default function DeleteAccount() {
    return (
        <>
            <Head title="Account Deletion - Kabaya">
                <meta
                    name="description"
                    content="Learn how to request the deletion of your Kabaya account and associated personal data."
                />
            </Head>

            <main className="min-h-screen bg-slate-50 text-slate-900">
                {/* Hero */}
                <section className="relative overflow-hidden bg-white">
                    <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-rose-100/60 blur-3xl" />
                    <div className="absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-rose-50 blur-3xl" />

                    <div className="relative mx-auto max-w-5xl px-6 py-20 text-center sm:py-24">
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                            <Trash2 size={30} />
                        </div>

                        <span className="mb-4 inline-flex items-center rounded-full border border-rose-100 bg-rose-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-rose-600">
                            Account Management
                        </span>

                        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
                            Account and Data{" "}
                            <span className="text-rose-600">Deletion</span>
                        </h1>

                        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-500 sm:text-lg">
                            Your privacy matters to us. If you no longer wish to
                            use Kabaya, you can request the deletion of your
                            account and associated personal information.
                        </p>
                    </div>
                </section>

                {/* Content */}
                <section className="mx-auto max-w-4xl px-6 py-14 sm:py-16">
                    {/* Important Notice */}
                    <div className="mb-10 flex gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                        <AlertCircle
                            className="mt-0.5 shrink-0 text-amber-600"
                            size={22}
                        />
                        <div>
                            <h2 className="font-semibold text-amber-900">
                                Please read before proceeding
                            </h2>
                            <p className="mt-1 text-sm leading-7 text-amber-800">
                                Account deletion is a permanent action. Once
                                your request has been verified and processed,
                                your account and eligible associated personal
                                data will be deleted. This action may affect
                                your access to Kabaya services.
                            </p>
                        </div>
                    </div>

                    {/* Deletion Instructions */}
                    <article className="mb-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                        <div className="mb-6 flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                                <UserRound size={23} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">
                                    How to Request Account Deletion
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Follow these steps to submit your request.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            {deletionSteps.map((step, index) => (
                                <div key={index} className="flex gap-4">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-50 text-sm font-bold text-rose-600">
                                        {index + 1}
                                    </div>
                                    <p className="pt-1 text-sm leading-7 text-slate-600">
                                        {step}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </article>

                    {/* Data to be deleted */}
                    <article className="mb-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                        <div className="mb-6 flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                                <Trash2 size={23} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">
                                    Data That Will Be Deleted
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    The following information will be deleted
                                    after your request is verified and
                                    processed.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {deletedData.map((item, index) => (
                                <div key={index} className="flex gap-3">
                                    <CheckCircle2
                                        size={19}
                                        className="mt-0.5 shrink-0 text-rose-500"
                                    />
                                    <p className="text-sm leading-6 text-slate-600">
                                        {item}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </article>

                    {/* Data Retention */}
                    <article className="mb-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                        <div className="mb-6 flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                                <LockKeyhole size={23} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">
                                    Data That May Be Retained
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Certain information may need to be retained
                                    for legitimate purposes.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            {retainedData.map((item, index) => (
                                <div
                                    key={index}
                                    className="rounded-xl bg-slate-50 p-5"
                                >
                                    <h3 className="font-semibold text-slate-800">
                                        {item.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-7 text-slate-500">
                                        {item.description}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 rounded-xl border border-amber-100 bg-amber-50 p-5">
                            <p className="text-sm leading-7 text-amber-900">
                                <strong>Retention period:</strong> Records
                                required to be retained will be kept only for
                                the period prescribed by applicable laws and
                                government records retention requirements. Once
                                the retention period expires, the information
                                will be securely disposed of in accordance with
                                applicable policies.
                            </p>
                        </div>
                    </article>

                    {/* Processing Time */}
                    <article className="mb-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <Clock size={23} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">
                                    Processing Time
                                </h2>
                                <p className="mt-1 text-sm leading-7 text-slate-500">
                                    Requests will be reviewed after submission
                                    and identity verification. You will be
                                    notified once your request has been
                                    completed or if additional information is
                                    required.
                                </p>
                            </div>
                        </div>
                    </article>

                    {/* Privacy */}
                    <article className="mb-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                                <ShieldCheck size={23} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">
                                    Your Privacy Matters
                                </h2>
                                <p className="mt-1 text-sm leading-7 text-slate-500">
                                    Kabaya is committed to protecting your
                                    personal information and handling account
                                    deletion requests responsibly, in accordance
                                    with applicable data protection laws and
                                    regulations.
                                </p>
                            </div>
                        </div>
                    </article>

                    {/* Contact */}
                    <section className="rounded-2xl bg-slate-900 p-7 text-white sm:p-9">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-rose-300">
                            <Mail size={24} />
                        </div>

                        <h2 className="mt-5 text-2xl font-bold">
                            Need Assistance?
                        </h2>

                        <p className="mt-3 text-sm leading-7 text-slate-300">
                            If you have questions about account deletion or need
                            assistance submitting a request, please contact the
                            Kabaya support team through the official contact
                            channels of the application developer.
                        </p>

                        <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-6 text-sm text-slate-300">
                            <FileText size={18} />
                            <span>Kabaya – Digital Services of Opol</span>
                        </div>
                    </section>

                    <p className="mt-10 text-center text-xs leading-6 text-slate-400">
                        © {new Date().getFullYear()} Kabaya. All rights
                        reserved.
                        <br />
                        Account and Data Deletion Information
                    </p>
                </section>
            </main>
        </>
    );
}
