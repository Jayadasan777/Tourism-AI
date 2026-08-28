import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

function useTypingEffect(targetText, startDelay, charDelay) {
  charDelay = charDelay || 60;
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const startTimer = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setDisplayed(targetText.slice(0, i));
        if (i >= targetText.length) { clearInterval(interval); setDone(true); }
      }, charDelay);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(startTimer);
  }, [targetText, startDelay, charDelay]);
  return { displayed, done };
}

const Cursor = () => React.createElement("span", { className: "inline-block w-0.5 h-4 bg-emerald-400 animate-pulse ml-0.5 align-middle" });

function RobotInput({ label, value, isActive, isDone, icon }) {
  return React.createElement("div", { className: "space-y-1" },
    React.createElement("label", { className: "text-xs text-zinc-400 font-mono" }, icon + " " + label),
    React.createElement("div", {
      className: "px-3 py-2 rounded-lg border text-sm font-mono transition-all duration-300 min-h-9 flex items-center " + (
        isActive ? "border-emerald-400 bg-emerald-950/30 shadow-[0_0_12px_rgba(52,211,153,0.2)]" :
        isDone ? "border-zinc-600 bg-zinc-900/60 text-white" :
        "border-zinc-700 bg-zinc-900/40 text-zinc-600"
      )
    },
      isActive ? React.createElement("span", { className: "text-white" }, value, React.createElement(Cursor)) :
      isDone ? React.createElement("span", { className: "text-emerald-300" }, value + " ✓") :
      React.createElement("span", { className: "text-zinc-600 italic text-xs" }, "waiting...")
    )
  );
}

function StepBadge({ number, label, status }) {
  return React.createElement("div", {
    className: "flex items-center gap-1.5 text-xs transition-all " + (
      status === "done" ? "text-emerald-400" : status === "active" ? "text-white font-bold" : "text-zinc-600"
    )
  },
    React.createElement("span", {
      className: "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 " + (
        status === "done" ? "bg-emerald-500 text-black" : status === "active" ? "bg-white text-black animate-pulse" : "bg-zinc-800 text-zinc-500"
      )
    }, status === "done" ? "✓" : number),
    React.createElement("span", { className: "hidden sm:inline" }, label)
  );
}

