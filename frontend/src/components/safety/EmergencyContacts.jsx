import { useState } from 'react';

/**
 * EmergencyContacts Component
 * Displays national and regional emergency contact numbers
 */
const EmergencyContacts = ({ destination }) => {
  const [copiedNumber, setCopiedNumber] = useState(null);

  // National emergency numbers (always displayed)
  const nationalContacts = [
    { name: 'National Emergency', number: '112', icon: '🚨', description: 'All emergencies' },
    { name: 'Tourist Helpline', number: '1363', icon: '🧳', description: '24/7 tourist assistance' },
    { name: 'Police', number: '100', icon: '👮', description: 'Law enforcement' },
    { name: 'Ambulance', number: '102', icon: '🚑', description: 'Medical emergency' },
    { name: 'Fire', number: '101', icon: '🚒', description: 'Fire emergency' },
    { name: 'Disaster Management', number: '108', icon: '⚡', description: 'Natural disasters' },
  ];

  // Regional contacts (example - can be fetched from API based on destination)
  const regionalContacts = {
    'Ladakh': [
      { name: 'Ladakh Tourism', number: '+91-1982-252297', icon: '🏔️' },
      { name: 'Border Roads Org', number: '+91-1982-252108', icon: '🛣️' },
    ],
    'Kerala': [
      { name: 'Kerala Tourism', number: '+91-471-2321132', icon: '🌴' },
      { name: 'Kottayam Police', number: '+91-481-2560533', icon: '👮' },
    ],
    'Rishikesh': [
      { name: 'Uttarakhand Tourism', number: '+91-135-2746817', icon: '🏔️' },
      { name: 'Rishikesh Police', number: '+91-135-2430393', icon: '👮' },
    ],
  };

  const handleCopy = async (number) => {
    try {
      await navigator.clipboard.writeText(number);
      setCopiedNumber(number);
      setTimeout(() => setCopiedNumber(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleCall = (number) => {
    window.location.href = `tel:${number}`;
  };

  const ContactCard = ({ contact, isRegional = false }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <span className="text-2xl">{contact.icon}</span>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-800 text-sm">
              {contact.name}
            </h4>
            {contact.description && (
              <p className="text-xs text-gray-600 mt-1">{contact.description}</p>
            )}
            <div className="font-mono text-lg font-bold text-primary-600 mt-2">
              {contact.number}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => handleCall(contact.number)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
            title={`Call ${contact.number}`}
          >
            <span>📞</span>
            <span className="hidden sm:inline">Call</span>
          </button>
          <button
            onClick={() => handleCopy(contact.number)}
            className={`${
              copiedNumber === contact.number
                ? 'bg-green-500'
                : 'bg-gray-100 hover:bg-gray-200'
            } text-gray-700 px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-1`}
            title={`Copy ${contact.number}`}
          >
            <span>{copiedNumber === contact.number ? '✓' : '📋'}</span>
            <span className="hidden sm:inline">
              {copiedNumber === contact.number ? 'Copied' : 'Copy'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );

  const regionalNumbers = regionalContacts[destination] || [];

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">📞</span>
        <h3 className="text-lg font-semibold text-gray-800">
          Emergency Contacts
        </h3>
      </div>

      {/* Important Notice */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
        <p className="text-sm text-red-800 font-medium">
          🚨 In case of emergency, dial <span className="font-bold text-lg">112</span> (works even without network coverage)
        </p>
      </div>

      {/* National Emergency Numbers */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
          National Emergency Numbers
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {nationalContacts.map((contact, index) => (
            <ContactCard key={index} contact={contact} />
          ))}
        </div>
      </div>

      {/* Regional Emergency Numbers */}
      {regionalNumbers.length > 0 && (
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            Regional Contacts - {destination}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {regionalNumbers.map((contact, index) => (
              <ContactCard key={index} contact={contact} isRegional />
            ))}
          </div>
        </div>
      )}

      {/* Additional Resources */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Additional Resources</h4>
        <ul className="text-sm text-gray-600 space-y-2">
          <li className="flex items-start gap-2">
            <span>🌐</span>
            <span>National Disaster Management Authority: <a href="https://ndma.gov.in" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">ndma.gov.in</a></span>
          </li>
          <li className="flex items-start gap-2">
            <span>🌤️</span>
            <span>India Meteorological Department: <a href="https://mausam.imd.gov.in" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">mausam.imd.gov.in</a></span>
          </li>
          <li className="flex items-start gap-2">
            <span>🗺️</span>
            <span>Ministry of Tourism: <a href="https://tourism.gov.in" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">tourism.gov.in</a></span>
          </li>
        </ul>
      </div>

      {/* Copy Feedback */}
      {copiedNumber && (
        <div className="mt-4 bg-green-100 border border-green-300 rounded-lg p-2 text-center">
          <p className="text-sm text-green-800">
            ✓ Number copied to clipboard!
          </p>
        </div>
      )}
    </div>
  );
};

export default EmergencyContacts;
