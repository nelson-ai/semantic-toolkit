const isIri = require('./isIri');
const invariant = require('../utils/invariant');

// Split an IRI into an array of the shape [namespace, localName]
// Inspired by http://rdf4j.org/javadoc/latest/org/eclipse/rdf4j/model/IRI.html
// Interesting (short) read:
// http://richard.cyganiak.de/blog/2016/02/uris-have-a-namespace-part-right/
function splitIri(iri) {
  invariant(isIri(iri), `Not a valid IRI: ${iri}`);

  const poundIndex = iri.lastIndexOf('#') + 1;

  if (poundIndex) return [iri.slice(0, poundIndex), iri.slice(poundIndex)];

  const slashIndex = iri.lastIndexOf('/') + 1;

  if (slashIndex) return [iri.slice(0, slashIndex), iri.slice(slashIndex)];

  const colonIndex = iri.lastIndexOf(':');

  return [iri.slice(0, colonIndex), iri.slice(colonIndex + 1)];
}


module.exports = splitIri;
