import { useState, useEffect } from 'react';
import WeatherWidget from './WeatherWidget';
import ForecastCard from './ForecastCard';
import { HazardAlertList } from './HazardAlert';
import EmergencyContacts from './EmergencyContacts';
import SafetyScore from './SafetyScore';

/**
 * SafetyDashboard Component
 * Main container that integrates all safety information components
 */
const SafetyDashboard = ({ destination }) => {
  const [safetyData, setSafetyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // overview, weather, hazards, emergency

  useEffect(() => {
    if (!destination) {
      setLoading(false);
      return;
    }

    const fetchSafetyData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/safety?destination=${encodeURIComponent(destination)}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch safety information');
        }

        const data = await response.json();
        setSafetyData(data.data);
      } catch (err) {
        console.error('Safety data fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSafetyData();
  }, [destination]);

  if (!destination) {
    return (
      <div className="card bg-gray-50">
        <p className="text-gray-600 text-center">
          Enter a destination to view safety information
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="card animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
        </div>
        <div className="card animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card bg-red-50 border border-red-200">
        <div className="flex items-start gap-3">
          <span className="text-2xl">❌</span>
          <div>
            <h3 className="font-semibold text-red-800 mb-1">Failed to Load Safety Data</h3>
            <p className="text-red-600 text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 btn-secondary text-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!safetyData) {
    return null;
  }

  const { weather, hazards, safetyScore, emergencyContacts } = safetyData;

  // Tab Navigation
  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'weather', label: 'Weather', icon: '🌤️' },
    { id: 'hazards', label: 'Alerts', icon: '⚠️', badge: hazards?.alerts?.length || 0 },
    { id: 'emergency', label: 'Emergency', icon: '📞' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card bg-gradient-to-r from-primary-500 to-primary-600 text-white">
        <h2 className="text-2xl font-bold mb-2">
          🛡️ Safety Information
        </h2>
        <p className="text-primary-100">
          Real-time safety data for {destination}
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="card p-0 overflow-hidden">
        <div className="flex overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[120px] px-4 py-3 text-sm font-medium transition-colors relative ${
                activeTab === tab.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                    activeTab === tab.id ? 'bg-white text-primary-600' : 'bg-red-500 text-white'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </div>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Safety Score */}
            {safetyScore !== undefined && (
              <SafetyScore
                score={safetyScore}
                weatherCondition={weather?.current?.condition}
                hazardCount={hazards?.alerts?.length || 0}
              />
            )}

            {/* Quick Weather Summary */}
            <WeatherWidget destination={destination} />

            {/* Active Hazards Summary */}
            {hazards?.alerts && hazards.alerts.length > 0 && (
              <div className="card bg-yellow-50 border-2 border-yellow-300">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-yellow-800 mb-2">
                      {hazards.alerts.length} Active Alert{hazards.alerts.length > 1 ? 's' : ''}
                    </h3>
                    <button
                      onClick={() => setActiveTab('hazards')}
                      className="text-sm text-yellow-700 hover:text-yellow-900 underline"
                    >
                      View all alerts →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Emergency Access */}
            <div className="card bg-red-50 border border-red-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🚨</span>
                  <div>
                    <h4 className="font-semibold text-red-800">Emergency Contacts</h4>
                    <p className="text-sm text-red-600">Quick access to help</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('emergency')}
                  className="btn-primary bg-red-600 hover:bg-red-700"
                >
                  View
                </button>
              </div>
            </div>
          </>
        )}

        {/* Weather Tab */}
        {activeTab === 'weather' && (
          <>
            <WeatherWidget destination={destination} />
            {weather?.forecast && <ForecastCard forecast={weather.forecast} />}
          </>
        )}

        {/* Hazards Tab */}
        {activeTab === 'hazards' && (
          <>
            <HazardAlertList alerts={hazards?.alerts || []} destination={destination} />

            {/* General Risks */}
            {hazards?.generalRisks && Object.keys(hazards.generalRisks).length > 0 && (
              <div className="card bg-blue-50 border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                  <span>ℹ️</span>
                  General Safety Considerations for {destination}
                </h3>
                <ul className="space-y-2 text-sm text-blue-700">
                  {Object.entries(hazards.generalRisks).map(([key, value]) => (
                    <li key={key} className="flex items-start gap-2">
                      <span className="text-blue-500">•</span>
                      <div>
                        <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                        {' '}{value}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        {/* Emergency Tab */}
        {activeTab === 'emergency' && (
          <EmergencyContacts destination={destination} />
        )}
      </div>

      {/* Data Timestamp */}
      <div className="text-center text-xs text-gray-500">
        Last updated: {new Date(safetyData.timestamp || Date.now()).toLocaleString('en-IN')}
      </div>
    </div>
  );
};

export default SafetyDashboard;
