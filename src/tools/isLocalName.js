const isQualifiedName = require('./isQualifiedName');

function isLocalName(value) {
  return typeof value === 'string' && isQualifiedName(value);
}

module.exports = isLocalName;
