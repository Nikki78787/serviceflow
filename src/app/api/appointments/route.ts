import { NextResponse } from "next/server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { createAppointmentSchema } from "@/lib/validations/appointment";

export const runtime = "nodejs";

const blockingStatuses = ["PENDING", "CONFIRMED", "CHECKED_IN"] as const;

export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
        return NextResponse.json(
            {
            message: "You must be logged in to create a booking.",
            },
            { status: 401 }
        );
        }

        const body = await request.json();

        const validationResult = createAppointmentSchema.safeParse(body);

        if (!validationResult.success) {
        return NextResponse.json(
            {
            message:
                validationResult.error.issues[0]?.message ??
                "Please check the booking details.",
            },
            { status: 400 }
        );
        }

        const data = validationResult.data;

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
            id: true,
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
            message: "Choose an appointment time in the future.",
            },
            { status: 400 }
        );
        }

        const [customer, service] = await Promise.all([
        prisma.customer.findFirst({
            where: {
            id: data.customerId,
            businessId: membership.businessId,
            },
            select: {
            id: true,
            fullName: true,
            },
        }),

        prisma.service.findFirst({
            where: {
            id: data.serviceId,
            businessId: membership.businessId,
            isActive: true,
            },
            select: {
            id: true,
            name: true,
            durationMinutes: true,
            price: true,
            },
        }),
        ]);

        if (!customer) {
        return NextResponse.json(
            {
            message: "That customer could not be found in your workspace.",
            },
            { status: 404 }
        );
        }

        if (!service) {
        return NextResponse.json(
            {
            message: "That service is unavailable or could not be found.",
            },
            { status: 404 }
        );
        }

        const endTime = new Date(
        startTime.getTime() + service.durationMinutes * 60 * 1000
        );

        const conflictingAppointment = await prisma.appointment.findFirst({
        where: {
            businessId: membership.businessId,
            staffMemberId: membership.id,
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
        return NextResponse.json(
            {
            message:
                "This time overlaps with an existing booking. Choose another time.",
            },
            { status: 409 }
        );
        }

        const appointment = await prisma.appointment.create({
        data: {
            businessId: membership.businessId,
            customerId: customer.id,
            serviceId: service.id,
            staffMemberId: membership.id,
            startTime,
            endTime,
            finalPrice: service.price,
            customerNotes: data.customerNotes ?? null,
            status: "PENDING",
            bookingSource: "BUSINESS_DASHBOARD",
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

        return NextResponse.json(
        {
            message: "Booking created successfully.",
            appointment,
        },
        { status: 201 }
        );
    } catch (error) {
        console.error("Create appointment error:", error);

        return NextResponse.json(
        {
            message: "Something went wrong while creating the booking.",
        },
        { status: 500 }
        );
    }
}