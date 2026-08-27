/**
 * SafetyScore Component
 * Displays a color-coded safety score (0-100) for the destination
 */
const SafetyScore = ({ score, weatherCondition, hazardCount }) => {
  if (score === null || score === undefined) {
    return null;
  }

  // Ensure score is between 0-100
  const normalizedScore = Math.max(0, Math.min(100, score));

  // Get color and label based on score
  const getScoreInfo = (score) => {
    if (score >= 80) {
      return {
        color: 'green',
        bgGradient: 'from-green-400 to-green-500',
        textColor: 'text-green-800',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-300',
        label: 'Safe',
        icon: '✅',
        message: 'Conditions are favorable for travel'
      };
    } else if (score >= 60) {
      return {
        color: 'yellow',
        bgGradient: 'from-yellow-400 to-yellow-500',
        textColor: 'text-yellow-800',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-300',
        label: 'Moderate',
        icon: '⚠️',
        message: 'Travel with normal precautions'
      };
    } else if (score >= 40) {
      return {
        color: 'orange',
        bgGradient: 'from-orange-400 to-orange-500',
        textColor: 'text-orange-800',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-300',
        label: 'Caution',
        icon: '⚡',
        message: 'Exercise increased caution'
      };
    } else {
      return {
        color: 'red',
        bgGradient: 'from-red-400 to-red-500',
        textColor: 'text-red-800',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-300',
        label: 'High Risk',
        icon: '🚨',
        message: 'Consider postponing travel'
      };
    }
  };

  const scoreInfo = getScoreInfo(normalizedScore);

  return (
    <div className={`card ${scoreInfo.bgColor} border-2 ${scoreInfo.borderColor}`}>
      <div className="flex items-center gap-4">
        {/* Score Circle */}
        <div className="relative flex-shrink-0">
          <svg className="w-24 h-24 transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200"
            />
            {/* Progress circle */}
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - normalizedScore / 100)}`}
              className={`bg-gradient-to-r ${scoreInfo.bgGradient}`}
              strokeLinecap="round"
              style={{
                stroke: scoreInfo.color === 'green' ? '#22c55e' :
                       scoreInfo.color === 'yellow' ? '#eab308' :
                       scoreInfo.color === 'orange' ? '#f97316' : '#ef4444'
              }}
            />
          </svg>
          {/* Score Number */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className={`text-2xl font-bold ${scoreInfo.textColor}`}>
                {normalizedScore}
              </div>
              <div className="text-xs text-gray-600">/ 100</div>
            </div>
          </div>
        </div>

        {/* Score Details */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-3xl">{scoreInfo.icon}</span>
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                {scoreInfo.label}
              </h3>
              <p className={`text-sm font-medium ${scoreInfo.textColor}`}>
                Safety Score
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-700 mb-3">
            {scoreInfo.message}
          </p>

          {/* Score Factors */}
          <div className="space-y-1 text-xs text-gray-600">
            {weatherCondition && (
              <div className="flex items-center gap-2">
                <span>🌤️</span>
                <span>Weather: <span className="font-medium">{weatherCondition}</span></span>
              </div>
            )}
            {hazardCount !== undefined && (
              <div className="flex items-center gap-2">
                <span>⚠️</span>
                <span>
                  Active Alerts: <span className="font-medium">
                    {hazardCount === 0 ? 'None' : hazardCount}
                  </span>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Calculation Info */}
      <div className="mt-4 pt-4 border-t border-gray-300">
        <details className="text-xs text-gray-600">
          <summary className="cursor-pointer hover:text-gray-800 font-medium">
            How is this calculated?
          </summary>
          <div className="mt-2 space-y-1 pl-4">
            <p>• Weather conditions severity (40% weight)</p>
            <p>• Active hazard alerts count (40% weight)</p>
            <p>• Historical safety patterns (20% weight)</p>
            <p className="mt-2 italic">Score is updated in real-time based on latest data</p>
          </div>
        </details>
      </div>
    </div>
  );
};

export default SafetyScore;
