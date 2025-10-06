import { CONFIG } from './config.js';

/**
 * Get a DOM element by its ID.
 * @param {string} id The ID of the element.
 * @returns {HTMLElement|null} The DOM element or null if not found.
 */
export const getElement = (id) => document.getElementById(id);

/**
 * Format a number to a fixed number of decimal places.
 * @param {number} num The number to format.
 * @param {number} decimals The number of decimal places.
 * @returns {string} The formatted number.
 */
export const formatNumber = (num, decimals = 1) => {
  if (typeof num !== 'number') return num;
  return num.toFixed(decimals);
};

/**
 * Format a number as currency.
 * @param {number} num The number to format.
 * @returns {string} The formatted currency string.
 */
export const formatCurrency = (num) => {
  return new Intl.NumberFormat(CONFIG.LOCALE, {
    style: 'currency',
    currency: CONFIG.CURRENCY,
    minimumFractionDigits: 0
  }).format(num);
};

/**
 * Format a date and time.
 * @param {Date} date The date object to format.
 * @param {object} options Intl.DateTimeFormat options.
 * @returns {string} The formatted date/time string.
 */
export const formatDateTime = (date = new Date(), options = {}) => {
  const defaultOptions = {
    timeZone: CONFIG.TIMEZONE,
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Intl.DateTimeFormat(CONFIG.LOCALE, { ...defaultOptions, ...options }).format(date);
};

/**
 * Sanitize a string to prevent XSS by converting it to text content.
 * @param {string} str The string to sanitize.
 * @returns {string} The sanitized string.
 */
export const sanitizeHTML = (str) => {
  const temp = document.createElement('div');
  temp.textContent = str;
  return temp.innerHTML;
};

/**
 * Validate a value against a set of rules.
 * @param {*} value The value to validate.
 * @param {object} rules The validation rules (e.g., { min, max }).
 * @returns {{valid: boolean, error: string|null}} The validation result.
 */
export const validate = (value, rules) => {
  const numValue = parseFloat(value);
  if (isNaN(numValue)) {
    return { valid: false, error: 'Value must be a number.' };
  }
  if (rules.min !== undefined && numValue < rules.min) {
    return { valid: false, error: `Value must be at least ${rules.min}.` };
  }
  if (rules.max !== undefined && numValue > rules.max) {
    return { valid: false, error: `Value must be no more than ${rules.max}.` };
  }
  return { valid: true, error: null };
};

/**
 * Display a toast notification.
 * @param {string} message The message to display.
 * @param {string} type The type of toast ('success', 'error').
 * @param {number} duration The duration in milliseconds.
 */
export const showToast = (message, type = 'success', duration = 3000) => {
  const container = getElement('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.textContent = message;

  container.appendChild(toast);

  // Animate in
  setTimeout(() => toast.classList.add('show'), 10);

  // Remove after duration
  setTimeout(() => {
    toast.classList.remove('show');
    toast.addEventListener('transitionend', () => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    });
  }, duration);
};

/**
 * Show a success notification.
 * @param {string} message The success message.
 */
export const showSuccess = (message) => {
  showToast(message, 'success');
};

/**
 * Show an error notification.
 * @param {string} message The error message.
 */
export const showError = (message) => {
  showToast(message, 'error');
};

/**
 * Clamp a number between a minimum and maximum value.
 * @param {number} value The number to clamp.
 * @param {number} min The minimum value.
 * @param {number} max The maximum value.
 * @returns {number} The clamped number.
 */
export const clamp = (value, min, max) => {
  return Math.max(min, Math.min(max, value));
};