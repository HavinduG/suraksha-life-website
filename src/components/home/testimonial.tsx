"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ACFData } from "@/types/acf";

gsap.registerPlugin(ScrollTrigger);

interface TestimonialProps {
    data: ACFData;
}

export default function Testimonial({ data }: TestimonialProps) {
    const testimonials = data.feedback_list || [];
    const [currentIndex, setCurrentIndex] = useState(0);
    const sectionRef = useRef<HTMLElement>(null);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    // Auto-advance mechanism (optional, but good for dynamic feel)
    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 5000); // 5 seconds
        return () => clearInterval(timer);
    }, [currentIndex, testimonials.length]);


    return (
        <section ref={sectionRef} className="pt-16 pb-16 overflow-hidden bg-[#dcf3f3] relative">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-16 space-y-2">
                    {data.test_title && (
                        <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-[#568585]">
                            {data.test_title}
                        </h4>
                    )}
                    {data.test_section_title && (
                        <h2 className="text-3xl md:text-5xl font-bold text-[#2d3e3e]">
                            {data.test_section_title}
                        </h2>
                    )}
                </div>

                {/* Carousel Area */}
                <div className="relative h-[500px] flex justify-center items-center perspective-[1000px]">
                    {testimonials.map((item, index) => {
                        const length = testimonials.length;
                        // Calculate distance from current index carefully to handle wrapping
                        // We want indices to be defined as relative: -1 (left), 0 (center), 1 (right)
                        // But with array wrapping.

                        // Simple approach for 3 items:
                        // if index == current -> 0
                        // if index == (current + 1) % len -> 1
                        // if index == (current - 1 + len) % len -> -1

                        // For general case:
                        let relativePos = (index - currentIndex + length) % length;
                        // Normalize: if relativePos is, say, 2 in a 3-item list, it means -1 (Left).
                        // If it's > length/2, subtract length to get negative index.
                        if (relativePos > length / 2) relativePos -= length;

                        // Only show cards within range -1 to 1 (center + neighbors) for standard 3-card view
                        // Or render all but hide others.

                        const isCenter = relativePos === 0;
                        const isRight = relativePos === 1;
                        const isLeft = relativePos === -1;

                        // Hide items outside of the immediate -1, 0, 1 window if many items
                        if (!isCenter && !isRight && !isLeft && length > 3) return null;

                        // Styles based on position
                        let xTrans = "0%";
                        let zIndex = 10;
                        let scale = 0.85;
                        let opacity = 0.5;
                        let blur = "blur(3px)";

                        if (isCenter) {
                            xTrans = "0%";
                            zIndex = 30;
                            scale = 1.05;
                            opacity = 1;
                            blur = "blur(0px)";
                        } else if (isRight) {
                            xTrans = "60%"; // Push right
                            zIndex = 20;
                        } else if (isLeft) {
                            xTrans = "-60%"; // Push left
                            zIndex = 20;
                        }

                        return (
                            <div
                                key={item.user_photo_feedback.ID || index}
                                className={`absolute top-0 bottom-0 m-auto w-[90%] md:w-full md:max-w-md h-fit transition-all duration-700 ease-in-out ${!isCenter ? "hidden md:block" : ""}`}
                                style={{
                                    transform: `translateX(${xTrans}) scale(${scale})`,
                                    zIndex: zIndex,
                                    opacity: opacity,
                                    filter: blur
                                }}
                                onClick={() => {
                                    if (isRight) nextSlide();
                                    if (isLeft) prevSlide();
                                }}
                            >
                                <div className="bg-gradient-to-b from-[#0097a7] to-[#00bfa5] text-white p-6 md:p-8 rounded-2xl shadow-xl flex flex-col items-center text-center h-auto md:h-full cursor-pointer">
                                    {/* User Image */}
                                    <div className="relative w-28 h-28 mb-4">
                                        <div className="absolute inset-0 rounded-full border-4 border-white/20 overflow-hidden shadow-md">
                                            {item.user_photo_feedback?.url ? (
                                                <Image
                                                    src={item.user_photo_feedback.url}
                                                    alt={item.user_photo_feedback.alt || item.f_user_name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-white/20 flex items-center justify-center">
                                                    <span className="text-2xl font-bold">{item.f_user_name.charAt(0)}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Position (Primary) */}
                                    <h3 className="text-2xl font-bold mb-1">
                                        {item.f_user_position}
                                    </h3>

                                    {/* Name (Secondary) */}
                                    <div className="text-sm font-medium mb-3 opacity-90">
                                        {item.f_user_name}
                                    </div>

                                    {/* Stars */}
                                    <div className="flex space-x-1 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-5 h-5 ${i < Number(item.star_range)
                                                    ? "fill-white text-white"
                                                    : "fill-transparent text-white/40"
                                                    }`}
                                            />
                                        ))}
                                    </div>

                                    {/* Divider */}
                                    <div className="w-full h-px bg-gradient-to-r from-transparent via-white/40 to-transparent my-4"></div>

                                    {/* Description */}
                                    <p className="text-[15px] leading-relaxed opacity-95">
                                        {item.user_feedback_description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Controls */}
                <div className="flex justify-center items-center space-x-6 mt-4">
                    <button
                        onClick={prevSlide}
                        className="p-3 rounded-full bg-white/20 hover:bg-white/40 text-[#0097a7] transition-all backdrop-blur-sm"
                        aria-label="Previous Testimonial"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    {/* Dots */}
                    <div className="flex space-x-2">
                        {testimonials.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${idx === currentIndex ? "bg-[#0097a7] w-6" : "bg-[#0097a7]/30"
                                    }`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={nextSlide}
                        className="p-3 rounded-full bg-white/20 hover:bg-white/40 text-[#0097a7] transition-all backdrop-blur-sm"
                        aria-label="Next Testimonial"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
            </div>

        </section >
    );
}
