import { getPricingServicesData } from '@/lib/api';
import PricingCard from '@/components/pricing/pricing-card';
import { Metadata } from 'next';
import { PricingServiceItem } from '@/types/acf';

export const metadata: Metadata = {
    title: 'Pricing & Packages | Suraksha Life',
    description: 'Choose the best wellness package for you and your family.',
};

// Force dynamic rendering - don't try to statically generate this page at build time
// This prevents build failures when the WordPress API is slow or unavailable
export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidate every 60 seconds

export default async function PricingPage() {
    const pricingData = await getPricingServicesData();

    // Sort by price if needed, or by ID. The JSON shows IDs 635, 634, 633. 
    // 633 is Basic (8,500), 634 is Female (18,500), 635 is Male (16,500).
    // We might want to sort them by price or keep default order. Let's keep default for now.
    // Actually, let's sort by price ascending for better UX? Or just render as is. 
    // Let's render in reverse ID order (newest first) or just map them.
    // The API returns them. Let's just map them.

    return (
        <main className="min-h-screen pt-32 pb-20 bg-gray-50/50">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Everything you need for <span className="text-primary">Best Medical Services</span>
                    </h1>
                    <p className="text-lg text-gray-600">
                        Transparent pricing for our comprehensive wellness packages. Choose what suits you best.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {pricingData.map((item: PricingServiceItem, index: number) => (
                        <PricingCard key={item.id} item={item} index={index} />
                    ))}
                </div>
            </div>
        </main>
    );
}
