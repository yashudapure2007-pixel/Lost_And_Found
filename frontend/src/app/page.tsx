import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Search,
  Bell,
  MessageSquare,
  Shield,
  Award,
  ClipboardList,
  ArrowRight,
  Sparkles,
  MapPin,
  Users,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    icon: ClipboardList,
    title: "Report Items",
    description:
      "Quickly report lost or found items with photos, location, and category details.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: Search,
    title: "Smart Search",
    description:
      "Browse and filter listings by category, date, or location to find matches.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Bell,
    title: "Auto-Match Alerts",
    description:
      "Get instant notifications when a found item matches your lost report.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    icon: MessageSquare,
    title: "Direct Messaging",
    description:
      "Coordinate returns directly with finders through in-app messaging.",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  {
    icon: Shield,
    title: "Admin Verification",
    description:
      "Staff review reports to ensure legitimacy and prevent fake claims.",
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  {
    icon: Award,
    title: "Reward Badges",
    description:
      "Earn digital badges for returning items honestly. Be a campus hero!",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
];

const steps = [
  {
    step: "01",
    title: "Report",
    description: "Submit a detailed report of your lost or found item with a photo.",
  },
  {
    step: "02",
    title: "Match",
    description: "Our system automatically matches lost items with found reports.",
  },
  {
    step: "03",
    title: "Connect",
    description: "Message the finder directly to coordinate the return.",
  },
  {
    step: "04",
    title: "Recover",
    description: "Get your item back and the finder earns a badge!",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-32 sm:pb-32">
            <div className="text-center max-w-3xl mx-auto">
              <Badge
                variant="secondary"
                className="mb-6 px-4 py-1.5 text-sm font-medium"
              >
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                Smart Campus Solution
              </Badge>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
                Lost something?{" "}
                <span className="text-primary">We&apos;ll help you find it.</span>
              </h1>

              <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Report lost items, discover found belongings, and reconnect with
                your stuff — all in one place. Powered by smart matching and
                real-time notifications.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/login"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "h-12 px-8 text-base font-medium shadow-lg shadow-primary/25"
                  )}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="/items"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "h-12 px-8 text-base font-medium"
                  )}
                >
                  Browse Items
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-primary">
                    500+
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Items Returned
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-primary">
                    2K+
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Active Users
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-primary">
                    85%
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Recovery Rate
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 sm:py-28 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4 px-3 py-1 text-xs">
                How It Works
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Four simple steps
              </h2>
              <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
                From reporting to recovering — we make it effortless.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((item) => (
                <Card
                  key={item.step}
                  className="relative border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1"
                >
                  <CardContent className="p-6">
                    <span className="text-5xl font-black text-primary/10">
                      {item.step}
                    </span>
                    <h3 className="text-lg font-semibold mt-3">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4 px-3 py-1 text-xs">
                Features
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Everything you need
              </h2>
              <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
                A complete platform for managing lost and found items on campus.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => (
                <Card
                  key={feature.title}
                  className="group border-border/50 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1"
                >
                  <CardContent className="p-6">
                    <div
                      className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${feature.bg} ${feature.color} mb-4 transition-transform group-hover:scale-110`}
                    >
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 sm:py-28 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Card className="relative overflow-hidden border-0 bg-primary text-primary-foreground shadow-2xl shadow-primary/30">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.1),_transparent_50%)]" />
              <CardContent className="relative p-8 sm:p-12 lg:p-16 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  Ready to find what you lost?
                </h2>
                <p className="mt-4 text-primary-foreground/80 max-w-lg mx-auto text-lg">
                  Join your campus community. Sign in with Google and start
                  reporting in seconds.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/login"
                    className={cn(
                      buttonVariants({ variant: "secondary", size: "lg" }),
                      "h-12 px-8 text-base font-medium shadow-lg"
                    )}
                  >
                    Sign in with Google
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>

                <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-primary-foreground/70">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Free to use
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Campus-wide
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Community-driven
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
