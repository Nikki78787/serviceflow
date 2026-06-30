import { NextResponse } from "next/server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { updateStaffAvailabilitySchema } from "@/lib/validations/staff-availability";

async function getCurrentOwnerBusinessId() {
    const session = await auth();

    if (!session?.user?.email) {
        return null;
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
        return null;
    }

    const membership = await prisma.businessMember.findFirst({
        where: {
        userId: user.id,
        role: "OWNER",
        status: "ACTIVE",
        },
        orderBy: {
        createdAt: "asc",
        },
        select: {
        businessId: true,
        },
    });

    if (!membership) {
        return null;
    }

    return {
        userId: user.id,
        businessId: membership.businessId,
    };
    }

    export async function GET(
    _request: Request,
    { params }: { params: Promise<{ staffId: string }> }
    ) {
    try {
        const currentOwner = await getCurrentOwnerBusinessId();

        if (!currentOwner) {
        return NextResponse.json(
            {
            message: "You must be logged in as a business owner.",
            },
            { status: 401 }
        );
        }

        const { staffId } = await params;

        const staff = await prisma.staff.findFirst({
        where: {
            id: staffId,
            businessId: currentOwner.businessId,
        },
        select: {
            id: true,
            fullName: true,
            position: true,
            isActive: true,
            availability: {
            orderBy: {
                dayOfWeek: "asc",
            },
            select: {
                id: true,
                dayOfWeek: true,
                startTime: true,
                endTime: true,
                isAvailable: true,
            },
            },
        },
        });

        if (!staff) {
        return NextResponse.json(
            {
            message: "Staff profile not found.",
            },
            { status: 404 }
        );
        }

        return NextResponse.json({
        staff,
        });
    } catch (error) {
        console.error("Get staff availability error:", error);

        return NextResponse.json(
        {
            message: "Something went wrong while loading staff availability.",
        },
        { status: 500 }
        );
    }
    }

    export async function PUT(
    request: Request,
    { params }: { params: Promise<{ staffId: string }> }
    ) {
    try {
        const currentOwner = await getCurrentOwnerBusinessId();

        if (!currentOwner) {
        return NextResponse.json(
            {
            message: "You must be logged in as a business owner.",
            },
            { status: 401 }
        );
        }

        const { staffId } = await params;
        const body = await request.json();

        const parsedData = updateStaffAvailabilitySchema.safeParse(body);

        if (!parsedData.success) {
        return NextResponse.json(
            {
            message: "Please check the availability details and try again.",
            errors: parsedData.error.flatten().fieldErrors,
            },
            { status: 400 }
        );
        }

        const staff = await prisma.staff.findFirst({
        where: {
            id: staffId,
            businessId: currentOwner.businessId,
        },
        select: {
            id: true,
            fullName: true,
        },
        });

        if (!staff) {
        return NextResponse.json(
            {
            message: "Staff profile not found.",
            },
            { status: 404 }
        );
        }

        const availability = await prisma.$transaction(async (transaction) => {
        await transaction.staffAvailability.deleteMany({
            where: {
            staffId: staff.id,
            },
        });

        await transaction.staffAvailability.createMany({
            data: parsedData.data.weeklyAvailability.map((day) => ({
            staffId: staff.id,
            dayOfWeek: day.dayOfWeek,
            startTime: day.startTime,
            endTime: day.endTime,
            isAvailable: day.isAvailable,
            })),
        });

        await transaction.auditLog.create({
            data: {
            businessId: currentOwner.businessId,
            actorUserId: currentOwner.userId,
            action: "STAFF_AVAILABILITY_UPDATED",
            entityType: "STAFF",
            entityId: staff.id,
            afterData: {
                staffName: staff.fullName,
                weeklyAvailability: parsedData.data.weeklyAvailability,
            },
            },
        });

        return transaction.staffAvailability.findMany({
            where: {
            staffId: staff.id,
            },
            orderBy: {
            dayOfWeek: "asc",
            },
        });
        });

        return NextResponse.json({
        message: "Staff availability saved successfully.",
        availability,
        });
    } catch (error) {
        console.error("Update staff availability error:", error);

        return NextResponse.json(
        {
            message: "Something went wrong while saving staff availability.",
        },
        { status: 500 }
        );
    }
}