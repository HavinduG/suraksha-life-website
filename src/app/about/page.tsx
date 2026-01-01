import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";

import AboutHero from "@/components/about/about-hero";
import AboutMe from "@/components/home/about-me";
import Facilities from "@/components/home/facilities";
import Testimonial from "@/components/home/testimonial";
import { getPageData } from "@/lib/api";
import { ACFData } from "@/types/acf";

export default async function AboutPage() {
    let pageData: ACFData | null = null;
    let errorMsg = "";

    try {
        // Reuse home page data for now since About content (AboutMe) is there
        // In a real scenario, we might call getAboutPageData()
        pageData = await getPageData();
    } catch (error) {
        console.error("Error fetching data:", error);
        errorMsg = "Failed to load content.";
    }

    if (!pageData) {
        return (
            <main className="min-h-screen bg-white flex items-center justify-center">
                <p className="text-red-500">{errorMsg}</p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-white">
            <Header data={pageData} />
            <AboutHero />
            <div className="pt-10">
                <AboutMe data={pageData} />
            </div>
            <Facilities data={pageData} />
            <Testimonial data={pageData} />
            <Footer data={pageData} />
        </main>
    );
}
