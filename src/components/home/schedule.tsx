"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Montserrat, Poppins } from "next/font/google";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { ACFData } from "@/types/acf";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
});

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600"],
});

interface ScheduleProps {
    data: ACFData;
}

const Schedule = ({ data }: ScheduleProps) => {
    const sectionRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(containerRef.current, {
                y: 50,
                opacity: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 85%",
                },
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="w-full py-20 bg-[#ECF0F3] relative overflow-hidden"
        >
            <div className="container mx-auto px-4 md:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center mb-16 space-y-4">
                    <h5
                        className={cn(
                            "text-sm font-bold tracking-[0.2em] text-[#05668D] uppercase",
                            montserrat.className
                        )}
                    >
                        {data.sce_title || "Weekly 7 Days"}
                    </h5>
                    <div className="max-w-4xl mx-auto">
                        <h2
                            className={cn(
                                "text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#3C3E41] leading-tight",
                                montserrat.className
                            )}
                        >
                            {data.sce_section_title || "My Regular Schedule"}
                        </h2>
                    </div>
                </div>

                {/* Main Card */}
                <div
                    ref={containerRef}
                    className="rounded-3xl p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row gap-12 items-center transition-all duration-300"
                    style={{
                        background: "linear-gradient(145deg, #E2E8EC, #FFFFFF)",
                        boxShadow: "5px 5px 20px #D1D9E6, -5px -5px 20px #FFFFFF",
                    }}
                >
                    {/* Left Column: Text & List */}
                    <div className="flex-1 w-full space-y-8">
                        <div>
                            <p className={cn("text-slate-500 font-medium mb-2", poppins.className)}>
                                {data.sce_sub_topic}
                            </p>
                            <h3 className={cn("text-3xl md:text-4xl font-extrabold text-[#3C3E41]", montserrat.className)}>
                                {data.sce_main_topic}
                            </h3>
                        </div>

                        {/* List Items */}
                        <div className="space-y-6">
                            {data.scedule_details?.map((item, index) => (
                                <div key={index} className="flex items-start gap-4">
                                    <div className="mt-1 flex-shrink-0 w-6 h-6 relative">
                                        {/* Dynamic Icon from ACF */}
                                        {item.schedule_icon && typeof item.schedule_icon !== 'boolean' && item.schedule_icon.url ? (
                                            <Image
                                                src={item.schedule_icon.url}
                                                alt={item.schedule_icon.alt || "icon"}
                                                width={24}
                                                height={24}
                                                className="object-contain" // Keep original aspect ratio
                                            />
                                        ) : (
                                            // Fallback if no icon matches
                                            <div className="w-6 h-6 bg-slate-200 rounded-full" />
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <p className={cn("text-sm font-bold text-[#3C3E41]", montserrat.className)}>
                                            {item.schedule_text_1}
                                        </p>
                                        <p className={cn("text-sm md:text-base text-slate-600 font-medium", poppins.className)}>
                                            {item.schedule_text_2}
                                        </p>
                                        {/* Optional separator line */}
                                        {index < data.scedule_details.length - 1 && (
                                            <div className="w-full h-px bg-slate-200 mt-4 opacity-50" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* CTA Button */}
                        <div className="pt-4">
                            <Button
                                asChild
                                className="bg-gradient-to-r from-[#05668D] to-[#02C39A] hover:opacity-90 text-white font-bold py-6 px-8 rounded-md shadow-md transition-transform hover:scale-105"
                            >
                                <Link href={data.button_4_link || "#"}>
                                    {data.button_4 || "Book An Appointment"}
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Right Column: Image */}
                    <div className="w-full lg:w-[400px] flex-shrink-0 flex justify-center lg:justify-end">
                        <div className="relative w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border-4 border-white/50">
                            {data.schedule_doctor_image?.url ? (
                                <Image
                                    src={data.schedule_doctor_image.url}
                                    alt={data.schedule_doctor_image.alt || "Doctor Schedule Profile"}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">
                                    No Image
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Schedule;
