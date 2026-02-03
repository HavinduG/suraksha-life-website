"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { MapPin, Clock, Calendar as CalendarIcon, ArrowLeft, ChevronLeft, ChevronRight, User } from "lucide-react";
import Link from "next/link";
import { getPostBySlug, getBlogData } from "@/lib/api";
import { BlogPost } from "@/types/acf";
import { cn } from "@/lib/utils";
// import { Montserrat, Poppins } from "next/font/google"; // Removed


// Font imports removed


export default function BlogDetailPage() {
    const params = useParams();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [allPosts, setAllPosts] = useState<BlogPost[]>([]);

    // Fetch current post
    useEffect(() => {
        const fetchPost = async () => {
            if (params?.slug) {
                try {
                    const data = await getPostBySlug(params.slug as string);
                    setPost(data);
                } catch (error) {
                    console.error("Failed to fetch blog post", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchPost();
    }, [params]);

    // Fetch all posts for navigation
    useEffect(() => {
        const fetchAllPosts = async () => {
            try {
                // Fetching a larger number to ensure we have context for navigation
                // In a real app with pagination, this might need a different strategy
                const data = await getBlogData();
                setAllPosts(data);
            } catch (error) {
                console.error("Failed to fetch all posts", error);
            }
        };
        fetchAllPosts();
    }, []);

    // Determine Prev/Next posts
    const currentIndex = post && allPosts.length > 0 ? allPosts.findIndex(p => p.id === post.id) : -1;
    const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
    const nextPost = currentIndex >= 0 && currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#05668D]"></div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
                <h1 className="text-2xl font-bold text-slate-700">Post Not Found</h1>
                <Link href="/" className="text-[#05668D] hover:underline flex items-center gap-2">
                    <ArrowLeft size={16} /> Back to Home
                </Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 py-12 md:py-20">
            <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                {/* Back Button */}
                <Link
                    href={`/#blog-post-${post.id}`}
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-[#05668D] transition-colors mb-8 font-medium"
                >
                    <ArrowLeft size={20} /> Back to Blog
                </Link>

                <article className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    {/* Header Image */}
                    <div className="relative w-full aspect-video md:aspect-[21/9] bg-slate-100">
                        {post.acf.blog_image?.url ? (
                            <Image
                                src={post.acf.blog_image.url}
                                alt={post.acf.blog_image.alt || post.title.rendered}
                                fill
                                className="object-cover"
                                priority
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-200">
                                <span className="flex flex-col items-center gap-2">
                                    <CalendarIcon size={48} />
                                    No Image Available
                                </span>
                            </div>
                        )}

                        {/* Category Badge Overlay */}
                        <div className="absolute top-6 left-6">
                            <span className={cn(
                                "bg-[#05668D] text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg font-montserrat"

                            )}>
                                {post.acf.blog_category || "News"}
                            </span>
                        </div>
                    </div>

                    {/* Content Container */}
                    <div className="p-6 md:p-12">
                        {/* Title & Meta */}
                        <div className="mb-10 border-b border-slate-100 pb-10">
                            <h1
                                className={cn("text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#3C3E41] mb-6 leading-tight font-montserrat")}
                                dangerouslySetInnerHTML={{ __html: post.acf.blog_title || post.title.rendered }}
                            />

                            <div className="flex flex-wrap gap-4 text-sm md:text-base text-slate-600">
                                {post.acf.blog_time && (
                                    <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                                        <Clock size={18} className="text-[#05668D]" />
                                        <span className={"font-poppins"}>{post.acf.blog_time}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                                    <CalendarIcon size={18} className="text-[#05668D]" />
                                    <span className={"font-poppins"}>
                                        {format(new Date(post.date), "MMMM d, yyyy")}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Rich Text Body */}
                        <div className={cn("prose prose-lg prose-slate max-w-none text-slate-600 leading-relaxed font-poppins")}>
                            <div dangerouslySetInnerHTML={{ __html: post.acf.blog_description || post.title.rendered }} />
                        </div>
                    </div>
                </article>

                {/* Navigation Buttons */}
                <div className="mt-8 flex justify-between gap-4">
                    {prevPost ? (
                        <Link
                            href={`/blog/${prevPost.slug}`}
                            className="flex-1 bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group border border-slate-100"
                        >
                            <span className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 group-hover:text-[#05668D] transition-colors">
                                <ChevronLeft size={14} /> Previous Post
                            </span>
                            <h4 className="font-bold text-slate-700 group-hover:text-[#05668D] line-clamp-1 transition-colors">
                                {prevPost.acf.blog_title || prevPost.title.rendered}
                            </h4>
                        </Link>
                    ) : (
                        <div className="flex-1"></div> // Spacer
                    )}

                    {nextPost ? (
                        <Link
                            href={`/blog/${nextPost.slug}`}
                            className="flex-1 bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group border border-slate-100 text-right"
                        >
                            <span className="flex items-center justify-end gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 group-hover:text-[#05668D] transition-colors">
                                Next Post <ChevronRight size={14} />
                            </span>
                            <h4 className="font-bold text-slate-700 group-hover:text-[#05668D] line-clamp-1 transition-colors">
                                {nextPost.acf.blog_title || nextPost.title.rendered}
                            </h4>
                        </Link>
                    ) : (
                        <div className="flex-1"></div> // Spacer
                    )}
                </div>
            </div>
        </main>
    );
}
