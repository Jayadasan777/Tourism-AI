/**
 * ForecastCard Component
 * Displays 5-day weather forecast
 */
const ForecastCard = ({ forecast }) => {
  if (!forecast || forecast.length === 0) {
    return null;
  }

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
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        5-Day Forecast
      </h3>

      {/* Horizontal scrollable forecast cards */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {forecast.map((day, index) => (
          <div
            key={index}
            className="flex-shrink-0 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 min-w-[140px] border border-gray-200 hover:shadow-md transition-shadow"
          >
            {/* Date */}
            <div className="text-sm font-medium text-gray-700 mb-2 text-center">
              {day.date}
            </div>

            {/* Weather Icon */}
            <div className="text-4xl text-center mb-2">
              {getWeatherEmoji(day.condition)}
            </div>

            {/* Temperature */}
            <div className="text-center mb-2">
              <div className="text-2xl font-bold text-gray-800">
                {day.temp}°C
              </div>
              <div className="text-xs text-gray-600">
                {day.tempMin}° / {day.tempMax}°
              </div>
            </div>

            {/* Condition */}
            <div className="text-xs text-gray-600 text-center capitalize mb-2">
              {day.description}
            </div>

            {/* Additional Info */}
            <div className="text-xs text-gray-500 space-y-1 pt-2 border-t border-gray-200">
              <div className="flex justify-between">
                <span>💧 {day.humidity}%</span>
                <span>💨 {day.windSpeed} km/h</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Scroll Hint on Mobile */}
      <div className="text-xs text-gray-500 text-center mt-3 md:hidden">
        ← Swipe to see more days →
      </div>
    </div>
  );
};

export default ForecastCard;
