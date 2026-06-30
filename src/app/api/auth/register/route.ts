import { NextResponse } from "next/server";
import { hash } from "bcryptjs";

import prisma from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
    try {
    const body = await request.json();

    const validationResult = registerSchema.safeParse(body);

    if (!validationResult.success) {
        return NextResponse.json(
        {
            message:
            validationResult.error.issues[0]?.message ??
            "Please check your registration details.",
        },
        { status: 400 }
        );
    }

    const { name, email, password } = validationResult.data;
    const normalisedEmail = email.toLowerCase();

    const existingUser = await prisma.user.findUnique({
        where: {
        email: normalisedEmail,
        },
    });

    if (existingUser) {
        return NextResponse.json(
        {
            message: "An account already exists with this email address.",
        },
        { status: 409 }
        );
    }

    const passwordHash = await hash(password, 12);

    const user = await prisma.user.create({
        data: {
        name,
        email: normalisedEmail,
        passwordHash,
        },
        select: {
        id: true,
        name: true,
        email: true,
        },
    });

    return NextResponse.json(
        {
        message: "Account created successfully.",
        user,
        },
        { status: 201 }
    );
    } catch (error) {
    console.error("Registration error:", error);

    return NextResponse.json(
        {
        message: "Something went wrong while creating your account.",
        },
        { status: 500 }
    );
    }
}