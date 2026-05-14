import Link from "next/link";
import { Search, Menu, MapPin } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getCurrentUser } from "@/actions/auth";
import { SignOutButton } from "./sign-out-button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/items", label: "Browse Items" },
  { href: "/report/lost", label: "Report Lost" },
  { href: "/report/found", label: "Report Found" },
];

export async function Navbar() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/25 transition-transform group-hover:scale-105">
            <MapPin className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            Lost<span className="text-primary">&</span>Found
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-sm font-medium text-muted-foreground rounded-lg transition-colors hover:text-foreground hover:bg-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Link
            href="/items"
            className="hidden sm:flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground hover:bg-accent"
          >
            <Search className="h-4 w-4" />
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "relative h-9 w-9 rounded-full"
                )}
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={user.avatarUrl || undefined}
                    alt={user.name}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="flex items-center gap-3 px-2 py-2.5">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user.avatarUrl || undefined}
                      alt={user.name}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium leading-none">
                      {user.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<Link href="/dashboard" />}>
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link href="/messages" />}>
                  Messages
                </DropdownMenuItem>
                {user.role === "ADMIN" && (
                  <DropdownMenuItem render={<Link href="/admin" />}>
                    Admin Panel
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <SignOutButton />
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/login"
              className={cn(
                buttonVariants({ size: "sm" }),
                "shadow-md shadow-primary/25"
              )}
            >
              Sign in
            </Link>
          )}

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon-sm" }),
                "md:hidden"
              )}
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <nav className="flex flex-col gap-1 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-4 py-3 text-sm font-medium rounded-lg transition-colors hover:bg-accent"
                  >
                    {link.label}
                  </Link>
                ))}
                {user && (
                  <>
                    <div className="my-2 border-t border-border" />
                    <Link
                      href="/dashboard"
                      className="px-4 py-3 text-sm font-medium rounded-lg transition-colors hover:bg-accent"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/messages"
                      className="px-4 py-3 text-sm font-medium rounded-lg transition-colors hover:bg-accent"
                    >
                      Messages
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
