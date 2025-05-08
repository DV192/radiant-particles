import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Varun Patel - Frontend Developer",
  description: "Radiant Particles is a personal creative project by Varun Patel, showcasing immersive web interfaces built with Next.js, Three.js, and GLSL shaders.",
  keywords:
    "Radiant Particles, Varun Patel, Frontend Developer, Next.js, HTML, CSS, JavaScript, Tailwind CSS, Three.js, WebGL, GLSL, Shaders, React Three Fiber, Creative Coding, Interactive Web, UI, Portfolio",
  authors: [{ name: "Varun Patel", url: "https://radiant-particles.vercel.app/" }],
  creator: "Varun Patel",
  icons: {
    icon: "icons/favicon.ico",
    shortcut: "icons/favicon-32x32.png",
    apple: "icons/apple-touch-icon.png",
  },
  openGraph: {
    title: "Radiant Particles - by Varun Patel",
    description: "A creative web experience by Varun Patel using cutting-edge frontend tools like Next.js, Three.js, and GLSL. Explore radiant visual interactivity.",
    url: "https://radiant-particles.vercel.app/",
    siteName: "Radiant Particles",
    images: [
      {
        url: "https://radiant-particles.vercel.app/radiant-particles-screenshot.png",
        width: 1200,
        height: 630,
        alt: "Radiant Particles - Varun Patel's creative project",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
