import Link from "next/link";
import { MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <MapPin className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                Lost<span className="text-primary">&</span>Found
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              A smart campus platform to report, track, and recover lost items.
              Bringing your belongings back to you.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/items"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Browse Items
                </Link>
              </li>
              <li>
                <Link
                  href="/report/lost"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Report Lost
                </Link>
              </li>
              <li>
                <Link
                  href="/report/found"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Report Found
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Support</h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/dashboard"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">
                  Contact: admin@campus.edu
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border/40 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Lost & Found. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built for campus communities
          </p>
        </div>
      </div>
    </footer>
  );
}
