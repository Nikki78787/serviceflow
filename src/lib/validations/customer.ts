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

    export const createCustomerSchema = z.object({
    fullName: z
        .string()
        .trim()
        .min(2, "Customer name must contain at least 2 characters.")
        .max(100, "Customer name must be 100 characters or fewer."),

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

    notes: optionalText(
        1000,
        "Notes must be 1000 characters or fewer."
    ),
});