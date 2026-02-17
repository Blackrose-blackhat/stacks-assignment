import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/common/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { TransactionProvider } from "@/hooks/use-transactions";
import { CommandMenu } from "@/components/common/CommandMenu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "equifi",
    template: "%s | equifi",
  },
  description:
    "Financial management made simple for the modern saver. Track your expenses and income with premium clarity and effortless organization.",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "equifi - Effortless Finance",
    description:
      "Track your expenses and income with premium clarity and organized financial ledgers.",
    type: "website",
    locale: "en_US",
    siteName: "equifi",
  },
  twitter: {
    card: "summary_large_image",
    title: "equifi",
    description: "Financial management for the modern saver.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TransactionProvider>
            <div className="relative flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
            </div>
            <CommandMenu />
          </TransactionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
