"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { AboutPageData } from "@/types/acf";
// import { Montserrat, Poppins } from "next/font/google"; // Removed

import { cn } from "@/lib/utils";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronRight, ChevronLeft, Quote } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// Font imports removed


interface AboutContentProps {
    data: AboutPageData;
}

export default function AboutContent({ data }: AboutContentProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const mainRef = useRef<HTMLDivElement>(null);

    // Slider Autoplay
    useEffect(() => {
        if (!data?.doctor_image_aboutme_page?.length) return;
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % data.doctor_image_aboutme_page.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [data]);

    // GSAP Animations
    useEffect(() => {
        if (!mainRef.current) return;
        const ctx = gsap.context(() => {
            const sections = gsap.utils.toArray<HTMLElement>(".reveal-section");
            sections.forEach((section) => {
                gsap.fromTo(
                    section,
                    { opacity: 0, y: 50 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: section,
                            start: "top 85%",
                        },
                    }
                );
            });
        }, mainRef);

        return () => ctx.revert();
    }, []);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % data.doctor_image_aboutme_page.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + data.doctor_image_aboutme_page.length) % data.doctor_image_aboutme_page.length);
    };

    return (
        <div ref={mainRef}>
            {/* 1. Doctor Profile Section */}
            <section className="py-20 pb-20 px-4 md:px-8 bg-slate-50">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left: Image Slider */}
                        <div className="relative aspect-[3/4] md:aspect-[4/5] w-full max-w-lg mx-auto rounded-3xl overflow-hidden shadow-2xl reveal-section">
                            {data.doctor_image_aboutme_page.map((item, index) => (
                                <div
                                    key={index}
                                    className={cn(
                                        "absolute inset-0 transition-opacity duration-1000 ease-in-out",
                                        index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                                    )}
                                >
                                    {item.doctor_img_aboutme_page?.url && (
                                        <Image
                                            src={item.doctor_img_aboutme_page.url}
                                            alt="Doctor Profile"
                                            fill
                                            className="object-cover"
                                            priority={index === 0}
                                        />
                                    )}
                                </div>
                            ))}

                            {/* Slider Controls */}
                            {data.doctor_image_aboutme_page.length > 1 && (
                                <>
                                    <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/30 backdrop-blur-md p-2 rounded-full hover:bg-white/50 transition-colors text-white">
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/30 backdrop-blur-md p-2 rounded-full hover:bg-white/50 transition-colors text-white">
                                        <ChevronRight size={24} />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Right: Intro Details */}
                        <div className="space-y-8 reveal-section">
                            <h1 className={cn("text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#3C3E41] leading-tight font-montserrat")}>
                                {data.doctor_name}
                            </h1>
                            <div
                                className={cn("prose prose-lg prose-slate max-w-none text-slate-600 leading-relaxed font-poppins")}
                                dangerouslySetInnerHTML={{ __html: data.doctor_about_in_about_page }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Professional Info Grid */}
            <section className="py-20 px-4 md:px-8 bg-white">
                <div className="container mx-auto max-w-6xl space-y-24">

                    {/* Clinical Focus */}
                    <div className="reveal-section border-l-4 border-[#05668D] pl-6 md:pl-10">
                        <h2 className={cn("text-2xl md:text-3xl font-bold text-[#3C3E41] mb-6 uppercase tracking-wide font-montserrat")}>
                            {data.clinical_and_community_focus_sub_heading}
                        </h2>
                        <div
                            className={cn("prose prose-lg prose-slate max-w-none text-slate-600 font-poppins")}
                            dangerouslySetInnerHTML={{ __html: data.clinical_and_community_focus_description }}
                        />
                    </div>

                    {/* Education */}
                    <div className="reveal-section border-l-4 border-[#02C39A] pl-6 md:pl-10">
                        <h2 className={cn("text-2xl md:text-3xl font-bold text-[#3C3E41] mb-6 uppercase tracking-wide font-montserrat")}>
                            {data["education_&_professional_background_sub_heading"]}
                        </h2>
                        <div
                            className={cn("prose prose-lg prose-slate max-w-none text-slate-600 font-poppins")}
                            dangerouslySetInnerHTML={{ __html: data["education_&_professional_background_description"] }}
                        />
                    </div>

                    {/* Philosophy */}
                    <div className="reveal-section bg-slate-50 p-8 md:p-12 rounded-3xl relative overflow-hidden">
                        <Quote className="absolute top-6 right-8 text-slate-200 w-24 h-24 md:w-32 md:h-32 -rotate-12" />
                        <div className="relative z-10">
                            <h2 className={cn("text-2xl md:text-3xl font-bold text-[#05668D] mb-6 uppercase tracking-wide font-montserrat")}>
                                {data.professional_philosophy_sub_heading}
                            </h2>
                            <div
                                className={cn("prose prose-lg prose-slate max-w-none text-slate-700 italic font-medium font-poppins")}
                                dangerouslySetInnerHTML={{ __html: data.professional_philosophy_description }}
                            />
                        </div>
                    </div>

                </div>
            </section>

            {/* 3. Suraksha Life Section */}
            <section className="py-20 px-4 md:px-8 bg-[#05668D] text-white">
                <div className="container mx-auto max-w-5xl text-center reveal-section">
                    <h2 className={cn("text-3xl md:text-5xl font-extrabold mb-8 font-montserrat")}>
                        {data.about_suraksha_life_title}
                    </h2>
                    <div
                        className={cn("prose prose-xl prose-invert max-w-none leading-relaxed opacity-90 mx-auto font-poppins")}
                        dangerouslySetInnerHTML={{ __html: data.suraksha_life_description_ }}
                    />
                </div>
            </section>

            {/* 4. Core Focus & Impact */}
            <section className="py-20 px-4 md:px-8 bg-slate-50">
                <div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12">

                    {/* Core Focus */}
                    <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg reveal-section">
                        <h3 className={cn("text-2xl font-bold text-[#3C3E41] mb-6 font-montserrat")}>
                            {data.our_core_focus_areas_sub_heading}
                        </h3>
                        <div
                            className={cn("prose prose-slate max-w-none text-slate-600 font-poppins")}
                            dangerouslySetInnerHTML={{ __html: data.our_core_focus_areas_description }}
                        />
                    </div>

                    {/* Impact */}
                    <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg reveal-section">
                        <h3 className={cn("text-2xl font-bold text-[#3C3E41] mb-6 font-montserrat")}>
                            {data.our_impact_sub_heading}
                        </h3>
                        <div
                            className={cn("prose prose-slate max-w-none text-slate-600 font-poppins")}
                            dangerouslySetInnerHTML={{ __html: data.our_impact_description }}
                        />
                    </div>
                </div>
            </section>

            {/* 5. Commitment */}
            <section className="py-20 px-4 md:px-8 bg-white text-center">
                <div className="container mx-auto max-w-3xl reveal-section">
                    <h2 className={cn("text-2xl md:text-3xl font-bold text-[#3C3E41] mb-8 uppercase tracking-wide font-montserrat")}>
                        {data.our_commitment}
                    </h2>
                    <div className="h-1 w-20 bg-[#02C39A] mx-auto mb-8 rounded-full"></div>
                    <div
                        className={cn("prose prose-lg prose-slate max-w-none text-slate-600 mx-auto font-poppins text-left")}
                        dangerouslySetInnerHTML={{ __html: data.our_commitment_description }}
                    />
                </div>
            </section>
        </div>
    );
}
