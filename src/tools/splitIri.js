const isIri = require('./isIri');
const invariant = require('../utils/invariant');

// Split an IRI into an array of the shape [namespace, localName]
// Inspired by http://rdf4j.org/javadoc/latest/org/eclipse/rdf4j/model/IRI.html
function splitIri(iri) {
  invariant(isIri(iri), `Not a valid IRI: ${iri}`);

  const poundIndex = iri.lastIndexOf('#');

  if (poundIndex !== -1) return [iri.slice(0, poundIndex), iri.slice(poundIndex + 1)];

  const slashIndex = iri.lastIndexOf('/');

  if (slashIndex !== -1) return [iri.slice(0, slashIndex), iri.slice(slashIndex + 1)];

  const colonIndex = iri.lastIndexOf(':');

  return [iri.slice(0, colonIndex), iri.slice(colonIndex + 1)];
}


module.exports = splitIri;
