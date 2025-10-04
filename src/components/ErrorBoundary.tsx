"use client";

import React from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return (
        <FallbackComponent
          error={this.state.error}
          resetError={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({
  error,
  resetError,
}: {
  error?: Error;
  resetError: () => void;
}) {
  return (
    <div className="min-h-screen bg-jungle flex flex-col items-center justify-center p-4">
      <div className="max-w-md mx-auto text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-accent mb-4">
          Something went wrong
        </h1>
        <p className="text-brown mb-6">
          We&apos;re sorry, but something unexpected happened. Please try
          refreshing the page.
        </p>
        {process.env.NODE_ENV === "development" && error && (
          <details className="mb-6 text-left">
            <summary className="cursor-pointer text-sm text-brown">
              Error Details (Development)
            </summary>
            <pre className="mt-2 p-2 bg-jungle-dark rounded text-xs text-red-400 overflow-auto">
              {error.message}
            </pre>
          </details>
        )}
        <div className="space-y-3">
          <button
            onClick={resetError}
            className="bg-accent text-jungle-dark px-6 py-3 rounded-lg font-semibold hover:bg-leaf transition-colors mr-3"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="bg-brown text-white px-6 py-3 rounded-lg font-semibold hover:bg-brown/80 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  );
}
