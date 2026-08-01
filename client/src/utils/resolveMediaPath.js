export const resolveMediaPath = (value, apiBaseUrl = '') => {
  if (!value) return '';

  if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:') || value.startsWith('blob:')) {
    return value;
  }

  if (value.startsWith('/uploads/')) {
    return apiBaseUrl ? `${apiBaseUrl}${value}` : value;
  }

  if (value.startsWith('/')) {
    return value.slice(1);
  }

  return value;
};
