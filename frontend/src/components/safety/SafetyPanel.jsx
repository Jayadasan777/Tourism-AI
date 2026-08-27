import { useState, useEffect } from 'react';
import { getSafetyInfo } from '../../services/safetyService';
import WeatherWidget from './WeatherWidget';
import ForecastCard from './ForecastCard';
import HazardAlert from './HazardAlert';
import SafetyScore from './SafetyScore';

const SafetyPanel = ({ destination }) => {
  const [loading, setLoading] = useState(false);
  const [safetyData, setSafetyData] = useState(null);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (destination && isOpen) {
      fetchSafetyInfo();
    }
  }, [destination, isOpen]);

  const fetchSafetyInfo = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getSafetyInfo(destination);
      if (response.success) {
        setSafetyData(response.data);
      } else {
        setError('Failed to fetch safety information');
      }
    } catch (err) {
      console.error('Error fetching safety info:', err);
      setError(err.message || 'Failed to fetch safety information');
    } finally {
      setLoading(false);
    }
  };

  if (!destination) {
    return null;
  }

  return (
    <div className="card bg-blue-50 border-blue-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🛡️</span>
          <div>
            <h3 className="font-semibold text-gray-900">Safety Information</h3>
            <p className="text-sm text-gray-600">Weather & alerts for {destination}</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="btn-secondary text-sm"
        >
          {isOpen ? 'Hide' : 'Show'} Safety Info
        </button>
      </div>

      {/* Content */}
      {isOpen && (
        <div className="space-y-4 mt-4 pt-4 border-t border-blue-200">
          {loading && (
            <div className="text-center py-8">
              <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading safety information...</p>
            </div>
          )}

          {error && (
            <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
              <p className="text-danger-800">{error}</p>
              <button
                onClick={fetchSafetyInfo}
                className="btn-primary text-sm mt-2"
              >
                Retry
              </button>
            </div>
          )}

          {safetyData && !loading && (
            <div className="space-y-4">
              {/* Safety Score */}
              {safetyData.safetyScore !== undefined && (
                <SafetyScore score={safetyData.safetyScore} destination={destination} />
              )}

              {/* Weather */}
              {safetyData.weather && (
                <WeatherWidget weather={safetyData.weather} />
              )}

              {/* Forecast */}
              {safetyData.forecast && safetyData.forecast.length > 0 && (
                <ForecastCard forecast={safetyData.forecast} />
              )}

              {/* Hazard Alerts */}
              {safetyData.hazards && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Active Alerts</h4>
                  <HazardAlert alerts={safetyData.hazards.alerts} />
                </div>
              )}

              {/* Emergency Contacts */}
              {safetyData.emergencyContacts && safetyData.emergencyContacts.length > 0 && (
                <div className="card bg-gray-50">
                  <h4 className="font-semibold text-gray-900 mb-3">Emergency Contacts</h4>
                  <div className="space-y-2">
                    {safetyData.emergencyContacts.map((contact, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{contact.service}</span>
                        <a
                          href={`tel:${contact.number}`}
                          className="font-semibold text-primary-600 hover:underline"
                        >
                          {contact.number}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SafetyPanel;
