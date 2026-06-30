import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { publicBookingSchema } from "@/lib/validations/public-booking";

export const runtime = "nodejs";

const blockingStatuses = ["PENDING", "CONFIRMED", "CHECKED_IN"] as const;

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const validationResult = publicBookingSchema.safeParse(body);

        if (!validationResult.success) {
        return NextResponse.json(
            {
            message:
                validationResult.error.issues[0]?.message ??
                "Please check your booking details.",
            },
            { status: 400 }
        );
        }

        const data = validationResult.data;

        const business = await prisma.business.findFirst({
        where: {
            slug: data.businessSlug,
            isActive: true,
            bookingEnabled: true,
        },
        select: {
            id: true,
            name: true,
        },
        });

        if (!business) {
        return NextResponse.json(
            {
            message: "This business is not currently accepting online bookings.",
            },
            { status: 404 }
        );
        }

        const service = await prisma.service.findFirst({
        where: {
            id: data.serviceId,
            businessId: business.id,
            isActive: true,
        },
        select: {
            id: true,
            name: true,
            durationMinutes: true,
            price: true,
        },
        });

        if (!service) {
        return NextResponse.json(
            {
            message: "This service is no longer available for booking.",
            },
            { status: 404 }
        );
        }

        const ownerMembership = await prisma.businessMember.findFirst({
        where: {
            businessId: business.id,
            role: "OWNER",
            status: "ACTIVE",
        },
        orderBy: {
            createdAt: "asc",
        },
        select: {
            id: true,
        },
        });

        if (!ownerMembership) {
        return NextResponse.json(
            {
            message: "This business is not ready to accept bookings yet.",
            },
            { status: 400 }
        );
        }

        const startTime = new Date(data.startTime);

        if (Number.isNaN(startTime.getTime())) {
        return NextResponse.json(
            {
            message: "Choose a valid appointment date and time.",
            },
            { status: 400 }
        );
        }

        if (startTime <= new Date()) {
        return NextResponse.json(
            {
            message: "Please choose a future appointment time.",
            },
            { status: 400 }
        );
        }

        const endTime = new Date(
        startTime.getTime() + service.durationMinutes * 60 * 1000
        );

        const normalisedEmail = data.email?.toLowerCase();

        const appointment = await prisma.$transaction(async (tx) => {
        const conflictingAppointment = await tx.appointment.findFirst({
            where: {
            businessId: business.id,
            staffMemberId: ownerMembership.id,
            startTime: {
                lt: endTime,
            },
            endTime: {
                gt: startTime,
            },
            status: {
                in: [...blockingStatuses],
            },
            },
            select: {
            id: true,
            },
        });

        if (conflictingAppointment) {
            throw new Error("TIME_CONFLICT");
        }

        let customerId: string;

        if (normalisedEmail) {
            const existingCustomer = await tx.customer.findFirst({
            where: {
                businessId: business.id,
                email: normalisedEmail,
            },
            select: {
                id: true,
            },
            });

            if (existingCustomer) {
            customerId = existingCustomer.id;
            } else {
            const newCustomer = await tx.customer.create({
                data: {
                businessId: business.id,
                fullName: data.fullName,
                email: normalisedEmail,
                phone: data.phone ?? null,
                notes: data.customerNotes ?? null,
                },
                select: {
                id: true,
                },
            });

            customerId = newCustomer.id;
            }
        } else {
            const newCustomer = await tx.customer.create({
            data: {
                businessId: business.id,
                fullName: data.fullName,
                phone: data.phone ?? null,
                notes: data.customerNotes ?? null,
            },
            select: {
                id: true,
            },
            });

            customerId = newCustomer.id;
        }

        const createdAppointment = await tx.appointment.create({
            data: {
            businessId: business.id,
            customerId,
            serviceId: service.id,
            staffMemberId: ownerMembership.id,
            startTime,
            endTime,
            finalPrice: service.price,
            customerNotes: data.customerNotes ?? null,
            status: "PENDING",
            bookingSource: "CUSTOMER_PORTAL",
            },
            select: {
            id: true,
            startTime: true,
            endTime: true,
            status: true,
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
            },
        });

        await tx.auditLog.create({
            data: {
            businessId: business.id,
            action: "PUBLIC_BOOKING_CREATED",
            entityType: "Appointment",
            entityId: createdAppointment.id,
            afterData: {
                source: "CUSTOMER_PORTAL",
                status: createdAppointment.status,
                customerName: createdAppointment.customer.fullName,
                serviceName: createdAppointment.service.name,
                startTime: createdAppointment.startTime.toISOString(),
                endTime: createdAppointment.endTime.toISOString(),
            },
            },
        });

        return createdAppointment;
        });

        return NextResponse.json(
        {
            message: "Your booking request has been received.",
            appointment: {
            id: appointment.id,
            customerName: appointment.customer.fullName,
            serviceName: appointment.service.name,
            startTime: appointment.startTime,
            endTime: appointment.endTime,
            status: appointment.status,
            },
        },
        { status: 201 }
        );
    } catch (error) {
        if (error instanceof Error && error.message === "TIME_CONFLICT") {
        return NextResponse.json(
            {
            message:
                "That time is already booked. Please choose another appointment time.",
            },
            { status: 409 }
        );
        }

        console.error("Public booking error:", error);

        return NextResponse.json(
        {
            message: "Something went wrong while creating your booking.",
        },
        { status: 500 }
        );
    }
}