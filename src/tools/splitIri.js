const isIri = require('./isIri');
const invariant = require('../utils/invariant');

const pound = '#';
const slash = '/';
const colon = ':';
const memory = {};

// Split an IRI into an array of the shape [namespace, localName]
// Inspired by http://rdf4j.org/javadoc/latest/org/eclipse/rdf4j/model/IRI.html
function splitIri(iri) {
  invariant(isIri(iri), `Not a valid IRI: ${iri}`);

  // The function is deterministic so we can afford a memory
  // possible BUG: memory leaks???
  if (memory[iri]) return memory[iri];

  const poundIndex = iri.lastIndexOf(pound);

  if (poundIndex !== -1) return memory[iri] = [iri.slice(0, poundIndex), iri.slice(poundIndex + 1)];

  const slashIndex = iri.lastIndexOf(slash);

  if (slashIndex !== -1) return memory[iri] = [iri.slice(0, slashIndex), iri.slice(slashIndex + 1)];

  const colonIndex = iri.lastIndexOf(colon);

  return memory[iri] = [iri.slice(0, colonIndex), iri.slice(colonIndex + 1)];
}


module.exports = splitIri;
