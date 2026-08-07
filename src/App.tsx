import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Link } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import { FontSizeProvider } from "@/components/FontSizeProvider";
import { ThemeProvider } from "@/components/theme-provider"; // Import ThemeProvider
import Index from "./pages/Index";
import sosIcon from "@/assets/sos.png";
import { ShieldAlert } from "lucide-react";

import AdminRoute from "./components/AdminRoute";
import ScrollProgress from "./components/ScrollProgress";
import PageFade from "./components/PageFade";
import RouteLoader from "./components/RouteLoader";
import ErrorBoundary from "./components/ErrorBoundary";
import SmoothScroll from "./components/SmoothScroll";

// Everything below is route-only, so it doesn't need to be in the initial
// bundle — split it into its own chunk, downloaded on first visit to that
// route. Index stays eager since it's what most visitors land on first.
const Auth = lazy(() => import("./pages/Auth"));
const TripGenie = lazy(() => import("./pages/TripGenie"));
const Heritage = lazy(() => import("./pages/Heritage").then((m) => ({ default: m.Heritage })));
const Community = lazy(() => import("./pages/Community"));
const Emergency = lazy(() => import("./pages/Emergency"));
const SentimentAnalysis = lazy(() => import("./pages/SentimentAnalysis"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const VRExperiencePage = lazy(() => import("./pages/VRExperience"));
const Games = lazy(() => import("./pages/Games"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Explore = lazy(() => import("./pages/Explore"));
const CulturalCalendar = lazy(() => import("./pages/Calendar"));
const DigitalArchive = lazy(() => import("./pages/Archive"));
const Weather = lazy(() => import("./pages/Weather"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Cookies = lazy(() => import("./pages/Cookies"));
const Profile = lazy(() => import("./pages/Profile"));
const ReportCondition = lazy(() => import("./pages/ReportCondition"));

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <FontSizeProvider>
        {/* Dark is the designed art direction ("Lamplight" — see index.css),
            not merely a supported alternative, so it is the default rather
            than deferring to the OS. The toggle still works, and light mode
            is a warm parchment rather than white. */}
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme" attribute="class" enableSystem={false}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <SmoothScroll>
                <MainLayout />
              </SmoothScroll>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
        </FontSizeProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

const MainLayout = () => {
  const location = useLocation();
  const showSOSButton = location.pathname !== "/emergency";
  const showReportButton = !["/report-condition", "/emergency"].includes(location.pathname);

  return (
    <>
      <ScrollProgress />
      {/* Keyed by pathname so navigating away from a crashed page clears the
          error automatically, instead of stranding the user on it. */}
      <ErrorBoundary key={location.pathname}>
        <Suspense fallback={<RouteLoader />}>
          <Routes>
          <Route path="/" element={<PageFade><Index /></PageFade>} />
          <Route path="/auth" element={<PageFade><Auth /></PageFade>} />
          <Route path="/trip-genie" element={<PageFade><TripGenie /></PageFade>} />
          <Route path="/heritage" element={<PageFade><Heritage /></PageFade>} />
          <Route path="/report-condition" element={<PageFade><ReportCondition /></PageFade>} />
          <Route path="/community" element={<PageFade><Community /></PageFade>} />
          <Route path="/emergency" element={<PageFade><Emergency /></PageFade>} />
          <Route path="/vr-experience" element={<PageFade><VRExperiencePage /></PageFade>} />
          <Route element={<AdminRoute />}>
            <Route path="/dashboard" element={<PageFade><Dashboard /></PageFade>} />
            {/* Was unguarded while /dashboard was gated, despite both being
                admin-only per the same role === "admin" nav condition — the
                nav link was hidden, but the route itself rendered fully for
                anyone who typed the URL. */}
            <Route path="/sentiment-analysis" element={<PageFade><SentimentAnalysis /></PageFade>} />
          </Route>
          <Route path="/games" element={<PageFade><Games /></PageFade>} />
          <Route path="/explore" element={<PageFade><Explore /></PageFade>} />
          <Route path="/calendar" element={<PageFade><CulturalCalendar /></PageFade>} />
          <Route path="/archive" element={<PageFade><DigitalArchive /></PageFade>} />
          <Route path="/weather" element={<PageFade><Weather /></PageFade>} />
          <Route path="/privacy" element={<PageFade><Privacy /></PageFade>} />
          <Route path="/terms" element={<PageFade><Terms /></PageFade>} />
          <Route path="/cookies" element={<PageFade><Cookies /></PageFade>} />
          <Route path="/profile" element={<PageFade><Profile /></PageFade>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<PageFade><NotFound /></PageFade>} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
      {showSOSButton && (
        <Link
          to="/emergency"
          className="fixed bottom-8 right-8 z-50 transition-opacity hover:opacity-80"
        >
          <img src={sosIcon} alt="SOS" className="w-16 h-16 rounded-full shadow-lg" />
        </Link>
      )}
      {showReportButton && (
        <Link
          to="/report-condition"
          title="Report a condition issue"
          className="fixed bottom-8 right-28 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-heritage shadow-lg transition-opacity hover:opacity-80"
        >
          <ShieldAlert className="h-7 w-7 text-white" />
        </Link>
      )}
    </>
  );
};

export default App;
