
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import EventHero from "@/components/events/event-hero";
import Events from "@/components/home/events";
import { ACFData, EventItem } from "@/types/acf";
import { getPageData, getEventsData } from "@/lib/api";

export const metadata = {
    title: "Events | Suraksha Life",
    description: "Stay updated with our latest cancer awareness events and workshops.",
};

export default async function EventsPage() {
    let pageData: ACFData | null = null;
    let eventsData: EventItem[] = [];
    let errorMsg = "";

    try {
        const [pageRes, eventsRes] = await Promise.allSettled([
            getPageData(),
            getEventsData(),
        ]);

        if (pageRes.status === 'fulfilled') {
            pageData = pageRes.value;
        } else {
            throw pageRes.reason;
        }

        if (eventsRes.status === 'fulfilled') {
            eventsData = eventsRes.value;
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
            <EventHero />

            {/* Events List Component - Reusing the Home Events component but fed with dedicated data */}
            {/* The Events component internally handles Upcoming vs Past separation */}
            <Events data={pageData} events={eventsData} />

            <Footer data={pageData} />
        </main>
    );
}
