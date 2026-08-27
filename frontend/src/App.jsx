import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Placeholder components (to be built in other modules)
const LandingPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-secondary-500">
    <div className="text-center text-white p-8">
      <h1 className="text-5xl font-bold mb-4">Smart Tour AI</h1>
      <p className="text-xl mb-8">Your AI-Powered Travel Companion for India</p>
      <p className="text-sm bg-white/20 rounded-lg p-4 max-w-md mx-auto">
        🚀 Frontend setup complete!<br/>
        ✅ React + Vite + Tailwind CSS<br/>
        ✅ Firebase client SDK configured<br/>
        ✅ API service layer ready<br/>
        ✅ Routing setup done<br/><br/>
        Ready for Module 2 (Authentication UI)
      </p>
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

const PlanTripPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="card max-w-4xl w-full">
      <h2 className="text-2xl font-bold mb-4">Plan Your Trip</h2>
      <p className="text-gray-600">Itinerary form - To be built in Module 3</p>
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
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/plan" element={<PlanTripPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
