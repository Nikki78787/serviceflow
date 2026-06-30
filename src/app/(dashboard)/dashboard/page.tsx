import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  CircleDollarSign,
  Clock3,
  FileText,
  MapPin,
  UsersRound,
} from "lucide-react";
import ServiceFlowLogo from "@/components/shared/serviceflow-logo";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email.toLowerCase(),
    },
    select: {
      name: true,
      email: true,
      memberships: {
        where: {
          role: "OWNER",
          status: "ACTIVE",
        },
        orderBy: {
          createdAt: "asc",
        },
        take: 1,
        include: {
          business: true,
        },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  const membership = user.memberships[0];

  if (!membership) {
    redirect("/onboarding");
  }

  const business = membership.business;

  const today = new Date();
  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const startOfTomorrow = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1
  );

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const startOfNextMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    1
  );

  const [bookingsToday, customerCount, openInvoiceCount, revenueResult] =
    await Promise.all([
      prisma.appointment.count({
        where: {
          businessId: business.id,
          startTime: {
            gte: startOfToday,
            lt: startOfTomorrow,
          },
          status: {
            in: ["PENDING", "CONFIRMED", "CHECKED_IN"],
          },
        },
      }),

      prisma.customer.count({
        where: {
          businessId: business.id,
        },
      }),

      prisma.invoice.count({
        where: {
          businessId: business.id,
          status: {
            in: ["SENT", "PENDING", "OVERDUE"],
          },
        },
      }),

      prisma.invoice.aggregate({
        _sum: {
          totalAmount: true,
        },
        where: {
          businessId: business.id,
          status: "PAID",
          paidAt: {
            gte: startOfMonth,
            lt: startOfNextMonth,
          },
        },
      }),
    ]);

  const monthlyRevenue = Number(revenueResult._sum.totalAmount ?? 0);

  const formattedRevenue = new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: business.currency,
    maximumFractionDigits: 0,
  }).format(monthlyRevenue);

  const displayName =
    user.name ?? user.email?.split("@")[0] ?? "ServiceFlow user";

  const firstName = displayName.split(" ")[0];
  const userInitial = displayName.charAt(0).toUpperCase();

    const cards = [
    {
        label: "Bookings today",
        value: String(bookingsToday),
        helper:
        bookingsToday === 0
            ? "No bookings scheduled yet"
            : "Bookings waiting for you",
        icon: CalendarDays,
        color: "bg-[#eeeaff] text-[#7558f7]",
        href: "/appointments",
    },
    {
        label: "Customers",
        value: String(customerCount),
        helper:
        customerCount === 0
            ? "Add your first customer"
            : "Customer records in your CRM",
        icon: UsersRound,
        color: "bg-[#e4f9ec] text-[#277246]",
        href: "/customers",
    },
    {
        label: "Open invoices",
        value: String(openInvoiceCount),
        helper:
        openInvoiceCount === 0
            ? "Nothing outstanding"
            : "Invoices awaiting payment",
        icon: FileText,
        color: "bg-[#fff0ed] text-[#d9654d]",
        href: "/invoices",
    },
    {
        label: "Revenue this month",
        value: formattedRevenue,
        helper:
        monthlyRevenue === 0
            ? "Create your first booking"
            : "Paid invoices this month",
        icon: CircleDollarSign,
        color: "bg-[#e8f2ff] text-[#2d70d4]",
        href: "/analytics",
    },
    ];

  return (
    <main className="min-h-screen bg-[#f7f6fb] p-5 sm:p-8 lg:p-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-5 rounded-[1.6rem] border border-white bg-white px-6 py-5 shadow-[0_15px_45px_rgba(65,44,140,0.08)] sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-2xl bg-[#15152c]">
              <span className="font-display text-xl font-bold text-[#b8f5cf]">
                <div className="grid size-11 place-items-center rounded-2xl bg-[#15152c] p-1.5">
                  <ServiceFlowLogo className="h-8 w-auto" />
                </div>
              </span>
            </div>

            <div>
              <p className="font-display text-lg font-bold tracking-[-0.06em] text-[#15152c]">
                ServiceFlow
              </p>
              <p className="text-xs font-medium text-[#878394]">
                {business.name}
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs font-bold uppercase tracking-[0.13em] text-[#908ba0]">
                Workspace
              </p>
              <p className="text-sm font-bold text-[#277246]">Live and ready</p>
            </div>

            <div className="grid size-10 place-items-center rounded-full bg-[#b8f5cf] text-sm font-extrabold text-[#17462f]">
              {userInitial}
            </div>
          </div>
        </header>

        <section className="mt-8 rounded-[2rem] bg-[#15152c] px-7 py-10 text-white shadow-[0_22px_55px_rgba(21,21,44,0.18)] sm:px-10">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#b8f5cf]">
            Welcome back, {firstName}
          </p>

          <h1 className="font-display mt-4 max-w-3xl text-4xl font-bold tracking-[-0.065em] sm:text-5xl">
            {business.name} is officially ready to flow.
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/65">
            Your business workspace is live. The next step is adding your
            services and prices so you can begin creating bookings.
          </p>

        <Link
            href="/appointments/new"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#b8f5cf] px-5 py-3.5 text-sm font-bold text-[#173b2a] transition hover:-translate-y-0.5 hover:bg-[#d0f9dd]"
            >
            Create a booking
            <ArrowRight className="size-4" />
        </Link>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
            const Icon = card.icon;

            return (
            <Link
                key={card.label}
                href={card.href}
                className="group rounded-[1.5rem] border border-[#e8e4ef] bg-white p-5 shadow-[0_10px_30px_rgba(65,44,140,0.05)] transition hover:-translate-y-1 hover:border-[#cfc3ff] hover:shadow-[0_18px_38px_rgba(65,44,140,0.12)]"
                >
                <div
                    className={`grid size-11 place-items-center rounded-2xl ${card.color}`}
                >
                    <Icon className="size-5" />
                </div>

                <p className="mt-6 text-sm font-semibold text-[#767183]">
                    {card.label}
                </p>

                <p className="font-display mt-1 text-3xl font-bold tracking-[-0.06em] text-[#1d1b31]">
                    {card.value}
                </p>

                <div className="mt-2 flex items-center justify-between gap-2">
                    <p className="text-xs font-medium text-[#aaa5b4]">
                        {card.helper}
                    </p>

                    <span className="text-xs font-bold text-[#7558f7] opacity-0 transition group-hover:opacity-100">
                        Open →
                    </span>
                </div>
            </Link>
            );
        })}
        </section>

        <section
          id="next-step"
          className="mt-8 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]"
        >
          <article className="rounded-[1.7rem] border border-[#e8e4ef] bg-white p-6 shadow-[0_10px_30px_rgba(65,44,140,0.05)]">
            <div className="flex items-start gap-4">
              <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#eeeaff]">
                <Building2 className="size-5 text-[#7558f7]" />
              </div>

              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#7558f7]">
                  Your business profile
                </p>

                <h2 className="font-display mt-2 text-2xl font-bold tracking-[-0.05em] text-[#201d35]">
                  {business.name}
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#777385]">
                  Your public booking link will later use:
                </p>

                <p className="mt-2 inline-flex rounded-lg bg-[#f4f2fb] px-3 py-2 font-mono text-xs font-bold text-[#7558f7]">
                  /book/{business.slug}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 border-t border-[#eeeaf4] pt-5 sm:grid-cols-2">
              <div className="flex items-center gap-3 text-sm text-[#6e6a7c]">
                <MapPin className="size-4 text-[#a39daf]" />
                <span>{business.address || "Address not added yet"}</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-[#6e6a7c]">
                <Clock3 className="size-4 text-[#a39daf]" />
                <span>Timezone: {business.timezone}</span>
              </div>
            </div>
          </article>

          <article className="rounded-[1.7rem] border border-[#d8cffd] bg-[#eeeaff] p-6">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#684de7]">
              Next setup task
            </p>

            <h2 className="font-display mt-3 text-2xl font-bold tracking-[-0.05em] text-[#292244]">
                Create your first appointment.
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#655d7b]">
              Customer records make bookings, notes, and invoices much easier to manage.
                Add someone now, then create your first appointment.
            </p>

            <Link
                href="/appointments"
                className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#684de7] transition hover:text-[#4f35ce]"
                >
                Open appointment calendar
                <ArrowRight className="size-4" />
            </Link>
          </article>
        </section>
      </div>
    </main>
  );
}