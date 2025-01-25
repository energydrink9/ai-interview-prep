import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./Providers";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { getEnvironmentAsync } from "./providers/environment-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Interview Prep - Ace Your Dream Job",
  description: "Simple AI Job Coach is the ultimate no-fuss, AI-powered interview preparation tool. Practice mock interviews, get personalized feedback, and access expert tips to build confidence and ace your job interviews effortlessly.",
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const environmentPromise = getEnvironmentAsync()

    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <Providers environmentPromise={environmentPromise}>
                    <div className="container mx-auto pt-5 min-h-screen flex flex-col items-stretch">
                        <div className="flex flex-col space-y-10 items-stretch grow">
                            <Header />
                            <div className="grow">
                                {children}
                            </div>
                            <Footer />
                        </div>
                    </div>
                </Providers>
            </body>
        </html>
    );
}
