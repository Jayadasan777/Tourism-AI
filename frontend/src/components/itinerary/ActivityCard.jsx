const ActivityCard = ({ activity, isLast }) => {
  const { time, title, description, estimatedCost } = activity;

  return (
    <div className={`flex ${!isLast ? 'pb-3 border-b border-gray-100' : ''}`}>
      {/* Timeline indicator */}
      <div className="flex flex-col items-center mr-4">
        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-semibold text-primary-600">
            {time.split(' ')[0]}
          </span>
        </div>
        {!isLast && (
          <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
        )}
      </div>

      {/* Activity content */}
      <div className="flex-1 pt-1">
        <div className="flex items-start justify-between mb-1">
          <h5 className="font-semibold text-gray-900">{title}</h5>
          <span className="text-sm font-medium text-secondary-600 ml-4 flex-shrink-0">
            ₹{estimatedCost.toLocaleString('en-IN')}
          </span>
        </div>

        <p className="text-xs text-gray-500 mb-1">{time}</p>

        <p className="text-sm text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

export default ActivityCard;
