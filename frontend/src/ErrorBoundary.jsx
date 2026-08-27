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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              ⚠️ Application Error
            </h1>
            <p className="text-gray-700 mb-4">
              Something went wrong. Please check:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 mb-4 space-y-2">
              <li>Environment variables are set in Vercel</li>
              <li>Firebase configuration is correct</li>
              <li>Backend API is running</li>
            </ul>
            <details className="text-xs text-gray-500">
              <summary className="cursor-pointer font-semibold mb-2">
                Technical Details
              </summary>
              <pre className="bg-gray-100 p-2 rounded overflow-auto">
                {this.state.error?.toString()}
              </pre>
            </details>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 w-full bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
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
