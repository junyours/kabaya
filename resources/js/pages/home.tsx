import {
    ArrowRight,
    CheckCircle2,
    Download,
    Fingerprint,
    MapPin,
    Newspaper,
    PhoneCall,
    ShieldCheck,
    Smartphone,
    Users,
} from "lucide-react";
import Logo from "../../../public/images/logo.png";
import WonderfulOpol from "../../../public/images/wonderful-opol.png";

const BRAND = "hsl(346.8 77.2% 49.8%)";

export default function Home() {
    return (
        <main className="min-h-screen overflow-hidden bg-[#FCF9FA] text-slate-900">
            {/* =====================================================
          NAVBAR
      ====================================================== */}
            <header className="fixed inset-x-0 top-0 z-50 border-b border-white/30 bg-white/70 backdrop-blur-xl">
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
                    {/* Logo */}
                    <a href="#" className="flex items-center gap-3">
                        <img
                            src={WonderfulOpol}
                            alt="wonderful-opol"
                            className="size-20"
                        />

                        <div>
                            <img src={Logo} alt="logo" className="w-24 h-7" />

                            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                                For Opol Residents
                            </p>
                        </div>
                    </a>

                    {/* Desktop navigation */}
                    <nav className="hidden items-center gap-8 md:flex">
                        <a
                            href="#features"
                            className="text-sm font-medium text-slate-600 transition hover:text-[hsl(346.8_77.2%_49.8%)]"
                        >
                            Features
                        </a>

                        <a
                            href="#about"
                            className="text-sm font-medium text-slate-600 transition hover:text-[hsl(346.8_77.2%_49.8%)]"
                        >
                            About
                        </a>

                        <a
                            href="#download"
                            className="rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5"
                            style={{
                                backgroundColor: BRAND,
                                boxShadow: `0 12px 30px ${BRAND}25`,
                            }}
                        >
                            Download App
                        </a>
                    </nav>

                    {/* Mobile */}
                    <a
                        href="#download"
                        className="rounded-full px-4 py-2 text-sm font-semibold text-white md:hidden"
                        style={{ backgroundColor: BRAND }}
                    >
                        Download
                    </a>
                </div>
            </header>

            {/* =====================================================
          HERO
      ====================================================== */}
            <section className="relative overflow-hidden pt-32 lg:pt-40">
                {/* Large background circle - top left */}
                <div
                    className="absolute -left-[260px] -top-[120px] h-[620px] w-[620px] rounded-full blur-3xl"
                    style={{
                        backgroundColor: `${BRAND}12`,
                    }}
                />

                {/* Large background circle - top right */}
                <div
                    className="absolute -right-[260px] top-[80px] h-[650px] w-[650px] rounded-full blur-3xl"
                    style={{
                        backgroundColor: `${BRAND}10`,
                    }}
                />

                {/* Small decorative circles */}
                <div
                    className="absolute left-[8%] top-[45%] h-20 w-20 rounded-full blur-2xl"
                    style={{
                        backgroundColor: `${BRAND}18`,
                    }}
                />

                <div
                    className="absolute right-[8%] top-[35%] h-28 w-28 rounded-full blur-2xl"
                    style={{
                        backgroundColor: `${BRAND}15`,
                    }}
                />

                <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 pb-24 lg:grid-cols-2 lg:px-8">
                    {/* =================================================
              HERO CONTENT
          ================================================== */}
                    <div className="relative z-10 max-w-2xl">
                        {/* Badge */}
                        <div
                            className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 backdrop-blur"
                            style={{
                                borderColor: `${BRAND}25`,
                                backgroundColor: `${BRAND}08`,
                            }}
                        >
                            <span
                                className="h-2 w-2 rounded-full"
                                style={{
                                    backgroundColor: BRAND,
                                    boxShadow: `0 0 12px ${BRAND}`,
                                }}
                            />

                            <span
                                className="text-xs font-bold uppercase tracking-wider"
                                style={{ color: BRAND }}
                            >
                                Made for Opol
                            </span>
                        </div>

                        {/* Heading */}
                        <h2 className="text-5xl font-black leading-[1.05] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                            Your community,
                            <span className="block" style={{ color: BRAND }}>
                                right in your hands.
                            </span>
                        </h2>

                        {/* Description */}
                        <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">
                            Kabaya brings essential community services, local
                            information, emergency assistance, and digital
                            services closer to every Opol resident.
                        </p>

                        {/* CTA */}
                        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                            <a
                                href="#download"
                                className="group inline-flex items-center justify-center gap-3 rounded-2xl px-7 py-4 font-bold text-white transition hover:-translate-y-1"
                                style={{
                                    backgroundColor: BRAND,
                                    boxShadow: `0 20px 50px ${BRAND}35`,
                                }}
                            >
                                <Download size={20} />
                                Download Kabaya
                                <ArrowRight
                                    size={18}
                                    className="transition group-hover:translate-x-1"
                                />
                            </a>

                            <a
                                href="#features"
                                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white/80 px-7 py-4 font-bold text-slate-700 backdrop-blur transition hover:bg-white"
                            >
                                Explore Features
                            </a>
                        </div>

                        {/* Trust points */}
                        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
                            <div className="flex items-center gap-2">
                                <CheckCircle2
                                    size={17}
                                    style={{ color: BRAND }}
                                />
                                Easy to use
                            </div>

                            <div className="flex items-center gap-2">
                                <ShieldCheck
                                    size={17}
                                    style={{ color: BRAND }}
                                />
                                Secure
                            </div>

                            <div className="flex items-center gap-2">
                                <MapPin size={17} style={{ color: BRAND }} />
                                For Opol
                            </div>
                        </div>
                    </div>

                    {/* =================================================
              PHONE AREA
          ================================================== */}
                    <div className="relative flex justify-center lg:justify-end">
                        {/* Main huge glow */}
                        <div
                            className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
                            style={{
                                backgroundColor: `${BRAND}18`,
                            }}
                        />

                        {/* Outer circle */}
                        <div
                            className="absolute left-1/2 top-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full border"
                            style={{
                                borderColor: `${BRAND}12`,
                            }}
                        />

                        {/* Inner circle */}
                        <div
                            className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full"
                            style={{
                                backgroundColor: `${BRAND}08`,
                            }}
                        />

                        {/* Small circles */}
                        <div
                            className="absolute left-0 top-20 h-24 w-24 rounded-full blur-2xl"
                            style={{
                                backgroundColor: `${BRAND}18`,
                            }}
                        />

                        <div
                            className="absolute bottom-20 right-0 h-32 w-32 rounded-full blur-2xl"
                            style={{
                                backgroundColor: `${BRAND}20`,
                            }}
                        />

                        <div className="relative z-10">
                            {/* =================================================
                  FLOATING EMERGENCY CARD
              ================================================== */}
                            <div className="absolute -left-20 top-28 z-30 hidden rounded-2xl border border-white/80 bg-white/90 p-4 shadow-2xl backdrop-blur-xl sm:block">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="flex h-10 w-10 items-center justify-center rounded-xl"
                                        style={{
                                            backgroundColor: `${BRAND}10`,
                                            color: BRAND,
                                        }}
                                    >
                                        <PhoneCall size={20} />
                                    </div>

                                    <div>
                                        <p className="text-xs text-slate-500">
                                            Emergency
                                        </p>

                                        <p className="font-bold text-slate-900">
                                            Quick Access
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* =================================================
                  FLOATING VERIFICATION CARD
              ================================================== */}
                            <div className="absolute -right-14 bottom-28 z-30 hidden rounded-2xl border border-white/80 bg-white/90 p-4 shadow-2xl backdrop-blur-xl sm:block">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="flex h-10 w-10 items-center justify-center rounded-xl"
                                        style={{
                                            backgroundColor: `${BRAND}10`,
                                            color: BRAND,
                                        }}
                                    >
                                        <Fingerprint size={20} />
                                    </div>

                                    <div>
                                        <p className="text-xs text-slate-500">
                                            Identity
                                        </p>

                                        <p className="font-bold text-slate-900">
                                            Verified
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* =================================================
                  PHONE
              ================================================== */}
                            <div className="relative h-[650px] w-[320px] rounded-[48px] border-[8px] border-slate-950 bg-slate-950 p-2 shadow-[0_40px_100px_rgba(15,23,42,0.25)]">
                                <div className="relative h-full overflow-hidden rounded-[38px] bg-[#F8F5F6]">
                                    {/* Dynamic island */}
                                    <div className="absolute left-1/2 top-3 z-30 h-7 w-28 -translate-x-1/2 rounded-full bg-black" />

                                    {/* Header */}
                                    <div className="px-6 pb-4 pt-14">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs text-slate-500">
                                                    Good morning
                                                </p>

                                                <h3 className="text-xl font-black text-slate-900">
                                                    Welcome to Kabaya
                                                </h3>
                                            </div>

                                            <div
                                                className="flex h-10 w-10 items-center justify-center rounded-full font-bold text-white"
                                                style={{
                                                    backgroundColor: BRAND,
                                                }}
                                            >
                                                A
                                            </div>
                                        </div>
                                    </div>

                                    {/* Main card */}
                                    <div
                                        className="mx-5 rounded-3xl p-5 text-white shadow-xl"
                                        style={{
                                            background: `linear-gradient(135deg, ${BRAND}, hsl(346.8 77.2% 42%))`,
                                        }}
                                    >
                                        <p className="text-xs text-white/70">
                                            Your community
                                        </p>

                                        <p className="mt-1 text-2xl font-black">
                                            Kabaya
                                        </p>

                                        <p className="mt-3 text-xs leading-5 text-white/80">
                                            Everything you need as an Opol
                                            resident, in one place.
                                        </p>

                                        <div className="mt-5 flex items-center gap-2 text-xs font-semibold">
                                            <MapPin size={14} />
                                            Opol, Misamis Oriental
                                        </div>
                                    </div>

                                    {/* Quick Access */}
                                    <div className="px-5 pt-6">
                                        <div className="mb-3 flex items-center justify-between">
                                            <p className="font-bold text-slate-900">
                                                Quick Access
                                            </p>

                                            <p
                                                className="text-xs font-semibold"
                                                style={{ color: BRAND }}
                                            >
                                                View all
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-4 gap-3">
                                            {[
                                                {
                                                    icon: PhoneCall,
                                                    label: "Emergency",
                                                },
                                                {
                                                    icon: Newspaper,
                                                    label: "News",
                                                },
                                                {
                                                    icon: Users,
                                                    label: "Services",
                                                },
                                                {
                                                    icon: ShieldCheck,
                                                    label: "Verify",
                                                },
                                            ].map((item) => {
                                                const Icon = item.icon;

                                                return (
                                                    <div
                                                        key={item.label}
                                                        className="flex flex-col items-center gap-2"
                                                    >
                                                        <div
                                                            className="flex h-12 w-12 items-center justify-center rounded-2xl"
                                                            style={{
                                                                backgroundColor: `${BRAND}10`,
                                                                color: BRAND,
                                                            }}
                                                        >
                                                            <Icon size={19} />
                                                        </div>

                                                        <span className="text-[9px] font-semibold text-slate-500">
                                                            {item.label}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* News */}
                                    <div className="px-5 pt-7">
                                        <p className="mb-3 font-bold text-slate-900">
                                            Community Updates
                                        </p>

                                        <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
                                            <div
                                                className="h-28"
                                                style={{
                                                    background: `linear-gradient(135deg, ${BRAND}, hsl(346.8 77.2% 70%))`,
                                                }}
                                            />

                                            <div className="p-4">
                                                <p
                                                    className="text-[10px] font-bold uppercase"
                                                    style={{
                                                        color: BRAND,
                                                    }}
                                                >
                                                    Community
                                                </p>

                                                <p className="mt-1 text-sm font-bold text-slate-900">
                                                    Stay updated with Opol
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom circular decoration */}
                <div
                    className="absolute -bottom-[180px] left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full blur-3xl"
                    style={{
                        backgroundColor: `${BRAND}10`,
                    }}
                />
            </section>

            {/* =====================================================
          STATS
      ====================================================== */}
            <section className="relative overflow-hidden border-y border-slate-100 bg-white">
                {/* Background glow */}
                <div
                    className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
                    style={{
                        backgroundColor: `${BRAND}06`,
                    }}
                />

                <div className="relative mx-auto grid max-w-6xl grid-cols-2 divide-x divide-slate-100 px-6 py-12 md:grid-cols-4">
                    {[
                        ["24/7", "Community Access"],
                        ["1", "Connected Platform"],
                        ["Fast", "Digital Services"],
                        ["Secure", "Identity Protection"],
                    ].map(([value, label]) => (
                        <div key={label} className="px-5 text-center">
                            <p
                                className="text-3xl font-black"
                                style={{ color: BRAND }}
                            >
                                {value}
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                                {label}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* =====================================================
          FEATURES
      ====================================================== */}
            <section
                id="features"
                className="relative overflow-hidden bg-[#FCF9FA] py-24"
            >
                {/* Background circles */}
                <div
                    className="absolute -left-[250px] top-[100px] h-[500px] w-[500px] rounded-full blur-3xl"
                    style={{
                        backgroundColor: `${BRAND}08`,
                    }}
                />

                <div
                    className="absolute -right-[250px] bottom-[50px] h-[500px] w-[500px] rounded-full blur-3xl"
                    style={{
                        backgroundColor: `${BRAND}10`,
                    }}
                />

                <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                    {/* Heading */}
                    <div className="mx-auto max-w-2xl text-center">
                        <span
                            className="text-sm font-bold uppercase tracking-[0.2em]"
                            style={{ color: BRAND }}
                        >
                            Everything in one place
                        </span>

                        <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                            Built around the needs of Opol residents.
                        </h2>

                        <p className="mt-5 text-lg leading-8 text-slate-600">
                            Kabaya makes important community services and
                            information easier to access from your phone.
                        </p>
                    </div>

                    {/* Feature cards */}
                    <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {[
                            {
                                icon: ShieldCheck,
                                title: "Secure Identity",
                                text: "Protect your account with identity verification and secure authentication.",
                            },
                            {
                                icon: PhoneCall,
                                title: "Emergency Assistance",
                                text: "Access important emergency contacts when you need help quickly.",
                            },
                            {
                                icon: Newspaper,
                                title: "Community News",
                                text: "Stay informed about announcements, events, and important updates.",
                            },
                            {
                                icon: Users,
                                title: "Resident Services",
                                text: "Connect residents with useful local services and information.",
                            },
                            {
                                icon: Fingerprint,
                                title: "Easy Authentication",
                                text: "Use modern authentication methods for a convenient and secure experience.",
                            },
                            {
                                icon: Smartphone,
                                title: "Designed for Mobile",
                                text: "A simple and modern experience designed specifically for your phone.",
                            },
                        ].map((feature) => {
                            const Icon = feature.icon;

                            return (
                                <div
                                    key={feature.title}
                                    className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white/80 p-7 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                                >
                                    {/* Card circle */}
                                    <div
                                        className="absolute -right-12 -top-12 h-32 w-32 rounded-full blur-2xl transition duration-500 group-hover:scale-150"
                                        style={{
                                            backgroundColor: `${BRAND}08`,
                                        }}
                                    />

                                    <div
                                        className="relative flex h-14 w-14 items-center justify-center rounded-2xl"
                                        style={{
                                            backgroundColor: `${BRAND}10`,
                                            color: BRAND,
                                        }}
                                    >
                                        <Icon size={25} />
                                    </div>

                                    <h3 className="relative mt-6 text-xl font-black text-slate-900">
                                        {feature.title}
                                    </h3>

                                    <p className="relative mt-3 leading-7 text-slate-600">
                                        {feature.text}
                                    </p>

                                    <div
                                        className="relative mt-6 flex items-center gap-2 text-sm font-bold"
                                        style={{ color: BRAND }}
                                    >
                                        Learn more
                                        <ArrowRight size={16} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* =====================================================
          ABOUT
      ====================================================== */}
            <section
                id="about"
                className="relative overflow-hidden bg-white py-24"
            >
                {/* Big circles */}
                <div
                    className="absolute -right-[200px] top-[100px] h-[500px] w-[500px] rounded-full blur-3xl"
                    style={{
                        backgroundColor: `${BRAND}09`,
                    }}
                />

                <div
                    className="absolute -left-[200px] bottom-[50px] h-[400px] w-[400px] rounded-full blur-3xl"
                    style={{
                        backgroundColor: `${BRAND}06`,
                    }}
                />

                <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2 lg:px-8">
                    {/* Text */}
                    <div>
                        <span
                            className="text-sm font-bold uppercase tracking-[0.2em]"
                            style={{ color: BRAND }}
                        >
                            Why Kabaya?
                        </span>

                        <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                            Technology that brings the community closer.
                        </h2>

                        <p className="mt-6 text-lg leading-8 text-slate-600">
                            Kabaya is designed to make digital community
                            services more accessible to residents of Opol.
                            Important information and services are brought
                            together into one simple mobile experience.
                        </p>

                        <div className="mt-8 space-y-4">
                            {[
                                "Simple and resident-friendly interface",
                                "Secure user authentication",
                                "Quick access to emergency contacts",
                                "Local announcements and community information",
                            ].map((item) => (
                                <div
                                    key={item}
                                    className="flex items-center gap-3"
                                >
                                    <CheckCircle2
                                        size={20}
                                        className="shrink-0"
                                        style={{ color: BRAND }}
                                    />

                                    <span className="font-medium text-slate-700">
                                        {item}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* About Card */}
                    <div className="relative">
                        {/* Glow behind card */}
                        <div
                            className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
                            style={{
                                backgroundColor: `${BRAND}15`,
                            }}
                        />

                        <div
                            className="relative overflow-hidden rounded-[40px] p-8 shadow-2xl sm:p-12"
                            style={{
                                background: `linear-gradient(135deg, hsl(346.8 77.2% 36%), ${BRAND})`,
                            }}
                        >
                            {/* Decorative circle */}
                            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/10" />

                            <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-white/5" />

                            <div className="relative max-w-md">
                                <img
                                    src={WonderfulOpol}
                                    alt="wonderful-opol"
                                    className="size-28"
                                />

                                <h3 className="mt-8 text-3xl font-black text-white">
                                    One app.
                                    <br />
                                    One community.
                                </h3>

                                <p className="mt-5 leading-7 text-white/70">
                                    Kabaya is built to connect residents with
                                    the information, services, and assistance
                                    they need.
                                </p>

                                <div className="mt-8 rounded-2xl bg-white/10 p-5 backdrop-blur">
                                    <div className="flex items-center gap-4">
                                        <MapPin className="text-white/80" />

                                        <div>
                                            <p className="text-xs text-white/50">
                                                Community
                                            </p>

                                            <p className="font-bold text-white">
                                                Opol, Misamis Oriental
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================
          DOWNLOAD CTA
      ====================================================== */}
            <section
                id="download"
                className="relative overflow-hidden"
                style={{
                    background: `linear-gradient(135deg, hsl(346.8 77.2% 43%), ${BRAND})`,
                }}
            >
                {/* Large circles */}
                <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-white/10 blur-3xl" />

                <div className="absolute -bottom-40 -right-40 h-[550px] w-[550px] rounded-full bg-black/10 blur-3xl" />

                <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />

                <div className="relative mx-auto max-w-5xl px-6 py-24 text-center">
                    {/* Logo */}
                    <div className="mx-auto flex items-center justify-center">
                        <img
                            src={WonderfulOpol}
                            alt="wonderful-opol"
                            className="size-28"
                        />
                    </div>

                    <h2 className="mt-7 text-4xl font-black tracking-tight text-white sm:text-5xl">
                        Kabaya is always with you.
                    </h2>

                    <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/75">
                        Download the Kabaya mobile app and experience a simpler
                        way to connect with your community.
                    </p>

                    {/* Download buttons */}
                    <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                        <a
                            href="https://drive.google.com/uc?export=download&id=1Fm4UQRyZlKn_gRDcDY3FuwPvl09OP0jI"
                            target="_blank"
                            className="inline-flex items-center justify-center gap-3 rounded-2xl bg-white px-7 py-4 font-bold text-slate-900 shadow-xl transition hover:-translate-y-1 hover:shadow-2xl"
                        >
                            <Smartphone size={21} />
                            Download for Android
                        </a>

                        {/* <a
                            href="#"
                            className="inline-flex items-center justify-center gap-3 rounded-2xl border border-white/30 bg-white/10 px-7 py-4 font-bold text-white backdrop-blur transition hover:bg-white/20"
                        >
                            <Smartphone size={21} />
                            Download for iOS
                        </a> */}
                    </div>

                    <p className="mt-6 text-xs text-white/60">
                        Available for Opol residents
                    </p>
                </div>
            </section>

            {/* =====================================================
          FOOTER
      ====================================================== */}
            <footer className="relative overflow-hidden bg-slate-950 text-white">
                {/* Footer glow */}
                <div
                    className="absolute -right-32 -top-32 h-64 w-64 rounded-full blur-3xl"
                    style={{
                        backgroundColor: `${BRAND}15`,
                    }}
                />

                <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 md:flex-row md:items-center md:justify-between lg:px-8">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <img
                            src={WonderfulOpol}
                            alt="wonderful-opol"
                            className="size-20"
                        />

                        <div>
                            <img src={Logo} alt="logo" className="w-24 h-7" />

                            <p className="text-xs text-slate-500">
                                For Opol Residents
                            </p>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="flex flex-wrap gap-6 text-sm text-slate-400">
                        <a
                            href="#features"
                            className="transition hover:text-white"
                        >
                            Features
                        </a>

                        <a
                            href="#about"
                            className="transition hover:text-white"
                        >
                            About
                        </a>

                        <a
                            href="#download"
                            className="transition hover:text-white"
                        >
                            Download
                        </a>
                    </div>

                    {/* Copyright */}
                    <p className="text-sm text-slate-500">
                        © {new Date().getFullYear()} Kabaya. All rights
                        reserved.
                    </p>
                </div>
            </footer>
        </main>
    );
}
