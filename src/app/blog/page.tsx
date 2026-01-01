
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import BlogHero from "@/components/blog/blog-hero";
import BlogNews from "@/components/home/blog-news";
import VideoLearning from "@/components/home/video-learning";
import { ACFData, BlogPost, VideoItem, ShortItem } from "@/types/acf";
import { getPageData, getBlogData, getVideosData, getShortsData } from "@/lib/api";

export const metadata = {
    title: "Blog & Media | Suraksha Life",
    description: "Read our latest news and watch educational videos.",
};

export default async function BlogPage() {
    let pageData: ACFData | null = null;
    let blogPosts: BlogPost[] = [];
    let videos: VideoItem[] = [];
    let shorts: ShortItem[] = [];
    let errorMsg = "";

    try {
        const [pageRes, blogRes, videoRes, shortsRes] = await Promise.allSettled([
            getPageData(),
            getBlogData(),
            getVideosData(),
            getShortsData(),
        ]);

        if (pageRes.status === 'fulfilled') {
            pageData = pageRes.value;
        } else {
            throw pageRes.reason;
        }

        if (blogRes.status === 'fulfilled') blogPosts = blogRes.value;
        if (videoRes.status === 'fulfilled') videos = videoRes.value;
        if (shortsRes.status === 'fulfilled') shorts = shortsRes.value;

    } catch (error) {
        console.error("Error fetching data:", error);
        errorMsg = "Failed to load content.";
    }

    if (!pageData) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-white">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-500">Error Loading Page</h1>
                    <p className="text-slate-600">{errorMsg}</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#ECF0F3]">
            <Header data={pageData} />

            {/* Dynamic Hero */}
            <BlogHero />

            {/* Blog News Section */}
            <BlogNews data={pageData} posts={blogPosts} />

            {/* Video Learning Section */}
            <VideoLearning data={pageData} videos={videos} shorts={shorts} />

            <Footer data={pageData} />
        </main>
    );
}
