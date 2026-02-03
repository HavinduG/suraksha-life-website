import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat, Poppins, Noto_Sans_Sinhala } from "next/font/google";
import "./globals.css";
import { getPageData } from "@/lib/api";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const notoSansSinhala = Noto_Sans_Sinhala({
  variable: "--font-noto-sans-sinhala",
  subsets: ["sinhala"],
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const data = await getPageData();
    const faviconUrl = data.favicon?.url || "https://web.surakshalife.com/wp-content/uploads/2026/01/tab-logo.jpg";

    return {
      title: {
        default: "SurakshaLife",
        template: "%s | SurakshaLife",
      },
      description: "Suraksha Life - Quality Health Care",
      icons: {
        icon: faviconUrl,
      },
    };
  } catch (error) {
    console.warn("Failed to fetch metadata:", error);
    return {
      title: {
        default: "SurakshaLife",
        template: "%s | SurakshaLife",
      },
      description: "Suraksha Life - Quality Health Care",
      icons: {
        icon: "https://web.surakshalife.com/wp-content/uploads/2026/01/tab-logo.jpg", // Fallback
      },
    };
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} ${poppins.variable} ${notoSansSinhala.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
