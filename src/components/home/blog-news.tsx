"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
// import { Montserrat, Poppins } from "next/font/google"; // Removed

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ACFData, BlogPost } from "@/types/acf";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

// Font imports removed


interface BlogNewsProps {
    data: ACFData;
    posts: BlogPost[];
}

const BlogNews = ({ data, posts }: BlogNewsProps) => {
    const sectionRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (!sectionRef.current) return;

            gsap.from(sectionRef.current, {
                opacity: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 85%",
                },
            });

            if (containerRef.current) {
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
            }

            // Animate Divider
            gsap.to(".divider-anim-blog", {
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

    // Filter to only show the latest 3 posts if more are fetched

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
                        {data.blog_title || "Visit my blog and keep your feedback"}
                    </h5>
                    <h2
                        className={cn(
                            "text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#3C3E41] font-montserrat"

                        )}
                    >
                        {data.blog_section_title || "Latest News"}
                    </h2>
                </div>

                {/* Grid Container */}
                <div
                    ref={containerRef}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[450px]"
                >
                    {posts.slice(currentPage * 3, (currentPage + 1) * 3).map((post) => (
                        <div
                            key={post.id}
                            className="blog-card group block h-full"
                        >
                            <Link
                                id={`blog-post-${post.id}`}
                                href={`/blog/${post.slug}`}
                                className="block h-full rounded-3xl p-4 bg-white transition-all duration-300 hover:-translate-y-2 flex flex-col shadow-lg hover:shadow-xl border border-slate-100"
                            >
                                {/* Image Container */}
                                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-6 shadow-sm flex-shrink-0 bg-slate-50">
                                    {post.acf.blog_image?.url ? (
                                        <Image
                                            src={post.acf.blog_image.url}
                                            alt={post.acf.blog_image.alt || post.title.rendered}
                                            width={post.acf.blog_image.width}
                                            height={post.acf.blog_image.height}
                                            style={{ width: '100%', height: '100%' }}
                                            className="object-contain transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">
                                            No Image
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="px-2 pb-4 space-y-3 flex-1 flex flex-col">
                                    {/* Meta Data */}
                                    <div className="flex items-center justify-between">
                                        <span className={cn("text-xs font-bold text-[#05668D] uppercase tracking-wider font-montserrat")}>
                                            {post.acf.blog_category || "News"}
                                        </span>
                                        <span className={cn("text-xs font-medium text-slate-500 font-poppins")}>
                                            {post.acf.blog_time || "5 min read"}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h3
                                        className={cn(
                                            "text-xl font-bold text-[#3C3E41] leading-tight group-hover:text-[#05668D] transition-colors line-clamp-2 font-montserrat"

                                        )}
                                        dangerouslySetInnerHTML={{ __html: post.acf.blog_title || post.title.rendered }}
                                    />
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Pagination Dots */}
                {posts.length > 3 && (
                    <div className="flex justify-center gap-2 mt-12">
                        {Array.from({ length: Math.ceil(posts.length / 3) }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentPage(index)}
                                className={cn(
                                    "w-3 h-3 rounded-full transition-all duration-300",
                                    currentPage === index
                                        ? "bg-[#05668D] w-6"
                                        : "bg-slate-300 hover:bg-slate-400"
                                )}
                                aria-label={`Go to page ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
            {/* Dynamic Neumorphic Divider */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-[2px] rounded-full opacity-50">
                <div
                    className="w-full h-full bg-[#ECF0F3]"
                    style={{
                        boxShadow: "inset 2px 2px 5px #DCE1E4, inset -2px -2px 5px #FFFFFF"
                    }}
                />
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-1 bg-[#DCE1E4] rounded-full opacity-20 divider-anim-blog"
                />
            </div>
        </section >
    );
};

export default BlogNews;
