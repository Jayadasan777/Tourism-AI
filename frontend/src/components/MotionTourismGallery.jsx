import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import mountainFjordImg from '../assets/mountain_fjord.jpg';
import ghatRoadImg from '../assets/ghat_road.jpg';

const CURATED_DESTINATIONS = [
  {
    name: 'Misty Western Ghats & Rain Forest Trail',
    region: 'Valparai & Western Ghats, Tamil Nadu',
    category: 'Eco-Roads & Monsoon Canopy',
    image: ghatRoadImg,
    tags: ['40 Hairpin Bends', 'Rainforest Canopy', 'Scenic Drives', 'Tea Estates'],
    featured: true
  },
  {
    name: 'Pristine Himalayan Alpine Lake & Fjords',
    region: 'Himachal & Kashmir High Passes',
    category: 'Glacial Valleys & Peaks',
    image: mountainFjordImg,
    tags: ['Mountain Lake', 'Snow Ridges', 'High Altitude', 'Eco Treks'],
    featured: true
  },
  {
    name: 'Varanasi Ghats & Sacred Ganga Aarti',
    region: 'Varanasi, Uttar Pradesh',
    category: 'Living Heritage & Culture',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80',
    tags: ['Holy River', '2500+ Yrs', 'Ganga Aarti', 'Night Rituals']
  },
  {
    name: 'Meenakshi Sundareswarar 1000-Pillars',
    region: 'Madurai, Tamil Nadu',
    category: 'Dravidian Classical Architecture',
    image: 'https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&w=800&q=80',
    tags: ['14 Gopurams', 'Golden Tank', 'Night Pooja', 'GI Crafts']
  },
  {
    name: 'Tea Slopes & Cloud Mist of Munnar',
    region: 'Idukki, Kerala',
    category: 'Misty Valleys & Wildlife',
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
    tags: ['Anamudi Peak', 'Tea Gardens', 'Nilgiri Tahr', 'Waterfalls']
  },
  {
    name: 'Amber Palace & Royal Citadels',
    region: 'Jaipur, Rajasthan',
    category: 'Royal Heritage & Forts',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80',
    tags: ['UNESCO Fort', 'Pink City', 'Mirror Palace', 'Craft Bazaars']
  }
];

export default function MotionTourismGallery() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  const yOffset1 = useTransform(scrollYProgress, [0, 1], [-25, 25]);
  const yOffset2 = useTransform(scrollYProgress, [0, 1], [25, -25]);

  return (
    <section ref={containerRef} className="py-24 px-4 border-t border-base-border relative overflow-hidden bg-base-bg">
      {/* Ambient glowing orbs */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-accent-violet/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-marigold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent-marigold/15 border border-accent-marigold/30 text-xs font-mono text-accent-marigold uppercase tracking-wider">
            <span>🌿 Verified Expeditions</span>
            <span className="w-1.5 h-1.5 rounded-full bg-accent-teal" />
            <span>Nature, Ghats & High Ridges</span>
          </div>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-text-primary tracking-tight">
            Explore India's Living Landscapes
          </h2>
          <p className="text-text-muted text-base max-w-2xl mx-auto font-sans">
            From rainforest canopy ghat drives to high-altitude mountain lakes, every destination is optimized with real GPS coordinates, route maps, and budget limits.
          </p>
        </div>

        {/* 3D Motion Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CURATED_DESTINATIONS.map((dest, idx) => (
            <motion.div
              key={idx}
              style={{ y: idx % 2 === 0 ? yOffset1 : yOffset2 }}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className={`group relative rounded-2xl overflow-hidden bg-base-card border transition-all duration-300 flex flex-col cursor-pointer shadow-2xl ${
                dest.featured ? 'border-accent-violet/50 shadow-glow-violet' : 'border-base-border hover:border-accent-marigold/50'
              }`}
            >
              {/* Image Container with Parallax Zoom */}
              <div className="relative h-64 overflow-hidden bg-base-elevated">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                {/* Gradient Shadow Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-base-card via-base-card/25 to-transparent" />
                
                {/* Region Badge */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-base-bg/85 backdrop-blur-md border border-base-border text-xs font-mono text-text-primary flex items-center gap-1.5 shadow-md">
                  <span>📍</span>
                  <span>{dest.region}</span>
                </div>

                {dest.featured && (
                  <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-accent-violet text-white text-[10px] font-mono uppercase tracking-wider font-semibold shadow-glow-violet">
                    ✨ Featured Trail
                  </div>
                )}
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
