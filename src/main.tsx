import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n";
import { Suspense } from "react";

createRoot(document.getElementById("root")!).render(
	<Suspense fallback="loading">
		<App />
	</Suspense>
);

// Offline support — production only. A service worker in dev intercepts Vite's
// module requests and serves stale chunks, which is exactly the failure mode
// that produced a duplicate React earlier in development.
if (import.meta.env.PROD && "serviceWorker" in navigator) {
	window.addEventListener("load", () => {
		navigator.serviceWorker
			.register("/sw.js")
			.catch((error) => console.error("Service worker registration failed:", error));
	});
}
