function isValidNumber(input) {
  // Convert input to string (if not already)
  const str = String(input).trim();

  // Regex explanation:
  // ^         : start of string
  // \d+       : one or more digits
  // (\.\d+)?  : optional decimal point followed by one or more digits
  // $         : end of string
  const regex = /^\d+(\.\d+)?$/;

  return regex.test(str);
}
module.exports = isValidNumber;