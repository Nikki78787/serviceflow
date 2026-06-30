"use client";

import type { ReactNode } from "react";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    } from "recharts";
    import {
    BarChart3,
    CalendarDays,
    CheckCircle2,
    CircleDollarSign,
    ReceiptText,
    } from "lucide-react";

    type RevenuePoint = {
    label: string;
    revenue: number;
    };

    type BookingPoint = {
    label: string;
    bookings: number;
    };

    type ServicePoint = {
    name: string;
    bookings: number;
    };

    type StatusPoint = {
    name: string;
    value: number;
    color: string;
    };

    type AnalyticsChartsProps = {
    currency: string;
    totalRevenue: number;
    revenueThisMonth: number;
    bookingsThisMonth: number;
    completionRate: number;
    paidInvoiceCount: number;
    revenueTrend: RevenuePoint[];
    bookingTrend: BookingPoint[];
    serviceData: ServicePoint[];
    statusData: StatusPoint[];
    };

    function MetricCard({
    label,
    value,
    helper,
    icon,
    accent,
    }: {
    label: string;
    value: string;
    helper: string;
    icon: ReactNode;
    accent: string;
    }) {
    return (
        <article className="rounded-[1.5rem] border border-[#e8e4ef] bg-white p-5 shadow-[0_10px_30px_rgba(65,44,140,0.05)]">
        <div className={`grid size-11 place-items-center rounded-2xl ${accent}`}>
            {icon}
        </div>

        <p className="mt-5 text-sm font-semibold text-[#767183]">{label}</p>

        <p className="font-display mt-1 text-3xl font-bold tracking-[-0.06em] text-[#1d1b31]">
            {value}
        </p>

        <p className="mt-2 text-xs font-medium text-[#aaa5b4]">{helper}</p>
        </article>
    );
    }

    function EmptyChart({
    title,
    message,
    }: {
    title: string;
    message: string;
    }) {
    return (
        <div className="flex h-[290px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#ded7ef] bg-[#fcfbfe] px-6 text-center">
        <BarChart3 className="size-8 text-[#9c8ff0]" />

        <p className="font-display mt-4 text-lg font-bold text-[#302c47]">
            {title}
        </p>

        <p className="mt-2 max-w-sm text-sm leading-6 text-[#858092]">
            {message}
        </p>
        </div>
    );
    }

    export default function AnalyticsCharts({
    currency,
    totalRevenue,
    revenueThisMonth,
    bookingsThisMonth,
    completionRate,
    paidInvoiceCount,
    revenueTrend,
    bookingTrend,
    serviceData,
    statusData,
    }: AnalyticsChartsProps) {
    const money = new Intl.NumberFormat("en-MY", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
    });

    const compactMoney = new Intl.NumberFormat("en-MY", {
        style: "currency",
        currency,
        notation: "compact",
        maximumFractionDigits: 1,
    });

    const visibleStatusData = statusData.filter((status) => status.value > 0);

    const pieData =
        visibleStatusData.length > 0
        ? visibleStatusData
        : [
            {
                name: "No bookings yet",
                value: 1,
                color: "#e5e2ef",
            },
            ];

    return (
        <>
        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
            label="Total revenue"
            value={money.format(totalRevenue)}
            helper={`${paidInvoiceCount} paid invoice${
                paidInvoiceCount === 1 ? "" : "s"
            } recorded`}
            icon={<CircleDollarSign className="size-5 text-[#2d70d4]" />}
            accent="bg-[#e8f2ff]"
            />

            <MetricCard
            label="Revenue this month"
            value={money.format(revenueThisMonth)}
            helper="From invoices marked paid"
            icon={<ReceiptText className="size-5 text-[#277246]" />}
            accent="bg-[#e4f9ec]"
            />

            <MetricCard
            label="Bookings this month"
            value={String(bookingsThisMonth)}
            helper="Bookings created this month"
            icon={<CalendarDays className="size-5 text-[#7558f7]" />}
            accent="bg-[#eeeaff]"
            />

            <MetricCard
            label="Completion rate"
            value={`${completionRate}%`}
            helper="Completed out of finalised bookings"
            icon={<CheckCircle2 className="size-5 text-[#d9654d]" />}
            accent="bg-[#fff0ed]"
            />
        </section>

        <section className="mt-8 grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
            <article className="rounded-[1.7rem] border border-[#e8e4ef] bg-white p-6 shadow-[0_10px_30px_rgba(65,44,140,0.05)]">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#7558f7]">
                    Revenue trend
                </p>

                <h2 className="font-display mt-2 text-2xl font-bold tracking-[-0.05em] text-[#201d35]">
                    Paid revenue over the last six months.
                </h2>
                </div>

                <span className="rounded-full bg-[#e4f9ec] px-3 py-1.5 text-xs font-bold text-[#277246]">
                Paid invoices only
                </span>
            </div>

            <div className="mt-7 h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={revenueTrend}
                    margin={{
                    top: 10,
                    right: 10,
                    left: -15,
                    bottom: 0,
                    }}
                >
                    <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7558f7" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#7558f7" stopOpacity={0.02} />
                    </linearGradient>
                    </defs>

                    <CartesianGrid
                    stroke="#eeeaf4"
                    strokeDasharray="4 4"
                    vertical={false}
                    />

                    <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                        fill: "#8d8899",
                        fontSize: 12,
                    }}
                    />

                    <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                        fill: "#8d8899",
                        fontSize: 12,
                    }}
                    tickFormatter={(value) => compactMoney.format(Number(value))}
                    />

                    <Tooltip
                    cursor={{
                        stroke: "#bcb0ff",
                        strokeWidth: 1,
                    }}
                    contentStyle={{
                        borderRadius: "14px",
                        border: "1px solid #e6e1ef",
                        backgroundColor: "#ffffff",
                        boxShadow: "0 12px 30px rgba(65,44,140,0.12)",
                    }}
                    formatter={(value) => money.format(Number(value))}
                    />

                    <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#7558f7"
                    strokeWidth={3}
                    fill="url(#revenueGradient)"
                    activeDot={{
                        r: 6,
                        fill: "#7558f7",
                        stroke: "#ffffff",
                        strokeWidth: 3,
                    }}
                    />
                </AreaChart>
                </ResponsiveContainer>
            </div>
            </article>

            <article className="rounded-[1.7rem] border border-[#e8e4ef] bg-white p-6 shadow-[0_10px_30px_rgba(65,44,140,0.05)]">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#7558f7]">
                Booking status
            </p>

            <h2 className="font-display mt-2 text-2xl font-bold tracking-[-0.05em] text-[#201d35]">
                Your booking mix.
            </h2>

            <div className="mt-5 flex h-[220px] items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    stroke="none"
                    >
                    {pieData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                    ))}
                    </Pie>

                    <Tooltip
                    contentStyle={{
                        borderRadius: "14px",
                        border: "1px solid #e6e1ef",
                        backgroundColor: "#ffffff",
                        boxShadow: "0 12px 30px rgba(65,44,140,0.12)",
                    }}
                    />
                </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-2 space-y-2">
                {visibleStatusData.length > 0 ? (
                visibleStatusData.map((status) => (
                    <div
                    key={status.name}
                    className="flex items-center justify-between gap-4 text-sm"
                    >
                    <div className="flex items-center gap-2">
                        <span
                        className="size-2.5 rounded-full"
                        style={{
                            backgroundColor: status.color,
                        }}
                        />
                        <span className="font-medium text-[#716c7d]">
                        {status.name}
                        </span>
                    </div>

                    <span className="font-display font-bold text-[#28243d]">
                        {status.value}
                    </span>
                    </div>
                ))
                ) : (
                <p className="text-center text-sm text-[#898494]">
                    Create bookings to see the status breakdown.
                </p>
                )}
            </div>
            </article>
        </section>

        <section className="mt-5 grid gap-5 xl:grid-cols-2">
            <article className="rounded-[1.7rem] border border-[#e8e4ef] bg-white p-6 shadow-[0_10px_30px_rgba(65,44,140,0.05)]">
            <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#7558f7]">
                Booking activity
                </p>

                <h2 className="font-display mt-2 text-2xl font-bold tracking-[-0.05em] text-[#201d35]">
                Bookings created in the last seven days.
                </h2>
            </div>

            <div className="mt-7 h-[290px]">
                <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={bookingTrend}
                    margin={{
                    top: 10,
                    right: 10,
                    left: -15,
                    bottom: 0,
                    }}
                >
                    <CartesianGrid
                    stroke="#eeeaf4"
                    strokeDasharray="4 4"
                    vertical={false}
                    />

                    <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                        fill: "#8d8899",
                        fontSize: 12,
                    }}
                    />

                    <YAxis
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                    tick={{
                        fill: "#8d8899",
                        fontSize: 12,
                    }}
                    />

                    <Tooltip
                    cursor={{
                        fill: "#f4f2fb",
                    }}
                    contentStyle={{
                        borderRadius: "14px",
                        border: "1px solid #e6e1ef",
                        backgroundColor: "#ffffff",
                        boxShadow: "0 12px 30px rgba(65,44,140,0.12)",
                    }}
                    />

                    <Bar
                    dataKey="bookings"
                    fill="#7558f7"
                    radius={[8, 8, 0, 0]}
                    />
                </BarChart>
                </ResponsiveContainer>
            </div>
            </article>

            <article className="rounded-[1.7rem] border border-[#e8e4ef] bg-white p-6 shadow-[0_10px_30px_rgba(65,44,140,0.05)]">
            <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#7558f7]">
                Service popularity
                </p>

                <h2 className="font-display mt-2 text-2xl font-bold tracking-[-0.05em] text-[#201d35]">
                Your most-booked services.
                </h2>
            </div>

            <div className="mt-7">
                {serviceData.length === 0 ? (
                <EmptyChart
                    title="No service data yet."
                    message="Complete or create more bookings to see which services customers choose most."
                />
                ) : (
                <div className="h-[290px]">
                    <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={serviceData}
                        layout="vertical"
                        margin={{
                        top: 0,
                        right: 20,
                        left: 10,
                        bottom: 0,
                        }}
                    >
                        <CartesianGrid
                        stroke="#eeeaf4"
                        strokeDasharray="4 4"
                        horizontal={false}
                        />

                        <XAxis
                        type="number"
                        allowDecimals={false}
                        axisLine={false}
                        tickLine={false}
                        tick={{
                            fill: "#8d8899",
                            fontSize: 12,
                        }}
                        />

                        <YAxis
                        type="category"
                        dataKey="name"
                        width={110}
                        axisLine={false}
                        tickLine={false}
                        tick={{
                            fill: "#716c7d",
                            fontSize: 12,
                        }}
                        />

                        <Tooltip
                        cursor={{
                            fill: "#f4f2fb",
                        }}
                        contentStyle={{
                            borderRadius: "14px",
                            border: "1px solid #e6e1ef",
                            backgroundColor: "#ffffff",
                            boxShadow: "0 12px 30px rgba(65,44,140,0.12)",
                        }}
                        />

                        <Bar
                        dataKey="bookings"
                        fill="#2d8cff"
                        radius={[0, 8, 8, 0]}
                        />
                    </BarChart>
                    </ResponsiveContainer>
                </div>
                )}
            </div>
            </article>
        </section>
        </>
    );
}