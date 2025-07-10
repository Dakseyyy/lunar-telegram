function shortenAddress(addr) {
  if (addr === null) {
    return;
  }
  return addr.replace(/^(.{4}).+(.{5})$/, '$1...$2');
}

module.exports = shortenAddress;