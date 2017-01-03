const isQualifiedName = require('./isQualifiedName');

function isPrefix(value) {
  return typeof value === 'string' && (!value.length || isQualifiedName(value));
}

module.exports = isPrefix;
