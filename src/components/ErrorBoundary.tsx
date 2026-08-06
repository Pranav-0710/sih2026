import React from "react";

interface Props {
  children: React.ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Catches render-time errors so a single broken component degrades into a
 * recoverable message instead of white-screening the whole app.
 *
 * Must be a class component — React exposes no hook equivalent of
 * componentDidCatch.
 */
class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Uncaught render error:", error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-lg">
          <h1 className="font-display text-2xl font-semibold text-foreground">
            Something went wrong
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            This part of Monastery360 hit an unexpected error. The rest of the
            site is still fine.
          </p>

          {/* Surfaced in dev only — end users get the friendly message above. */}
          {import.meta.env.DEV && (
            <pre className="mt-4 max-h-40 overflow-auto rounded-lg bg-muted p-3 text-left text-xs text-muted-foreground">
              {error.message}
            </pre>
          )}

          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={this.handleReset}
              className="rounded-xl bg-gradient-to-r from-primary to-accent px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Try again
            </button>
            <a
              href="/"
              className="rounded-xl border border-border px-5 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Go home
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
