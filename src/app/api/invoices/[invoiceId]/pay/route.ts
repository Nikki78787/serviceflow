import { NextResponse } from "next/server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { markInvoicePaidSchema } from "@/lib/validations/invoice";

export const runtime = "nodejs";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ invoiceId: string }> }
    ) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
        return NextResponse.json(
            {
            message: "You must be logged in to update an invoice.",
            },
            { status: 401 }
        );
        }

        const { invoiceId } = await params;
        const body = await request.json();

        const validationResult = markInvoicePaidSchema.safeParse(body);

        if (!validationResult.success) {
        return NextResponse.json(
            {
            message: "Choose a valid payment method.",
            },
            { status: 400 }
        );
        }

        const user = await prisma.user.findUnique({
        where: {
            email: session.user.email.toLowerCase(),
        },
        select: {
            id: true,
        },
        });

        if (!user) {
        return NextResponse.json(
            {
            message: "Your account could not be found.",
            },
            { status: 404 }
        );
        }

        const membership = await prisma.businessMember.findFirst({
        where: {
            userId: user.id,
            role: "OWNER",
            status: "ACTIVE",
        },
        select: {
            businessId: true,
        },
        });

        if (!membership) {
        return NextResponse.json(
            {
            message: "No active business workspace was found.",
            },
            { status: 404 }
        );
        }

        const invoice = await prisma.invoice.findFirst({
        where: {
            id: invoiceId,
            businessId: membership.businessId,
        },
        select: {
            id: true,
            businessId: true,
            invoiceNumber: true,
            status: true,
            totalAmount: true,
        },
        });

        if (!invoice) {
        return NextResponse.json(
            {
            message: "This invoice could not be found.",
            },
            { status: 404 }
        );
        }

        if (!["PENDING", "SENT", "OVERDUE"].includes(invoice.status)) {
        return NextResponse.json(
            {
            message: `A ${invoice.status.toLowerCase()} invoice cannot be marked as paid.`,
            },
            { status: 400 }
        );
        }

        const paymentMethod = validationResult.data.method;
        const paidAt = new Date();

        const updatedInvoice = await prisma.$transaction(async (tx) => {
        const updated = await tx.invoice.update({
            where: {
            id: invoice.id,
            },
            data: {
            status: "PAID",
            paidAt,
            },
            select: {
            id: true,
            invoiceNumber: true,
            status: true,
            totalAmount: true,
            paidAt: true,
            },
        });

        await tx.payment.create({
            data: {
            invoiceId: invoice.id,
            provider: "MANUAL",
            method: paymentMethod,
            status: "SUCCEEDED",
            amount: invoice.totalAmount,
            paidAt,
            },
        });

        await tx.auditLog.create({
            data: {
            businessId: invoice.businessId,
            actorUserId: user.id,
            action: "INVOICE_PAID",
            entityType: "Invoice",
            entityId: invoice.id,
            beforeData: {
                status: invoice.status,
            },
            afterData: {
                status: "PAID",
                method: paymentMethod,
                paidAt: paidAt.toISOString(),
                totalAmount: Number(invoice.totalAmount),
            },
            },
        });

        return updated;
        });

        return NextResponse.json({
        message: `${updatedInvoice.invoiceNumber} has been marked as paid.`,
        invoice: {
            id: updatedInvoice.id,
            status: updatedInvoice.status,
            paidAt: updatedInvoice.paidAt,
        },
        });
    } catch (error) {
        console.error("Mark invoice paid error:", error);

        return NextResponse.json(
        {
            message: "Something went wrong while recording this payment.",
        },
        { status: 500 }
        );
    }
}