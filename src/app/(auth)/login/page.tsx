"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
    ArrowRight,
    CalendarDays,
    Eye,
    EyeOff,
    LockKeyhole,
    Sparkles,
} from "lucide-react";
import ServiceFlowLogo from "@/components/shared/serviceflow-logo";


export default function LoginPage() {
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    try {
        const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        });

        if (!result || result.error) {
        setErrorMessage("Your email or password is incorrect.");
        return;
        }

        router.replace("/dashboard");
        router.refresh();
    } catch {
        setErrorMessage("Unable to log in right now. Please try again.");
    } finally {
        setIsLoading(false);
    }
    }

    return (
    <main className="min-h-screen bg-[#f7f6fb] px-5 py-5 sm:px-8 lg:px-12">
        <div className="mx-auto grid min-h-[calc(100vh-2.5rem)] max-w-7xl overflow-hidden rounded-[2rem] border border-white bg-white shadow-[0_28px_90px_rgba(63,43,136,0.14)] lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden bg-[#e8e2ff] p-12 lg:block">
            <div className="absolute -right-20 top-0 size-80 rounded-full bg-[#b8f5cf]/75 blur-3xl" />
            <div className="absolute -bottom-24 -left-20 size-96 rounded-full bg-[#7558f7]/25 blur-3xl" />

            <div className="relative z-10 flex h-full flex-col">
            <Link href="/" className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-2xl bg-[#15152c]">
                <span className="font-display text-xl font-bold text-[#b8f5cf]">
                    <div className="grid size-11 place-items-center rounded-2xl bg-[#15152c] p-1.5">
                        <ServiceFlowLogo className="h-8 w-auto" priority />
                    </div>
                </span>
                </div>

                <div>
                <p className="font-display text-lg font-bold tracking-[-0.06em] text-[#15152c]">
                    ServiceFlow
                </p>
                <p className="-mt-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#756f91]">
                    run things beautifully
                </p>
                </div>
            </Link>

            <div className="my-auto max-w-md">
                <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#c9bfff] bg-white/70 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#6248df]">
                <Sparkles className="size-3.5" />
                Welcome back
                </div>

                <h1 className="font-display text-5xl font-bold leading-[0.98] tracking-[-0.07em] text-[#24203d]">
                Pick up exactly where your business left off.
                </h1>

                <p className="mt-6 text-lg leading-8 text-[#645e7c]">
                Your schedule, customers, payments, and next best move are all
                waiting in one organised place.
                </p>
            </div>

            <div className="relative rounded-[1.5rem] border border-white/80 bg-white/75 p-5 shadow-[0_18px_45px_rgba(88,65,169,0.14)] backdrop-blur">
                <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="grid size-10 place-items-center rounded-xl bg-[#15152c]">
                    <CalendarDays className="size-4 text-[#b8f5cf]" />
                    </div>

                    <div>
                    <p className="text-xs font-bold uppercase tracking-[0.13em] text-[#858095]">
                        Today
                    </p>
                    <p className="font-display text-lg font-bold text-[#28243d]">
                        8 bookings lined up
                    </p>
                    </div>
                </div>

                <span className="rounded-full bg-[#e4f9ec] px-3 py-1 text-xs font-bold text-[#277246]">
                    On track
                </span>
                </div>
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
                <div className="mb-5 grid size-12 place-items-center rounded-2xl bg-[#e4f9ec]">
                <LockKeyhole className="size-5 text-[#277246]" />
                </div>

                <p className="text-xs font-extrabold uppercase tracking-[0.17em] text-[#277246]">
                Sign in to your workspace
                </p>

                <h2 className="font-display mt-3 text-4xl font-bold tracking-[-0.065em] text-[#15152c]">
                Good to see you.
                </h2>

                <p className="mt-3 leading-7 text-[#747184]">
                Enter your details to continue to your ServiceFlow dashboard.
                </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-bold text-[#363449]"
                >
                    Email address
                </label>

                <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-[#e2deeb] bg-[#fcfbfe] px-4 py-3.5 text-sm text-[#26243a] outline-none transition placeholder:text-[#aaa6b7] focus:border-[#7558f7] focus:ring-4 focus:ring-[#7558f7]/10"
                />
                </div>

                <div>
                <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-bold text-[#363449]"
                >
                    Password
                </label>

                <div className="relative">
                    <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
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
                </div>

                {errorMessage ? (
                <div className="rounded-xl border border-[#ffc2b8] bg-[#fff3f0] px-4 py-3 text-sm font-medium text-[#b94d3c]">
                    {errorMessage}
                </div>
                ) : null}

                <button
                type="submit"
                disabled={isLoading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#15152c] px-4 py-3.5 text-sm font-bold text-white shadow-[0_14px_25px_rgba(21,21,44,0.18)] transition hover:-translate-y-0.5 hover:bg-[#2a2948] disabled:cursor-not-allowed disabled:opacity-60"
                >
                {isLoading ? "Logging you in..." : "Log in to ServiceFlow"}
                {!isLoading && <ArrowRight className="size-4" />}
                </button>
            </form>

            <p className="mt-7 text-center text-sm text-[#777385]">
                New to ServiceFlow?{" "}
                <Link
                href="/register"
                className="font-bold text-[#7558f7] hover:text-[#6046e4]"
                >
                Create an account
                </Link>
            </p>

            <p className="mt-3 text-center text-xs text-[#aaa6b7]">
                Password reset will be added shortly.
            </p>
            </div>
        </section>
        </div>
    </main>
    );
}