import Link from "next/link";
import { ArrowLeft, UserPlus } from "lucide-react";

import CreateStaffForm from "@/features/staff/components/staff-availability-form";

export default function AddStaffMemberPage() {
    return (
        <main className="min-h-screen bg-[#f7f6fb] p-5 sm:p-8 lg:p-10">
        <div className="mx-auto max-w-2xl">
            <Link
            href="/staff"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#7558f7] transition hover:text-[#5136d4]"
            >
            <ArrowLeft className="size-4" />
            Back to staff
            </Link>

            <section className="mt-6 overflow-hidden rounded-[2rem] border border-white bg-white shadow-[0_18px_50px_rgba(65,44,140,0.08)]">
            <div className="bg-[#15152c] px-7 py-8 text-white sm:px-10">
                <div className="grid size-12 place-items-center rounded-2xl bg-[#b8f5cf] text-[#173b2a]">
                <UserPlus className="size-6" />
                </div>

                <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.18em] text-[#b8f5cf]">
                Team management
                </p>

                <h1 className="font-display mt-3 text-4xl font-bold tracking-[-0.06em]">
                Add a staff member
                </h1>

                <p className="mt-4 max-w-lg text-sm leading-6 text-white/65">
                Create a staff profile for someone working in your business.
                </p>
            </div>

            <CreateStaffForm />
            </section>
        </div>
        </main>
    );
}