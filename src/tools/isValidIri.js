const isExpandedIri = require('./isExpandedIri');
const isCompactedIri = require('./isCompactedIri');

function isValidIri(value) {
  return isExpandedIri(value) || isCompactedIri(value);
}

module.exports = isValidIri;
