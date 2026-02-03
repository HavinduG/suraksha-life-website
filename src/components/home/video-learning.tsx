"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
// import { Montserrat, Poppins } from "next/font/google"; // Removed

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { ACFData, VideoItem, ShortItem } from "@/types/acf";
import { cn } from "@/lib/utils";
import { Play, X, ChevronLeft, ChevronRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// Font imports removed


interface VideoLearningProps {
    data: ACFData;
    videos: VideoItem[];
    shorts: ShortItem[];
}

const VideoLearning = ({ data, videos, shorts }: VideoLearningProps) => {
    const sectionRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const sliderRef = useRef<HTMLDivElement>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentVideoUrl, setCurrentVideoUrl] = useState("");

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (!containerRef.current) return;

            gsap.from(containerRef.current, {
                y: 50,
                opacity: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 85%",
                },
            });

            // Animate Divider
            gsap.to(".divider-anim-video", {
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

    const openVideo = (url: string) => {
        // Convert to embed URL
        let embedUrl = url;
        if (url.includes("youtu.be")) {
            const id = url.split("youtu.be/")[1]?.split("?")[0];
            embedUrl = `https://www.youtube.com/embed/${id}?autoplay=1`;
        } else if (url.includes("youtube.com/watch")) {
            const urlParams = new URLSearchParams(new URL(url).search);
            const id = urlParams.get("v");
            embedUrl = `https://www.youtube.com/embed/${id}?autoplay=1`;
        } else if (url.includes("youtube.com/shorts")) {
            const id = url.split("shorts/")[1]?.split("?")[0];
            embedUrl = `https://www.youtube.com/embed/${id}?autoplay=1`;
        }

        setCurrentVideoUrl(embedUrl);
        setIsModalOpen(true);
    };

    const scrollSlider = (direction: 'left' | 'right') => {
        if (sliderRef.current) {
            const { clientWidth } = sliderRef.current;
            const scrollAmount = clientWidth; // Scroll by full view width
            sliderRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    // Split videos: 1st is Featured, next 2 are side list
    const featuredVideo = videos[0];
    const sideVideos = videos.slice(1, 3);

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
                        {data.v_title || "Subscribe us on youtube"}
                    </h5>
                    <h2
                        className={cn(
                            "text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#3C3E41] font-montserrat"

                        )}
                    >
                        {data.v_section_title || "Video Learning Hub"}
                    </h2>
                    <p className={cn("text-slate-600 max-w-2xl mx-auto font-poppins")}>
                        {data.v_sub_topic}
                    </p>
                </div>

                {/* Main Card */}
                <div
                    ref={containerRef}
                    className="max-w-7xl mx-auto rounded-3xl p-6 md:p-8 bg-white"
                    style={{
                        background: "linear-gradient(145deg, #ffffff, #E2E8EC)",
                        boxShadow: "20px 20px 60px #d1d9e6, -20px -20px 60px #ffffff"
                    }}
                >
                    {/* Top Section: Featured + Side Videos */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                        {/* Featured Video (Left - Larger) */}
                        {featuredVideo && (
                            <div className="lg:col-span-2 relative group cursor-pointer rounded-2xl overflow-hidden shadow-lg aspect-video" onClick={() => openVideo(featuredVideo.acf.video_link)}>
                                {featuredVideo.acf.video_image?.url ? (
                                    <Image
                                        src={featuredVideo.acf.video_image.url}
                                        alt={featuredVideo.title.rendered}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-slate-800" />
                                )}
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-colors group-hover:bg-black/20">
                                    <Play className="w-16 h-16 text-white opacity-80 group-hover:scale-110 transition-transform" fill="currentColor" />
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                                    <h3 className={cn("text-white text-xl md:text-2xl font-bold font-montserrat")}
                                        dangerouslySetInnerHTML={{ __html: featuredVideo.title.rendered }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Side Videos (Right - Stacked) */}
                        <div className="flex flex-col gap-6">
                            {sideVideos.map((video) => (
                                <div key={video.id} className="relative group cursor-pointer rounded-xl overflow-hidden shadow-md flex-1 aspect-video lg:aspect-auto" onClick={() => openVideo(video.acf.video_link)}>
                                    {video.acf.video_image?.url ? (
                                        <Image
                                            src={video.acf.video_image.url}
                                            alt={video.title.rendered}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-slate-800" />
                                    )}
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-colors group-hover:bg-black/20">
                                        <Play className="w-10 h-10 text-white opacity-80 group-hover:scale-110 transition-transform" fill="currentColor" />
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                                        <h4 className={cn("text-white text-sm font-bold line-clamp-2 font-montserrat")}
                                            dangerouslySetInnerHTML={{ __html: video.title.rendered }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Section: Shorts Slider */}
                    <div className="relative px-4 md:px-12">
                        {/* Navigation Arrows */}
                        <button
                            onClick={() => scrollSlider('left')}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-md text-slate-600 hover:text-[#05668D] hover:scale-110 transition-all hidden md:flex"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={() => scrollSlider('right')}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-md text-slate-600 hover:text-[#05668D] hover:scale-110 transition-all hidden md:flex"
                        >
                            <ChevronRight size={24} />
                        </button>

                        {/* Slider */}
                        <div
                            ref={sliderRef}
                            className="flex gap-4 overflow-x-auto pb-6 snap-x custom-scrollbar"
                            style={{
                                scrollbarWidth: 'thin',
                                scrollbarColor: '#05668D #ECF0F3'
                            }}
                        >
                            <style jsx>{`
                                .custom-scrollbar::-webkit-scrollbar {
                                    height: 6px;
                                }
                                .custom-scrollbar::-webkit-scrollbar-track {
                                    background: #ECF0F3;
                                    border-radius: 10px;
                                }
                                .custom-scrollbar::-webkit-scrollbar-thumb {
                                    background: #05668D;
                                    border-radius: 10px;
                                }
                                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                                    background: #02C39A;
                                }
                            `}</style>
                            {shorts.map((short) => (
                                <div
                                    key={short.id}
                                    className="flex-shrink-0 w-[140px] md:w-[160px] aspect-[9/16] relative group cursor-pointer rounded-xl overflow-hidden shadow-sm snap-start"
                                    onClick={() => openVideo(short.acf.short_video_link)}
                                >
                                    {short.acf.short_video_image?.url ? (
                                        <Image
                                            src={short.acf.short_video_image.url}
                                            alt={short.title.rendered}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-slate-800" />
                                    )}
                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                        <Play className="w-8 h-8 text-white opacity-80" fill="currentColor" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Watch More Button */}
                    <div className="mt-8 text-center space-y-2">
                        <Button
                            asChild
                            className="bg-gradient-to-r from-[#05668D] to-[#02C39A] hover:opacity-90 text-white font-bold py-6 px-8 rounded-md shadow-md transition-transform hover:scale-105"
                        >
                            <Link href={data.button_6_link || ""}>
                                {data.button_6 || "Watch More"}
                            </Link>
                        </Button>
                        <p className={cn("text-xs font-semibold text-slate-500 uppercase tracking-widest font-montserrat")}>
                            {data.v_bottom_small_text}
                        </p>
                    </div>

                </div>
            </div>

            {/* Video Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="relative w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-white/20 transition-colors"
                        >
                            <X size={24} />
                        </button>
                        <iframe
                            src={currentVideoUrl}
                            className="w-full h-full"
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                        />
                    </div>
                    {/* Close interaction overlay */}
                    <div className="absolute inset-0 -z-10" onClick={() => setIsModalOpen(false)} />
                </div>
            )}
            {/* Dynamic Neumorphic Divider */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-[2px] rounded-full opacity-50">
                <div
                    className="w-full h-full bg-[#ECF0F3]"
                    style={{
                        boxShadow: "inset 2px 2px 5px #DCE1E4, inset -2px -2px 5px #FFFFFF"
                    }}
                />
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-1 bg-[#DCE1E4] rounded-full opacity-20 divider-anim-video"
                />
            </div>
        </section>
    );
};

export default VideoLearning;
