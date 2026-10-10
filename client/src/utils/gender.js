/** The two genders the sign-up form and Settings can collect. */
export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

/**
 * Default portrait for a student who has not uploaded an avatar yet.
 * The PNGs live in `client/public`, so they are served from the site root.
 *
 * Returns '' for an unknown gender so callers can keep their own fallback
 * (the stock photo in the Header, initials in the Sidebar, …).
 */
export const genderIconUrl = (gender) => {
  if (gender === 'male') return '/male_icon.png';
  if (gender === 'female') return '/female_icon.png';
  return '';
};

/** Human-readable label for a stored gender value. */
export const genderLabel = (gender) =>
  GENDER_OPTIONS.find((option) => option.value === gender)?.label || '';
