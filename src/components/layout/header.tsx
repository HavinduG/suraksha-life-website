"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
// import { Montserrat } from "next/font/google"; // Removed

import { Button } from "@/components/ui/button";
import { ACFData } from "@/types/acf";
import { cn } from "@/lib/utils";
import { PUBLIC_WORDPRESS_URL } from "@/lib/api";


// Font imports removed


interface HeaderProps {
    data: ACFData;
}

import { usePathname } from "next/navigation";

const Header = ({ data }: HeaderProps) => {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

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

    const isActive = (link: string, name?: string) => {
        if (!link) return false;
        const formattedLink = formatLink(link, name);

        // Simple normalization: remove trailing slash
        const cleanLink = formattedLink.endsWith('/') && formattedLink.length > 1 ? formattedLink.slice(0, -1) : formattedLink;
        const cleanPath = pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname;

        return cleanLink === cleanPath;
    };

    return (
        <>
            <header
                className={cn(
                    "sticky top-0 z-50 w-full transition-all duration-300",
                    isScrolled
                        ? "bg-[#ECF0F3]/90 backdrop-blur-md shadow-md"
                        : "bg-[#ECF0F3] shadow-sm"
                )}
            >
                <div
                    className={cn(
                        "container mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between transition-all duration-300",
                        isScrolled ? "h-20" : "h-24"
                    )}
                >
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/">
                            <div
                                className={cn(
                                    "relative transition-all duration-300",
                                    isScrolled
                                        ? "h-10 w-28 md:h-12 md:w-36"
                                        : "h-12 w-36 md:h-14 md:w-44"
                                )}
                            >
                                <Image
                                    src={data.header_logo?.url || `${PUBLIC_WORDPRESS_URL}/wp-content/uploads/2026/01/logo.png`}
                                    alt="Suraksha Life Logo"
                                    fill
                                    className="object-contain object-left"
                                    priority
                                />
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-8">
                        {data.nav_bar.map((item, index) => {
                            // Normalize the link to check against current pathname
                            // Assuming item.tab_link could be absolute or relative
                            // efficient check: match end of string or exact match

                            // We need to determine if this item is active.
                            // Since usePathname is a hook, we need to call it outside the map, but we can't do that.
                            // So we must move the map content or call hook at component level. 
                            // Wait, I can only call usePathname at the top level of the component.
                            // The tool renders the whole file or chunk. I will rewrite the component start to include the hook.

                            return (
                                <Link
                                    key={index}
                                    href={formatLink(item.tab_link, item.nav_bar_tab_name)}
                                    prefetch={false}
                                    className={cn(
                                        "text-sm font-bold uppercase tracking-wide relative transition-all duration-300 transform origin-center",
                                        "after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-full after:bg-[#05668D] after:transition-transform after:duration-300 after:scale-x-0 after:origin-bottom-right hover:after:scale-x-100 hover:after:origin-bottom-left",
                                        isActive(item.tab_link, item.nav_bar_tab_name)
                                            ? "text-[#05668D] font-extrabold scale-105"
                                            : "text-slate-600 hover:text-[#05668D] hover:font-extrabold hover:scale-105 font-montserrat"

                                    )}
                                >
                                    {item.nav_bar_tab_name}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Desktop Button */}
                    <div className="hidden lg:block">
                        {/* The user didn't strictly say this button should be dynamic from data.button_header, 
                but passed empty strings in JSON for button_header. 
                However, the image shows "Book An Appointment". 
                I will fallback to "Book An Appointment" if data is empty or match the Hero button style/text if reasonable,
                but strictly following "similarity to images" means hardcoding or using hero data if not provided in header data.
                The prompt says "button_header": "", so I'll assume I should use a default text or check if I should use the one from the image.
                "Use the given images and design it similarity". Image has "Book An Appointment".
            */}
                        <Button
                            asChild
                            className="bg-gradient-to-r from-[#05668D] to-[#02C39A] hover:opacity-90 text-white font-semibold py-5 px-6 rounded-md shadow-md transition-transform hover:scale-105"
                        >
                            <Link href={data.button_header_link || "/pricing"}>
                                {data.button_header || "Book An Appointment"}
                            </Link>
                        </Button>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="lg:hidden">
                        <button
                            onClick={toggleMenu}
                            className="text-slate-700 hover:text-[#05668D] focus:outline-none"
                        >
                            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Navigation Drawer - Moved OUTSIDE header to prevent stacking context issues */}
            {isMenuOpen && (
                <>
                    {/* Backdrop with stronger blur */}
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-md z-[60] lg:hidden transition-all duration-300"
                        onClick={() => setIsMenuOpen(false)}
                    />

                    {/* Drawer Panel - Fixed width with margin to show blurred content behind */}
                    <div
                        className={cn(
                            "fixed inset-y-0 right-0 z-[70] w-[85vw] max-w-[350px] bg-white shadow-2xl transform transition-transform duration-300 ease-out lg:hidden flex flex-col",
                            isMenuOpen ? "translate-x-0" : "translate-x-full"
                        )}
                    >
                        {/* Drawer Header */}
                        <div className="flex items-center justify-between px-6 py-6 border-b border-slate-100 bg-[#ECF0F3]/50">
                            <span className={cn("text-lg font-bold text-[#05668D] uppercase tracking-wide font-montserrat")}>
                                Menu
                            </span>
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors bg-white shadow-sm"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto py-6 px-6 space-y-1">
                            {data.nav_bar.map((item, index) => (
                                <Link
                                    key={index}
                                    href={formatLink(item.tab_link, item.nav_bar_tab_name)}
                                    prefetch={false}
                                    className={cn(
                                        "block py-3.5 text-base font-semibold border-b border-slate-50 transition-all",
                                        isActive(item.tab_link, item.nav_bar_tab_name)
                                            ? "text-[#05668D] pl-2 border-[#05668D]/20 bg-[#05668D]/5 rounded-md"
                                            : "text-slate-600 border-slate-100/50 hover:text-[#05668D] hover:pl-2"
                                    )}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <div className="flex justify-between items-center">
                                        {item.nav_bar_tab_name}
                                        {/* Optional chevrons for 'like image' feel if strictly needed, keeping it clean for now */}
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Drawer Footer */}
                        <div className="p-6 border-t border-slate-100 bg-slate-50/80">
                            <Button
                                asChild
                                className="bg-gradient-to-r from-[#05668D] to-[#02C39A] text-white font-bold text-lg py-6 w-full shadow-lg rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all mb-4"
                            >
                                <Link href={data.button_header_link || "/pricing"}>
                                    {data.button_header || "Book An Appointment"}
                                </Link>
                            </Button>

                            {/* Social and Contact Icons */}
                            {data.social_media_details && (
                                <div className="flex flex-col gap-4">
                                    {/* Simple social row */}
                                    <div className="flex items-center gap-4">
                                        {data.social_media_details.slice(0, 3).map((social, idx) => (
                                            <a key={idx} href={social.social_media_url} target="_blank" rel="noreferrer" className="bg-white p-2 rounded-lg shadow-sm hover:shadow-md transition-all">
                                                {social.social_media_icon && (
                                                    <Image src={social.social_media_icon.url} alt="Icon" width={18} height={18} className="w-[18px] h-[18px]" />
                                                )}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default Header;
