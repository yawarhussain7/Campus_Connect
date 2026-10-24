export const getUploadStatus = ({
  isEducational,
  confidence,
  uncertain
}) => {
  if (
    isEducational &&
    !uncertain &&
    confidence >= 0.90
  ) {
    return "approved";
  }

  if (
    !isEducational &&
    !uncertain &&
    confidence >= 0.95
  ) {
    return "rejected";
  }

  return "review";
};