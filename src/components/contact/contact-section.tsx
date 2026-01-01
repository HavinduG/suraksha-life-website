"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { Montserrat, Poppins } from "next/font/google";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ACFData } from "@/types/acf";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

gsap.registerPlugin(ScrollTrigger);

const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
});

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600"],
});

interface ContactSectionProps {
    data: ACFData;
}

const ContactSection = ({ data }: ContactSectionProps) => {
    const sectionRef = useRef<HTMLElement>(null);
    const formRef = useRef<HTMLDivElement>(null);
    const infoRef = useRef<HTMLDivElement>(null);

    // Normalize data (backend might send dr_personal_details or personal_details)
    const personalDetails = data.dr_personal_details || data.personal_details || [];
    const socialDetails = data.social_media_details || [];

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(infoRef.current, {
                x: -50,
                opacity: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 70%",
                },
            });

            gsap.from(formRef.current, {
                x: 50,
                opacity: 0,
                duration: 1,
                delay: 0.2,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 70%",
                },
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="w-full py-20 bg-[#ECF0F3] overflow-hidden"
        >
            <div className="container mx-auto px-4 md:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

                    {/* Left Column: Info & Map Placeholder */}
                    <div ref={infoRef} className="flex flex-col space-y-12">
                        {/* Intro Text */}
                        <div className="space-y-4">
                            <h2 className={cn("text-3xl md:text-4xl font-extrabold text-[#05668D]", montserrat.className)}>
                                Suraksha Life
                            </h2>
                            <p className={cn("text-slate-600 text-lg", poppins.className)}>
                                We are dedicated to providing the best care and support. Reach out to us for any inquiries or assistance.
                            </p>
                        </div>

                        {/* Contact Details List */}
                        <div className="space-y-6">
                            {personalDetails.map((detail, index) => (
                                <div key={index} className="flex items-start space-x-4">
                                    <div className="flex-shrink-0 w-10 h-10 bg-[linear-gradient(145deg,#E2E8EC,#FFFFFF)] rounded-full shadow-[5px_5px_15px_#D1D9E6,-5px_-5px_15px_#FFFFFF] flex items-center justify-center text-[#05668D]">
                                        {/* Icon rendering */}
                                        {detail.contact_details_icon ? (
                                            <Image
                                                src={detail.contact_details_icon.url}
                                                alt={detail.contact_title}
                                                width={20}
                                                height={20}
                                                className="w-5 h-5 object-contain"
                                            />
                                        ) : (
                                            <span className="text-xl font-bold">?</span>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className={cn("text-sm font-bold text-slate-500 uppercase tracking-wide", montserrat.className)}>
                                            {detail.contact_title}
                                        </h4>
                                        <p className={cn("text-lg font-medium text-[#3C3E41]", poppins.className)}>
                                            {detail.contact_details}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Social Media */}
                        <div className="flex space-x-4">
                            {socialDetails.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.social_media_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-12 h-12 bg-[linear-gradient(145deg,#E2E8EC,#FFFFFF)] rounded-lg shadow-[5px_5px_15px_#D1D9E6,-5px_-5px_15px_#FFFFFF] flex items-center justify-center hover:bg-[#05668D] hover:text-white transition-all duration-300 group hover:-translate-y-1"
                                >
                                    {social.social_media_icon && (
                                        <Image
                                            src={social.social_media_icon.url}
                                            alt="Social"
                                            width={24}
                                            height={24}
                                            className="w-6 h-6 opacity-60 group-hover:opacity-100 group-hover:filter group-hover:invert transition-all grayscale group-hover:grayscale-0"
                                        />
                                    )}
                                </a>
                            ))}
                        </div>

                        {/* Mini Map Placeholder (Visualizing layout from user request) */}
                        <div className="w-full h-[250px] rounded-2xl overflow-hidden shadow-[5px_5px_15px_#D1D9E6,-5px_-5px_15px_#FFFFFF] border-4 border-white mt-4 bg-[linear-gradient(145deg,#E2E8EC,#FFFFFF)] relative">
                            {/* In a real app, embed Google Maps iframe here */}
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126743.58585994646!2d79.82118596041767!3d6.927078638702319!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2592070f8ee97%3A0xa19e349896792375!2sColombo%2C%20Sri%20Lanka!5e0!3m2!1sen!2s!4v1709287413645!5m2!1sen!2s"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="filter grayscale hover:grayscale-0 transition-all duration-500"
                            />
                        </div>
                    </div>

                    {/* Right Column: Contact Form */}
                    <div
                        ref={formRef}
                        className="bg-[linear-gradient(145deg,#E2E8EC,#FFFFFF)] rounded-[30px] p-8 md:p-10 shadow-[5px_5px_15px_#D1D9E6,-5px_-5px_15px_#FFFFFF] border border-slate-100"
                    >
                        <div className="mb-8">
                            <h3 className={cn("text-2xl font-bold text-[#3C3E41] mb-2", montserrat.className)}>
                                Send us a Message
                            </h3>
                            <p className={cn("text-slate-500 text-sm", poppins.className)}>
                                Please complete the form below and a member of our team will connect with you.
                            </p>
                        </div>

                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className={cn("text-sm font-semibold text-slate-700", montserrat.className)}>
                                        First Name <span className="text-red-500">*</span>
                                    </label>
                                    <Input placeholder="" className="bg-slate-50 border-slate-200 focus:border-[#05668D]" />
                                </div>
                                <div className="space-y-2">
                                    <label className={cn("text-sm font-semibold text-slate-700", montserrat.className)}>
                                        Last Name
                                    </label>
                                    <Input placeholder="" className="bg-slate-50 border-slate-200 focus:border-[#05668D]" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className={cn("text-sm font-semibold text-slate-700", montserrat.className)}>
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <Input type="email" placeholder="" className="bg-slate-50 border-slate-200 focus:border-[#05668D]" />
                            </div>

                            <div className="space-y-2">
                                <label className={cn("text-sm font-semibold text-slate-700", montserrat.className)}>
                                    Phone
                                </label>
                                <Input type="tel" placeholder="" className="bg-slate-50 border-slate-200 focus:border-[#05668D]" />
                            </div>

                            <div className="space-y-2">
                                <label className={cn("text-sm font-semibold text-slate-700", montserrat.className)}>
                                    How did you hear about Suraksha Life? <span className="text-red-500">*</span>
                                </label>
                                <select className="w-full h-10 px-3 rounded-md border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#05668D] focus:ring-offset-2">
                                    <option>--None--</option>
                                    <option>Social Media</option>
                                    <option>Friend/Family</option>
                                    <option>Search Engine</option>
                                    <option>Doctor Referral</option>
                                    <option>Other</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className={cn("text-sm font-semibold text-slate-700", montserrat.className)}>
                                    Message <span className="text-red-500">*</span>
                                </label>
                                <Textarea placeholder="Please let us know who referred you, if applicable..." className="min-h-[120px] bg-slate-50 border-slate-200 focus:border-[#05668D]" />
                            </div>

                            <Button
                                className="w-full bg-[#00B4D8] hover:bg-[#0096c7] text-white font-bold py-6 rounded-lg shadow-lg hover:shadow-xl transition-all uppercase tracking-wider"
                            >
                                Submit
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
