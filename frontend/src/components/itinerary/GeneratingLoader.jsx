const GeneratingLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Animated Loader */}
      <div className="relative w-24 h-24 mb-6">
        {/* Outer ring */}
        <div className="absolute inset-0 border-4 border-primary-200 rounded-full"></div>

        {/* Spinning ring */}
        <div className="absolute inset-0 border-4 border-transparent border-t-primary-500 rounded-full animate-spin"></div>

        {/* Inner circle */}
        <div className="absolute inset-2 bg-primary-50 rounded-full flex items-center justify-center">
          <svg
            className="w-10 h-10 text-primary-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
        </div>
      </div>

      {/* Loading Text */}
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        Planning Your Perfect Trip...
      </h3>

      <p className="text-gray-600 text-center max-w-md mb-4">
        Our AI is analyzing your preferences and creating a personalized itinerary
      </p>

      {/* Loading Steps */}
      <div className="space-y-2 w-full max-w-sm">
        <LoadingStep delay={0}>Analyzing destination</LoadingStep>
        <LoadingStep delay={500}>Calculating budget</LoadingStep>
        <LoadingStep delay={1000}>Finding activities</LoadingStep>
        <LoadingStep delay={1500}>Optimizing schedule</LoadingStep>
      </div>

      {/* Estimated Time */}
      <p className="mt-6 text-sm text-gray-500">
        This usually takes 3-7 seconds
      </p>
    </div>
  );
};

const LoadingStep = ({ children, delay }) => {
  return (
    <div
      className="flex items-center space-x-2 opacity-0 animate-fade-in"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
      <span className="text-sm text-gray-600">{children}</span>
    </div>
  );
};

export default GeneratingLoader;
