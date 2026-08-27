import { useState } from 'react';

const INTEREST_OPTIONS = [
  { value: 'nature', label: 'Nature' },
  { value: 'history', label: 'History' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'food', label: 'Food' },
  { value: 'culture', label: 'Culture' },
  { value: 'relaxation', label: 'Relaxation' },
  { value: 'spiritual', label: 'Spiritual' },
  { value: 'wildlife', label: 'Wildlife' },
];

const ItineraryForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    destination: '',
    budget: '',
    duration: '',
    interests: [],
    startDate: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleInterestToggle = (interest) => {
    setFormData(prev => {
      const interests = prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest];

      return { ...prev, interests };
    });

    if (errors.interests) {
      setErrors(prev => ({ ...prev, interests: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Destination validation
    if (!formData.destination || formData.destination.trim().length < 2) {
      newErrors.destination = 'Destination must be at least 2 characters';
    } else if (formData.destination.length > 100) {
      newErrors.destination = 'Destination must be less than 100 characters';
    }

    // Budget validation
    const budget = Number(formData.budget);
    if (!formData.budget || isNaN(budget)) {
      newErrors.budget = 'Budget is required';
    } else if (budget < 1000) {
      newErrors.budget = 'Budget must be at least ₹1,000';
    } else if (budget > 10000000) {
      newErrors.budget = 'Budget cannot exceed ₹10,000,000';
    }

    // Duration validation
    const duration = Number(formData.duration);
    if (!formData.duration || isNaN(duration)) {
      newErrors.duration = 'Duration is required';
    } else if (duration < 1) {
      newErrors.duration = 'Duration must be at least 1 day';
    } else if (duration > 30) {
      newErrors.duration = 'Duration cannot exceed 30 days';
    }

    // Interests validation
    if (formData.interests.length === 0) {
      newErrors.interests = 'Please select at least one interest';
    } else if (formData.interests.length > 5) {
      newErrors.interests = 'Please select maximum 5 interests';
    }

    // Start date validation
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    } else {
      const selectedDate = new Date(formData.startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.startDate = 'Start date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit({
        destination: formData.destination.trim(),
        budget: Number(formData.budget),
        duration: Number(formData.duration),
        interests: formData.interests,
        startDate: formData.startDate,
      });
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Destination */}
      <div>
        <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-2">
          Destination *
        </label>
        <input
          type="text"
          id="destination"
          name="destination"
          value={formData.destination}
          onChange={handleChange}
          placeholder="e.g., Rishikesh, Ladakh, Kerala"
          className={`input-field ${errors.destination ? 'border-danger-500 focus:ring-danger-500' : ''}`}
          disabled={loading}
        />
        {errors.destination && (
          <p className="mt-1 text-sm text-danger-600">{errors.destination}</p>
        )}
      </div>

      {/* Budget and Duration Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Budget */}
        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
            Budget (₹) *
          </label>
          <input
            type="number"
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            placeholder="25000"
            min="1000"
            max="10000000"
            className={`input-field ${errors.budget ? 'border-danger-500 focus:ring-danger-500' : ''}`}
            disabled={loading}
          />
          {errors.budget && (
            <p className="mt-1 text-sm text-danger-600">{errors.budget}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">₹1,000 - ₹10,000,000</p>
        </div>

        {/* Duration */}
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
            Duration (days) *
          </label>
          <input
            type="number"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="4"
            min="1"
            max="30"
            className={`input-field ${errors.duration ? 'border-danger-500 focus:ring-danger-500' : ''}`}
            disabled={loading}
          />
          {errors.duration && (
            <p className="mt-1 text-sm text-danger-600">{errors.duration}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">1 - 30 days</p>
        </div>
      </div>

      {/* Start Date */}
      <div>
        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
          Start Date *
        </label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          min={getTodayDate()}
          className={`input-field ${errors.startDate ? 'border-danger-500 focus:ring-danger-500' : ''}`}
          disabled={loading}
        />
        {errors.startDate && (
          <p className="mt-1 text-sm text-danger-600">{errors.startDate}</p>
        )}
      </div>

      {/* Interests */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Interests * <span className="text-gray-500 font-normal">(Select 1-5)</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {INTEREST_OPTIONS.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleInterestToggle(option.value)}
              disabled={loading || (formData.interests.length >= 5 && !formData.interests.includes(option.value))}
              className={`
                px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all
                ${formData.interests.includes(option.value)
                  ? 'bg-primary-500 text-white border-primary-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-primary-300'
                }
                ${loading || (formData.interests.length >= 5 && !formData.interests.includes(option.value))
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer'
                }
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
        {errors.interests && (
          <p className="mt-2 text-sm text-danger-600">{errors.interests}</p>
        )}
        {formData.interests.length > 0 && (
          <p className="mt-2 text-sm text-gray-600">
            Selected: {formData.interests.length}/5
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating Itinerary...
            </span>
          ) : (
            'Generate Itinerary'
          )}
        </button>
      </div>

      <p className="text-xs text-gray-500 text-center">
        * Required fields. Itinerary generation takes 3-7 seconds.
      </p>
    </form>
  );
};

export default ItineraryForm;
