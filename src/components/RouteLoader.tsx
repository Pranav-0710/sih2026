/** Suspense fallback shown while a lazy-loaded route chunk downloads. */
const RouteLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-background">
    <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
  </div>
);

export default RouteLoader;
