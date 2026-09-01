import React from "react";
import {
    ShieldCheck,
    Lock,
    Camera,
    UserRound,
    FileText,
    Database,
    Mail,
    ChevronRight,
} from "lucide-react";

const sections = [
    {
        id: "information",
        title: "Information We Collect",
        icon: UserRound,
        content: (
            <>
                <p>
                    Depending on the features you use, Kabaya may collect
                    information necessary to provide its services.
                </p>

                <h3>Personal Information</h3>
                <ul>
                    <li>Full name</li>
                    <li>Resident ID or identification number</li>
                    <li>Mobile phone number</li>
                    <li>Email address</li>
                    <li>Date of birth</li>
                    <li>Address or municipality information</li>
                    <li>Civil status</li>
                </ul>

                <h3>Account Information</h3>
                <ul>
                    <li>Username</li>
                    <li>Login credentials</li>
                    <li>One-time passwords (OTP)</li>
                    <li>Account verification status</li>
                    <li>Authentication and security information</li>
                </ul>
            </>
        ),
    },
    {
        id: "usage",
        title: "How We Use Your Information",
        icon: Database,
        content: (
            <>
                <p>We use collected information to:</p>
                <ul>
                    <li>Create and manage user accounts</li>
                    <li>Verify user identity and residency</li>
                    <li>Provide Kabaya services and features</li>
                    <li>Authenticate users</li>
                    <li>Process OTP and security verification</li>
                    <li>Verify identification documents</li>
                    <li>Improve application functionality</li>
                    <li>Prevent unauthorized access and misuse</li>
                    <li>Maintain application security</li>
                    <li>Comply with applicable laws and regulations</li>
                </ul>

                <p className="font-medium">
                    We do not sell your personal information.
                </p>
            </>
        ),
    },
    {
        id: "camera",
        title: "Camera Permission",
        icon: Camera,
        content: (
            <>
                <p>
                    Kabaya may request access to your device camera when a
                    feature requires it.
                </p>

                <p>Camera access may be used for:</p>

                <ul>
                    <li>Identification document scanning</li>
                    <li>Optical character recognition (OCR)</li>
                    <li>Face recognition or identity verification</li>
                    <li>Other security and verification features</li>
                </ul>

                <p>
                    Kabaya does not continuously access or record your camera
                    when you are not actively using a camera-related feature.
                </p>
            </>
        ),
    },
    {
        id: "biometric",
        title: "Biometric and Face Recognition",
        icon: Lock,
        content: (
            <>
                <p>
                    Where applicable, Kabaya may use face recognition or
                    biometric-related technology to assist with identity
                    verification and account security.
                </p>

                <p>
                    Biometric information is treated as sensitive information
                    and is handled only for legitimate verification and security
                    purposes.
                </p>

                <p>
                    We do not use biometric information for advertising or
                    unrelated purposes.
                </p>

                <p>
                    Where possible, biometric processing may be performed
                    locally on the user's device. Information necessary to
                    complete verification may be securely transmitted to our
                    servers when required.
                </p>
            </>
        ),
    },
    {
        id: "documents",
        title: "Identification Documents",
        icon: FileText,
        content: (
            <>
                <p>
                    If you use the ID scanning feature, Kabaya may process
                    information obtained from your identification document.
                </p>

                <p>This information may be used to:</p>

                <ul>
                    <li>Identify the document holder</li>
                    <li>Verify resident information</li>
                    <li>Reduce manual data entry</li>
                    <li>Assist with account registration</li>
                    <li>Prevent fraudulent or unauthorized registration</li>
                </ul>

                <p>
                    Users should only scan identification documents that belong
                    to them or that they are legally authorized to submit.
                </p>
            </>
        ),
    },
    {
        id: "sharing",
        title: "How We Share Information",
        icon: ShieldCheck,
        content: (
            <>
                <p>We do not sell or rent your personal information.</p>

                <p>
                    Information may be shared only when necessary to provide
                    Kabaya services, operate connected systems, protect users,
                    or comply with legal requirements.
                </p>

                <p>This may include:</p>

                <ul>
                    <li>Authorized Kabaya administrators</li>
                    <li>Authorized municipal or government systems</li>
                    <li>
                        Service providers supporting application infrastructure
                    </li>
                    <li>
                        Authentication, hosting, database, or security providers
                    </li>
                    <li>
                        Law enforcement or government authorities when legally
                        required
                    </li>
                </ul>
            </>
        ),
    },
    {
        id: "security",
        title: "Data Security",
        icon: Lock,
        content: (
            <>
                <p>
                    We use reasonable administrative, technical, and
                    organizational measures to protect your information.
                </p>

                <p>These measures are designed to protect against:</p>

                <ul>
                    <li>Unauthorized access</li>
                    <li>Unauthorized disclosure</li>
                    <li>Loss</li>
                    <li>Misuse</li>
                    <li>Alteration</li>
                    <li>Destruction</li>
                </ul>

                <p>
                    However, no electronic storage or transmission method can be
                    guaranteed to be completely secure.
                </p>
            </>
        ),
    },
    {
        id: "retention",
        title: "Data Retention",
        icon: Database,
        content: (
            <>
                <p>
                    We retain personal information only for as long as
                    reasonably necessary to provide Kabaya services and fulfill
                    legal or security requirements.
                </p>

                <p>
                    When information is no longer required, it may be deleted,
                    anonymized, or securely disposed of in accordance with
                    applicable policies and legal requirements.
                </p>
            </>
        ),
    },
    {
        id: "rights",
        title: "Your Rights",
        icon: UserRound,
        content: (
            <>
                <p>
                    Depending on applicable laws and regulations, you may have
                    the right to:
                </p>

                <ul>
                    <li>Request access to your personal information</li>
                    <li>Request correction of inaccurate information</li>
                    <li>Request deletion where legally applicable</li>
                    <li>Withdraw certain permissions</li>
                    <li>Ask how your information is being used</li>
                    <li>
                        Raise concerns about the processing of your information
                    </li>
                </ul>
            </>
        ),
    },
    {
        id: "children",
        title: "Children's Privacy",
        icon: UserRound,
        content: (
            <p>
                Kabaya is not intended to knowingly collect personal information
                from children without appropriate authorization. If you believe
                that a child has provided personal information without
                appropriate consent or authorization, please contact us.
            </p>
        ),
    },
    {
        id: "third-party",
        title: "Third-Party Services",
        icon: Database,
        content: (
            <p>
                Kabaya may use third-party services to support application
                functionality, including hosting, authentication, analytics,
                security, or infrastructure services. These providers may
                process limited information necessary to provide their services.
            </p>
        ),
    },
    {
        id: "external-links",
        title: "External Links and Connected Systems",
        icon: FileText,
        content: (
            <p>
                Kabaya may provide links or access to external websites,
                applications, or connected systems. Kabaya is not responsible
                for the privacy practices, content, or security of third-party
                services that are not operated by us.
            </p>
        ),
    },
    {
        id: "changes",
        title: "Changes to This Privacy Policy",
        icon: FileText,
        content: (
            <p>
                We may update this Privacy Policy from time to time to reflect
                changes in our application, services, legal requirements, or
                privacy practices. When changes are made, we will update the
                effective date displayed at the top of this Privacy Policy.
            </p>
        ),
    },
];

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-[#fafafa] text-gray-900">
            {/* Hero */}
            <section className="border-b border-gray-200 bg-white">
                <div className="mx-auto max-w-5xl px-6 py-16 text-center sm:py-20">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#d91656]/10 text-[#d91656]">
                        <ShieldCheck size={32} />
                    </div>

                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                        Privacy Policy
                    </h1>

                    <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-600">
                        Your privacy matters to us. Learn how Kabaya collects,
                        uses, protects, and manages your personal information.
                    </p>

                    <p className="mt-5 text-sm font-medium text-gray-400">
                        Effective Date: September 1, 2026
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <main className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[240px_1fr]">
                {/* Sidebar */}
                <aside className="hidden lg:block">
                    <div className="sticky top-24">
                        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
                            On this page
                        </p>

                        <nav className="space-y-1">
                            {sections.map((section) => (
                                <a
                                    key={section.id}
                                    href={`#${section.id}`}
                                    className="group flex items-center justify-between rounded-lg px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-100 hover:text-[#d91656]"
                                >
                                    <span>{section.title}</span>
                                    <ChevronRight
                                        size={14}
                                        className="opacity-0 transition group-hover:opacity-100"
                                    />
                                </a>
                            ))}
                        </nav>
                    </div>
                </aside>

                {/* Policy */}
                <article className="max-w-4xl">
                    {/* Introduction */}
                    <section className="mb-12">
                        <p className="text-lg leading-8 text-gray-600">
                            Kabaya (“we,” “our,” or “the App”) respects your
                            privacy and is committed to protecting your personal
                            information. This Privacy Policy explains how Kabaya
                            collects, uses, stores, and protects information
                            when you use our mobile application and related
                            services.
                        </p>

                        <p className="mt-5 leading-7 text-gray-600">
                            By using Kabaya, you agree to the practices
                            described in this Privacy Policy.
                        </p>
                    </section>

                    {/* Sections */}
                    <div className="space-y-12">
                        {sections.map((section, index) => {
                            const Icon = section.icon;

                            return (
                                <section
                                    key={section.id}
                                    id={section.id}
                                    className="scroll-mt-24 border-b border-gray-200 pb-12 last:border-0"
                                >
                                    <div className="mb-5 flex items-start gap-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#d91656]/10 text-[#d91656]">
                                            <Icon size={19} />
                                        </div>

                                        <div>
                                            <p className="mb-1 text-xs font-semibold text-gray-400">
                                                {String(index + 1).padStart(
                                                    2,
                                                    "0",
                                                )}
                                            </p>

                                            <h2 className="text-2xl font-bold tracking-tight">
                                                {section.title}
                                            </h2>
                                        </div>
                                    </div>

                                    <div className="policy-content pl-0 text-[15px] leading-7 text-gray-600 sm:pl-14">
                                        {section.content}
                                    </div>
                                </section>
                            );
                        })}

                        {/* Contact */}
                        <section
                            id="contact"
                            className="scroll-mt-24 rounded-2xl bg-gray-900 p-7 text-white sm:p-9"
                        >
                            <div className="flex gap-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                                    <Mail size={20} />
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-400">
                                        Contact Us
                                    </p>

                                    <h2 className="mt-1 text-2xl font-bold">
                                        Questions about your privacy?
                                    </h2>

                                    <p className="mt-3 leading-7 text-gray-300">
                                        If you have questions, concerns, or
                                        requests regarding this Privacy Policy
                                        or the handling of your personal
                                        information, please contact us.
                                    </p>

                                    <a
                                        href="mailto:ditads@infosheet.dev"
                                        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-gray-100"
                                    >
                                        <Mail size={16} />
                                        ditads@infosheet.dev
                                    </a>
                                </div>
                            </div>
                        </section>
                    </div>
                </article>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-200 bg-white">
                <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        © {new Date().getFullYear()} Kabaya. All rights
                        reserved.
                    </div>

                    <div>Last updated September 1, 2026</div>
                </div>
            </footer>

            {/* Typography */}
            <style>{`
        .policy-content p {
          margin-bottom: 18px;
        }

        .policy-content h3 {
          margin-top: 28px;
          margin-bottom: 12px;
          font-size: 16px;
          font-weight: 700;
          color: #171717;
        }

        .policy-content ul {
          margin: 14px 0 20px;
          padding-left: 22px;
          list-style-type: disc;
        }

        .policy-content li {
          margin-bottom: 7px;
          padding-left: 4px;
        }
      `}</style>
        </div>
    );
}
