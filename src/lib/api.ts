
const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;

// Export a robust public URL for frontend components to use
export const PUBLIC_WORDPRESS_URL = "https://web.surakshalife.com";



// Helper to sanitize URLs in the response
function sanitizeData(data: any): any {
    if (typeof data === 'string') {
        // Replace http(s)://suraksha.local with https://web.surakshalife.com
        return data.replace(/https?:\/\/suraksha\.local/g, "https://web.surakshalife.com");
    } else if (Array.isArray(data)) {
        return data.map(item => sanitizeData(item));
    } else if (typeof data === 'object' && data !== null) {
        const newData: any = {};
        for (const key in data) {
            newData[key] = sanitizeData(data[key]);
        }
        return newData;
    }
    return data;
}

export async function getPageData() {
    if (!WORDPRESS_API_URL) {
        throw new Error("NEXT_PUBLIC_WORDPRESS_URL is not defined");
    }

    const res = await fetch(`${WORDPRESS_API_URL}/wp-json/wp/v2/pages?slug=home&_embed`, {
        next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }

    const pages = await res.json();

    if (pages.length === 0) {
        throw new Error("Home page not found");
    }

    return sanitizeData(pages[0]?.acf);
}

export async function getServicesData() {
    if (!WORDPRESS_API_URL) {
        throw new Error("NEXT_PUBLIC_WORDPRESS_URL is not defined");
    }

    const res = await fetch(`${WORDPRESS_API_URL}/wp-json/wp/v2/service?_embed&per_page=100&order=asc&orderby=id`, {
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        console.warn("Failed to fetch services data");
        return [];
    }

    const services = await res.json();
    return sanitizeData(services);
}

export async function getEventsData() {
    if (!WORDPRESS_API_URL) {
        throw new Error("NEXT_PUBLIC_WORDPRESS_URL is not defined");
    }

    const res = await fetch(`${WORDPRESS_API_URL}/wp-json/wp/v2/event?_embed&per_page=100`, {
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        console.warn("Failed to fetch events data");
        return [];
    }

    const events = await res.json();
    return sanitizeData(events);
}

export async function getBlogData() {
    if (!WORDPRESS_API_URL) {
        throw new Error("NEXT_PUBLIC_WORDPRESS_URL is not defined");
    }

    const res = await fetch(`${WORDPRESS_API_URL}/wp-json/wp/v2/blog?_embed&per_page=9`, {
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        console.warn("Failed to fetch blog data");
        return [];
    }

    const posts = await res.json();
    return sanitizeData(posts);
}

export async function getVideosData() {
    if (!WORDPRESS_API_URL) {
        throw new Error("NEXT_PUBLIC_WORDPRESS_URL is not defined");
    }

    const res = await fetch(`${WORDPRESS_API_URL}/wp-json/wp/v2/video?_embed&per_page=3`, {
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        console.warn("Failed to fetch video data");
        return [];
    }

    const videos = await res.json();
    return sanitizeData(videos);
}

export async function getShortsData() {
    if (!WORDPRESS_API_URL) {
        throw new Error("NEXT_PUBLIC_WORDPRESS_URL is not defined");
    }

    const res = await fetch(`${WORDPRESS_API_URL}/wp-json/wp/v2/short?_embed&per_page=10`, {
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        console.warn("Failed to fetch shorts data");
        return [];
    }

    const shorts = await res.json();
    return sanitizeData(shorts);
}

export async function getResourcesData() {
    if (!WORDPRESS_API_URL) {
        throw new Error("NEXT_PUBLIC_WORDPRESS_URL is not defined");
    }

    const res = await fetch(`${WORDPRESS_API_URL}/wp-json/wp/v2/search?subtype=resource&_embed&per_page=10`, {
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        console.warn("Failed to fetch resources data");
        return [];
    }

    const searchResults = await res.json();

    const resources = searchResults.map((item: any) => {
        if (item._embedded && item._embedded.self && item._embedded.self[0]) {
            return item._embedded.self[0];
        }
        return null;
    }).filter((item: any) => item !== null);

    return sanitizeData(resources);
}

export async function getEventBySlug(slug: string) {
    if (!WORDPRESS_API_URL) {
        throw new Error("NEXT_PUBLIC_WORDPRESS_URL is not defined");
    }

    const res = await fetch(`${WORDPRESS_API_URL}/wp-json/wp/v2/event?slug=${slug}&_embed`, {
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch event");
    }

    const events = await res.json();
    return sanitizeData(events[0]);
}

export async function getAboutPageNewData() {
    if (!WORDPRESS_API_URL) {
        throw new Error("NEXT_PUBLIC_WORDPRESS_URL is not defined");
    }

    const res = await fetch(`${WORDPRESS_API_URL}/wp-json/wp/v2/pages/564?_embed`, {
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch about page data");
    }

    const page = await res.json();
    return sanitizeData(page.acf);
}


export async function getPostBySlug(slug: string) {
    if (!WORDPRESS_API_URL) {
        throw new Error("NEXT_PUBLIC_WORDPRESS_URL is not defined");
    }

    const res = await fetch(`${WORDPRESS_API_URL}/wp-json/wp/v2/blog?slug=${slug}&_embed`, {
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch blog post");
    }

    const posts = await res.json();
    if (posts.length === 0) {
        throw new Error("Post not found");
    }
    return sanitizeData(posts[0]);
}

export async function getPrivacyPolicyData() {
    if (!WORDPRESS_API_URL) {
        throw new Error("NEXT_PUBLIC_WORDPRESS_URL is not defined");
    }

    // Fetch specifically the page with ID 3 as requested
    const res = await fetch(`${WORDPRESS_API_URL}/wp-json/wp/v2/pages/3?_embed`, {
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch privacy policy data");
    }

    const page = await res.json();
    return sanitizeData(page);
}

export async function getRefundPolicyData() {
    if (!WORDPRESS_API_URL) {
        throw new Error("NEXT_PUBLIC_WORDPRESS_URL is not defined");
    }

    // Fetch specifically the page with ID 602 as requested
    const res = await fetch(`${WORDPRESS_API_URL}/wp-json/wp/v2/pages/602?_embed`, {
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch refund policy data");
    }

    const page = await res.json();
    return sanitizeData(page);
}

export async function getTermsData() {
    if (!WORDPRESS_API_URL) {
        throw new Error("NEXT_PUBLIC_WORDPRESS_URL is not defined");
    }

    // Fetch specifically the page with ID 608 as requested
    const res = await fetch(`${WORDPRESS_API_URL}/wp-json/wp/v2/pages/608?_embed`, {
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch terms data");
    }

    const page = await res.json();
    return sanitizeData(page);
}
