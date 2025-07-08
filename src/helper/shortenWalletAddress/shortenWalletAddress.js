function shortenAddress(addr) {
  return addr.replace(/^(.{4}).+(.{5})$/, '$1...$2');
}

module.exports = shortenAddress;