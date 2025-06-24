const isValidCA = (input) => {
  const regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}(pump)?$/;
  return regex.test(input);
}
module.exports = isValidCA;