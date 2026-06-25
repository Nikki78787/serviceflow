import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 text-center">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Booking. CRM. Invoicing.
          </p>

          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Run your service business with{" "}
            <span className="text-cyan-400">ServiceFlow</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            ServiceFlow helps small businesses manage bookings, customers,
            staff, invoices, and payments from one platform.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Start Free
            </Link>

            <Link
              href="/login"
              className="rounded-lg border border-slate-700 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
            >
              Log In
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}