const SafetyScore = ({ score, destination }) => {
  if (score === null || score === undefined) {
    return null;
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'secondary'; // Green
    if (score >= 60) return 'accent'; // Orange
    return 'danger'; // Red
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Safe';
    if (score >= 60) return 'Moderate';
    return 'Caution Advised';
  };

  const getScoreIcon = (score) => {
    if (score >= 80) return '✅';
    if (score >= 60) return '⚠️';
    return '🚨';
  };

  const color = getScoreColor(score);
  const label = getScoreLabel(score);
  const icon = getScoreIcon(score);

  return (
    <div className={`card bg-gradient-to-br from-${color}-50 to-${color}-100 border-${color}-200`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Safety Score
          </h3>
          <p className="text-sm text-gray-600">
            For {destination || 'this destination'}
          </p>
        </div>
        <span className="text-4xl">{icon}</span>
      </div>

      {/* Score Circle */}
      <div className="flex items-center justify-center mb-4">
        <div className="relative w-32 h-32">
          {/* Background circle */}
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200"
            />
            {/* Progress circle */}
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 56}`}
              strokeDashoffset={`${2 * Math.PI * 56 * (1 - score / 100)}`}
              className={`text-${color}-500`}
              strokeLinecap="round"
            />
          </svg>
          {/* Score text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{score}</div>
              <div className="text-xs text-gray-600">/ 100</div>
            </div>
          </div>
        </div>
      </div>

      {/* Label */}
      <div className="text-center">
        <div className={`inline-block px-4 py-2 rounded-full bg-${color}-200 text-${color}-900 font-semibold`}>
          {label}
        </div>
      </div>

      {/* Description */}
      <div className="mt-4 pt-4 border-t border-current/20">
        <p className={`text-sm text-${color}-900 text-center`}>
          {score >= 80 && "Conditions are favorable for travel. Exercise normal precautions."}
          {score >= 60 && score < 80 && "Some concerns present. Stay informed about local conditions."}
          {score < 60 && "Exercise increased caution. Check for travel advisories."}
        </p>
      </div>

      {/* Factors */}
      <div className="mt-3 pt-3 border-t border-current/20">
        <p className="text-xs text-gray-600 text-center">
          Based on weather conditions, active alerts, and seasonal factors
        </p>
      </div>
    </div>
  );
};

export default SafetyScore;
