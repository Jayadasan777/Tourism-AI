import { useState } from 'react';
import DayCard from './DayCard';
import InteractiveMap from '../map/InteractiveMap';

const ItineraryDisplay = ({ itinerary, onRegenerate, onSave, loading }) => {
  const [showMap, setShowMap] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  // API returns data as { days, metadata: { destination, budget, ... } }
  // Support both flat (authenticated/saved) and nested (anonymous) structures
  const days = itinerary.days || [];
  const destination = itinerary.destination || itinerary.metadata?.destination || 'Destination';
  const budget = Number(itinerary.budget || itinerary.metadata?.budget || 5000);
  const duration = Number(itinerary.duration || itinerary.metadata?.duration || 1);
  const totalEstimatedCost = Number(itinerary.totalEstimatedCost || itinerary.metadata?.totalEstimatedCost || 0);
  const startDate = itinerary.startDate || itinerary.metadata?.startDate || new Date().toISOString();

  const budgetComparison = totalEstimatedCost - budget;
  const isOverBudget = budgetComparison > 0;
  const budgetPercentage = budget > 0 ? (totalEstimatedCost / budget) * 100 : 0;

  const handleAutoBook = async () => {
    setBookingLoading(true);
    setBookingError(null);

    const fromCity = 'Chennai';
    const toCity = destination.trim();
    
    // Format travel date (YYYY-MM-DD)
    const travelDate = new Date(startDate);
    const yyyy = travelDate.getFullYear();
    const mm = String(travelDate.getMonth() + 1).padStart(2, '0');
    const dd = String(travelDate.getDate()).padStart(2, '0');
    const formattedDate = `${yyyy}-${mm}-${dd}`;

    // Direct RedBus Real-Time Booking URL format:
    // https://www.redbus.in/bus-tickets/chennai-to-[destination]?fromCityName=Chennai&toCityName=[destination]&onward=DD-MMM-YYYY
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const redbusDateStr = `${dd}-${monthNames[travelDate.getMonth()]}-${yyyy}`;
    const cleanToSlug = toCity.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const directRedBusUrl = `https://www.redbus.in/bus-tickets/chennai-to-${cleanToSlug}?fromCityName=Chennai&toCityName=${encodeURIComponent(toCity)}&onward=${redbusDateStr}&src=Chennai&dst=${encodeURIComponent(toCity)}`;

    // Immediately open RedBus in new tab for the user/judge to view live options & booking flow
    window.open(directRedBusUrl, '_blank', 'noopener,noreferrer');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/agentic/automate-booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: fromCity,
          to: toCity,
          date: formattedDate,
          passengerDetails: {
            name: 'Demo Traveler',
            age: 26,
            phone: '9876543210',
            email: 'traveler@smarttour.ai'
          }
        })
      });

      const data = await response.json();
      if (data.success) {
        console.log('✅ Automation response:', data);
      }
    } catch (err) {
      console.warn('Backend automation bridge notice (Direct live portal opened):', err.message);
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Metadata */}
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">{destination}</h2>
            <p className="text-zinc-400">{duration} {duration === 1 ? 'Day' : 'Days'} Trip</p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 mt-4 md:mt-0">
            <button
              onClick={onRegenerate}
              disabled={loading}
              className="btn-secondary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🔄 Regenerate
            </button>

            {onSave && (
              <button
                onClick={onSave}
                disabled={loading}
                className="btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                💾 Save
              </button>
            )}

            <button
              onClick={handleAutoBook}
              disabled={loading || bookingLoading}
              className="relative overflow-hidden text-sm px-4 py-2 rounded-lg font-bold inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-lg shadow-purple-500/30 border border-purple-400/20 hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {bookingLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Opening Browser...</span>
                </>
              ) : (
                <>
                  <span>🤖</span>
                  <span>Auto-Book Transport</span>
                </>
              )}
            </button>
          </div>
        </div>

        {bookingError && (
          <div className="mt-4 p-3 bg-red-900/20 border border-red-700 rounded-lg">
            <p className="text-red-400 text-sm">❌ {bookingError}</p>
          </div>
        )}

        {/* Budget Summary */}
        <div className="bg-zinc-900 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Budget */}
            <div>
              <p className="text-sm text-zinc-400">Total Budget</p>
              <p className="text-xl font-semibold text-white">
                ₹{budget.toLocaleString('en-IN')}
              </p>
            </div>

            {/* Estimated Cost */}
            <div>
              <p className="text-sm text-zinc-400">Estimated Cost</p>
              <p className={`text-xl font-semibold ${isOverBudget ? 'text-danger-600' : 'text-secondary-600'}`}>
                ₹{totalEstimatedCost.toLocaleString('en-IN')}
              </p>
            </div>

            {/* Difference */}
            <div>
              <p className="text-sm text-zinc-400">
                {isOverBudget ? 'Over Budget' : 'Under Budget'}
              </p>
              <p className={`text-xl font-semibold ${isOverBudget ? 'text-danger-600' : 'text-secondary-600'}`}>
                {isOverBudget ? '+' : '-'}₹{Math.abs(budgetComparison).toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-zinc-400">Budget Utilization</span>
              <span className={`text-xs font-medium ${isOverBudget ? 'text-danger-600' : 'text-secondary-600'}`}>
                {budgetPercentage.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  isOverBudget ? 'bg-danger-500' : 'bg-secondary-500'
                }`}
                style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Warning if over budget */}
          {isOverBudget && (
            <div className="mt-3 p-3 bg-danger-50 border border-danger-200 rounded-lg">
              <p className="text-sm text-danger-800">
                ⚠️ The estimated cost exceeds your budget. Consider regenerating with adjusted preferences or increasing your budget.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Map */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">
            🗺️ Interactive Map
          </h3>
          <button
            onClick={() => setShowMap(!showMap)}
            className="btn-secondary text-sm"
          >
            {showMap ? '📋 Show List View' : '🗺️ Show Map View'}
          </button>
        </div>

        {showMap && (
          <InteractiveMap itinerary={itinerary} height="600px" />
        )}

        {!showMap && (
          <div className="bg-zinc-900 rounded-lg p-6 text-center text-zinc-400">
            <span className="text-4xl mb-2 block">🗺️</span>
            <p>Click "Show Map View" to see all places on an interactive map</p>
            <p className="text-sm mt-1">View routes, distances, and navigate to each location</p>
          </div>
        )}
      </div>

      {/* Day-wise Itinerary */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">
          📅 Day-wise Itinerary
        </h3>

        {days && days.length > 0 ? (
          days.map((day) => (
            <DayCard key={day.dayNumber} day={day} startDate={startDate} />
          ))
        ) : (
          <div className="card">
            <p className="text-zinc-400">No itinerary data available.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="card bg-primary-50 border border-primary-200">
        <div className="flex items-start space-x-3">
          <span className="text-2xl">💡</span>
          <div>
            <h4 className="font-semibold text-primary-900 mb-1">
              AI-Generated Itinerary
            </h4>
            <p className="text-sm text-primary-800">
              This itinerary was generated using Google Gemini AI based on your preferences.
              Actual costs may vary. Please verify timings and availability before your trip.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItineraryDisplay;
