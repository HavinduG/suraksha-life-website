"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { X, Calendar as CalendarIcon, Clock, Tag, ChevronLeft, ChevronRight } from "lucide-react";
import { gsap } from "gsap";
import { BlogPost } from "@/types/acf";
import { cn } from "@/lib/utils";
// import { Montserrat, Poppins } from "next/font/google"; // Removed


// Font imports removed


interface BlogDetailModalProps {
    post: BlogPost;
    onClose: () => void;
    onNext?: () => void;
    onPrev?: () => void;
    hasNext?: boolean;
    hasPrev?: boolean;
}

const BlogDetailModal = ({ post, onClose, onNext, onPrev, hasNext, hasPrev }: BlogDetailModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    // Lifecycle: Body Scroll Lock & Animation
    useEffect(() => {
        // Lock Body Scroll
        document.body.style.overflow = "hidden";

        // Animate In
        const ctx = gsap.context(() => {
            gsap.fromTo(
                modalRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.3, ease: "power2.out" }
            );

            gsap.fromTo(
                contentRef.current,
                { y: 50, opacity: 0, scale: 0.95 },
                { y: 0, opacity: 1, scale: 1, duration: 0.4, delay: 0.1, ease: "back.out(1.2)" }
            );
        }, modalRef);

        // Cleanup
        return () => {
            document.body.style.overflow = "unset";
            ctx.revert();
        };
    }, [post.id]); // Re-run animation when post changes

    const handleClose = () => {
        // Animate Out
        gsap.to(contentRef.current, {
            y: 20,
            opacity: 0,
            duration: 0.2,
            onComplete: () => {
                gsap.to(modalRef.current, {
                    opacity: 0,
                    duration: 0.2,
                    onComplete: onClose
                });
            }
        });
    };

    return (
        <div
            ref={modalRef}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            onClick={(e) => {
                if (e.target === modalRef.current) handleClose();
            }}
        >
            <div
                ref={contentRef}
                className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col relative"
            >
                {/* Navigation Buttons (Fixed Side) */}
                {hasPrev && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onPrev?.();
                        }}
                        className="absolute top-1/2 left-4 z-20 -translate-y-1/2 bg-white/50 hover:bg-white p-3 rounded-full shadow-lg text-slate-700 hover:text-[#05668D] transition-all backdrop-blur-sm hidden md:flex"
                        title="Previous Article"
                    >
                        <ChevronLeft size={24} />
                    </button>
                )}

                {hasNext && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onNext?.();
                        }}
                        className="absolute top-1/2 right-4 z-20 -translate-y-1/2 bg-white/50 hover:bg-white p-3 rounded-full shadow-lg text-slate-700 hover:text-[#05668D] transition-all backdrop-blur-sm hidden md:flex"
                        title="Next Article"
                    >
                        <ChevronRight size={24} />
                    </button>
                )}

                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md text-slate-600 hover:text-red-500 transition-colors"
                >
                    <X size={24} />
                </button>

                {/* Header Image */}
                <div className="relative w-full h-64 md:h-96 flex-shrink-0 bg-slate-100">
                    {post.acf.blog_image?.url ? (
                        <Image
                            src={post.acf.blog_image.url}
                            alt={post.acf.blog_image.alt || post.title.rendered}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <span className="flex flex-col items-center gap-2">
                                <CalendarIcon size={48} />
                                No Image
                            </span>
                        </div>
                    )}

                    {/* Category Badge */}
                    <div className="absolute top-6 left-6">
                        <span className={cn(
                            "bg-[#05668D] text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg font-montserrat"

                        )}>
                            {post.acf.blog_category || "News"}
                        </span>
                    </div>
                </div>

                {/* Content Body (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
                    <div className="mb-8 border-b border-slate-100 pb-8">
                        {/* Title */}
                        <h2
                            className={cn("text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#3C3E41] mb-6 leading-tight font-montserrat")}
                            dangerouslySetInnerHTML={{ __html: post.acf.blog_title || post.title.rendered }}
                        />

                        {/* Meta Data */}
                        <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                            {post.acf.blog_time && (
                                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                                    <Clock size={16} className="text-[#05668D]" />
                                    <span className={"font-poppins"}>{post.acf.blog_time}</span>
                                </div>
                            )}

                            {/* If we had an author or date in ACF we could put it here, 
                                but currently using standard WP date if needed, or just skipping as per design focus */}
                        </div>
                    </div>

                    {/* Full Description */}
                    <div className={cn("prose prose-lg prose-slate max-w-none text-slate-600 leading-relaxed font-poppins")}>
                        {/* Using blog_description if available, fallback to something else if needed */}
                        <div dangerouslySetInnerHTML={{ __html: post.acf.blog_description || "No content available." }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogDetailModal;
