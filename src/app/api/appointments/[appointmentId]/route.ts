import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

const updateAppointmentSchema = z.object({
    status: z.enum([
        "CONFIRMED",
        "CHECKED_IN",
        "COMPLETED",
        "CANCELLED",
    ]),
    });

    const allowedTransitions = {
    PENDING: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["CHECKED_IN", "CANCELLED"],
    CHECKED_IN: ["COMPLETED"],
    COMPLETED: [],
    CANCELLED: [],
    NO_SHOW: [],
    } as const;

    export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ appointmentId: string }> }
    ) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
        return NextResponse.json(
            { message: "You must be logged in to update a booking." },
            { status: 401 }
        );
        }

        const { appointmentId } = await params;
        const body = await request.json();

        const validationResult = updateAppointmentSchema.safeParse(body);

        if (!validationResult.success) {
        return NextResponse.json(
            { message: "Choose a valid booking status." },
            { status: 400 }
        );
        }

        const requestedStatus = validationResult.data.status;

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
            { message: "Your account could not be found." },
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
            { message: "No active business workspace was found." },
            { status: 404 }
        );
        }

        const appointment = await prisma.appointment.findFirst({
        where: {
            id: appointmentId,
            businessId: membership.businessId,
        },
        select: {
            id: true,
            businessId: true,
            customerId: true,
            serviceId: true,
            staffMemberId: true,
            startTime: true,
            endTime: true,
            status: true,
            finalPrice: true,
        },
        });

        if (!appointment) {
        return NextResponse.json(
            { message: "This booking could not be found." },
            { status: 404 }
        );
        }

        const permittedStatuses = allowedTransitions[appointment.status];

        if (!permittedStatuses.includes(requestedStatus as never)) {
        return NextResponse.json(
            {
            message: `You cannot change a ${appointment.status.replace(
                "_",
                " "
            )} booking to ${requestedStatus.replace("_", " ")}.`,
            },
            { status: 400 }
        );
        }

        const beforeData = {
        status: appointment.status,
        startTime: appointment.startTime.toISOString(),
        endTime: appointment.endTime.toISOString(),
        finalPrice: Number(appointment.finalPrice),
        };

        const updatedAppointment = await prisma.$transaction(async (tx) => {
        const updated = await tx.appointment.update({
            where: {
            id: appointment.id,
            },
            data: {
            status: requestedStatus,
            },
            select: {
            id: true,
            status: true,
            startTime: true,
            endTime: true,
            finalPrice: true,
            },
        });

        await tx.auditLog.create({
            data: {
            businessId: appointment.businessId,
            actorUserId: user.id,
            action: `APPOINTMENT_${requestedStatus}`,
            entityType: "Appointment",
            entityId: appointment.id,
            beforeData,
            afterData: {
                status: updated.status,
                startTime: updated.startTime.toISOString(),
                endTime: updated.endTime.toISOString(),
                finalPrice: Number(updated.finalPrice),
            },
            },
        });

        return updated;
        });

        return NextResponse.json({
        message: `Booking marked as ${updatedAppointment.status
            .replace("_", " ")
            .toLowerCase()}.`,
        appointment: updatedAppointment,
        });
    } catch (error) {
        console.error("Update appointment error:", error);

        return NextResponse.json(
        { message: "Something went wrong while updating this booking." },
        { status: 500 }
        );
    }
}