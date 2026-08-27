/**
 * Centralized error handling middleware
 */

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging (remove in production or use proper logging service)
  console.error('Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method
  });

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = new AppError(message, 400);
  }

  // Firebase auth error
  if (err.code && err.code.startsWith('auth/')) {
    error = new AppError(getFirebaseErrorMessage(err.code), 401);
  }

  // Gemini API error
  if (err.message && err.message.includes('API key')) {
    error = new AppError('AI service configuration error', 500);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

const getFirebaseErrorMessage = (code) => {
  const errorMessages = {
    'auth/user-not-found': 'User not found',
    'auth/wrong-password': 'Invalid credentials',
    'auth/email-already-in-use': 'Email already registered',
    'auth/weak-password': 'Password should be at least 6 characters',
    'auth/invalid-email': 'Invalid email address',
    'auth/operation-not-allowed': 'Operation not allowed',
    'auth/user-disabled': 'User account has been disabled'
  };
  return errorMessages[code] || 'Authentication error';
};

module.exports = { AppError, errorHandler };
