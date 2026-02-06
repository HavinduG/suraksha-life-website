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

    try {
        const [homeRes, refundRes] = await Promise.allSettled([
            getPageData(),
            getRefundPolicyData()
        ]);

        if (homeRes.status === 'fulfilled') {
            pageData = homeRes.value;
        }

        if (refundRes.status === 'fulfilled') {
            refundData = refundRes.value;
        } else {
            console.error("Refund Policy Fetch Error:", refundRes.reason);
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
