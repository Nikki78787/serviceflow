import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
    ArrowLeft,
    CalendarClock,
    Mail,
    Sparkles,
    } from "lucide-react";

    import { auth } from "@/auth";
    import StaffAvailabilityForm from "@/features/staff/components/staff-availability-form";
    import prisma from "@/lib/prisma";

    function getInitials(name: string) {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("");
    }

    export default async function StaffAvailabilityPage({
    params,
    }: {
    params: Promise<{ staffId: string }>;
    }) {
    const session = await auth();

    if (!session?.user?.email) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: {
        email: session.user.email.toLowerCase(),
        },
        select: {
        id: true,
        },
    });

    if (!user) {
        redirect("/login");
    }

    const ownerMembership = await prisma.businessMember.findFirst({
        where: {
        userId: user.id,
        role: "OWNER",
        status: "ACTIVE",
        },
        orderBy: {
        createdAt: "asc",
        },
        select: {
        businessId: true,
        },
    });

    if (!ownerMembership) {
        redirect("/onboarding");
    }

    const { staffId } = await params;

    const staff = await prisma.staff.findFirst({
        where: {
        id: staffId,
        businessId: ownerMembership.businessId,
        },
        select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        position: true,
        isActive: true,
        availability: {
            orderBy: {
            dayOfWeek: "asc",
            },
            select: {
            dayOfWeek: true,
            isAvailable: true,
            startTime: true,
            endTime: true,
            },
        },
        },
    });

    if (!staff) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-[#f7f6fb] p-5 sm:p-8 lg:p-10">
        <div className="mx-auto max-w-4xl">
            <Link
            href="/staff"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#7558f7] transition hover:text-[#5136d4]"
            >
            <ArrowLeft className="size-4" />
            Back to staff
            </Link>

            <section className="relative mt-6 overflow-hidden rounded-[2rem] bg-[#15152c] px-7 py-9 text-white shadow-[0_22px_55px_rgba(21,21,44,0.18)] sm:px-10">
            <div className="absolute -right-16 -top-20 size-60 rounded-full bg-[#7558f7]/60 blur-3xl" />
            <div className="absolute -bottom-20 right-32 size-56 rounded-full bg-[#b8f5cf]/20 blur-3xl" />

            <div className="relative z-10">
                <p className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#b8f5cf]">
                <Sparkles className="size-3.5" />
                Staff schedule
                </p>

                <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="grid size-16 place-items-center rounded-3xl bg-[#b8f5cf] text-lg font-extrabold text-[#173b2a]">
                    {getInitials(staff.fullName)}
                </div>

                <div>
                    <h1 className="font-display text-4xl font-bold tracking-[-0.06em]">
                    {staff.fullName}
                    </h1>

                    <p className="mt-2 text-sm font-bold text-[#b8f5cf]">
                    {staff.position || "Staff member"}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-white/65">
                    {staff.email ? (
                        <span className="inline-flex items-center gap-1.5">
                        <Mail className="size-3.5" />
                        {staff.email}
                        </span>
                    ) : null}

                    <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                        staff.isActive
                            ? "bg-[#e4f9ec] text-[#277246]"
                            : "bg-[#fff0ed] text-[#d9654d]"
                        }`}
                    >
                        {staff.isActive ? "Active staff" : "Inactive staff"}
                    </span>
                    </div>
                </div>
                </div>
            </div>
            </section>

            <section className="mt-8">
            <div className="mb-5 flex items-center gap-3">
                <div className="grid size-11 place-items-center rounded-2xl bg-[#eeeaff]">
                <CalendarClock className="size-5 text-[#7558f7]" />
                </div>

                <div>
                <h2 className="font-display text-2xl font-bold tracking-[-0.05em] text-[#201d35]">
                    Set weekly availability
                </h2>

                <p className="mt-1 text-sm text-[#777385]">
                    Choose the days and hours this person can receive bookings.
                </p>
                </div>
            </div>

            <StaffAvailabilityForm
                staffId={staff.id}
                staffName={staff.fullName}
                initialAvailability={staff.availability}
            />
            </section>
        </div>
        </main>
    );
}