import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const CURATED_DESTINATIONS = [
  {
    name: 'Varanasi Ghats & Ganga Aarti',
    region: 'Uttar Pradesh',
    category: 'Spiritual & Heritage',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80',
    tags: ['Holy River', '2500+ Yrs', 'Ganga Aarti']
  },
  {
    name: 'Tea Hills of Munnar',
    region: 'Kerala',
    category: 'Nature & Misty Valleys',
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
    tags: ['Western Ghats', 'Tea Plantations', 'Eco-Trails']
  },
  {
    name: 'Meenakshi Sundareswarar Temple',
    region: 'Madurai, Tamil Nadu',
    category: 'Dravidian Architecture',
    image: 'https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&w=800&q=80',
    tags: ['14 Gopurams', '1000 Pillars', 'Living Heritage']
  },
  {
    name: 'Himalayan Ridge & Solang Valley',
    region: 'Himachal Pradesh',
    category: 'Alpine Adventure',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    tags: ['Snow Peaks', 'Trekking', 'High Altitudes']
  },
  {
    name: 'Palaces of Jaipur & Amber Fort',
    region: 'Rajasthan',
    category: 'Royal Heritage & Forts',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80',
    tags: ['UNESCO Fort', 'Pink City', 'Royal Courts']
  },
  {
    name: 'Pristine Lagoons of Havelock',
    region: 'Andaman & Nicobar',
    category: 'Coastal Ecology',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    tags: ['Coral Reefs', 'Turquoise Waters', 'Marine Life']
  }
];

export default function MotionTourismGallery() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  const yOffset = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  return (
    <section ref={containerRef} className="py-24 px-4 border-t border-base-border relative overflow-hidden bg-base-bg">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-accent-violet/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-accent-marigold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-marigold/15 border border-accent-marigold/30 text-xs font-mono text-accent-marigold uppercase tracking-wider">
            <span>🌿 Unexplored Wonders</span>
            <span className="w-1.5 h-1.5 rounded-full bg-accent-teal" />
            <span>Curated Nature & Heritage</span>
          </div>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-text-primary tracking-tight">
            Journey Through Incredible India
          </h2>
          <p className="text-text-muted text-base max-w-2xl mx-auto font-sans">
            From the snow-capped ridges of the Himalayas to the sacred temple corridors of Tamil Nadu, our AI plans authentic, verified expeditions.
          </p>
        </div>

        {/* Dynamic Motion Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CURATED_DESTINATIONS.map((dest, idx) => (
            <motion.div
              key={idx}
              style={{ y: idx % 2 === 0 ? yOffset : 0 }}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="group relative rounded-2xl overflow-hidden bg-base-card border border-base-border hover:border-accent-violet/50 shadow-2xl transition-all duration-300 flex flex-col cursor-pointer"
            >
              {/* Image Container with Parallax Zoom */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                {/* Gradient Shadow Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-base-card via-base-card/20 to-transparent" />
                
                {/* Region Badge */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-base-bg/80 backdrop-blur-md border border-base-border text-xs font-mono text-text-primary">
                  📍 {dest.region}
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-accent-marigold">
                    {dest.category}
                  </span>
                  <h3 className="font-display text-xl font-bold text-text-primary mt-1 group-hover:text-accent-violet transition-colors">
                    {dest.name}
                  </h3>
                </div>

                {/* Pill Tags */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-base-border/60">
                  {dest.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2.5 py-0.5 rounded-full bg-base-elevated text-[11px] font-mono text-text-muted border border-base-border"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
