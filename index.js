const SemanticToolkit = require('./src/SemanticToolkit');
const isPrefix = require('./src/tools/isPrefix');
const isIri = require('./src/tools/isIri');
const splitIri = require('./src/tools/splitIri');
const getLocalName = require('./src/tools/getLocalName');
const getNamespace = require('./src/tools/getNamespace');

module.exports = Object.assign(SemanticToolkit, {
  isPrefix,
  isIri,
  splitIri,
  getNamespace,
  getLocalName,
});
