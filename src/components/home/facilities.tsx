"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { Montserrat, Poppins } from "next/font/google";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ACFData } from "@/types/acf";
import { cn } from "@/lib/utils";

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["400", "700", "800"],
});

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "600"],
});

interface FacilitiesProps {
    data: ACFData;
}

const Facilities = ({ data }: FacilitiesProps) => {
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (!titleRef.current) return;

            // Animate Title Section
            gsap.from(titleRef.current, {
                opacity: 0,
                x: -50,
                duration: 1,
                scrollTrigger: {
                    trigger: titleRef.current,
                    start: "top 80%",
                },
            });

            // Animate Cards (Staggered)
            const cards = cardsRef.current?.children;
            if (cards) {
                gsap.from(cards, {
                    opacity: 0,
                    y: 50,
                    duration: 0.8,
                    stagger: 0.2,
                    scrollTrigger: {
                        trigger: cardsRef.current,
                        start: "top 75%",
                    }
                });
            }

            // Animate Divider
            gsap.to(".divider-anim-facilities", {
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

    return (
        <section
            ref={sectionRef}
            className="w-full pt-16 pb-16 bg-[#ECF0F3] overflow-hidden relative"
        >
            <div className="container mx-auto px-4 md:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                {/* Left Side: Title */}
                <div ref={titleRef} className="lg:col-span-4 flex flex-col space-y-4">
                    <h3
                        className={cn(
                            "text-sm font-bold tracking-[0.2em] text-[#05668D] uppercase",
                            montserrat.className
                        )}
                    >
                        {data.sf_title}
                    </h3>
                    <h2
                        className={cn(
                            "text-4xl md:text-5xl font-extrabold leading-tight text-[#3C3E41]",
                            montserrat.className
                        )}
                    >
                        {/* Split "Special Facilities For Our Patients" for better visual balance if needed */}
                        {data.sf_section_title.split("For").map((part, i, arr) => (
                            <span key={i} className="block">
                                {part.trim()} {i < arr.length - 1 ? "For" : ""}
                            </span>
                        ))}
                    </h2>
                </div>

                {/* Right Side: Facilities List */}
                <div ref={cardsRef} className="lg:col-span-8 flex flex-col gap-6">
                    {data.facilities_list.map((facility, index) => (
                        <div
                            key={index}
                            className="rounded-xl p-8 flex flex-col md:flex-row items-start gap-6 transition-shadow duration-300"
                            style={{
                                background: "linear-gradient(145deg, #E2E8EC, #ffffffff)",
                                boxShadow: "5px 5px 15px #D1D9E6, -5px -5px 15px #FFFFFF",
                            }}
                        >
                            {/* Icon Container */}
                            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-[#E5EFF4] flex items-center justify-center">
                                <div className="relative w-8 h-8">
                                    <Image
                                        src={facility.facilities_icon.url}
                                        alt={facility.facilities_icon.alt || facility.facility_title}
                                        fill
                                        className="object-contain" // Use contain to keep icon aspect ratio
                                    />
                                </div>
                            </div>

                            {/* Text Content */}
                            <div className="flex flex-col space-y-2">
                                <h4
                                    className={cn(
                                        "text-xl font-bold text-[#1E2125]",
                                        montserrat.className
                                    )}
                                >
                                    {facility.facility_title}
                                </h4>
                                <p
                                    className={cn(
                                        "text-slate-600 text-base leading-relaxed",
                                        poppins.className
                                    )}
                                >
                                    {facility.facility_description}
                                </p>
                            </div>
                        </div>
                    ))}
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
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-1 bg-[#DCE1E4] rounded-full opacity-20 divider-anim-facilities"
                />
            </div>
        </section>
    );
};

export default Facilities;
