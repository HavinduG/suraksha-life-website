"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ACFData } from "@/types/acf";
import { cn } from "@/lib/utils";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"] });

interface BookingCTAProps {
    data: ACFData;
}

const BookingCTA = ({ data }: BookingCTAProps) => {
    return (
        <div
            className="w-full mt-16 rounded-xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 transition-all duration-300 hover:shadow-lg"
            style={{
                background: "linear-gradient(145deg, #E2E8EC, #FFFFFF)",
                boxShadow: "5px 5px 15px #D1D9E6, -5px -5px 15px #FFFFFF",
            }}
        >
            <div className="space-y-2 text-center md:text-left">
                <h3 className={cn("text-xl md:text-2xl font-bold text-[#3C3E41]", montserrat.className)}>
                    {data.ev_booking_title || "Want to host a session?"}
                </h3>
                <p className="text-[#05668D] font-bold">
                    {data.ev_whatsapp_number}
                </p>
            </div>

            <Button
                asChild
                className="bg-gradient-to-r from-[#05668D] to-[#02C39A] hover:opacity-90 text-white font-bold py-6 px-8 rounded-md shadow-lg transition-transform hover:scale-105"
            >
                <Link href={data.button_3_link || ""}>
                    {data.button_3 || "Book a Seminar"}
                </Link>
            </Button>
        </div>
    );
};

export default BookingCTA;
