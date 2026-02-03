"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
// import { Montserrat, Poppins } from "next/font/google"; // Removed

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ACFData } from "@/types/acf";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(ScrollTrigger);

// Font imports removed


interface AboutMeProps {
    data: ACFData;
}

const AboutMe = ({ data }: AboutMeProps) => {
    const [isExpanded, setIsExpanded] = React.useState(false);
    const sectionRef = useRef<HTMLElement>(null);
    const imageContainerRef = useRef<HTMLDivElement>(null);
    const textContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animate Image
            gsap.from(imageContainerRef.current, {
                opacity: 0,
                x: -50,
                duration: 1,
                scrollTrigger: {
                    trigger: imageContainerRef.current,
                    start: "top 80%",
                },
            });

            // Animate Text
            gsap.from(textContainerRef.current, {
                opacity: 0,
                x: 50,
                duration: 1,
                scrollTrigger: {
                    trigger: textContainerRef.current,
                    start: "top 80%",
                },
            });

            // Animate Divider
            gsap.to(".divider-anim-about", {
                width: "100%",
                opacity: 1,
                duration: 1.5,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "bottom 95%", // Trigger when bottom of section is near viewport bottom
                    toggleActions: "play none none reverse"
                }
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    // Placeholder until we determine how to handle "dynamic" swap without a second image in data
    // For now, scale effect on hover matches "dynamic" feeling

    // Parse HTML description safely
    const createMarkup = (html: string) => {
        return { __html: html };
    };

    return (
        <section
            ref={sectionRef}
            className="w-full pt-20 pb-16 bg-[#ECF0F3] overflow-hidden relative"
        >
            <div className="container mx-auto px-4 md:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-0 items-center">
                {/* Left Side: Image with Frame */}
                <div
                    ref={imageContainerRef}
                    className="relative flex justify-center"
                >
                    <div
                        className="relative p-6 bg-[#ECF0F3] rounded-xl transition-transform duration-500 hover:scale-[1.02]"
                        style={{
                            background: "linear-gradient(145deg, #E2E8EC, #E2E8EC)",
                            boxShadow: "5px 5px 15px #D1D9E6, -5px -5px 15px #FFFFFF",
                        }}
                    >
                        <div className="relative w-[300px] h-[400px] md:w-[400px] md:h-[500px] rounded-lg overflow-hidden">
                            {/* Primary Image */}
                            <Image
                                src={data.doctor_about_image.url}
                                alt={data.doctor_about_image.alt || data.am_doctor_name}
                                fill
                                className="object-cover object-top transition-transform duration-700 hover:scale-110"
                            />
                        </div>
                    </div>
                </div>

                {/* Right Side: Text Content */}
                <div ref={textContainerRef} className="flex flex-col space-y-6 text-left lg:-ml-18 lg:pr-12">
                    <div className="space-y-2">
                        <h4
                            className={cn(
                                "text-sm font-bold tracking-[0.2em] text-[#05668D] uppercase font-montserrat"

                            )}
                        >
                            {data.am_title}
                        </h4>
                        <h2
                            className={cn(
                                "text-4xl md:text-5xl font-extrabold text-[#3C3E41] font-montserrat"

                            )}
                        >
                            {/* Doctor Name - assuming format "Dr. Name (MBBS)" */}
                            {data.am_doctor_name.split("(")[0]}
                            <span className="text-2xl font-bold block md:inline md:ml-2 text-[#3C3E41]">
                                {data.am_doctor_name.includes("(") ? `(${data.am_doctor_name.split("(")[1]}` : ""}
                            </span>
                        </h2>
                    </div>

                    {/* Description with Expand/Collapse */}
                    <div className="relative">
                        <div
                            className={cn(
                                "text-slate-600 text-base leading-relaxed space-y-4 prose max-w-none prose-p:my-2 prose-strong:text-[#3C3E41] overflow-hidden transition-[max-height] duration-500 ease-in-out font-poppins",

                                isExpanded ? "max-h-[1000px]" : "max-h-[150px]"
                            )}
                            dangerouslySetInnerHTML={createMarkup(data.doctor_about_description)}
                        />

                        {/* Gradient Overlay (only when collapsed) */}
                        <div
                            className={cn(
                                "absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#ECF0F3] to-transparent pointer-events-none transition-opacity duration-300",
                                isExpanded ? "opacity-0" : "opacity-100"
                            )}
                        />
                    </div>

                    {/* Toggle Button */}
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className={cn(
                            "text-[#05668D] font-bold text-sm uppercase tracking-wider hover:text-[#02C39A] transition-colors flex items-center gap-2 mt-2 group font-montserrat"

                        )}
                    >
                        {isExpanded ? (
                            <>
                                Show Less
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-y-1 transition-transform"><path d="m18 15-6-6-6 6" /></svg>
                            </>
                        ) : (
                            <>
                                Read More
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-y-1 transition-transform"><path d="m6 9 6 6 6-6" /></svg>
                            </>
                        )}
                    </button>

                    <div className="pt-4">
                        <Button
                            asChild
                            className="bg-gradient-to-r from-[#05668D] to-[#02C39A] text-white hover:opacity-90 transition-opacity px-8 py-6 rounded-md text-lg font-medium shadow-lg hover:shadow-xl"
                        >
                            <Link href="/about">
                                {data.button_2}
                            </Link>
                        </Button>
                    </div>
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
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-1 bg-[#DCE1E4] rounded-full opacity-20 divider-anim-about"
                />
            </div>
        </section>
    );
};

export default AboutMe;
