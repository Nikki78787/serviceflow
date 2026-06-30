"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    ArrowRight,
    Check,
    Clock3,
    Sparkles,
    Tag,
    } from "lucide-react";

    type MessageState = {
    type: "error" | "";
    text: string;
    };

    const suggestions = [
    {
        name: "Signature service",
        duration: "60",
        price: "85",
    },
    {
        name: "Premium consultation",
        duration: "45",
        price: "50",
    },
    {
        name: "Express treatment",
        duration: "30",
        price: "35",
    },
    ];

    export default function NewServicePage() {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<MessageState>({
        type: "",
        text: "",
    });

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setIsLoading(true);
        setMessage({
        type: "",
        text: "",
        });

        const formData = new FormData(event.currentTarget);

        const payload = {
        name: String(formData.get("name") ?? "").trim(),
        description: String(formData.get("description") ?? "").trim(),
        durationMinutes: Number(formData.get("durationMinutes")),
        price: Number(formData.get("price")),
        };

        try {
        const response = await fetch("/api/services", {
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
            text: data.message ?? "Unable to create this service.",
            });

            return;
        }

        router.push("/services");
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

    function fillSuggestion(suggestion: (typeof suggestions)[number]) {
        const form = document.querySelector<HTMLFormElement>("#service-form");

        if (!form) {
        return;
        }

        const nameInput = form.elements.namedItem("name") as HTMLInputElement;
        const durationInput = form.elements.namedItem(
        "durationMinutes"
        ) as HTMLInputElement;
        const priceInput = form.elements.namedItem("price") as HTMLInputElement;

        nameInput.value = suggestion.name;
        durationInput.value = suggestion.duration;
        priceInput.value = suggestion.price;
    }

    return (
        <main className="min-h-screen bg-[#f7f6fb] px-5 py-5 sm:px-8 lg:px-12">
        <div className="mx-auto grid min-h-[calc(100vh-2.5rem)] max-w-7xl overflow-hidden rounded-[2rem] border border-white bg-white shadow-[0_28px_90px_rgba(63,43,136,0.14)] lg:grid-cols-[0.82fr_1.18fr]">
            <aside className="relative hidden overflow-hidden bg-[#15152c] p-12 text-white lg:block">
            <div className="absolute -left-20 top-8 size-80 rounded-full bg-[#7558f7]/60 blur-3xl" />
            <div className="absolute -bottom-20 right-0 size-80 rounded-full bg-[#b8f5cf]/30 blur-3xl" />

            <div className="relative z-10 flex h-full flex-col">
                <Link href="/services" className="flex items-center gap-3">
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
                    Services and pricing
                    </p>
                </div>
                </Link>

                <div className="my-auto">
                <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#b8f5cf]">
                    <Sparkles className="size-3.5" />
                    Build your menu
                </div>

                <h1 className="font-display text-5xl font-bold leading-[0.98] tracking-[-0.07em]">
                    Give customers a clear reason to book.
                </h1>

                <p className="mt-6 max-w-md text-lg leading-8 text-white/60">
                    Keep the name, duration, and pricing simple. You can always
                    improve your service details later.
                </p>

                <div className="mt-10 space-y-4">
                    <div className="flex items-center gap-3">
                    <span className="grid size-7 place-items-center rounded-full bg-[#b8f5cf]">
                        <Check className="size-4 text-[#17462f]" />
                    </span>
                    <span className="text-sm font-semibold text-white/80">
                        Customers will see clear prices
                    </span>
                    </div>

                    <div className="flex items-center gap-3">
                    <span className="grid size-7 place-items-center rounded-full bg-[#b8f5cf]">
                        <Check className="size-4 text-[#17462f]" />
                    </span>
                    <span className="text-sm font-semibold text-white/80">
                        Booking duration stays organised
                    </span>
                    </div>

                    <div className="flex items-center gap-3">
                    <span className="grid size-7 place-items-center rounded-full bg-[#b8f5cf]">
                        <Check className="size-4 text-[#17462f]" />
                    </span>
                    <span className="text-sm font-semibold text-white/80">
                        Services can be used in invoices
                    </span>
                    </div>
                </div>
                </div>

                <p className="text-sm text-white/45">
                You can edit or pause this service later.
                </p>
            </div>
            </aside>

            <section className="flex items-center justify-center p-6 sm:p-10 lg:p-14">
            <div className="w-full max-w-xl">
                <Link
                href="/services"
                className="mb-10 inline-flex items-center gap-2 text-sm font-bold text-[#6c6780] transition hover:text-[#7558f7]"
                >
                <ArrowLeft className="size-4" />
                Back to services
                </Link>

                <div className="mb-8">
                <div className="mb-5 grid size-12 place-items-center rounded-2xl bg-[#eeeaff]">
                    <Tag className="size-5 text-[#7558f7]" />
                </div>

                <p className="text-xs font-extrabold uppercase tracking-[0.17em] text-[#7558f7]">
                    New service
                </p>

                <h2 className="font-display mt-3 text-4xl font-bold tracking-[-0.065em] text-[#15152c]">
                    What can customers book?
                </h2>

                <p className="mt-3 leading-7 text-[#747184]">
                    Add the main service details. You can later assign it to staff,
                    display it publicly, and include it in invoices.
                </p>
                </div>

                <form id="service-form" className="space-y-5" onSubmit={handleSubmit}>
                <div>
                    <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-bold text-[#363449]"
                    >
                    Service name
                    </label>

                    <input
                    id="name"
                    name="name"
                    required
                    minLength={2}
                    maxLength={100}
                    placeholder="For example, Signature Haircut"
                    className="w-full rounded-xl border border-[#e2deeb] bg-[#fcfbfe] px-4 py-3.5 text-sm text-[#26243a] outline-none transition placeholder:text-[#aaa6b7] focus:border-[#7558f7] focus:ring-4 focus:ring-[#7558f7]/10"
                    />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                    <label
                        htmlFor="durationMinutes"
                        className="mb-2 block text-sm font-bold text-[#363449]"
                    >
                        Duration in minutes
                    </label>

                    <div className="relative">
                        <Clock3 className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#aaa6b7]" />

                        <input
                        id="durationMinutes"
                        name="durationMinutes"
                        type="number"
                        required
                        min="5"
                        max="1440"
                        step="5"
                        placeholder="60"
                        className="w-full rounded-xl border border-[#e2deeb] bg-[#fcfbfe] py-3.5 pl-11 pr-4 text-sm text-[#26243a] outline-none transition placeholder:text-[#aaa6b7] focus:border-[#7558f7] focus:ring-4 focus:ring-[#7558f7]/10"
                        />
                    </div>
                    </div>

                    <div>
                    <label
                        htmlFor="price"
                        className="mb-2 block text-sm font-bold text-[#363449]"
                    >
                        Price in RM
                    </label>

                    <div className="relative">
                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#777385]">
                        RM
                        </span>

                        <input
                        id="price"
                        name="price"
                        type="number"
                        required
                        min="0.01"
                        max="999999.99"
                        step="0.01"
                        placeholder="85.00"
                        className="w-full rounded-xl border border-[#e2deeb] bg-[#fcfbfe] py-3.5 pl-12 pr-4 text-sm text-[#26243a] outline-none transition placeholder:text-[#aaa6b7] focus:border-[#7558f7] focus:ring-4 focus:ring-[#7558f7]/10"
                        />
                    </div>
                    </div>
                </div>

                <div>
                    <label
                    htmlFor="description"
                    className="mb-2 block text-sm font-bold text-[#363449]"
                    >
                    Description <span className="text-[#aaa6b7]">(optional)</span>
                    </label>

                    <textarea
                    id="description"
                    name="description"
                    rows={4}
                    maxLength={500}
                    placeholder="Briefly describe what is included in this service."
                    className="w-full resize-none rounded-xl border border-[#e2deeb] bg-[#fcfbfe] px-4 py-3.5 text-sm text-[#26243a] outline-none transition placeholder:text-[#aaa6b7] focus:border-[#7558f7] focus:ring-4 focus:ring-[#7558f7]/10"
                    />
                </div>

                <div className="rounded-2xl border border-[#e8e3f1] bg-[#faf9fd] p-4">
                    <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-[#857e96]">
                    Quick examples
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                    {suggestions.map((suggestion) => (
                        <button
                        key={suggestion.name}
                        type="button"
                        onClick={() => fillSuggestion(suggestion)}
                        className="rounded-lg border border-[#e2dcef] bg-white px-3 py-2 text-xs font-bold text-[#655e78] transition hover:border-[#bcaeff] hover:bg-[#eeeaff] hover:text-[#684de7]"
                        >
                        {suggestion.name}
                        </button>
                    ))}
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
                    {isLoading ? "Creating service..." : "Create service"}
                    {!isLoading && <ArrowRight className="size-4" />}
                </button>
                </form>
            </div>
            </section>
        </div>
        </main>
    );
}