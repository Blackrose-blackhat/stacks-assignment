"use client";

import Link from "next/link";
import { MoveLeft, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Dynamic Background Elements */}

      <div className="relative z-10 w-full max-w-lg text-center space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="space-y-4">
          <h1 className="text-6xl font-medium tracking-tighter text-foreground/20">
            404
          </h1>
          <h2 className="text-3xl font-medium tracking-tight text-foreground">
            Page not found
          </h2>
          <p className="text-muted-foreground text-lg max-w-sm mx-auto leading-relaxed">
            The page you're looking for doesn't exist or has been moved to a
            different budget.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button
            asChild
            variant="default"
            size="lg"
            className="rounded-2xl h-11 px-8 gap-2 transition-all bg-primary hover:bg-primary/90 text-primary-foreground border-none shadow-none"
          >
            <Link href="/">
              <Home className="h-4 w-4" />
              Return Home
            </Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            size="lg"
            className="rounded-2xl h-11 px-8 gap-2 hover:bg-muted/50 transition-all text-muted-foreground font-medium"
          >
            <Link href="/transactions">
              <Search className="h-4 w-4" />
              View Transactions
            </Link>
          </Button>
        </div>

        <div className="pt-12 text-xs text-muted-foreground/40 font-medium tracking-wide uppercase">
          Equifi Financial Clarity
        </div>
      </div>
    </div>
  );
}
