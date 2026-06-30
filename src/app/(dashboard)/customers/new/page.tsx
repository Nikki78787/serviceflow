"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    ArrowRight,
    Check,
    Mail,
    MessageSquareText,
    Phone,
    Sparkles,
    UsersRound,
    } from "lucide-react";

    type MessageState = {
    type: "error" | "";
    text: string;
    };

    export default function NewCustomerPage() {
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
        fullName: String(formData.get("fullName") ?? "").trim(),
        email: String(formData.get("email") ?? "").trim(),
        phone: String(formData.get("phone") ?? "").trim(),
        notes: String(formData.get("notes") ?? "").trim(),
        };

        try {
        const response = await fetch("/api/customers", {
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
            text: data.message ?? "Unable to create this customer.",
            });

            return;
        }

        router.push("/customers");
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
                <Link href="/customers" className="flex items-center gap-3">
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
                    Customer CRM
                    </p>
                </div>
                </Link>

                <div className="my-auto">
                <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#b8f5cf]">
                    <Sparkles className="size-3.5" />
                    Customer relationship
                </div>

                <h1 className="font-display text-5xl font-bold leading-[0.98] tracking-[-0.07em]">
                    Great service starts with knowing your customers.
                </h1>

                <p className="mt-6 max-w-md text-lg leading-8 text-white/60">
                    Add the basics now. Every booking and invoice will build a
                    helpful customer history over time.
                </p>

                <div className="mt-10 space-y-4">
                    <div className="flex items-center gap-3">
                    <span className="grid size-7 place-items-center rounded-full bg-[#b8f5cf]">
                        <Check className="size-4 text-[#17462f]" />
                    </span>
                    <span className="text-sm font-semibold text-white/80">
                        Keep contact details close
                    </span>
                    </div>

                    <div className="flex items-center gap-3">
                    <span className="grid size-7 place-items-center rounded-full bg-[#b8f5cf]">
                        <Check className="size-4 text-[#17462f]" />
                    </span>
                    <span className="text-sm font-semibold text-white/80">
                        Save preferences and important notes
                    </span>
                    </div>

                    <div className="flex items-center gap-3">
                    <span className="grid size-7 place-items-center rounded-full bg-[#b8f5cf]">
                        <Check className="size-4 text-[#17462f]" />
                    </span>
                    <span className="text-sm font-semibold text-white/80">
                        Create bookings confidently
                    </span>
                    </div>
                </div>
                </div>

                <p className="text-sm text-white/45">
                You can update customer details later.
                </p>
            </div>
            </aside>

            <section className="flex items-center justify-center p-6 sm:p-10 lg:p-14">
            <div className="w-full max-w-xl">
                <Link
                href="/customers"
                className="mb-10 inline-flex items-center gap-2 text-sm font-bold text-[#6c6780] transition hover:text-[#7558f7]"
                >
                <ArrowLeft className="size-4" />
                Back to customers
                </Link>

                <div className="mb-8">
                <div className="mb-5 grid size-12 place-items-center rounded-2xl bg-[#e4f9ec]">
                    <UsersRound className="size-5 text-[#277246]" />
                </div>

                <p className="text-xs font-extrabold uppercase tracking-[0.17em] text-[#277246]">
                    New customer
                </p>

                <h2 className="font-display mt-3 text-4xl font-bold tracking-[-0.065em] text-[#15152c]">
                    Add someone to your CRM.
                </h2>

                <p className="mt-3 leading-7 text-[#747184]">
                    Start with the contact details your team needs for an easy
                    booking and service experience.
                </p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                    <label
                    htmlFor="fullName"
                    className="mb-2 block text-sm font-bold text-[#363449]"
                    >
                    Customer full name
                    </label>

                    <input
                    id="fullName"
                    name="fullName"
                    required
                    minLength={2}
                    maxLength={100}
                    placeholder="For example, Aina Farah"
                    className="w-full rounded-xl border border-[#e2deeb] bg-[#fcfbfe] px-4 py-3.5 text-sm text-[#26243a] outline-none transition placeholder:text-[#aaa6b7] focus:border-[#7558f7] focus:ring-4 focus:ring-[#7558f7]/10"
                    />
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
                        placeholder="aina@email.com"
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
                    htmlFor="notes"
                    className="mb-2 block text-sm font-bold text-[#363449]"
                    >
                    Customer notes{" "}
                    <span className="text-[#aaa6b7]">(optional)</span>
                    </label>

                    <div className="relative">
                    <MessageSquareText className="pointer-events-none absolute left-4 top-4 size-4 text-[#aaa6b7]" />

                    <textarea
                        id="notes"
                        name="notes"
                        rows={4}
                        maxLength={1000}
                        placeholder="For example, prefers morning appointments or has a favourite stylist."
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
                    {isLoading ? "Saving customer..." : "Save customer"}
                    {!isLoading && <ArrowRight className="size-4" />}
                </button>
                </form>
            </div>
            </section>
        </div>
        </main>
    );
}