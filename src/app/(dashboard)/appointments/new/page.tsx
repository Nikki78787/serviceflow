import { redirect } from "next/navigation";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import CreateAppointmentForm from "@/features/appointments/components/create-appointment-form";

export default async function NewAppointmentPage() {
    const session = await auth();

    if (!session?.user?.email) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: {
        email: session.user.email.toLowerCase(),
        },
        select: {
        memberships: {
            where: {
            role: "OWNER",
            status: "ACTIVE",
            },
            orderBy: {
            createdAt: "asc",
            },
            take: 1,
            include: {
            business: true,
            },
        },
        },
    });

    if (!user) {
        redirect("/login");
    }

    const membership = user.memberships[0];

    if (!membership) {
        redirect("/onboarding");
    }

    const business = membership.business;

    const [services, customers, staffProfiles] = await Promise.all([
        prisma.service.findMany({
        where: {
            businessId: business.id,
            isActive: true,
        },
        orderBy: {
            name: "asc",
        },
        select: {
            id: true,
            name: true,
            durationMinutes: true,
            price: true,
        },
        }),

        prisma.customer.findMany({
        where: {
            businessId: business.id,
        },
        orderBy: {
            fullName: "asc",
        },
        select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
        },
        }),

        prisma.staff.findMany({
        where: {
            businessId: business.id,
            isActive: true,
        },
        orderBy: {
            fullName: "asc",
        },
        select: {
            id: true,
            fullName: true,
            position: true,
        },
        }),
    ]);

    return (
        <CreateAppointmentForm
        businessName={business.name}
        services={services.map((service) => ({
            ...service,
            price: Number(service.price),
        }))}
        customers={customers}
        staffProfiles={staffProfiles}
        />
    );
}