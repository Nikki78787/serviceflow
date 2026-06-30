import { notFound } from "next/navigation";

import prisma from "@/lib/prisma";
import PublicBookingForm from "@/features/public-booking/components/public-booking-form";

export default async function PublicBookingFormPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ serviceId?: string }>;
}) {
  const { slug } = await params;
  const { serviceId } = await searchParams;

  const business = await prisma.business.findUnique({
    where: {
      slug,
    },
    include: {
      services: {
        where: {
          isActive: true,
        },
        orderBy: {
          price: "asc",
        },
        select: {
          id: true,
          name: true,
          description: true,
          durationMinutes: true,
          price: true,
        },
      },
    },
  });

  if (!business || !business.isActive || !business.bookingEnabled) {
    notFound();
  }

  return (
    <PublicBookingForm
      business={{
        name: business.name,
        slug: business.slug,
        currency: business.currency,
        timezone: business.timezone,
        address: business.address,
        phone: business.phone,
      }}
      services={business.services.map((service) => ({
        ...service,
        price: Number(service.price),
      }))}
      initialServiceId={serviceId ?? ""}
    />
  );
}