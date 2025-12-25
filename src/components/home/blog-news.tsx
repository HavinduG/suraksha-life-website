"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Montserrat, Poppins } from "next/font/google";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ACFData, BlogPost } from "@/types/acf";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
});

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600"],
});

interface BlogNewsProps {
    data: ACFData;
    posts: BlogPost[];
}

const BlogNews = ({ data, posts }: BlogNewsProps) => {
    const sectionRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(sectionRef.current, {
                opacity: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 85%",
                },
            });

            gsap.from(".blog-card", {
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                },
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    // Filter to only show the latest 3 posts if more are fetched
    const latestPosts = posts.slice(0, 3);

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
                        {data.blog_title || "Visit my blog and keep your feedback"}
                    </h5>
                    <h2
                        className={cn(
                            "text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#3C3E41]",
                            montserrat.className
                        )}
                    >
                        {data.blog_section_title || "Latest News"}
                    </h2>
                </div>

                {/* Grid Container */}
                <div
                    ref={containerRef}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {latestPosts.map((post) => (
                        <Link
                            key={post.id}
                            href={post.link}
                            className="blog-card group block h-full"
                        >
                            <div
                                className="h-full rounded-3xl p-4 bg-white transition-all duration-300 hover:-translate-y-2"
                                style={{
                                    background: "linear-gradient(145deg, #ffffff, #E2E8EC)",
                                    boxShadow: "5px 5px 20px #D1D9E6, -5px -5px 20px #FFFFFF"
                                }}
                            >
                                {/* Image Container */}
                                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-6 shadow-sm">
                                    {post.acf.blog_image?.url ? (
                                        <Image
                                            src={post.acf.blog_image.url}
                                            alt={post.acf.blog_image.alt || post.title.rendered}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">
                                            No Image
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="px-2 pb-4 space-y-3">
                                    {/* Meta Data */}
                                    <div className="flex items-center justify-between">
                                        <span className={cn("text-xs font-bold text-[#05668D] uppercase tracking-wider", montserrat.className)}>
                                            {post.acf.blog_category || "News"}
                                        </span>
                                        <span className={cn("text-xs font-medium text-slate-500", poppins.className)}>
                                            {post.acf.blog_time || "5 min read"}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h3
                                        className={cn(
                                            "text-xl font-bold text-[#3C3E41] leading-tight group-hover:text-[#05668D] transition-colors line-clamp-2",
                                            montserrat.className
                                        )}
                                        dangerouslySetInnerHTML={{ __html: post.acf.blog_title || post.title.rendered }}
                                    />

                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BlogNews;
