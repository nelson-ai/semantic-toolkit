const namespaceRegex = /^[a-zA-Z_][a-zA-Z0-9_.-]*$/;

// Should be named "isNamespacePrefix"
function isNamespace(value) {
  return typeof value === 'string' && (value[0] ? namespaceRegex.test(value) : true);
}

module.exports = isNamespace;
