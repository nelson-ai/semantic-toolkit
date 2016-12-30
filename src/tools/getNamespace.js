const splitIri = require('./splitIri');

// Extracts the localName of an IRI
function getNamespace(iri) {
  return splitIri(iri)[0];
}

module.exports = getNamespace;
