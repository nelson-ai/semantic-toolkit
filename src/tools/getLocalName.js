const splitIri = require('./splitIri');

// Extracts the localName of an IRI
function getLocalName(iri) {
  return splitIri(iri)[1];
}

module.exports = getLocalName;
