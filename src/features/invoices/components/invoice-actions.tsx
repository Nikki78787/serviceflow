"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, FilePlus2, LoaderCircle } from "lucide-react";

type CreateInvoiceButtonProps = {
    appointmentId: string;
    };

    type MarkInvoicePaidButtonProps = {
    invoiceId: string;
    };

    export function CreateInvoiceButton({
    appointmentId,
    }: CreateInvoiceButtonProps) {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    async function createInvoice() {
        setIsLoading(true);
        setErrorMessage("");

        try {
        const response = await fetch("/api/invoices", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            appointmentId,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            setErrorMessage(data.message ?? "Unable to create the invoice.");
            return;
        }

        router.refresh();
        } catch {
        setErrorMessage("A network error occurred. Please try again.");
        } finally {
        setIsLoading(false);
        }
    }

    return (
        <div>
        <button
            type="button"
            onClick={createInvoice}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-xl bg-[#7558f7] px-4 py-3 text-sm font-bold text-white shadow-[0_12px_22px_rgba(117,88,247,0.22)] transition hover:-translate-y-0.5 hover:bg-[#6248e7] disabled:cursor-not-allowed disabled:opacity-60"
        >
            {isLoading ? (
            <LoaderCircle className="size-4 animate-spin" />
            ) : (
            <FilePlus2 className="size-4" />
            )}
            {isLoading ? "Creating invoice..." : "Create invoice"}
        </button>

        {errorMessage ? (
            <p className="mt-2 max-w-xs text-xs font-medium text-[#c55342]">
            {errorMessage}
            </p>
        ) : null}
        </div>
    );
    }

    export function MarkInvoicePaidButton({
    invoiceId,
    }: MarkInvoicePaidButtonProps) {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    async function markAsPaid() {
        const confirmed = window.confirm(
        "Mark this invoice as paid by cash? A payment record will be created."
        );

        if (!confirmed) {
        return;
        }

        setIsLoading(true);
        setErrorMessage("");

        try {
        const response = await fetch(`/api/invoices/${invoiceId}/pay`, {
            method: "PATCH",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            method: "CASH",
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            setErrorMessage(data.message ?? "Unable to mark this invoice as paid.");
            return;
        }

        router.refresh();
        } catch {
        setErrorMessage("A network error occurred. Please try again.");
        } finally {
        setIsLoading(false);
        }
    }

    return (
        <div>
        <button
            type="button"
            onClick={markAsPaid}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-lg bg-[#e4f9ec] px-3 py-2 text-xs font-bold text-[#277246] transition hover:bg-[#d5f5e2] disabled:cursor-not-allowed disabled:opacity-60"
        >
            {isLoading ? (
            <LoaderCircle className="size-3.5 animate-spin" />
            ) : (
            <CheckCircle2 className="size-3.5" />
            )}
            {isLoading ? "Saving..." : "Mark paid"}
        </button>

        {errorMessage ? (
            <p className="mt-2 max-w-xs text-xs font-medium text-[#c55342]">
            {errorMessage}
            </p>
        ) : null}
        </div>
    );
}