import { notFound } from "next/navigation";
import {
    CalendarDays,
    Clock3,
    MapPin,
    Phone,
    Sparkles,
    } from "lucide-react";

    import prisma from "@/lib/prisma";

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

    export default async function PublicBookingPage({
    params,
    }: {
    params: Promise<{ slug: string }>;
    }) {
    const { slug } = await params;

    const business = await prisma.business.findUnique({
        where: {
        slug,
        },
        include: {
        services: {
            where: {
            isActive: true,
            },
            orderBy: {
            price: "asc",
            },
        },
        },
    });

    if (!business || !business.isActive || !business.bookingEnabled) {
        notFound();
    }

    const currencyFormatter = new Intl.NumberFormat("en-MY", {
        style: "currency",
        currency: business.currency,
        maximumFractionDigits: 2,
    });

    return (
        <main className="min-h-screen bg-[#f7f6fb] px-5 py-5 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-white bg-white shadow-[0_28px_90px_rgba(63,43,136,0.14)]">
            <section className="relative overflow-hidden bg-[#15152c] px-7 py-12 text-white sm:px-10 lg:px-14 lg:py-16">
            <div className="absolute -right-20 -top-20 size-72 rounded-full bg-[#7558f7]/60 blur-3xl" />
            <div className="absolute -bottom-24 left-1/3 size-72 rounded-full bg-[#b8f5cf]/20 blur-3xl" />

            <div className="relative z-10 max-w-3xl">
                <div className="flex items-center gap-3">
                <div className="grid size-12 place-items-center rounded-2xl bg-[#b8f5cf]">
                    <span className="font-display text-2xl font-bold text-[#15152c]">
                    {business.name.charAt(0).toUpperCase()}
                    </span>
                </div>

                <div>
                    <p className="font-display text-xl font-bold tracking-[-0.06em]">
                    {business.name}
                    </p>

                    <p className="text-xs font-medium text-white/50">
                    Online booking
                    </p>
                </div>
                </div>

                <div className="mt-10 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#b8f5cf]">
                <Sparkles className="size-3.5" />
                Book your appointment online
                </div>

                <h1 className="font-display mt-5 text-4xl font-bold tracking-[-0.065em] sm:text-5xl">
                Choose your service. We&apos;ll take care of the rest.
                </h1>

                <p className="mt-5 max-w-2xl text-lg leading-8 text-white/65">
                {business.description ||
                    "Browse available services and book an appointment at a time that works for you."}
                </p>

                <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/70">
                {business.address ? (
                    <span className="flex items-center gap-2">
                    <MapPin className="size-4 text-[#b8f5cf]" />
                    {business.address}
                    </span>
                ) : null}

                {business.phone ? (
                    <span className="flex items-center gap-2">
                    <Phone className="size-4 text-[#b8f5cf]" />
                    {business.phone}
                    </span>
                ) : null}
                </div>
            </div>
            </section>

            <section className="px-7 py-10 sm:px-10 lg:px-14 lg:py-14">
            <div className="mb-8">
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#7558f7]">
                Available services
                </p>

                <h2 className="font-display mt-3 text-3xl font-bold tracking-[-0.06em] text-[#201d35]">
                What would you like to book?
                </h2>

                <p className="mt-3 text-[#777385]">
                Choose one of the services below to continue with your booking.
                </p>
            </div>

            {business.services.length === 0 ? (
                <div className="rounded-[1.6rem] border border-dashed border-[#d8cffd] bg-[#fcfbfe] px-6 py-14 text-center">
                <CalendarDays className="mx-auto size-8 text-[#7558f7]" />

                <h3 className="font-display mt-4 text-xl font-bold text-[#28243d]">
                    Online booking is almost ready.
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#777385]">
                    This business has not added any bookable services yet. Please
                    contact them directly for an appointment.
                </p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                {business.services.map((service) => (
                    <a
                    key={service.id}
                    href={`/book/${business.slug}/book?serviceId=${service.id}`}
                    className="group block rounded-[1.6rem] border border-[#e8e4ef] bg-white p-5 shadow-[0_10px_30px_rgba(65,44,140,0.05)] transition hover:-translate-y-1 hover:border-[#bcaeff] hover:shadow-[0_20px_40px_rgba(65,44,140,0.12)] focus:outline-none focus:ring-4 focus:ring-[#7558f7]/20"
                    >
                    <div className="flex items-start justify-between gap-4">
                        <div className="grid size-11 place-items-center rounded-2xl bg-[#eeeaff] font-display text-lg font-bold text-[#7558f7]">
                        {service.name.charAt(0).toUpperCase()}
                        </div>

                        <p className="font-display text-xl font-bold tracking-[-0.05em] text-[#15152c]">
                        {currencyFormatter.format(Number(service.price))}
                        </p>
                    </div>

                    <h3 className="font-display mt-6 text-2xl font-bold tracking-[-0.05em] text-[#28243d]">
                        {service.name}
                    </h3>

                    <p className="mt-2 min-h-12 text-sm leading-6 text-[#777385]">
                        {service.description ||
                        "A professional service tailored to your needs."}
                    </p>

                    <div className="mt-6 flex items-center justify-between border-t border-[#eeeaf4] pt-4">
                        <span className="flex items-center gap-2 text-sm font-semibold text-[#6d687a]">
                        <Clock3 className="size-4 text-[#9d98a9]" />
                        {formatDuration(service.durationMinutes)}
                        </span>

                        <span className="rounded-lg bg-[#eeeaff] px-3 py-2 text-xs font-bold text-[#684de7] transition group-hover:bg-[#7558f7] group-hover:text-white">
                        Select service →
                        </span>
                    </div>
                    </a>
                ))}
                </div>
            )}
            </section>

            <footer className="border-t border-[#ece8f2] bg-[#fcfbfe] px-7 py-5 text-center text-xs text-[#918b9e]">
            Powered by{" "}
            <span className="font-display font-bold text-[#6256a4]">
                ServiceFlow
            </span>
            </footer>
        </div>
        </main>
    );
}