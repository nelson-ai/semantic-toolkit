/* global describe it */
const { assert } = require('chai');
const SemanticToolkit = require('..');

describe('Instanciation', () => {

  it('does not throw when instanciated', () => {

    assert.doesNotThrow(() => new SemanticToolkit());
    assert.doesNotThrow(() => new SemanticToolkit({}));
  });

  it('throws when instanciated', () => {

    assert.throws(() => new SemanticToolkit(111));
    assert.throws(() => new SemanticToolkit(null));
    assert.throws(() => new SemanticToolkit('foo'));
    assert.throws(() => new SemanticToolkit(() => null));
  });
});

describe('Namespaces and prefixes', () => {

  it('has methods to deal with namespaces', () => {
    const _ = new SemanticToolkit();

    assert.isFunction(_.getNamespaceForPrefix);
    assert.isFunction(_.getPrefixForNamespace);
    assert.isFunction(_.addNamespace);
    assert.isFunction(_.hasPrefix);
    assert.isFunction(_.hasNamespace);
    assert.isFunction(_.isPrefix);

    assert.strictEqual(_.isPrefix, SemanticToolkit.isPrefix);
  });

  it('knows what a prefix is', () => {
    // See https://www.w3.org/TR/1999/REC-xml-names-19990114/#NT-NCNameChar
    const _ = new SemanticToolkit();

    assert.isFalse(_.isPrefix());
    assert.isFalse(_.isPrefix({}));
    assert.isFalse(_.isPrefix(111));
    assert.isFalse(_.isPrefix(() => 'rdf'));

    assert.isFalse(_.isPrefix('foo:'));
    assert.isFalse(_.isPrefix(':foo'));
    assert.isFalse(_.isPrefix('.'));
    assert.isFalse(_.isPrefix('-'));
    assert.isFalse(_.isPrefix('$'));
    assert.isFalse(_.isPrefix('x!'));
    assert.isFalse(_.isPrefix('foo#'));
    assert.isFalse(_.isPrefix('foo/'));
    assert.isFalse(_.isPrefix('.foo'));
    assert.isFalse(_.isPrefix('-foo'));
    assert.isFalse(_.isPrefix('1'));
    assert.isFalse(_.isPrefix('111foo'));
    assert.isFalse(_.isPrefix('·foo'));
    assert.isFalse(_.isPrefix('http://foo.com#'));

    assert.isTrue(_.isPrefix(''));
    assert.isTrue(_.isPrefix('_'));
    assert.isTrue(_.isPrefix('x'));
    assert.isTrue(_.isPrefix('x1'));
    assert.isTrue(_.isPrefix('foo'));
    assert.isTrue(_.isPrefix('Foo'));
    assert.isTrue(_.isPrefix('FOO'));
    assert.isTrue(_.isPrefix('fooॐ'));
    assert.isTrue(_.isPrefix('foo111'));
    assert.isTrue(_.isPrefix('_foo'));
    assert.isTrue(_.isPrefix('_111'));
    assert.isTrue(_.isPrefix('foo.-_'));
    assert.isTrue(_.isPrefix('foo.bar'));
    assert.isTrue(_.isPrefix('foo-bar'));
    assert.isTrue(_.isPrefix('foo_bar'));
  });

  it('knows the prefixes of common namespaces', () => {
    const _ = new SemanticToolkit();

    assert.isTrue(_.hasPrefix('rdf'));
    assert.isTrue(_.hasPrefix('rdfs'));
    assert.isTrue(_.hasPrefix('xsd'));
    assert.isTrue(_.hasPrefix('owl'));

    assert.isTrue(_.hasNamespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#'));
    assert.isTrue(_.hasNamespace('http://www.w3.org/2000/01/rdf-schema#'));
    assert.isTrue(_.hasNamespace('http://www.w3.org/2001/XMLSchema#'));
    assert.isTrue(_.hasNamespace('http://www.w3.org/2002/07/owl#'));

    assert.strictEqual(_.getNamespaceForPrefix('rdf'), 'http://www.w3.org/1999/02/22-rdf-syntax-ns#');
    assert.strictEqual(_.getNamespaceForPrefix('rdfs'), 'http://www.w3.org/2000/01/rdf-schema#');
    assert.strictEqual(_.getNamespaceForPrefix('xsd'), 'http://www.w3.org/2001/XMLSchema#');
    assert.strictEqual(_.getNamespaceForPrefix('owl'), 'http://www.w3.org/2002/07/owl#');

    assert.strictEqual(_.getPrefixForNamespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#'), 'rdf');
    assert.strictEqual(_.getPrefixForNamespace('http://www.w3.org/2000/01/rdf-schema#'), 'rdfs');
    assert.strictEqual(_.getPrefixForNamespace('http://www.w3.org/2001/XMLSchema#'), 'xsd');
    assert.strictEqual(_.getPrefixForNamespace('http://www.w3.org/2002/07/owl#'), 'owl');
  });

  it('does not know all prefixes', () => {
    const _ = new SemanticToolkit();

    assert.isFalse(_.hasPrefix('foaf'));
    assert.isFalse(_.hasNamespace('http://xmlns.com/foaf/0.1/'));
    assert.strictEqual(_.getNamespaceForPrefix('foaf'), null);
    assert.strictEqual(_.getPrefixForNamespace('http://xmlns.com/foaf/0.1/'), null);
  });

  it('accepts namespaces at instanciation', () => {
    const _ = new SemanticToolkit({
      '': 'http://base-namespace.com/',
      foo: 'http://foo.com#', // with # end delimiter
      bar: 'http://bar.com/', // with / end delimiter
      baz: 'http://baz.com', // without end delimiter
    });

    assert.isTrue(_.hasPrefix(''));
    assert.isTrue(_.hasPrefix('foo'));
    assert.isTrue(_.hasPrefix('bar'));
    assert.isTrue(_.hasPrefix('baz'));

    assert.strictEqual(_.getNamespaceForPrefix(''), 'http://base-namespace.com/');
    assert.strictEqual(_.getNamespaceForPrefix('foo'), 'http://foo.com#');
    assert.strictEqual(_.getNamespaceForPrefix('baz'), 'http://baz.com');

    assert.strictEqual(_.getPrefixForNamespace('http://base-namespace.com/'), '');
    assert.strictEqual(_.getPrefixForNamespace('http://foo.com#'), 'foo');
    assert.strictEqual(_.getPrefixForNamespace('http://baz.com'), 'baz');
  });

  // TODO: _.addNamespace({ n1: ..., n2: ... })
  it('accepts namespaces after instanciation', () => {
    const _ = new SemanticToolkit();

    assert.doesNotThrow(() => _.addNamespace('foo', 'http://foo.com#'));
    assert.isTrue(_.hasPrefix('foo'));
    assert.isTrue(_.hasNamespace('http://foo.com#'));
    assert.strictEqual(_.getNamespaceForPrefix('foo'), 'http://foo.com#');
    assert.strictEqual(_.getPrefixForNamespace('http://foo.com#'), 'foo');
  });

  it('does not add malformed prefixes', () => {
    const _ = new SemanticToolkit();

    assert.throws(() => _.addNamespace());
    assert.throws(() => _.addNamespace({}));
    assert.throws(() => _.addNamespace(111));
    assert.throws(() => _.addNamespace('foo'));
    assert.throws(() => _.addNamespace('foo', null));
    assert.throws(() => _.addNamespace('foo', 111));
    assert.throws(() => _.addNamespace('foo', 'bar'));
    assert.throws(() => _.addNamespace('x!', 'http://foo.com'));
    assert.throws(() => _.addNamespace('111', 'http://foo.com'));
  });

  it('otherwise deals with malformed prefixes gracefully', () => {
    const _ = new SemanticToolkit();

    assert.strictEqual(_.getNamespaceForPrefix(), null);
    assert.strictEqual(_.getNamespaceForPrefix({}), null);
    assert.strictEqual(_.getNamespaceForPrefix(111), null);
    assert.strictEqual(_.getNamespaceForPrefix(() => 'rdf'), null);

    assert.isFalse(_.hasPrefix());
    assert.isFalse(_.hasPrefix({}));
    assert.isFalse(_.hasPrefix(111));
    assert.isFalse(_.hasPrefix(() => 'rdf'));
  });
});

describe('IRI', () => {

  it('has methods to deal with IRIs', () => {
    const _ = new SemanticToolkit();

    assert.isFunction(_.isIri);
    assert.isFunction(_.isValidIri);
    assert.isFunction(_.isExpandedIri);
    assert.isFunction(_.isCompactedIri);
    assert.isFunction(_.expandIri);
    assert.isFunction(_.compactIri);
    assert.isFunction(_.splitIri);
    assert.isFunction(_.getNamespace);
    assert.isFunction(_.getLocalName);

    assert.strictEqual(_.isIri, SemanticToolkit.isIri);
    assert.strictEqual(_.isValidIri, SemanticToolkit.isValidIri);
    assert.strictEqual(_.isExpandedIri, SemanticToolkit.isExpandedIri);
    assert.strictEqual(_.isCompactedIri, SemanticToolkit.isCompactedIri);
    assert.strictEqual(_.splitIri, SemanticToolkit.splitIri);
    assert.strictEqual(_.getNamespace, SemanticToolkit.getNamespace);
    assert.strictEqual(_.getLocalName, SemanticToolkit.getLocalName);
  });

  const validCompactedIris = [
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

  const validExpandedIris = [
    'http://foo.com',
    'https://foo.com',
    'http://foo.com/bar',
    'https://foo.com/bar',
    'http://foo.com#bar',
    'https://foo.com#bar',
    'http://foo.com#bar',
    'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    'http://www.w3.org/2000/01/rdf-schema#',
    'http://www.w3.org/2001/XMLSchema#',
    'http://www.w3.org/2002/07/owl#',
    'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
    'http://www.w3.org/2000/01/rdf-schema#Resource',
    'http://www.w3.org/2001/XMLSchema#string',
    'http://www.w3.org/2002/07/owl#Class',
  ];

  const invalidIris = [
    'foo',
    'foo:',
    'foo:-',
    'foo!:111',
    'foo:111',
    '·foo:bar',
    'foo::bar',
    'foo:bar/baz',
    'http:/foo.com/bar',
    undefined,
    {},
    111,
    /foo:bar/,
    () => 'rdf',
  ];

  it('knows what an IRI is', () => {
    const _ = new SemanticToolkit();

    validCompactedIris.forEach(iri => {
      assert.isTrue(_.isIri(iri), iri);
      assert.isTrue(_.isValidIri(iri), iri);
    });

    validExpandedIris.forEach(iri => {
      assert.isTrue(_.isIri(iri), iri);
      assert.isTrue(_.isValidIri(iri), iri);
    });

    invalidIris.forEach(iri => {
      assert.isFalse(_.isValidIri(iri), iri);
    });
  });

  it('splits IRIs', () => {
    const _ = new SemanticToolkit();

    assert.deepEqual(_.splitIri(':bar'), ['', 'bar']);
    assert.deepEqual(_.splitIri('_:bar'), ['_', 'bar']);
    assert.deepEqual(_.splitIri('foo:bar'), ['foo', 'bar']);
    assert.deepEqual(_.splitIri('http://foo.com#bar'), ['http://foo.com#', 'bar']);
    assert.deepEqual(_.splitIri('http://foo.com/bar'), ['http://foo.com/', 'bar']);
    assert.deepEqual(_.splitIri('http://foo.com/bar#baz'), ['http://foo.com/bar#', 'baz']);
    assert.deepEqual(_.splitIri('http://foo.com/bar/baz'), ['http://foo.com/bar/', 'baz']);
  });

  it('extracts namespaces', () => {
    const _ = new SemanticToolkit();

    assert.strictEqual(_.getNamespace(':bar'), '');
    assert.strictEqual(_.getNamespace('_:bar'), '_');
    assert.strictEqual(_.getNamespace('foo:bar'), 'foo');
    assert.strictEqual(_.getNamespace('http://foo.com#bar'), 'http://foo.com#');
    assert.strictEqual(_.getNamespace('http://foo.com/bar'), 'http://foo.com/');
    assert.strictEqual(_.getNamespace('http://foo.com/bar#baz'), 'http://foo.com/bar#');
    assert.strictEqual(_.getNamespace('http://foo.com/bar/baz'), 'http://foo.com/bar/');
  });

  it('extracts local names', () => {
    const _ = new SemanticToolkit();

    assert.strictEqual(_.getLocalName(':bar'), 'bar');
    assert.strictEqual(_.getLocalName('_:bar'), 'bar');
    assert.strictEqual(_.getLocalName('foo:bar'), 'bar');
    assert.strictEqual(_.getLocalName('http://foo.com#bar'), 'bar');
    assert.strictEqual(_.getLocalName('http://foo.com/bar'), 'bar');
    assert.strictEqual(_.getLocalName('http://foo.com/bar#baz'), 'baz');
    assert.strictEqual(_.getLocalName('http://foo.com/bar/baz'), 'baz');
  });

  it('knows what a compacted IRI is', () => {
    const _ = new SemanticToolkit();

    validCompactedIris.forEach(iri => {
      assert.isTrue(_.isCompactedIri(iri), iri);
    });

    validExpandedIris.forEach(iri => {
      assert.isFalse(_.isCompactedIri(iri), iri);
    });

    invalidIris.forEach(iri => {
      assert.isFalse(_.isCompactedIri(iri), iri);
    });
  });

  it('knows what an expanded IRI is', () => {
    const _ = new SemanticToolkit();

    validExpandedIris.forEach(iri => {
      assert.isTrue(_.isExpandedIri(iri), iri);
    });

    validCompactedIris.forEach(iri => {
      assert.isFalse(_.isExpandedIri(iri), iri);
    });

    invalidIris.forEach(iri => {
      assert.isFalse(_.isExpandedIri(iri), iri);
    });
  });

  it('compacts IRI', () => {
    const _ = new SemanticToolkit({ foo: 'http://foo.com/' });

    assert.strictEqual(_.compactIri('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), 'rdf:type');
    assert.strictEqual(_.compactIri('http://www.w3.org/2000/01/rdf-schema#Resource'), 'rdfs:Resource');
    assert.strictEqual(_.compactIri('http://www.w3.org/2001/XMLSchema#string'), 'xsd:string');
    assert.strictEqual(_.compactIri('http://www.w3.org/2002/07/owl#Class'), 'owl:Class');
    assert.strictEqual(_.compactIri('http://foo.com/bar'), 'foo:bar');
  });

  it('expands IRI', () => {
    const _ = new SemanticToolkit({ foo: 'http://foo.com/' });

    assert.strictEqual(_.expandIri('rdf:type'), 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type');
    assert.strictEqual(_.expandIri('rdfs:Resource'), 'http://www.w3.org/2000/01/rdf-schema#Resource');
    assert.strictEqual(_.expandIri('xsd:string'), 'http://www.w3.org/2001/XMLSchema#string');
    assert.strictEqual(_.expandIri('owl:Class'), 'http://www.w3.org/2002/07/owl#Class');
    assert.strictEqual(_.expandIri('foo:bar'), 'http://foo.com/bar');
  });
});

describe('Blank nodes', () => {
  it('has methods to deal with blank nodes', () => {
    const _ = new SemanticToolkit();

    assert.isFunction(_.isBlankNode);

    assert.strictEqual(_.isBlankNode, SemanticToolkit.isBlankNode);
  });

  it('knows what a blank node is', () => {
    const _ = new SemanticToolkit();

    assert.isTrue(_.isBlankNode('_:b'));
    assert.isTrue(_.isBlankNode('_:foo'));
    assert.isTrue(_.isBlankNode('_:b111'));

    assert.isFalse(_.isBlankNode(':bar'));
    assert.isFalse(_.isBlankNode('foo:bar'));
    assert.isFalse(_.isBlankNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'));
  });
});

// Comming up:
// expansion, compaction
// literals
// blank nodes
// Wrapping/Unwrapping
// way more
