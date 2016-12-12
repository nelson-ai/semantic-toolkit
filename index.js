const SemanticToolkit = require('./src/SemanticToolkit');
const isPrefix = require('./src/tools/isPrefix');
const isIri = require('./src/tools/isIri');

module.exports = Object.assign(SemanticToolkit, {
  isPrefix,
  isIri,
});
