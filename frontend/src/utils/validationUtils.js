export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return re.test(password);
};

export const validateName = (name) => {
  return name && name.trim().length >= 2;
};

export const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validatePhoneNumber = (phone) => {
  const re = /^\+?[\d\s-]{10,}$/;
  return re.test(phone);
};

export const getPasswordStrength = (password) => {
  let strength = 0;
  
  if (password.length >= 8) strength++;
  if (password.match(/[a-z]+/)) strength++;
  if (password.match(/[A-Z]+/)) strength++;
  if (password.match(/[0-9]+/)) strength++;
  if (password.match(/[^a-zA-Z0-9]+/)) strength++;

  return {
    score: strength,
    label: ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'][strength - 1] || 'Very Weak',
  };
};

export const validateFormField = (value, validations) => {
  const errors = [];

  if (validations.required && !value) {
    errors.push('This field is required');
  }

  if (value) {
    if (validations.minLength && value.length < validations.minLength) {
      errors.push(`Minimum length is ${validations.minLength} characters`);
    }

    if (validations.maxLength && value.length > validations.maxLength) {
      errors.push(`Maximum length is ${validations.maxLength} characters`);
    }

    if (validations.email && !validateEmail(value)) {
      errors.push('Invalid email address');
    }

    if (validations.password && !validatePassword(value)) {
      errors.push('Password must contain at least 8 characters, including uppercase, lowercase, and numbers');
    }

    if (validations.url && !validateUrl(value)) {
      errors.push('Invalid URL');
    }

    if (validations.phone && !validatePhoneNumber(value)) {
      errors.push('Invalid phone number');
    }

    if (validations.match && value !== validations.match.value) {
      errors.push(validations.match.message || 'Values do not match');
    }
  }

  return errors;
};
