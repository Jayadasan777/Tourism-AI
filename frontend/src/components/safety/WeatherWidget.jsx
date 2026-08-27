const WeatherWidget = ({ weather }) => {
  if (!weather) {
    return (
      <div className="card">
        <p className="text-gray-500">Weather data not available</p>
      </div>
    );
  }

  const { temperature, condition, humidity, windSpeed, sunrise, sunset } = weather;

  // Get weather icon based on condition
  const getWeatherIcon = (condition) => {
    const conditionLower = condition?.toLowerCase() || '';
    if (conditionLower.includes('clear')) return '☀️';
    if (conditionLower.includes('cloud')) return '☁️';
    if (conditionLower.includes('rain')) return '🌧️';
    if (conditionLower.includes('snow')) return '❄️';
    if (conditionLower.includes('storm')) return '⛈️';
    if (conditionLower.includes('fog') || conditionLower.includes('mist')) return '🌫️';
    return '🌤️';
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Current Weather</h3>
          <p className="text-sm text-gray-600">Real-time conditions</p>
        </div>
        <span className="text-5xl">{getWeatherIcon(condition)}</span>
      </div>

      <div className="space-y-4">
        {/* Temperature and Condition */}
        <div>
          <div className="text-4xl font-bold text-gray-900 mb-1">
            {Math.round(temperature)}°C
          </div>
          <div className="text-lg text-gray-700 capitalize">{condition}</div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-blue-200">
          <div>
            <div className="text-xs text-gray-600 mb-1">Humidity</div>
            <div className="text-lg font-semibold text-gray-900">{humidity}%</div>
          </div>
          <div>
            <div className="text-xs text-gray-600 mb-1">Wind Speed</div>
            <div className="text-lg font-semibold text-gray-900">{windSpeed} km/h</div>
          </div>
          <div>
            <div className="text-xs text-gray-600 mb-1">Sunrise</div>
            <div className="text-sm font-medium text-gray-900">{formatTime(sunrise)}</div>
          </div>
          <div>
            <div className="text-xs text-gray-600 mb-1">Sunset</div>
            <div className="text-sm font-medium text-gray-900">{formatTime(sunset)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
