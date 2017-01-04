/* global describe it */
const { assert } = require('chai');
const {
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
  prefixes,
} = require('../src');

/* --

-- */

const validPrefixedNames = [
  ':x',
  ':x1',
  ':foo',
  '_:foo',
  'foo:bar',
  'foo:bar111',
  'ॐ:ॐ',
  'foo:ॐ',
  'ॐ:foo',
  'f·o:bar',
  'rdf:type',
  'rdfs:Resource',
  'xsd:string',
  'owl:class',
];

const validAbsoluteIris = [
  'http://foo.com',
  'https://foo.com',
  'http://foo.com/bar',
  'https://foo.com/bar',
  'http://foo.com#bar',
  'https://foo.com#bar',
  'http://foo.com#bar',
  'http://ॐ.com/ॐ',
  'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
  'http://www.w3.org/2000/01/rdf-schema#',
  'http://www.w3.org/2001/XMLSchema#',
  'http://www.w3.org/2002/07/owl#',
  'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
  'http://www.w3.org/2000/01/rdf-schema#Resource',
  'http://www.w3.org/2001/XMLSchema#string',
  'http://www.w3.org/2002/07/owl#Class',
  'file:/path/to/a/file.ext',
  'file:/file',
];

const invalidIris = [
  'foo',
  'foo:',
  'foo:-',
  'foo!:111',
  'foo:111',
  '·foo:bar',
  'foo::bar',
  'http//foo.com/bar',
  undefined,
  {},
  111,
  /foo:bar/,
  () => 'rdf',
];

describe('Namespaces and prefixes', () => {

  it('has methods to deal with prefixes', () => {
    assert.isFunction(isPrefix);
  });

  it('knows what a prefix is', () => {
    // See https://www.w3.org/TR/1999/REC-xml-names-19990114/#NT-NCNameChar
    assert.isFalse(isPrefix());
    assert.isFalse(isPrefix({}));
    assert.isFalse(isPrefix(111));
    assert.isFalse(isPrefix(() => 'rdf'));

    assert.isFalse(isPrefix('foo:'));
    assert.isFalse(isPrefix(':foo'));
    assert.isFalse(isPrefix('.'));
    assert.isFalse(isPrefix('-'));
    assert.isFalse(isPrefix('$'));
    assert.isFalse(isPrefix('x!'));
    assert.isFalse(isPrefix('foo#'));
    assert.isFalse(isPrefix('foo/'));
    assert.isFalse(isPrefix('.foo'));
    assert.isFalse(isPrefix('-foo'));
    assert.isFalse(isPrefix('1'));
    assert.isFalse(isPrefix('111foo'));
    assert.isFalse(isPrefix('·foo'));
    assert.isFalse(isPrefix('http://foo.com#'));

    assert.isTrue(isPrefix(''));
    assert.isTrue(isPrefix('_'));
    assert.isTrue(isPrefix('x'));
    assert.isTrue(isPrefix('x1'));
    assert.isTrue(isPrefix('foo'));
    assert.isTrue(isPrefix('Foo'));
    assert.isTrue(isPrefix('FOO'));
    assert.isTrue(isPrefix('fooॐ'));
    assert.isTrue(isPrefix('foo111'));
    assert.isTrue(isPrefix('_foo'));
    assert.isTrue(isPrefix('_111'));
    assert.isTrue(isPrefix('foo.-_'));
    assert.isTrue(isPrefix('foo.bar'));
    assert.isTrue(isPrefix('foo-bar'));
    assert.isTrue(isPrefix('foo_bar'));
  });

  it('knows the prefixes of common namespaces', () => {
    assert.strictEqual(prefixes.rdf, 'http://www.w3.org/1999/02/22-rdf-syntax-ns#');
    assert.strictEqual(prefixes.rdfs, 'http://www.w3.org/2000/01/rdf-schema#');
    assert.strictEqual(prefixes.xsd, 'http://www.w3.org/2001/XMLSchema#');
    assert.strictEqual(prefixes.owl, 'http://www.w3.org/2002/07/owl#');
  });

});

