const ActivityCard = ({ activity, isLast }) => {
  const { time = '09:00 AM', title = 'Activity', description = '', estimatedCost = 0, placeName, address, googleMapsUrl, category } = activity || {};

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'restaurant': return '🍽️';
      case 'hotel': return '🏨';
      case 'attraction': return '🎯';
      case 'activity': return '🎪';
      case 'transport': return '🚗';
      default: return '📍';
    }
  };

  const timeDisplay = (time && typeof time === 'string') ? time.split(' ')[0] : '09:00';

  return (
    <div className={`flex ${!isLast ? 'pb-3 border-b border-gray-100' : ''}`}>
      {/* Timeline indicator */}
      <div className="flex flex-col items-center mr-4">
        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-semibold text-primary-600">
            {timeDisplay}
          </span>
        </div>
        {!isLast && (
          <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
        )}
      </div>

      {/* Activity content */}
      <div className="flex-1 pt-1">
        <div className="flex items-start justify-between mb-1">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              {category && <span className="text-lg">{getCategoryIcon(category)}</span>}
              <h5 className="font-semibold text-white">{title}</h5>
            </div>
            {placeName && placeName !== title && (
              <p className="text-xs text-zinc-500 mt-0.5">📍 {placeName}</p>
            )}
          </div>
          <span className="text-sm font-medium text-secondary-600 ml-4 flex-shrink-0">
            {estimatedCost === 0 ? 'Free' : `₹${estimatedCost.toLocaleString('en-IN')}`}
          </span>
        </div>

        <p className="text-xs text-zinc-500 mb-1">{time}</p>

        {address && (
          <p className="text-xs text-zinc-400 mb-1">
            📮 {address}
          </p>
        )}

        <p className="text-sm text-zinc-400 leading-relaxed mb-2">
          {description}
        </p>

        {googleMapsUrl && (
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-xs text-primary-600 hover:text-primary-700 font-medium"
          >
            🗺️ View on Google Maps →
          </a>
        )}
      </div>
    </div>
  );
};

export default ActivityCard;
