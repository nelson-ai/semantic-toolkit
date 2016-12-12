const invariant = require('./utils/invariant');
const isIri = require('./tools/isIri');
const isPrefix = require('./tools/isPrefix');

const baseNamespaces = {
  rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
  rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
  xsd: 'http://www.w3.org/2001/XMLSchema#',
  owl: 'http://www.w3.org/2002/07/owl#',
};

class SemanticToolkit {

  constructor(namespaces = {}) {
    invariant(namespaces && typeof namespaces === 'object', 'First arg must be an object');

    Object.keys(namespaces).forEach(key => {
      invariant(isPrefix(key), `Malformed prefix: ${key}`);
      invariant(isIri(namespaces[key]), `Malformed prefix: ${namespaces[key]}`);
    });

    this.namespaces = Object.assign({}, baseNamespaces, namespaces);

    this.isIri = isIri;
    this.isPrefix = isPrefix;
  }

  hasNamespace(prefix) {
    return prefix in this.namespaces;
  }

  getNamespace(prefix) {
    return this.namespaces[prefix] || null;
  }

  addNamespace(prefix, namespace) {
    if (!isPrefix(prefix)) throw new Error(`Malformed prefix: ${prefix}`);
    if (!isIri(namespace)) throw new Error(`Malformed namespace: ${namespace}`);

    this.namespaces[prefix] = namespace;
  }

}

module.exports = SemanticToolkit;
