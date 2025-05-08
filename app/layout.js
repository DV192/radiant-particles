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
  description: "Building dynamic, immersive web interfaces with React, Three.js, and GLSL shaders. Portfolio of Varun Patel, frontend developer and creative coder.",
  keywords:
    "Frontend Developer, Varun Patel, WebGL, React, Three.js, GLSL, Creative Coding, UI, Interactive Web, Portfolio",
  authors: [{ name: "Varun Patel", url: "https://radiant-particles.vercel.app/" }],
  creator: "Varun Patel",
  icons: {
    icon: "icons/favicon.ico",
    shortcut: "icons/favicon-32x32.png",
    apple: "icons/apple-touch-icon.png",
  },
  openGraph: {
    title: "Varun Patel - Frontend Developer",
    description:
      "Explore the portfolio of Varun Patel - building immersive, interactive web experiences with cutting-edge frontend tech.",
    url: "https://radiant-particles.vercel.app/",
    siteName: "Varun Patel Portfolio",
    images: [
      {
        url: "https://radiant-particles.vercel.app/radiant-particles-screenshot.png",
        width: 1200,
        height: 630,
        alt: "Varun Patel Portfolio Screenshot",
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
