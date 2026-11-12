import {
    ShieldCheck,
    Lock,
    Camera,
    UserRound,
    FileText,
    Database,
    Mail,
    ChevronRight,
    Fingerprint,
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
                    information necessary to provide its services, manage
                    resident accounts, and verify user identities.
                </p>

                <h3>Personal Information</h3>

                <ul>
                    <li>Full name</li>
                    <li>Resident ID or identification number</li>
                    <li>Mobile phone number</li>
                    <li>Email address</li>
                    <li>Date of birth</li>
                    <li>Address or municipality information</li>
                    <li>Sex and civil status, where applicable</li>
                    <li>Other information provided during registration</li>
                </ul>

                <h3>Account and Authentication Information</h3>

                <ul>
                    <li>Username and account identifiers</li>
                    <li>Login credentials and authentication information</li>
                    <li>One-time passwords (OTP) and verification status</li>
                    <li>Account security and access information</li>
                    <li>Device identifiers when used for account security</li>
                </ul>

                <h3>Identity Verification Information</h3>

                <ul>
                    <li>
                        Images of government-issued identification documents
                    </li>
                    <li>Information extracted from identification documents</li>
                    <li>Selfie images and face captures</li>
                    <li>Liveness verification information, where enabled</li>
                    <li>Identity and facial verification results</li>
                    <li>
                        Verification session identifiers and status information
                    </li>
                </ul>

                <p>
                    The information collected depends on the features you access
                    and the information required to complete your account
                    registration and verification.
                </p>
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
                    <li>Create, manage, and maintain user accounts</li>
                    <li>Verify user identity and residency</li>
                    <li>Provide Kabaya services and application features</li>
                    <li>Authenticate users and secure account access</li>
                    <li>
                        Process OTP and other security verification procedures
                    </li>
                    <li>Verify identification documents</li>
                    <li>
                        Perform facial comparison and liveness verification
                        where enabled
                    </li>
                    <li>
                        Prevent fraudulent registrations and unauthorized access
                    </li>
                    <li>Maintain application and information security</li>
                    <li>Communicate important account and service updates</li>
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
                    feature requires it. Camera access is used only when you
                    actively use a camera-related feature.
                </p>

                <p>Camera access may be used for:</p>

                <ul>
                    <li>Identification document scanning</li>
                    <li>Optical character recognition (OCR)</li>
                    <li>Capturing identification document images</li>
                    <li>Taking selfies for identity verification</li>
                    <li>Facial comparison and liveness verification</li>
                </ul>

                <p>
                    Images captured during identity verification may be
                    transmitted securely to Kabaya's servers and Didit,
                    depending on the verification workflow.
                </p>

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
        icon: Fingerprint,
        content: (
            <>
                <p>
                    Kabaya uses biometric-related technology to support identity
                    verification, facial comparison, liveness detection, and
                    account security.
                </p>

                <p>
                    When facial verification is required, your selfie, face
                    images, liveness captures, and information derived from
                    facial analysis may be processed to compare your face with
                    the photograph on your identification document and help
                    verify your identity.
                </p>

                <h3>Biometric Information Processing</h3>

                <ul>
                    <li>Facial images and selfie captures</li>
                    <li>Facial comparison results</li>
                    <li>Liveness detection results</li>
                    <li>
                        Other verification signals generated by the configured
                        workflow
                    </li>
                </ul>

                <p>
                    This information is treated as sensitive personal
                    information and is processed for identity verification,
                    fraud prevention, and security purposes.
                </p>

                <p>
                    Information necessary to complete facial verification may be
                    securely transmitted to Didit for processing. Didit may
                    generate facial comparison results, liveness results, and
                    other verification signals depending on the configured
                    workflow.
                </p>

                <p>
                    Kabaya does not use biometric information for advertising or
                    unrelated purposes.
                </p>

                <h3>Device Biometric Authentication</h3>

                <p>
                    If you enable fingerprint or facial authentication through
                    your device, Kabaya may use your device's supported
                    biometric authentication functionality. The biometric
                    authentication itself is handled by the device's operating
                    system.
                </p>

                <p>
                    Kabaya does not receive your device's stored fingerprint or
                    Face ID biometric template through this authentication
                    process.
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
                    If you use the ID scanning or identity verification feature,
                    Kabaya may process information obtained from your
                    identification document.
                </p>

                <h3>Information That May Be Processed</h3>

                <ul>
                    <li>
                        Images of the front and back of your identification
                        document
                    </li>
                    <li>Name and identification number</li>
                    <li>
                        Date of birth and other information displayed on your ID
                    </li>
                    <li>
                        Document type, expiration date, and document details
                    </li>
                    <li>
                        Information extracted through optical character
                        recognition (OCR)
                    </li>
                </ul>

                <h3>Purpose of Processing</h3>

                <ul>
                    <li>Identify the document holder</li>
                    <li>Verify resident information</li>
                    <li>Reduce manual data entry</li>
                    <li>Assist with account registration</li>
                    <li>Prevent fraudulent or unauthorized registration</li>
                </ul>

                <p>
                    Identification information may be processed by Kabaya and
                    transmitted to Didit when required by the configured
                    identity verification workflow.
                </p>

                <p>
                    Users should only scan identification documents that belong
                    to them or that they are legally authorized to submit.
                </p>
            </>
        ),
    },
    {
        id: "didit",
        title: "Didit Identity Verification",
        icon: ShieldCheck,
        content: (
            <>
                <p>
                    Kabaya uses Didit as a third-party identity verification
                    service provider to help verify the identity of residents
                    and prevent fraudulent registrations.
                </p>

                <p>
                    When you complete identity verification, information may be
                    securely transmitted to Didit for processing, depending on
                    the verification steps configured by Kabaya.
                </p>

                <h3>Information That May Be Processed by Didit</h3>

                <ul>
                    <li>
                        Images of your government-issued identification document
                    </li>
                    <li>
                        Personal information extracted from your identification
                        document
                    </li>
                    <li>Selfie images and face captures</li>
                    <li>
                        Liveness verification information, such as images or
                        video frames
                    </li>
                    <li>Facial comparison results and verification outcomes</li>
                    <li>Verification session identifiers</li>
                    <li>
                        Device, browser, IP address, and security-related
                        information, where enabled
                    </li>
                </ul>

                <h3>Purpose of Processing</h3>

                <ul>
                    <li>Verify your identity and identification document</li>
                    <li>Compare your selfie with the photograph on your ID</li>
                    <li>
                        Perform liveness checks to help detect spoofing or
                        impersonation
                    </li>
                    <li>
                        Detect suspicious or potentially fraudulent verification
                        attempts
                    </li>
                    <li>Return verification results to Kabaya</li>
                </ul>

                <p>
                    Didit processes verification information according to the
                    configured verification workflow and applicable service
                    terms. Didit may also process certain information for its
                    own security, fraud prevention, and legal compliance
                    purposes, as described in its privacy notices.
                </p>

                <p>
                    Verification results may be transmitted to Kabaya and used
                    to determine your account or resident verification status.
                </p>

                <p>
                    For additional information about Didit's data handling
                    practices, please review its{" "}
                    <a
                        href="https://didit.me/terms/verification-privacy-notice/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-[#d91656] underline"
                    >
                        Verification Privacy Notice
                    </a>
                    .
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
                <p>
                    We do not sell or rent your personal information. We may
                    disclose or transmit personal information to authorized
                    service providers when necessary to provide Kabaya services,
                    verify identities, maintain application security, or comply
                    with legal requirements.
                </p>

                <h3>Information May Be Disclosed To</h3>

                <ul>
                    <li>Authorized Kabaya administrators</li>
                    <li>Authorized municipal or government systems</li>
                    <li>
                        Didit, our identity verification service provider, for
                        processing identification documents, selfies, facial
                        verification, liveness checks, and verification results
                    </li>
                    <li>
                        Service providers supporting application hosting,
                        database, authentication, and infrastructure
                    </li>
                    <li>
                        Security and technical service providers necessary to
                        maintain application operations
                    </li>
                    <li>
                        Law enforcement or government authorities when legally
                        required
                    </li>
                </ul>

                <p>
                    Third-party service providers may process information
                    according to their applicable privacy notices, contractual
                    obligations, and legal requirements.
                </p>
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
                    organizational measures to protect your information against
                    unauthorized access, disclosure, alteration, loss, or
                    misuse.
                </p>

                <p>These measures may include:</p>

                <ul>
                    <li>Encrypted connections when transmitting information</li>
                    <li>Authentication and access controls</li>
                    <li>Restricted access to sensitive information</li>
                    <li>Security monitoring and account protection</li>
                    <li>
                        Secure handling of identification documents and
                        verification information
                    </li>
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
                    Kabaya retains personal information only for as long as
                    necessary to provide its services, maintain resident
                    records, complete identity verification, protect account
                    security, and comply with applicable legal requirements.
                </p>

                <p>
                    Information processed through Didit may be retained
                    according to the retention settings configured by Kabaya,
                    applicable service terms, and legal requirements.
                </p>

                <p>
                    When information is no longer necessary, Kabaya may delete
                    or securely dispose of it, subject to applicable legal
                    retention obligations.
                </p>

                <p>
                    Users may request deletion of their personal information
                    through the available account deletion process. Certain
                    information may need to be retained where required by law.
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
                    Subject to applicable data protection laws and regulations,
                    you may have the right to:
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

                <p>
                    Requests may be subject to identity verification and
                    applicable legal or government record-retention
                    requirements.
                </p>
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
            <>
                <p>
                    Kabaya may use third-party services to support application
                    functionality, including hosting, authentication, identity
                    verification, security, and infrastructure services. These
                    providers may process information necessary to provide their
                    services.
                </p>

                <p>
                    These services operate under their applicable privacy
                    policies, service agreements, and data protection
                    requirements.
                </p>
            </>
        ),
    },
    {
        id: "external-links",
        title: "External Links and Connected Systems",
        icon: FileText,
        content: (
            <p>
                Kabaya may provide links or access to external websites,
                applications, or connected systems. These external services may
                have their own privacy policies and data handling practices.
                Kabaya is not responsible for the privacy practices, content, or
                security of third-party services that are not operated by us.
            </p>
        ),
    },
    {
        id: "deletion",
        title: "Account and Data Deletion",
        icon: Database,
        content: (
            <>
                <p>
                    You may request deletion of your Kabaya account and
                    associated personal information through the account deletion
                    process provided by Kabaya.
                </p>

                <p>
                    When a deletion request is received, it will be reviewed and
                    processed in accordance with applicable policies and legal
                    requirements.
                </p>

                <p>
                    Some information may be retained when necessary to comply
                    with legal obligations, maintain official municipal records,
                    resolve disputes, or protect application security.
                </p>

                <p>
                    Please visit our{" "}
                    <a
                        href="/delete-account"
                        className="font-medium text-[#d91656] underline"
                    >
                        Account Deletion page
                    </a>{" "}
                    for instructions on submitting a request.
                </p>
            </>
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

            <main className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[240px_1fr]">
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

                <article className="max-w-4xl">
                    <section className="mb-12">
                        <p className="text-lg leading-8 text-gray-600">
                            Kabaya (“we,” “our,” or “the App”) respects your
                            privacy and is committed to protecting your personal
                            information. This Privacy Policy explains how Kabaya
                            collects, uses, stores, shares, and protects
                            information when you use our mobile application and
                            related services.
                        </p>

                        <p className="mt-5 leading-7 text-gray-600">
                            By using Kabaya, you acknowledge this Privacy
                            Policy. Where required by applicable law, we will
                            provide additional notices and obtain the necessary
                            consent before processing your personal information.
                        </p>
                    </section>

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

            <footer className="border-t border-gray-200 bg-white">
                <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        © {new Date().getFullYear()} Kabaya. All rights
                        reserved.
                    </div>

                    <div>Last updated: November 12, 2026</div>
                </div>
            </footer>

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

                .policy-content a {
                    text-underline-offset: 3px;
                }
            `}</style>
        </div>
    );
}
