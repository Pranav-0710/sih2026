import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Compass, Home } from "lucide-react";
import PageLayout from "@/components/PageLayout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <PageLayout noTopPadding noBackground>
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/3 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-primary/25 blur-[130px]" />
          <div className="absolute bottom-0 right-0 h-[26rem] w-[26rem] translate-x-1/3 rounded-full bg-heritage/15 blur-[130px]" />
        </div>

        <div className="relative z-10 text-center">
          <Compass className="mx-auto mb-6 h-14 w-14 text-heritage" />
          <p className="font-display text-7xl font-semibold tracking-tight text-white md:text-8xl">
            404
          </p>
          <h1 className="mt-4 text-xl font-semibold text-white">
            This trail doesn't lead anywhere
          </h1>
          <p className="mx-auto mt-2 max-w-sm text-sm text-white/60">
            The page at{" "}
            <code className="rounded bg-white/10 px-1.5 py-0.5 text-white/80">
              {location.pathname}
            </code>{" "}
            doesn't exist. It may have moved, or the link was mistyped.
          </p>
          <Button
            asChild
            className="mt-8 bg-gradient-to-r from-primary to-accent font-semibold text-white hover:opacity-90"
          >
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Monastery360
            </Link>
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default NotFound;
