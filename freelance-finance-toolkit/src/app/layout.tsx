import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "MounaPro - AI-Powered Freelance Finance Toolkit",
  description:
    "Stop guessing your pricing. Use AI-powered calculators for rates, fees, ROI, and taxes. Built for freelancers, consultants, and agencies.",
  keywords: [
    "freelance calculator",
    "freelancer income calculator",
    "hourly rate calculator",
    "freelance tax estimator",
    "freelance fee calculator",
    "ROI calculator freelancer",
  ],
  openGraph: {
    title: "MounaPro - AI-Powered Freelance Finance Toolkit",
    description:
      "Stop guessing your freelance pricing. Use AI-powered calculators for rates, fees, ROI, and taxes.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
