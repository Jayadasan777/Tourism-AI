import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PlanTripPage from './pages/PlanTripPage';

// Placeholder components (to be built in other modules)
const LandingPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-secondary-500">
    <div className="text-center text-white p-8">
      <h1 className="text-5xl font-bold mb-4">Smart Tour AI</h1>
      <p className="text-xl mb-8">Your AI-Powered Travel Companion for India</p>
      <div className="space-y-4">
        <p className="text-sm bg-white/20 rounded-lg p-4 max-w-md mx-auto">
          🚀 Module 3 Complete!<br/>
          ✅ AI-powered itinerary generation<br/>
          ✅ Budget-aware planning<br/>
          ✅ Day-wise activity breakdown<br/>
          ✅ Beautiful UI with Tailwind CSS
        </p>
        <a
          href="/plan"
          className="inline-block bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          Plan Your Trip →
        </a>
      </div>
    </div>
  </div>
);

const LoginPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="card max-w-md w-full">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <p className="text-gray-600">Login page - To be built in Module 2</p>
    </div>
  </div>
);

const RegisterPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="card max-w-md w-full">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <p className="text-gray-600">Register page - To be built in Module 2</p>
    </div>
  </div>
);

const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
      <p className="text-gray-600">Page not found</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/plan"
                element={
                  <ProtectedRoute>
                    <PlanTripPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
