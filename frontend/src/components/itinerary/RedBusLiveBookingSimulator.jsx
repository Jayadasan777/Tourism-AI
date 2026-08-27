import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RedBusLiveBookingSimulator({ isOpen, onClose, destination, startDate }) {
  // Current active view step:
  // 1: Bus listing search & live evaluation
  // 2: Seat matrix view & interactive sleeper berth click
  // 3: Boarding point selection
  // 4: Typing passenger details into actual form fields
  // 5: Reached Payment Gateway (UPI / QR checkout)
  const [currentStep, setCurrentStep] = useState(1);

  // Live form typing state for realistic automation demo
  const [typedName, setTypedName] = useState('');
  const [typedAge, setTypedAge] = useState('');
  const [typedPhone, setTypedPhone] = useState('');
  const [typedEmail, setTypedEmail] = useState('');
  const [isInsuranceDeclined, setIsInsuranceDeclined] = useState(false);
  const [isSeatSelected, setIsSeatSelected] = useState(false);
  const [isBoardingSelected, setIsBoardingSelected] = useState(false);

  const travelDate = new Date(startDate);
  const formattedDate = travelDate.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
      setTypedName('');
      setTypedAge('');
      setTypedPhone('');
      setTypedEmail('');
      setIsInsuranceDeclined(false);
      setIsSeatSelected(false);
      setIsBoardingSelected(false);
      return;
    }

    // Step 1 -> 2: Auto-click "View Seats" on SBM TRAANSPORT after 1.8s
    const t1 = setTimeout(() => {
      setCurrentStep(2);
    }, 1800);

    // Step 2: Auto-click Seat U16 (Upper Deck Window) after 3.2s
    const t2 = setTimeout(() => {
      setIsSeatSelected(true);
    }, 3200);

    // Step 2 -> 3: Auto-click "Select boarding & dropping points" after 4.5s
    const t3 = setTimeout(() => {
      setCurrentStep(3);
    }, 4500);

    // Step 3: Select Koyambedu SBM Office after 5.5s
    const t4 = setTimeout(() => {
      setIsBoardingSelected(true);
    }, 5500);

    // Step 3 -> 4: Auto-click "Fill passenger details" after 6.6s
    const t5 = setTimeout(() => {
      setCurrentStep(4);
    }, 6600);

    // Step 4: Typing animation for passenger credentials
    const t6 = setTimeout(() => setTypedPhone('9876543210'), 7400);
    const t7 = setTimeout(() => setTypedEmail('jayadasan@smarttour.ai'), 8200);
    const t8 = setTimeout(() => setTypedName('Jayadasan S'), 9000);
    const t9 = setTimeout(() => setTypedAge('22'), 9600);
    const t10 = setTimeout(() => setIsInsuranceDeclined(true), 10200);

    // Step 4 -> 5: Auto-click "Continue booking" after 11.2s
    const t11 = setTimeout(() => {
      setCurrentStep(5);
    }, 11200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
      clearTimeout(t7);
      clearTimeout(t8);
      clearTimeout(t9);
      clearTimeout(t10);
      clearTimeout(t11);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFinalRedBusTab = () => {
    const cleanToSlug = (destination || 'Kanyakumari').toLowerCase().replace(/[^a-z0-9]/g, '-');
    const directRedBusUrl = `https://www.redbus.in/bus-tickets/chennai-to-${cleanToSlug}?fromCityName=Chennai&toCityName=${encodeURIComponent(destination || 'Kanyakumari')}&onward=${formattedDate}`;
    window.open(directRedBusUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-3xl bg-[#0e0e10] border border-white/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
        >
          {/* Simulated Browser Chrome Top Bar */}
          <div className="bg-[#18181b] px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
              </div>
              <div className="bg-[#27272a] text-zinc-300 text-xs px-3 py-1 rounded-md font-mono flex items-center gap-2 border border-white/5">
                <span className="text-emerald-400">🔒</span>
                <span>redbus.in/bus-tickets/chennai-to-{destination.toLowerCase()}</span>
                <span className="text-zinc-500">|</span>
                <span className="text-white font-bold animate-pulse text-[10px] bg-red-600 px-1.5 py-0.2 rounded">
                  AI AGENT LIVE
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white text-base px-2 py-1"
            >
              ✕
            </button>
          </div>

          {/* Stepper Progress Bar */}
          <div className="bg-[#121215] px-4 py-2.5 border-b border-white/10 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-1 sm:gap-4 overflow-x-auto">
              <span className={currentStep >= 1 ? 'text-white font-bold flex items-center gap-1' : 'text-zinc-500'}>
                1. Operator Search {currentStep > 1 && '✓'}
              </span>
              <span className="text-zinc-600">➔</span>
              <span className={currentStep >= 2 ? 'text-white font-bold flex items-center gap-1' : 'text-zinc-500'}>
                2. Seat Layout (U16) {currentStep > 2 && '✓'}
              </span>
              <span className="text-zinc-600">➔</span>
              <span className={currentStep >= 3 ? 'text-white font-bold flex items-center gap-1' : 'text-zinc-500'}>
                3. Boarding Point {currentStep > 3 && '✓'}
              </span>
              <span className="text-zinc-600">➔</span>
              <span className={currentStep >= 4 ? 'text-white font-bold flex items-center gap-1' : 'text-zinc-500'}>
                4. Passenger Autofill {currentStep > 4 && '✓'}
              </span>
              <span className="text-zinc-600">➔</span>
              <span className={currentStep >= 5 ? 'text-emerald-400 font-bold' : 'text-zinc-500'}>
                5. Payment
              </span>
            </div>
          </div>

          {/* Live Dynamic Screen Content */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4 bg-black/60 min-h-[380px]">
            {/* STEP 1: Live Bus Search Results */}
            {currentStep === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                <div className="flex justify-between items-center text-xs text-zinc-400">
                  <span>5 buses found for Chennai ➔ {destination} ({formattedDate})</span>
                  <span className="text-white font-mono flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> AI Scanning Reviews...
                  </span>
                </div>

                {/* SBM TRAANSPORT Card */}
                <div className="p-4 rounded-xl bg-[#18181b] border-2 border-emerald-500/80 shadow-lg space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-base">SBM TRAANSPORT</h4>
                        <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                          ★ 4.4 (261)
                        </span>
                        <span className="bg-white/10 text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-500/30">
                          AI TOP PICK
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5">A/C Sleeper (2+1) • Free date change</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-white">₹1,599</div>
                      <div className="text-[11px] text-zinc-400">Onwards</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-white/10 text-xs">
                    <div className="text-zinc-300 font-mono">19:00 (Chennai) ➔ 07:00 ({destination}) • 12h</div>
                    <button className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-1.5 rounded-lg flex items-center gap-1.5 animate-pulse">
                      <span>View seats</span>
                      <span className="text-xs">➔</span>
                    </button>
                  </div>
                </div>

                {/* Other Buses (Secondary) */}
                <div className="p-3 rounded-lg bg-[#121215] border border-white/10 opacity-50 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-white">IntrCity SmartBus Premium</span>
                    <span className="ml-2 text-zinc-400">Volvo Multi-Axle • ★ 4.8</span>
                  </div>
                  <span className="font-mono text-zinc-300">₹1,850</span>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Seat Layout Matrix */}
            {currentStep === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                <div className="flex justify-between items-center text-xs text-zinc-400">
                  <span className="text-white font-bold">Select Seats — SBM TRAANSPORT (A/C Sleeper 2+1)</span>
                  <span className="text-emerald-400 font-mono">
                    {isSeatSelected ? '✓ Seat U16 Selected' : 'Auto-selecting sleeper window...'}
                  </span>
                </div>

                {/* Lower & Upper Deck Simulation */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-[#18181b] rounded-xl border border-white/15">
                  {/* Lower Deck */}
                  <div className="p-3 bg-black/40 rounded-lg border border-white/10 space-y-2">
                    <div className="text-[11px] font-bold text-zinc-400 flex items-center justify-between">
                      <span>Lower Deck</span>
                      <span>🚗 Driver</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="h-10 bg-zinc-800 rounded border border-zinc-700 text-[10px] flex items-center justify-center text-zinc-500">Sold</div>
                      <div className="h-10 bg-zinc-800 rounded border border-zinc-700 text-[10px] flex items-center justify-center text-zinc-500">Sold</div>
                      <div className="h-10 bg-zinc-800 rounded border border-zinc-700 text-[10px] flex items-center justify-center text-zinc-500">Sold</div>
                    </div>
                  </div>

                  {/* Upper Deck */}
                  <div className="p-3 bg-black/40 rounded-lg border border-white/10 space-y-2">
                    <div className="text-[11px] font-bold text-zinc-400">Upper Deck (Sleepers)</div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="h-10 bg-zinc-800 rounded border border-zinc-700 text-[10px] flex items-center justify-center text-zinc-500">Sold</div>
                      <div className="h-10 bg-zinc-800 rounded border border-zinc-700 text-[10px] flex items-center justify-center text-zinc-500">Sold</div>
                      
                      {/* Seat U16 Selected by Agent */}
                      <motion.div
                        animate={{
                          backgroundColor: isSeatSelected ? '#059669' : '#27272a',
                          borderColor: isSeatSelected ? '#10b981' : '#52525b',
                          scale: isSeatSelected ? 1.05 : 1
                        }}
                        className="h-10 rounded border text-[10px] flex flex-col items-center justify-center font-bold text-white transition-all shadow-md"
                      >
                        <span>U16</span>
                        <span className="text-[9px]">₹1,699</span>
                      </motion.div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <div className="text-xs text-zinc-300">
                    <span className="text-zinc-500">Selected:</span> <span className="font-bold text-white">1 Seat (U16)</span> • <span className="font-bold text-emerald-400">₹1,699</span>
                  </div>
                  <button className="bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-md flex items-center gap-1 animate-pulse">
                    Select boarding & dropping points ➔
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Boarding & Dropping Points */}
            {currentStep === 3 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                <div className="text-xs font-bold text-white">Select Boarding & Dropping Points</div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Boarding Points List */}
                  <div className="p-3 bg-[#18181b] rounded-xl border border-white/15 space-y-2">
                    <div className="text-xs font-bold text-zinc-300">Boarding Points (Chennai)</div>
                    <div className={`p-2.5 rounded-lg border text-xs flex items-center justify-between transition-all ${
                      isBoardingSelected ? 'bg-emerald-950/40 border-emerald-500 text-white' : 'bg-black/40 border-white/10 text-zinc-400'
                    }`}>
                      <div>
                        <div className="font-bold text-white">19:00 - Koyambedu SBM Office</div>
                        <div className="text-[10px] text-zinc-400">Near K10 Police Station, CMBT</div>
                      </div>
                      <span className="text-base">{isBoardingSelected ? '🔘' : '⚪'}</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-black/20 border border-white/5 text-xs flex items-center justify-between text-zinc-500">
                      <div>
                        <div>19:20 - Porur Toll Gate</div>
                      </div>
                      <span>⚪</span>
                    </div>
                  </div>

                  {/* Dropping Points List */}
                  <div className="p-3 bg-[#18181b] rounded-xl border border-white/15 space-y-2">
                    <div className="text-xs font-bold text-zinc-300">Dropping Points ({destination})</div>
                    <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500 text-white text-xs flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white">07:00 - Pasupathi Mahal Mahadhanapuram</div>
                        <div className="text-[10px] text-zinc-400">Near Checkpost, {destination}</div>
                      </div>
                      <span className="text-base">🔘</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <div className="text-xs text-zinc-400">Total Fare: <span className="text-white font-bold font-mono">₹1,699</span></div>
                  <button className="bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-md flex items-center gap-1 animate-pulse">
                    Fill passenger details ➔
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Live Typing Passenger Details Form */}
            {currentStep === 4 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                <div className="flex justify-between items-center text-xs font-bold text-white">
                  <span>Passenger & Contact Information</span>
                  <span className="text-emerald-400 font-mono flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> AI Agent Typing...
                  </span>
                </div>

                <div className="p-4 bg-[#18181b] rounded-xl border border-white/15 space-y-3 text-xs">
                  {/* Contact Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[10px] text-zinc-400 block mb-1">Mobile Number *</label>
                      <input
                        readOnly
                        value={typedPhone}
                        placeholder="e.g. 9876543210"
                        className="w-full bg-[#27272a] text-white px-3 py-2 rounded border border-white/20 font-mono text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-400 block mb-1">Email ID *</label>
                      <input
                        readOnly
                        value={typedEmail}
                        placeholder="e.g. traveler@smarttour.ai"
                        className="w-full bg-[#27272a] text-white px-3 py-2 rounded border border-white/20 font-mono text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Passenger 1 Details (Seat U16) */}
                  <div className="p-3 bg-black/40 rounded-lg border border-white/10 space-y-2">
                    <div className="flex justify-between text-[11px] font-bold text-zinc-300">
                      <span>Passenger 1 (Seat U16, Upper Deck)</span>
                      <span className="text-emerald-400">Adult</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="sm:col-span-2">
                        <label className="text-[10px] text-zinc-400 block mb-1">Name *</label>
                        <input
                          readOnly
                          value={typedName}
                          placeholder="e.g. Jayadasan S"
                          className="w-full bg-[#27272a] text-white px-3 py-1.5 rounded border border-white/20 font-mono text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-zinc-400 block mb-1">Age *</label>
                        <input
                          readOnly
                          value={typedAge}
                          placeholder="Age"
                          className="w-full bg-[#27272a] text-white px-3 py-1.5 rounded border border-white/20 font-mono text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4 pt-1 text-xs">
                      <span className="text-zinc-400 text-[10px]">Gender:</span>
                      <label className="flex items-center gap-1.5 text-white font-bold">
                        <span>🔘</span> Male
                      </label>
                      <label className="flex items-center gap-1.5 text-zinc-500">
                        <span>⚪</span> Female
                      </label>
                    </div>
                  </div>

                  {/* Insurance Bypass Selection */}
                  <div className={`p-2.5 rounded-lg border flex items-center justify-between text-xs transition-all ${
                    isInsuranceDeclined ? 'bg-emerald-950/30 border-emerald-500/50 text-white' : 'bg-black/30 border-white/10 text-zinc-400'
                  }`}>
                    <span>Don't add Travel Insurance</span>
                    <span>{isInsuranceDeclined ? '🔘' : '⚪'}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-1">
                  <span className="text-xs text-zinc-400">Amount: <span className="text-white font-bold font-mono">₹1,699</span></span>
                  <button className="bg-red-600 text-white text-xs font-bold px-5 py-2 rounded-lg shadow-lg flex items-center gap-1 animate-pulse">
                    Continue booking ➔
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 5: Live Payment Gateway Checkout Screen */}
            {currentStep === 5 && (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/60 shadow-glow-white space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <span>💳 5. REACHED REDBUS PAYMENT GATEWAY</span>
                    </span>
                    <span className="bg-emerald-500 text-black text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                      SAFELY PAUSED
                    </span>
                  </div>

                  <div className="p-3 bg-black/60 rounded-lg border border-white/10 space-y-2 text-xs font-mono">
                    <div className="flex justify-between text-zinc-300">
                      <span>Operator / Bus:</span>
                      <span className="font-bold text-white">SBM TRAANSPORT (A/C Sleeper)</span>
                    </div>
                    <div className="flex justify-between text-zinc-300">
                      <span>Seat Berth:</span>
                      <span className="font-bold text-emerald-400">U16 (Upper Deck Window)</span>
                    </div>
                    <div className="flex justify-between text-zinc-300">
                      <span>Passenger Name:</span>
                      <span className="font-bold text-white">Jayadasan S (Age 22, Male)</span>
                    </div>
                    <div className="flex justify-between text-zinc-300">
                      <span>Boarding Time & Point:</span>
                      <span className="font-bold text-white">19:00 - Koyambedu CMBT</span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t border-white/10">
                      <span className="text-zinc-400 font-bold">Total Payable:</span>
                      <span className="text-emerald-400 font-extrabold text-base">₹1,699</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-[#18181b] rounded-lg border border-white/10 text-center text-xs text-zinc-300">
                  🎯 <span className="font-bold text-white">Agent Execution Complete:</span> All steps automated with zero manual typing.
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="p-4 bg-[#18181b] border-t border-white/10 flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold"
            >
              Close
            </button>
            <button
              onClick={handleFinalRedBusTab}
              className="px-6 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm font-bold shadow-lg flex items-center gap-2"
            >
              <span>Launch Live RedBus Portal Tab ➔</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
