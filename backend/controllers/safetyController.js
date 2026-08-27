const { getWeatherData } = require('../services/weatherService');
const { getHazardAlerts, getEmergencyContacts } = require('../services/hazardService');

/**
 * Get complete safety information for a destination
 */
const getSafetyInfo = async (req, res, next) => {
  try {
    const { destination } = req.query;

    if (!destination) {
      return res.status(400).json({
        success: false,
        error: 'Destination parameter is required'
      });
    }

    console.log(`🛡️ Fetching safety info for: ${destination}`);

    // Fetch weather and hazard data in parallel
    const [weatherData, hazardData] = await Promise.all([
      getWeatherData(destination),
      Promise.resolve(getHazardAlerts(destination))
    ]);

    const emergencyContacts = getEmergencyContacts(destination);

    // Calculate overall safety score (simple heuristic)
    let safetyScore = 100;
    if (weatherData.alerts?.hasSevereWeather) safetyScore -= 20;
    if (hazardData.hasAlerts) {
      const highSeverityAlerts = hazardData.alerts.filter(a => a.severity === 'high').length;
      safetyScore -= (highSeverityAlerts * 15 + (hazardData.alerts.length - highSeverityAlerts) * 10);
    }
    safetyScore = Math.max(0, safetyScore);

    const safetyLevel = safetyScore >= 80 ? 'safe' :
                        safetyScore >= 60 ? 'moderate' :
                        safetyScore >= 40 ? 'caution' : 'high-risk';

    res.status(200).json({
      success: true,
      data: {
        destination,
        safetyLevel,
        safetyScore,
        weather: weatherData,
        hazards: hazardData,
        emergency: emergencyContacts,
        fetchedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Get only weather information
 */
const getWeather = async (req, res, next) => {
  try {
    const { destination } = req.query;

    if (!destination) {
      return res.status(400).json({
        success: false,
        error: 'Destination parameter is required'
      });
    }

    const weatherData = await getWeatherData(destination);

    res.status(200).json({
      success: true,
      data: weatherData
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Get only hazard alerts
 */
const getHazards = async (req, res, next) => {
  try {
    const { destination } = req.query;

    if (!destination) {
      return res.status(400).json({
        success: false,
        error: 'Destination parameter is required'
      });
    }

    const hazardData = getHazardAlerts(destination);

    res.status(200).json({
      success: true,
      data: hazardData
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Get emergency contacts
 */
const getEmergency = async (req, res, next) => {
  try {
    const { destination } = req.query;

    if (!destination) {
      return res.status(400).json({
        success: false,
        error: 'Destination parameter is required'
      });
    }

    const emergencyData = getEmergencyContacts(destination);

    res.status(200).json({
      success: true,
      data: emergencyData
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSafetyInfo,
  getWeather,
  getHazards,
  getEmergency
};
