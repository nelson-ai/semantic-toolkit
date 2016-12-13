const invariant = require('./utils/invariant');
const isIri = require('./tools/isIri');
const isPrefix = require('./tools/isPrefix');

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

    this.isIri = isIri;
    this.isPrefix = isPrefix;
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
    if (!isPrefix(prefix)) throw new Error(`Malformed prefix: ${prefix}`);
    if (!isIri(namespace)) throw new Error(`Malformed namespace: ${namespace}`);

    this.prefixMap[prefix] = namespace;
    this.namespaceMap[namespace] = prefix;
  }

}

module.exports = SemanticToolkit;
