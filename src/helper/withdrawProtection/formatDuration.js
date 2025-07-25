function formatDuration(ms) {
  const totalHours = ms / (1000 * 60 * 60); // get total hours as float


  return Math.ceil(totalHours)
}

module.exports = formatDuration;