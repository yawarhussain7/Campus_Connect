// src/utils/format.js
// Small display formatters shared by the list pages.

/** "2.4 MB" — uploaded files report their size in bytes. */
export const formatFileSize = (bytes) => {
  const value = Number(bytes);

  if (!value || Number.isNaN(value)) return '—';

  const units = ['B', 'KB', 'MB', 'GB'];
  const exponent = Math.min(
    Math.floor(Math.log(value) / Math.log(1024)),
    units.length - 1
  );
  const size = value / 1024 ** exponent;

  return `${size >= 10 || exponent === 0 ? Math.round(size) : size.toFixed(1)} ${
    units[exponent]
  }`;
};
