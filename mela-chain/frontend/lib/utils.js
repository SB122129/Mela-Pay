/**
 * Format price in USD
 */
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

/**
 * Format DOT amount
 */
export const formatDOT = (amount) => {
  return `${parseFloat(amount).toFixed(4)} DOT`;
};

/**
 * Format date
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format date and time
 */
export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Get payment status color
 */
export const getPaymentStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    waiting: 'bg-blue-100 text-blue-800',
    confirming: 'bg-indigo-100 text-indigo-800',
    confirmed: 'bg-green-100 text-green-800',
    finished: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    expired: 'bg-gray-100 text-gray-800',
    refunded: 'bg-orange-100 text-orange-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

/**
 * Get payment status display text
 */
export const getPaymentStatusText = (status) => {
  const texts = {
    pending: 'Pending',
    waiting: 'Awaiting Payment',
    confirming: 'Confirming',
    confirmed: 'Confirmed',
    finished: 'Completed',
    failed: 'Failed',
    expired: 'Expired',
    refunded: 'Refunded',
  };
  return texts[status] || status;
};

/**
 * Get level badge color
 */
export const getLevelColor = (level) => {
  const colors = {
    Beginner: 'bg-green-100 text-green-800',
    Intermediate: 'bg-yellow-100 text-yellow-800',
    Advanced: 'bg-red-100 text-red-800',
    'All Levels': 'bg-blue-100 text-blue-800',
  };
  return colors[level] || 'bg-gray-100 text-gray-800';
};

/**
 * Truncate text
 */
export const truncate = (text, length = 100) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

/**
 * Copy to clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};

/**
 * Validate email
 */
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Generate QR code data URL
 */
export const generateQRCodeURL = (address) => {
  return `polkadot:${address}`;
};

/**
 * Calculate cart total
 */
export const calculateCartTotal = (items) => {
  return items.reduce((total, item) => {
    return {
      usd: total.usd + (item.price || 0),
      dot: total.dot + (item.priceInDOT || 0),
    };
  }, { usd: 0, dot: 0 });
};

/**
 * Debounce function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
