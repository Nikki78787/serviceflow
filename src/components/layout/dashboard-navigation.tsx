"use client";

import ServiceFlowLogo from "@/components/shared/serviceflow-logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    CalendarDays,
    FileText,
    BarChart3,
    LayoutDashboard,
    ReceiptText,
    Scissors,
    UsersRound,
    UserPlus,

    } from "lucide-react";

    const navigationItems = [
    {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        label: "Analytics",
        href: "/analytics",
        icon: BarChart3,
    },
    {
        label: "Services",
        href: "/services",
        icon: Scissors,
    },
    {
        label: "Customers",
        href: "/customers",
        icon: UsersRound,
    },

    {
        label: "Staff",
        href: "/staff",
        icon: UserPlus,
    },

    {
        label: "Bookings",
        href: "/appointments",
        icon: CalendarDays,
    },
    {
        label: "Invoices",
        href: "/invoices",
        icon: ReceiptText,
    },
];

    export default function DashboardNavigation() {
    const pathname = usePathname();

    function isActiveRoute(href: string) {
        if (href === "/dashboard") {
        return pathname === href;
        }

        return pathname === href || pathname.startsWith(`${href}/`);
    }

    return (
        <div className="sticky top-0 z-50 border-b border-[#e7e2ef]/80 bg-[#f7f6fb]/90 px-5 py-3 backdrop-blur-xl sm:px-8 lg:px-10">
        <nav className="mx-auto flex max-w-7xl items-center gap-4 rounded-2xl border border-white bg-white/90 px-3 py-3 shadow-[0_10px_30px_rgba(65,44,140,0.08)]">
            <Link
            href="/dashboard"
            className="flex shrink-0 items-center gap-2.5 rounded-xl px-2 py-1"
            >
            <div className="grid size-9 place-items-center rounded-xl bg-[#15152c]">
                <span className="font-display text-lg font-bold text-[#b8f5cf]">
                <div className="grid size-10 place-items-center rounded-xl bg-[#15152c] p-1">
            <ServiceFlowLogo className="h-8 w-auto" priority />
            </div>
                </span>
            </div>

            <div className="hidden sm:block">
                <p className="font-display text-sm font-bold tracking-[-0.05em] text-[#15152c]">
                ServiceFlow
                </p>
                <p className="text-[10px] font-medium text-[#8b8698]">
                Business workspace
                </p>
            </div>
            </Link>

            <div className="no-scrollbar flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
            {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActiveRoute(item.href);

                return (
                <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold transition ${
                    active
                        ? "bg-[#eeeaff] text-[#684de7]"
                        : "text-[#777385] hover:bg-[#f6f4fb] hover:text-[#4e4960]"
                    }`}
                >
                    <Icon className="size-4" />
                    {item.label}
                </Link>
                );
            })}
            </div>

            <Link
            href="/appointments/new"
            className="hidden shrink-0 items-center gap-2 rounded-xl bg-[#15152c] px-3.5 py-2.5 text-xs font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#2a2948] md:inline-flex"
            >
            <CalendarDays className="size-3.5" />
            New booking
            </Link>
        </nav>
        </div>
    );
}