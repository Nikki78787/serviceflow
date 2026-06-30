import { z } from "zod";

const optionalNotes = z.preprocess(
  (value) => {
    if (typeof value === "string" && value.trim() === "") {
      return undefined;
    }

    return value;
  },
  z
    .string()
    .trim()
    .max(1000, "Notes must be 1000 characters or fewer.")
    .optional()
);

export const createAppointmentSchema = z.object({
  customerId: z.string().min(1, "Choose a customer."),
  serviceId: z.string().min(1, "Choose a service."),
  staffProfileId: z.string().min(1, "Choose a staff member."),
  startTime: z.string().min(1, "Choose an appointment date and time."),
  customerNotes: optionalNotes,
});