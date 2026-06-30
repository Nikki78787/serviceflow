import { z } from "zod";

export const createInvoiceSchema = z.object({
    appointmentId: z.string().min(1, "Choose a completed appointment."),
    });

    export const markInvoicePaidSchema = z.object({
    method: z.enum([
        "CASH",
        "BANK_TRANSFER",
        "CARD",
        "FPX",
        "E_WALLET",
    ]),
});