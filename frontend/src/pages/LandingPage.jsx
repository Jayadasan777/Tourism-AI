import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import heroImage from '../assets/hero.png';

const LandingPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="space-y-8 animate-fade-in">
              {/* SIH Badge */}
              <div className="inline-flex">
                <span className="badge-glass">
                  🏆 Smart India Hackathon 2026
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-5xl lg:text-6xl font-bold text-white tracking-tighter leading-tight">
                Your AI-Powered
                <br />
                <span className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                  Travel Companion
                </span>
                <br />
                for India
              </h1>

              {/* Subtitle */}
              <p className="text-lg text-zinc-400 leading-relaxed max-w-lg">
                Generate personalized trip itineraries with AI, get real-time safety alerts,
                and discover India's hidden gems — all with strict budget control.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link to={user ? "/plan" : "/register"} className="btn-primary text-base px-8 py-3">
                  Start Planning Free →
                </Link>
                <Link to="/login" className="btn-secondary text-base px-8 py-3">
                  Sign In
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-6 text-sm text-zinc-500">
                <div className="flex items-center gap-2">
                  <span className="text-success-400">✓</span>
                  <span>No Credit Card</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-success-400">✓</span>
                  <span>Free Forever</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-success-400">✓</span>
                  <span>AI-Powered</span>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative animate-slide-in-right">
              <div className="card p-2 shadow-glow-white-lg">
                <img
                  src={heroImage}
                  alt="Smart Tour AI Dashboard"
                  className="rounded-lg w-full"
                />
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 card p-4 shadow-glow-white">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">🤖</div>
                  <div>
                    <div className="text-white font-semibold text-sm">Google Gemini AI</div>
                    <div className="text-zinc-500 text-xs">Powered by Gemini 1.5 Flash</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 border-t border-zinc-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
              Everything You Need in One Platform
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Replace 5-8 travel apps with one unified intelligent system
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="card-elevated group cursor-pointer">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                🤖
              </div>
              <h3 className="text-white font-semibold text-lg mb-2 tracking-tight">
                AI-Powered Itineraries
              </h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Generate personalized day-wise trip plans in seconds using Google Gemini AI
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card-elevated group cursor-pointer">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                ⚠️
              </div>
              <h3 className="text-white font-semibold text-lg mb-2 tracking-tight">
                Real-Time Safety Alerts
              </h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Live weather updates, disaster warnings, and safety scores for every destination
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card-elevated group cursor-pointer">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                💰
              </div>
              <h3 className="text-white font-semibold text-lg mb-2 tracking-tight">
                Strict Budget Control
              </h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Set your budget (₹1,000 - ₹10M) and get itineraries that never exceed your limit
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card-elevated group cursor-pointer">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                🇮🇳
              </div>
              <h3 className="text-white font-semibold text-lg mb-2 tracking-tight">
                Local Indian Expertise
              </h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Emergency contacts, regional tips, and authentic local experiences included
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
              Plan Your Trip in 3 Simple Steps
            </h2>
          </div>

          <div className="space-y-8">
            {/* Step 1 */}
            <div className="card flex items-start gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white text-black flex items-center justify-center font-bold text-lg">
                1
              </div>
              <div>
                <h3 className="text-white font-semibold text-xl mb-2">Tell Us Your Preferences</h3>
                <p className="text-zinc-400">
                  Enter destination, budget, duration, interests, and travel dates
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="card flex items-start gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white text-black flex items-center justify-center font-bold text-lg">
                2
              </div>
              <div>
                <h3 className="text-white font-semibold text-xl mb-2">AI Generates Your Itinerary</h3>
                <p className="text-zinc-400">
                  Our AI creates a day-wise plan with activities, costs, and safety information in 3-7 seconds
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="card flex items-start gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white text-black flex items-center justify-center font-bold text-lg">
                3
              </div>
              <div>
                <h3 className="text-white font-semibold text-xl mb-2">Explore & Navigate</h3>
                <p className="text-zinc-400">
                  View on interactive map, get real-time recommendations, and navigate with Google Maps
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="card border-white/10 shadow-glow-white text-center py-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
              Ready to Explore India?
            </h2>
            <p className="text-zinc-400 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of travelers using AI to plan their perfect Indian adventure
            </p>
            <Link to={user ? "/plan" : "/register"} className="btn-primary text-lg px-10 py-4 inline-block">
              Start Planning Now →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-white font-semibold mb-3">Smart Tour AI</h4>
              <p className="text-zinc-500 text-sm">
                AI-powered travel planning for India. Smart India Hackathon 2026.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Quick Links</h4>
              <div className="space-y-2 text-sm">
                <Link to="/plan" className="block text-zinc-500 hover:text-white transition-colors">
                  Plan Trip
                </Link>
                <Link to="/nearby" className="block text-zinc-500 hover:text-white transition-colors">
                  Nearby Places
                </Link>
                <Link to="/status" className="block text-zinc-500 hover:text-white transition-colors">
                  System Status
                </Link>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Powered By</h4>
              <div className="space-y-2 text-sm text-zinc-500">
                <div>• Google Gemini AI</div>
                <div>• Firebase</div>
                <div>• OpenWeatherMap</div>
                <div>• Google Places API</div>
              </div>
            </div>
          </div>
          <div className="border-t border-zinc-800/50 pt-8 text-center text-zinc-500 text-sm">
            <p>© 2026 Smart Tour AI - Team Black Forge - SIH 2026</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