describe('IRI', () => {

  it('has methods to deal with IRIs', () => {
    assert.isFunction(isIri);
    assert.isFunction(isValidIri);
    assert.isFunction(isAbsoluteIri);
    assert.isFunction(isPrefixedName);
    assert.isFunction(expandIri);
    assert.isFunction(compactIri);
    assert.isFunction(splitIri);
    assert.isFunction(getNamespace);
    assert.isFunction(getLocalName);
  });

  it('knows what an IRI is', () => {
    validPrefixedNames.forEach(iri => {
      assert.isTrue(isIri(iri), iri);
      assert.isTrue(isValidIri(iri), iri);
    });

    validAbsoluteIris.forEach(iri => {
      assert.isTrue(isIri(iri), iri);
      assert.isTrue(isValidIri(iri), iri);
    });

    invalidIris.forEach(iri => {
      assert.isFalse(isValidIri(iri), iri);
    });
  });

  it('splits IRIs', () => {
    assert.deepEqual(splitIri(':bar'), ['', 'bar']);
    assert.deepEqual(splitIri('_:bar'), ['_', 'bar']);
    assert.deepEqual(splitIri('foo:bar'), ['foo', 'bar']);
    assert.deepEqual(splitIri('http://foo.com#bar'), ['http://foo.com#', 'bar']);
    assert.deepEqual(splitIri('http://foo.com/bar'), ['http://foo.com/', 'bar']);
    assert.deepEqual(splitIri('http://foo.com/bar#baz'), ['http://foo.com/bar#', 'baz']);
    assert.deepEqual(splitIri('http://foo.com/bar/baz'), ['http://foo.com/bar/', 'baz']);
  });

  it('extracts namespaces', () => {
    assert.strictEqual(getNamespace(':bar'), '');
    assert.strictEqual(getNamespace('_:bar'), '_');
    assert.strictEqual(getNamespace('foo:bar'), 'foo');
    assert.strictEqual(getNamespace('http://foo.com#bar'), 'http://foo.com#');
    assert.strictEqual(getNamespace('http://foo.com/bar'), 'http://foo.com/');
    assert.strictEqual(getNamespace('http://foo.com/bar#baz'), 'http://foo.com/bar#');
    assert.strictEqual(getNamespace('http://foo.com/bar/baz'), 'http://foo.com/bar/');
  });

  it('extracts local names', () => {
    assert.strictEqual(getLocalName(':bar'), 'bar');
    assert.strictEqual(getLocalName('_:bar'), 'bar');
    assert.strictEqual(getLocalName('foo:bar'), 'bar');
    assert.strictEqual(getLocalName('http://foo.com#bar'), 'bar');
    assert.strictEqual(getLocalName('http://foo.com/bar'), 'bar');
    assert.strictEqual(getLocalName('http://foo.com/bar#baz'), 'baz');
    assert.strictEqual(getLocalName('http://foo.com/bar/baz'), 'baz');
  });

  it('knows what a compacted IRI is', () => {
    validPrefixedNames.forEach(iri => {
      assert.isTrue(isPrefixedName(iri), iri);
    });

    validAbsoluteIris.forEach(iri => {
      assert.isFalse(isPrefixedName(iri), iri);
    });

    invalidIris.forEach(iri => {
      assert.isFalse(isPrefixedName(iri), iri);
    });
  });

  it('knows what an absolute IRI is', () => {
    validAbsoluteIris.forEach(iri => {
      assert.isTrue(isAbsoluteIri(iri), iri);
    });

    validPrefixedNames.forEach(iri => {
      assert.isFalse(isAbsoluteIri(iri), iri);
    });

    invalidIris.forEach(iri => {
      assert.isFalse(isAbsoluteIri(iri), iri);
    });
  });

  it('compacts IRI', () => {
    assert.strictEqual(compactIri('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), 'rdf:type');
    assert.strictEqual(compactIri('http://www.w3.org/2000/01/rdf-schema#Resource'), 'rdfs:Resource');
    assert.strictEqual(compactIri('http://www.w3.org/2001/XMLSchema#string'), 'xsd:string');
    assert.strictEqual(compactIri('http://www.w3.org/2002/07/owl#Class'), 'owl:Class');
    assert.strictEqual(compactIri('http://foo.com/bar', { foo: 'http://foo.com/' }), 'foo:bar');
    assert.strictEqual(compactIri('http://foo.com/bar', { foo: 'http://foo.com' }), 'foo:bar');
  });

  it('expands IRI', () => {
    assert.strictEqual(expandIri('rdf:type'), 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type');
    assert.strictEqual(expandIri('rdfs:Resource'), 'http://www.w3.org/2000/01/rdf-schema#Resource');
    assert.strictEqual(expandIri('xsd:string'), 'http://www.w3.org/2001/XMLSchema#string');
    assert.strictEqual(expandIri('owl:Class'), 'http://www.w3.org/2002/07/owl#Class');
    assert.strictEqual(expandIri('foo:bar', { foo: 'http://foo.com/' }), 'http://foo.com/bar');
    // assert.strictEqual(expandIri('foo:bar', { foo: 'http://foo.com' }), 'http://foo.com/bar');
  });
});

describe('Blank nodes', () => {

  it('has methods to deal with blank nodes', () => {
    assert.isFunction(isBlankNode);
  });

  it('knows what a blank node is', () => {
    assert.isTrue(isBlankNode('_:b'));
    assert.isTrue(isBlankNode('_:foo'));
    assert.isTrue(isBlankNode('_:b111'));

    assert.isFalse(isBlankNode(':foo'));
    assert.isFalse(isBlankNode('foo:bar'));
    assert.isFalse(isBlankNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'));

    invalidIris.forEach(iri => {
      assert.isFalse(isBlankNode(iri), iri);
    });
  });
});

describe('Literals', () => {

});

// Comming up:
// literals
// Wrapping/Unwrapping
// way more
