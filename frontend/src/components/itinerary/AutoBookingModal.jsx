import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AutoBookingModal({ isOpen, onClose, destination, startDate }) {
  const [step, setStep] = useState(0); // 0: Finding Buses, 1: Selecting Seats, 2: Auto-Filling Passenger Details, 3: Ready for Payment
  const [selectedSeat, setSelectedSeat] = useState('14U (Window)');
  const [operator, setOperator] = useState('IntrCity SmartBus Premium');

  const travelDate = new Date(startDate);
  const formattedDate = travelDate.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const STEPS = [
    { title: 'Connecting to RedBus & IRCTC Grid', desc: 'Fetching live real-time express buses from Chennai to ' + destination },
    { title: 'Selecting Top-Rated AC Sleeper Operator', desc: 'Auto-picked: ' + operator + ' (4.8★, ₹850)' },
    { title: 'Locking Preferred Window Seat', desc: 'Auto-selected Seat ' + selectedSeat },
    { title: 'Review & Confirm at Payment Gateway', desc: 'Booking finalized. Review details below and confirm via your preferred payment mode.' }
  ];

  React.useEffect(() => {
    if (!isOpen) {
      setStep(0);
      return;
    }

    const timer1 = setTimeout(() => setStep(1), 1200);
    const timer2 = setTimeout(() => setStep(2), 2400);
    const timer3 = setTimeout(() => setStep(3), 3600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleProceedToPayment = () => {
    const cleanToSlug = destination.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const directRedBusUrl = `https://www.redbus.in/bus-tickets/chennai-to-${cleanToSlug}?fromCityName=Chennai&toCityName=${encodeURIComponent(destination)}&onward=${formattedDate}`;
    window.open(directRedBusUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-xl bg-base-card border border-base-border rounded-2xl shadow-glow-white-lg overflow-hidden flex flex-col"
        >
          {/* Modal Header */}
          <div className="p-6 border-b border-base-border flex items-center justify-between bg-base-elevated/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-xl">
                🤖
              </div>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Autonomous Booking Agent</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-white">
                    LIVE
                  </span>
                </h3>
                <p className="text-xs text-text-muted font-mono">
                  Chennai ➔ {destination} • {formattedDate}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-text-muted hover:text-white transition-colors text-lg"
            >
              ✕
            </button>
          </div>

          {/* Stepper Progress */}
          <div className="p-6 space-y-6">
            <div className="space-y-3">
              {STEPS.map((s, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-3.5 p-3 rounded-xl transition-all duration-300 ${
                    step >= idx
                      ? 'bg-base-elevated border border-white/20'
                      : 'opacity-40 border border-transparent'
                  }`}
                >
                  <div className="mt-0.5">
                    {step > idx ? (
                      <span className="w-5 h-5 rounded-full bg-white text-black text-xs font-bold flex items-center justify-center">
                        ✓
                      </span>
                    ) : step === idx ? (
                      <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin block" />
                    ) : (
                      <span className="w-5 h-5 rounded-full bg-base-border text-text-muted text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-white">{s.title}</div>
                    <div className="text-xs text-text-muted font-sans mt-0.5">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Live Booking Summary Card (Shows at Step 3) */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-black/60 border border-white/30 space-y-3"
              >
                <div className="flex justify-between items-center text-sm border-b border-base-border/80 pb-2">
                  <span className="text-text-muted">Operator:</span>
                  <span className="font-bold text-white">{operator}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-base-border/80 pb-2">
                  <span className="text-text-muted">Seat Assigned:</span>
                  <span className="font-mono font-bold text-white">{selectedSeat}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-base-border/80 pb-2">
                  <span className="text-text-muted">Estimated Fare:</span>
                  <span className="font-bold text-white">₹850</span>
                </div>
                <div className="flex justify-between items-center text-sm pt-1">
                  <span className="text-text-muted">Status:</span>
                  <span className="text-xs font-bold text-black bg-white px-2 py-0.5 rounded-full">
                    READY FOR PAYMENT
                  </span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-6 border-t border-base-border bg-base-elevated/20 flex items-center justify-between">
            <button
              onClick={onClose}
              className="btn-secondary text-sm px-5 py-2.5"
            >
              Cancel
            </button>
            <button
              onClick={handleProceedToPayment}
              disabled={step < 3}
              className="btn-primary text-sm px-6 py-2.5 font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span>{step < 3 ? 'Agent Processing...' : 'Proceed to Checkout →'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
