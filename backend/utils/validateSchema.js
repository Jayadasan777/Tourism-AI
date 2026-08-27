const Joi = require('joi');

/**
 * Schema validator for itinerary generation request
 */
const itineraryRequestSchema = Joi.object({
  destination: Joi.string().min(2).max(100).required()
    .messages({
      'string.empty': 'Destination is required',
      'string.min': 'Destination must be at least 2 characters',
      'string.max': 'Destination cannot exceed 100 characters'
    }),

  budget: Joi.number().positive().min(1000).max(10000000).required()
    .messages({
      'number.base': 'Budget must be a number',
      'number.positive': 'Budget must be positive',
      'number.min': 'Budget must be at least ₹1,000',
      'number.max': 'Budget seems unrealistic'
    }),

  duration: Joi.number().integer().positive().min(1).max(30).required()
    .messages({
      'number.base': 'Duration must be a number',
      'number.integer': 'Duration must be whole days',
      'number.min': 'Duration must be at least 1 day',
      'number.max': 'Duration cannot exceed 30 days'
    }),

  interests: Joi.array()
    .items(Joi.string().valid('nature', 'history', 'adventure', 'food', 'culture', 'relaxation', 'spiritual', 'wildlife'))
    .min(1)
    .max(5)
    .required()
    .messages({
      'array.min': 'Select at least one interest',
      'array.max': 'Select maximum 5 interests',
      'any.only': 'Invalid interest type'
    }),

  startDate: Joi.date().iso().min('now').required()
    .messages({
      'date.base': 'Start date must be a valid date',
      'date.min': 'Start date cannot be in the past'
    }),

  userId: Joi.string().optional()
});

/**
 * Validate itinerary response from Gemini API
 */
const itineraryResponseSchema = Joi.object({
  days: Joi.array().items(
    Joi.object({
      dayNumber: Joi.number().integer().positive().required(),
      activities: Joi.array().items(
        Joi.object({
          time: Joi.string().required(),
          title: Joi.string().required(),
          description: Joi.string().required(),
          estimatedCost: Joi.number().min(0).required()
        })
      ).min(2).max(6).required()
    })
  ).min(1).required()
});

/**
 * Middleware to validate request body
 */
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => detail.message);
      return res.status(400).json({
        success: false,
        errors
      });
    }

    req.body = value;
    next();
  };
};

module.exports = {
  itineraryRequestSchema,
  itineraryResponseSchema,
  validateRequest
};
