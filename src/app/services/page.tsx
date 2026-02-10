
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ServiceHero from "@/components/services/service-hero";
import Services from "@/components/home/services";
import { ACFData, ServiceItem } from "@/types/acf";
import { getPageData, getServicesData } from "@/lib/api";

export const metadata = {
    title: "Services | Suraksha Life",
    description: "Comprehensive cancer awareness and healthcare services.",
};

export default async function ServicesPage() {
    let pageData: ACFData | null = null;
    let servicesData: ServiceItem[] = [];
    let errorMsg = "";

    try {
        const [pageRes, servicesRes] = await Promise.allSettled([
            getPageData(),
            getServicesData(),
        ]);

        if (pageRes.status === 'fulfilled') {
            pageData = pageRes.value;
        } else {
            throw pageRes.reason;
        }

        if (servicesRes.status === 'fulfilled') {
            servicesData = servicesRes.value;
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

    // Inject fetched services into pageData for the Services component
    if (servicesData && servicesData.length > 0) {
        pageData.services_list = servicesData.map(item => {
            const acf = item.acf || {};
            return {
                ...item,
                acf: {
                    ...acf,
                    // Map fields if they match the component's expectations or provide defaults
                    service_title: acf.service_title || item.title?.rendered || "Service",
                    service_description: acf.service_description || item.content?.rendered || "",
                }
            };
        });
    }

    return (
        <main className="min-h-screen bg-[#ECF0F3]">
            <Header data={pageData} />

            {/* Dynamic Hero */}
            <ServiceHero />

            {/* Services List Component */}
            <Services data={pageData} />

            <Footer data={pageData} />
        </main>
    );
}
