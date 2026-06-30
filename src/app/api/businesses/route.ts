import { NextResponse } from "next/server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { createBusinessSchema } from "@/lib/validations/business";

export const runtime = "nodejs";

function createSlugBase(value: string) {
    const slug = value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    return slug || "business";
    }

    async function createAvailableSlug(businessName: string) {
    const baseSlug = createSlugBase(businessName);

    let candidateSlug = baseSlug;
    let counter = 2;

    while (
        await prisma.business.findUnique({
        where: {
            slug: candidateSlug,
        },
        select: {
            id: true,
        },
        })
    ) {
        candidateSlug = `${baseSlug}-${counter}`;
        counter += 1;
    }

    return candidateSlug;
    }

    export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
        return NextResponse.json(
            {
            message: "You must be logged in to create a business.",
            },
            { status: 401 }
        );
        }

        const body = await request.json();

        const validationResult = createBusinessSchema.safeParse(body);

        if (!validationResult.success) {
        return NextResponse.json(
            {
            message:
                validationResult.error.issues[0]?.message ??
                "Please check your business details.",
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

        const existingOwnerMembership = await prisma.businessMember.findFirst({
        where: {
            userId: user.id,
            role: "OWNER",
            status: "ACTIVE",
        },
        include: {
            business: {
            select: {
                id: true,
                name: true,
            },
            },
        },
        });

        if (existingOwnerMembership) {
        return NextResponse.json(
            {
            message: `You already own ${existingOwnerMembership.business.name}.`,
            },
            { status: 409 }
        );
        }

        const data = validationResult.data;
        const slug = await createAvailableSlug(data.name);

        const business = await prisma.business.create({
        data: {
            name: data.name,
            slug,
            email: data.email ?? null,
            phone: data.phone ?? null,
            address: data.address ?? null,
            description: data.description ?? null,

            members: {
            create: {
                userId: user.id,
                role: "OWNER",
            },
            },
        },

        select: {
            id: true,
            name: true,
            slug: true,
        },
        });

        return NextResponse.json(
        {
            message: "Business workspace created successfully.",
            business,
        },
        { status: 201 }
        );
    } catch (error) {
        console.error("Create business error:", error);

        return NextResponse.json(
        {
            message: "Something went wrong while creating your business.",
        },
        { status: 500 }
        );
    }
}