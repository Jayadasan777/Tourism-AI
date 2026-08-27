import { useState } from 'react';
import ItineraryForm from '../components/itinerary/ItineraryForm';
import GeneratingLoader from '../components/itinerary/GeneratingLoader';
import ItineraryDisplay from '../components/itinerary/ItineraryDisplay';
import { generateItinerary } from '../services/itineraryService';
import { useAuth } from '../context/AuthContext';

const PlanTripPage = () => {
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const [error, setError] = useState(null);
  const [lastRequestData, setLastRequestData] = useState(null);
  const [savedMessage, setSavedMessage] = useState(null);
  const { user } = useAuth();

  const handleGenerateItinerary = async (formData) => {
    setLoading(true);
    setError(null);
    setSavedMessage(null);
    setLastRequestData(formData);

    try {
      const response = await generateItinerary(formData);

      if (response.success) {
        setItinerary(response.data);
        // If user is authenticated, backend auto-saves; show confirmation
        if (user && response.data?.itineraryId) {
          setSavedMessage(`✅ Itinerary saved! ID: ${response.data.itineraryId}`);
        }
      } else {
        setError(response.error || 'Failed to generate itinerary');
      }
    } catch (err) {
      console.error('Error generating itinerary:', err);

      // api.js interceptor transforms errors to { status, message, errors } format
      if (err.isNetworkError) {
        setError('Cannot reach server. Please check your internet connection and that the backend is running on port 5000.');
      } else if (err.status === 400) {
        const errorMessages = err.errors?.length > 0 ? err.errors.join(', ') : err.message;
        setError(`Invalid input: ${errorMessages}`);
      } else if (err.status === 500) {
        setError('Server error. Please try again in a moment.');
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = () => {
    if (lastRequestData) {
      handleGenerateItinerary(lastRequestData);
    }
  };

  const handleSave = () => {
    if (!user) {
      setError('Please log in to save itineraries permanently.');
      return;
    }
    if (savedMessage) {
      alert(savedMessage);
    } else {
      alert('Your itinerary is automatically saved to your account when you are logged in.');
    }
  };

  const handleStartOver = () => {
    setItinerary(null);
    setError(null);
    setLastRequestData(null);
    setSavedMessage(null);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
            Plan Your Perfect Trip
          </h1>
          <p className="text-zinc-400">
            Tell us your preferences and our AI will create a personalized itinerary for you
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Column */}
          <div className="lg:col-span-1">
            <div className="card sticky top-8">
              <h2 className="text-xl font-semibold mb-4">Trip Details</h2>

              {!itinerary ? (
                <ItineraryForm onSubmit={handleGenerateItinerary} loading={loading} />
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-secondary-50 border border-secondary-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-2xl">✅</span>
                      <span className="font-semibold text-secondary-900">Itinerary Ready!</span>
                    </div>
                    <p className="text-sm text-secondary-800">
                      Your personalized trip plan is displayed on the right.
                    </p>
                  </div>

                  <button
                    onClick={handleStartOver}
                    className="btn-secondary w-full"
                  >
                    ← Create New Itinerary
                  </button>

                  {/* Trip Summary */}
                  <div className="pt-4 border-t border-gray-200 space-y-2">
                    <h3 className="font-semibold text-white mb-3">Trip Summary</h3>

                    <div className="text-sm">
                      <span className="text-zinc-400">Destination:</span>
                      <span className="ml-2 font-medium text-white">
                        {lastRequestData?.destination}
                      </span>
                    </div>

                    <div className="text-sm">
                      <span className="text-zinc-400">Budget:</span>
                      <span className="ml-2 font-medium text-white">
                        ₹{lastRequestData?.budget.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="text-sm">
                      <span className="text-zinc-400">Duration:</span>
                      <span className="ml-2 font-medium text-white">
                        {lastRequestData?.duration} days
                      </span>
                    </div>

                    <div className="text-sm">
                      <span className="text-zinc-400">Start Date:</span>
                      <span className="ml-2 font-medium text-white">
                        {lastRequestData?.startDate && new Date(lastRequestData.startDate).toLocaleDateString('en-IN')}
                      </span>
                    </div>

                    <div className="text-sm">
                      <span className="text-zinc-400">Interests:</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {lastRequestData?.interests.map(interest => (
                          <span
                            key={interest}
                            className="inline-block px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Result Column */}
          <div className="lg:col-span-2">
            {loading && (
              <div className="card">
                <GeneratingLoader />
              </div>
            )}

            {error && (
              <div className="card border-danger-200 bg-danger-50">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">⚠️</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-danger-900 mb-2">
                      Error Generating Itinerary
                    </h3>
                    <p className="text-sm text-danger-800 mb-4">
                      {error}
                    </p>
                    <button
                      onClick={handleRegenerate}
                      className="btn-primary text-sm"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            )}

            {itinerary && !loading && (
              <ItineraryDisplay
                itinerary={itinerary}
                onRegenerate={handleRegenerate}
                onSave={handleSave}
                loading={loading}
              />
            )}

            {!loading && !error && !itinerary && (
              <div className="card text-center py-12">
                <div className="max-w-md mx-auto">
                  <span className="text-6xl mb-4 block">🗺️</span>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Ready to Plan Your Trip?
                  </h3>
                  <p className="text-zinc-400 mb-6">
                    Fill in your trip details on the left and click "Generate Itinerary"
                    to get a personalized travel plan powered by AI.
                  </p>
                  <div className="space-y-2 text-left bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
                    <h4 className="font-semibold text-white mb-3">Features:</h4>
                    <div className="flex items-start space-x-2">
                      <span>✅</span>
                      <span className="text-sm text-zinc-400">AI-powered itinerary generation</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span>✅</span>
                      <span className="text-sm text-zinc-400">Budget-aware planning</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span>✅</span>
                      <span className="text-sm text-zinc-400">Personalized to your interests</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span>✅</span>
                      <span className="text-sm text-zinc-400">Day-wise activity breakdown</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanTripPage;
