"use client";

import Link from "next/link";
import { type FormEvent, useMemo, useState } from "react";
import {
    ArrowLeft,
    CalendarCheck2,
    CheckCircle2,
    Clock3,
    Mail,
    MapPin,
    MessageSquareText,
    Phone,
    UserRound,
    } from "lucide-react";

    type ServiceOption = {
    id: string;
    name: string;
    description: string | null;
    durationMinutes: number;
    price: number;
    };

    type PublicBookingFormProps = {
    business: {
        name: string;
        slug: string;
        currency: string;
        timezone: string;
        address: string | null;
        phone: string | null;
    };
    services: ServiceOption[];
    initialServiceId: string;
    };

    type ConfirmationState = {
    customerName: string;
    serviceName: string;
    startTime: string;
    endTime: string;
    } | null;

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

    function getLocalDateTimeMinimum() {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

    return now.toISOString().slice(0, 16);
    }

    export default function PublicBookingForm({
    business,
    services,
    initialServiceId,
    }: PublicBookingFormProps) {
    const validInitialServiceId = services.some(
        (service) => service.id === initialServiceId
    )
        ? initialServiceId
        : "";

    const [selectedServiceId, setSelectedServiceId] = useState(
        validInitialServiceId
    );
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [confirmation, setConfirmation] = useState<ConfirmationState>(null);

    const selectedService = useMemo(
        () => services.find((service) => service.id === selectedServiceId),
        [selectedServiceId, services]
    );

    const money = new Intl.NumberFormat("en-MY", {
        style: "currency",
        currency: business.currency,
        maximumFractionDigits: 2,
    });

    const dateFormatter = new Intl.DateTimeFormat("en-MY", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: business.timezone,
    });

    const timeFormatter = new Intl.DateTimeFormat("en-MY", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: business.timezone,
    });

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setErrorMessage("");

        const formData = new FormData(event.currentTarget);
        const rawStartTime = String(formData.get("startTime") ?? "");

        const parsedStartTime = rawStartTime ? new Date(rawStartTime) : null;

        if (!parsedStartTime || Number.isNaN(parsedStartTime.getTime())) {
        setErrorMessage("Please choose a valid appointment date and time.");
        return;
        }

        setIsLoading(true);

        try {
        const response = await fetch("/api/public/bookings", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            businessSlug: business.slug,
            serviceId: selectedServiceId,
            fullName: String(formData.get("fullName") ?? "").trim(),
            email: String(formData.get("email") ?? "").trim(),
            phone: String(formData.get("phone") ?? "").trim(),
            startTime: parsedStartTime.toISOString(),
            customerNotes: String(formData.get("customerNotes") ?? "").trim(),
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            setErrorMessage(
            data.message ?? "Unable to create your booking right now."
            );
            return;
        }

        setConfirmation({
            customerName: data.appointment.customerName,
            serviceName: data.appointment.serviceName,
            startTime: data.appointment.startTime,
            endTime: data.appointment.endTime,
        });
        } catch {
        setErrorMessage("A network error occurred. Please try again.");
        } finally {
        setIsLoading(false);
        }
    }

    if (confirmation) {
        const startTime = new Date(confirmation.startTime);
        const endTime = new Date(confirmation.endTime);

        return (
        <main className="min-h-screen bg-[#f7f6fb] px-5 py-5 sm:px-8 lg:px-12">
            <div className="mx-auto max-w-2xl overflow-hidden rounded-[2rem] border border-white bg-white shadow-[0_28px_90px_rgba(63,43,136,0.14)]">
            <section className="bg-[#15152c] px-7 py-10 text-center text-white sm:px-10">
                <div className="mx-auto grid size-16 place-items-center rounded-3xl bg-[#b8f5cf]">
                <CheckCircle2 className="size-8 text-[#17462f]" />
                </div>

                <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.18em] text-[#b8f5cf]">
                Booking request received
                </p>

                <h1 className="font-display mt-3 text-4xl font-bold tracking-[-0.065em]">
                You are booked in.
                </h1>

                <p className="mt-4 text-white/65">
                Thanks, {confirmation.customerName}. {business.name} will review
                your booking request shortly.
                </p>
            </section>

            <section className="p-7 sm:p-10">
                <div className="rounded-[1.4rem] bg-[#f7f6fb] p-5">
                <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-[#7558f7]">
                    Appointment details
                </p>

                <h2 className="font-display mt-3 text-2xl font-bold tracking-[-0.05em] text-[#27233e]">
                    {confirmation.serviceName}
                </h2>

                <div className="mt-5 space-y-3 text-sm text-[#676275]">
                    <p className="flex items-center gap-3">
                    <CalendarCheck2 className="size-4 text-[#7558f7]" />
                    {dateFormatter.format(startTime)}
                    </p>

                    <p className="flex items-center gap-3">
                    <Clock3 className="size-4 text-[#7558f7]" />
                    {timeFormatter.format(startTime)} –{" "}
                    {timeFormatter.format(endTime)}
                    </p>

                    {business.address ? (
                    <p className="flex items-center gap-3">
                        <MapPin className="size-4 text-[#7558f7]" />
                        {business.address}
                    </p>
                    ) : null}
                </div>
                </div>

                <Link
                href={`/book/${business.slug}`}
                className="mt-7 inline-flex w-full items-center justify-center rounded-xl bg-[#15152c] px-4 py-3.5 text-sm font-bold text-white transition hover:bg-[#2a2948]"
                >
                Back to {business.name}
                </Link>
            </section>
            </div>
        </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#f7f6fb] px-5 py-5 sm:px-8 lg:px-12">
        <div className="mx-auto grid min-h-[calc(100vh-2.5rem)] max-w-6xl overflow-hidden rounded-[2rem] border border-white bg-white shadow-[0_28px_90px_rgba(63,43,136,0.14)] lg:grid-cols-[0.82fr_1.18fr]">
            <aside className="relative hidden overflow-hidden bg-[#15152c] p-12 text-white lg:block">
            <div className="absolute -left-20 top-8 size-80 rounded-full bg-[#7558f7]/60 blur-3xl" />
            <div className="absolute -bottom-20 right-0 size-80 rounded-full bg-[#b8f5cf]/30 blur-3xl" />

            <div className="relative z-10 flex h-full flex-col">
                <Link href={`/book/${business.slug}`} className="flex items-center gap-3">
                <div className="grid size-11 place-items-center rounded-2xl bg-[#b8f5cf]">
                    <span className="font-display text-xl font-bold text-[#15152c]">
                    {business.name.charAt(0).toUpperCase()}
                    </span>
                </div>

                <div>
                    <p className="font-display text-lg font-bold tracking-[-0.06em]">
                    {business.name}
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
                    Online booking
                    </p>
                </div>
                </Link>

                <div className="my-auto">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#b8f5cf]">
                    Book your appointment
                </p>

                <h1 className="font-display mt-4 text-5xl font-bold leading-[0.98] tracking-[-0.07em]">
                    A few details, then you are all set.
                </h1>

                <p className="mt-6 max-w-md text-lg leading-8 text-white/60">
                    Choose your service and preferred time. Your request will be
                    sent directly to {business.name}.
                </p>
                </div>

                {business.phone ? (
                <p className="flex items-center gap-2 text-sm text-white/55">
                    <Phone className="size-4 text-[#b8f5cf]" />
                    Need help? {business.phone}
                </p>
                ) : null}
            </div>
            </aside>

            <section className="flex items-center justify-center p-6 sm:p-10 lg:p-14">
            <div className="w-full max-w-xl">
                <Link
                href={`/book/${business.slug}`}
                className="mb-10 inline-flex items-center gap-2 text-sm font-bold text-[#6c6780] transition hover:text-[#7558f7]"
                >
                <ArrowLeft className="size-4" />
                Back to services
                </Link>

                <div className="mb-8">
                <p className="text-xs font-extrabold uppercase tracking-[0.17em] text-[#7558f7]">
                    Appointment request
                </p>

                <h2 className="font-display mt-3 text-4xl font-bold tracking-[-0.065em] text-[#15152c]">
                    Let&apos;s book your visit.
                </h2>

                <p className="mt-3 leading-7 text-[#747184]">
                    Fill in your details and {business.name} will receive your
                    booking request.
                </p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                    <label
                    htmlFor="serviceId"
                    className="mb-2 block text-sm font-bold text-[#363449]"
                    >
                    Service
                    </label>

                    <select
                    id="serviceId"
                    name="serviceId"
                    value={selectedServiceId}
                    onChange={(event) => setSelectedServiceId(event.target.value)}
                    required
                    className="w-full rounded-xl border border-[#e2deeb] bg-[#fcfbfe] px-4 py-3.5 text-sm text-[#26243a] outline-none transition focus:border-[#7558f7] focus:ring-4 focus:ring-[#7558f7]/10"
                    >
                    <option value="" disabled>
                        Choose a service
                    </option>

                    {services.map((service) => (
                        <option key={service.id} value={service.id}>
                        {service.name} · {formatDuration(service.durationMinutes)} ·{" "}
                        {money.format(service.price)}
                        </option>
                    ))}
                    </select>

                    {selectedService ? (
                    <div className="mt-3 rounded-xl bg-[#f4f2fb] px-4 py-3">
                        <p className="text-sm font-bold text-[#353149]">
                        {selectedService.name}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-[#787385]">
                        {selectedService.description ||
                            "A professional service tailored to your needs."}
                        </p>
                    </div>
                    ) : null}
                </div>

                <div>
                    <label
                    htmlFor="startTime"
                    className="mb-2 block text-sm font-bold text-[#363449]"
                    >
                    Preferred date and time
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
                    Availability will be confirmed by the business after your
                    request is submitted.
                    </p>
                </div>

                <div>
                    <label
                    htmlFor="fullName"
                    className="mb-2 block text-sm font-bold text-[#363449]"
                    >
                    Full name
                    </label>

                    <div className="relative">
                    <UserRound className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#aaa6b7]" />

                    <input
                        id="fullName"
                        name="fullName"
                        required
                        minLength={2}
                        maxLength={100}
                        placeholder="Your full name"
                        className="w-full rounded-xl border border-[#e2deeb] bg-[#fcfbfe] py-3.5 pl-11 pr-4 text-sm text-[#26243a] outline-none transition placeholder:text-[#aaa6b7] focus:border-[#7558f7] focus:ring-4 focus:ring-[#7558f7]/10"
                    />
                    </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                    <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-bold text-[#363449]"
                    >
                        Email <span className="text-[#aaa6b7]">(optional)</span>
                    </label>

                    <div className="relative">
                        <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#aaa6b7]" />

                        <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@email.com"
                        className="w-full rounded-xl border border-[#e2deeb] bg-[#fcfbfe] py-3.5 pl-11 pr-4 text-sm text-[#26243a] outline-none transition placeholder:text-[#aaa6b7] focus:border-[#7558f7] focus:ring-4 focus:ring-[#7558f7]/10"
                        />
                    </div>
                    </div>

                    <div>
                    <label
                        htmlFor="phone"
                        className="mb-2 block text-sm font-bold text-[#363449]"
                    >
                        Phone <span className="text-[#aaa6b7]">(optional)</span>
                    </label>

                    <div className="relative">
                        <Phone className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#aaa6b7]" />

                        <input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+60 12 345 6789"
                        className="w-full rounded-xl border border-[#e2deeb] bg-[#fcfbfe] py-3.5 pl-11 pr-4 text-sm text-[#26243a] outline-none transition placeholder:text-[#aaa6b7] focus:border-[#7558f7] focus:ring-4 focus:ring-[#7558f7]/10"
                        />
                    </div>
                    </div>
                </div>

                <div>
                    <label
                    htmlFor="customerNotes"
                    className="mb-2 block text-sm font-bold text-[#363449]"
                    >
                    Notes <span className="text-[#aaa6b7]">(optional)</span>
                    </label>

                    <div className="relative">
                    <MessageSquareText className="pointer-events-none absolute left-4 top-4 size-4 text-[#aaa6b7]" />

                    <textarea
                        id="customerNotes"
                        name="customerNotes"
                        rows={4}
                        maxLength={1000}
                        placeholder="Anything the business should know before your appointment?"
                        className="w-full resize-none rounded-xl border border-[#e2deeb] bg-[#fcfbfe] py-3.5 pl-11 pr-4 text-sm text-[#26243a] outline-none transition placeholder:text-[#aaa6b7] focus:border-[#7558f7] focus:ring-4 focus:ring-[#7558f7]/10"
                    />
                    </div>
                </div>

                {errorMessage ? (
                    <div className="rounded-xl border border-[#ffc2b8] bg-[#fff3f0] px-4 py-3 text-sm font-medium text-[#b94d3c]">
                    {errorMessage}
                    </div>
                ) : null}

                <button
                    type="submit"
                    disabled={isLoading || !selectedServiceId}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#7558f7] px-4 py-3.5 text-sm font-bold text-white shadow-[0_14px_25px_rgba(117,88,247,0.24)] transition hover:-translate-y-0.5 hover:bg-[#6248e7] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isLoading ? "Sending booking request..." : "Request appointment"}
                    {!isLoading && <CalendarCheck2 className="size-4" />}
                </button>
                </form>
            </div>
            </section>
        </div>
        </main>
    );
    }