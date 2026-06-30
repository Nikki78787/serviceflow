import { z } from "zod";

const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

export const availabilityDaySchema = z
    .object({
        dayOfWeek: z.number().int().min(0).max(6),
        isAvailable: z.boolean(),
        startTime: z.string().regex(timePattern, "Use a valid start time."),
        endTime: z.string().regex(timePattern, "Use a valid end time."),
    })
    .refine((data) => data.endTime > data.startTime, {
        message: "End time must be after start time.",
        path: ["endTime"],
    });

    export const updateStaffAvailabilitySchema = z.object({
    weeklyAvailability: z
        .array(availabilityDaySchema)
        .length(7, "Please provide all seven days of the week.")
        .refine(
        (days) => new Set(days.map((day) => day.dayOfWeek)).size === 7,
        "Each day can only appear once."
        ),
    });

    export type UpdateStaffAvailabilityInput = z.infer<
    typeof updateStaffAvailabilitySchema
    >;