import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
  CircleCheck,
  Clock3,
  FileText,
  Plus,
  Sparkles,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import ServiceFlowLogo from "@/components/shared/serviceflow-logo";

const bookings = [
  {
    time: "09:30",
    name: "Maya Lim",
    service: "Full colour & styling",
    initials: "ML",
    avatarColor: "#FFD2CA",
  },
  {
    time: "11:00",
    name: "Adam Wong",
    service: "Premium consultation",
    initials: "AW",
    avatarColor: "#C7DAFF",
  },
  {
    time: "14:30",
    name: "Sara Aina",
    service: "Signature treatment",
    initials: "SA",
    avatarColor: "#C5F3D8",
  },
];

const chartHeights = ["34%", "48%", "41%", "64%", "56%", "82%", "72%"];

export default function HomePage() {
  return (
    <main className="overflow-hidden bg-[#f7f6fb] text-[#15152c]">
      <section className="relative min-h-[780px] overflow-hidden px-5 pb-16 pt-5 sm:px-8 lg:px-12">
        <div className="pointer-events-none absolute -left-36 top-24 size-[28rem] rounded-full bg-[#b9abff]/50 blur-3xl" />
        <div className="pointer-events-none absolute right-[-9rem] top-[-7rem] size-[31rem] rounded-full bg-[#b8f5cf]/55 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-13rem] left-[28%] size-[28rem] rounded-full bg-[#ffcbc3]/50 blur-3xl" />

        <div className="soft-grid pointer-events-none absolute inset-0 opacity-40" />

        <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between gap-5 rounded-2xl border border-white/70 bg-white/55 px-4 py-3 shadow-[0_16px_50px_rgba(50,35,115,0.08)] backdrop-blur-xl sm:px-5">
          <Link href="/" className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-2xl bg-[#15152c] shadow-[0_8px_20px_rgba(21,21,44,0.22)]">
              <span className="font-display text-xl font-bold text-[#b8f5cf]">
                <div className="grid size-10 place-items-center rounded-2xl bg-[#15152c] p-1.5">
                  <ServiceFlowLogo className="h-7 w-auto" priority />
                </div>
              </span>
            </div>

            <div>
              <p className="font-display text-lg font-bold tracking-[-0.06em]">
                ServiceFlow
              </p>
              <p className="-mt-0.5 text-[10px] font-bold uppercase tracking-[0.19em] text-[#77758a]">
                run things beautifully
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-7 text-sm font-semibold text-[#56546a] md:flex">
            <a href="#features" className="transition hover:text-[#7558f7]">
              Features
            </a>
            <a href="#workflow" className="transition hover:text-[#7558f7]">
              How it works
            </a>
            <a href="#businesses" className="transition hover:text-[#7558f7]">
              For businesses
            </a>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden rounded-xl px-4 py-2.5 text-sm font-bold text-[#15152c] transition hover:bg-white sm:block"
            >
              Log in
            </Link>

            <Link
              href="/register"
              className="group inline-flex items-center gap-2 rounded-xl bg-[#15152c] px-4 py-2.5 text-sm font-bold text-white shadow-[0_10px_22px_rgba(21,21,44,0.18)] transition hover:-translate-y-0.5 hover:bg-[#2a294a]"
            >
              Start free
              <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
            </Link>
          </div>
        </nav>

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 pb-10 pt-16 lg:grid-cols-[0.94fr_1.06fr] lg:pt-24">
          <div className="max-w-2xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#bdb2ff] bg-white/70 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#5b43d7] shadow-sm">
              <Sparkles className="size-3.5" />
              Built for busy service teams
            </div>

            <h1 className="font-display text-balance text-5xl font-bold leading-[0.96] tracking-[-0.075em] text-[#15152c] sm:text-6xl lg:text-7xl">
              The calm way to run a{" "}
              <span className="relative inline-block text-[#7558f7]">
                very busy
                <svg
                  className="absolute -bottom-2 left-0 h-3 w-full text-[#ff9c8d]"
                  viewBox="0 0 160 12"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 8.5C43 2.5 107 2.5 158 7"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{" "}
              business.
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-8 text-[#646276] sm:text-xl">
              From bookings and customer notes to invoices and revenue, keep
              your entire service business flowing in one simple, beautiful
              place.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-[#7558f7] px-6 py-4 text-sm font-bold text-white shadow-[0_18px_35px_rgba(117,88,247,0.3)] transition hover:-translate-y-1 hover:bg-[#6046e4]"
              >
                Create your workspace
                <ArrowRight className="size-4 transition group-hover:translate-x-1" />
              </Link>

              <a
                href="#workflow"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#dcd8ea] bg-white/70 px-6 py-4 text-sm font-bold text-[#32304a] transition hover:border-[#bdb2ff] hover:bg-white"
              >
                Explore the flow
                <ChevronRight className="size-4" />
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium text-[#5d5b70]">
              <span className="flex items-center gap-2">
                <span className="grid size-5 place-items-center rounded-full bg-[#b8f5cf]">
                  <Check className="size-3 text-[#1a5e40]" strokeWidth={3} />
                </span>
                No credit card required
              </span>

              <span className="flex items-center gap-2">
                <span className="grid size-5 place-items-center rounded-full bg-[#c7daff]">
                  <Check className="size-3 text-[#244b98]" strokeWidth={3} />
                </span>
                Ready in minutes
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[630px]">
            <div className="absolute -left-5 top-14 hidden w-40 rounded-2xl border border-white/80 bg-white/75 p-3 shadow-[0_18px_55px_rgba(56,37,123,0.14)] backdrop-blur-md lg:block">
              <div className="flex items-center gap-2">
                <div className="grid size-8 place-items-center rounded-xl bg-[#b8f5cf]">
                  <TrendingUp className="size-4 text-[#17663d]" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#77758a]">
                    This month
                  </p>
                  <p className="font-display text-sm font-bold">$8,420</p>
                </div>
              </div>
              <p className="mt-2 text-xs font-bold text-[#2a9c64]">
                +18.4% from last month
              </p>
            </div>

            <div className="absolute -bottom-8 right-0 hidden rounded-2xl border border-white/80 bg-[#15152c] px-4 py-3 text-white shadow-[0_18px_55px_rgba(21,21,44,0.22)] lg:block">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#b8f5cf]">
                Next appointment
              </p>
              <p className="mt-1 text-sm font-bold">Maya Lim · 09:30</p>
            </div>

            <div className="relative rounded-[2rem] border border-white/90 bg-white/75 p-3 shadow-[0_35px_100px_rgba(66,43,149,0.24)] backdrop-blur-xl">
              <div className="overflow-hidden rounded-[1.5rem] border border-[#ebe8f3] bg-[#fbfbfe]">
                <div className="flex items-center justify-between border-b border-[#ece9f2] px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="grid size-9 place-items-center rounded-xl bg-[#7558f7]">
                      <CalendarDays className="size-4 text-white" />
                    </div>

                    <div>
                      <p className="font-display text-sm font-bold">Good morning, Nina</p>
                      <p className="text-xs text-[#77758a]">Here is your day at a glance.</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    aria-label="Add new booking"
                    className="grid size-9 place-items-center rounded-xl bg-[#15152c] text-white transition hover:bg-[#2a294a]"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>

                <div className="grid gap-3 p-4 sm:grid-cols-[1.1fr_0.9fr]">
                  <div className="rounded-2xl border border-[#ebe8f2] bg-white p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.13em] text-[#817f91]">
                          Today&apos;s schedule
                        </p>
                        <p className="font-display mt-1 text-xl font-bold tracking-[-0.05em]">
                          8 bookings
                        </p>
                      </div>

                      <div className="rounded-xl bg-[#fff0ed] px-2.5 py-1.5 text-xs font-bold text-[#dc5a45]">
                        2 pending
                      </div>
                    </div>

                    <div className="mt-4 space-y-2.5">
                      {bookings.map((booking) => (
                        <div
                          key={booking.name}
                          className="flex items-center gap-3 rounded-xl bg-[#f8f7fc] px-3 py-2.5"
                        >
                          <span className="w-9 text-xs font-bold text-[#7558f7]">
                            {booking.time}
                          </span>

                          <div
                            className="grid size-8 place-items-center rounded-full text-[10px] font-extrabold text-[#32304a]"
                            style={{ backgroundColor: booking.avatarColor }}
                          >
                            {booking.initials}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-bold text-[#313047]">
                              {booking.name}
                            </p>
                            <p className="truncate text-[11px] text-[#878596]">
                              {booking.service}
                            </p>
                          </div>

                          <CircleCheck className="size-4 text-[#48b778]" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="rounded-2xl bg-[#15152c] p-4 text-white">
                      <div className="flex items-center justify-between">
                        <div className="grid size-9 place-items-center rounded-xl bg-white/10">
                          <TrendingUp className="size-4 text-[#b8f5cf]" />
                        </div>

                        <span className="rounded-full bg-[#b8f5cf] px-2.5 py-1 text-[10px] font-extrabold text-[#1c4e35]">
                          +18.4%
                        </span>
                      </div>

                      <p className="mt-5 text-xs font-semibold text-white/60">
                        Revenue this month
                      </p>
                      <p className="font-display mt-1 text-3xl font-bold tracking-[-0.06em]">
                        $8,420
                      </p>

                      <div className="mt-5 flex h-16 items-end justify-between gap-1.5">
                        {chartHeights.map((height, index) => (
                          <div
                            key={index}
                            className="w-full rounded-t-md bg-[#b8f5cf]"
                            style={{
                              height,
                              opacity: index === 5 ? 1 : 0.38,
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-[#ebe8f2] bg-white p-3.5">
                        <div className="grid size-8 place-items-center rounded-xl bg-[#eeeaff]">
                          <UsersRound className="size-4 text-[#7558f7]" />
                        </div>
                        <p className="font-display mt-3 text-xl font-bold">126</p>
                        <p className="text-[11px] font-medium text-[#878596]">
                          active customers
                        </p>
                      </div>

                      <div className="rounded-2xl border border-[#ebe8f2] bg-white p-3.5">
                        <div className="grid size-8 place-items-center rounded-xl bg-[#fff0ed]">
                          <FileText className="size-4 text-[#df684f]" />
                        </div>
                        <p className="font-display mt-3 text-xl font-bold">14</p>
                        <p className="text-[11px] font-medium text-[#878596]">
                          open invoices
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-[#ece9f2] px-5 py-3.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#77758a]">
                    <Clock3 className="size-3.5" />
                    Updated just now
                  </div>

                  <span className="text-xs font-bold text-[#7558f7]">
                    View dashboard →
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="border-y border-[#e6e2ef] bg-white px-5 py-20 sm:px-8 lg:px-12"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#7558f7]">
              One workspace. Every moving part.
            </p>

            <h2 className="font-display mt-4 text-balance text-4xl font-bold tracking-[-0.065em] sm:text-5xl">
              Less admin chaos. More time doing great work.
            </h2>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            <FeatureCard
              icon={<CalendarDays className="size-5" />}
              number="01"
              title="Bookings that feel effortless"
              description="Let customers book online while your team manages availability, staff schedules, and changes from one place."
              accent="bg-[#eeeaff] text-[#7558f7]"
            />

            <FeatureCard
              icon={<UsersRound className="size-5" />}
              number="02"
              title="A CRM your team will actually use"
              description="Keep customer history, notes, preferences, and booking activity clear, organised, and easy to find."
              accent="bg-[#e4f9ec] text-[#237a4b]"
            />

            <FeatureCard
              icon={<FileText className="size-5" />}
              number="03"
              title="Invoices without the headache"
              description="Create polished invoices, track payments, and know exactly what is paid, pending, or overdue."
              accent="bg-[#fff0ed] text-[#d9654d]"
            />
          </div>
        </div>
      </section>

      <section
        id="workflow"
        className="bg-[#15152c] px-5 py-20 text-white sm:px-8 lg:px-12"
      >
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#b8f5cf]">
              Your workflow, simplified
            </p>

            <h2 className="font-display mt-4 text-balance text-4xl font-bold leading-[1.02] tracking-[-0.065em] sm:text-5xl">
              Your business does not need more tabs.
              <span className="text-[#b8f5cf]"> It needs flow.</span>
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-white/65">
              ServiceFlow gives every person the right view: owners see the
              business, staff see their day, and customers get a seamless
              booking experience.
            </p>

            <Link
              href="/register"
              className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-[#b8f5cf] px-5 py-3.5 text-sm font-extrabold text-[#173b2a] transition hover:-translate-y-0.5 hover:bg-[#d0f9dd]"
            >
              Build your workspace
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <WorkflowCard
              step="01"
              title="Set up your business"
              description="Add services, staff, hours, prices, and your brand."
            />
            <WorkflowCard
              step="02"
              title="Take bookings"
              description="Accept customer bookings and manage your schedule."
            />
            <WorkflowCard
              step="03"
              title="Get paid faster"
              description="Send invoices, track payments, and grow confidently."
            />
          </div>
        </div>
      </section>

      <section
        id="businesses"
        className="px-5 py-20 sm:px-8 lg:px-12"
      >
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-[#e8e2ff] px-6 py-12 sm:px-10 lg:flex lg:items-center lg:justify-between lg:px-14">
          <div className="max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.17em] text-[#684de7]">
              Built for service businesses
            </p>

            <h2 className="font-display mt-4 text-balance text-4xl font-bold tracking-[-0.065em] text-[#24203d] sm:text-5xl">
              Your next smooth, organised day starts here.
            </h2>

            <p className="mt-5 text-lg leading-8 text-[#5f5a76]">
              For salons, clinics, tutors, repair shops, photographers, home
              services, workshops, and every business powered by appointments.
            </p>
          </div>

          <Link
            href="/register"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#15152c] px-6 py-4 text-sm font-bold text-white shadow-[0_16px_30px_rgba(21,21,44,0.2)] transition hover:-translate-y-1 hover:bg-[#2b2948] lg:mt-0"
          >
            Start using ServiceFlow
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-[#e7e2ed] bg-white px-5 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-[#7d7a8f] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="grid size-7 place-items-center rounded-lg bg-[#15152c]">
              <span className="font-display text-sm font-bold text-[#b8f5cf]">
                <div className="grid size-8 place-items-center rounded-lg bg-[#15152c] p-1">
                  <ServiceFlowLogo className="h-6 w-auto" />
                </div>
              </span>
            </div>
            <span className="font-display font-bold text-[#292642]">
              ServiceFlow
            </span>
          </div>

          <p>Built with care for service businesses.</p>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  number,
  title,
  description,
  accent,
}: {
  icon: React.ReactNode;
  number: string;
  title: string;
  description: string;
  accent: string;
}) {
  return (
    <article className="group rounded-[1.7rem] border border-[#e9e5f0] bg-[#fcfbfe] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#c6baff] hover:shadow-[0_20px_45px_rgba(74,50,150,0.11)]">
      <div className="flex items-start justify-between">
        <div className={`grid size-11 place-items-center rounded-2xl ${accent}`}>
          {icon}
        </div>
        <span className="font-display text-sm font-bold text-[#b1aec0]">
          {number}
        </span>
      </div>

      <h3 className="font-display mt-7 text-2xl font-bold tracking-[-0.05em]">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-[#706d80]">{description}</p>

      <div className="mt-7 flex items-center gap-2 text-sm font-bold text-[#7558f7]">
        Explore feature
        <ArrowRight className="size-4 transition group-hover:translate-x-1" />
      </div>
    </article>
  );
}

function WorkflowCard({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <article className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm">
      <p className="font-display text-sm font-bold text-[#b8f5cf]">{step}</p>
      <h3 className="font-display mt-10 text-xl font-bold tracking-[-0.05em]">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-6 text-white/60">{description}</p>
    </article>
  );
}