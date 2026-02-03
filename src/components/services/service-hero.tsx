"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
// import { Montserrat } from "next/font/google"; // Removed

import { cn } from "@/lib/utils";
import { Stethoscope, Pill, HeartPulse, Activity } from "lucide-react"; // Medical icons

// Font imports removed


export default function ServiceHero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const bgShape1Ref = useRef<HTMLDivElement>(null);
    const bgShape2Ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline();

            // Initial Load Animation
            tl.from(containerRef.current, {
                opacity: 0,
                duration: 1,
                ease: "power2.out",
            })
                .from(titleRef.current, {
                    y: 100,
                    opacity: 0,
                    duration: 1.2,
                    ease: "back.out(1.7)",
                }, "-=0.5")
                .from(subtitleRef.current, {
                    y: 50,
                    opacity: 0,
                    duration: 1,
                    ease: "power2.out",
                }, "-=0.8")
                .from([bgShape1Ref.current, bgShape2Ref.current], {
                    scale: 0,
                    opacity: 0,
                    duration: 1.5,
                    ease: "elastic.out(1, 0.5)",
                    stagger: 0.2
                }, "-=1.0");

            // Floating Particles Animation
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

                const xPos = (clientX / innerWidth - 0.5) * 2;
                const yPos = (clientY / innerHeight - 0.5) * 2;

                gsap.to(bgShape1Ref.current, {
                    x: xPos * 30,
                    y: yPos * 30,
                    duration: 1,
                    ease: "power2.out"
                });

                gsap.to(bgShape2Ref.current, {
                    x: xPos * -30,
                    y: yPos * -30,
                    duration: 1,
                    ease: "power2.out"
                });

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
            className="relative w-full h-[50vh] min-h-[450px] flex items-center justify-center overflow-hidden bg-[#e0f7fa] perspective-[1000px]"
        >
            {/* Background Decor Shapes */}
            <div className="absolute inset-0 w-full h-full pointer-events-none">
                <div
                    ref={bgShape1Ref}
                    className="absolute top-[-10%] right-[10%] w-[35%] h-[55%] bg-[#0097a7]/10 rounded-full blur-[80px]"
                />
                <div
                    ref={bgShape2Ref}
                    className="absolute bottom-[-10%] left-[5%] w-[40%] h-[60%] bg-[#05668D]/10 rounded-full blur-[80px]"
                />
            </div>

            {/* Floating Medical Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
                <Stethoscope className="floating-particle absolute top-[15%] left-[20%] text-[#05668D]" size={36} />
                <Pill className="floating-particle absolute top-[65%] left-[15%] text-[#02C39A]" size={32} />
                <HeartPulse className="floating-particle absolute bottom-[25%] right-[20%] text-[#ef4444]" size={40} />
                <Activity className="floating-particle absolute top-[25%] right-[25%] text-[#05668D]" size={28} />
                <div className="floating-particle absolute top-[40%] left-[45%] w-3 h-3 rounded-full bg-[#05668D]/30" />
                <div className="floating-particle absolute bottom-[20%] left-[40%] w-5 h-5 rounded-full bg-[#02C39A]/30" />
            </div>

            <div className="container relative z-10 px-4 text-center">
                <h1
                    ref={titleRef}
                    className={cn(
                        "text-5xl md:text-8xl font-extrabold text-[#05668D] mb-6 tracking-tight font-montserrat"

                    )}
                    style={{ textShadow: "0 4px 20px rgba(5,102,141,0.15)" }}
                >
                    Our Services
                </h1>
                <p
                    ref={subtitleRef}
                    className="text-lg md:text-2xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed"
                >
                    Providing <span className="text-[#02C39A] font-bold">world-class care</span> with a <span className="text-[#0097a7] font-bold">compassionate touch</span> for your well-being.
                </p>
            </div>
        </section>
    );
}
