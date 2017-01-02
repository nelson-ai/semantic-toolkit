const isIri = require('./isIri');
const isExpandedIri = require('./isExpandedIri');
const isCompactedIri = require('./isCompactedIri');

function isValidIri(value) {
  return isIri(value) && (isExpandedIri(value) || isCompactedIri(value));
}

module.exports = isValidIri;
