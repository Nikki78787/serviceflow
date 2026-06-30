import { z } from "zod";

export const createBusinessSchema = z.object({
    name: z
    .string()
    .trim()
    .min(2, "Business name must contain at least 2 characters.")
    .max(100, "Business name must be 100 characters or fewer."),

    email: z
    .string()
    .trim()
    .email("Enter a valid business email address.")
    .max(254)
    .optional(),

    phone: z
    .string()
    .trim()
    .min(6, "Enter a valid phone number.")
    .max(30)
    .optional(),

    address: z
    .string()
    .trim()
    .max(250, "Address must be 250 characters or fewer.")
    .optional(),

    description: z
    .string()
    .trim()
    .max(1000, "Description must be 1000 characters or fewer.")
    .optional(),
});