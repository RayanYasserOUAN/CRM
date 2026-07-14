import type { Metadata } from "next"
import { Outfit, DM_Sans } from "next/font/google"
import "./globals.css"

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "FlowCRM - Pipeline Manager",
  description: "Modern CRM for managing contacts and deals",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${outfit.variable} ${dmSans.variable}`}>
      <body className="min-h-screen antialiased">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white dark:focus:bg-slate-900 focus:text-blue-600 focus:rounded-xl focus:shadow-lg focus:outline-2 focus:outline-blue-500 focus:outline-offset-2">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  )
}
