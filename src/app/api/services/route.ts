import { NextResponse } from "next/server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { createServiceSchema } from "@/lib/validations/service";

export const runtime = "nodejs";

export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
        return NextResponse.json(
            {
            message: "You must be logged in to create a service.",
            },
            { status: 401 }
        );
        }

        const body = await request.json();

        const validationResult = createServiceSchema.safeParse(body);

        if (!validationResult.success) {
        return NextResponse.json(
            {
            message:
                validationResult.error.issues[0]?.message ??
                "Please check your service details.",
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

        const data = validationResult.data;

        const existingService = await prisma.service.findFirst({
        where: {
            businessId: membership.businessId,
            name: data.name,
        },
        select: {
            id: true,
        },
        });

        if (existingService) {
        return NextResponse.json(
            {
            message: "A service with this name already exists.",
            },
            { status: 409 }
        );
        }

        const service = await prisma.service.create({
        data: {
            businessId: membership.businessId,
            name: data.name,
            description: data.description ?? null,
            durationMinutes: data.durationMinutes,
            price: data.price,
        },
        select: {
            id: true,
            name: true,
            durationMinutes: true,
            price: true,
            isActive: true,
        },
        });

        return NextResponse.json(
        {
            message: "Service created successfully.",
            service,
        },
        { status: 201 }
        );
    } catch (error) {
        console.error("Create service error:", error);

        return NextResponse.json(
        {
            message: "Something went wrong while creating your service.",
        },
        { status: 500 }
        );
    }
}