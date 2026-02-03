"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
// import { Montserrat, Poppins } from "next/font/google"; // Removed

import { ACFData } from "@/types/acf";
import { cn } from "@/lib/utils";
import { PUBLIC_WORDPRESS_URL } from "@/lib/api";


// Font imports removed


interface FooterProps {
    data: ACFData;
}

const Footer = ({ data }: FooterProps) => {
    // Helper function to format links (consistent with Header)
    const formatLink = (link: string, name?: string) => {
        const lowerName = name?.toLowerCase().trim() || "";
        const lowerLink = link?.toLowerCase().trim() || "";

        // Manual overrides for core routes
        if (lowerName === "service" || lowerName === "services" || lowerLink.endsWith("/services") || lowerLink.endsWith("/service")) {
            return "/services";
        }

        if (lowerName === "events" || lowerName === "event" || lowerLink.endsWith("/events") || lowerLink.endsWith("/event")) {
            return "/events";
        }

        if (lowerName === "blog" || lowerName === "news" || lowerLink.endsWith("/blog")) {
            return "/blog";
        }

        if (lowerName.includes("contact") || lowerLink.endsWith("/contact")) {
            return "/contact";
        }

        if (lowerName.includes("privacy") || lowerLink.includes("privacy-policy")) {
            return "/privacy-policy";
        }

        if (lowerName.includes("refund") || lowerLink.includes("refund-policy")) {
            return "/refund-policy";
        }

        if (lowerName.includes("terms") || lowerLink.includes("terms-conditions")) {
            return "/terms-conditions";
        }

        if (lowerName === "home") {
            return "/";
        }

        if (!link) return "#";

        // Remove the WordPress domain to keep navigation internal
        const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || "http://suraksha.local";

        if (link.startsWith(wpUrl)) {
            let relative = link.replace(wpUrl, "");
            relative = relative.startsWith("/") ? relative : `/${relative}`;

            // Cleanup double slashes if any
            relative = relative.replace("//", "/");

            if (relative === "/home/" || relative === "/home") {
                return "/";
            }
            if (relative === "/about/" || relative === "/about") {
                return "/about";
            }

            return relative;
        }

        return link;
    };

    console.log("Footer Data Debug:", {
        personal: data?.dr_personal_details,
        social: data?.social_media_details,
        all: data
    });


    return (
        <footer className="w-full bg-[#ECF0F3] pt-20 pb-8">
            <div className="container mx-auto px-4 md:px-6 lg:px-8">

                {/* Main Grid Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-16">

                    {/* Column 1: Logo & Contact Info (Span 4) */}
                    <div className="lg:col-span-4 flex flex-col space-y-3">
                        {/* Logo - Sizes Decreased as requested */}
                        <div className="mb-1 mt-1">
                            <Image
                                src={data.footer_logo?.url || data.header_logo?.url || `${PUBLIC_WORDPRESS_URL}/wp-content/uploads/2026/01/logo.png`}
                                alt="Suraksha Life Logo"
                                width={160}
                                height={60}
                                className="object-contain w-36 h-auto"
                            />
                        </div>

                        <div className="flex flex-col space-y-4">
                            {/* Title */}
                            <p className={cn("text-xs font-bold text-slate-500 uppercase tracking-wider font-montserrat")}>
                                {data.footer_title_ || "SURAKSHALIFE ISLANDWIDE CANCER AWARENESS SERIES"}
                            </p>

                            {/* Contact Details - Positioned immediately below title */}
                            <ul className="space-y-2">
                                {(data.personal_details || data.dr_personal_details)?.map((detail, index) => (
                                    <li key={index} className="flex items-start space-x-3">
                                        <div className="flex-shrink-0 mt-0.5">
                                            {detail.contact_details_icon && (
                                                <Image
                                                    src={detail.contact_details_icon.url}
                                                    alt={detail.contact_title}
                                                    width={18}
                                                    height={18}
                                                    className="w-[18px] h-[18px] opacity-70"
                                                />
                                            )}
                                        </div>
                                        <span className={cn("text-sm text-[#525252] font-medium leading-relaxed max-w-[280px] font-poppins")}>
                                            {detail.contact_details}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            {/* Social Icons */}
                            <div className="flex space-x-3 pt-3">
                                {data.social_media_details?.map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.social_media_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 bg-[linear-gradient(145deg,#E2E8EC,#FFFFFF)] rounded-lg shadow-[5px_5px_15px_#D1D9E6,-5px_-5px_15px_#FFFFFF] flex items-center justify-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                                    >
                                        {social.social_media_icon && (
                                            <Image
                                                src={social.social_media_icon.url}
                                                alt="Social"
                                                width={18}
                                                height={18}
                                                className="w-[18px] h-[18px] opacity-60 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0"
                                            />
                                        )}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Quick Links (Span 4) */}
                    <div className="lg:col-span-4 lg:pl-12">
                        <h3 className={cn("text-[#05668D] font-bold text-lg mb-4 md:mb-8 uppercase tracking-wide font-montserrat")}>
                            Quick Link
                        </h3>
                        <ul className="space-y-2 md:space-y-4">
                            {data.quick_links?.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        href={formatLink(link.page_link_url, link.page_link_name)}
                                        className={cn("text-slate-600 hover:text-[#05668D] transition-colors text-[15px] font-medium block font-poppins")}
                                    >
                                        {link.page_link_name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Support (Span 4) */}
                    <div className="lg:col-span-4 lg:pl-12">
                        <h3 className={cn("text-[#05668D] font-bold text-lg mb-4 md:mb-8 uppercase tracking-wide font-montserrat")}>
                            Support
                        </h3>
                        <ul className="space-y-2 md:space-y-5">
                            {data.support?.map((item, index) => (
                                <li key={index}>
                                    <Link
                                        href={formatLink(item.support_links_url, item.support_link)}
                                        className={cn("text-slate-600 hover:text-[#05668D] transition-colors text-base font-medium font-poppins")}
                                    >
                                        {item.support_link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="pt-8 text-center">
                    <p className={cn("text-slate-500 text-sm font-medium font-poppins")}>
                        © 2025
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
