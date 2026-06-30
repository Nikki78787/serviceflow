import { redirect } from "next/navigation";

import { auth } from "@/auth";
import BusinessOnboardingForm from "@/features/businesses/components/business-onboarding-form";

export default async function OnboardingPage() {
    const session = await auth();

    if (!session?.user?.email) {
        redirect("/login");
    }

    return <BusinessOnboardingForm userName={session.user.name ?? ""} />;
}