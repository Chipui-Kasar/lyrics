"use client";

import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

// A stale tab (open from before a new deploy) can reference a chunk hash
// that no longer exists once the previous build's static assets are
// replaced. Detect that specific failure so we can auto-reload instead of
// showing a dead "Try Again" button that would just throw the same error.
//
// The one-shot flag lives on window.name rather than session/localStorage:
// SessionValidator does a blanket storage .clear() for every logged-out
// visitor shortly after each page load, which would silently wipe a
// storage-based flag and turn this into an infinite reload loop for a
// genuinely missing chunk. window.name survives same-tab reloads/navigations
// and isn't touched by that (or any other) storage-clearing code.
const CHUNK_RELOAD_FLAG = "chunk-load-error-reloaded";

function isChunkLoadError(error?: Error): boolean {
  if (!error) return false;
  return (
    error.name === "ChunkLoadError" ||
    /Loading chunk [\d]+ failed/i.test(error.message) ||
    /Loading CSS chunk/i.test(error.message)
  );
}

class ErrorBoundary extends Component<Props, State> {
  private clearReloadFlagTimeout?: ReturnType<typeof setTimeout>;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error for monitoring
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // You can also log the error to an error reporting service here
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "exception", {
        description: error.toString(),
        fatal: false,
      });
    }

    if (
      typeof window !== "undefined" &&
      isChunkLoadError(error) &&
      window.name !== CHUNK_RELOAD_FLAG
    ) {
      // Reload once to fetch the current build's manifest/chunks.
      // window.name stops a genuinely missing chunk from looping forever.
      window.name = CHUNK_RELOAD_FLAG;
      window.location.reload();
    }
  }

  componentDidMount() {
    if (typeof window === "undefined" || this.state.hasError) return;
    // Once the app has mounted cleanly (no error) and run for a few
    // seconds, allow a later, unrelated chunk error (e.g. after a
    // subsequent deploy) to trigger another reload. If we're currently
    // showing the error fallback, a genuinely missing chunk would keep
    // re-throwing on every reload, so we must NOT clear the flag here —
    // otherwise it would reload in a slow loop instead of settling on
    // the fallback UI.
    this.clearReloadFlagTimeout = setTimeout(() => {
      if (window.name === CHUNK_RELOAD_FLAG) {
        window.name = "";
      }
    }, 5000);
  }

  componentWillUnmount() {
    if (this.clearReloadFlagTimeout) {
      clearTimeout(this.clearReloadFlagTimeout);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      if (isChunkLoadError(this.state.error)) {
        return (
          <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-8">
            <div className="text-center">
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Loading latest version…
              </h3>
              <p className="text-sm text-gray-600">
                This page was updated. Refreshing to get the latest version.
              </p>
            </div>
          </div>
        );
      }

      // Render fallback UI
      return (
        <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-8">
          <div className="text-center">
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Something went wrong
            </h3>
            <p className="mb-4 text-sm text-gray-600">
              We're sorry, but there was an error loading this content.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
