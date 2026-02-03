
"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
// import { Montserrat, Poppins } from "next/font/google"; // Removed

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ACFData, EventItem } from "@/types/acf";
import { cn } from "@/lib/utils";
import UpcomingEvents from "./events/upcoming-events";
import PastEvents from "./events/past-events";
import BookingCTA from "./events/booking-cta";
import EventDetailModal from "./events/event-detail-modal";

gsap.registerPlugin(ScrollTrigger);

// Font imports removed


interface EventsProps {
    data: ACFData;
    events: EventItem[]; // Using passed events data
}

const Events = ({ data, events = [] }: EventsProps) => {
    const sectionRef = useRef<HTMLElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);

    // State for selected event (Modal)
    const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

    const handleSelectEvent = (event: EventItem) => {
        setSelectedEvent(event);
    };

    const handleCloseModal = () => {
        setSelectedEvent(null);
    };

    // Filter events
    const currentDate = new Date();
    const upcomingEvents = events
        .filter(e => new Date(e.acf.event_date_and_time) >= currentDate)
        .sort((a, b) => new Date(a.acf.event_date_and_time).getTime() - new Date(b.acf.event_date_and_time).getTime());

    const pastEvents = events
        .filter(e => new Date(e.acf.event_date_and_time) < currentDate)
        .sort((a, b) => new Date(b.acf.event_date_and_time).getTime() - new Date(a.acf.event_date_and_time).getTime());

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animate Image
            gsap.from(imageRef.current, {
                opacity: 0,
                x: -50,
                duration: 1,
                scrollTrigger: {
                    trigger: imageRef.current,
                    start: "top 80%",
                },
            });

            // Animate Text Content
            gsap.from(textRef.current?.children || [], {
                opacity: 0,
                x: 50,
                duration: 0.8,
                stagger: 0.1,
                scrollTrigger: {
                    trigger: textRef.current,
                },
            });

            // Animate Divider
            gsap.to(".divider-anim-events", {
                width: "100%",
                opacity: 1,
                duration: 1.5,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "bottom 95%",
                    toggleActions: "play none none reverse"
                }
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    // Helper to safely render HTML content for the description text
    const createMarkup = (html: string) => {
        return { __html: html };
    };

    return (
        <section
            ref={sectionRef}
            className="w-full pt-16 pb-16 bg-[#ECF0F3] relative overflow-hidden"
        >
            <div className="container mx-auto px-4 md:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center mb-16 space-y-4">
                    <h5
                        className={cn(
                            "text-sm font-bold tracking-[0.2em] text-[#05668D] uppercase font-montserrat"

                        )}
                    >
                        {data.ev_title}
                    </h5>
                    <div className="max-w-4xl mx-auto">
                        <h2
                            className={cn(
                                "text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#3C3E41] leading-tight font-montserrat"

                            )}
                        >
                            {data.ev_section_title}
                        </h2>
                    </div>
                </div>

                {/* Content Grid: Doctor Profile */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
                    {/* Left Column: Doctor Image */}
                    <div ref={imageRef} className="relative w-full flex justify-center lg:justify-end">
                        {/* Shadow/Backdrop effect for image */}
                        <div className="relative w-full max-w-sm lg:max-w-md aspect-[4/5] rounded-2xl overflow-hidden shadow-[5px_5px_15px_#D1D9E6,-5px_-5px_15px_#FFFFFF] transform hover:scale-[1.02] transition-transform duration-500">
                            {data.events_doctor_image?.url ? (
                                <Image
                                    src={data.events_doctor_image.url}
                                    alt={data.events_doctor_image.alt || "Doctor Event Profile"}
                                    fill
                                    className="object-cover object-top"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                                />
                            ) : (
                                <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">
                                    No Image Available
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Text Content */}
                    <div ref={textRef} className="flex flex-col space-y-6">
                        {/* Intro Text */}
                        <div className={cn("text-lg text-slate-600 font-poppins")}>
                            <span className="block mb-2">{data.e_text_1}</span>
                            <h3 className={cn("text-2xl md:text-3xl font-bold text-[#05668D] mb-1 font-montserrat")}>
                                {data.e_doctor_name}
                            </h3>
                            <p className={cn("text-lg font-semibold text-[#3C3E41] font-montserrat")}>
                                {data.e_doctor_position}
                            </p>
                        </div>

                        {/* Description Text (HTML) */}
                        <div
                            className={cn("prose prose-slate max-w-none text-slate-600 leading-relaxed font-poppins")}
                            dangerouslySetInnerHTML={createMarkup(data.e_text_2)}
                        />

                        {/* Bullet Points */}
                        <ul className="space-y-3 mt-4">
                            {data.bullet_points?.map((item, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    {/* Custom Bullet Icon */}
                                    <span className="mt-1.5 flex-shrink-0 w-2 h-2 rounded-full border-2 border-[#05668D]"></span>
                                    <span className={cn("text-slate-700 font-medium font-poppins")}>
                                        {item.bullet_text}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* -----------------------------------------------------------
                    Dynamic Events Section
                ------------------------------------------------------------ */}

                {/* Upcoming Events & Calendar */}
                <UpcomingEvents
                    events={upcomingEvents}
                    allEvents={events}
                    onSelectEvent={handleSelectEvent}
                />

                {/* Past Events */}
                <PastEvents
                    events={pastEvents}
                    title={data.recent_past_ev_title}
                    onSelectEvent={handleSelectEvent}
                />

                {/* Booking CTA */}
                <BookingCTA data={data} />

            </div>
            {/* Event Detail Modal */}
            {selectedEvent && (
                <EventDetailModal
                    event={selectedEvent}
                    onClose={handleCloseModal}
                />
            )}
            {/* Dynamic Neumorphic Divider */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-[2px] rounded-full opacity-50">
                <div
                    className="w-full h-full bg-[#ECF0F3]"
                    style={{
                        boxShadow: "inset 2px 2px 5px #DCE1E4, inset -2px -2px 5px #FFFFFF"
                    }}
                />
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-1 bg-[#DCE1E4] rounded-full opacity-20 divider-anim-events"
                />
            </div>
        </section>
    );
};

export default Events;
