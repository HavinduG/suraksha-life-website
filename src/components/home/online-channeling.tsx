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

interface OnlineChannelingProps {
    data: ACFData;
}

const OnlineChanneling = ({ data }: OnlineChannelingProps) => {
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

            // Stagger animation for list items
            gsap.from(".channeling-item", {
                x: 20,
                opacity: 0,
                duration: 0.5,
                stagger: 0.1,
                scrollTrigger: {
                    trigger: ".channeling-list",
                    start: "top 90%",
                }
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
                        {data.oc_title || "Online Channeling"}
                    </h5>
                    <div className="max-w-4xl mx-auto">
                        <h2
                            className={cn(
                                "text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#3C3E41] leading-tight",
                                montserrat.className
                            )}
                        >
                            {data.oc_section_title || "Online Doctor Channeling"}
                        </h2>
                    </div>
                </div>

                {/* Main Card */}
                <div
                    ref={containerRef}
                    className="max-w-5xl mx-auto rounded-3xl p-6 md:p-8 lg:p-0 flex flex-col lg:flex-row shadow-2xl overflow-hidden bg-white"
                    style={{
                        background: "linear-gradient(145deg, #ffffff, #E2E8EC)",
                        boxShadow: "20px 20px 60px #d1d9e6, -20px -20px 60px #ffffff"
                    }}
                >
                    {/* Left Column: Image */}
                    <div className="w-full lg:w-5/12 relative min-h-[400px] lg:min-h-full">
                        {data.channeling_doctor_image?.url ? (
                            <Image
                                src={data.channeling_doctor_image.url}
                                alt={data.channeling_doctor_image.alt || "Online Consultation"}
                                fill
                                className="object-cover object-center lg:object-left-top"
                            />
                        ) : (
                            <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">
                                Doctor Image
                            </div>
                        )}
                    </div>

                    {/* Right Column: Content */}
                    <div className="flex-1 p-6 md:p-8 lg:p-10 space-y-5">

                        {/* Booking Topic / Intro */}
                        <div
                            className={cn("text-lg font-bold text-[#3C3E41] leading-snug", montserrat.className)}
                            dangerouslySetInnerHTML={{ __html: data.booking_topic }}
                        />

                        {/* Channeling List */}
                        <div className="channeling-list space-y-2">
                            {data.chaneling_list?.map((item, index) => (
                                <div key={index} className="channeling-item flex items-center gap-3 group">
                                    <div className="flex-shrink-0 w-4 h-4 text-[#05668D] transition-transform duration-300 group-hover:scale-110">
                                        {item.channeling_icon?.url ? (
                                            <Image
                                                src={item.channeling_icon.url}
                                                alt="icon"
                                                width={16}
                                                height={16}
                                                className="w-full h-full"
                                            />
                                        ) : (
                                            <div className="w-2 h-2 rounded-full bg-[#05668D]" />
                                        )}
                                    </div>
                                    <span className={cn("text-slate-600 font-medium", poppins.className)}>
                                        {item.channeling_text}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Payment Options */}
                        <div className="py-4 border-t border-slate-200/60">
                            <h4 className={cn("text-lg font-bold text-[#3C3E41] mb-6", montserrat.className)}>
                                {data.payment_title || "Payment Options:"}
                            </h4>
                            <div className="space-y-4">
                                {data.payment_options?.map((item, index) => (
                                    <div key={index} className="flex items-center gap-4 transition-all duration-300 hover:translate-x-1">
                                        <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
                                            {item.payment_image?.url ? (
                                                <Image
                                                    src={item.payment_image.url}
                                                    alt="payment icon"
                                                    width={24}
                                                    height={24}
                                                    className="object-contain w-auto h-auto"
                                                />
                                            ) : (
                                                <div className="w-4 h-4 bg-slate-300 rounded" />
                                            )}
                                        </div>
                                        <span className={cn("text-slate-600 font-medium text-sm", poppins.className)}>
                                            {item.payment_text}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CTA Button */}
                        <div>
                            <Button
                                asChild
                                className="bg-gradient-to-r from-[#05668D] to-[#02C39A] hover:opacity-90 text-white font-bold py-6 px-8 rounded-md shadow-md transition-transform hover:scale-105"
                            >
                                <Link href={data.button_5_link || ""}>
                                    {data.button_5 || "Book Online Consultation"}
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OnlineChanneling;
