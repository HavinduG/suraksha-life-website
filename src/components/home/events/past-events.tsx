"use client";

import React, { useState } from "react";
import Image from "next/image";
import { EventItem } from "@/types/acf";
import { Calendar as CalendarIcon, MapPin } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";// Font imports removed
import { format } from "date-fns";


interface PastEventsProps {
    events: EventItem[];
    title: string;
    onSelectEvent: (event: EventItem) => void;
}

const PastEvents = ({ events, title, onSelectEvent }: PastEventsProps) => {
    const [currentPage, setCurrentPage] = useState(0);

    // Determine the featured event (most recent past event)
    const featuredEvent = events[0];
    const otherEvents = events.slice(1); // Show all remaining events

    if (!featuredEvent) return null;

    // Helper to format date safely
    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), "d MMMM yyyy");
        } catch (e) {
            return dateString;
        }
    }

    return (
        <div className="w-full mt-20">
            <h2 className={cn("text-2xl font-bold text-[#3C3E41] mb-8 font-montserrat")}>
                {title || "Recent Past Events"}
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Featured Event */}
                <Link
                    href={`/events/${featuredEvent.slug}`}
                    id={`event-${featuredEvent.id}`}
                    className="h-full rounded-2xl p-4 lg:p-6 flex flex-col justify-between gap-4 transition-all duration-300 hover:shadow-lg cursor-pointer block"
                    style={{
                        background: "linear-gradient(145deg, #E2E8EC, #FFFFFF)",
                        boxShadow: "5px 5px 15px #D1D9E6, -5px -5px 15px #FFFFFF",
                    }}
                >
                    <div className="relative w-full h-48 rounded-xl overflow-hidden shadow-md flex-shrink-0">
                        {featuredEvent.acf.event_image?.url ? (
                            <Image
                                src={featuredEvent.acf.event_image.url}
                                alt={featuredEvent.acf.event_name}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                                <span className="text-slate-400">No Image</span>
                            </div>
                        )}
                        {/* Date Badge */}
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-[10px] font-bold text-[#05668D] shadow-sm">
                            {formatDate(featuredEvent.acf.event_date_and_time)}
                        </div>
                    </div>

                    <div className="space-y-3 flex-1 flex flex-col">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-bold text-[#05668D] mb-0.5">
                                    {featuredEvent.acf.event_name}
                                </h3>
                                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
                                    {featuredEvent.acf.event_location}
                                </div>
                            </div>
                        </div>

                        {/* Description / Summary */}
                        <div className="text-xs text-slate-600 leading-relaxed bg-white/50 p-3 rounded-lg border border-white flex-1">
                            <h4 className="font-semibold text-[#3C3E41] mb-1">Over 200 community members participated in the session on:</h4>
                            {/* Assuming content is plain text with line breaks, rendering roughly */}
                            <div className="space-y-1">
                                <div
                                    className="line-clamp-3 prose prose-sm prose-slate max-w-none space-y-1 [&>p]:m-0 [&>ul]:m-0 [&>li]:m-0"
                                    dangerouslySetInnerHTML={{ __html: featuredEvent.acf.event_description }}
                                />
                            </div>
                        </div>
                    </div>
                </Link>

                {/* Right: Other Past Events List - Paginated */}
                <div className="h-full flex flex-col gap-4">
                    <div className="flex flex-col gap-4 min-h-[400px]">
                        {otherEvents.slice(currentPage * 3, (currentPage + 1) * 3).map(event => (
                            <Link
                                key={event.id}
                                id={`event-${event.id}`}
                                href={`/events/${event.slug}`}
                                className="w-full h-[130px] rounded-xl p-4 flex gap-4 items-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer block"
                                style={{
                                    background: "linear-gradient(145deg, #E2E8EC, #FFFFFF)",
                                    boxShadow: "5px 5px 15px #D1D9E6, -5px -5px 15px #FFFFFF",
                                }}
                            >
                                <div className="w-24 h-24 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                                    {event.acf.event_image?.url ? (
                                        <Image
                                            src={event.acf.event_image.url}
                                            alt={event.acf.event_name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <CalendarIcon className="w-6 h-6 text-slate-300" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-2 text-xs font-bold text-[#05668D] mb-1">
                                        <CalendarIcon className="w-3 h-3" />
                                        <span>{formatDate(event.acf.event_date_and_time)}</span>
                                    </div>
                                    <h4 className="font-bold text-[#3C3E41] text-sm mb-1 line-clamp-2">
                                        {event.acf.event_name}
                                    </h4>
                                    <div className="flex items-center gap-1 text-xs text-slate-500">
                                        <MapPin className="w-3 h-3" />
                                        <span>{event.acf.event_location}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Pagination Dots */}
                    {otherEvents.length > 3 && (
                        <div className="flex justify-center gap-2 mt-4">
                            {Array.from({ length: Math.ceil(otherEvents.length / 3) }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={(e) => {
                                        e.preventDefault(); // Prevent link navigation
                                        setCurrentPage(index);
                                    }}
                                    className={cn(
                                        "w-3 h-3 rounded-full transition-all duration-300",
                                        currentPage === index
                                            ? "bg-[#05668D] w-6"
                                            : "bg-slate-300 hover:bg-slate-400"
                                    )}
                                    aria-label={`Go to page ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PastEvents;
