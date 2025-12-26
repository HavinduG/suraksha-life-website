"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { Montserrat, Poppins, Noto_Sans_Sinhala } from "next/font/google";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ACFData, ResourceItem } from "@/types/acf";
import { cn } from "@/lib/utils";
import { Download, FileText } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
});

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600"],
});

const notoSanhala = Noto_Sans_Sinhala({
    subsets: ["sinhala"],
    weight: ["400", "500", "600", "700"],
});



interface ResourcesProps {
    data: ACFData;
    resources: ResourceItem[];
}

const Resources = ({ data, resources }: ResourcesProps) => {
    const sectionRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(sectionRef.current, {
                // opacity: 0, removed for visibility debugging
                duration: 1,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 95%",
                },
            });

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
                        {data.res_title || "Read"}
                    </h5>
                    <h2
                        className={cn(
                            "text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#3C3E41]",
                            montserrat.className
                        )}
                    >
                        {data.res_section_title || "Resources"}
                    </h2>
                </div>

                {/* List Container */}
                <div
                    ref={containerRef}
                    className="max-w-5xl mx-auto space-y-6"
                >
                    {resources.map((item) => {
                        // Ensure ACF data exists before rendering
                        const acf = item.acf || {};

                        return (
                            <div
                                key={item.id}
                                className="resource-card group relative bg-white rounded-2xl p-3 md:p-4 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[20px_20px_60px_#d1d9e6,-20px_-20px_60px_#ffffff] cursor-pointer border border-transparent hover:border-[#05668D]/10"
                                style={{
                                    background: "linear-gradient(145deg, #ffffff, #E2E8EC)"
                                }}
                                onClick={() => handleCardClick(acf.resource_pdf?.url)}
                            >
                                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                                    {/* Image */}
                                    <div className="flex-shrink-0 w-full md:w-[100px] lg:w-[120px] aspect-[3/4] md:aspect-square relative rounded-xl overflow-hidden shadow-sm">
                                        {acf.resource_image?.url ? (
                                            <Image
                                                src={acf.resource_image.url}
                                                alt={acf.resource_title || "Resource"}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">
                                                <FileText size={32} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 text-center md:text-left space-y-1.5">
                                        <h3
                                            className={cn(
                                                "text-lg md:text-xl font-bold text-[#3C3E41] group-hover:text-[#05668D] transition-colors",
                                                montserrat.className,
                                                notoSanhala.className
                                            )}
                                        >
                                            {acf.resource_title || item.title.rendered}
                                        </h3>
                                        <div
                                            className={cn("text-slate-600 font-medium text-xs md:text-sm leading-relaxed line-clamp-2", poppins.className, notoSanhala.className)}
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
                                                className="block p-3 rounded-full bg-[#ECF0F3] text-slate-500 hover:text-[#05668D] hover:bg-white shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] transition-all hover:scale-110 active:scale-95"
                                                title="Download PDF"
                                            >
                                                {acf.download_icon?.url ? (
                                                    <Image
                                                        src={acf.download_icon.url}
                                                        alt="Download"
                                                        width={20}
                                                        height={20}
                                                        className="w-5 h-5"
                                                    />
                                                ) : (
                                                    <Download size={20} />
                                                )}
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    );
};

export default Resources;
