const ForecastCard = ({ forecast }) => {
  if (!forecast || forecast.length === 0) {
    return null;
  }

  const getWeatherIcon = (condition) => {
    const conditionLower = condition?.toLowerCase() || '';
    if (conditionLower.includes('clear')) return '☀️';
    if (conditionLower.includes('cloud')) return '☁️';
    if (conditionLower.includes('rain')) return '🌧️';
    if (conditionLower.includes('snow')) return '❄️';
    if (conditionLower.includes('storm')) return '⛈️';
    return '🌤️';
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">5-Day Forecast</h3>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {forecast.slice(0, 5).map((day, index) => (
          <div
            key={index}
            className="bg-gray-50 rounded-lg p-3 text-center hover:bg-gray-100 transition-colors"
          >
            <div className="text-xs text-gray-600 mb-2">
              {index === 0 ? 'Today' : formatDate(day.date)}
            </div>
            <div className="text-3xl mb-2">{getWeatherIcon(day.condition)}</div>
            <div className="text-sm font-medium text-gray-900 mb-1 capitalize">
              {day.condition}
            </div>
            <div className="text-xs text-gray-600">
              <span className="font-semibold text-gray-900">{Math.round(day.maxTemp)}°</span>
              {' / '}
              <span>{Math.round(day.minTemp)}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForecastCard;
