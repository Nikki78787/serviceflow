import { z } from "zod";

const optionalText = (maxLength: number, message: string) =>
    z.preprocess(
        (value) => {
        if (typeof value === "string" && value.trim() === "") {
            return undefined;
        }

        return value;
        },
        z.string().trim().max(maxLength, message).optional()
    );

    export const publicBookingSchema = z.object({
    businessSlug: z
        .string()
        .trim()
        .min(1, "Business booking link is invalid."),

    serviceId: z.string().min(1, "Choose a service."),

    fullName: z
        .string()
        .trim()
        .min(2, "Please enter your full name.")
        .max(100, "Name must be 100 characters or fewer."),

    email: z.preprocess(
        (value) => {
        if (typeof value === "string" && value.trim() === "") {
            return undefined;
        }

        return value;
        },
        z
        .string()
        .trim()
        .email("Enter a valid email address.")
        .max(254)
        .optional()
    ),

    phone: optionalText(
        30,
        "Phone number must be 30 characters or fewer."
    ),

    startTime: z.string().min(1, "Choose an appointment date and time."),

    customerNotes: optionalText(
        1000,
        "Notes must be 1000 characters or fewer."
    ),
});