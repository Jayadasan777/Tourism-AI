/**
 * HazardAlert Component
 * Displays hazard/disaster alerts with severity-based styling
 */
const HazardAlert = ({ alert }) => {
  if (!alert) {
    return null;
  }

  // Severity-based styling
  const getSeverityStyles = (severity) => {
    const styles = {
      high: {
        bg: 'bg-red-50',
        border: 'border-red-300',
        text: 'text-red-800',
        badge: 'bg-red-500',
        icon: '🚨'
      },
      medium: {
        bg: 'bg-yellow-50',
        border: 'border-yellow-300',
        text: 'text-yellow-800',
        badge: 'bg-yellow-500',
        icon: '⚠️'
      },
      low: {
        bg: 'bg-blue-50',
        border: 'border-blue-300',
        text: 'text-blue-800',
        badge: 'bg-blue-500',
        icon: 'ℹ️'
      }
    };
    return styles[severity] || styles.medium;
  };

  const style = getSeverityStyles(alert.severity);

  // Calculate days remaining
  const getDaysRemaining = () => {
    if (!alert.validUntil) return null;

    const now = new Date();
    const validUntil = new Date(alert.validUntil);
    const diffTime = validUntil - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Expired';
    if (diffDays === 0) return 'Expires today';
    if (diffDays === 1) return '1 day remaining';
    return `${diffDays} days remaining`;
  };

  return (
    <div className={`rounded-lg border-2 ${style.border} ${style.bg} p-4`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <span className="text-2xl">{style.icon}</span>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-bold uppercase px-2 py-1 rounded text-white ${style.badge}`}>
                {alert.severity}
              </span>
              <span className="text-sm text-gray-600">{alert.type}</span>
            </div>
            <h4 className={`font-semibold ${style.text} text-lg`}>
              {alert.title}
            </h4>
          </div>
        </div>
      </div>

      {/* Message */}
      <p className="text-gray-700 text-sm mb-3 pl-11">
        {alert.message}
      </p>

      {/* Affected Areas */}
      {alert.affectedAreas && alert.affectedAreas.length > 0 && (
        <div className="pl-11 mb-3">
          <div className="text-xs font-medium text-gray-600 mb-1">Affected Areas:</div>
          <div className="flex flex-wrap gap-2">
            {alert.affectedAreas.map((area, index) => (
              <span
                key={index}
                className="text-xs bg-white border border-gray-300 rounded-full px-3 py-1 text-gray-700"
              >
                📍 {area}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="pl-11 flex flex-wrap gap-4 text-xs text-gray-600">
        {alert.validFrom && (
          <div>
            <span className="font-medium">Valid from:</span>{' '}
            {new Date(alert.validFrom).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </div>
        )}
        {alert.validUntil && (
          <div>
            <span className="font-medium">Valid until:</span>{' '}
            {new Date(alert.validUntil).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
            <span className={`ml-2 font-semibold ${style.text}`}>
              ({getDaysRemaining()})
            </span>
          </div>
        )}
        {alert.season && (
          <div>
            <span className="font-medium">Season:</span>{' '}
            {alert.season}
          </div>
        )}
      </div>

      {/* Historical Pattern */}
      {alert.historicalPattern && (
        <div className="pl-11 mt-3 pt-3 border-t border-gray-300">
          <p className="text-xs text-gray-600 italic">
            📊 Historical pattern: {alert.historicalPattern}
          </p>
        </div>
      )}
    </div>
  );
};

/**
 * HazardAlertList Component
 * Container for multiple hazard alerts with disclaimer
 */
const HazardAlertList = ({ alerts, destination }) => {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="card bg-green-50 border border-green-200">
        <div className="flex items-center gap-3">
          <span className="text-2xl">✅</span>
          <div>
            <h4 className="font-semibold text-green-800">No Active Alerts</h4>
            <p className="text-sm text-green-700">
              No hazard alerts currently active for {destination}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Disclaimer Banner */}
      <div className="bg-amber-50 border border-amber-300 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <span className="text-lg">⚠️</span>
          <div className="flex-1">
            <p className="text-sm text-amber-800 font-medium">
              Simulated Data for Demonstration
            </p>
            <p className="text-xs text-amber-700 mt-1">
              Hazard alerts are based on historical patterns and should not be used for real travel decisions.
              Always consult official sources like IMD, NDMA, and local authorities.
            </p>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {alerts.map((alert) => (
        <HazardAlert key={alert.id} alert={alert} />
      ))}
    </div>
  );
};

export { HazardAlert, HazardAlertList };
export default HazardAlert;
