import { useState, useEffect } from 'react';
import api from '../services/api';

export default function StatusPage() {
  const [status, setStatus] = useState({
    frontend: true,
    backend: 'checking',
    firebase: 'checking',
    env: {}
  });

  useEffect(() => {
    // Check environment variables
    const envStatus = {
      VITE_API_URL: import.meta.env.VITE_API_URL ? '✓' : '✗',
      VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY ? '✓' : '✗',
      VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? '✓' : '✗',
      VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID ? '✓' : '✗',
      VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID ? '✓' : '✗',
    };

    // Check backend health
    api.get('/health')
      .then(() => {
        setStatus(prev => ({ ...prev, backend: 'ok', env: envStatus }));
      })
      .catch(() => {
        setStatus(prev => ({ ...prev, backend: 'error', env: envStatus }));
      });

    // Check Firebase (simple check)
    try {
      import('../config/firebase.js');
      setStatus(prev => ({ ...prev, firebase: 'ok' }));
    } catch (error) {
      setStatus(prev => ({ ...prev, firebase: 'error' }));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 System Status</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-4">
          <h2 className="text-xl font-semibold mb-4">Services</h2>
          <div className="space-y-2">
            <StatusItem label="Frontend" status={status.frontend} />
            <StatusItem label="Backend API" status={status.backend} />
            <StatusItem label="Firebase" status={status.firebase} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <div className="space-y-2">
            {Object.entries(status.env).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center">
                <span className="font-mono text-sm text-gray-600">{key}</span>
                <span className={value === '✓' ? 'text-green-600' : 'text-red-600'}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-primary-600 hover:text-primary-700 font-semibold"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}

function StatusItem({ label, status }) {
  const getColor = () => {
    if (status === true || status === 'ok') return 'text-green-600';
    if (status === 'checking') return 'text-yellow-600';
    return 'text-red-600';
  };

  const getIcon = () => {
    if (status === true || status === 'ok') return '✓';
    if (status === 'checking') return '⏳';
    return '✗';
  };

  return (
    <div className="flex justify-between items-center p-2 border-b">
      <span className="font-medium">{label}</span>
      <span className={getColor() + ' text-xl'}>{getIcon()}</span>
    </div>
  );
}
