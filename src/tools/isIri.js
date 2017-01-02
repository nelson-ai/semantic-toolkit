function isIri(value) {
  return typeof value === 'string' && value.includes(':');
}

module.exports = isIri;
