import { useState } from 'react';
import { SafetyDashboard } from '../components/safety';

/**
 * SafetyPage
 * Standalone page for viewing safety information for any destination
 */
const SafetyPage = () => {
  const [destination, setDestination] = useState('');
  const [activeDestination, setActiveDestination] = useState('');

  const popularDestinations = [
    'Ladakh', 'Kerala', 'Rishikesh', 'Goa', 'Manali',
    'Sikkim', 'Uttarakhand', 'Himachal Pradesh', 'Rajasthan', 'Andaman'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (destination.trim()) {
      setActiveDestination(destination.trim());
    }
  };

  const handleQuickSelect = (dest) => {
    setDestination(dest);
    setActiveDestination(dest);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-3">🛡️ Travel Safety Information</h1>
          <p className="text-primary-100 text-lg">
            Real-time weather, hazard alerts, and emergency contacts for destinations across India
          </p>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-5xl mx-auto px-4 -mt-8">
        <div className="card shadow-lg">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Enter destination (e.g., Ladakh, Kerala, Rishikesh)"
              className="input-field flex-1"
              required
            />
            <button
              type="submit"
              className="btn-primary whitespace-nowrap"
            >
              🔍 Check Safety
            </button>
          </form>

          {/* Quick Select Chips */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Popular destinations:</p>
            <div className="flex flex-wrap gap-2">
              {popularDestinations.map((dest) => (
                <button
                  key={dest}
                  onClick={() => handleQuickSelect(dest)}
                  className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                    activeDestination === dest
                      ? 'bg-primary-500 text-white border-primary-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-primary-500 hover:text-primary-600'
                  }`}
                >
                  {dest}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Safety Dashboard */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {activeDestination ? (
          <SafetyDashboard destination={activeDestination} />
        ) : (
          <div className="card bg-gradient-to-br from-blue-50 to-blue-100 text-center py-12">
            <span className="text-6xl mb-4 block">🗺️</span>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Enter a Destination to Get Started
            </h2>
            <p className="text-gray-600">
              Search for any destination in India to view safety information
            </p>
          </div>
        )}
      </div>

      {/* Info Footer */}
      <div className="max-w-5xl mx-auto px-4 pb-8">
        <div className="card bg-amber-50 border border-amber-200">
          <div className="flex items-start gap-3">
            <span className="text-2xl">ℹ️</span>
            <div className="flex-1 text-sm">
              <h4 className="font-semibold text-amber-800 mb-2">About This Data</h4>
              <ul className="space-y-1 text-amber-700">
                <li>• Weather data is fetched in real-time from OpenWeatherMap</li>
                <li>• Hazard alerts are simulated based on historical patterns for demonstration</li>
                <li>• Always verify information with official sources before traveling</li>
                <li>• For real-time official alerts, visit IMD (mausam.imd.gov.in) and NDMA (ndma.gov.in)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyPage;
