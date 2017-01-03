const isCompactedIri = require('./isCompactedIri');
const getNamespace = require('./getNamespace');

function isBlankNode(value) {
  return isCompactedIri(value) && getNamespace(value) === '_';
}

module.exports = isBlankNode;
