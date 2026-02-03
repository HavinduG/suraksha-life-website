"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
// import { Montserrat } from "next/font/google"; // Removed

import { cn } from "@/lib/utils";
import { Plus, Heart, Activity } from "lucide-react"; // Importing icons for floating elements

// Font imports removed


export default function AboutHero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const bgShape1Ref = useRef<HTMLDivElement>(null);
    const bgShape2Ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline();

            // Initial Load Animation
            // Removed container opacity animation to prevent flash/different loading feel
            tl.from(titleRef.current, {
                y: 100,
                opacity: 0,
                duration: 1.2,
                ease: "back.out(1.7)",
            })
                .from(subtitleRef.current, {
                    y: 50,
                    opacity: 0,
                    duration: 1,
                    ease: "power2.out",
                }, "-=0.8")
                // Animate background shapes in
                .from([bgShape1Ref.current, bgShape2Ref.current], {
                    scale: 0,
                    opacity: 0,
                    duration: 1.5,
                    ease: "elastic.out(1, 0.5)",
                    stagger: 0.2
                }, "-=1.0");

            // Floating Particles Animation (Continuous)
            gsap.to(".floating-particle", {
                y: "random(-20, 20)",
                x: "random(-20, 20)",
                rotation: "random(-180, 180)",
                duration: "random(3, 6)",
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                stagger: {
                    amount: 2,
                    from: "random"
                }
            });

            // Mouse Move Parallax Effect
            const handleMouseMove = (e: MouseEvent) => {
                if (!containerRef.current) return;
                const { clientX, clientY } = e;
                const { innerWidth, innerHeight } = window;

                // Calculate normalized mouse position (-1 to 1)
                const xPos = (clientX / innerWidth - 0.5) * 2;
                const yPos = (clientY / innerHeight - 0.5) * 2;

                // Move background shapes
                gsap.to(bgShape1Ref.current, {
                    x: xPos * 30,
                    y: yPos * 30,
                    duration: 1,
                    ease: "power2.out"
                });

                gsap.to(bgShape2Ref.current, {
                    x: xPos * -30, // Move in opposite direction
                    y: yPos * -30,
                    duration: 1,
                    ease: "power2.out"
                });

                // Subtle tilt for title
                gsap.to(titleRef.current, {
                    x: xPos * 10,
                    y: yPos * 10,
                    rotationX: -yPos * 5,
                    rotationY: xPos * 5,
                    duration: 1,
                    ease: "power1.out"
                });
            };

            window.addEventListener("mousemove", handleMouseMove);

            return () => {
                window.removeEventListener("mousemove", handleMouseMove);
            };

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={containerRef}
            className="relative w-full h-[50vh] min-h-[450px] flex items-center justify-center overflow-hidden bg-[#dcf3f3] perspective-[1000px]"
        >
            {/* Background Decor Shapes */}
            <div className="absolute inset-0 w-full h-full pointer-events-none">
                <div
                    ref={bgShape1Ref}
                    className="absolute top-[-10%] left-[-5%] w-[40%] h-[60%] bg-[#0097a7]/15 rounded-full blur-[80px]"
                />
                <div
                    ref={bgShape2Ref}
                    className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[60%] bg-[#02C39A]/15 rounded-full blur-[80px]"
                />
            </div>

            {/* Floating Medical Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
                <Plus className="floating-particle absolute top-[20%] left-[15%] text-[#05668D]" size={32} />
                <Activity className="floating-particle absolute top-[60%] left-[10%] text-[#02C39A]" size={48} />
                <Heart className="floating-particle absolute bottom-[20%] right-[15%] text-[#ef4444]" size={28} />
                <Plus className="floating-particle absolute top-[30%] right-[25%] text-[#05668D]" size={24} />
                <div className="floating-particle absolute top-[15%] left-[50%] w-4 h-4 rounded-full bg-[#05668D]/40" />
                <div className="floating-particle absolute bottom-[30%] left-[30%] w-6 h-6 rounded-full bg-[#02C39A]/40" />
            </div>

            <div className="container relative z-10 px-4 text-center">
                <h1
                    ref={titleRef}
                    className={cn(
                        "text-5xl md:text-8xl font-extrabold text-[#05668D] mb-6 tracking-tight font-montserrat"

                    )}
                    style={{ textShadow: "0 4px 20px rgba(5,102,141,0.15)" }}
                >
                    About Us
                </h1>
                <p
                    ref={subtitleRef}
                    className="text-lg md:text-2xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed"
                >
                    Dedicated to providing <span className="text-[#02C39A] font-bold">exceptional healthcare</span> and <span className="text-[#0097a7] font-bold">personalized attention</span> to every patient.
                </p>
            </div>
        </section>
    );
}
