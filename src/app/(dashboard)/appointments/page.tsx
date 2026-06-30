import Link from "next/link";
import { redirect } from "next/navigation";
import {
    ArrowLeft,
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Plus,
    Sparkles,
    UserRound,
    } from "lucide-react";

    import { auth } from "@/auth";
    import prisma from "@/lib/prisma";
import AppointmentActions from "@/features/appointments/components/appointment-actions";


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

    function getInitials(fullName: string) {
    return fullName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((name) => name.charAt(0).toUpperCase())
        .join("");
    }

    export default async function AppointmentsPage() {
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
    const now = new Date();

    const appointments = await prisma.appointment.findMany({
        where: {
            businessId: business.id,
            startTime: {
            gte: now,
            },
            status: {
            in: ["PENDING", "CONFIRMED", "CHECKED_IN"],
            },
        },
        orderBy: {
            startTime: "asc",
        },
        include: {
            customer: true,
            service: true,
        },
        });

    const endOfSevenDays = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 7,
        23,
        59,
        59
    );

    const upcomingThisWeek = appointments.filter(
        (appointment) => appointment.startTime <= endOfSevenDays
    ).length;

    const pendingAppointments = appointments.filter(
        (appointment) => appointment.status === "PENDING"
    ).length;

    const dateFormatter = new Intl.DateTimeFormat("en-MY", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: business.timezone,
    });

    const timeFormatter = new Intl.DateTimeFormat("en-MY", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: business.timezone,
    });

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
                    Appointments
                </p>
                <p className="text-xs font-medium text-[#878394]">
                    {business.name}
                </p>
                </div>
            </div>

            <Link
                href="/appointments/new"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#15152c] px-4 py-3 text-sm font-bold text-white shadow-[0_10px_22px_rgba(21,21,44,0.16)] transition hover:-translate-y-0.5 hover:bg-[#2a2948]"
            >
                <Plus className="size-4" />
                New booking
            </Link>
            </header>

            <section className="relative mt-8 overflow-hidden rounded-[2rem] bg-[#15152c] px-7 py-10 text-white shadow-[0_22px_55px_rgba(21,21,44,0.18)] sm:px-10">
            <div className="absolute -right-20 -top-20 size-64 rounded-full bg-[#7558f7]/60 blur-3xl" />
            <div className="absolute -bottom-24 right-40 size-72 rounded-full bg-[#b8f5cf]/20 blur-3xl" />

            <div className="relative z-10 max-w-3xl">
                <p className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#b8f5cf]">
                <Sparkles className="size-3.5" />
                Your booking calendar
                </p>

                <h1 className="font-display mt-4 text-4xl font-bold tracking-[-0.065em] sm:text-5xl">
                Turn your services into real bookings.
                </h1>

                <p className="mt-5 max-w-2xl text-lg leading-8 text-white/65">
                Choose a customer, choose a service, set a time, and ServiceFlow
                handles the rest — including pricing and schedule conflicts.
                </p>

                <Link
                href="/appointments/new"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#b8f5cf] px-5 py-3.5 text-sm font-bold text-[#173b2a] transition hover:-translate-y-0.5 hover:bg-[#d0f9dd]"
                >
                Create a booking
                <ArrowRight className="size-4" />
                </Link>
            </div>
            </section>

            <section className="mt-8 grid gap-4 sm:grid-cols-3">
            <article className="rounded-[1.5rem] border border-[#e8e4ef] bg-white p-5 shadow-[0_10px_30px_rgba(65,44,140,0.05)]">
                <div className="grid size-11 place-items-center rounded-2xl bg-[#eeeaff]">
                <CalendarDays className="size-5 text-[#7558f7]" />
                </div>

                <p className="mt-5 text-sm font-semibold text-[#767183]">
                Upcoming bookings
                </p>

                <p className="font-display mt-1 text-3xl font-bold tracking-[-0.06em] text-[#1d1b31]">
                {appointments.length}
                </p>
            </article>

            <article className="rounded-[1.5rem] border border-[#e8e4ef] bg-white p-5 shadow-[0_10px_30px_rgba(65,44,140,0.05)]">
                <div className="grid size-11 place-items-center rounded-2xl bg-[#e4f9ec]">
                <Clock3 className="size-5 text-[#277246]" />
                </div>

                <p className="mt-5 text-sm font-semibold text-[#767183]">
                Next 7 days
                </p>

                <p className="font-display mt-1 text-3xl font-bold tracking-[-0.06em] text-[#1d1b31]">
                {upcomingThisWeek}
                </p>
            </article>

            <article className="rounded-[1.5rem] border border-[#e8e4ef] bg-white p-5 shadow-[0_10px_30px_rgba(65,44,140,0.05)]">
                <div className="grid size-11 place-items-center rounded-2xl bg-[#fff0ed]">
                <CheckCircle2 className="size-5 text-[#d9654d]" />
                </div>

                <p className="mt-5 text-sm font-semibold text-[#767183]">
                Pending confirmation
                </p>

                <p className="font-display mt-1 text-3xl font-bold tracking-[-0.06em] text-[#1d1b31]">
                {pendingAppointments}
                </p>
            </article>
            </section>

            <section className="mt-8">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#7558f7]">
                    Upcoming schedule
                </p>

                <h2 className="font-display mt-2 text-3xl font-bold tracking-[-0.06em] text-[#201d35]">
                    What is coming up?
                </h2>
                </div>

                <p className="text-sm font-medium text-[#858092]">
                {appointments.length === 1
                    ? "1 upcoming booking"
                    : `${appointments.length} upcoming bookings`}
                </p>
            </div>

            {appointments.length === 0 ? (
                <div className="rounded-[1.7rem] border border-dashed border-[#cfc3ff] bg-white px-6 py-16 text-center">
                <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#eeeaff]">
                    <CalendarDays className="size-6 text-[#7558f7]" />
                </div>

                <h3 className="font-display mt-5 text-2xl font-bold tracking-[-0.05em] text-[#28243d]">
                    Your calendar is ready.
                </h3>

                <p className="mx-auto mt-3 max-w-md leading-7 text-[#777385]">
                    Create your first appointment to see your customer, service,
                    time, and booking status appear here.
                </p>

                <Link
                    href="/appointments/new"
                    className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#7558f7] px-5 py-3.5 text-sm font-bold text-white shadow-[0_14px_25px_rgba(117,88,247,0.24)] transition hover:-translate-y-0.5 hover:bg-[#6248e7]"
                >
                    Create first booking
                    <ArrowRight className="size-4" />
                </Link>
                </div>
            ) : (
                <div className="space-y-4">
                {appointments.map((appointment) => (
                    <article
                    key={appointment.id}
                    className="rounded-[1.6rem] border border-[#e8e4ef] bg-white p-5 shadow-[0_10px_30px_rgba(65,44,140,0.05)] transition hover:border-[#cfc3ff] hover:shadow-[0_18px_35px_rgba(65,44,140,0.1)]"
                    >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                        <div className="grid size-12 place-items-center rounded-2xl bg-[#eeeaff] text-sm font-extrabold text-[#7558f7]">
                            {getInitials(appointment.customer.fullName)}
                        </div>

                        <div>
                            <p className="font-display text-xl font-bold tracking-[-0.05em] text-[#26223b]">
                            {appointment.customer.fullName}
                            </p>

                            <p className="mt-1 text-sm text-[#777385]">
                            {appointment.service.name} ·{" "}
                            {formatDuration(appointment.service.durationMinutes)}
                            </p>
                        </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                        <div className="rounded-xl bg-[#f7f6fb] px-3 py-2 text-right">
                            <p className="text-xs font-bold text-[#514d61]">
                            {dateFormatter.format(appointment.startTime)}
                            </p>
                            <p className="mt-0.5 text-xs text-[#898494]">
                            {timeFormatter.format(appointment.startTime)} –{" "}
                            {timeFormatter.format(appointment.endTime)}
                            </p>
                        </div>

                        <AppointmentActions
                            appointmentId={appointment.id}
                            status={appointment.status}
                            />
                        </div>
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