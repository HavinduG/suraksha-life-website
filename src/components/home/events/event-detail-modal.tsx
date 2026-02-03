"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { X, Calendar as CalendarIcon, MapPin, Clock } from "lucide-react";
import { format } from "date-fns";
import { gsap } from "gsap";
import { EventItem } from "@/types/acf";
import { cn } from "@/lib/utils";
// Font imports removed


interface EventDetailModalProps {
    event: EventItem;
    onClose: () => void;
}

const EventDetailModal = ({ event, onClose }: EventDetailModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    // Lifecycle: Body Scroll Lock & Animation
    useEffect(() => {
        // specialized useEffect hook logic
        // 1. Lock Body Scroll
        document.body.style.overflow = "hidden";

        // 2. Animate In
        const ctx = gsap.context(() => {
            gsap.fromTo(
                modalRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.3, ease: "power2.out" }
            );

            gsap.fromTo(
                contentRef.current,
                { y: 50, opacity: 0, scale: 0.95 },
                { y: 0, opacity: 1, scale: 1, duration: 0.4, delay: 0.1, ease: "back.out(1.2)" }
            );
        }, modalRef);

        // Cleanup
        return () => {
            document.body.style.overflow = "unset";
            ctx.revert();
        };
    }, []);

    const handleClose = () => {
        // Animate Out
        gsap.to(contentRef.current, {
            y: 20,
            opacity: 0,
            duration: 0.2,
            onComplete: () => {
                gsap.to(modalRef.current, {
                    opacity: 0,
                    duration: 0.2,
                    onComplete: onClose
                });
            }
        });
    };

    return (
        <div
            ref={modalRef}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            onClick={(e) => {
                if (e.target === modalRef.current) handleClose();
            }}
        >
            <div
                ref={contentRef}
                className="bg-white w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col relative"
            >
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md text-slate-600 hover:text-red-500 transition-colors"
                >
                    <X size={24} />
                </button>

                {/* Header Image - Full Uncropped */}
                <div className="relative w-full bg-slate-100 flex justify-center">
                    {event.acf.event_image?.url ? (
                        <Image
                            src={event.acf.event_image.url}
                            alt={event.acf.event_name}
                            width={event.acf.event_image.width || 800} // Fallback width
                            height={event.acf.event_image.height || 600} // Fallback height
                            className="w-full h-auto max-h-[60vh] object-contain"
                            priority
                        />
                    ) : (
                        <div className="w-full h-64 flex items-center justify-center text-slate-400">
                            <span className="flex flex-col items-center gap-2">
                                <CalendarIcon size={48} />
                                No Image
                            </span>
                        </div>
                    )}

                    {/* Date Badge Overlay */}
                    <div className="absolute bottom-4 left-4 bg-white/95 px-4 py-2 rounded-lg shadow-lg flex flex-col items-center min-w-[80px]">
                        <span className="text-xs font-bold text-slate-500 uppercase">
                            {format(new Date(event.acf.event_date_and_time), "MMM")}
                        </span>
                        <span className="text-2xl font-extrabold text-[#05668D]">
                            {format(new Date(event.acf.event_date_and_time), "dd")}
                        </span>
                        <span className="text-xs font-medium text-slate-400">
                            {format(new Date(event.acf.event_date_and_time), "yyyy")}
                        </span>
                    </div>
                </div>

                {/* Content Body (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                    <div className="mb-6">
                        <h2 className={cn("text-2xl md:text-3xl font-bold text-[#3C3E41] mb-2 font-montserrat")}>
                            {event.acf.event_name}
                        </h2>

                        {/* Metadata Row */}
                        <div className="flex flex-wrap gap-4 text-sm text-slate-600 mt-3">
                            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                                <MapPin size={16} className="text-[#05668D]" />
                                <span className={"font-poppins"}>{event.acf.event_location}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                                <Clock size={16} className="text-[#05668D]" />
                                <span className={"font-poppins"}>
                                    {format(new Date(event.acf.event_date_and_time), "eeee, h:mm a")}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px w-full bg-slate-100 mb-6"></div>

                    {/* Description Content */}
                    <div className={cn("prose prose-slate max-w-none text-slate-600 leading-relaxed font-poppins")}>
                        {/* Check if we have the "Detailed" content for Past Events */}
                        {event.acf.past_events_details_more ? (
                            <>
                                {/* Render the main detailed article content */}
                                <div dangerouslySetInnerHTML={{ __html: event.acf.past_events_details_more }} />

                                {/* Render Additional Past Event Images (Gallery-like) */}
                                {event.acf.past_event_image && event.acf.past_event_image.length > 0 && (
                                    <div className="mt-8 space-y-6">
                                        <h3 className="text-xl font-bold text-[#05668D]">Event Gallery</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {event.acf.past_event_image.map((item, index) => (
                                                <div key={index} className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                                    {item.past_event_img?.url && (
                                                        <Image
                                                            src={item.past_event_img.url}
                                                            alt={item.past_event_img.alt || `Event Image ${index + 1}`}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            /* Fallback for Upcoming Events (Simple Description) */
                            <div dangerouslySetInnerHTML={{ __html: event.acf.event_description }} />
                        )}
                    </div>
                </div>

                {/* Footer (Optional Actions) */}
                {/* <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end"></div> */}
            </div>
        </div>
    );
};

export default EventDetailModal;
