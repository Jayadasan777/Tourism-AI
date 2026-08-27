import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RedBusLiveBookingSimulator({ isOpen, onClose, destination, startDate }) {
  const [activeStep, setActiveStep] = useState(1);
  // Step 1: Evaluating all 5 buses on route
  // Step 2: "View Seats" on SBM TRAANSPORT (4.4★, A/C Sleeper 2+1)
  // Step 3: Locking Seat U16 (Upper Deck Window Sleeper - ₹1,699)
  // Step 4: Confirming Boarding: Koyambedu SBM Office (19:00) ➔ Dropping: Pasupathi Mahal (07:00)
  // Step 5: Autofilling Passenger 1 (Jayadasan S, 22, Male, 9876543210)
  // Step 6: Reached Live Payment Gateway

  const travelDate = new Date(startDate);
  const formattedDate = travelDate.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  useEffect(() => {
    if (!isOpen) {
      setActiveStep(1);
      return;
    }

    const t2 = setTimeout(() => setActiveStep(2), 2000);
    const t3 = setTimeout(() => setActiveStep(3), 4000);
    const t4 = setTimeout(() => setActiveStep(4), 6000);
    const t5 = setTimeout(() => setActiveStep(5), 8000);
    const t6 = setTimeout(() => setActiveStep(6), 10000);

    return () => {
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          className="w-full max-w-2xl bg-base-card border border-base-border rounded-2xl shadow-glow-white-lg overflow-hidden flex flex-col max-h-[94vh]"
        >
          {/* Header Bar */}
          <div className="p-4 sm:p-5 border-b border-base-border bg-base-elevated flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white text-black font-bold flex items-center justify-center text-xl shadow-md">
                🤖
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-white">Live RedBus Autonomous Agent</h3>
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
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
            {/* Step 1: Operator Selected */}
            <div className="p-4 rounded-xl bg-black/60 border border-base-border space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white font-bold flex items-center gap-1.5">
                  <span>🚌 1. Operator Selected & Evaluated</span>
                </span>
                <span className="text-emerald-400 font-bold">✓ 4.4 ★ (261 ratings)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-base-elevated border border-base-border flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white">SBM TRAANSPORT</div>
                  <div className="text-[11px] text-text-muted font-mono">A/C Sleeper (2+1) • Free Date Change</div>
                </div>
                <div className="text-right font-mono font-bold text-white">
                  19:00 ➔ 07:00
                </div>
              </div>
            </div>

            {/* Step 2 & 3: Seat Layout Matrix */}
            {activeStep >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-black/60 border border-base-border space-y-2"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-white font-bold flex items-center gap-1.5">
                    <span>💺 2. Seat Matrix Layout & Sleeper Berth Lock</span>
                    {activeStep === 2 && <span className="animate-spin text-white">⚙️</span>}
                  </span>
                  <span className="text-emerald-400 font-bold">
                    {activeStep >= 3 ? '✓ Seat U16 Locked' : 'Selecting Berth...'}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-base-elevated border border-base-border flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-text-muted">Assigned Berth:</span>
                    <span className="ml-2 font-bold text-white">U16 • Upper Deck Window Sleeper</span>
                  </div>
                  <div className="font-bold text-white">₹1,699</div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Boarding & Dropping Points Selected */}
            {activeStep >= 4 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-black/60 border border-base-border space-y-2"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-white font-bold flex items-center gap-1.5">
                    <span>📍 3. Boarding & Dropping Points Confirmed</span>
                  </span>
                  <span className="text-emerald-400 font-bold">✓ Locked</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2 bg-base-elevated rounded border border-base-border">
                    <span className="text-text-muted text-[10px] block">BOARDING POINT</span>
                    <span className="font-bold text-white">19:00 - Koyambedu SBM Office</span>
                  </div>
                  <div className="p-2 bg-base-elevated rounded border border-base-border">
                    <span className="text-text-muted text-[10px] block">DROPPING POINT</span>
                    <span className="font-bold text-white">07:00 - Pasupathi Mahal</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 5: Autofilled Passenger Info */}
            {activeStep >= 5 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-black/60 border border-base-border space-y-2"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-white font-bold flex items-center gap-1.5">
                    <span>✍️ 4. Passenger Form Autofilled</span>
                  </span>
                  <span className="text-emerald-400 font-bold">✓ Completed</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                  <div className="p-2 bg-base-elevated rounded border border-base-border">
                    <span className="text-text-muted text-[10px] block">PASSENGER NAME</span>
                    <span className="font-bold text-white">Jayadasan S</span>
                  </div>
                  <div className="p-2 bg-base-elevated rounded border border-base-border">
                    <span className="text-text-muted text-[10px] block">AGE / GENDER</span>
                    <span className="font-bold text-white">22 / Male</span>
                  </div>
                  <div className="p-2 bg-base-elevated rounded border border-base-border">
                    <span className="text-text-muted text-[10px] block">CONTACT MOBILE</span>
                    <span className="font-bold text-white">9876543210</span>
                  </div>
                  <div className="p-2 bg-base-elevated rounded border border-base-border">
                    <span className="text-text-muted text-[10px] block">EMAIL ID</span>
                    <span className="font-bold text-white truncate block">jayadasan@...</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 6: Payment Gateway Paused Banner */}
            {activeStep === 6 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/60 flex items-center justify-between shadow-glow-white"
              >
                <div>
                  <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                    <span>💳 STEP 5: REACHED REDBUS PAYMENT GATEWAY</span>
                  </div>
                  <div className="text-[11px] text-text-muted font-sans mt-0.5">
                    Automated booking prepared for Seat U16 (₹1,699). Ready for UPI / QR / Net Banking.
                  </div>
                </div>
                <div className="text-right font-mono font-bold text-white text-lg">
                  ₹1,699
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
              disabled={activeStep < 6}
              className="btn-primary text-xs sm:text-sm px-6 py-2.5 font-bold disabled:opacity-50 flex items-center gap-2"
            >
              <span>{activeStep < 6 ? 'Agent Autofilling Form...' : 'Open Payment Screen on RedBus →'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