export default function RedBusLiveBookingSimulator({ isOpen, onClose, destination, startDate }) {
  const [step, setStep] = useState(0);
  const [seatSelected, setSeatSelected] = useState(false);
  const [boardingSelected, setBoardingSelected] = useState(false);
  const [agentLog, setAgentLog] = useState([]);
  const logRef = useRef(null);

  const dest = destination || "Kanyakumari";
  const travelDate = new Date(startDate || Date.now());
  const formattedDate = travelDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  const phoneTyping = useTypingEffect("7708254161", step >= 4 ? 0 : 999999, 70);
  const emailTyping = useTypingEffect("jayadasan@smarttour.ai", step >= 4 ? 900 : 999999, 55);
  const nameTyping = useTypingEffect("Jayadasan S", step >= 4 ? 2200 : 999999, 75);
  const ageTyping = useTypingEffect("22", step >= 4 ? 3400 : 999999, 100);

  const addLog = (msg) => setAgentLog(prev => [...prev.slice(-6), msg]);

  useEffect(() => {
    if (!isOpen) { setStep(0); setSeatSelected(false); setBoardingSelected(false); setAgentLog([]); return; }
    setAgentLog([]); setStep(1);
    const T = [
      setTimeout(() => addLog("Scanning 8 buses... Analyzing ratings and prices..."), 300),
      setTimeout(() => addLog("Selected: SRM TRAVELS (4.5 stars, A/C Sleeper 2+1)"), 1000),
      setTimeout(() => { addLog("Clicking Select Seats button..."); setStep(2); }, 2000),
      setTimeout(() => { addLog("Seat U12 (Upper Deck Window) locked - Rs.850"); setSeatSelected(true); }, 3200),
      setTimeout(() => { addLog("Opening boarding and dropping point selection..."); setStep(3); }, 4400),
      setTimeout(() => { addLog("Boarding: Chennai CMBT | Drop: " + dest + " Bus Stand"); setBoardingSelected(true); }, 5400),
      setTimeout(() => { addLog("Opening passenger details form..."); setStep(4); }, 6400),
      setTimeout(() => addLog("Typing mobile number..."), 6600),
      setTimeout(() => addLog("Typing email address..."), 7600),
      setTimeout(() => addLog("Typing passenger name..."), 8800),
      setTimeout(() => addLog("Typing age and selecting gender Male..."), 10000),
      setTimeout(() => { addLog("Clicking Proceed to Payment..."); setStep(5); }, 11500),
      setTimeout(() => addLog("Payment Gateway reached! All done!"), 12200),
    ];
    return () => T.forEach(clearTimeout);
  }, [isOpen]);

  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [agentLog]);

  if (!isOpen) return null;

  const ss = (n) => n < step ? "done" : n === step ? "active" : "pending";

  const handleOpenAbhiBus = async () => {
    // Build fallback URL
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    const fallbackUrl = `https://www.abhibus.com/bus_search/Chennai/6/Kanyakumari/1667/${dateStr}/O`;

    try {
      console.log("🤖 Triggering real AbhiBus browser automation via local backend...");
      const response = await fetch('http://localhost:5000/api/agentic/automate-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'Chennai',
          to: dest
        })
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error("Backend automation failed to start");
      }
      console.log("🤖 Real AbhiBus automation successfully triggered on your desktop!");
    } catch (e) {
      console.log("ℹ️ Local backend not running. Falling back to search page.");
      window.open(fallbackUrl, '_blank');
    }
  };

  return React.createElement(AnimatePresence, null,
    React.createElement("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-xl" },
      React.createElement(motion.div, {
        initial: { opacity: 0, scale: 0.94, y: 20 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.94, y: 20 },
        transition: { duration: 0.25 },
        className: "w-full max-w-3xl bg-[#0a0a0c] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
      },
        // Browser bar
        React.createElement("div", { className: "bg-[#111113] px-4 py-2.5 border-b border-white/10 flex items-center justify-between shrink-0" },
          React.createElement("div", { className: "flex items-center gap-3" },
            React.createElement("div", { className: "flex gap-1.5" },
              React.createElement("span", { className: "w-3 h-3 rounded-full bg-red-500/80" }),
              React.createElement("span", { className: "w-3 h-3 rounded-full bg-yellow-500/80" }),
              React.createElement("span", { className: "w-3 h-3 rounded-full bg-green-500/80" })
            ),
            React.createElement("div", { className: "bg-[#1e1e21] text-zinc-300 text-xs px-3 py-1 rounded-md font-mono flex items-center gap-2 border border-white/5" },
              React.createElement("span", { className: "text-emerald-400" }, "🔒"),
              React.createElement("span", { className: "text-zinc-400" }, "abhibus.com"),
              React.createElement("span", { className: "text-zinc-600" }, "/bus/chennai-to-" + dest.toLowerCase()),
              React.createElement("span", { className: "ml-1 text-[10px] font-bold bg-red-600 text-white px-1.5 py-0.5 rounded animate-pulse" }, "🤖 AI AGENT LIVE")
            )
          ),
          React.createElement("button", { onClick: onClose, className: "text-zinc-500 hover:text-white text-lg w-7 h-7 flex items-center justify-center rounded" }, "✕")
        ),
        // Step progress bar
        React.createElement("div", { className: "bg-[#0d0d10] px-4 py-2 border-b border-white/10 flex items-center gap-2 sm:gap-3 overflow-x-auto shrink-0" },
          React.createElement(StepBadge, { number: "1", label: "Bus Search", status: ss(1) }),
          React.createElement("span", { className: "text-zinc-700 shrink-0" }, "›"),
          React.createElement(StepBadge, { number: "2", label: "Seat Select", status: ss(2) }),
          React.createElement("span", { className: "text-zinc-700 shrink-0" }, "›"),
          React.createElement(StepBadge, { number: "3", label: "Boarding Point", status: ss(3) }),
          React.createElement("span", { className: "text-zinc-700 shrink-0" }, "›"),
          React.createElement(StepBadge, { number: "4", label: "Passenger Form", status: ss(4) }),
          React.createElement("span", { className: "text-zinc-700 shrink-0" }, "›"),
          React.createElement(StepBadge, { number: "5", label: "Payment", status: ss(5) })
        ),
        // Dynamic content
        React.createElement("div", { className: "flex-1 overflow-y-auto" },
          React.createElement(AnimatePresence, { mode: "wait" },
            // Step 1: Bus listing
            step === 1 && React.createElement(motion.div, { key: "s1", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "p-4 space-y-3" },
              React.createElement("div", { className: "flex items-center justify-between text-xs text-zinc-400 mb-2" },
                React.createElement("span", null, "Chennai → ", React.createElement("strong", { className: "text-white" }, dest), " · " + formattedDate),
                React.createElement("span", { className: "flex items-center gap-1.5 text-emerald-400 font-mono" },
                  React.createElement("span", { className: "w-2 h-2 rounded-full bg-emerald-400 animate-ping" }),
                  "AI scanning buses..."
                )
              ),
              React.createElement("div", { className: "p-4 rounded-xl bg-[#111115] border-2 border-emerald-500/60 shadow-lg" },
                React.createElement("div", { className: "flex justify-between items-start mb-3" },
                  React.createElement("div", null,
                    React.createElement("div", { className: "flex items-center gap-2 flex-wrap" },
                      React.createElement("span", { className: "font-bold text-white text-sm" }, "SRM TRAVELS"),
                      React.createElement("span", { className: "bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded" }, "★ 4.5 (312)"),
                      React.createElement("span", { className: "text-[10px] text-emerald-400 border border-emerald-500/40 px-1.5 py-0.5 rounded font-mono" }, "🤖 AI TOP PICK")
                    ),
                    React.createElement("p", { className: "text-xs text-zinc-400 mt-1" }, "A/C Sleeper (2+1) · Free Cancellation")
                  ),
                  React.createElement("div", { className: "text-right" },
                    React.createElement("div", { className: "text-lg font-bold text-white" }, "₹850"),
                    React.createElement("div", { className: "text-[11px] text-zinc-400" }, "Onwards")
                  )
                ),
                React.createElement("div", { className: "flex justify-between items-center pt-2 border-t border-white/10 text-xs" },
                  React.createElement("span", { className: "text-zinc-300 font-mono" }, "20:00 Chennai → 07:30 " + dest + " · 11h 30m"),
                  React.createElement(motion.button, {
                    animate: { scale: [1, 1.05, 1] }, transition: { repeat: Infinity, duration: 1.4 },
                    className: "bg-orange-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg"
                  }, "Select Seats →")
                )
              ),
              ["KPN Travels · ₹920 · ★4.2", "Orange Travels · ₹780 · ★4.0", "VRL Travels · ₹1,100 · ★4.3"].map((b, i) =>
                React.createElement("div", { key: i, className: "p-3 rounded-lg bg-[#111115] border border-zinc-800 opacity-40 flex justify-between items-center text-xs text-zinc-400" },
                  React.createElement("span", null, b),
                  React.createElement("span", { className: "text-zinc-600" }, "Select Seats")
                )
              )
            ),

            // Step 2: Seat layout
            step === 2 && React.createElement(motion.div, { key: "s2", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "p-4 space-y-4" },
              React.createElement("div", { className: "text-xs text-zinc-400 flex justify-between" },
                React.createElement("span", null, "SRM TRAVELS · Chennai → " + dest),
                React.createElement("span", { className: "text-emerald-400 font-mono flex items-center gap-1" },
                  React.createElement("span", { className: "w-2 h-2 rounded-full bg-emerald-400 animate-ping" }),
                  "AI selecting optimal seat..."
                )
              ),
              React.createElement("div", { className: "grid grid-cols-2 gap-4" },
                React.createElement("div", { className: "bg-[#111115] rounded-xl p-3 border border-zinc-800" },
                  React.createElement("p", { className: "text-xs text-zinc-400 mb-3 font-mono" }, "Lower Deck"),
                  React.createElement("div", { className: "grid grid-cols-3 gap-1.5" },
                    ["L1","L2","L3","L4","L5","L6"].map(s => React.createElement("div", { key: s, className: "h-8 rounded bg-zinc-700/50 border border-zinc-600 text-[10px] text-zinc-400 flex items-center justify-center" }, s)),
                    ["L7","L8","L9"].map(s => React.createElement("div", { key: s, className: "h-8 rounded bg-zinc-800 border border-zinc-700 text-[10px] text-zinc-600 flex items-center justify-center opacity-50" }, "Sold"))
                  )
                ),
                React.createElement("div", { className: "bg-[#111115] rounded-xl p-3 border " + (seatSelected ? "border-emerald-500/60" : "border-emerald-500/30") },
                  React.createElement("p", { className: "text-xs text-emerald-400 mb-3 font-mono" }, "Upper Deck ← AI Choice"),
                  React.createElement("div", { className: "grid grid-cols-3 gap-1.5" },
                    ["U1","U2","U3"].map(s => React.createElement("div", { key: s, className: "h-8 rounded bg-zinc-800 border border-zinc-700 text-[10px] text-zinc-600 flex items-center justify-center opacity-50" }, "Sold")),
                    React.createElement(motion.div, {
                      animate: seatSelected ? {} : { scale: [1, 1.1, 1] },
                      transition: { repeat: Infinity, duration: 1 },
                      className: "h-8 rounded border-2 text-[10px] font-bold flex items-center justify-center " + (seatSelected ? "bg-emerald-500 border-emerald-400 text-black" : "bg-emerald-900/40 border-emerald-500 text-emerald-300")
                    }, seatSelected ? "✓ U12" : "U12"),
                    ["U5","U6","U7","U8"].map(s => React.createElement("div", { key: s, className: "h-8 rounded bg-zinc-700/50 border border-zinc-600 text-[10px] text-zinc-400 flex items-center justify-center" }, s))
                  )
                )
              ),
              seatSelected && React.createElement(motion.div, { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, className: "flex justify-between items-center p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-lg text-xs" },
                React.createElement("span", { className: "text-emerald-300" }, "✓ Seat U12 selected — Upper Deck Window · ₹850"),
                React.createElement(motion.button, { animate: { scale: [1, 1.04, 1] }, transition: { repeat: Infinity, duration: 1.2 }, className: "bg-orange-500 text-white font-bold px-3 py-1.5 rounded-lg" }, "Confirm Boarding →")
              )
            ),

            // Step 3: Boarding
            step === 3 && React.createElement(motion.div, { key: "s3", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "p-4 space-y-4" },
              React.createElement("p", { className: "text-xs text-zinc-400" }, "AI selecting optimal boarding and dropping points..."),
              React.createElement("div", { className: "grid sm:grid-cols-2 gap-4" },
                React.createElement("div", { className: "bg-[#111115] rounded-xl p-4 border border-zinc-800 space-y-2" },
                  React.createElement("p", { className: "text-xs font-bold text-white mb-3" }, "🚌 Boarding Points — Chennai"),
                  [{ name: "Koyambedu CMBT", time: "20:00", best: true }, { name: "Broadway", time: "20:30", best: false }, { name: "Tambaram", time: "21:15", best: false }].map((bp, i) =>
                    React.createElement("div", { key: i, className: "flex items-center gap-3 p-2.5 rounded-lg border " + (bp.best && boardingSelected ? "border-emerald-500 bg-emerald-950/40" : "border-zinc-700 bg-zinc-900/40") },
                      React.createElement("div", { className: "w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 " + (bp.best && boardingSelected ? "border-emerald-400 bg-emerald-400" : "border-zinc-500") },
                        bp.best && boardingSelected && React.createElement("span", { className: "w-1.5 h-1.5 rounded-full bg-black" })
                      ),
                      React.createElement("div", null,
                        React.createElement("p", { className: "text-xs font-medium " + (bp.best && boardingSelected ? "text-emerald-300" : "text-zinc-300") }, bp.name),
                        React.createElement("p", { className: "text-[10px] text-zinc-500" }, bp.time)
                      ),
                      bp.best && React.createElement("span", { className: "ml-auto text-[10px] text-emerald-400 font-mono" }, "AI Pick ✓")
                    )
                  )
                ),
                React.createElement("div", { className: "bg-[#111115] rounded-xl p-4 border border-zinc-800 space-y-2" },
                  React.createElement("p", { className: "text-xs font-bold text-white mb-3" }, "📍 Dropping Points — " + dest),
                  [{ name: dest + " Bus Stand", time: "07:30", best: true }, { name: "Nagercoil", time: "06:45", best: false }].map((dp, i) =>
                    React.createElement("div", { key: i, className: "flex items-center gap-3 p-2.5 rounded-lg border " + (dp.best && boardingSelected ? "border-emerald-500 bg-emerald-950/40" : "border-zinc-700 bg-zinc-900/40") },
                      React.createElement("div", { className: "w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 " + (dp.best && boardingSelected ? "border-emerald-400 bg-emerald-400" : "border-zinc-500") },
                        dp.best && boardingSelected && React.createElement("span", { className: "w-1.5 h-1.5 rounded-full bg-black" })
                      ),
                      React.createElement("div", null,
                        React.createElement("p", { className: "text-xs font-medium " + (dp.best && boardingSelected ? "text-emerald-300" : "text-zinc-300") }, dp.name),
                        React.createElement("p", { className: "text-[10px] text-zinc-500" }, dp.time)
                      )
                    )
                  )
                )
              ),
              boardingSelected && React.createElement(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "flex justify-end" },
                React.createElement(motion.button, { animate: { scale: [1, 1.04, 1] }, transition: { repeat: Infinity, duration: 1.2 }, className: "bg-orange-500 text-white font-bold px-4 py-2 rounded-lg text-sm" }, "Fill Passenger Details →")
              )
            ),

            // Step 4: Passenger form
            step === 4 && React.createElement(motion.div, { key: "s4", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "p-4 space-y-4" },
              React.createElement("div", { className: "flex items-center gap-2 text-xs text-zinc-400" },
                React.createElement("span", { className: "w-2 h-2 rounded-full bg-emerald-400 animate-ping" }),
                React.createElement("span", { className: "font-mono text-emerald-400" }, "AI Agent typing passenger details...")
              ),
              React.createElement("div", { className: "grid sm:grid-cols-2 gap-3" },
                React.createElement(RobotInput, { label: "Mobile Number", value: phoneTyping.displayed, isActive: !phoneTyping.done, isDone: phoneTyping.done, icon: "📞" }),
                React.createElement(RobotInput, { label: "Email Address", value: emailTyping.displayed, isActive: step >= 4 && !emailTyping.done && phoneTyping.done, isDone: emailTyping.done, icon: "📧" }),
                React.createElement(RobotInput, { label: "Passenger Name", value: nameTyping.displayed, isActive: step >= 4 && !nameTyping.done && emailTyping.done, isDone: nameTyping.done, icon: "👤" }),
                React.createElement(RobotInput, { label: "Age", value: ageTyping.displayed, isActive: step >= 4 && !ageTyping.done && nameTyping.done, isDone: ageTyping.done, icon: "🎂" })
              ),
              React.createElement("div", { className: "space-y-1" },
                React.createElement("label", { className: "text-xs text-zinc-400 font-mono" }, "🚻 Gender"),
                React.createElement("div", { className: "flex gap-2" },
                  ["Male", "Female"].map(g => React.createElement("div", { key: g, className: "flex-1 py-2 rounded-lg border text-sm text-center font-medium transition-all " + (g === "Male" && ageTyping.done ? "border-emerald-400 bg-emerald-950/40 text-emerald-300" : "border-zinc-700 bg-zinc-900/40 text-zinc-500") }, g === "Male" && ageTyping.done ? "✓ Male" : g))
                )
              ),
              ageTyping.done && React.createElement(motion.div, { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, className: "flex justify-end pt-1" },
                React.createElement(motion.button, { animate: { scale: [1, 1.04, 1] }, transition: { repeat: Infinity, duration: 1.2 }, className: "bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2.5 rounded-lg text-sm" }, "Proceed to Payment →")
              )
            ),

            // Step 5: Payment
            step === 5 && React.createElement(motion.div, { key: "s5", initial: { opacity: 0 }, animate: { opacity: 1 }, className: "p-4 space-y-4" },
              React.createElement("div", { className: "p-4 rounded-xl bg-gradient-to-br from-emerald-950/60 to-green-950/40 border border-emerald-500/40 space-y-3" },
                React.createElement("div", { className: "flex items-center gap-2" },
                  React.createElement("span", { className: "text-2xl" }, "🎉"),
                  React.createElement("div", null,
                    React.createElement("p", { className: "text-emerald-300 font-bold" }, "Payment Gateway Reached!"),
                    React.createElement("p", { className: "text-xs text-zinc-400" }, "All details filled automatically by Tourism AI Agent")
                  )
                ),
                React.createElement("div", { className: "bg-black/40 rounded-lg p-3 font-mono text-xs space-y-1" },
                  [["Passenger", "Jayadasan S"], ["Route", "Chennai → " + dest], ["Seat", "U12 (Upper Deck Window)"], ["Date", formattedDate], ["Boarding", "Chennai CMBT · 20:00"], ["Total", "₹850"]].map(([k, v], i) =>
                    React.createElement("div", { key: i, className: "flex justify-between " + (i === 5 ? "border-t border-zinc-700 pt-1 mt-1" : "") },
                      React.createElement("span", { className: "text-zinc-400" }, k),
                      React.createElement("span", { className: i === 5 ? "text-emerald-300 font-bold" : i === 2 ? "text-emerald-300" : "text-white" }, v)
                    )
                  )
                )
              ),
              React.createElement("div", { className: "grid grid-cols-3 gap-2" },
                [["📱", "UPI / GPay", "border-blue-500/40 bg-blue-950/30"], ["💳", "Debit/Credit Card", "border-purple-500/40 bg-purple-950/30"], ["🏦", "Net Banking", "border-orange-500/40 bg-orange-950/30"]].map(([icon, label, cls], i) =>
                  React.createElement("div", { key: i, className: "p-3 rounded-xl border text-center " + cls },
                    React.createElement("div", { className: "text-xl mb-1" }, icon),
                    React.createElement("p", { className: "text-[10px] text-zinc-300 font-medium" }, label)
                  )
                )
              ),
              React.createElement("button", { onClick: handleOpenAbhiBus, className: "w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 rounded-xl text-sm transition-all" }, "🚀 Open Live AbhiBus to Complete Real Payment"),
              // Bookmarklet helper
              React.createElement("div", { className: "p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-xs space-y-1.5 font-sans" },
                React.createElement("p", { className: "text-zinc-300 font-bold flex items-center gap-1" }, "💡 Live Demo Bookmarklet:"),
                React.createElement("p", { className: "text-zinc-400 text-[11px]" }, "Click the link below to drag and save it to your bookmarks bar. When AbhiBus opens, click it to run all steps automatically!"),
                React.createElement("div", { className: "flex gap-2" },
                  React.createElement("a", {
                    href: `javascript:(async function(){const delay=ms=>new Promise(r=>setTimeout(r,ms));function clickByText(t,p){const els=Array.from(document.querySelectorAll('button,div,span,a,label,li,input[type="button"]'));for(const el of els){const txt=(el.innerText||el.value||'').trim().toLowerCase();if(p?txt.includes(t.toLowerCase()):txt===t.toLowerCase()){const r=el.getBoundingClientRect();if(r.width>0&&r.height>0){el.scrollIntoView({behavior:'smooth',block:'center'});el.click();return true;}}}return false;}console.log('🤖 Starting Smart Book...');let cs=false;for(const t of['select seats','select seat','book now','view seats']){if(clickByText(t,true)){cs=true;break;}}if(!cs){return;}await delay(3000);const seats=Array.from(document.querySelectorAll('[class*=\"available\"],[class*=\"seat-avail\"],[class*=\"seatAvail\"],canvas'));if(seats.length>0)seats[0].click();await delay(1500);clickByText('continue',true)||clickByText('proceed',true)||clickByText('next',true);await delay(2000);for(const loc of['koyambedu','cmbt','kk nagar','broadway','chennai']){if(clickByText(loc,true))break;}await delay(1500);clickByText('continue',true)||clickByText('proceed',true)||clickByText('next',true);await delay(3000);const P={n:'Jayadasan S',a:'22',p:'7708254161',e:'jayadasan@smarttour.ai'};const nI=document.querySelector('input[placeholder*=\"Name\" i],input[name*=\"name\" i]');if(nI){nI.value=P.n;nI.dispatchEvent(new Event('input',{bubbles:true}));}const aI=document.querySelector('input[placeholder*=\"Age\" i],input[name*=\"age\" i]');if(aI){aI.value=P.a;aI.dispatchEvent(new Event('input',{bubbles:true}));}const pI=document.querySelector('input[type=\"tel\"],input[placeholder*=\"Mobile\" i],input[name*=\"mobile\" i]');if(pI){pI.value=P.p;pI.dispatchEvent(new Event('input',{bubbles:true}));}const eI=document.querySelector('input[type=\"email\"],input[placeholder*=\"Email\" i],input[name*=\"email\" i]');if(eI){eI.value=P.e;eI.dispatchEvent(new Event('input',{bubbles:true}));}const gEls=Array.from(document.querySelectorAll('select,input[type=\"radio\"],label,option'));for(const el of gEls){const txt=(el.innerText||el.value||'').trim().toLowerCase();if(txt==='male'||txt==='m'){el.click();break;}}await delay(1500);clickByText('proceed to pay',true)||clickByText('pay now',true)||clickByText('continue to payment',true);})();`,
                    className: "bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded text-[11px] font-bold text-center w-full block transition-all"
                  }, "⭐ Drag Me to Bookmarks Bar (Smart Book)")
                )
              )
            )

          )
        ),
        // Agent log terminal
        React.createElement("div", { className: "bg-[#070709] border-t border-white/10 px-4 py-2 shrink-0" },
          React.createElement("div", { className: "flex items-center gap-2 mb-1.5" },
            React.createElement("span", { className: "w-2 h-2 rounded-full bg-emerald-400 animate-pulse" }),
            React.createElement("span", { className: "text-[10px] font-mono text-zinc-500" }, "TOURISM AI AGENT LOG")
          ),
          React.createElement("div", { ref: logRef, className: "h-16 overflow-y-auto space-y-0.5" },
            agentLog.map((msg, i) =>
              React.createElement(motion.p, { key: i, initial: { opacity: 0, x: -6 }, animate: { opacity: 1, x: 0 }, className: "text-[11px] font-mono text-emerald-300/80" },
                React.createElement("span", { className: "text-zinc-600" }, "> "),
                msg
              )
            )
          )
        )
      )
    )
  );
}
