
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { MapPin, Clock, Calendar as CalendarIcon, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getEventBySlug, getEventsData } from "@/lib/api";
import { EventItem } from "@/types/acf";
import { cn } from "@/lib/utils";
// import { Montserrat, Poppins } from "next/font/google"; // Removed


// Font imports removed


export default function EventPage() {
    const params = useParams();
    const [event, setEvent] = useState<EventItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [allEvents, setAllEvents] = useState<EventItem[]>([]);

    useEffect(() => {
        const fetchEvent = async () => {
            if (params?.slug) {
                try {
                    const data = await getEventBySlug(params.slug as string);
                    setEvent(data);
                } catch (error) {
                    console.error("Failed to fetch event", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        const fetchAllEvents = async () => {
            try {
                const data = await getEventsData();
                setAllEvents(data);
            } catch (error) {
                console.error("Failed to fetch all events", error);
            }
        }

        fetchEvent();
        fetchAllEvents();
    }, [params]);

    // Determine Prev/Next events
    // Note: Events might be sorted by date, but ID mapping works for list position
    const currentIndex = event && allEvents.length > 0 ? allEvents.findIndex(p => p.id === event.id) : -1;
    const prevEvent = currentIndex > 0 ? allEvents[currentIndex - 1] : null;
    const nextEvent = currentIndex >= 0 && currentIndex < allEvents.length - 1 ? allEvents[currentIndex + 1] : null;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#05668D]"></div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
                <h1 className="text-2xl font-bold text-slate-700">Event Not Found</h1>
                <Link href="/" className="text-[#05668D] hover:underline flex items-center gap-2">
                    <ArrowLeft size={16} /> Back to Home
                </Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 py-12 md:py-20">
            <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                {/* Back Button */}
                <Link
                    href={`/#event-${event.id}`}
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-[#05668D] transition-colors mb-8 font-medium"
                >
                    <ArrowLeft size={20} /> Back to Events
                </Link>

                <article className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    {/* Header Image */}
                    <div className="relative w-full aspect-video md:aspect-[21/9] bg-slate-100">
                        {event.acf.event_image?.url ? (
                            <Image
                                src={event.acf.event_image.url}
                                alt={event.acf.event_name}
                                fill
                                className="object-cover"
                                priority
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-200">
                                <span className="flex flex-col items-center gap-2">
                                    <CalendarIcon size={48} />
                                    No Image Available
                                </span>
                            </div>
                        )}

                        {/* Date Badge Overlay */}
                        <div className="absolute top-6 right-6 bg-white/95 px-5 py-3 rounded-xl shadow-lg flex flex-col items-center min-w-[90px] backdrop-blur-sm">
                            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                                {format(new Date(event.acf.event_date_and_time), "MMM")}
                            </span>
                            <span className="text-3xl font-extrabold text-[#05668D]">
                                {format(new Date(event.acf.event_date_and_time), "dd")}
                            </span>
                            <span className="text-sm font-medium text-slate-400">
                                {format(new Date(event.acf.event_date_and_time), "yyyy")}
                            </span>
                        </div>
                    </div>

                    {/* Content Container */}
                    <div className="p-6 md:p-12">
                        {/* Title & Meta */}
                        <div className="mb-10 border-b border-slate-100 pb-10">
                            <h1 className={cn("text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#3C3E41] mb-6 leading-tight font-montserrat")}>
                                {event.acf.event_name}
                            </h1>

                            <div className="flex flex-wrap gap-4 text-sm md:text-base text-slate-600">
                                <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                                    <MapPin size={18} className="text-[#05668D]" />
                                    <span className={"font-poppins"}>{event.acf.event_location}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                                    <Clock size={18} className="text-[#05668D]" />
                                    <span className={"font-poppins"}>
                                        {format(new Date(event.acf.event_date_and_time), "eeee, h:mm a")}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Rich Text Body */}
                        <div className={cn("prose prose-lg prose-slate max-w-none text-slate-600 leading-relaxed font-poppins")}>
                            {/* Detailed Article Content */}
                            {event.acf.past_events_details_more && (
                                <div dangerouslySetInnerHTML={{ __html: event.acf.past_events_details_more }} />
                            )}

                            {/* Fallback Description if Detail is missing (though likely redundant if page exists) */}
                            {!event.acf.past_events_details_more && (
                                <div dangerouslySetInnerHTML={{ __html: event.acf.event_description }} />
                            )}
                        </div>

                        {/* Image Gallery Grid */}
                        {event.acf.past_event_image && event.acf.past_event_image.length > 0 && (
                            <div className="mt-16 pt-10 border-t border-slate-100">
                                <h3 className={cn("text-2xl font-bold text-[#3C3E41] mb-8 font-montserrat")}>Event Gallery</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {event.acf.past_event_image.map((item, index) => (
                                        <div key={index} className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
                                            {item.past_event_img?.url && (
                                                <>
                                                    <Image
                                                        src={item.past_event_img.url}
                                                        alt={item.past_event_img.alt || `Event Image ${index + 1}`}
                                                        fill
                                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </article>

                {/* Navigation Buttons */}
                <div className="mt-8 flex justify-between gap-4">
                    {prevEvent ? (
                        <Link
                            href={`/events/${prevEvent.slug}`}
                            className="flex-1 bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group border border-slate-100"
                        >
                            <span className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 group-hover:text-[#05668D] transition-colors">
                                <ArrowLeft size={14} /> Previous Event
                            </span>
                            <h4 className="font-bold text-slate-700 group-hover:text-[#05668D] line-clamp-1 transition-colors">
                                {prevEvent.acf.event_name}
                            </h4>
                        </Link>
                    ) : (
                        <div className="flex-1"></div> // Spacer
                    )}

                    {nextEvent ? (
                        <Link
                            href={`/events/${nextEvent.slug}`}
                            className="flex-1 bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group border border-slate-100 text-right"
                        >
                            <span className="flex items-center justify-end gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 group-hover:text-[#05668D] transition-colors">
                                Next Event <ArrowLeft size={14} className="rotate-180" />
                            </span>
                            <h4 className="font-bold text-slate-700 group-hover:text-[#05668D] line-clamp-1 transition-colors">
                                {nextEvent.acf.event_name}
                            </h4>
                        </Link>
                    ) : (
                        <div className="flex-1"></div> // Spacer
                    )}
                </div>
            </div>
        </main>
    );
}
