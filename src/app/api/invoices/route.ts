import { NextResponse } from "next/server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { createInvoiceSchema } from "@/lib/validations/invoice";

export const runtime = "nodejs";

export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
        return NextResponse.json(
            {
            message: "You must be logged in to create an invoice.",
            },
            { status: 401 }
        );
        }

        const body = await request.json();

        const validationResult = createInvoiceSchema.safeParse(body);

        if (!validationResult.success) {
        return NextResponse.json(
            {
            message:
                validationResult.error.issues[0]?.message ??
                "Choose a valid completed appointment.",
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

        const appointment = await prisma.appointment.findFirst({
        where: {
            id: validationResult.data.appointmentId,
            businessId: membership.businessId,
            status: "COMPLETED",
        },
        include: {
            customer: {
            select: {
                id: true,
                fullName: true,
            },
            },
            service: {
            select: {
                id: true,
                name: true,
            },
            },
            invoice: {
            select: {
                id: true,
                invoiceNumber: true,
            },
            },
        },
        });

        if (!appointment) {
        return NextResponse.json(
            {
            message:
                "Only completed appointments in your workspace can be invoiced.",
            },
            { status: 404 }
        );
        }

        if (appointment.invoice) {
        return NextResponse.json(
            {
            message: `This appointment already has invoice ${appointment.invoice.invoiceNumber}.`,
            },
            { status: 409 }
        );
        }

        const issueDate = new Date();

        const dueDate = new Date(issueDate);
        dueDate.setDate(dueDate.getDate() + 7);

        const startOfYear = new Date(issueDate.getFullYear(), 0, 1);

        const startOfNextYear = new Date(issueDate.getFullYear() + 1, 0, 1);

        const invoice = await prisma.$transaction(async (tx) => {
        const invoiceCount = await tx.invoice.count({
            where: {
            businessId: membership.businessId,
            issueDate: {
                gte: startOfYear,
                lt: startOfNextYear,
            },
            },
        });

        const invoiceNumber = `INV-${issueDate.getFullYear()}-${String(
            invoiceCount + 1
        ).padStart(4, "0")}`;

        const createdInvoice = await tx.invoice.create({
            data: {
            businessId: membership.businessId,
            customerId: appointment.customerId,
            appointmentId: appointment.id,
            invoiceNumber,
            issueDate,
            dueDate,
            subtotal: appointment.finalPrice,
            taxAmount: 0,
            totalAmount: appointment.finalPrice,
            status: "PENDING",

            notes: `Invoice created from completed appointment: ${appointment.service.name}.`,

            items: {
                create: {
                serviceId: appointment.serviceId,
                description: appointment.service.name,
                quantity: 1,
                unitPrice: appointment.finalPrice,
                totalPrice: appointment.finalPrice,
                },
            },
            },

            include: {
            customer: {
                select: {
                fullName: true,
                },
            },
            items: true,
            },
        });

        await tx.auditLog.create({
            data: {
            businessId: membership.businessId,
            actorUserId: user.id,
            action: "INVOICE_CREATED",
            entityType: "Invoice",
            entityId: createdInvoice.id,
            afterData: {
                invoiceNumber: createdInvoice.invoiceNumber,
                appointmentId: appointment.id,
                customerName: appointment.customer.fullName,
                totalAmount: Number(createdInvoice.totalAmount),
                status: createdInvoice.status,
            },
            },
        });

        return createdInvoice;
        });

        return NextResponse.json(
        {
            message: "Invoice created successfully.",
            invoice: {
            id: invoice.id,
            invoiceNumber: invoice.invoiceNumber,
            status: invoice.status,
            totalAmount: Number(invoice.totalAmount),
            },
        },
        { status: 201 }
        );
    } catch (error) {
        console.error("Create invoice error:", error);

        return NextResponse.json(
        {
            message: "Something went wrong while creating the invoice.",
        },
        { status: 500 }
        );
    }
}