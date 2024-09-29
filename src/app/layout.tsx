import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import AuthProvider from "../context/AuthProvider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { LocationProvider } from "@/context/LocationContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="light">
          <AuthProvider>
            <LocationProvider>{children}</LocationProvider>
          </AuthProvider>
          <Toaster closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}