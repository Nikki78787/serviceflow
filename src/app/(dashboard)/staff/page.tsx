import Link from "next/link";
import { redirect } from "next/navigation";
import {
    ArrowLeft,
    ArrowRight,
    BriefcaseBusiness,
    CalendarClock,
    Plus,
    Sparkles,
    UserPlus,
    UsersRound,
    } from "lucide-react";

    import { auth } from "@/auth";
    import prisma from "@/lib/prisma";

    function getInitials(name: string) {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("");
    }

    export default async function StaffPage() {
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

    const ownerMembership = user.memberships[0];

    if (!ownerMembership) {
        redirect("/onboarding");
    }

    const business = ownerMembership.business;

    const ownerMembers = await prisma.businessMember.findMany({
        where: {
        businessId: business.id,
        role: "OWNER",
        status: "ACTIVE",
        },
        orderBy: {
        createdAt: "asc",
        },
        include: {
        user: {
            select: {
            id: true,
            name: true,
            email: true,
            },
        },
        _count: {
            select: {
            appointments: true,
            },
        },
        },
    });

    const staffProfiles = await prisma.staff.findMany({
        where: {
        businessId: business.id,
        },
        orderBy: {
        createdAt: "asc",
        },
        include: {
        _count: {
            select: {
            appointments: true,
            },
        },
        },
    });

    const activeStaffCount = staffProfiles.filter(
        (staff) => staff.isActive
    ).length;

    const teamMemberCount = ownerMembers.length + staffProfiles.length;

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
                    Staff members
                </p>

                <p className="text-xs font-medium text-[#878394]">
                    {business.name}
                </p>
                </div>
            </div>

            <Link
                href="/staff/new"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#15152c] px-4 py-3 text-sm font-bold text-white shadow-[0_10px_22px_rgba(21,21,44,0.16)] transition hover:-translate-y-0.5 hover:bg-[#2a2948]"
            >
                <Plus className="size-4" />
                Add staff member
            </Link>
            </header>

            <section className="relative mt-8 overflow-hidden rounded-[2rem] bg-[#15152c] px-7 py-10 text-white shadow-[0_22px_55px_rgba(21,21,44,0.18)] sm:px-10">
            <div className="absolute -right-20 -top-20 size-64 rounded-full bg-[#7558f7]/60 blur-3xl" />
            <div className="absolute -bottom-24 right-40 size-72 rounded-full bg-[#b8f5cf]/20 blur-3xl" />

            <div className="relative z-10 max-w-3xl">
                <p className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#b8f5cf]">
                <Sparkles className="size-3.5" />
                Team management
                </p>

                <h1 className="font-display mt-4 text-4xl font-bold tracking-[-0.065em] sm:text-5xl">
                Give every team member a place in the flow.
                </h1>

                <p className="mt-5 max-w-2xl text-lg leading-8 text-white/65">
                Create staff profiles, set their working hours, and assign
                customer bookings to the right person.
                </p>

                <Link
                href="/staff/new"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#b8f5cf] px-5 py-3.5 text-sm font-bold text-[#173b2a] transition hover:-translate-y-0.5 hover:bg-[#d0f9dd]"
                >
                Add staff member
                <ArrowRight className="size-4" />
                </Link>
            </div>
            </section>

            <section className="mt-8 grid gap-4 sm:grid-cols-3">
            <article className="rounded-[1.5rem] border border-[#e8e4ef] bg-white p-5 shadow-[0_10px_30px_rgba(65,44,140,0.05)]">
                <div className="grid size-11 place-items-center rounded-2xl bg-[#eeeaff]">
                <UsersRound className="size-5 text-[#7558f7]" />
                </div>

                <p className="mt-5 text-sm font-semibold text-[#767183]">
                Team members
                </p>

                <p className="font-display mt-1 text-3xl font-bold tracking-[-0.06em] text-[#1d1b31]">
                {teamMemberCount}
                </p>
            </article>

            <article className="rounded-[1.5rem] border border-[#e8e4ef] bg-white p-5 shadow-[0_10px_30px_rgba(65,44,140,0.05)]">
                <div className="grid size-11 place-items-center rounded-2xl bg-[#e4f9ec]">
                <UserPlus className="size-5 text-[#277246]" />
                </div>

                <p className="mt-5 text-sm font-semibold text-[#767183]">
                Active staff
                </p>

                <p className="font-display mt-1 text-3xl font-bold tracking-[-0.06em] text-[#1d1b31]">
                {activeStaffCount}
                </p>
            </article>

            <article className="rounded-[1.5rem] border border-[#e8e4ef] bg-white p-5 shadow-[0_10px_30px_rgba(65,44,140,0.05)]">
                <div className="grid size-11 place-items-center rounded-2xl bg-[#fff0ed]">
                <CalendarClock className="size-5 text-[#d9654d]" />
                </div>

                <p className="mt-5 text-sm font-semibold text-[#767183]">
                Availability setup
                </p>

                <p className="font-display mt-1 text-3xl font-bold tracking-[-0.06em] text-[#1d1b31]">
                0
                </p>
            </article>
            </section>

            <section className="mt-8">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#7558f7]">
                    Your team
                </p>

                <h2 className="font-display mt-2 text-3xl font-bold tracking-[-0.06em] text-[#201d35]">
                    Who is part of {business.name}?
                </h2>
                </div>

                <p className="text-sm font-medium text-[#858092]">
                {teamMemberCount === 1
                    ? "1 member added"
                    : `${teamMemberCount} members added`}
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {ownerMembers.map((member, index) => {
                const displayName =
                    member.user.name ?? member.user.email.split("@")[0];

                const accentClasses = [
                    "bg-[#eeeaff] text-[#7558f7]",
                    "bg-[#e4f9ec] text-[#277246]",
                    "bg-[#fff0ed] text-[#d9654d]",
                    "bg-[#e8f2ff] text-[#2d70d4]",
                ];

                return (
                    <article
                    key={member.id}
                    className="rounded-[1.6rem] border border-[#e8e4ef] bg-white p-5 shadow-[0_10px_30px_rgba(65,44,140,0.05)]"
                    >
                    <div className="flex items-start justify-between gap-4">
                        <div
                        className={`grid size-12 place-items-center rounded-2xl text-sm font-extrabold ${
                            accentClasses[index % accentClasses.length]
                        }`}
                        >
                        {getInitials(displayName)}
                        </div>

                        <span className="rounded-full bg-[#eeeaff] px-3 py-1 text-xs font-bold text-[#7558f7]">
                        Owner
                        </span>
                    </div>

                    <h3 className="font-display mt-6 text-2xl font-bold tracking-[-0.05em] text-[#26223b]">
                        {displayName}
                    </h3>

                    <p className="mt-2 truncate text-sm text-[#777385]">
                        {member.user.email}
                    </p>

                    <div className="mt-5 grid grid-cols-2 gap-3 border-t border-[#eeeaf4] pt-4">
                        <div>
                        <p className="text-xs font-semibold text-[#9a95a5]">
                            Bookings
                        </p>

                        <p className="font-display mt-1 text-lg font-bold text-[#28243d]">
                            {member._count.appointments}
                        </p>
                        </div>

                        <div>
                        <p className="text-xs font-semibold text-[#9a95a5]">
                            Availability
                        </p>

                        <p className="font-display mt-1 text-lg font-bold text-[#28243d]">
                            Not set
                        </p>
                        </div>
                    </div>

                    <div className="mt-5 flex items-center gap-2 text-sm font-bold text-[#7558f7]">
                        <BriefcaseBusiness className="size-4" />
                        Business owner
                    </div>
                    </article>
                );
                })}

                {staffProfiles.map((staff, index) => {
                const accentClasses = [
                    "bg-[#e4f9ec] text-[#277246]",
                    "bg-[#fff0ed] text-[#d9654d]",
                    "bg-[#e8f2ff] text-[#2d70d4]",
                    "bg-[#eeeaff] text-[#7558f7]",
                ];

                return (
                    <article
                    key={staff.id}
                    className="rounded-[1.6rem] border border-[#e8e4ef] bg-white p-5 shadow-[0_10px_30px_rgba(65,44,140,0.05)]"
                    >
                    <div className="flex items-start justify-between gap-4">
                        <div
                        className={`grid size-12 place-items-center rounded-2xl text-sm font-extrabold ${
                            accentClasses[index % accentClasses.length]
                        }`}
                        >
                        {getInitials(staff.fullName)}
                        </div>

                        <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                            staff.isActive
                            ? "bg-[#e4f9ec] text-[#277246]"
                            : "bg-[#fff0ed] text-[#d9654d]"
                        }`}
                        >
                        {staff.isActive ? "Active" : "Inactive"}
                        </span>
                    </div>

                    <h3 className="font-display mt-6 text-2xl font-bold tracking-[-0.05em] text-[#26223b]">
                        {staff.fullName}
                    </h3>

                    <p className="mt-2 text-sm font-bold text-[#7558f7]">
                        {staff.position || "Staff member"}
                    </p>

                    <p className="mt-3 truncate text-sm text-[#777385]">
                        {staff.email || "No email added"}
                    </p>

                    <p className="mt-1 text-sm text-[#777385]">
                        {staff.phone || "No phone added"}
                    </p>

                    <div className="mt-5 grid grid-cols-2 gap-3 border-t border-[#eeeaf4] pt-4">
                        <div>
                        <p className="text-xs font-semibold text-[#9a95a5]">
                            Bookings
                        </p>

                        <p className="font-display mt-1 text-lg font-bold text-[#28243d]">
                            {staff._count.appointments}
                        </p>
                        </div>

                        <div>
                        <p className="text-xs font-semibold text-[#9a95a5]">
                            Availability
                        </p>

                        <p className="font-display mt-1 text-lg font-bold text-[#28243d]">
                            Not set
                        </p>
                        </div>
                    </div>

                    <Link
                        href={`/staff/${staff.id}/availability`}
                        className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#7558f7] transition hover:text-[#5136d4]"
                        >
                        Manage availability
                        <ArrowRight className="size-4" />
                    </Link>
                    </article>
                );
                })}
            </div>
            </section>
        </div>
        </main>
    );
}