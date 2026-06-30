import type { ReactNode } from "react";

import DashboardNavigation from "@/components/layout/dashboard-navigation";

export default function DashboardLayout({
    children,
    }: {
    children: ReactNode;
    }) {
    return (
        <div className="min-h-screen bg-[#f7f6fb]">
        <DashboardNavigation />
        {children}
        </div>
    );
}