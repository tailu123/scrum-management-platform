export const handleAxiosError = (error) => {
  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const data = error.response.data;

    switch (status) {
      case 400:
        return {
          type: 'VALIDATION_ERROR',
          message: data.message || 'Invalid request',
          errors: data.errors,
        };
      case 401:
        return {
          type: 'AUTH_ERROR',
          message: 'Authentication required. Please log in.',
        };
      case 403:
        return {
          type: 'PERMISSION_ERROR',
          message: 'You do not have permission to perform this action.',
        };
      case 404:
        return {
          type: 'NOT_FOUND',
          message: data.message || 'Resource not found',
        };
      case 429:
        return {
          type: 'RATE_LIMIT',
          message: 'Too many requests. Please try again later.',
        };
      case 500:
        return {
          type: 'SERVER_ERROR',
          message: 'Internal server error. Please try again later.',
        };
      default:
        return {
          type: 'UNKNOWN_ERROR',
          message: 'An unexpected error occurred.',
        };
    }
  } else if (error.request) {
    // Request made but no response received
    return {
      type: 'NETWORK_ERROR',
      message: 'Unable to connect to the server. Please check your internet connection.',
    };
  } else {
    // Error in request setup
    return {
      type: 'REQUEST_ERROR',
      message: error.message || 'Error setting up the request.',
    };
  }
};

export const logError = (error, context = {}) => {
  // TODO: Implement error logging service (e.g., Sentry)
  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
  });
};

export const displayErrorMessage = (error) => {
  const processedError = handleAxiosError(error);
  
  switch (processedError.type) {
    case 'VALIDATION_ERROR':
      return {
        severity: 'warning',
        title: 'Validation Error',
        message: processedError.message,
        errors: processedError.errors,
      };
    case 'AUTH_ERROR':
      return {
        severity: 'error',
        title: 'Authentication Error',
        message: processedError.message,
        action: 'LOGIN',
      };
    case 'PERMISSION_ERROR':
      return {
        severity: 'error',
        title: 'Permission Denied',
        message: processedError.message,
      };
    case 'NETWORK_ERROR':
      return {
        severity: 'error',
        title: 'Network Error',
        message: processedError.message,
        action: 'RETRY',
      };
    default:
      return {
        severity: 'error',
        title: 'Error',
        message: processedError.message,
      };
  }
};

export const isNetworkError = (error) => {
  return !error.response && error.request;
};

export const isAuthError = (error) => {
  return error.response && error.response.status === 401;
};

export const shouldRetry = (error, retryCount = 0) => {
  const MAX_RETRIES = 3;
  
  if (retryCount >= MAX_RETRIES) return false;
  
  // Retry on network errors or 5xx server errors
  if (isNetworkError(error)) return true;
  if (error.response && error.response.status >= 500) return true;
  
  return false;
};
