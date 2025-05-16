/**
 * Helper functions for HIV Treatment App
 */

/**
 * Format date to a readable string
 * @param {Date|string} date - Date object or date string
 * @param {string} format - Format string (default: 'DD/MM/YYYY')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = 'DD/MM/YYYY') => {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (!d || isNaN(d)) {
    return 'Invalid date';
  }
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  switch (format) {
    case 'DD/MM/YYYY':
      return `${day}/${month}/${year}`;
    case 'MM/DD/YYYY':
      return `${month}/${day}/${year}`;
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`;
    case 'DD/MM/YYYY HH:mm':
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    case 'relative':
      return getRelativeTime(d);
    default:
      return `${day}/${month}/${year}`;
  }
};

/**
 * Get relative time (e.g., "2 days ago")
 * @param {Date} date - Date object
 * @returns {string} Relative time string
 */
export const getRelativeTime = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears !== 1 ? 's' : ''} ago`;
};

/**
 * Truncate text to a specified length and append ellipsis
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length before truncation
 * @returns {string} Truncated text
 */
export const truncateText = (text, length = 100) => {
  if (!text) return '';
  if (text.length <= length) return text;
  
  return text.slice(0, length) + '...';
};

/**
 * Format a number as currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: 'VND')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'VND') => {
  if (typeof amount !== 'number') {
    return 'Invalid amount';
  }
  
  const formatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency,
    minimumFractionDigits: currency === 'VND' ? 0 : 2,
  });
  
  return formatter.format(amount);
};

/**
 * Generate a random ID
 * @param {number} length - Length of the ID (default: 10)
 * @returns {string} Random ID
 */
export const generateId = (length = 10) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
};

/**
 * Validate an email address
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email is valid, false otherwise
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate a phone number (Vietnamese format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if phone number is valid, false otherwise
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/;
  return phoneRegex.test(phone);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with score and feedback
 */
export const validatePassword = (password) => {
  if (!password) {
    return {
      score: 0,
      feedback: 'Password is required',
      isValid: false
    };
  }
  
  const lengthValid = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  let score = 0;
  if (lengthValid) score += 1;
  if (hasUppercase) score += 1;
  if (hasLowercase) score += 1;
  if (hasNumber) score += 1;
  if (hasSpecialChar) score += 1;
  
  let feedback = '';
  if (score < 3) {
    feedback = 'Password is weak';
  } else if (score < 5) {
    feedback = 'Password is moderate';
  } else {
    feedback = 'Password is strong';
  }
  
  return {
    score,
    feedback,
    isValid: score >= 3,
    details: {
      lengthValid,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialChar
    }
  };
};

/**
 * Calculate adherence rate for medication
 * @param {Array} medications - Array of medication objects with adherence data
 * @returns {number} Adherence rate as a percentage
 */
export const calculateAdherenceRate = (medications) => {
  if (!medications || !medications.length) {
    return 0;
  }
  
  let takenCount = 0;
  let totalCount = 0;
  
  medications.forEach(med => {
    if (med.doses && med.doses.length) {
      med.doses.forEach(dose => {
        totalCount++;
        if (dose.taken) {
          takenCount++;
        }
      });
    }
  });
  
  return totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 0;
};

/**
 * Calculate CD4 count trend
 * @param {Array} labResults - Array of lab result objects with CD4 data
 * @returns {Object} Trend analysis with direction and percentage
 */
export const analyzeCD4Trend = (labResults) => {
  if (!labResults || labResults.length < 2) {
    return {
      direction: 'neutral',
      percentage: 0,
      message: 'Insufficient data'
    };
  }
  
  // Sort by date, most recent first
  const sortedResults = [...labResults].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  const latestCD4 = sortedResults[0].cd4Count;
  const previousCD4 = sortedResults[1].cd4Count;
  
  if (latestCD4 > previousCD4) {
    const percentage = Math.round(((latestCD4 - previousCD4) / previousCD4) * 100);
    return {
      direction: 'increasing',
      percentage,
      message: `CD4 count increased by ${percentage}%`
    };
  } else if (latestCD4 < previousCD4) {
    const percentage = Math.round(((previousCD4 - latestCD4) / previousCD4) * 100);
    return {
      direction: 'decreasing',
      percentage,
      message: `CD4 count decreased by ${percentage}%`
    };
  } else {
    return {
      direction: 'stable',
      percentage: 0,
      message: 'CD4 count is stable'
    };
  }
};

/**
 * Group appointments by month
 * @param {Array} appointments - Array of appointment objects
 * @returns {Object} Appointments grouped by month
 */
export const groupAppointmentsByMonth = (appointments) => {
  if (!appointments || !appointments.length) {
    return {};
  }
  
  const grouped = {};
  
  appointments.forEach(appointment => {
    const date = new Date(appointment.date);
    const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;
    
    if (!grouped[monthYear]) {
      grouped[monthYear] = [];
    }
    
    grouped[monthYear].push(appointment);
  });
  
  return grouped;
};

/**
 * Filter resources by category and search term
 * @param {Array} resources - Array of resource objects
 * @param {string} category - Category to filter by
 * @param {string} searchTerm - Search term to filter by
 * @returns {Array} Filtered resources
 */
export const filterResources = (resources, category, searchTerm = '') => {
  if (!resources || !resources.length) {
    return [];
  }
  
  return resources.filter(resource => {
    const matchesCategory = category === 'all' || resource.category === category;
    const matchesSearch = searchTerm === '' || 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });
};

/**
 * Get next scheduled appointment
 * @param {Array} appointments - Array of appointment objects
 * @returns {Object|null} Next scheduled appointment or null if none found
 */
export const getNextAppointment = (appointments) => {
  if (!appointments || !appointments.length) {
    return null;
  }
  
  const now = new Date();
  const futureAppointments = appointments.filter(app => new Date(app.date) > now);
  
  if (futureAppointments.length === 0) {
    return null;
  }
  
  return futureAppointments.sort((a, b) => new Date(a.date) - new Date(b.date))[0];
};

/**
 * Calculate days until the next appointment
 * @param {Object} appointment - Appointment object
 * @returns {number} Number of days until the appointment
 */
export const getDaysUntilAppointment = (appointment) => {
  if (!appointment) {
    return null;
  }
  
  const now = new Date();
  const appointmentDate = new Date(appointment.date);
  const diffTime = Math.abs(appointmentDate - now);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

/**
 * Sort medications by next dose time
 * @param {Array} medications - Array of medication objects
 * @returns {Array} Sorted medications
 */
export const sortMedicationsByNextDose = (medications) => {
  if (!medications || !medications.length) {
    return [];
  }
  
  return [...medications].sort((a, b) => {
    const aNextDose = getNextDoseTime(a);
    const bNextDose = getNextDoseTime(b);
    
    if (!aNextDose) return 1;
    if (!bNextDose) return -1;
    
    return aNextDose - bNextDose;
  });
};

/**
 * Get the next dose time for a medication
 * @param {Object} medication - Medication object
 * @returns {Date|null} Next dose time or null if not found
 */
export const getNextDoseTime = (medication) => {
  if (!medication || !medication.schedule || !medication.schedule.length) {
    return null;
  }
  
  const now = new Date();
  const todayScheduled = medication.schedule.map(time => {
    const [hours, minutes] = time.split(':');
    const doseTime = new Date();
    doseTime.setHours(parseInt(hours, 10));
    doseTime.setMinutes(parseInt(minutes, 10));
    doseTime.setSeconds(0);
    return doseTime;
  });
  
  const futureDoses = todayScheduled.filter(time => time > now);
  
  if (futureDoses.length > 0) {
    return futureDoses.sort((a, b) => a - b)[0];
  }
  
  // If no doses left today, get the first dose for tomorrow
  const tomorrowFirstDose = new Date(todayScheduled[0]);
  tomorrowFirstDose.setDate(tomorrowFirstDose.getDate() + 1);
  return tomorrowFirstDose;
};

/**
 * Calculate viral load trend
 * @param {Array} labResults - Array of lab result objects with viral load data
 * @returns {Object} Trend analysis with direction and status
 */
export const analyzeViralLoadTrend = (labResults) => {
  if (!labResults || labResults.length < 2) {
    return {
      direction: 'neutral',
      status: 'unknown',
      message: 'Insufficient data'
    };
  }
  
  // Sort by date, most recent first
  const sortedResults = [...labResults].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  const latestVL = sortedResults[0].viralLoad;
  const previousVL = sortedResults[1].viralLoad;
  
  let status = 'unknown';
  if (latestVL < 200) {
    status = 'suppressed';
  } else if (latestVL < 1000) {
    status = 'partially suppressed';
  } else {
    status = 'unsuppressed';
  }
  
  if (latestVL < previousVL) {
    const percentage = previousVL !== 0 ? Math.round(((previousVL - latestVL) / previousVL) * 100) : 100;
    return {
      direction: 'decreasing',
      status,
      percentage,
      message: `Viral load decreased by ${percentage}%`
    };
  } else if (latestVL > previousVL) {
    const percentage = previousVL !== 0 ? Math.round(((latestVL - previousVL) / previousVL) * 100) : 100;
    return {
      direction: 'increasing',
      status,
      percentage,
      message: `Viral load increased by ${percentage}%`
    };
  } else {
    return {
      direction: 'stable',
      status,
      percentage: 0,
      message: 'Viral load is stable'
    };
  }
};

/**
 * Format file size
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Check if a date is in the past
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if the date is in the past
 */
export const isDateInPast = (date) => {
  const checkDate = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return checkDate < today;
};

/**
 * Get the full name from user profile
 * @param {Object} user - User object
 * @returns {string} Full name
 */
export const getFullName = (user) => {
  if (!user) return '';
  
  const { firstName, lastName, middleName } = user;
  
  if (firstName && lastName) {
    return middleName 
      ? `${lastName} ${middleName} ${firstName}` 
      : `${lastName} ${firstName}`;
  }
    return user.displayName || 'User';
};

/**
 * Get time of day category (morning, afternoon, evening, night) based on time string
 * @param {string} timeString - Time string in format "HH:MM"
 * @returns {string} Time of day category
 */
export const getTimeOfDay = (timeString) => {
  const hour = parseInt(timeString.split(':')[0], 10);
  
  if (hour >= 5 && hour < 12) {
    return 'morning';
  } else if (hour >= 12 && hour < 17) {
    return 'afternoon';
  } else if (hour >= 17 && hour < 21) {
    return 'evening';
  } else {
    return 'night';
  }
};

export default {
  formatDate,
  getRelativeTime,
  truncateText,
  formatCurrency,
  generateId,
  isValidEmail,
  isValidPhone,
  validatePassword,
  calculateAdherenceRate,
  analyzeCD4Trend,
  groupAppointmentsByMonth,
  filterResources,
  getNextAppointment,
  getDaysUntilAppointment,
  sortMedicationsByNextDose,
  getNextDoseTime,
  analyzeViralLoadTrend,
  formatFileSize,
  isDateInPast,
  getFullName,
  getTimeOfDay
};