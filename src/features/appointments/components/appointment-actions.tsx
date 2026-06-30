"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Check,
    CircleCheckBig,
    LoaderCircle,
    UserCheck,
    X,
    } from "lucide-react";

    type AppointmentActionsProps = {
    appointmentId: string;
    status: string;
    };

    const statusStyles: Record<string, string> = {
    PENDING: "bg-[#fff0ed] text-[#d9654d]",
    CONFIRMED: "bg-[#e8f2ff] text-[#2d70d4]",
    CHECKED_IN: "bg-[#eeeaff] text-[#7558f7]",
    COMPLETED: "bg-[#e4f9ec] text-[#277246]",
    CANCELLED: "bg-[#f2eff7] text-[#777385]",
    NO_SHOW: "bg-[#f2eff7] text-[#777385]",
    };

    function formatStatus(status: string) {
    return status
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
    }

    export default function AppointmentActions({
    appointmentId,
    status,
    }: AppointmentActionsProps) {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    async function updateStatus(nextStatus: string) {
        if (nextStatus === "CANCELLED") {
        const confirmed = window.confirm(
            "Cancel this booking? This action cannot be undone from the booking workflow."
        );

        if (!confirmed) {
            return;
        }
        }

        setIsLoading(true);
        setErrorMessage("");

        try {
        const response = await fetch(`/api/appointments/${appointmentId}`, {
            method: "PATCH",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            status: nextStatus,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            setErrorMessage(data.message ?? "Unable to update this booking.");
            return;
        }

        router.refresh();
        } catch {
        setErrorMessage("A network error occurred. Please try again.");
        } finally {
        setIsLoading(false);
        }
    }

    const badgeClass =
        statusStyles[status] ?? "bg-[#f2eff7] text-[#777385]";

    return (
        <div className="flex flex-col items-start gap-2 sm:items-end">
        <span
            className={`rounded-full px-3 py-1.5 text-xs font-bold ${badgeClass}`}
        >
            {formatStatus(status)}
        </span>

        {status === "PENDING" ? (
            <div className="flex flex-wrap gap-2">
            <button
                type="button"
                disabled={isLoading}
                onClick={() => updateStatus("CONFIRMED")}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#e8f2ff] px-3 py-2 text-xs font-bold text-[#2d70d4] transition hover:bg-[#dcecff] disabled:opacity-60"
            >
                {isLoading ? (
                <LoaderCircle className="size-3.5 animate-spin" />
                ) : (
                <Check className="size-3.5" />
                )}
                Confirm
            </button>

            <button
                type="button"
                disabled={isLoading}
                onClick={() => updateStatus("CANCELLED")}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#fff0ed] px-3 py-2 text-xs font-bold text-[#d9654d] transition hover:bg-[#ffe4de] disabled:opacity-60"
            >
                <X className="size-3.5" />
                Cancel
            </button>
            </div>
        ) : null}

        {status === "CONFIRMED" ? (
            <div className="flex flex-wrap gap-2">
            <button
                type="button"
                disabled={isLoading}
                onClick={() => updateStatus("CHECKED_IN")}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#eeeaff] px-3 py-2 text-xs font-bold text-[#7558f7] transition hover:bg-[#e5dfff] disabled:opacity-60"
            >
                {isLoading ? (
                <LoaderCircle className="size-3.5 animate-spin" />
                ) : (
                <UserCheck className="size-3.5" />
                )}
                Check in
            </button>

            <button
                type="button"
                disabled={isLoading}
                onClick={() => updateStatus("CANCELLED")}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#fff0ed] px-3 py-2 text-xs font-bold text-[#d9654d] transition hover:bg-[#ffe4de] disabled:opacity-60"
            >
                <X className="size-3.5" />
                Cancel
            </button>
            </div>
        ) : null}

        {status === "CHECKED_IN" ? (
            <button
            type="button"
            disabled={isLoading}
            onClick={() => updateStatus("COMPLETED")}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#e4f9ec] px-3 py-2 text-xs font-bold text-[#277246] transition hover:bg-[#d6f5e2] disabled:opacity-60"
            >
            {isLoading ? (
                <LoaderCircle className="size-3.5 animate-spin" />
            ) : (
                <CircleCheckBig className="size-3.5" />
            )}
            Complete booking
            </button>
        ) : null}

        {errorMessage ? (
            <p className="max-w-52 text-xs font-medium text-[#c55342]">
            {errorMessage}
            </p>
        ) : null}
        </div>
    );
}