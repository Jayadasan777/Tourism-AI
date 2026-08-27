/**
 * AUTO-BOOKING DEMO PAGE
 *
 * Shows browser automation in action
 * AI automatically books on RedBus and stops at payment
 */

import { useState } from 'react';

const AutoBookingDemo = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    from: 'Chennai',
    to: 'Rameswaram',
    date: '2026-09-15',
    name: 'John Doe',
    age: '25',
    phone: '9876543210',
    email: 'demo@test.com'
  });

  const handleAutoBook = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://smart-tour-ai-backend.onrender.com/api';
      const response = await fetch(`${apiUrl}/agentic/automate-booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: formData.from,
          to: formData.to,
          date: formData.date,
          passengerDetails: {
            name: formData.name,
            age: parseInt(formData.age),
            phone: formData.phone,
            email: formData.email
          }
        })
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error || 'Automation failed');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            🤖 AI Auto-Booking Demo
          </h1>
          <p className="text-zinc-400">
            Watch AI automatically book on REAL RedBus website
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-surface p-6 rounded-xl mb-6">
          <h2 className="text-xl font-semibold mb-4">Trip Details</h2>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">From</label>
              <input
                type="text"
                value={formData.from}
                onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                className="w-full bg-obsidian-900 border border-zinc-800 rounded-lg px-4 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-2">To</label>
              <input
                type="text"
                value={formData.to}
                onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                className="w-full bg-obsidian-900 border border-zinc-800 rounded-lg px-4 py-2 text-white"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm text-zinc-400 mb-2">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full bg-obsidian-900 border border-zinc-800 rounded-lg px-4 py-2 text-white"
            />
          </div>

          <h3 className="text-lg font-semibold mb-3 mt-6">Passenger Details</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-obsidian-900 border border-zinc-800 rounded-lg px-4 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Age</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full bg-obsidian-900 border border-zinc-800 rounded-lg px-4 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-obsidian-900 border border-zinc-800 rounded-lg px-4 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-obsidian-900 border border-zinc-800 rounded-lg px-4 py-2 text-white"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleAutoBook}
          disabled={loading}
          className="w-full bg-white text-black font-bold py-4 px-6 rounded-lg hover:bg-zinc-200 disabled:bg-zinc-700 disabled:text-zinc-400 transition-all text-lg"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              🤖 Browser Automating...
            </span>
          ) : (
            '🤖 AUTO-BOOK on RedBus (Watch Browser!)'
          )}
        </button>

        {/* Instructions */}
        {loading && (
          <div className="glass-surface p-4 rounded-lg mt-4">
            <h3 className="text-yellow-400 font-semibold mb-2">⚡ WATCH THE BROWSER!</h3>
            <ul className="text-sm text-zinc-300 space-y-1">
              <li>✅ Browser window will open automatically</li>
              <li>✅ Watch it go to RedBus.in</li>
              <li>✅ Watch it fill the form</li>
              <li>✅ Watch it select bus and seats</li>
              <li>✅ Watch it fill passenger details</li>
              <li>⏸️ It will STOP at payment page</li>
            </ul>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="glass-surface bg-red-900/20 border border-red-700 p-4 rounded-lg mt-4">
            <h3 className="text-red-400 font-semibold mb-2">❌ Error</h3>
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Success Result */}
        {result && result.success && (
          <div className="glass-surface bg-green-900/20 border border-green-700 p-6 rounded-lg mt-4">
            <h3 className="text-green-400 font-semibold text-xl mb-4">
              ✅ Automation Successful!
            </h3>

            <div className="space-y-3">
              <div>
                <span className="text-zinc-400">Status:</span>
                <span className="ml-2 text-white font-semibold">{result.status}</span>
              </div>

              {result.buses && result.buses.length > 0 && (
                <div>
                  <span className="text-zinc-400">Buses Found:</span>
                  <span className="ml-2 text-white font-semibold">{result.buses.length}</span>
                </div>
              )}

              {result.selectedBus && (
                <div>
                  <span className="text-zinc-400">Selected Bus:</span>
                  <span className="ml-2 text-white font-semibold">{result.selectedBus.name}</span>
                  <span className="ml-2 text-zinc-400">{result.selectedBus.price}</span>
                </div>
              )}

              <div>
                <span className="text-zinc-400">Current Page:</span>
                <span className="ml-2 text-white text-sm">{result.currentUrl}</span>
              </div>

              <div className="bg-obsidian-900 border border-zinc-800 p-4 rounded-lg mt-4">
                <p className="text-yellow-400 font-semibold mb-2">⏸️ FOR JUDGES:</p>
                <p className="text-zinc-300 text-sm">
                  {result.instructions?.forJudges}
                </p>
                <p className="text-zinc-400 text-xs mt-2">
                  Browser is kept open so you can show the payment page to judges!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Demo Notes */}
        <div className="glass-surface p-4 rounded-lg mt-6 border border-yellow-700/50">
          <h3 className="text-yellow-400 font-semibold mb-2">📝 Demo Notes</h3>
          <ul className="text-sm text-zinc-300 space-y-1">
            <li>🌐 This opens a REAL browser window (Chrome)</li>
            <li>🤖 AI controls the browser automatically</li>
            <li>🔴 Goes to actual RedBus.in website</li>
            <li>💳 Stops at payment page (no money charged!)</li>
            <li>👀 Judges can SEE the real RedBus payment screen</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AutoBookingDemo;
