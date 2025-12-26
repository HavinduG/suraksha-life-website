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
                .fromTo(
                    imageRef.current,
                    { opacity: 0, x: 50 },
                    { opacity: 1, x: 0, duration: 1 },
                    "-=0.8"
                )
                // Animate children of text container for stagger effect
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

    // Split the doctor name into greeting and name if possible
    // Expected format: "Hi, I’m Vihanga Wijesinghe"
    // We want to style "Hi, I'm" differently from "Vihanga Wijesinghe"

    const nameParts = data.doctor_name.match(/^(Hi, I’m)\s+(.*)$/i);
    const greeting = nameParts ? nameParts[1] : "";
    const name = nameParts ? nameParts[2] : data.doctor_name;

    return (
        <section
            ref={containerRef}
            className="relative w-full min-h-[90vh] bg-gradient-to-r from-slate-50 to-slate-100 flex items-center overflow-hidden"
        >
            {/* Background shape or gradient overlay could be added here */}
            <div className="container mx-auto px-4 md:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Text Content */}
                <div ref={textRef} className="flex flex-col space-y-6 z-10 order-2 lg:order-1">
                    <p className={cn("hero-text-element text-xs md:text-sm font-bold tracking-[0.2em] text-[#3C3E41] uppercase", montserrat.className)}>
                        {data.doctor_title}
                    </p>

                    <h1 className={cn("hero-text-element text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-[#1E2125]", montserrat.className)}>
                        {greeting && <span className="block text-3xl md:text-4xl text-[#1E2125] mb-2">{greeting}</span>}
                        <span className="text-[#05668D]">
                            {name}
                        </span>
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

                    <p className={cn("hero-text-element text-[#3C3E41] text-base md:text-lg leading-relaxed max-w-xl", poppins.className)}>
                        {data.doctor_hero_description}
                    </p>

                    <div className="hero-text-element pt-4">
                        <Button
                            asChild
                            className="bg-gradient-to-r from-[#05668D] to-[#02C39A] hover:opacity-90 text-white font-semibold py-6 px-8 rounded-md shadow-lg transition-transform hover:scale-105"
                        >
                            <Link href={data.button_1_link || ""}>
                                {data.button_1}
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Image Content */}
                <div ref={imageRef} className="relative h-full w-full flex justify-center lg:justify-end order-1 lg:order-2">
                    <div className="relative w-full max-w-md lg:max-w-lg aspect-[3/4] lg:aspect-square">
                        {/* Using the provided URL. Note: Ensure suraksha.local is reachable or use placeholder if it fails locally. 
                 For the purpose of this task, we assume the environment is set up to resolve it. */}
                        <Image
                            src={data.doctor_hero_image.url}
                            alt={data.doctor_hero_image.alt || data.doctor_name}
                            fill
                            className="object-cover object-top lg:object-contain drop-shadow-2xl rounded-lg lg:rounded-none lg:bg-transparent"
                            priority
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
