import { z } from "zod";

export const createStaffSchema = z.object({
    fullName: z
        .string()
        .trim()
        .min(2, "Please enter the staff member's full name.")
        .max(100, "Name must be 100 characters or fewer."),

    email: z
        .string()
        .trim()
        .email("Please enter a valid email address.")
        .max(150, "Email must be 150 characters or fewer."),

    phone: z
        .string()
        .trim()
        .min(7, "Please enter a valid phone number.")
        .max(30, "Phone number must be 30 characters or fewer."),

    position: z
        .string()
        .trim()
        .min(2, "Please enter the staff member's position.")
        .max(100, "Position must be 100 characters or fewer."),
    });

export type CreateStaffInput = z.infer<typeof createStaffSchema>;