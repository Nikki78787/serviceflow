import { NextResponse } from "next/server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { createCustomerSchema } from "@/lib/validations/customer";

export const runtime = "nodejs";

export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
        return NextResponse.json(
            {
            message: "You must be logged in to create a customer.",
            },
            { status: 401 }
        );
        }

        const body = await request.json();

        const validationResult = createCustomerSchema.safeParse(body);

        if (!validationResult.success) {
        return NextResponse.json(
            {
            message:
                validationResult.error.issues[0]?.message ??
                "Please check the customer details.",
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
        const normalisedEmail = data.email?.toLowerCase();

        if (normalisedEmail) {
        const existingCustomer = await prisma.customer.findFirst({
            where: {
            businessId: membership.businessId,
            email: normalisedEmail,
            },
            select: {
            id: true,
            },
        });

        if (existingCustomer) {
            return NextResponse.json(
            {
                message:
                "A customer with this email address already exists in your workspace.",
            },
            { status: 409 }
            );
        }
        }

        const customer = await prisma.customer.create({
        data: {
            businessId: membership.businessId,
            fullName: data.fullName,
            email: normalisedEmail ?? null,
            phone: data.phone ?? null,
            notes: data.notes ?? null,
        },
        select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
        },
        });

        return NextResponse.json(
        {
            message: "Customer created successfully.",
            customer,
        },
        { status: 201 }
        );
    } catch (error) {
        console.error("Create customer error:", error);

        return NextResponse.json(
        {
            message: "Something went wrong while creating the customer.",
        },
        { status: 500 }
        );
    }
}