import { useState } from 'react';
import ItineraryForm from '../components/itinerary/ItineraryForm';
import GeneratingLoader from '../components/itinerary/GeneratingLoader';
import ItineraryDisplay from '../components/itinerary/ItineraryDisplay';
import { generateItinerary } from '../services/itineraryService';

const PlanTripPage = () => {
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const [error, setError] = useState(null);
  const [lastRequestData, setLastRequestData] = useState(null);

  const handleGenerateItinerary = async (formData) => {
    setLoading(true);
    setError(null);
    setLastRequestData(formData);

    try {
      const response = await generateItinerary(formData);

      if (response.success) {
        setItinerary(response.data);
      } else {
        setError(response.error || 'Failed to generate itinerary');
      }
    } catch (err) {
      console.error('Error generating itinerary:', err);

      // Handle specific error cases
      if (err.response) {
        // Server responded with error
        if (err.response.status === 400) {
          setError(err.response.data.error || 'Invalid input. Please check your details.');
        } else if (err.response.status === 500) {
          setError('Server error. Please try again in a moment.');
        } else {
          setError('Something went wrong. Please try again.');
        }
      } else if (err.request) {
        // Request made but no response
        setError('Cannot reach server. Please check your internet connection.');
      } else {
        // Something else happened
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
    // TODO: Implement save functionality in Module 2 (requires auth)
    alert('Save functionality will be available after authentication is implemented.');
  };

  const handleStartOver = () => {
    setItinerary(null);
    setError(null);
    setLastRequestData(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Plan Your Perfect Trip
          </h1>
          <p className="text-gray-600">
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
                    <h3 className="font-semibold text-gray-900 mb-3">Trip Summary</h3>

                    <div className="text-sm">
                      <span className="text-gray-600">Destination:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {lastRequestData?.destination}
                      </span>
                    </div>

                    <div className="text-sm">
                      <span className="text-gray-600">Budget:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        ₹{lastRequestData?.budget.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="text-sm">
                      <span className="text-gray-600">Duration:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {lastRequestData?.duration} days
                      </span>
                    </div>

                    <div className="text-sm">
                      <span className="text-gray-600">Start Date:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {lastRequestData?.startDate && new Date(lastRequestData.startDate).toLocaleDateString('en-IN')}
                      </span>
                    </div>

                    <div className="text-sm">
                      <span className="text-gray-600">Interests:</span>
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
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Ready to Plan Your Trip?
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Fill in your trip details on the left and click "Generate Itinerary"
                    to get a personalized travel plan powered by AI.
                  </p>
                  <div className="space-y-2 text-left bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Features:</h4>
                    <div className="flex items-start space-x-2">
                      <span>✅</span>
                      <span className="text-sm text-gray-700">AI-powered itinerary generation</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span>✅</span>
                      <span className="text-sm text-gray-700">Budget-aware planning</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span>✅</span>
                      <span className="text-sm text-gray-700">Personalized to your interests</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span>✅</span>
                      <span className="text-sm text-gray-700">Day-wise activity breakdown</span>
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
