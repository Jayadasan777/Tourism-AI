const axios = require('axios');
const { AppError } = require('../utils/errorHandler');

/**
 * Get weather data for a destination using OpenWeatherMap API
 */
const getWeatherData = async (destination) => {
  try {
    if (!process.env.OPENWEATHER_API_KEY) {
      throw new Error('OPENWEATHER_API_KEY is not set');
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;

    // Step 1: Geocoding - Convert destination name to coordinates
    const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(destination)},IN&limit=1&appid=${apiKey}`;

    console.log(`🌍 Fetching coordinates for ${destination}...`);
    const geoResponse = await axios.get(geoUrl, { timeout: 5000 });

    if (!geoResponse.data || geoResponse.data.length === 0) {
      throw new AppError(`Location "${destination}" not found`, 404);
    }

    const { lat, lon, name, state } = geoResponse.data[0];
    console.log(`✅ Found: ${name}, ${state} (${lat}, ${lon})`);

    // Step 2: Get current weather data
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    console.log(`🌤️ Fetching weather data...`);
    const weatherResponse = await axios.get(weatherUrl, { timeout: 5000 });
    const data = weatherResponse.data;

    // Step 3: Get 5-day forecast
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    const forecastResponse = await axios.get(forecastUrl, { timeout: 5000 });
    const forecastData = forecastResponse.data;

    // Extract relevant forecast data (one per day)
    const dailyForecast = [];
    const processedDates = new Set();

    forecastData.list.forEach(item => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      if (!processedDates.has(date) && dailyForecast.length < 5) {
        processedDates.add(date);
        dailyForecast.push({
          date: new Date(item.dt * 1000).toLocaleDateString('en-IN', {
            weekday: 'short',
            day: 'numeric',
            month: 'short'
          }),
          temp: Math.round(item.main.temp),
          tempMin: Math.round(item.main.temp_min),
          tempMax: Math.round(item.main.temp_max),
          condition: item.weather[0].main,
          description: item.weather[0].description,
          icon: item.weather[0].icon,
          humidity: item.main.humidity,
          windSpeed: Math.round(item.wind.speed * 3.6) // Convert m/s to km/h
        });
      }
    });

    // Check for severe weather alerts
    const severeConditions = ['Thunderstorm', 'Snow', 'Extreme', 'Squall', 'Tornado'];
    const hasSevereWeather = severeConditions.includes(data.weather[0].main);

    const weatherInfo = {
      location: {
        name,
        state: state || 'India',
        coordinates: { lat, lon }
      },
      current: {
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        tempMin: Math.round(data.main.temp_min),
        tempMax: Math.round(data.main.temp_max),
        condition: data.weather[0].main,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        visibility: data.visibility / 1000, // Convert to km
        windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
        windDirection: data.wind.deg,
        clouds: data.main.clouds,
        sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit'
        })
      },
      forecast: dailyForecast,
      alerts: {
        hasSevereWeather,
        message: hasSevereWeather
          ? `⚠️ Severe weather alert: ${data.weather[0].main}. Plan accordingly.`
          : null
      },
      fetchedAt: new Date().toISOString()
    };

    console.log(`✅ Weather data retrieved: ${weatherInfo.current.temperature}°C, ${weatherInfo.current.condition}`);
    return weatherInfo;

  } catch (error) {
    console.error('Weather API Error:', error.message);

    // If it's a network/API error, return mock data for demo
    if (error.code === 'ECONNABORTED' || error.response?.status >= 500) {
      console.warn('⚠️ Using mock weather data due to API timeout');
      return getMockWeatherData(destination);
    }

    throw new AppError(
      error.message || 'Failed to fetch weather data',
      error.response?.status || 500
    );
  }
};

/**
 * Mock weather data for demo/testing
 */
const getMockWeatherData = (destination) => {
  return {
    location: {
      name: destination,
      state: 'India',
      coordinates: { lat: 0, lon: 0 }
    },
    current: {
      temperature: 28,
      feelsLike: 30,
      tempMin: 24,
      tempMax: 32,
      condition: 'Clear',
      description: 'clear sky',
      icon: '01d',
      humidity: 65,
      pressure: 1013,
      visibility: 10,
      windSpeed: 15,
      windDirection: 180,
      clouds: 10,
      sunrise: '06:00 AM',
      sunset: '06:30 PM'
    },
    forecast: [
      {
        date: 'Today',
        temp: 28,
        tempMin: 24,
        tempMax: 32,
        condition: 'Clear',
        description: 'clear sky',
        icon: '01d',
        humidity: 65,
        windSpeed: 15
      }
    ],
    alerts: {
      hasSevereWeather: false,
      message: null
    },
    fetchedAt: new Date().toISOString(),
    isMockData: true
  };
};

module.exports = {
  getWeatherData
};
