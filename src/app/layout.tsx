import type { Metadata } from "next";
import { Nunito, Nunito_Sans } from "next/font/google";
import "./globals.css";
import { PhoneFrame } from "@/components/phone-frame";

const nunitoSans = Nunito_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Stitchly — keep your place",
  description: "Your patterns, projects and progress in one joyful place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${nunitoSans.variable} ${nunito.variable} antialiased`}
    >
      <body className="min-h-dvh bg-background">
        <PhoneFrame>{children}</PhoneFrame>
      </body>
    </html>
  );
}
