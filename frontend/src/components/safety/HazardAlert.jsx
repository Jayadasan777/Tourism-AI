const HazardAlert = ({ alerts }) => {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="card border-secondary-200 bg-secondary-50">
        <div className="flex items-start space-x-3">
          <span className="text-2xl">✅</span>
          <div>
            <h4 className="font-semibold text-secondary-900 mb-1">All Clear</h4>
            <p className="text-sm text-secondary-800">
              No active hazard alerts for this destination. Safe to travel!
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high':
      case 'critical':
        return 'danger';
      case 'medium':
      case 'moderate':
        return 'accent';
      case 'low':
        return 'primary';
      default:
        return 'gray';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high':
      case 'critical':
        return '🚨';
      case 'medium':
      case 'moderate':
        return '⚠️';
      case 'low':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  const getDaysRemaining = (validUntil) => {
    if (!validUntil) return null;
    const until = new Date(validUntil);
    const now = new Date();
    const days = Math.ceil((until - now) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  return (
    <div className="space-y-3">
      {alerts.map((alert, index) => {
        const color = getSeverityColor(alert.severity);
        const days = getDaysRemaining(alert.validUntil);

        return (
          <div
            key={index}
            className={`card border-${color}-300 bg-${color}-50`}
          >
            <div className="flex items-start space-x-3">
              <span className="text-2xl flex-shrink-0">
                {getSeverityIcon(alert.severity)}
              </span>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`font-semibold text-${color}-900`}>
                        {alert.title}
                      </h4>
                      <span className={`text-xs px-2 py-0.5 rounded bg-${color}-200 text-${color}-800 uppercase font-medium`}>
                        {alert.severity}
                      </span>
                    </div>
                    <p className={`text-xs text-${color}-700 mb-1`}>
                      {alert.type}
                    </p>
                  </div>
                  {days !== null && days >= 0 && (
                    <span className={`text-xs text-${color}-700 flex-shrink-0`}>
                      {days === 0 ? 'Expires today' : `${days} days left`}
                    </span>
                  )}
                </div>

                <p className={`text-sm text-${color}-800 mb-2`}>
                  {alert.message}
                </p>

                {alert.affectedAreas && alert.affectedAreas.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-current/20">
                    <p className={`text-xs text-${color}-700 mb-1`}>
                      Affected Areas:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {alert.affectedAreas.map((area, i) => (
                        <span
                          key={i}
                          className={`text-xs px-2 py-0.5 rounded bg-${color}-100 text-${color}-800`}
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Mock Data Disclaimer */}
      <div className="card bg-gray-50 border-gray-300">
        <div className="flex items-start space-x-2">
          <span className="text-sm">⚠️</span>
          <p className="text-xs text-gray-600">
            <strong>Note:</strong> Hazard data is simulated for demonstration purposes.
            For real travel decisions, consult official government sources and local authorities.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HazardAlert;
