module.exports = Object.assign(require('./src/SemanticToolkit'), {
  getLocalName: require('./src/tools/getLocalName'),
  getNamespace: require('./src/tools/getNamespace'),
  isCompactedIri: require('./src/tools/isCompactedIri'),
  isExpandedIri: require('./src/tools/isExpandedIri'),
  isIri: require('./src/tools/isIri'),
  isPrefix: require('./src/tools/isPrefix'),
  isValidIri: require('./src/tools/isValidIri'),
  splitIri: require('./src/tools/splitIri'),
});
