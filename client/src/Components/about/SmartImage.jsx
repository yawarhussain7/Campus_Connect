import { useState } from 'react';

/**
 * Photo that degrades to a soft gradient instead of a broken-image icon when the
 * remote image cannot be loaded, so no section ever looks broken offline.
 */
export default function SmartImage({
  src,
  alt = '',
  className = '',
  fallbackClassName = '',
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        aria-hidden="true"
        className={
          fallbackClassName ||
          `bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 ${className}`
        }
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}