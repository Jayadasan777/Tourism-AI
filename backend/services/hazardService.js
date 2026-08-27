const fs = require('fs');
const path = require('path');

/**
 * Get hazard alerts for a destination
 */
const getHazardAlerts = (destination) => {
  try {
    const hazardDataPath = path.join(__dirname, '../data/mock-hazards.json');
    const hazardData = JSON.parse(fs.readFileSync(hazardDataPath, 'utf-8'));

    // Normalize destination name for lookup
    const normalizedDestination = destination.toLowerCase().trim();

    // Try exact match first
    let locationData = hazardData[normalizedDestination];

    // If no exact match, try partial match
    if (!locationData) {
      const matchingKey = Object.keys(hazardData).find(key => {
        return key !== '_comment' &&
               key !== '_disclaimer' &&
               key !== '_lastUpdated' &&
               (normalizedDestination.includes(key) || key.includes(normalizedDestination));
      });

      if (matchingKey) {
        locationData = hazardData[matchingKey];
      }
    }

    if (!locationData) {
      return {
        destination,
        hasAlerts: false,
        alerts: [],
        generalRisks: {},
        message: 'No specific hazard alerts for this destination',
        disclaimer: hazardData._disclaimer
      };
    }

    // Filter active alerts (check validity dates)
    const now = new Date();
    const activeAlerts = locationData.alerts ? locationData.alerts.filter(alert => {
      const validFrom = new Date(alert.validFrom);
      const validUntil = new Date(alert.validUntil);
      return now >= validFrom && now <= validUntil;
    }) : [];

    return {
      destination,
      region: locationData.region,
      hasAlerts: activeAlerts.length > 0,
      alerts: activeAlerts.map(alert => ({
        ...alert,
        daysRemaining: Math.ceil((new Date(alert.validUntil) - now) / (1000 * 60 * 60 * 24))
      })),
      generalRisks: locationData.generalRisks || {},
      disclaimer: hazardData._disclaimer,
      fetchedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('Error reading hazard data:', error);
    return {
      destination,
      hasAlerts: false,
      alerts: [],
      generalRisks: {},
      error: 'Failed to fetch hazard data',
      disclaimer: '⚠️ This hazard data is simulated for demonstration purposes'
    };
  }
};

/**
 * Get emergency contacts for a destination/region
 */
const getEmergencyContacts = (destination) => {
  const nationalContacts = [
    {
      service: 'National Emergency',
      number: '112',
      description: 'All emergencies - Police, Fire, Ambulance'
    },
    {
      service: 'Tourist Helpline',
      number: '1363',
      description: '24x7 multi-lingual tourist assistance'
    },
    {
      service: 'Police',
      number: '100',
      description: 'Police emergency'
    },
    {
      service: 'Ambulance',
      number: '102',
      description: 'Medical emergency'
    },
    {
      service: 'Disaster Management',
      number: '108',
      description: 'Natural disaster response'
    }
  ];

  // Region-specific contacts (can be expanded)
  const regionalContacts = {
    ladakh: {
      service: 'Ladakh Police Control Room',
      number: '+91-1982-252018',
      description: 'Local police assistance'
    },
    kerala: {
      service: 'Kerala Tourism Police',
      number: '0484-2421222',
      description: 'Tourist-specific assistance'
    },
    goa: {
      service: 'Goa Tourism',
      number: '1364',
      description: 'Goa tourist helpline'
    },
    uttarakhand: {
      service: 'Uttarakhand Police',
      number: '0135-2711188',
      description: 'State police control room'
    }
  };

  const normalizedDest = destination.toLowerCase().trim();
  const regionalContact = regionalContacts[normalizedDest];

  return {
    destination,
    national: nationalContacts,
    regional: regionalContact ? [regionalContact] : [],
    note: 'In case of emergency, dial 112 for immediate assistance'
  };
};

module.exports = {
  getHazardAlerts,
  getEmergencyContacts
};
