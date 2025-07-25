function formatDuration(ms) {
  const totalHours = ms / (1000 * 60 * 60); // get total hours as float
  const totalMinutes = ms / (1000 * 60); 

  return Math.ceil(totalMinutes)
}

module.exports = formatDuration;