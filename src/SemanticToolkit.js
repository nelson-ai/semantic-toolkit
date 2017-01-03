const invariant = require('./utils/invariant');
const getLocalName = require('./tools/getLocalName');
const getNamespace = require('./tools/getNamespace');
const isBlankNode = require('./tools/isBlankNode');
const isCompactedIri = require('./tools/isCompactedIri');
const isExpandedIri = require('./tools/isExpandedIri');
const isIri = require('./tools/isIri');
const isPrefix = require('./tools/isPrefix');
const isValidIri = require('./tools/isValidIri');
const splitIri = require('./tools/splitIri');

const basePrefixeMap = {
  rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
  rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
  xsd: 'http://www.w3.org/2001/XMLSchema#',
  owl: 'http://www.w3.org/2002/07/owl#',
};

class SemanticToolkit {

  constructor(prefixMap = {}) {
    invariant(prefixMap && typeof prefixMap === 'object', 'First arg must be an object');

    Object.keys(prefixMap).forEach(key => {
      invariant(isPrefix(key), `Malformed prefix: ${key}`);
      invariant(isIri(prefixMap[key]), `Malformed namespace: ${prefixMap[key]}`);
    });

    this.namespaceMap = {};
    this.prefixMap = Object.assign({}, basePrefixeMap, prefixMap);

    Object.keys(this.prefixMap).forEach(key => this.namespaceMap[this.prefixMap[key]] = key);

    /* Global methods */

    Object.assign(this, {
      getLocalName,
      getNamespace,
      isBlankNode,
      isCompactedIri,
      isExpandedIri,
      isIri,
      isPrefix,
      isValidIri,
      splitIri,
    });
  }

  hasPrefix(prefix) {
    return prefix in this.prefixMap;
  }

  hasNamespace(namespace) {
    return namespace in this.namespaceMap;
  }

  getNamespaceForPrefix(prefix) {
    const result = this.prefixMap[prefix];

    return typeof result === 'string' ? result : null;
  }

  getPrefixForNamespace(namespace) {
    const result = this.namespaceMap[namespace];

    return typeof result === 'string' ? result : null;
  }

  addNamespace(prefix, namespace) {
    invariant(isPrefix(prefix), `Malformed prefix: ${prefix}`);
    invariant(isIri(namespace), `Malformed namespace: ${namespace}`);

    this.prefixMap[prefix] = namespace;
    this.namespaceMap[namespace] = prefix;
  }

  // expandIri and compactIri assume their inputs are valid
  expandIri(compactedIri) {
    const [prefix, localName] = splitIri(compactedIri);

    const namespace = this.prefixMap[prefix];

    invariant(namespace, `Unknow prefix: ${prefix}`);

    return namespace + localName;
  }

  compactIri(expandedIri) {
    const [namespace, localName] = splitIri(expandedIri);

    const prefix = this.namespaceMap[namespace];

    invariant(prefix, `Unknow namespace: ${namespace}`);

    return `${prefix}:${localName}`;
  }

}

module.exports = SemanticToolkit;
