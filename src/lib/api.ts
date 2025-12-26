
const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;

export async function getPageData() {
    if (!WORDPRESS_API_URL) {
        throw new Error("NEXT_PUBLIC_WORDPRESS_URL is not defined");
    }

    // Fetch the home page data. 
    // We assume the Home page is the front page or has a specific ID/slug.
    // Standard WP way to get specific page by ID if known, or filtering by slug.
    // Let's try fetching the front page or specific ID if user provided one?
    // User didn't provide home page ID, but provided many IDs in mock data (e.g., uploaded_to: 233, etc).
    // Safest bet for "Home" is usually getting pages and filtering by slug 'home' or checking `?slug=home`.

    const res = await fetch(`${WORDPRESS_API_URL}/wp-json/wp/v2/pages?slug=home&_embed`, {
        next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }

    const pages = await res.json();

    if (pages.length === 0) {
        // If 'home' slug doesn't work, maybe try ID 1 or something?
        // Or just return the first page?
        // Let's stick with slug 'home' as it's standard convention.
        throw new Error("Home page not found");
    }

    return pages[0]?.acf;
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
    return services;
}

export async function getEventsData() {
    if (!WORDPRESS_API_URL) {
        throw new Error("NEXT_PUBLIC_WORDPRESS_URL is not defined");
    }

    // Fetch events ordered by date if possible, but standard WP API might need custom sorting or meta_key
    // for now we fetch recent posts. We'll sort them in the component for simplicity unless we add a specific filter query.
    // Fetching 100 to ensure we get upcoming and past.
    const res = await fetch(`${WORDPRESS_API_URL}/wp-json/wp/v2/event?_embed&per_page=100`, {
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        console.warn("Failed to fetch events data");
        return [];
    }

    const events = await res.json();
    return events;
}

export async function getBlogData() {
    if (!WORDPRESS_API_URL) {
        throw new Error("NEXT_PUBLIC_WORDPRESS_URL is not defined");
    }

    const res = await fetch(`${WORDPRESS_API_URL}/wp-json/wp/v2/blog?_embed&per_page=3`, {
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        console.warn("Failed to fetch blog data");
        return [];
    }

    const posts = await res.json();
    return posts;
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
    return videos;
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
    return shorts;
}

export async function getResourcesData() {
    if (!WORDPRESS_API_URL) {
        throw new Error("NEXT_PUBLIC_WORDPRESS_URL is not defined");
    }

    // Use search endpoint as workaround because the direct CPT endpoint /wp-json/wp/v2/resource might be returning 404
    // due to permalink or registration issues on the backend.
    const res = await fetch(`${WORDPRESS_API_URL}/wp-json/wp/v2/search?subtype=resource&_embed&per_page=10`, {
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        console.warn("Failed to fetch resources data");
        return [];
    }

    const searchResults = await res.json();

    // Extract the actual resource objects from _embedded.self
    const resources = searchResults.map((item: any) => {
        if (item._embedded && item._embedded.self && item._embedded.self[0]) {
            return item._embedded.self[0];
        }
        return null;
    }).filter((item: any) => item !== null);

    return resources;
}
