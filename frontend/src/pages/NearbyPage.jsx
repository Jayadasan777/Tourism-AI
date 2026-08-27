import { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const NearbyPage = () => {
  const [location, setLocation] = useState(null);
  const [budget, setBudget] = useState('');
  const [radius, setRadius] = useState(5); // km
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('distance');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [error, setError] = useState(null);
  const [gettingLocation, setGettingLocation] = useState(false);

  const getMyLocation = () => {
    setGettingLocation(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setGettingLocation(false);
        console.log('Location obtained:', position.coords);
      },
      (error) => {
        setError('Unable to get your location. Please enable location services.');
        setGettingLocation(false);
        console.error('Geolocation error:', error);
      }
    );
  };

  const searchNearby = async () => {
    if (!location) {
      setError('Please get your location first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = {
        latitude: location.latitude,
        longitude: location.longitude,
        radius: radius * 1000, // Convert km to meters
        category,
        sortBy
      };

      if (budget) {
        params.budget = parseInt(budget);
      }

      const response = await axios.get(`${API_URL}/recommendations/nearby`, { params });

      if (response.data.success) {
        setRecommendations(response.data);
      } else {
        setError(response.data.message || 'Failed to get recommendations');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err.response?.data?.error || 'Failed to fetch recommendations');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'restaurant': return '🍽️';
      case 'lodging': return '🏨';
      case 'attraction': return '🎯';
      default: return '📍';
    }
  };

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'restaurant': return 'bg-red-100 text-red-700';
      case 'lodging': return 'bg-purple-100 text-purple-700';
      case 'attraction': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎯 Nearby Recommendations
          </h1>
          <p className="text-gray-600">
            Find the best places near you based on your budget and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Search Panel */}
          <div className="lg:col-span-1">
            <div className="card sticky top-8">
              <h2 className="text-xl font-semibold mb-4">Search Settings</h2>

              {/* Get Location Button */}
              <div className="mb-4">
                <button
                  onClick={getMyLocation}
                  disabled={gettingLocation}
                  className={`w-full btn-primary ${gettingLocation ? 'opacity-50' : ''}`}
                >
                  {gettingLocation ? '📍 Getting Location...' : location ? '✅ Location Obtained' : '📍 Get My Location'}
                </button>
                {location && (
                  <p className="text-xs text-gray-500 mt-1 text-center">
                    {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                  </p>
                )}
              </div>

              {/* Budget */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget per person (optional)
                </label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g., 1000"
                  className="input w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to show all price ranges
                </p>
              </div>

              {/* Radius */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Radius: {radius} km
                </label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={radius}
                  onChange={(e) => setRadius(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 km</span>
                  <span>20 km</span>
                </div>
              </div>

              {/* Category */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input w-full"
                >
                  <option value="all">All Categories</option>
                  <option value="restaurant">🍽️ Restaurants</option>
                  <option value="lodging">🏨 Hotels</option>
                  <option value="tourist_attraction">🎯 Attractions</option>
                </select>
              </div>

              {/* Sort By */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input w-full"
                >
                  <option value="distance">📏 Distance (Nearest First)</option>
                  <option value="rating">⭐ Rating (Highest First)</option>
                  <option value="budget">💰 Price (Cheapest First)</option>
                </select>
              </div>

              {/* Search Button */}
              <button
                onClick={searchNearby}
                disabled={!location || loading}
                className="btn-primary w-full"
              >
                {loading ? '🔍 Searching...' : '🔍 Search Nearby'}
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            {error && (
              <div className="card border-danger-200 bg-danger-50 mb-4">
                <p className="text-danger-800">⚠️ {error}</p>
              </div>
            )}

            {!location && !error && (
              <div className="card text-center py-12">
                <span className="text-6xl mb-4 block">📍</span>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Get Started
                </h3>
                <p className="text-gray-600 mb-4">
                  Click "Get My Location" to find the best places near you
                </p>
              </div>
            )}

            {loading && (
              <div className="card text-center py-12">
                <div className="animate-spin text-6xl mb-4">🔍</div>
                <p className="text-gray-600">Searching for nearby places...</p>
              </div>
            )}

            {recommendations && recommendations.success && (
              <div className="space-y-4">
                {/* Summary */}
                <div className="card">
                  <h3 className="font-semibold text-lg mb-2">Search Results</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-primary-600">{recommendations.count}</p>
                      <p className="text-xs text-gray-600">Places Found</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-secondary-600">{recommendations.radius}</p>
                      <p className="text-xs text-gray-600">Search Radius</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">
                        {recommendations.budget !== 'No budget specified' ? `₹${recommendations.budget}` : 'Any'}
                      </p>
                      <p className="text-xs text-gray-600">Budget</p>
                    </div>
                  </div>
                </div>

                {/* Recommendations List */}
                {recommendations.recommendations.map((place) => (
                  <div key={place.placeId} className="card hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      {/* Rank Badge */}
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="font-bold text-primary-600">#{place.rank}</span>
                        </div>
                      </div>

                      {/* Place Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-2xl">{getCategoryIcon(place.category)}</span>
                              <h4 className="font-semibold text-gray-900">{place.name}</h4>
                            </div>
                            <p className="text-sm text-gray-600">{place.address}</p>
                          </div>

                          <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(place.category)}`}>
                            {place.category}
                          </span>
                        </div>

                        {/* Metrics */}
                        <div className="flex flex-wrap gap-3 mb-3 text-sm">
                          <div className="flex items-center gap-1">
                            <span>📏</span>
                            <span className="font-medium">{place.distanceText}</span>
                          </div>

                          {place.rating > 0 && (
                            <div className="flex items-center gap-1">
                              <span>⭐</span>
                              <span className="font-medium">{place.rating}</span>
                              <span className="text-gray-500">({place.ratingCount})</span>
                            </div>
                          )}

                          <div className="flex items-center gap-1">
                            <span>💰</span>
                            <span className="font-medium">{place.priceRange.label}</span>
                          </div>

                          {place.isOpen !== undefined && (
                            <div className="flex items-center gap-1">
                              <span className={place.isOpen ? 'text-green-600' : 'text-red-600'}>
                                {place.isOpen ? '🟢 Open' : '🔴 Closed'}
                              </span>
                            </div>
                          )}

                          {place.isBudgetFriendly && budget && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                              ✅ Within Budget
                            </span>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <a
                            href={place.directionsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary text-sm flex-1"
                          >
                            🧭 Navigate
                          </a>
                          <a
                            href={place.googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-secondary text-sm flex-1"
                          >
                            🗺️ View on Map
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {recommendations.recommendations.length === 0 && (
                  <div className="card text-center py-8">
                    <span className="text-4xl mb-2 block">😕</span>
                    <p className="text-gray-600">No places found matching your criteria</p>
                    <p className="text-sm text-gray-500 mt-1">Try increasing the search radius or budget</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NearbyPage;
