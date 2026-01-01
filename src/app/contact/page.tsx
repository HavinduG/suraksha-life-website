
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ContactHero from "@/components/contact/contact-hero";
import ContactSection from "@/components/contact/contact-section";
import { ACFData } from "@/types/acf";
import { getPageData } from "@/lib/api";

export const metadata = {
    title: "Contact Us | Suraksha Life",
    description: "Get in touch with us for support, inquiries, or feedback.",
};

export default async function ContactPage() {
    let pageData: ACFData | null = null;
    let errorMsg = "";

    try {
        const pageRes = await getPageData();
        if (pageRes) {
            pageData = pageRes;
        }
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
            <ContactHero />

            {/* Main Contact Section (Info + Form) */}
            <ContactSection data={pageData} />

            <Footer data={pageData} />
        </main>
    );
}
