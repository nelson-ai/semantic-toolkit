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
    assert.isFunction(SemanticToolkit.isPrefix);
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
    assert.isFalse(_.isPrefix('http://foo.com#'));

    assert.isTrue(_.isPrefix(''));
    assert.isTrue(_.isPrefix('_'));
    assert.isTrue(_.isPrefix('x'));
    assert.isTrue(_.isPrefix('x1'));
    assert.isTrue(_.isPrefix('foo'));
    assert.isTrue(_.isPrefix('Foo'));
    assert.isTrue(_.isPrefix('FOO'));
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

// describe('Local names', () => {
//
//   it('has methods to deal with local names', () => {
//     const _ = new SemanticToolkit();
//
//     assert.isFunction(_.getIriLocalName);
//     assert.isFunction(_.addNamespace);
//     assert.isFunction(_.hasPrefix);
//
//     assert.isFunction(_.isPrefix);
//     assert.isFunction(SemanticToolkit.isPrefix);
//     assert.strictEqual(_.isPrefix, SemanticToolkit.isPrefix);
//   });
// });

// Comming up:
// localNames
// IRIs
// literals
// Wrapping/Unwrapping
// way more
