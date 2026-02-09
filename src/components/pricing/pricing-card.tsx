"use client";

import React, { useRef, useEffect } from "react";
import { PricingServiceItem } from "@/types/acf";
import { gsap } from "gsap";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PricingCardProps {
    item: PricingServiceItem;
    index: number;
}

const PricingCard: React.FC<PricingCardProps> = ({ item, index }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const { medical_service, medical_service_details, service_price, button_buy, button_buy_link } = item.acf;

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(cardRef.current, {
                y: 50,
                opacity: 0,
                duration: 0.8,
                delay: index * 0.2,
                ease: "power3.out",
            });
        }, cardRef);

        return () => ctx.revert();
    }, [index]);

    const handleMouseEnter = () => {
        gsap.to(cardRef.current, {
            y: -10,
            scale: 1.02,
            boxShadow: "0 20px 30px -10px rgba(0, 0, 0, 0.1)",
            duration: 0.3,
            ease: "power2.out",
        });
    };

    const handleMouseLeave = () => {
        gsap.to(cardRef.current, {
            y: 0,
            scale: 1,
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            duration: 0.3,
            ease: "power2.out",
        });
    };

    // Helper to parse the HTML content for features securely (stripping dangerous tags if needed, but assuming trusted source here)
    return (
        <div
            ref={cardRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={cn(
                "relative flex flex-col p-8 bg-white rounded-3xl border border-gray-100 shadow-lg transition-colors duration-300",
                "hover:border-primary/20"
            )}
        >
            {/* Shine Effect */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-3xl" />

            <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{medical_service}</h3>
                <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-primary">{service_price}</span>
                    <span className="text-sm text-gray-500">/package</span>
                </div>
            </div>

            <div className="flex-grow mb-8 prose prose-sm prose-ul:list-none prose-li:flex prose-li:gap-2 prose-li:items-start max-w-none">
                <div
                    className="[&_ul]:space-y-3 [&_li]:flex [&_li]:gap-3 [&_li]:items-start [&_li]:text-gray-600"
                    dangerouslySetInnerHTML={{ __html: medical_service_details }}
                />
            </div>

            <Link
                href={button_buy_link || "/contact"} // Default to /contact if link is empty
                className={cn(
                    "w-full py-3 px-6 rounded-xl font-semibold text-center transition-all duration-300",
                    "bg-gray-900 text-white hover:bg-primary hover:shadow-lg hover:shadow-primary/25",
                    "transform active:scale-95"
                )}
            >
                {button_buy || "Buy Now"}
            </Link>
        </div>
    );
};

export default PricingCard;
