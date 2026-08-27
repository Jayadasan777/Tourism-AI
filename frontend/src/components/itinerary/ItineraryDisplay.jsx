import { useState } from 'react';
import DayCard from './DayCard';
import InteractiveMap from '../map/InteractiveMap';

const ItineraryDisplay = ({ itinerary, onRegenerate, onSave, loading }) => {
  const [showMap, setShowMap] = useState(false);
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
          </div>
        </div>

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
