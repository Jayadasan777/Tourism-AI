import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons by category
const createCustomIcon = (category, dayNumber) => {
  const colors = {
    attraction: '#3B82F6',
    restaurant: '#EF4444',
    hotel: '#8B5CF6',
    activity: '#10B981',
    transport: '#F59E0B',
    default: '#6B7280'
  };

  const emoji = {
    attraction: '🎯',
    restaurant: '🍽️',
    hotel: '🏨',
    activity: '🎪',
    transport: '🚗',
    default: '📍'
  };

  const color = colors[category] || colors.default;
  const icon = emoji[category] || emoji.default;

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background: ${color};
        width: 36px;
        height: 36px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <span style="
          transform: rotate(45deg);
          font-size: 16px;
        ">${icon}</span>
      </div>
      <div style="
        position: absolute;
        top: -24px;
        left: 50%;
        transform: translateX(-50%);
        background: white;
        color: ${color};
        font-weight: bold;
        font-size: 10px;
        padding: 2px 6px;
        border-radius: 10px;
        border: 2px solid ${color};
        white-space: nowrap;
      ">Day ${dayNumber}</div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36]
  });
};

// Component to fit bounds when itinerary changes
const MapBoundsHandler = ({ coordinates }) => {
  const map = useMap();

  useEffect(() => {
    if (coordinates && coordinates.length > 0) {
      const bounds = L.latLngBounds(coordinates);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
    }
  }, [coordinates, map]);

  return null;
};

const InteractiveMap = ({ itinerary, height = '500px' }) => {
  const mapRef = useRef(null);

  if (!itinerary || !itinerary.days || itinerary.days.length === 0) {
    return (
      <div
        className="bg-gray-100 rounded-lg flex items-center justify-center"
        style={{ height }}
      >
        <div className="text-center text-gray-500">
          <span className="text-4xl block mb-2">🗺️</span>
          <p>Map will appear here once itinerary is generated</p>
        </div>
      </div>
    );
  }

  // Extract all places with coordinates
  const places = [];
  const routeCoordinates = [];

  itinerary.days.forEach((day) => {
    day.activities.forEach((activity) => {
      // For demo, we'll use mock coordinates based on activity index
      // In real implementation, get from Google Places API
      if (activity.placeName && activity.address) {
        // Generate realistic coordinates (would come from Places API)
        const baseLatLng = getBaseCoordinates(itinerary.metadata?.destination || 'India');
        const lat = baseLatLng.lat + (Math.random() - 0.5) * 0.1;
        const lng = baseLatLng.lng + (Math.random() - 0.5) * 0.1;

        places.push({
          ...activity,
          dayNumber: day.dayNumber,
          coordinates: [lat, lng]
        });

        routeCoordinates.push([lat, lng]);
      }
    });
  });

  // Default center (will be overridden by bounds)
  const center = places.length > 0 ? places[0].coordinates : [20.5937, 78.9629]; // India center

  return (
    <div className="relative rounded-lg overflow-hidden shadow-lg" style={{ height }}>
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        {/* OpenStreetMap tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Auto-fit bounds */}
        <MapBoundsHandler coordinates={routeCoordinates} />

        {/* Route polyline connecting places */}
        {routeCoordinates.length > 1 && (
          <Polyline
            positions={routeCoordinates}
            color="#3B82F6"
            weight={3}
            opacity={0.6}
            dashArray="10, 10"
          />
        )}

        {/* Markers for each place */}
        {places.map((place, index) => (
          <Marker
            key={index}
            position={place.coordinates}
            icon={createCustomIcon(place.category, place.dayNumber)}
          >
            <Popup maxWidth={300}>
              <div className="p-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">
                    {place.category === 'restaurant' && '🍽️'}
                    {place.category === 'hotel' && '🏨'}
                    {place.category === 'attraction' && '🎯'}
                    {place.category === 'activity' && '🎪'}
                    {!place.category && '📍'}
                  </span>
                  <div>
                    <h3 className="font-bold text-sm">{place.title}</h3>
                    <p className="text-xs text-gray-600">Day {place.dayNumber} • {place.time}</p>
                  </div>
                </div>

                {place.placeName && (
                  <p className="text-xs text-gray-700 mb-1">
                    <strong>📍 Place:</strong> {place.placeName}
                  </p>
                )}

                {place.address && (
                  <p className="text-xs text-gray-600 mb-2">
                    <strong>📮 Address:</strong> {place.address}
                  </p>
                )}

                <p className="text-xs text-gray-700 mb-2 line-clamp-2">
                  {place.description}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <span className="text-sm font-semibold text-green-600">
                    {place.estimatedCost === 0 ? 'Free' : `₹${place.estimatedCost.toLocaleString('en-IN')}`}
                  </span>

                  {place.googleMapsUrl && (
                    <a
                      href={place.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                      Navigate →
                    </a>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 text-xs z-[1000]">
        <h4 className="font-semibold mb-2">Legend</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Attractions</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Restaurants</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span>Hotels</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Activities</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-0.5 h-4 border-l-2 border-dashed border-blue-500"></div>
            <span>Route</span>
          </div>
        </div>
      </div>

      {/* Place counter */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg px-3 py-2 text-sm font-semibold z-[1000]">
        📍 {places.length} Places
      </div>
    </div>
  );
};

// Helper function to get base coordinates for destinations
const getBaseCoordinates = (destination) => {
  const destinations = {
    'chennai': { lat: 13.0827, lng: 80.2707 },
    'goa': { lat: 15.2993, lng: 74.1240 },
    'ladakh': { lat: 34.1526, lng: 77.5771 },
    'mumbai': { lat: 19.0760, lng: 72.8777 },
    'delhi': { lat: 28.6139, lng: 77.2090 },
    'bangalore': { lat: 12.9716, lng: 77.5946 },
    'kerala': { lat: 10.8505, lng: 76.2711 },
    'rishikesh': { lat: 30.0869, lng: 78.2676 },
    'jaipur': { lat: 26.9124, lng: 75.7873 },
    'varanasi': { lat: 25.3176, lng: 82.9739 }
  };

  const key = destination.toLowerCase();
  return destinations[key] || { lat: 20.5937, lng: 78.9629 }; // Default to India center
};

export default InteractiveMap;
