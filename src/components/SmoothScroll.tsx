import Lenis from "lenis";
import { useEffect, useRef, type ReactNode } from "react";
import { useLocation } from "react-router-dom";

interface SmoothScrollProps {
  children: ReactNode;
}

/**
 * Site-wide smooth scrolling (Lenis), mounted once around the router in
 * App.tsx so it persists across route changes instead of re-initialising
 * per page.
 *
 * respectReducedMotion: true means Lenis itself falls back to native,
 * unsmoothed scrolling for prefers-reduced-motion — this is why
 * index.css's own `html { scroll-behavior: smooth }` was removed rather
 * than kept alongside it: two smoothing systems both trying to own the
 * same scroll would fight each other, and only Lenis's is reduced-motion
 * aware.
 *
 * The pathname effect snaps scroll to the top on every route change. React
 * Router doesn't do this on its own, and without it Lenis would otherwise
 * carry the previous page's scroll offset into the new one.
 */
const SmoothScroll = ({ children }: SmoothScrollProps) => {
  const location = useLocation();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      anchors: {
        offset: -96,
      },
      lerp: 0.065,
      smoothWheel: true,
      syncTouch: true,
      syncTouchLerp: 0.085,
      touchInertiaExponent: 1.85,
      touchMultiplier: 1.1,
      wheelMultiplier: 0.82,
      overscroll: false,
      respectReducedMotion: true,
      prevent: (node) =>
        node.hasAttribute("data-lenis-prevent") ||
        Boolean(node.closest("[data-lenis-prevent]")),
    });

    lenisRef.current = lenis;

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true });
  }, [location.pathname]);

  return <>{children}</>;
};

export default SmoothScroll;
