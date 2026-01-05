"use client";

import React, { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { EventItem } from "@/types/acf";
import { MapPin, Calendar as CalendarIcon } from "lucide-react";
import CalendarWidget from "./calendar-widget";
import { cn } from "@/lib/utils";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"] });

interface UpcomingEventsProps {
    events: EventItem[];
    allEvents: EventItem[];
    onSelectEvent: (event: EventItem) => void;
}

const UpcomingEvents = ({ events, allEvents, onSelectEvent }: UpcomingEventsProps) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    // Filter events for selected date from ALL events (past + upcoming)
    const eventsOnSelectedDate = selectedDate
        ? allEvents.filter(event => {
            const eventDate = new Date(event.acf.event_date_and_time);
            return (
                eventDate.getDate() === selectedDate.getDate() &&
                eventDate.getMonth() === selectedDate.getMonth() &&
                eventDate.getFullYear() === selectedDate.getFullYear()
            );
        })
        : [];

    return (
        <div className="w-full">
            <h2 className={cn("text-3xl font-bold text-[#3C3E41] mb-8 text-center", montserrat.className)}>
                Up Coming Events
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Upcoming Events List (Desktop: col-span-7) */}
                {/* Always show upcoming events list here, regardless of calendar selection */}
                <div className="lg:col-span-7 space-y-4">
                    {/* Show limited list of upcoming events */}
                    {events.slice(0, 3).length > 0 ? (
                        events.slice(0, 3).map((event) => (
                            <div
                                key={event.id}
                                onClick={() => onSelectEvent(event)}
                                className="rounded-xl p-6 flex flex-col md:flex-row gap-6 items-start transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
                                style={{
                                    background: "linear-gradient(145deg, #E2E8EC, #FFFFFF)",
                                    boxShadow: "5px 5px 15px #D1D9E6, -5px -5px 15px #FFFFFF",
                                }}
                            >
                                {/* Event Image Thumbnail */}
                                <div className="w-20 h-20 md:w-24 md:h-24 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                                    {event.acf.event_image?.url ? (
                                        <Image
                                            src={event.acf.event_image.url}
                                            alt={event.acf.event_name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                            <CalendarIcon className="w-8 h-8" />
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 space-y-2">
                                    <h3 className="text-[#05668D] font-bold text-lg">
                                        {event.acf.event_name}
                                    </h3>

                                    <div className="flex flex-col gap-1 text-sm text-slate-500">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-slate-400" />
                                            <span>{event.acf.event_location}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CalendarIcon className="w-4 h-4 text-slate-400" />
                                            <span>
                                                {/* Parsing date string if it's "December 10, 2026 12:00 am" */}
                                                {/* Safely handle potentially invalid dates if format varies */}
                                                {event.acf.event_date_and_time}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                            <p className="text-slate-500 text-sm">No Upcoming Events.</p>
                        </div>
                    )}
                </div>

                {/* Right: Calendar Widget & Filtered Results (Desktop: col-span-5) */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    <CalendarWidget
                        events={allEvents}
                        onDateSelect={setSelectedDate}
                        selectedDate={selectedDate}
                    />

                    {/* Display Filtered Events Below Calendar */}
                    {selectedDate && (
                        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                            <div className="flex items-center justify-between mb-3 px-1">
                                <h4 className="text-[#05668D] font-bold text-sm">
                                    Events on {format(selectedDate, "MMMM do, yyyy")}
                                </h4>
                                <button
                                    onClick={() => setSelectedDate(null)}
                                    className="text-xs text-slate-400 hover:text-[#05668D] underline transition-colors"
                                >
                                    Clear
                                </button>
                            </div>

                            <div className="space-y-3">
                                {eventsOnSelectedDate.length > 0 ? (
                                    eventsOnSelectedDate.map(event => (
                                        <div
                                            key={event.id}
                                            onClick={() => onSelectEvent(event)}
                                            className="rounded-lg p-4 flex gap-3 items-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
                                            style={{
                                                background: "linear-gradient(145deg, #E2E8EC, #FFFFFF)",
                                                boxShadow: "5px 5px 15px #D1D9E6, -5px -5px 15px #FFFFFF",
                                            }}
                                        >
                                            <div className="w-12 h-12 bg-slate-100 rounded-md overflow-hidden flex-shrink-0 relative">
                                                {event.acf.event_image?.url ? (
                                                    <Image
                                                        src={event.acf.event_image.url}
                                                        alt={event.acf.event_name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <CalendarIcon className="w-4 h-4 text-slate-300" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h5 className="font-bold text-[#05668D] text-sm truncate">
                                                    {event.acf.event_name}
                                                </h5>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-[10px] text-slate-500 font-medium bg-slate-100 px-1.5 py-0.5 rounded">
                                                        {format(new Date(event.acf.event_date_and_time), "h:mm a")}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" />
                                                        {event.acf.event_location}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-6 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
                                        <p className="text-xs text-slate-400">No events found for this day.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UpcomingEvents;
