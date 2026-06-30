"use client";

import { FormEvent, useState } from "react";
import {
    CheckCircle2,
    Clock3,
    LoaderCircle,
    Save,
    } from "lucide-react";

    type AvailabilityEntry = {
    dayOfWeek: number;
    isAvailable: boolean;
    startTime: string;
    endTime: string;
    };

    type StaffAvailabilityFormProps = {
    staffId: string;
    staffName: string;
    initialAvailability: AvailabilityEntry[];
    };

    const weekDays = [
    { dayOfWeek: 1, label: "Monday", shortLabel: "Mon" },
    { dayOfWeek: 2, label: "Tuesday", shortLabel: "Tue" },
    { dayOfWeek: 3, label: "Wednesday", shortLabel: "Wed" },
    { dayOfWeek: 4, label: "Thursday", shortLabel: "Thu" },
    { dayOfWeek: 5, label: "Friday", shortLabel: "Fri" },
    { dayOfWeek: 6, label: "Saturday", shortLabel: "Sat" },
    { dayOfWeek: 0, label: "Sunday", shortLabel: "Sun" },
    ];

    function buildInitialAvailability(
    initialAvailability: AvailabilityEntry[]
    ): AvailabilityEntry[] {
    const availabilityByDay = new Map(
        initialAvailability.map((entry) => [entry.dayOfWeek, entry])
    );

    return weekDays.map((day) => {
        const savedDay = availabilityByDay.get(day.dayOfWeek);

        if (savedDay) {
        return {
            dayOfWeek: savedDay.dayOfWeek,
            isAvailable: savedDay.isAvailable,
            startTime: savedDay.startTime,
            endTime: savedDay.endTime,
        };
        }

        return {
        dayOfWeek: day.dayOfWeek,
        isAvailable: day.dayOfWeek >= 1 && day.dayOfWeek <= 5,
        startTime: "09:00",
        endTime: "18:00",
        };
    });
    }

    export default function StaffAvailabilityForm({
    staffId,
    staffName,
    initialAvailability,
    }: StaffAvailabilityFormProps) {
    const [weeklyAvailability, setWeeklyAvailability] = useState(
        () => buildInitialAvailability(initialAvailability)
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    function updateDay(
        dayOfWeek: number,
        updates: Partial<AvailabilityEntry>
    ) {
        setWeeklyAvailability((current) =>
        current.map((day) =>
            day.dayOfWeek === dayOfWeek
            ? { ...day, ...updates }
            : day
        )
        );
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setIsSubmitting(true);
        setErrorMessage("");
        setSuccessMessage("");

        try {
        const response = await fetch(
            `/api/staff/${staffId}/availability`,
            {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                weeklyAvailability,
            }),
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
            result.message ?? "Unable to save staff availability."
            );
        }

        setSuccessMessage(
            `${staffName}'s weekly availability has been saved.`
        );
        } catch (error) {
        setErrorMessage(
            error instanceof Error
            ? error.message
            : "Something went wrong. Please try again."
        );
        } finally {
        setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
        {errorMessage ? (
            <div
            role="alert"
            className="rounded-2xl border border-[#ffd9d1] bg-[#fff0ed] px-4 py-3 text-sm font-semibold text-[#b44e3c]"
            >
            {errorMessage}
            </div>
        ) : null}

        {successMessage ? (
            <div
            role="status"
            className="flex items-center gap-3 rounded-2xl border border-[#ccefd8] bg-[#e4f9ec] px-4 py-3 text-sm font-semibold text-[#277246]"
            >
            <CheckCircle2 className="size-4 shrink-0" />
            <span>{successMessage}</span>
            </div>
        ) : null}

        <div className="overflow-hidden rounded-[1.6rem] border border-[#e8e4ef] bg-white shadow-[0_12px_30px_rgba(65,44,140,0.05)]">
            <div className="border-b border-[#eeeaf4] px-6 py-5 sm:px-7">
            <p className="text-sm font-bold text-[#28243d]">
                Weekly working hours
            </p>

            <p className="mt-1 text-sm leading-6 text-[#777385]">
                Turn on the days that {staffName} is available for bookings.
            </p>
            </div>

            <div className="divide-y divide-[#eeeaf4]">
            {weekDays.map((dayInfo) => {
                const day = weeklyAvailability.find(
                (entry) => entry.dayOfWeek === dayInfo.dayOfWeek
                );

                if (!day) {
                return null;
                }

                return (
                <div
                    key={dayInfo.dayOfWeek}
                    className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7"
                >
                    <div className="flex items-center gap-4">
                    <div
                        className={`grid size-11 place-items-center rounded-2xl text-xs font-extrabold ${
                        day.isAvailable
                            ? "bg-[#eeeaff] text-[#7558f7]"
                            : "bg-[#f3f1f6] text-[#a19baa]"
                        }`}
                    >
                        {dayInfo.shortLabel}
                    </div>

                    <div>
                        <p className="font-bold text-[#28243d]">
                        {dayInfo.label}
                        </p>

                        <p className="mt-1 text-xs font-medium text-[#858092]">
                        {day.isAvailable
                            ? "Available for bookings"
                            : "Unavailable"}
                        </p>
                    </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                    <button
                        type="button"
                        onClick={() =>
                        updateDay(day.dayOfWeek, {
                            isAvailable: !day.isAvailable,
                        })
                        }
                        className={`relative h-7 w-12 rounded-full transition ${
                        day.isAvailable
                            ? "bg-[#7558f7]"
                            : "bg-[#ded9e5]"
                        }`}
                        aria-label={`Toggle ${dayInfo.label} availability`}
                        aria-pressed={day.isAvailable}
                    >
                        <span
                        className={`absolute top-1 size-5 rounded-full bg-white shadow-sm transition ${
                            day.isAvailable
                            ? "left-6"
                            : "left-1"
                        }`}
                        />
                    </button>

                    <div className="flex items-center gap-2">
                        <Clock3 className="size-4 text-[#9a95a5]" />

                        <input
                        type="time"
                        value={day.startTime}
                        disabled={!day.isAvailable}
                        onChange={(event) =>
                            updateDay(day.dayOfWeek, {
                            startTime: event.target.value,
                            })
                        }
                        className="rounded-lg border border-[#e5e0eb] bg-[#fbfaff] px-2 py-2 text-sm font-semibold text-[#28243d] outline-none transition focus:border-[#7558f7] disabled:cursor-not-allowed disabled:opacity-50"
                        />

                        <span className="text-sm font-bold text-[#9a95a5]">
                        to
                        </span>

                        <input
                        type="time"
                        value={day.endTime}
                        disabled={!day.isAvailable}
                        onChange={(event) =>
                            updateDay(day.dayOfWeek, {
                            endTime: event.target.value,
                            })
                        }
                        className="rounded-lg border border-[#e5e0eb] bg-[#fbfaff] px-2 py-2 text-sm font-semibold text-[#28243d] outline-none transition focus:border-[#7558f7] disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                    </div>
                </div>
                );
            })}
            </div>
        </div>

        <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#15152c] px-5 py-3.5 text-sm font-bold text-white shadow-[0_10px_22px_rgba(21,21,44,0.16)] transition hover:-translate-y-0.5 hover:bg-[#2a2948] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
        >
            {isSubmitting ? (
            <>
                <LoaderCircle className="size-4 animate-spin" />
                Saving availability...
            </>
            ) : (
            <>
                <Save className="size-4" />
                Save availability
            </>
            )}
        </button>
        </form>
    );
}