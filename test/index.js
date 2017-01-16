/* global describe it */
const { assert } = require('chai');
const {
  registerPrefixes,
  isIri,
  isPrefix,
  isLocalName,
  isPrefixedName,
  isAbsoluteIri,
  isValidIri,
  splitIri,
  getNamespace,
  getLocalName,
  expand,
  compact,
  isBlankNode,
  isLiteral,
  getLiteralValue,
  getLiteralDatatypeIri,
  getLiteralLanguageTag,
  wrapIri,
  wrapLiteral,
  unwrapIri,
  unwrapLiteral,
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
  'http://gogame.com/布石',
  'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
  'http://www.w3.org/2000/01/rdf-schema#',
  'http://www.w3.org/2001/XMLSchema#',
  'http://www.w3.org/2002/07/owl#',
  'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
  'http://www.w3.org/2000/01/rdf-schema#Resource',
  'http://www.w3.org/2001/XMLSchema#string',
  'http://www.w3.org/2002/07/owl#Class',
  'http://192.168.0.1:80',
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
    assert.isFunction(registerPrefixes);
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
    assert.isFunction(expand);
    assert.isFunction(compact);
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
    assert.strictEqual(compact('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), 'rdf:type');
    assert.strictEqual(compact('http://www.w3.org/2000/01/rdf-schema#Resource'), 'rdfs:Resource');
    assert.strictEqual(compact('http://www.w3.org/2001/XMLSchema#string'), 'xsd:string');
    assert.strictEqual(compact('http://www.w3.org/2002/07/owl#Class'), 'owl:Class');
    assert.strictEqual(compact('http://foo.com/bar', { foo: 'http://foo.com/' }), 'foo:bar');
    assert.strictEqual(compact('http://foo.com/bar', { foo: 'http://foo.com' }), 'foo:bar');
  });

  it('expands IRI', () => {
    assert.strictEqual(expand('rdf:type'), 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type');
    assert.strictEqual(expand('rdfs:Resource'), 'http://www.w3.org/2000/01/rdf-schema#Resource');
    assert.strictEqual(expand('xsd:string'), 'http://www.w3.org/2001/XMLSchema#string');
    assert.strictEqual(expand('owl:Class'), 'http://www.w3.org/2002/07/owl#Class');
    assert.strictEqual(expand('foo:bar', { foo: 'http://foo.com/' }), 'http://foo.com/bar');
    // assert.strictEqual(expand('foo:bar', { foo: 'http://foo.com' }), 'http://foo.com/bar');
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

const literals = [
  { value: 'foo', wrapped: '"foo"' },
  { value: 'foo', language: 'en', wrapped: '"foo"@en' },
  { value: 'for real For Real', language: 'fr-FR', wrapped: '"for real For Real"@fr-FR' },
  { value: 'foo', datatype: 'xsd:string', wrapped: '"foo"^^xsd:string' },
  { value: 'foo', datatype: 'http://www.w3.org/2001/XMLSchema#string', wrapped: '"foo"^^<http://www.w3.org/2001/XMLSchema#string>' },
  { value: 'http://foo.com#bar', wrapped: '"http://foo.com#bar"' },
  { value: '"Look Ma\', "quotes on quotes"!"', wrapped: '"\\"Look Ma\', \\"quotes on quotes\\"!\\""' }, // eslint-disable-line no-useless-escape
  { value: 'x\tx\nx\rx\bx\fx"x\'x\\', wrapped: '"\\"Look Ma\', \\"quotes on quotes\\"!\\""' }, // eslint-disable-line no-useless-escape
  // Abreviations are not RDF spec compliant, but are SPARQL, Turtle and TriG spec compliant
  { value: true, wrapped: 'true' },
  { value: false, wrapped: 'false' },
  { value: true, datatype: 'xsd:boolean', wrapped: '"true"^^xsd:boolean' },
  { value: false, datatype: 'xsd:boolean', wrapped: '"false"^^xsd:boolean' },
  { value: true, datatype: 'http://www.w3.org/2001/XMLSchema#boolean', wrapped: '"true"^^<http://www.w3.org/2001/XMLSchema#boolean>' },
  { value: false, datatype: 'http://www.w3.org/2001/XMLSchema#boolean', wrapped: '"false"^^<http://www.w3.org/2001/XMLSchema#boolean>' },
  { value: 0, wrapped: '0' },
  { value: -1, wrapped: '-1' },
  { value: 111, wrapped: '111' },
  { value: 1.618, wrapped: '1.618' },
  { value: 6.626e-34, wrapped: '6.626e-34' },
  { value: 0, datatype: 'xsd:integer', wrapped: '"0"^^xsd:integer' },
  { value: -1, datatype: 'xsd:integer', wrapped: '"-1"^^xsd:integer' },
  { value: 111, datatype: 'xsd:integer', wrapped: '"111"^^xsd:integer' },
  { value: 1.618, datatype: 'xsd:decimal', wrapped: '"1.618"^^xsd:decimal' },
  { value: 3.141592, datatype: 'xsd:float', wrapped: '"3.141592"^^xsd:float' },
  { value: 6.626e-34, datatype: 'xsd:double', wrapped: '"6.626e-34"^^xsd:double' },
  { value: 0, datatype: 'http://www.w3.org/2001/XMLSchema#integer', wrapped: '"0"^^<http://www.w3.org/2001/XMLSchema#integer>' },
  { value: -1, datatype: 'http://www.w3.org/2001/XMLSchema#integer', wrapped: '"-1"^^<http://www.w3.org/2001/XMLSchema#integer>' },
  { value: 111, datatype: 'http://www.w3.org/2001/XMLSchema#integer', wrapped: '"111"^^<http://www.w3.org/2001/XMLSchema#integer>' },
  { value: 1.618, datatype: 'http://www.w3.org/2001/XMLSchema#decimal', wrapped: '"1.618"^^<http://www.w3.org/2001/XMLSchema#decimal>' },
  { value: 3.141592, datatype: 'http://www.w3.org/2001/XMLSchema#float', wrapped: '"3.141592"^^<http://www.w3.org/2001/XMLSchema#float>' },
  { value: 6.626e-34, datatype: 'http://www.w3.org/2001/XMLSchema#double', wrapped: '"6.626e-34"^^<http://www.w3.org/2001/XMLSchema#double>' },
];

const invalidLiterals = [
  'foo',
  'http://foo.om/',
  0,
  -1,
  2.718281,
];

describe('Literals', () => {

  it('has methods to deal with literals', () => {
    assert.isFunction(isLiteral);
    assert.isFunction(getLiteralValue);
    assert.isFunction(getLiteralDatatypeIri);
    assert.isFunction(getLiteralLanguageTag);
  });
});

describe('Wrapping', () => {

  it('has methods to deal with literals', () => {
    assert.isFunction(wrapIri);
    assert.isFunction(wrapLiteral);
    assert.isFunction(unwrapIri);
    assert.isFunction(unwrapLiteral);
  });
});
