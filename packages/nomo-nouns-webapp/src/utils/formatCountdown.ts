export const formatCountdown = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainderSeconds = seconds - 60 * minutes;

  return minutes > 0
    ? `${minutes}m ${remainderSeconds}s`
    : `${remainderSeconds}s`;
};
