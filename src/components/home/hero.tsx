"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { Montserrat, Poppins } from "next/font/google";
import { Button } from "@/components/ui/button";
import { HeroSectionData } from "@/types/acf";
import { cn } from "@/lib/utils";

const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["400", "700", "800"],
});

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "600"],
});

interface HeroProps {
    data: HeroSectionData;
}

const Hero = ({ data }: HeroProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

            tl.fromTo(
                textRef.current,
                { opacity: 0, x: -50 },
                { opacity: 1, x: 0, duration: 1, delay: 0.2 }
            )
                .from(
                    ".hero-text-element",
                    {
                        y: 20,
                        opacity: 0,
                        duration: 0.8,
                        stagger: 0.1,
                    },
                    "-=0.5"
                );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    // Parse name into Greeting, First Name, Last Name
    // Robust regex: Matches (Anything treated as greeting) + (Last two words as name)
    // Examples handled: "Hi, I'm Vihanga Wijesinghe", "Hi, I m Vihanga Wijesinghe", "Dr. Sameera Gunawardena"
    // Using [\s\S] instead of dotAll /s flag for better compatibility
    const nameMatch = data.doctor_name.match(/^([\s\S]*?)\s+(\S+)\s+(\S+)$/);

    // Fallback if regex doesn't match perfectly
    const greeting = nameMatch ? nameMatch[1] : "";
    const firstName = nameMatch ? nameMatch[2] : "";
    const lastName = nameMatch ? nameMatch[3] : data.doctor_name;

    // If no match, we might just have the name or a different format. 
    // In that case, lastName holds the full string, others empty.

    return (
        <section
            ref={containerRef}
            className="relative w-full min-h-[90vh] flex items-center overflow-hidden"
        >
            {/* 1. Full Cover Background Image */}
            <div className="absolute inset-0 z-0 bg-[#ECF0F3]"> {/* Added background color for safe area */}
                <Image
                    src={data.doctor_hero_image?.url || "http://suraksha.local/wp-content/uploads/2025/12/10-copy.jpg"}
                    alt={data.doctor_hero_image?.alt || "Hero Background"}
                    fill
                    className="object-contain object-right" // Changed to contain and align right to show full image
                    priority
                />
            </div>

            {/* 2. Gradient Overlay Removed as requested */}

            {/* 3. Content Container */}
            <div className="container relative z-20 mx-auto px-4 md:px-6 lg:px-8 h-full flex items-center">

                {/* Text Content */}
                <div ref={textRef} className="flex flex-col space-y-6 pt-12 lg:pt-0 max-w-4xl">
                    <p className={cn("hero-text-element text-xs md:text-sm font-bold tracking-[0.2em] text-slate-600 uppercase", montserrat.className)}>
                        {data.doctor_title}
                    </p>

                    <h1 className={cn("hero-text-element text-4xl md:text-5xl lg:text-7xl font-extrabold leading-[1.1]", montserrat.className)}>
                        {/* Line 1: Hi, I'm Vihanga */}
                        {greeting && firstName ? (
                            <span className="text-[#1E2125]">
                                {greeting} <span className="text-[#05668D]">{firstName}</span>
                            </span>
                        ) : (
                            // Fallback if parsing failed
                            <span className="text-[#05668D]">{data.doctor_name}</span>
                        )}

                        {/* Line 2: Wijesinghe */}
                        {lastName && greeting && (
                            <span className="block text-[#05668D]">
                                {lastName}
                            </span>
                        )}
                    </h1>

                    <div className={cn("hero-text-element flex flex-wrap items-center gap-2 text-sm md:text-base font-bold text-[#3C3E41]", montserrat.className)}>
                        {data.doctor_sub_title.split("|").map((item, index) => (
                            <React.Fragment key={index}>
                                <span className="whitespace-nowrap">{item.trim()}</span>
                                {index < data.doctor_sub_title.split("|").length - 1 && (
                                    <span className="hidden md:inline text-slate-400">|</span>
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    <p className={cn("hero-text-element text-[#3C3E41] text-base md:text-lg leading-relaxed max-w-2xl font-medium opacity-90", poppins.className)}>
                        {data.doctor_hero_description}
                    </p>

                    <div className="hero-text-element pt-6">
                        <Button
                            asChild
                            className="bg-gradient-to-r from-[#05668D] to-[#02C39A] hover:opacity-90 text-white font-bold py-7 px-10 rounded-md shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
                        >
                            <Link href={data.button_1_link || "#"}>
                                {data.button_1}
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
