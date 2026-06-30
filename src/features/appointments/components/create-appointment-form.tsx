"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    ArrowRight,
    CalendarClock,
    Check,
    Clock3,
    MessageSquareText,
    Sparkles,
    UserRound,
    UsersRound,
    } from "lucide-react";

    type ServiceOption = {
    id: string;
    name: string;
    durationMinutes: number;
    price: number;
    };

    type CustomerOption = {
    id: string;
    fullName: string;
    email: string | null;
    phone: string | null;
    };

    type StaffOption = {
    id: string;
    fullName: string;
    position: string | null;
    };

    type CreateAppointmentFormProps = {
    businessName: string;
    services: ServiceOption[];
    customers: CustomerOption[];
    staffProfiles: StaffOption[];
    };

    type MessageState = {
    type: "error" | "";
    text: string;
    };

    function getLocalDateTimeMinimum() {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

    return now.toISOString().slice(0, 16);
    }

    export default function CreateAppointmentForm({
    businessName,
    services,
    customers,
    staffProfiles,
    }: CreateAppointmentFormProps) {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<MessageState>({
        type: "",
        text: "",
    });

    const hasServices = services.length > 0;
    const hasCustomers = customers.length > 0;
    const hasStaffProfiles = staffProfiles.length > 0;

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setIsLoading(true);
        setMessage({
        type: "",
        text: "",
        });

        const formData = new FormData(event.currentTarget);
        const rawStartTime = String(formData.get("startTime") ?? "");
        const parsedStartTime = rawStartTime ? new Date(rawStartTime) : null;

        const payload = {
        customerId: String(formData.get("customerId") ?? ""),
        serviceId: String(formData.get("serviceId") ?? ""),
        staffProfileId: String(formData.get("staffProfileId") ?? ""),
        startTime:
            parsedStartTime && !Number.isNaN(parsedStartTime.getTime())
            ? parsedStartTime.toISOString()
            : "",
        customerNotes: String(formData.get("customerNotes") ?? "").trim(),
        };

        try {
        const response = await fetch("/api/appointments", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
            setMessage({
            type: "error",
            text: data.message ?? "Unable to create this booking.",
            });

            return;
        }

        router.push("/appointments");
        router.refresh();
        } catch {
        setMessage({
            type: "error",
            text: "A network error occurred. Please try again.",
        });
        } finally {
        setIsLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-[#f7f6fb] px-5 py-5 sm:px-8 lg:px-12">
        <div className="mx-auto grid min-h-[calc(100vh-2.5rem)] max-w-7xl overflow-hidden rounded-[2rem] border border-white bg-white shadow-[0_28px_90px_rgba(63,43,136,0.14)] lg:grid-cols-[0.82fr_1.18fr]">
            <aside className="relative hidden overflow-hidden bg-[#15152c] p-12 text-white lg:block">
            <div className="absolute -left-20 top-8 size-80 rounded-full bg-[#7558f7]/60 blur-3xl" />
            <div className="absolute -bottom-20 right-0 size-80 rounded-full bg-[#b8f5cf]/30 blur-3xl" />

            <div className="relative z-10 flex h-full flex-col">
                <Link href="/appointments" className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-2xl bg-[#b8f5cf]">
                    <span className="font-display text-xl font-bold text-[#15152c]">
                    S
                    </span>
                </div>

                <div>
                    <p className="font-display text-lg font-bold tracking-[-0.06em]">
                    ServiceFlow
                    </p>

                    <p className="-mt-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
                    New booking
                    </p>
                </div>
                </Link>

                <div className="my-auto">
                <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#b8f5cf]">
                    <Sparkles className="size-3.5" />
                    Appointment planner
                </div>

                <h1 className="font-display text-5xl font-bold leading-[0.98] tracking-[-0.07em]">
                    Make every booking feel simple.
                </h1>

                <p className="mt-6 max-w-md text-lg leading-8 text-white/60">
                    Select the customer, service, staff member, and appointment
                    time in one clear flow.
                </p>

                <div className="mt-10 space-y-4">
                    <div className="flex items-center gap-3">
                    <span className="grid size-7 place-items-center rounded-full bg-[#b8f5cf]">
                        <Check className="size-4 text-[#17462f]" />
                    </span>

                    <span className="text-sm font-semibold text-white/80">
                        Service price is added automatically
                    </span>
                    </div>

                    <div className="flex items-center gap-3">
                    <span className="grid size-7 place-items-center rounded-full bg-[#b8f5cf]">
                        <Check className="size-4 text-[#17462f]" />
                    </span>

                    <span className="text-sm font-semibold text-white/80">
                        Booking is assigned to the chosen staff member
                    </span>
                    </div>

                    <div className="flex items-center gap-3">
                    <span className="grid size-7 place-items-center rounded-full bg-[#b8f5cf]">
                        <Check className="size-4 text-[#17462f]" />
                    </span>

                    <span className="text-sm font-semibold text-white/80">
                        Overlapping bookings are prevented
                    </span>
                    </div>
                </div>
                </div>

                <p className="text-sm text-white/45">{businessName}</p>
            </div>
            </aside>

            <section className="flex items-center justify-center p-6 sm:p-10 lg:p-14">
            <div className="w-full max-w-xl">
                <Link
                href="/appointments"
                className="mb-10 inline-flex items-center gap-2 text-sm font-bold text-[#6c6780] transition hover:text-[#7558f7]"
                >
                <ArrowLeft className="size-4" />
                Back to appointments
                </Link>

                {!hasServices || !hasCustomers || !hasStaffProfiles ? (
                <div>
                    <div className="mb-5 grid size-12 place-items-center rounded-2xl bg-[#fff0ed]">
                    <CalendarClock className="size-5 text-[#d9654d]" />
                    </div>

                    <p className="text-xs font-extrabold uppercase tracking-[0.17em] text-[#d9654d]">
                    A little setup needed
                    </p>

                    <h2 className="font-display mt-3 text-4xl font-bold tracking-[-0.065em] text-[#15152c]">
                    You need a service, customer, and staff member first.
                    </h2>

                    <p className="mt-4 leading-7 text-[#747184]">
                    A booking connects a customer, service, and staff member
                    before it can be scheduled.
                    </p>

                    <div className="mt-7 flex flex-wrap gap-3">
                    {!hasServices ? (
                        <Link
                        href="/services/new"
                        className="inline-flex items-center gap-2 rounded-xl bg-[#7558f7] px-4 py-3 text-sm font-bold text-white"
                        >
                        Add a service
                        <ArrowRight className="size-4" />
                        </Link>
                    ) : null}

                    {!hasCustomers ? (
                        <Link
                        href="/customers/new"
                        className="inline-flex items-center gap-2 rounded-xl bg-[#15152c] px-4 py-3 text-sm font-bold text-white"
                        >
                        Add a customer
                        <ArrowRight className="size-4" />
                        </Link>
                    ) : null}

                    {!hasStaffProfiles ? (
                        <Link
                        href="/staff/new"
                        className="inline-flex items-center gap-2 rounded-xl bg-[#e4f9ec] px-4 py-3 text-sm font-bold text-[#277246]"
                        >
                        Add a staff member
                        <ArrowRight className="size-4" />
                        </Link>
                    ) : null}
                    </div>
                </div>
                ) : (
                <>
                    <div className="mb-8">
                    <div className="mb-5 grid size-12 place-items-center rounded-2xl bg-[#eeeaff]">
                        <CalendarClock className="size-5 text-[#7558f7]" />
                    </div>

                    <p className="text-xs font-extrabold uppercase tracking-[0.17em] text-[#7558f7]">
                        New appointment
                    </p>

                    <h2 className="font-display mt-3 text-4xl font-bold tracking-[-0.065em] text-[#15152c]">
                        Create a booking.
                    </h2>

                    <p className="mt-3 leading-7 text-[#747184]">
                        Assign the booking to a staff member, then confirm or
                        complete it from the appointments page later.
                    </p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label
                        htmlFor="customerId"
                        className="mb-2 block text-sm font-bold text-[#363449]"
                        >
                        Customer
                        </label>

                        <div className="relative">
                        <UserRound className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#aaa6b7]" />

                        <select
                            id="customerId"
                            name="customerId"
                            required
                            defaultValue=""
                            className="w-full appearance-none rounded-xl border border-[#e2deeb] bg-[#fcfbfe] py-3.5 pl-11 pr-4 text-sm text-[#26243a] outline-none transition focus:border-[#7558f7] focus:ring-4 focus:ring-[#7558f7]/10"
                        >
                            <option value="" disabled>
                            Choose a customer
                            </option>

                            {customers.map((customer) => (
                            <option key={customer.id} value={customer.id}>
                                {customer.fullName}
                                {customer.phone ? ` · ${customer.phone}` : ""}
                            </option>
                            ))}
                        </select>
                        </div>
                    </div>

                    <div>
                        <label
                        htmlFor="serviceId"
                        className="mb-2 block text-sm font-bold text-[#363449]"
                        >
                        Service
                        </label>

                        <div className="relative">
                        <Clock3 className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#aaa6b7]" />

                        <select
                            id="serviceId"
                            name="serviceId"
                            required
                            defaultValue=""
                            className="w-full appearance-none rounded-xl border border-[#e2deeb] bg-[#fcfbfe] py-3.5 pl-11 pr-4 text-sm text-[#26243a] outline-none transition focus:border-[#7558f7] focus:ring-4 focus:ring-[#7558f7]/10"
                        >
                            <option value="" disabled>
                            Choose a service
                            </option>

                            {services.map((service) => (
                            <option key={service.id} value={service.id}>
                                {service.name} · {service.durationMinutes} min · RM{" "}
                                {service.price.toFixed(2)}
                            </option>
                            ))}
                        </select>
                        </div>
                    </div>

                    <div>
                        <label
                        htmlFor="staffProfileId"
                        className="mb-2 block text-sm font-bold text-[#363449]"
                        >
                        Assigned staff member
                        </label>

                        <div className="relative">
                        <UsersRound className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#aaa6b7]" />

                        <select
                            id="staffProfileId"
                            name="staffProfileId"
                            required
                            defaultValue=""
                            className="w-full appearance-none rounded-xl border border-[#e2deeb] bg-[#fcfbfe] py-3.5 pl-11 pr-4 text-sm text-[#26243a] outline-none transition focus:border-[#7558f7] focus:ring-4 focus:ring-[#7558f7]/10"
                        >
                            <option value="" disabled>
                            Choose a staff member
                            </option>

                            {staffProfiles.map((staff) => (
                            <option key={staff.id} value={staff.id}>
                                {staff.fullName}
                                {staff.position ? ` · ${staff.position}` : ""}
                            </option>
                            ))}
                        </select>
                        </div>

                        <p className="mt-2 text-xs leading-5 text-[#898494]">
                        Only active staff profiles can receive new bookings.
                        </p>
                    </div>

                    <div>
                        <label
                        htmlFor="startTime"
                        className="mb-2 block text-sm font-bold text-[#363449]"
                        >
                        Appointment date and time
                        </label>

                        <input
                        id="startTime"
                        name="startTime"
                        type="datetime-local"
                        required
                        min={getLocalDateTimeMinimum()}
                        className="w-full rounded-xl border border-[#e2deeb] bg-[#fcfbfe] px-4 py-3.5 text-sm text-[#26243a] outline-none transition focus:border-[#7558f7] focus:ring-4 focus:ring-[#7558f7]/10"
                        />

                        <p className="mt-2 text-xs leading-5 text-[#898494]">
                        The end time will be calculated from the selected service
                        duration.
                        </p>
                    </div>

                    <div>
                        <label
                        htmlFor="customerNotes"
                        className="mb-2 block text-sm font-bold text-[#363449]"
                        >
                        Booking notes{" "}
                        <span className="text-[#aaa6b7]">(optional)</span>
                        </label>

                        <div className="relative">
                        <MessageSquareText className="pointer-events-none absolute left-4 top-4 size-4 text-[#aaa6b7]" />

                        <textarea
                            id="customerNotes"
                            name="customerNotes"
                            rows={4}
                            maxLength={1000}
                            placeholder="For example, customer requested a reminder before the appointment."
                            className="w-full resize-none rounded-xl border border-[#e2deeb] bg-[#fcfbfe] py-3.5 pl-11 pr-4 text-sm text-[#26243a] outline-none transition placeholder:text-[#aaa6b7] focus:border-[#7558f7] focus:ring-4 focus:ring-[#7558f7]/10"
                        />
                        </div>
                    </div>

                    {message.text ? (
                        <div className="rounded-xl border border-[#ffc2b8] bg-[#fff3f0] px-4 py-3 text-sm font-medium text-[#b94d3c]">
                        {message.text}
                        </div>
                    ) : null}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#7558f7] px-4 py-3.5 text-sm font-bold text-white shadow-[0_14px_25px_rgba(117,88,247,0.24)] transition hover:-translate-y-0.5 hover:bg-[#6248e7] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isLoading ? "Creating booking..." : "Create booking"}
                        {!isLoading && <ArrowRight className="size-4" />}
                    </button>
                    </form>
                </>
                )}
            </div>
            </section>
        </div>
        </main>
    );
}