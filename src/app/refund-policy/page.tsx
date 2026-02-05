import { getPageData, getRefundPolicyData } from "@/lib/api";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import RefundContent from "@/components/refund-policy/refund-content";
import { ACFData } from "@/types/acf";
import { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
    title: "Refund Policy | Suraksha Life",
    description: "Refund Policy for Suraksha Life - Cancellation and Refund details.",
};

export default async function RefundPolicyPage() {
    let pageData: ACFData | null = null;
    let refundData: any = null;
    let loadError: string | null = null;

    try {
        const [homeRes, refundRes] = await Promise.allSettled([
            getPageData(),
            getRefundPolicyData()
        ]);

        if (homeRes.status === 'fulfilled') {
            pageData = homeRes.value;
        } else {
            console.error("Home Page Data Fetch Error:", homeRes.reason);
            loadError = `Site Config Error: ${homeRes.reason?.message || "Unknown error"}`;
        }

        if (refundRes.status === 'fulfilled') {
            refundData = refundRes.value;
        } else {
            console.error("Refund Policy Fetch Error:", refundRes.reason);
            loadError = `Refund Content Error: ${refundRes.reason?.message || JSON.stringify(refundRes.reason)}`;
        }

    } catch (e: any) {
        console.error("Error loading data", e);
        loadError = `Critical Error: ${e?.message || JSON.stringify(e)}`;
    }

    if (!pageData) {
        console.warn("Using fallback site configuration for Refund Policy due to API failure.");
        pageData = {
            title: { rendered: "Suraksha Life" },
            content: { rendered: "" },
            nav_bar: [
                { nav_bar_tab_name: "Home", tab_link: "/" },
                { nav_bar_tab_name: "Services", tab_link: "/services" },
                { nav_bar_tab_name: "Events", tab_link: "/events" },
                { nav_bar_tab_name: "Blog", tab_link: "/blog" },
                { nav_bar_tab_name: "Contact", tab_link: "/contact" },
            ],
            header_logo: null,
            button_header: "Book An Appointment",
            button_header_link: "/contact",
            footer_logo: null,
            footer_description: "Suraksha Life - Islandwide cancer awareness series.",
            social_media_details: [],
            contact_info: {
                mobile_number: "",
                email_address: "",
                location_address: "",
                location_map_link: ""
            },
            hero: [],
            facilities: [],
            about_me: [],
            services_list: [],
            events_list: [],
            schedule: [],
            online_channeling: [],
            blog_news: [],
            video_learning: [],
            resources_list: [],
            testimonial: [],
            short_section: []
        } as unknown as ACFData;
    }

    // Ensure nav_bar is an array
    if (!Array.isArray(pageData.nav_bar)) {
        pageData.nav_bar = [];
    }

    return (
        <main className="min-h-screen bg-[#F8FAFC]">
            <Header data={pageData} />

            {loadError && (
                <div className="bg-red-50 text-red-600 p-4 text-center border-b border-red-200">
                    <p className="text-sm font-semibold">Debug: {loadError}</p>
                </div>
            )}

            {refundData ? (
                <RefundContent
                    title={refundData.title?.rendered || "Refund Policy"}
                    content={refundData.content?.rendered || ""}
                    lastUpdated={refundData.modified}
                />
            ) : (
                <div className="container mx-auto py-32 text-center">
                    <h1 className="text-2xl font-bold text-slate-800 mb-4">Refund Policy</h1>
                    <p className="text-slate-500">Content currently unavailable.</p>
                </div>
            )}

            <Footer data={pageData} />
        </main>
    );
}
