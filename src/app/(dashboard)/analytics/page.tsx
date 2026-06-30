import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, BarChart3, ReceiptText } from "lucide-react";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import AnalyticsCharts from "@/features/analytics/components/analytics-charts";

function getMonthKey(date: Date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
    )}`;
    }

    function getDayKey(date: Date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
    }

    export default async function AnalyticsPage() {
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
    const today = new Date();

    const startOfCurrentMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
    );

    const startOfSixMonths = new Date(
        today.getFullYear(),
        today.getMonth() - 5,
        1
    );

    const startOfSevenDays = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - 6
    );

    const [
        paidInvoiceSummary,
        paidInvoicesForTrend,
        bookingsThisMonth,
        recentBookings,
        allAppointments,
        serviceAppointments,
    ] = await Promise.all([
        prisma.invoice.aggregate({
        where: {
            businessId: business.id,
            status: "PAID",
        },
        _sum: {
            totalAmount: true,
        },
        _count: {
            id: true,
        },
        }),

        prisma.invoice.findMany({
        where: {
            businessId: business.id,
            status: "PAID",
            paidAt: {
            gte: startOfSixMonths,
            },
        },
        select: {
            paidAt: true,
            totalAmount: true,
        },
        }),

        prisma.appointment.count({
        where: {
            businessId: business.id,
            createdAt: {
            gte: startOfCurrentMonth,
            },
        },
        }),

        prisma.appointment.findMany({
        where: {
            businessId: business.id,
            createdAt: {
            gte: startOfSevenDays,
            },
        },
        select: {
            createdAt: true,
        },
        }),

        prisma.appointment.findMany({
        where: {
            businessId: business.id,
        },
        select: {
            status: true,
        },
        }),

        prisma.appointment.findMany({
        where: {
            businessId: business.id,
            createdAt: {
            gte: startOfSixMonths,
            },
        },
        select: {
            service: {
            select: {
                name: true,
            },
            },
        },
        }),
    ]);

    const monthFormatter = new Intl.DateTimeFormat("en-MY", {
        month: "short",
    });

    const dayFormatter = new Intl.DateTimeFormat("en-MY", {
        weekday: "short",
    });

    const sixMonths = Array.from({ length: 6 }, (_, index) => {
        return new Date(today.getFullYear(), today.getMonth() - 5 + index, 1);
    });

    const revenueByMonth = new Map<string, number>();

    for (const invoice of paidInvoicesForTrend) {
        if (!invoice.paidAt) {
        continue;
        }

        const key = getMonthKey(invoice.paidAt);

        revenueByMonth.set(
        key,
        (revenueByMonth.get(key) ?? 0) + Number(invoice.totalAmount)
        );
    }

    const revenueTrend = sixMonths.map((month) => ({
        label: monthFormatter.format(month),
        revenue: revenueByMonth.get(getMonthKey(month)) ?? 0,
    }));

    const sevenDays = Array.from({ length: 7 }, (_, index) => {
        return new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - 6 + index
        );
    });

    const bookingsByDay = new Map<string, number>();

    for (const booking of recentBookings) {
        const key = getDayKey(booking.createdAt);

        bookingsByDay.set(key, (bookingsByDay.get(key) ?? 0) + 1);
    }

    const bookingTrend = sevenDays.map((day) => ({
        label: dayFormatter.format(day),
        bookings: bookingsByDay.get(getDayKey(day)) ?? 0,
    }));

    const serviceCounts = new Map<string, number>();

    for (const appointment of serviceAppointments) {
        const serviceName = appointment.service.name;

        serviceCounts.set(serviceName, (serviceCounts.get(serviceName) ?? 0) + 1);
    }

    const serviceData = [...serviceCounts.entries()]
        .map(([name, bookings]) => ({
        name,
        bookings,
        }))
        .sort((first, second) => second.bookings - first.bookings)
        .slice(0, 5);

    const statusCounts: Record<string, number> = {
        PENDING: 0,
        CONFIRMED: 0,
        CHECKED_IN: 0,
        COMPLETED: 0,
        CANCELLED: 0,
        NO_SHOW: 0,
    };

    for (const appointment of allAppointments) {
        statusCounts[appointment.status] =
        (statusCounts[appointment.status] ?? 0) + 1;
    }

    const statusData = [
        {
        name: "Pending",
        value: statusCounts.PENDING,
        color: "#ffb5a8",
        },
        {
        name: "Confirmed",
        value: statusCounts.CONFIRMED,
        color: "#2d8cff",
        },
        {
        name: "Checked in",
        value: statusCounts.CHECKED_IN,
        color: "#7558f7",
        },
        {
        name: "Completed",
        value: statusCounts.COMPLETED,
        color: "#49b878",
        },
        {
        name: "Cancelled",
        value: statusCounts.CANCELLED,
        color: "#a9a4b3",
        },
        {
        name: "No show",
        value: statusCounts.NO_SHOW,
        color: "#d9654d",
        },
    ];

    const totalRevenue = Number(paidInvoiceSummary._sum.totalAmount ?? 0);

    const revenueThisMonth =
        revenueTrend[revenueTrend.length - 1]?.revenue ?? 0;

    const finalisedBookings =
        statusCounts.COMPLETED +
        statusCounts.CANCELLED +
        statusCounts.NO_SHOW;

    const completionRate =
        finalisedBookings === 0
        ? 0
        : Math.round((statusCounts.COMPLETED / finalisedBookings) * 100);

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
                    Business analytics
                </p>
                <p className="text-xs font-medium text-[#878394]">
                    {business.name}
                </p>
                </div>
            </div>

            <Link
                href="/invoices"
                className="inline-flex items-center gap-2 rounded-xl bg-[#15152c] px-4 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#2a2948]"
            >
                <ReceiptText className="size-4" />
                Manage invoices
            </Link>
            </header>

            <section className="relative mt-8 overflow-hidden rounded-[2rem] bg-[#15152c] px-7 py-10 text-white shadow-[0_22px_55px_rgba(21,21,44,0.18)] sm:px-10">
            <div className="absolute -right-20 -top-20 size-64 rounded-full bg-[#7558f7]/60 blur-3xl" />
            <div className="absolute -bottom-24 right-40 size-72 rounded-full bg-[#b8f5cf]/20 blur-3xl" />

            <div className="relative z-10 max-w-3xl">
                <p className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#b8f5cf]">
                <BarChart3 className="size-3.5" />
                Live business intelligence
                </p>

                <h1 className="font-display mt-4 text-4xl font-bold tracking-[-0.065em] sm:text-5xl">
                See what is working. Know what to improve.
                </h1>

                <p className="mt-5 max-w-2xl text-lg leading-8 text-white/65">
                Follow your revenue, booking activity, service demand, and
                customer workflow from one clear analytics workspace.
                </p>
            </div>
            </section>

            <AnalyticsCharts
            currency={business.currency}
            totalRevenue={totalRevenue}
            revenueThisMonth={revenueThisMonth}
            bookingsThisMonth={bookingsThisMonth}
            completionRate={completionRate}
            paidInvoiceCount={paidInvoiceSummary._count.id}
            revenueTrend={revenueTrend}
            bookingTrend={bookingTrend}
            serviceData={serviceData}
            statusData={statusData}
            />
        </div>
        </main>
    );
}