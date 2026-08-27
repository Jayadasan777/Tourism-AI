import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAuth } from '../context/AuthContext';
import Hero3DScene from '../components/Hero3DScene';
import MotionTourismGallery from '../components/MotionTourismGallery';

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const { user } = useAuth();
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef(null);
  const featuresRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    // 1. Initialize Lenis Smooth Scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const rafId = requestAnimationFrame(raf);

    lenis.on('scroll', (e) => {
      setScrollProgress(e.progress);
    });

    // 2. GSAP ScrollTrigger Staggered Reveals
    const ctx = gsap.context(() => {
      if (featuresRef.current) {
        gsap.from('.feature-reveal-card', {
          scrollTrigger: {
            trigger: featuresRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none'
          },
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.14,
          ease: 'power3.out'
        });
      }

      if (statsRef.current) {
        gsap.from('.stat-reveal-item', {
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none'
          },
          y: 30,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out'
        });
      }
    }, containerRef);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-base-bg text-text-primary selection:bg-accent-violet/30 selection:text-white">
      {/* Hero Section */}
      <section className="relative pt-12 lg:pt-20 pb-24 px-4 overflow-hidden">
        {/* Ambient Top Glow Orbs */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-accent-violet/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-accent-marigold/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content Column */}
            <motion.div 
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="lg:col-span-6 space-y-7 text-left"
            >
              {/* SIH / National Intelligence Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-base-card border border-base-border backdrop-blur-md shadow-glow-violet">
                <span className="text-xs font-semibold uppercase tracking-wider text-accent-violet">
                  ✦ Smart Tour AI 2026
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-accent-marigold" />
                <span className="text-xs text-text-muted">Govt of India Innovation</span>
              </div>

              {/* Display Headline with Clash/Syne font */}
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-text-primary leading-[1.08]">
                Intelligent
                <br />
                <span className="bg-gradient-to-r from-accent-violet via-[#A088FF] to-accent-marigold bg-clip-text text-transparent">
                  Indian Tourism
                </span>
                <br />
                & Safety OS.
              </h1>

              {/* Subtitle */}
              <p className="text-lg text-text-muted leading-relaxed max-w-lg font-sans">
                Generates authentic, conflict-free travel itineraries across all 38 districts with live GPS tracking, verified local menus, and active hazard defense.
              </p>

              {/* CTA Action Buttons with Framer Motion hover states */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link 
                    to={user ? "/plan" : "/register"} 
                    className="btn-primary text-base px-8 py-3.5 rounded-xl font-semibold inline-flex items-center gap-2"
                  >
                    <span>Start Planning Free</span>
                    <span className="text-lg">→</span>
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link 
                    to="/nearby" 
                    className="btn-secondary text-base px-7 py-3.5 rounded-xl font-medium inline-flex items-center gap-2"
                  >
                    <span>🎯 Live Radar</span>
                  </Link>
                </motion.div>
              </div>

              {/* Live Status Readouts */}
              <div className="flex items-center gap-6 pt-4 text-xs font-mono text-text-muted border-t border-base-border/70">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent-teal animate-pulse-teal" />
                  <span>GPS RADAR: ONLINE</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent-violet" />
                  <span>GEMINI 2.5 FLASH</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent-marigold" />
                  <span>100% BUDGET LOCKED</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column: 3D Topographic Terrain-Compass Signature Element */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
              className="lg:col-span-6 relative flex items-center justify-center"
            >
              <div className="w-full relative">
                {/* 3D Canvas */}
                <Hero3DScene scrollProgress={scrollProgress} />

                {/* Floating Intelligence Overlay Card */}
                <div className="absolute -bottom-4 -left-2 sm:bottom-4 sm:left-4 card p-4 backdrop-blur-xl border border-accent-violet/30 shadow-glow-violet">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent-violet/20 border border-accent-violet/40 flex items-center justify-center text-accent-violet text-xl">
                      🧭
                    </div>
                    <div>
                      <div className="text-text-primary font-semibold text-sm flex items-center gap-2">
                        <span>Topographic Geo-Route</span>
                        <span className="w-2 h-2 rounded-full bg-accent-teal animate-pulse" />
                      </div>
                      <div className="text-text-muted text-xs font-mono">Real Indian Waypoints & Elevation</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Section with GSAP Stagger Reveals */}
      <section ref={featuresRef} className="py-24 px-4 border-t border-base-border relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-accent-violet">
              // ARCHITECTURAL CAPABILITIES
            </span>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-text-primary tracking-tight">
              Engineered for Real-World Precision
            </h2>
            <p className="text-text-muted text-base max-w-2xl mx-auto font-sans">
              Replacing fragmented booking tabs with single-session spatial intelligence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1: AI Planning */}
            <div className="feature-reveal-card card hover:border-accent-violet/50 transition-all duration-200">
              <div className="w-12 h-12 rounded-xl bg-accent-violet/15 border border-accent-violet/30 flex items-center justify-center text-2xl mb-5 text-accent-violet">
                🧠
              </div>
              <h3 className="font-display text-xl font-bold text-text-primary mb-2">
                Gemini 2.5 Flash
              </h3>
              <p className="text-text-muted text-sm leading-relaxed font-sans">
                Native JSON structured itinerary synthesis adhering strictly to time constraints and zero spatial backtracking.
              </p>
            </div>

            {/* Feature 2: Safety Radar */}
            <div className="feature-reveal-card card card-safety transition-all duration-200">
              <div className="w-12 h-12 rounded-xl bg-accent-teal/15 border border-accent-teal/30 flex items-center justify-center text-2xl mb-5 text-accent-teal">
                🛡️
              </div>
              <h3 className="font-display text-xl font-bold text-text-primary mb-2">
                Active Hazard Defense
              </h3>
              <p className="text-text-muted text-sm leading-relaxed font-sans">
                Live weather radar, disaster broadcast monitoring, and one-tap emergency SOS coordinates dispatch.
              </p>
            </div>

            {/* Feature 3: Budget Lock */}
            <div className="feature-reveal-card card card-discovery transition-all duration-200">
              <div className="w-12 h-12 rounded-xl bg-accent-marigold/15 border border-accent-marigold/30 flex items-center justify-center text-2xl mb-5 text-accent-marigold">
                ⚖️
              </div>
              <h3 className="font-display text-xl font-bold text-text-primary mb-2">
                Strict Budget Cap
              </h3>
              <p className="text-text-muted text-sm leading-relaxed font-sans">
                Algorithmic cost allocation across accommodation, dining, entry tickets, and transit with guaranteed cap limits.
              </p>
            </div>

            {/* Feature 4: High-Accuracy GPS */}
            <div className="feature-reveal-card card hover:border-accent-violet/50 transition-all duration-200">
              <div className="w-12 h-12 rounded-xl bg-accent-violet/15 border border-accent-violet/30 flex items-center justify-center text-2xl mb-5 text-accent-violet">
                📍
              </div>
              <h3 className="font-display text-xl font-bold text-text-primary mb-2">
                Live OpenStreetMap Radar
              </h3>
              <p className="text-text-muted text-sm leading-relaxed font-sans">
                Real-time reverse geocoding to exact street names and live Overpass POI queries within meters of your location.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Nature & Heritage Visual Showcase */}
      <MotionTourismGallery />

      {/* Live Stats & Metrics Grid */}
      <section ref={statsRef} className="py-20 px-4 bg-base-card/40 border-t border-base-border">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="stat-reveal-item space-y-1">
              <div className="font-mono text-3xl lg:text-4xl font-bold text-text-primary">
                38/38
              </div>
              <div className="text-xs font-mono uppercase tracking-wider text-text-muted">
                Districts Covered
              </div>
            </div>
            <div className="stat-reveal-item space-y-1">
              <div className="font-mono text-3xl lg:text-4xl font-bold text-accent-teal">
                &lt;1.8s
              </div>
              <div className="text-xs font-mono uppercase tracking-wider text-text-muted">
                AI Synthesis Speed
              </div>
            </div>
            <div className="stat-reveal-item space-y-1">
              <div className="font-mono text-3xl lg:text-4xl font-bold text-accent-violet">
                100%
              </div>
              <div className="text-xs font-mono uppercase tracking-wider text-text-muted">
                Conflict-Free Flow
              </div>
            </div>
            <div className="stat-reveal-item space-y-1">
              <div className="font-mono text-3xl lg:text-4xl font-bold text-accent-marigold">
                0₹
              </div>
              <div className="text-xs font-mono uppercase tracking-wider text-text-muted">
                Over-Budget Risk
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 px-4 text-center border-t border-base-border relative overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-8 relative z-10">
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-text-primary tracking-tight">
            Ready to experience India without logistical friction?
          </h2>
          <p className="text-text-muted text-base">
            Join thousands of travelers creating intelligent, verified journeys today.
          </p>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Link to={user ? "/plan" : "/register"} className="btn-primary text-base px-10 py-4 rounded-xl font-semibold shadow-glow-violet-lg">
              Launch Itinerary Engine →
            </Link>
          </motion.div>
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
