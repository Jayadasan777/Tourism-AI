import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('❌ Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-obsidian-950 p-4">
          <div className="max-w-md w-full card border-zinc-800 p-8 shadow-2xl">
            <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              ⚠️ Application Notice
            </h1>
            <p className="text-zinc-400 text-sm mb-4">
              An issue occurred. You can reload the page or continue browsing.
            </p>
            <details className="text-xs text-zinc-500 mb-6">
              <summary className="cursor-pointer font-semibold text-zinc-400 hover:text-white mb-2">
                Technical Details
              </summary>
              <pre className="bg-zinc-950 p-3 rounded border border-zinc-800 text-zinc-400 overflow-auto font-mono text-[11px]">
                {this.state.error?.toString()}
              </pre>
            </details>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary w-full"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
