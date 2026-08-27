import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RedBusLiveBookingSimulator({ isOpen, onClose, destination, startDate }) {
  const [activeStep, setActiveStep] = useState(1);
  // Step 1: Evaluating all 5 buses (scores)
  // Step 2: Auto-selected best operator & opening seat matrix
  // Step 3: Auto-selected seat 14U & boarding point
  // Step 4: Autofilled passenger details (Jayadasan S)
  // Step 5: Advanced to Payment Gateway

  const [analyzingIndex, setAnalyzingIndex] = useState(0);

  const buses = [
    { name: 'SBM TRAANSPORT', type: 'A/C Sleeper (2+1)', rating: '4.4 ★', reviews: '261 ratings', price: 950, dept: '19:00', arr: '07:00', score: '91/100' },
    { name: 'IntrCity SmartBus Premium', type: 'Volvo Multi-Axle A/C Sleeper', rating: '4.8 ★', reviews: '1,420 ratings', price: 1050, dept: '20:30', arr: '06:30', score: '98/100 (WINNER)' },
    { name: 'KPN Travels', type: 'A/C Semi-Sleeper (2+2)', rating: '4.1 ★', reviews: '890 ratings', price: 780, dept: '21:00', arr: '07:30', score: '84/100' },
    { name: 'Parveen Travels', type: 'Bharat Benz A/C Sleeper', rating: '4.5 ★', reviews: '1,120 ratings', price: 990, dept: '21:45', arr: '08:00', score: '93/100' },
    { name: 'SRS Travels', type: 'Scania Multi-Axle Luxury', rating: '4.3 ★', reviews: '640 ratings', price: 890, dept: '22:15', arr: '08:15', score: '88/100' }
  ];

  const travelDate = new Date(startDate);
  const formattedDate = travelDate.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  useEffect(() => {
    if (!isOpen) {
      setActiveStep(1);
      setAnalyzingIndex(0);
      return;
    }

    // Step 1: Scan buses sequentially
    const scanInterval = setInterval(() => {
      setAnalyzingIndex(prev => (prev < 4 ? prev + 1 : prev));
    }, 500);

    // Step 2: Select IntrCity after 2.5s
    const t2 = setTimeout(() => {
      clearInterval(scanInterval);
      setActiveStep(2);
    }, 2400);

    // Step 3: Lock Seat 14U after 4.2s
    const t3 = setTimeout(() => setActiveStep(3), 4200);

    // Step 4: Autofill Passenger form after 6.0s
    const t4 = setTimeout(() => setActiveStep(4), 6000);

    // Step 5: Advance to Payment Gateway after 7.8s
    const t5 = setTimeout(() => setActiveStep(5), 7800);

    return () => {
      clearInterval(scanInterval);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFinalPaymentRedirect = () => {
    const cleanToSlug = destination.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const directRedBusUrl = `https://www.redbus.in/bus-tickets/chennai-to-${cleanToSlug}?fromCityName=Chennai&toCityName=${encodeURIComponent(destination)}&onward=${formattedDate}`;
    window.open(directRedBusUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          className="w-full max-w-2xl bg-base-card border border-base-border rounded-2xl shadow-glow-white-lg overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Header Bar */}
          <div className="p-4 sm:p-5 border-b border-base-border bg-base-elevated flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white text-black font-bold flex items-center justify-center text-xl shadow-md">
                🤖
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-white">Autonomous RedBus Agent</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-xs text-text-muted font-mono">
                  Chennai ➔ {destination} • {formattedDate}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-text-muted hover:text-white text-lg p-1.5"
            >
              ✕
            </button>
          </div>

          {/* Body Content */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
            {/* Step 1: Deep Comparison Matrix */}
            <div className="p-4 rounded-xl bg-black/60 border border-base-border space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white font-bold flex items-center gap-1.5">
                  <span>🧠 1. Deep Operator Analysis</span>
                  {activeStep === 1 && <span className="animate-spin text-white">⚙️</span>}
                </span>
                <span className="text-text-muted">Evaluating 5/5 live operators</span>
              </div>

              <div className="space-y-2">
                {buses.map((bus, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-lg border text-xs flex items-center justify-between transition-all duration-300 ${
                      idx === 1 && activeStep >= 2
                        ? 'bg-emerald-950/40 border-emerald-500/80 text-white shadow-glow-white'
                        : analyzingIndex >= idx
                        ? 'bg-base-elevated border-base-border text-text-primary'
                        : 'opacity-30 border-transparent text-text-muted'
                    }`}
                  >
                    <div>
                      <div className="font-bold flex items-center gap-2">
                        <span>{bus.name}</span>
                        {idx === 1 && activeStep >= 2 && (
                          <span className="bg-emerald-400 text-black text-[10px] font-extrabold px-2 py-0.2 rounded-full">
                            WINNER (98/100)
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-text-muted font-mono mt-0.5">
                        {bus.type} • {bus.rating} ({bus.reviews})
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="font-bold text-white">₹{bus.price}</div>
                      <div className="text-[10px] text-text-muted">{bus.dept} - {bus.arr}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2 & 3: Seat Locking & Boarding Point */}
            {activeStep >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-black/60 border border-base-border space-y-3"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-white font-bold flex items-center gap-1.5">
                    <span>💺 2. Seat Layout Matrix & Window Lock</span>
                    {activeStep === 2 && <span className="animate-spin text-white">⚙️</span>}
                  </span>
                  <span className="text-emerald-400 font-bold">
                    {activeStep >= 3 ? '✓ Seat 14U Locked' : 'Selecting...'}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-base-elevated border border-base-border flex items-center justify-between text-xs">
                  <div>
                    <span className="text-text-muted">Selected Berth:</span>
                    <span className="ml-2 font-mono font-bold text-white">14U (Upper Window Sleeper)</span>
                  </div>
                  <div>
                    <span className="text-text-muted">Boarding Point:</span>
                    <span className="ml-2 font-mono font-bold text-white">Koyambedu CMBT (20:30)</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4 & 5: Autofilled Passenger Details & Payment Gateway */}
            {activeStep >= 4 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-black/60 border border-base-border space-y-3"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-white font-bold flex items-center gap-1.5">
                    <span>✍️ 3. Passenger Form Autofill</span>
                    {activeStep === 4 && <span className="animate-spin text-white">⚙️</span>}
                  </span>
                  <span className="text-emerald-400 font-bold">✓ Form Completed</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                  <div className="p-2 bg-base-elevated rounded border border-base-border">
                    <span className="text-text-muted text-[10px] block">NAME</span>
                    <span className="font-bold text-white">Jayadasan S</span>
                  </div>
                  <div className="p-2 bg-base-elevated rounded border border-base-border">
                    <span className="text-text-muted text-[10px] block">AGE / GENDER</span>
                    <span className="font-bold text-white">22 / Male</span>
                  </div>
                  <div className="p-2 bg-base-elevated rounded border border-base-border">
                    <span className="text-text-muted text-[10px] block">MOBILE</span>
                    <span className="font-bold text-white">9876543210</span>
                  </div>
                  <div className="p-2 bg-base-elevated rounded border border-base-border">
                    <span className="text-text-muted text-[10px] block">EMAIL</span>
                    <span className="font-bold text-white truncate block">jayadasan@...</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 5: Advance to Payment Gateway Banner */}
            {activeStep === 5 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/50 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                    <span>💳 REACHED PAYMENT GATEWAY (PAUSED SAFELY)</span>
                  </div>
                  <div className="text-[11px] text-text-muted font-sans mt-0.5">
                    Booking finalized for IntrCity Seat 14U (₹1,050). Confirm via UPI / QR / Net Banking.
                  </div>
                </div>
                <div className="text-right font-mono font-bold text-white text-base">
                  ₹1,050
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="p-4 sm:p-5 border-t border-base-border bg-base-elevated flex items-center justify-between">
            <button
              onClick={onClose}
              className="btn-secondary text-xs sm:text-sm px-4 py-2"
            >
              Cancel
            </button>
            <button
              onClick={handleFinalPaymentRedirect}
              disabled={activeStep < 5}
              className="btn-primary text-xs sm:text-sm px-6 py-2.5 font-bold disabled:opacity-50 flex items-center gap-2"
            >
              <span>{activeStep < 5 ? 'Agent Executing Steps...' : 'Pay & Confirm on RedBus Gateway →'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
