import { NextResponse } from "next/server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { createStaffSchema } from "@/lib/validations/staff";

export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
        return NextResponse.json(
            {
            message: "You must be logged in to add staff members.",
            },
            { status: 401 }
        );
        }

        const body = await request.json();
        const parsedData = createStaffSchema.safeParse(body);

        if (!parsedData.success) {
        return NextResponse.json(
            {
            message: "Please check the staff details and try again.",
            errors: parsedData.error.flatten().fieldErrors,
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

        const ownerMembership = await prisma.businessMember.findFirst({
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

        if (!ownerMembership) {
        return NextResponse.json(
            {
            message: "No active business workspace was found.",
            },
            { status: 404 }
        );
        }

        const email = parsedData.data.email.toLowerCase();

        const existingStaff = await prisma.staff.findFirst({
        where: {
            businessId: ownerMembership.businessId,
            email,
        },
        select: {
            id: true,
        },
        });

        if (existingStaff) {
        return NextResponse.json(
            {
            message: "A staff profile with this email already exists.",
            },
            { status: 409 }
        );
        }

        const staff = await prisma.$transaction(async (transaction) => {
        const createdStaff = await transaction.staff.create({
            data: {
            businessId: ownerMembership.businessId,
            fullName: parsedData.data.fullName,
            email,
            phone: parsedData.data.phone,
            position: parsedData.data.position,
            isActive: true,
            },
        });

        await transaction.auditLog.create({
            data: {
            businessId: ownerMembership.businessId,
            actorUserId: user.id,
            action: "STAFF_PROFILE_CREATED",
            entityType: "STAFF",
            entityId: createdStaff.id,
            afterData: {
                fullName: createdStaff.fullName,
                email: createdStaff.email,
                phone: createdStaff.phone,
                position: createdStaff.position,
            },
            },
        });

        return createdStaff;
        });

        return NextResponse.json(
        {
            message: "Staff profile created successfully.",
            staff,
        },
        { status: 201 }
        );
    } catch (error) {
        console.error("Create staff profile error:", error);

        return NextResponse.json(
        {
            message: "Something went wrong while creating the staff profile.",
        },
        { status: 500 }
        );
    }
}