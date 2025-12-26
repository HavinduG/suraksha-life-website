import Header from "@/components/layout/header";
import Hero from "@/components/home/hero";
import Facilities from "@/components/home/facilities";
import AboutMe from "@/components/home/about-me";
import Services from "@/components/home/services";
import Events from "@/components/home/events";
import Schedule from "@/components/home/schedule";
import OnlineChanneling from "@/components/home/online-channeling";
import BlogNews from "@/components/home/blog-news";
import VideoLearning from "@/components/home/video-learning";
import Resources from "@/components/home/resources";
import Testimonial from "@/components/home/testimonial";
import { ACFData } from "@/types/acf";
import { getPageData, getServicesData, getEventsData, getBlogData, getVideosData, getShortsData, getResourcesData } from "@/lib/api";

export default async function Home() {
  let pageData: ACFData | null = null;
  let servicesData: any[] = [];
  let eventsData: any[] = [];
  let blogData: any[] = [];
  let videosData: any[] = [];
  let shortsData: any[] = [];
  let resourcesData: any[] = [];
  let errorMsg = "";

  try {
    // Fetch critical data in parallel
    const [pageRes, servicesRes, eventsRes, blogRes, videosRes, shortsRes, resourcesRes] = await Promise.allSettled([
      getPageData(),
      getServicesData(),
      getEventsData(),
      getBlogData(),
      getVideosData(),
      getShortsData(),
      getResourcesData()
    ]);

    if (pageRes.status === 'fulfilled') {
      pageData = pageRes.value;
    } else {
      throw pageRes.reason;
    }

    if (servicesRes.status === 'fulfilled') {
      servicesData = servicesRes.value;
    }

    if (eventsRes.status === 'fulfilled') {
      eventsData = eventsRes.value || [];
    } else {
      console.error("Failed to fetch events:", eventsRes.reason);
      eventsData = [];
    }

    if (blogRes.status === 'fulfilled') {
      blogData = blogRes.value || [];
    } else {
      console.error("Failed to fetch blog posts:", blogRes.reason);
      blogData = [];
    }

    if (videosRes.status === 'fulfilled') {
      videosData = videosRes.value || [];
    } else {
      console.error("Failed to fetch videos:", videosRes.reason);
      videosData = [];
    }

    if (shortsRes.status === 'fulfilled') {
      shortsData = shortsRes.value || [];
    } else {
      console.error("Failed to fetch shorts:", shortsRes.reason);
      shortsData = [];
    }

    if (resourcesRes.status === 'fulfilled') {
      resourcesData = resourcesRes.value || [];
    } else {
      console.error("Failed to fetch resources:", resourcesRes.reason);
      resourcesData = [];
    }

  } catch (error) {
    console.error("Error fetching data:", error);
    errorMsg = "Failed to load content. Please verify that your WordPress instance is running and has a page with slug 'home'.";
  }

  if (!pageData) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-white">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-red-500">Error Loading Data</h1>
          <p className="text-slate-600">{errorMsg}</p>
          <p className="text-sm text-slate-400">Attempted to fetch from: {process.env.NEXT_PUBLIC_WORDPRESS_URL}</p>
        </div>
      </main>
    )
  }

  // Inject the fetched services custom post types into the pageData
  // Normalize data: ensure ACF structure exists and fallback to WP core fields if needed
  if (servicesData && servicesData.length > 0) {
    pageData.services_list = servicesData.map(item => {
      // Create a safe ACF object if it doesn't exist
      const acf = item.acf || {};

      return {
        ...item,
        acf: {
          ...acf,
          // Fallback to post title if ACF title is missing
          service_title: acf.service_title || item.title?.rendered || "Untitled Service",
          // Fallback for description if missing
          service_description: acf.service_description || item.content?.rendered || "<p>No description available.</p>",
          // Ensure icon object exists even if null
          service_icon: acf.service_icon || null
        }
      };
    });
  }

  // Extract the first hero item as expected by the Hero component
  const heroData = pageData.hero && pageData.hero.length > 0 ? pageData.hero[0] : undefined;

  return (
    <main className="min-h-screen bg-white">
      <Header data={pageData} />
      {heroData && <Hero data={heroData} />}
      <Facilities data={pageData} />
      <AboutMe data={pageData} />

      <Services data={pageData} />
      <Events data={pageData} events={eventsData} />
      <Schedule data={pageData} />
      <OnlineChanneling data={pageData} />
      <BlogNews data={pageData} posts={blogData} />
      <VideoLearning data={pageData} videos={videosData} shorts={shortsData} />
      <Resources data={pageData} resources={resourcesData} />
      <Testimonial data={pageData} />
    </main>
  );
}
