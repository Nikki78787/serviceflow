import Link from "next/link";
import { redirect } from "next/navigation";
import {
    ArrowLeft,
    ArrowRight,
    CalendarClock,
    CircleDollarSign,
    Clock3,
    Plus,
    Sparkles,
    Tag,
    } from "lucide-react";

    import { auth } from "@/auth";
    import prisma from "@/lib/prisma";

    function formatDuration(durationMinutes: number) {
    if (durationMinutes < 60) {
        return `${durationMinutes} min`;
    }

    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;

    if (minutes === 0) {
        return `${hours} hr`;
    }

    return `${hours} hr ${minutes} min`;
    }

    export default async function ServicesPage() {
    const session = await auth();

    if (!session?.user?.email) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: {
        email: session.user.email.toLowerCase(),
        },
        select: {
        memberships: {
            where: {
            role: "OWNER",
            status: "ACTIVE",
            },
            orderBy: {
            createdAt: "asc",
            },
            take: 1,
            include: {
            business: true,
            },
        },
        },
    });

    if (!user) {
        redirect("/login");
    }

    const membership = user.memberships[0];

    if (!membership) {
        redirect("/onboarding");
    }

    const business = membership.business;

    const services = await prisma.service.findMany({
        where: {
        businessId: business.id,
        },
        orderBy: {
        createdAt: "desc",
        },
    });

    const formatPrice = (price: number) =>
        new Intl.NumberFormat("en-MY", {
        style: "currency",
        currency: business.currency,
        maximumFractionDigits: 2,
        }).format(price);

    const activeServiceCount = services.filter(
        (service) => service.isActive
    ).length;

    return (
        <main className="min-h-screen bg-[#f7f6fb] p-5 sm:p-8 lg:p-10">
        <div className="mx-auto max-w-7xl">
            <header className="flex flex-col gap-5 rounded-[1.6rem] border border-white bg-white px-6 py-5 shadow-[0_15px_45px_rgba(65,44,140,0.08)] sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
                <Link
                href="/dashboard"
                className="grid size-10 place-items-center rounded-xl bg-[#f2eff9] text-[#716b82] transition hover:bg-[#eeeaff] hover:text-[#7558f7]"
                aria-label="Back to dashboard"
                >
                <ArrowLeft className="size-4" />
                </Link>

                <div>
                <p className="font-display text-lg font-bold tracking-[-0.06em] text-[#15152c]">
                    Services and pricing
                </p>
                <p className="text-xs font-medium text-[#878394]">
                    {business.name}
                </p>
                </div>
            </div>

            <Link
                href="/services/new"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#15152c] px-4 py-3 text-sm font-bold text-white shadow-[0_10px_22px_rgba(21,21,44,0.16)] transition hover:-translate-y-0.5 hover:bg-[#2a2948]"
            >
                <Plus className="size-4" />
                Add service
            </Link>
            </header>

            <section className="relative mt-8 overflow-hidden rounded-[2rem] bg-[#15152c] px-7 py-10 text-white shadow-[0_22px_55px_rgba(21,21,44,0.18)] sm:px-10">
            <div className="absolute -right-20 -top-20 size-64 rounded-full bg-[#7558f7]/60 blur-3xl" />
            <div className="absolute -bottom-28 right-32 size-72 rounded-full bg-[#b8f5cf]/20 blur-3xl" />

            <div className="relative z-10 max-w-3xl">
                <p className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#b8f5cf]">
                <Sparkles className="size-3.5" />
                Your booking menu
                </p>

                <h1 className="font-display mt-4 text-4xl font-bold tracking-[-0.065em] sm:text-5xl">
                Set clear prices. Make booking effortless.
                </h1>

                <p className="mt-5 max-w-2xl text-lg leading-8 text-white/65">
                Each service you add can later be displayed on your public booking
                page, assigned to staff, added to appointments, and included in
                invoices.
                </p>

                <Link
                href="/services/new"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#b8f5cf] px-5 py-3.5 text-sm font-bold text-[#173b2a] transition hover:-translate-y-0.5 hover:bg-[#d0f9dd]"
                >
                Create your first service
                <ArrowRight className="size-4" />
                </Link>
            </div>
            </section>

            <section className="mt-8 grid gap-4 sm:grid-cols-3">
            <article className="rounded-[1.5rem] border border-[#e8e4ef] bg-white p-5 shadow-[0_10px_30px_rgba(65,44,140,0.05)]">
                <div className="grid size-11 place-items-center rounded-2xl bg-[#eeeaff]">
                <Tag className="size-5 text-[#7558f7]" />
                </div>
                <p className="mt-5 text-sm font-semibold text-[#767183]">
                Total services
                </p>
                <p className="font-display mt-1 text-3xl font-bold tracking-[-0.06em] text-[#1d1b31]">
                {services.length}
                </p>
            </article>

            <article className="rounded-[1.5rem] border border-[#e8e4ef] bg-white p-5 shadow-[0_10px_30px_rgba(65,44,140,0.05)]">
                <div className="grid size-11 place-items-center rounded-2xl bg-[#e4f9ec]">
                <CalendarClock className="size-5 text-[#277246]" />
                </div>
                <p className="mt-5 text-sm font-semibold text-[#767183]">
                Available to book
                </p>
                <p className="font-display mt-1 text-3xl font-bold tracking-[-0.06em] text-[#1d1b31]">
                {activeServiceCount}
                </p>
            </article>

            <article className="rounded-[1.5rem] border border-[#e8e4ef] bg-white p-5 shadow-[0_10px_30px_rgba(65,44,140,0.05)]">
                <div className="grid size-11 place-items-center rounded-2xl bg-[#e8f2ff]">
                <CircleDollarSign className="size-5 text-[#2d70d4]" />
                </div>
                <p className="mt-5 text-sm font-semibold text-[#767183]">
                Currency
                </p>
                <p className="font-display mt-1 text-3xl font-bold tracking-[-0.06em] text-[#1d1b31]">
                {business.currency}
                </p>
            </article>
            </section>

            <section className="mt-8">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#7558f7]">
                    Service catalogue
                </p>

                <h2 className="font-display mt-2 text-3xl font-bold tracking-[-0.06em] text-[#201d35]">
                    What can customers book?
                </h2>
                </div>

                <p className="text-sm font-medium text-[#858092]">
                {services.length === 1
                    ? "1 service created"
                    : `${services.length} services created`}
                </p>
            </div>

            {services.length === 0 ? (
                <div className="rounded-[1.7rem] border border-dashed border-[#d7cfff] bg-white px-6 py-16 text-center">
                <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#eeeaff]">
                    <Tag className="size-6 text-[#7558f7]" />
                </div>

                <h3 className="font-display mt-5 text-2xl font-bold tracking-[-0.05em] text-[#28243d]">
                    Your service menu is empty.
                </h3>

                <p className="mx-auto mt-3 max-w-md leading-7 text-[#777385]">
                    Add your first service and give customers something to book.
                    You can edit details, pause availability, and add staff later.
                </p>

                <Link
                    href="/services/new"
                    className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#7558f7] px-5 py-3.5 text-sm font-bold text-white shadow-[0_14px_25px_rgba(117,88,247,0.24)] transition hover:-translate-y-0.5 hover:bg-[#6248e7]"
                >
                    Add my first service
                    <ArrowRight className="size-4" />
                </Link>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {services.map((service) => (
                    <article
                    key={service.id}
                    className="group rounded-[1.6rem] border border-[#e8e4ef] bg-white p-5 shadow-[0_10px_30px_rgba(65,44,140,0.05)] transition hover:-translate-y-1 hover:border-[#cfc3ff] hover:shadow-[0_20px_40px_rgba(65,44,140,0.11)]"
                    >
                    <div className="flex items-start justify-between gap-4">
                        <div className="grid size-11 place-items-center rounded-2xl bg-[#eeeaff] font-display text-lg font-bold text-[#7558f7]">
                        {service.name.charAt(0).toUpperCase()}
                        </div>

                        <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                            service.isActive
                            ? "bg-[#e4f9ec] text-[#277246]"
                            : "bg-[#f2eff7] text-[#777385]"
                        }`}
                        >
                        {service.isActive ? "Available" : "Paused"}
                        </span>
                    </div>

                    <h3 className="font-display mt-6 text-2xl font-bold tracking-[-0.05em] text-[#26223b]">
                        {service.name}
                    </h3>

                    <p className="mt-2 min-h-12 text-sm leading-6 text-[#7c7789]">
                        {service.description || "No service description added yet."}
                    </p>

                    <div className="mt-6 flex items-center justify-between border-t border-[#eeeaf4] pt-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-[#6d687a]">
                        <Clock3 className="size-4 text-[#9c97a8]" />
                        {formatDuration(service.durationMinutes)}
                        </div>

                        <p className="font-display text-xl font-bold tracking-[-0.05em] text-[#15152c]">
                        {formatPrice(Number(service.price))}
                        </p>
                    </div>
                    </article>
                ))}
                </div>
            )}
            </section>
        </div>
        </main>
    );
}