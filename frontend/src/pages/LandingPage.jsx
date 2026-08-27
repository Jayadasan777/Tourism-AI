import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Placeholder image (using a public image URL)
const heroImg = 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&h=400&fit=crop';

const features = [
  {
    icon: '🤖',
    title: 'AI-Powered Itineraries',
    description:
      'Google Gemini generates day-wise trip plans tailored to your budget, interests, and travel dates.',
  },
  {
    icon: '🛡️',
    title: 'Real-Time Safety Alerts',
    description:
      'Live weather data and disaster alerts keep you informed before and during your trip.',
  },
  {
    icon: '💰',
    title: 'Strict Budget Control',
    description:
      'AI enforces your budget constraint — every rupee accounted for, no surprises.',
  },
  {
    icon: '🇮🇳',
    title: 'Built for India',
    description:
      'Covers 10+ destinations with local expertise, regional emergency contacts, and INR pricing.',
  },
];

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-block bg-white/20 text-white text-sm font-medium px-3 py-1 rounded-full mb-4">
              Smart India Hackathon 2026 · SIH26056
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
              Your AI-Powered<br />Travel Companion<br />for India
            </h1>
            <p className="text-lg text-primary-100 mb-8 max-w-lg mx-auto lg:mx-0">
              Plan smarter trips with personalized itineraries, real-time safety alerts,
              and strict budget control — all powered by AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {user ? (
                <Link
                  to="/plan"
                  className="bg-white text-primary-700 font-semibold px-8 py-3 rounded-lg hover:bg-primary-50 transition-colors text-center"
                >
                  Plan a Trip
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="bg-white text-primary-700 font-semibold px-8 py-3 rounded-lg hover:bg-primary-50 transition-colors text-center"
                  >
                    Get Started Free
                  </Link>
                  <Link
                    to="/login"
                    className="border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/10 transition-colors text-center"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <img
              src={heroImg}
              alt="India travel destinations"
              className="w-full max-w-md rounded-2xl shadow-2xl object-cover"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need for smarter travel
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              One platform combining AI intelligence with real-time safety data.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="card text-center hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-2xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to explore India?
          </h2>
          <p className="text-gray-500 mb-8">
            Create your account and generate your first AI-powered itinerary in minutes.
          </p>
          {!user && (
            <Link
              to="/register"
              className="btn-primary text-base px-10 py-3 inline-block"
            >
              Start Planning for Free
            </Link>
          )}
          {user && (
            <Link
              to="/plan"
              className="btn-primary text-base px-10 py-3 inline-block"
            >
              Plan Your Next Trip
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
