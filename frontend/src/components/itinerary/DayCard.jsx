import ActivityCard from './ActivityCard';

const DayCard = ({ day, startDate }) => {
  const { dayNumber } = day;
  // Guard: activities might be a string or null in fallback mode
  const activities = Array.isArray(day.activities) ? day.activities : [];

  // Calculate the actual date for this day
  const getDateForDay = () => {
    if (!startDate) return null;

    const date = new Date(startDate);
    date.setDate(date.getDate() + dayNumber - 1);

    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate total cost for the day
  const dayTotal = activities.reduce((sum, activity) => sum + (activity.estimatedCost || 0), 0);

  return (
    <div className="card border-l-4 border-primary-500">
      {/* Day Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 pb-4 border-b border-gray-200">
        <div>
          <h4 className="text-lg font-bold text-gray-900">
            Day {dayNumber}
          </h4>
          {startDate && (
            <p className="text-sm text-gray-600">
              {getDateForDay()}
            </p>
          )}
        </div>

        <div className="mt-2 md:mt-0">
          <span className="text-sm text-gray-600">Day Total: </span>
          <span className="text-lg font-semibold text-primary-600">
            ₹{dayTotal.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Activities */}
      <div className="space-y-3">
        {activities && activities.length > 0 ? (
          activities.map((activity, index) => (
            <ActivityCard key={index} activity={activity} isLast={index === activities.length - 1} />
          ))
        ) : (
          <p className="text-gray-500 text-sm">No activities planned for this day.</p>
        )}
      </div>
    </div>
  );
};

export default DayCard;
