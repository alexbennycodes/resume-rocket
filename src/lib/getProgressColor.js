export function getProgressColor(progress) {
  progress = Math.max(0, Math.min(100, progress));

  const red = Math.round(255 * (1 - progress / 100));
  const green = Math.round(255 * (progress / 100));

  return `#${red.toString(16).padStart(2, "0")}${green
    .toString(16)
    .padStart(2, "0")}00`;
}
