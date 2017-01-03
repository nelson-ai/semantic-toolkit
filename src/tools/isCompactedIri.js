const isIri = require('./isIri');
const isPrefix = require('./isPrefix');
const isLocalName = require('./isLocalName');

function isCompactedIri(value) {
  if (!isIri(value)) return false;

  const splitArray = value.split(':');

  if (splitArray.length !== 2) return false;

  return isPrefix(splitArray[0]) && isLocalName(splitArray[1]);
}

module.exports = isCompactedIri;
