const isIri = require('./isIri');

function isExpandedIri(value) {
  // This is weak, and quite wrong too
  return isIri(value) && (value.startsWith('http://') || value.startsWith('https://')) && value.includes('.');
}

module.exports = isExpandedIri;
