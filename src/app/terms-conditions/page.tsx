import { getPageData, getTermsData } from "@/lib/api";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import TermsContent from "@/components/terms-conditions/terms-content";
import { ACFData } from "@/types/acf";
import { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
    title: "Terms & Conditions | Suraksha Life",
    description: "Terms and Conditions for Suraksha Life services and appointments.",
};

export default async function TermsPage() {
    let pageData: ACFData | null = null;
    let termsData: any = null;

    try {
        const [homeRes, termsRes] = await Promise.allSettled([
            getPageData(),
            getTermsData()
        ]);

        if (homeRes.status === 'fulfilled') {
            pageData = homeRes.value;
        }

        if (termsRes.status === 'fulfilled') {
            termsData = termsRes.value;
        } else {
            console.error("Terms Fetch Error:", termsRes.reason);
        }

    } catch (e) {
        console.error("Error loading data", e);
    }

    // Fallback if home page data fails (critical for header/footer)
    if (!pageData) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p>Failed to load site configuration.</p>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#F8FAFC]">
            {/* Nav bar is visible on top */}
            <Header data={pageData} />

            {termsData ? (
                <TermsContent
                    title={termsData.title?.rendered || "Terms & Conditions"}
                    content={termsData.content?.rendered || ""}
                    lastUpdated={termsData.modified}
                />
            ) : (
                <div className="container mx-auto py-32 text-center">
                    <h1 className="text-2xl font-bold text-slate-800 mb-4">Terms & Conditions</h1>
                    <p className="text-slate-500">Content currently unavailable.</p>
                </div>
            )}

            <Footer data={pageData} />
        </main>
    );
}
