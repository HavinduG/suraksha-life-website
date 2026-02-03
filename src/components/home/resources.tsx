"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
// import { Montserrat, Poppins, Noto_Sans_Sinhala } from "next/font/google"; // Removed

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ACFData, ResourceItem } from "@/types/acf";
import { cn } from "@/lib/utils";
import { Download, FileText } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// Font imports removed




interface ResourcesProps {
    data: ACFData;
    resources: ResourceItem[];
}

const Resources = ({ data, resources }: ResourcesProps) => {
    const sectionRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (!sectionRef.current) return;

            gsap.from(sectionRef.current, {
                // opacity: 0, removed for visibility debugging
                duration: 1,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 95%",
                },
            });

            if (containerRef.current) {
                gsap.fromTo(".resource-card",
                    {
                        y: 50,
                        opacity: 0,
                        scale: 0.95
                    },
                    {
                        y: 0,
                        opacity: 1,
                        scale: 1,
                        duration: 0.8,
                        stagger: 0.15,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: containerRef.current,
                            start: "top bottom-=100", // Safer visible trigger
                            toggleActions: "play none none reverse"
                        },
                    }
                );
            }

            // Animate Divider
            gsap.to(".divider-anim-resources", {
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

    const handleCardClick = (pdfUrl: string) => {
        if (pdfUrl) {
            window.open(pdfUrl, '_blank');
        }
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
                        {data.res_title || "Read"}
                    </h5>
                    <h2
                        className={cn(
                            "text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#3C3E41] font-montserrat"

                        )}
                    >
                        {data.res_section_title || "Resources"}
                    </h2>
                </div>

                {/* List Container - Reverted to single column for Desktop as per previous design */}
                <div
                    ref={containerRef}
                    className="max-w-5xl mx-auto space-y-4 md:space-y-6"
                >
                    {resources.map((item) => {
                        // Ensure ACF data exists before rendering
                        const acf = item.acf || {};

                        return (
                            <div
                                key={item.id}
                                className="resource-card group relative bg-white rounded-xl p-3 md:p-6 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[20px_20px_60px_#d1d9e6,-20px_-20px_60px_#ffffff] cursor-pointer border border-transparent hover:border-[#05668D]/10 flex flex-row items-center gap-3 md:gap-6"
                                style={{
                                    background: "linear-gradient(145deg, #ffffff, #E2E8EC)"
                                }}
                                onClick={() => handleCardClick(acf.resource_pdf?.url)}
                            >
                                {/* Image - Compact Thumbnail for Mobile, Larger for Desktop */}
                                <div className="flex-shrink-0 w-[80px] md:w-[100px] lg:w-[120px] aspect-square relative rounded-lg overflow-hidden shadow-sm">
                                    {acf.resource_image?.url ? (
                                        <Image
                                            src={acf.resource_image.url}
                                            alt={acf.resource_title || "Resource"}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">
                                            <FileText size={24} />
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 text-left space-y-1 w-full min-w-0">
                                    <h3
                                        className={cn(
                                            "text-sm md:text-xl font-bold text-[#3C3E41] group-hover:text-[#05668D] transition-colors line-clamp-2 leading-tight font-montserrat font-sinhala"

                                        )}
                                    >
                                        {acf.resource_title || item.title.rendered}
                                    </h3>
                                    <div
                                        className={cn("text-slate-500 font-medium text-[10px] md:text-sm leading-tight line-clamp-2 font-poppins font-sinhala")}
                                        dangerouslySetInnerHTML={{ __html: acf.resource_description || "" }}
                                    />
                                </div>

                                {/* Download Action */}
                                <div className="flex-shrink-0 relative z-20" onClick={(e) => e.stopPropagation()}>
                                    {acf.resource_pdf?.url && (
                                        <a
                                            href={acf.resource_pdf.url}
                                            download
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block p-2 md:p-3 rounded-full bg-[#ECF0F3] text-slate-500 hover:text-[#05668D] hover:bg-white shadow-sm md:shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] transition-all hover:scale-110 active:scale-95"
                                            title="Download PDF"
                                        >
                                            <Download className="w-4 h-4 md:w-5 md:h-5" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        )
                    })}
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
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-1 bg-[#DCE1E4] rounded-full opacity-20 divider-anim-resources"
                />
            </div>
        </section>
    );
};

export default Resources;
