import Link from "next/link";
import DownloadInvoiceButton from "@/features/invoices/components/download-invoice-button";
import { redirect } from "next/navigation";
import {
    ArrowLeft,
    CalendarCheck2,
    CircleDollarSign,
    Clock3,
    FileText,
    ReceiptText,
    Sparkles,
    UserRound,
    } from "lucide-react";

    import { auth } from "@/auth";
    import prisma from "@/lib/prisma";
    import {
    CreateInvoiceButton,
    MarkInvoicePaidButton,
    } from "@/features/invoices/components/invoice-actions";

    function formatStatus(status: string) {
    return status
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
    }

    const statusStyles: Record<string, string> = {
    DRAFT: "bg-[#f2eff7] text-[#777385]",
    SENT: "bg-[#e8f2ff] text-[#2d70d4]",
    PENDING: "bg-[#fff0ed] text-[#d9654d]",
    PAID: "bg-[#e4f9ec] text-[#277246]",
    OVERDUE: "bg-[#ffe4df] text-[#ba4d3c]",
    VOID: "bg-[#f2eff7] text-[#777385]",
    };

    export default async function InvoicesPage() {
    const session = await auth();

    if (!session?.user?.email) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: {
        email: session.user.email.toLowerCase(),
        },
        select: {
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

    const [invoices, completedAppointments] = await Promise.all([
        prisma.invoice.findMany({
        where: {
            businessId: business.id,
        },
        orderBy: {
            createdAt: "desc",
        },
        include: {
            customer: {
            select: {
                fullName: true,
                email: true,
            },
            },
            appointment: {
            select: {
                service: {
                select: {
                    name: true,
                },
                },
            },
            },
        },
        }),

        prisma.appointment.findMany({
        where: {
            businessId: business.id,
            status: "COMPLETED",
        },
        orderBy: {
            endTime: "desc",
        },
        include: {
            customer: {
            select: {
                fullName: true,
            },
            },
            service: {
            select: {
                name: true,
            },
            },
            invoice: {
            select: {
                id: true,
            },
            },
        },
        }),
    ]);

    const readyToInvoice = completedAppointments.filter(
        (appointment) => !appointment.invoice
    );

    const pendingInvoices = invoices.filter((invoice) =>
        ["PENDING", "SENT", "OVERDUE"].includes(invoice.status)
    );

    const outstandingAmount = pendingInvoices.reduce(
        (total, invoice) => total + Number(invoice.totalAmount),
        0
    );

    const paidInvoiceCount = invoices.filter(
        (invoice) => invoice.status === "PAID"
    ).length;

    const currencyFormatter = new Intl.NumberFormat("en-MY", {
        style: "currency",
        currency: business.currency,
        maximumFractionDigits: 2,
    });

    const dateFormatter = new Intl.DateTimeFormat("en-MY", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: business.timezone,
    });

    return (
        <main className="min-h-screen bg-[#f7f6fb] p-5 sm:p-8 lg:p-10">
        <div className="mx-auto max-w-7xl">
            <header className="flex flex-col gap-5 rounded-[1.6rem] border border-white bg-white px-6 py-5 shadow-[0_15px_45px_rgba(65,44,140,0.08)] sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
                <Link
                href="/dashboard"
                className="grid size-10 place-items-center rounded-xl bg-[#f2eff9] text-[#716b82] transition hover:bg-[#eeeaff] hover:text-[#7558f7]"
                aria-label="Back to dashboard"
                >
                <ArrowLeft className="size-4" />
                </Link>

                <div>
                <p className="font-display text-lg font-bold tracking-[-0.06em] text-[#15152c]">
                    Invoices and payments
                </p>
                <p className="text-xs font-medium text-[#878394]">
                    {business.name}
                </p>
                </div>
            </div>

            <Link
                href="/appointments"
                className="inline-flex items-center gap-2 rounded-xl bg-[#15152c] px-4 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#2a2948]"
            >
                <CalendarCheck2 className="size-4" />
                View bookings
            </Link>
            </header>

            <section className="relative mt-8 overflow-hidden rounded-[2rem] bg-[#15152c] px-7 py-10 text-white shadow-[0_22px_55px_rgba(21,21,44,0.18)] sm:px-10">
            <div className="absolute -right-20 -top-20 size-64 rounded-full bg-[#7558f7]/60 blur-3xl" />
            <div className="absolute -bottom-24 right-40 size-72 rounded-full bg-[#b8f5cf]/20 blur-3xl" />

            <div className="relative z-10 max-w-3xl">
                <p className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#b8f5cf]">
                <Sparkles className="size-3.5" />
                Money, without the mess
                </p>

                <h1 className="font-display mt-4 text-4xl font-bold tracking-[-0.065em] sm:text-5xl">
                Turn completed work into paid invoices.
                </h1>

                <p className="mt-5 max-w-2xl text-lg leading-8 text-white/65">
                Create invoices from completed bookings, track outstanding
                payments, and keep your business revenue visible in one place.
                </p>
            </div>
            </section>

            <section className="mt-8 grid gap-4 sm:grid-cols-3">
            <article className="rounded-[1.5rem] border border-[#e8e4ef] bg-white p-5 shadow-[0_10px_30px_rgba(65,44,140,0.05)]">
                <div className="grid size-11 place-items-center rounded-2xl bg-[#fff0ed]">
                <ReceiptText className="size-5 text-[#d9654d]" />
                </div>

                <p className="mt-5 text-sm font-semibold text-[#767183]">
                Outstanding invoices
                </p>

                <p className="font-display mt-1 text-3xl font-bold tracking-[-0.06em] text-[#1d1b31]">
                {pendingInvoices.length}
                </p>
            </article>

            <article className="rounded-[1.5rem] border border-[#e8e4ef] bg-white p-5 shadow-[0_10px_30px_rgba(65,44,140,0.05)]">
                <div className="grid size-11 place-items-center rounded-2xl bg-[#e8f2ff]">
                <CircleDollarSign className="size-5 text-[#2d70d4]" />
                </div>

                <p className="mt-5 text-sm font-semibold text-[#767183]">
                Amount outstanding
                </p>

                <p className="font-display mt-1 text-3xl font-bold tracking-[-0.06em] text-[#1d1b31]">
                {currencyFormatter.format(outstandingAmount)}
                </p>
            </article>

            <article className="rounded-[1.5rem] border border-[#e8e4ef] bg-white p-5 shadow-[0_10px_30px_rgba(65,44,140,0.05)]">
                <div className="grid size-11 place-items-center rounded-2xl bg-[#e4f9ec]">
                <FileText className="size-5 text-[#277246]" />
                </div>

                <p className="mt-5 text-sm font-semibold text-[#767183]">
                Paid invoices
                </p>

                <p className="font-display mt-1 text-3xl font-bold tracking-[-0.06em] text-[#1d1b31]">
                {paidInvoiceCount}
                </p>
            </article>
            </section>

            <section className="mt-8">
            <div className="mb-5">
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#7558f7]">
                Ready to invoice
                </p>

                <h2 className="font-display mt-2 text-3xl font-bold tracking-[-0.06em] text-[#201d35]">
                Completed bookings waiting for payment.
                </h2>
            </div>

            {readyToInvoice.length === 0 ? (
                <div className="rounded-[1.6rem] border border-dashed border-[#d8cffd] bg-white px-6 py-10 text-center">
                <Clock3 className="mx-auto size-7 text-[#7558f7]" />

                <h3 className="font-display mt-4 text-xl font-bold text-[#26223b]">
                    Nothing waiting right now.
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#777385]">
                    Complete a booking first. It will then appear here, ready to
                    become an invoice.
                </p>
                </div>
            ) : (
                <div className="grid gap-4 lg:grid-cols-2">
                {readyToInvoice.map((appointment) => (
                    <article
                    key={appointment.id}
                    className="rounded-[1.6rem] border border-[#d8cffd] bg-[#fdfcff] p-5 shadow-[0_10px_30px_rgba(65,44,140,0.05)]"
                    >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                        <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-[#7558f7]">
                            Completed booking
                        </p>

                        <h3 className="font-display mt-2 text-2xl font-bold tracking-[-0.05em] text-[#27233e]">
                            {appointment.customer.fullName}
                        </h3>

                        <p className="mt-1 text-sm text-[#777385]">
                            {appointment.service.name}
                        </p>
                        </div>

                        <CreateInvoiceButton appointmentId={appointment.id} />
                    </div>
                    </article>
                ))}
                </div>
            )}
            </section>

            <section className="mt-10">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#7558f7]">
                    Invoice ledger
                </p>

                <h2 className="font-display mt-2 text-3xl font-bold tracking-[-0.06em] text-[#201d35]">
                    Keep every payment visible.
                </h2>
                </div>

                <p className="text-sm font-medium text-[#858092]">
                {invoices.length === 1
                    ? "1 invoice created"
                    : `${invoices.length} invoices created`}
                </p>
            </div>

            {invoices.length === 0 ? (
                <div className="rounded-[1.7rem] border border-dashed border-[#e2dcef] bg-white px-6 py-16 text-center">
                <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#eeeaff]">
                    <ReceiptText className="size-6 text-[#7558f7]" />
                </div>

                <h3 className="font-display mt-5 text-2xl font-bold tracking-[-0.05em] text-[#28243d]">
                    Your invoice ledger is empty.
                </h3>

                <p className="mx-auto mt-3 max-w-md leading-7 text-[#777385]">
                    When a booking is completed, create its invoice above and
                    ServiceFlow will track the payment status for you.
                </p>
                </div>
            ) : (
                <div className="space-y-4">
                {invoices.map((invoice) => (
                    <article
                    key={invoice.id}
                    className="rounded-[1.6rem] border border-[#e8e4ef] bg-white p-5 shadow-[0_10px_30px_rgba(65,44,140,0.05)]"
                    >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-start gap-4">
                        <div className="grid size-12 place-items-center rounded-2xl bg-[#eeeaff]">
                            <FileText className="size-5 text-[#7558f7]" />
                        </div>

                        <div>
                            <p className="font-display text-xl font-bold tracking-[-0.05em] text-[#26223b]">
                            {invoice.invoiceNumber}
                            </p>

                            <p className="mt-1 flex items-center gap-1.5 text-sm text-[#777385]">
                            <UserRound className="size-3.5" />
                            {invoice.customer.fullName}
                            </p>

                            <p className="mt-2 text-xs text-[#95909f]">
                            {invoice.appointment?.service?.name ??
                                "Manual invoice"}{" "}
                            · Issued {dateFormatter.format(invoice.issueDate)}
                            </p>
                        </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                        <p className="font-display text-xl font-bold tracking-[-0.05em] text-[#17152a]">
                            {currencyFormatter.format(Number(invoice.totalAmount))}
                        </p>

                        <span
                            className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                            statusStyles[invoice.status] ??
                            "bg-[#f2eff7] text-[#777385]"
                            }`}
                        >
                            {formatStatus(invoice.status)}
                        </span>

                        <DownloadInvoiceButton
                            invoiceId={invoice.id}
                            invoiceNumber={invoice.invoiceNumber}
                        />

                        {["PENDING", "SENT", "OVERDUE"].includes(
                            invoice.status
                        ) ? (
                            <MarkInvoicePaidButton invoiceId={invoice.id} />
                        ) : null}
                        </div>
                    </div>
                    </article>
                ))}
                </div>
            )}
            </section>
        </div>
        </main>
    );
}