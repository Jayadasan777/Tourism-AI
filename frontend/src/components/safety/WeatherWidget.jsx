import { useState, useEffect } from 'react';

/**
 * WeatherWidget Component
 * Displays current weather conditions for a destination
 */
const WeatherWidget = ({ destination }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!destination) {
      setLoading(false);
      return;
    }

    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/safety/weather?destination=${encodeURIComponent(destination)}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }

        const data = await response.json();
        setWeather(data.data);
      } catch (err) {
        console.error('Weather fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [destination]);

  if (!destination) {
    return null;
  }

  if (loading) {
    return (
      <div className="card animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-20 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card bg-red-50 border border-red-200">
        <p className="text-red-600">Failed to load weather data</p>
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  const { location, current, alerts } = weather;

  // Weather icon mapping
  const getWeatherEmoji = (condition) => {
    const emojiMap = {
      'Clear': '☀️',
      'Clouds': '☁️',
      'Rain': '🌧️',
      'Drizzle': '🌦️',
      'Thunderstorm': '⛈️',
      'Snow': '❄️',
      'Mist': '🌫️',
      'Fog': '🌫️',
      'Haze': '🌫️'
    };
    return emojiMap[condition] || '🌤️';
  };

  return (
    <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {getWeatherEmoji(current.condition)} Weather in {location.name}
        </h3>
        {location.state && (
          <span className="text-sm text-gray-600">{location.state}</span>
        )}
      </div>

      {/* Severe Weather Alert */}
      {alerts?.hasSevereWeather && (
        <div className="bg-red-500 text-white px-4 py-2 rounded-lg mb-4 flex items-start gap-2">
          <span className="text-xl">⚠️</span>
          <div className="flex-1">
            <p className="font-semibold">Severe Weather Alert</p>
            <p className="text-sm">{alerts.message}</p>
          </div>
        </div>
      )}

      {/* Current Weather */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-4xl font-bold text-gray-800">
            {current.temperature}°C
          </div>
          <div className="text-gray-600 capitalize">{current.description}</div>
          <div className="text-sm text-gray-500">
            Feels like {current.feelsLike}°C
          </div>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Min/Max:</span>
            <span className="font-medium">{current.tempMin}°C / {current.tempMax}°C</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Humidity:</span>
            <span className="font-medium">{current.humidity}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Wind:</span>
            <span className="font-medium">{current.windSpeed} km/h</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Visibility:</span>
            <span className="font-medium">{current.visibility} km</span>
          </div>
        </div>
      </div>

      {/* Sunrise/Sunset */}
      <div className="flex justify-between pt-4 border-t border-blue-200 text-sm">
        <div className="flex items-center gap-2">
          <span>🌅</span>
          <div>
            <div className="text-gray-600">Sunrise</div>
            <div className="font-medium">{current.sunrise}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span>🌇</span>
          <div>
            <div className="text-gray-600">Sunset</div>
            <div className="font-medium">{current.sunset}</div>
          </div>
        </div>
      </div>

      {/* Mock Data Indicator */}
      {weather.isMockData && (
        <div className="mt-3 pt-3 border-t border-blue-200">
          <p className="text-xs text-blue-600">
            ⚠️ Demo mode: Displaying sample weather data
          </p>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
