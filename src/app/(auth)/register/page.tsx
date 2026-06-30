"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
    ArrowRight,
    Check,
    Eye,
    EyeOff,
    Sparkles,
    UserRoundPlus,
} from "lucide-react";
import ServiceFlowLogo from "@/components/shared/serviceflow-logo";

type MessageState = {
    type: "success" | "error" | "";
    text: string;
};

const benefits = [
    "Manage bookings in one place",
    "Keep every customer detail organised",
    "Create invoices and track payments",
];

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<MessageState>({
    type: "",
    text: "",
    });

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);
    setMessage({ type: "", text: "" });

    const formData = new FormData(event.currentTarget);

    const payload = {
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
    };

    try {
        const response = await fetch("/api/auth/register", {
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
            text: data.message ?? "Unable to create your account.",
        });

        return;
        }

        event.currentTarget.reset();

        setMessage({
        type: "success",
        text: "Your account is ready. You can log in to continue.",
        });
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
        <div className="mx-auto grid min-h-[calc(100vh-2.5rem)] max-w-7xl overflow-hidden rounded-[2rem] border border-white bg-white shadow-[0_28px_90px_rgba(63,43,136,0.14)] lg:grid-cols-[0.9fr_1.1fr]">
        <section className="relative hidden overflow-hidden bg-[#15152c] p-12 text-white lg:block">
            <div className="absolute -left-24 top-8 size-72 rounded-full bg-[#7558f7]/60 blur-3xl" />
            <div className="absolute -bottom-20 right-0 size-80 rounded-full bg-[#b8f5cf]/35 blur-3xl" />

            <div className="relative z-10 flex h-full flex-col">
            <Link href="/" className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-2xl bg-[#b8f5cf]">
                <span className="font-display text-xl font-bold text-[#15152c]">
                    <div className="grid size-11 place-items-center rounded-2xl bg-[#15152c] p-1.5">
                        <ServiceFlowLogo className="h-8 w-auto" priority />
                    </div>
                </span>
                </div>

                <div>
                <p className="font-display text-lg font-bold tracking-[-0.06em]">
                    ServiceFlow
                </p>
                <p className="-mt-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
                    run things beautifully
                </p>
                </div>
            </Link>

            <div className="my-auto max-w-md">
                <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#b8f5cf]">
                <Sparkles className="size-3.5" />
                Your workspace starts here
                </div>

                <h1 className="font-display text-5xl font-bold leading-[0.98] tracking-[-0.07em]">
                A smoother business day is closer than you think.
                </h1>

                <p className="mt-6 text-lg leading-8 text-white/60">
                Build one calm workspace for your bookings, team, customers,
                invoices, and everything in between.
                </p>

                <div className="mt-10 space-y-4">
                {benefits.map((benefit) => (
                    <div key={benefit} className="flex items-center gap-3">
                    <span className="grid size-6 place-items-center rounded-full bg-[#b8f5cf]">
                        <Check
                        className="size-3.5 text-[#17462f]"
                        strokeWidth={3}
                        />
                    </span>
                    <span className="text-sm font-semibold text-white/80">
                        {benefit}
                    </span>
                    </div>
                ))}
                </div>
            </div>

            <div className="relative mt-auto rounded-2xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur-sm">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#b8f5cf]">
                Built for service teams
                </p>
                <p className="mt-2 text-sm leading-6 text-white/65">
                Salons, tutors, clinics, repair shops, photographers, home
                cleaners, workshops, and more.
                </p>
            </div>
            </div>
        </section>

        <section className="flex items-center justify-center p-6 sm:p-10 lg:p-14">
            <div className="w-full max-w-md">
            <Link
                href="/"
                className="mb-10 flex items-center gap-3 lg:hidden"
            >
                <div className="grid size-10 place-items-center rounded-2xl bg-[#15152c]">
                <span className="font-display text-xl font-bold text-[#b8f5cf]">
                    S
                </span>
                </div>

                <span className="font-display text-lg font-bold tracking-[-0.06em] text-[#15152c]">
                ServiceFlow
                </span>
            </Link>

            <div className="mb-8">
                <div className="mb-5 grid size-12 place-items-center rounded-2xl bg-[#eeeaff]">
                <UserRoundPlus className="size-5 text-[#7558f7]" />
                </div>

                <p className="text-xs font-extrabold uppercase tracking-[0.17em] text-[#7558f7]">
                Create your account
                </p>

                <h2 className="font-display mt-3 text-4xl font-bold tracking-[-0.065em] text-[#15152c]">
                Let&apos;s get you flowing.
                </h2>

                <p className="mt-3 leading-7 text-[#747184]">
                Create your account first. Your business workspace comes next.
                </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-bold text-[#363449]"
                >
                    Full name
                </label>

                <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    minLength={2}
                    maxLength={80}
                    placeholder="Your full name"
                    className="w-full rounded-xl border border-[#e2deeb] bg-[#fcfbfe] px-4 py-3.5 text-sm text-[#26243a] outline-none transition placeholder:text-[#aaa6b7] focus:border-[#7558f7] focus:ring-4 focus:ring-[#7558f7]/10"
                />
                </div>

                <div>
                <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-bold text-[#363449]"
                >
                    Work email
                </label>

                <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-[#e2deeb] bg-[#fcfbfe] px-4 py-3.5 text-sm text-[#26243a] outline-none transition placeholder:text-[#aaa6b7] focus:border-[#7558f7] focus:ring-4 focus:ring-[#7558f7]/10"
                />
                </div>

                <div>
                <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-bold text-[#363449]"
                >
                    Create password
                </label>

                <div className="relative">
                    <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    placeholder="At least 8 characters"
                    className="w-full rounded-xl border border-[#e2deeb] bg-[#fcfbfe] px-4 py-3.5 pr-12 text-sm text-[#26243a] outline-none transition placeholder:text-[#aaa6b7] focus:border-[#7558f7] focus:ring-4 focus:ring-[#7558f7]/10"
                    />

                    <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[#858194] transition hover:bg-[#eeeaff] hover:text-[#7558f7]"
                    aria-label={
                        showPassword ? "Hide password" : "Show password"
                    }
                    >
                    {showPassword ? (
                        <EyeOff className="size-4" />
                    ) : (
                        <Eye className="size-4" />
                    )}
                    </button>
                </div>

                <p className="mt-2 text-xs leading-5 text-[#878394]">
                    Use at least 8 characters with an uppercase letter, lowercase
                    letter, and number.
                </p>
                </div>

                {message.text ? (
                <div
                    className={`rounded-xl border px-4 py-3 text-sm font-medium ${
                    message.type === "success"
                        ? "border-[#9ce1b8] bg-[#effcf4] text-[#267246]"
                        : "border-[#ffc2b8] bg-[#fff3f0] text-[#b94d3c]"
                    }`}
                >
                    {message.text}
                </div>
                ) : null}

                {message.type === "success" ? (
                <Link
                    href="/login"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#15152c] px-4 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#2a2948]"
                >
                    Continue to log in
                    <ArrowRight className="size-4" />
                </Link>
                ) : (
                <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#7558f7] px-4 py-3.5 text-sm font-bold text-white shadow-[0_14px_25px_rgba(117,88,247,0.24)] transition hover:-translate-y-0.5 hover:bg-[#6248e7] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isLoading ? "Creating your account..." : "Create account"}
                    {!isLoading && <ArrowRight className="size-4" />}
                </button>
                )}
            </form>

                <p className="mt-7 text-center text-sm text-[#777385]">
                Already have an account?{" "}
                <Link
                href="/login"
                className="font-bold text-[#7558f7] hover:text-[#6046e4]"
                >
                Log in instead
                </Link>
            </p>
            </div>
        </section>
        </div>
    </main>
    );
}