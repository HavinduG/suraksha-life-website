"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Montserrat, Poppins } from "next/font/google";
import { Button } from "@/components/ui/button";
import { ACFData } from "@/types/acf";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["600", "700", "800"],
});

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500"],
});

interface ShortSectionProps {
    data: ACFData;
}

const ShortSection = ({ data }: ShortSectionProps) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (!cardRef.current || !textRef.current || !imageRef.current) return;

            // Card Entry Animation
            gsap.from(cardRef.current, {
                y: 50,
                opacity: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                }
            });

            // Content Stagger Animation
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 70%",
                }
            });

            tl.from(textRef.current, {
                x: -50,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out"
            })
                .from(imageRef.current, {
                    x: 50,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.out"
                }, "-=0.6");

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    // Fallback data check
    if (!data.short_section_title && !data.short_page) return null;

    return (
        <section ref={sectionRef} className="w-full py-16 bg-[#ECF0F3] flex justify-center items-center">
            <div className="container mx-auto px-4 md:px-6 lg:px-8">
                {/* Main Card */}
                <div
                    ref={cardRef}
                    className="relative w-full bg-[linear-gradient(145deg,#E2E8EC,#FFFFFF)] rounded-[2rem] shadow-[5px_5px_15px_#D1D9E6,-5px_-5px_15px_#FFFFFF] overflow-hidden border border-white/50"
                >
                    {/* Full Cover Background Image */}
                    <div className="absolute inset-0 z-0">
                        <Image
                            src={data.short_page?.url || "http://suraksha.local/wp-content/uploads/2025/12/Gemini_Generated_Image_smfh18smfh18smfh-1.png"}
                            alt="Background"
                            fill
                            className="object-cover object-center"
                        />
                        {/* Stronger Gradient for Text Readability */}
                        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent" />
                    </div>

                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between min-h-[400px]">

                        {/* Text Content (Left) */}
                        <div
                            ref={textRef}
                            className="flex-1 p-8 md:p-12 lg:pl-16 flex flex-col items-center lg:items-start text-center lg:text-left z-10 space-y-6 max-w-2xl"
                        >
                            <h2 className={cn(
                                "text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#1E2125] leading-tight",
                                montserrat.className
                            )}>
                                {data.short_section_title}
                            </h2>

                            <p className={cn(
                                "text-slate-600 text-base md:text-lg font-medium tracking-wide",
                                poppins.className
                            )}>
                                {data.short_section_sub_title}
                            </p>

                            <div className="pt-4">
                                <Button
                                    asChild
                                    className="bg-gradient-to-r from-[#05668D] to-[#02C39A] hover:opacity-90 text-white font-bold py-7 px-10 rounded-md shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
                                >
                                    <Link href={data.button_7_link || "#"}>
                                        {data.button_7 || "Make an Appointment"}
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        {/* Right side spacer to balance layout (since image is now background) */}
                        <div className="flex-1 w-full min-h-[50px] lg:min-h-full" />
                    </div>
                </div>

                {/* Decorative Gradient Blob (Optional - keeping simplified background instead) */}
                {/* <div className="absolute top-[-50%] left-[-20%] w-[60%] h-[150%] bg-gradient-to-br from-[#05668D]/5 to-transparent rounded-full blur-3xl pointer-events-none" /> */}
            </div>
        </section>
    );
};

export default ShortSection;
