const invariant = require('./utils/invariant');
const { schemeRegex, qualifiedNameRegex } = require('./regularExpressions');

const prefixes = {
  rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
  rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
  xsd: 'http://www.w3.org/2001/XMLSchema#',
  owl: 'http://www.w3.org/2002/07/owl#',
};

function isIri(value) {
  return typeof value === 'string' && value.includes(':');
}

function isPrefix(value) {
  return typeof value === 'string' && (!value.length || qualifiedNameRegex.test(value));
}

function isLocalName(value) {
  return typeof value === 'string' && qualifiedNameRegex.test(value);
}

function isPrefixedName(value) {
  if (!isIri(value)) return false;

  const splitArray = value.split(':');

  if (splitArray.length !== 2) return false;

  return isPrefix(splitArray[0]) && isLocalName(splitArray[1]);
}


// Weak test for an absolute IRI with a non-empty ihier-part
function isAbsoluteIri(value) {
  if (!isIri(value)) return false;

  const [scheme, ihierPart] = value.split(':');

  return schemeRegex.test(scheme) && ihierPart.includes('/');
}

function isValidIri(value) {
  return isAbsoluteIri(value) || isPrefixedName(value);
}

function splitIri(iri) {
  invariant(isIri(iri), `Not a valid IRI: ${iri}`);

  const poundIndex = iri.lastIndexOf('#') + 1;

  if (poundIndex) return [iri.slice(0, poundIndex), iri.slice(poundIndex)];

  const slashIndex = iri.lastIndexOf('/') + 1;

  if (slashIndex) return [iri.slice(0, slashIndex), iri.slice(slashIndex)];

  const colonIndex = iri.lastIndexOf(':');

  return [iri.slice(0, colonIndex), iri.slice(colonIndex + 1)];
}

function getNamespace(iri) {
  return splitIri(iri)[0];
}

// Extracts the localName of an IRI
function getLocalName(iri) {
  return splitIri(iri)[1];
}

// expandIri and compactIri assume their inputs are valid
function expandIri(prefixedName, additionalPrefixes = {}) {
  const [prefix, localName] = prefixedName.split(':');

  const namespace = Object.assign({}, prefixes, additionalPrefixes)[prefix];

  invariant(namespace, `Unknown prefix: ${prefix}`);

  return namespace + localName;
}

function compactIri(absoluteIri, additionalPrefixes = {}) {
  const allPrefixes = Object.assign({}, prefixes, additionalPrefixes);

  const prefix = Object.keys(allPrefixes).find(key => absoluteIri.startsWith(allPrefixes[key]));

  invariant(prefix, `Unknown prefix for: ${absoluteIri}`);

  const namespace = allPrefixes[prefix];

  let localName = absoluteIri.slice(namespace.length);

  if (localName.charAt(0) === '#' || localName.charAt(0) === '/') localName = localName.slice(1);

  return `${prefix}:${localName}`;
}

function isBlankNode(value) {
  return isPrefixedName(value) && getNamespace(value) === '_';
}

function isLiteral(value) {
}

function getLiteralValue(literal) {
}

function getLiteralDatatype(literal) {
}

function getLiteralLanguageTag(literal) {
}

function wrapIri(iri) {
}

function wrapLiteral(value, datatypeIri) {
}

function unwrapIri(wrappedIri) {
}

function unwrapLiteral(literal) {
}


module.exports = {
  isIri,
  isPrefix,
  isLocalName,
  isPrefixedName,
  isAbsoluteIri,
  isValidIri,
  splitIri,
  getNamespace,
  getLocalName,
  expandIri,
  compactIri,
  isBlankNode,
  isLiteral,
  getLiteralValue,
  getLiteralDatatype,
  getLiteralLanguageTag,
  wrapIri,
  wrapLiteral,
  unwrapIri,
  unwrapLiteral,
  prefixes,
};
