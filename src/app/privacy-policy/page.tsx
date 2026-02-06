import { getPageData, getPrivacyPolicyData } from "@/lib/api";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import PrivacyPolicyContent from "@/components/privacy-policy/privacy-content";
import { ACFData } from "@/types/acf";
import { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
    title: "Privacy Policy | Suraksha Life",
    description: "Privacy Policy for Suraksha Life - Islandwide cancer awareness series.",
};

export default async function PrivacyPolicyPage() {
    let pageData: ACFData | null = null;
    let privacyData: any = null;

    try {
        const [homeRes, privacyRes] = await Promise.allSettled([
            getPageData(),
            getPrivacyPolicyData()
        ]);

        if (homeRes.status === 'fulfilled') {
            pageData = homeRes.value;
        }

        if (privacyRes.status === 'fulfilled') {
            privacyData = privacyRes.value;
        } else {
            console.error("Privacy Policy Fetch Error:", privacyRes.reason);
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

            {privacyData ? (
                <PrivacyPolicyContent
                    title={privacyData.title?.rendered || "Privacy Policy"}
                    content={privacyData.content?.rendered || ""}
                    lastUpdated={privacyData.modified}
                />
            ) : (
                <div className="container mx-auto py-32 text-center">
                    <h1 className="text-2xl font-bold text-slate-800 mb-4">Privacy Policy</h1>
                    <p className="text-slate-500">Content currently unavailable.</p>
                </div>
            )}

            <Footer data={pageData} />
        </main>
    );
}
