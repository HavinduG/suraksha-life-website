"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
// import { Montserrat, Poppins } from "next/font/google"; // Removed

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ACFData, ServiceItem } from "@/types/acf";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

// Font imports removed


interface ServicesProps {
    data: ACFData;
}

const Services = ({ data }: ServicesProps) => {
    const [animationComplete, setAnimationComplete] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (!headerRef.current) return;

            // Header Animation
            gsap.from(headerRef.current, {
                opacity: 0,
                y: 30,
                duration: 1,
                scrollTrigger: {
                    trigger: headerRef.current,
                    start: "top 80%",
                },
            });

            // Cards Animation (Staggered)
            const cards = cardsRef.current?.children;
            if (cards) {
                gsap.from(cards, {
                    // opacity: 0,
                    y: 50,
                    duration: 0.8,
                    stagger: 0.2,
                    scrollTrigger: {
                        trigger: cardsRef.current,
                        start: "top 75%",
                    },
                    onComplete: () => setAnimationComplete(true),
                });
            }

            // Animate Divider
            gsap.to(".divider-anim-services", {
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

    // Helper to safely render HTML content
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
                <div ref={headerRef} className="text-center mb-16 space-y-4">
                    <h5
                        className={cn(
                            "text-sm font-bold tracking-[0.2em] text-[#05668D] uppercase font-montserrat"

                        )}
                    >
                        {data.ser_title}
                    </h5>
                    <div className="max-w-3xl mx-auto">
                        <h2
                            className={cn(
                                "text-4xl md:text-5xl font-extrabold text-[#3C3E41] leading-tight font-montserrat"

                            )}
                        >
                            {/* Split title for specific styling if needed, or just render */}
                            {data.ser_section_title}
                        </h2>
                    </div>
                </div>

                {/* Subtitle / Category Header */}
                <div className="mb-8">
                    <h3
                        className={cn(
                            "text-xl md:text-2xl font-bold text-[#3C3E41] font-montserrat"

                        )}
                    >
                        {data.ser_sub_title}
                    </h3>
                </div>

                {/* Services Grid */}
                <div
                    ref={cardsRef}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
                >
                    {data.services_list && data.services_list.length > 0 ? (
                        data.services_list.map((service, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "group relative rounded-2xl p-8 flex flex-col items-start gap-6 h-full overflow-hidden",
                                    animationComplete && "transition-transform duration-300 hover:-translate-y-2"
                                )}
                                style={{
                                    background: "linear-gradient(145deg, #E2E8EC, #FFFFFF)",
                                    boxShadow: "5px 5px 15px #D1D9E6, -5px -5px 15px #FFFFFF",
                                }}
                            >
                                {/* Background Overlay for Gradient on Hover */}
                                <div
                                    className="absolute inset-0 bg-gradient-to-r from-[#05668D] to-[#02C39A] opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out z-0"
                                />



                                {/* Icon Container - Circular Neumorphic */}
                                <div className="relative z-10">
                                    <div className="w-16 h-16 rounded-full flex items-center justify-center bg-transparent group-hover:brightness-0 group-hover:invert transition-[filter] duration-300">
                                        {/* Note: In the design image, icons are simple blue outlines. 
                                            The provided data has image URLs. We will use Next/Image. */}
                                        <div className="relative w-8 h-8">
                                            {service?.acf?.service_icon?.url ? (
                                                <Image
                                                    src={service.acf.service_icon.url}
                                                    alt={service.acf.service_icon.alt || service.acf.service_title}
                                                    fill
                                                    className="object-contain"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-slate-200 rounded-full"></div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="space-y-4 w-full relative z-10">
                                    <h4
                                        className={cn(
                                            "text-xl font-bold text-[#3C3E41] group-hover:text-white transition-colors duration-300 font-montserrat"

                                        )}
                                    >
                                        {service?.acf?.service_title || "Service Title"}
                                    </h4>

                                    <div
                                        className={cn(
                                            "text-slate-600 text-sm leading-relaxed group-hover:text-white/90 transition-colors duration-300",
                                            "prose prose-sm max-w-none", // Tailwind prose for HTML content
                                            "prose-ul:list-disc prose-ul:pl-4 prose-ul:my-2",
                                            "prose-li:marker:text-[#3C3E41] group-hover:prose-li:marker:text-white", // Target markers
                                            "prose-p:my-2 font-poppins"

                                        )}
                                        dangerouslySetInnerHTML={createMarkup(service?.acf?.service_description || "")}
                                    />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center text-gray-500 py-10">
                            No services available at the moment.
                        </div>
                    )}
                </div>

                {/* Footer Availability Text */}
                <div className="text-left md:text-left border-t border-slate-300/50 pt-8">
                    <p className={cn("text-xs md:text-sm text-slate-500 font-medium italic font-poppins")}>
                        {data.service_available_time}
                    </p>
                </div>
            </div>
            {/* Dynamic Neumorphic Divider */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-[2px] rounded-full opacity-50">
                <div
                    className="w-full h-full bg-[#ECF0F3]"
                    style={{
                        boxShadow: "inset 2px 2px 5px #DCE1E4, inset -2px -2px 5px #FFFFFF"
                    }}
                />
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-1 bg-[#DCE1E4] rounded-full opacity-20 divider-anim-services"
                />
            </div>
        </section>
    );
};

export default Services;
