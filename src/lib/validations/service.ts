import { z } from "zod";

const optionalDescription = z.preprocess(
    (value) => {
        if (typeof value === "string" && value.trim() === "") {
        return undefined;
        }

        return value;
    },
    z.string().trim().max(500, "Description must be 500 characters or fewer.").optional()
    );

    export const createServiceSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Service name must contain at least 2 characters.")
        .max(100, "Service name must be 100 characters or fewer."),

    description: optionalDescription,

    durationMinutes: z
        .coerce
        .number()
        .int("Duration must be a whole number.")
        .min(5, "Service duration must be at least 5 minutes.")
        .max(1440, "Service duration cannot exceed 24 hours."),

    price: z.coerce
        .number()
        .positive("Price must be greater than zero.")
        .max(999999.99, "Price is too large."),
});