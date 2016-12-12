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

    assert.isFunction(_.getNamespace);
    assert.isFunction(_.addNamespace);
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

    assert.isTrue(_.hasNamespace('rdf'));
    assert.isTrue(_.hasNamespace('rdfs'));
    assert.isTrue(_.hasNamespace('xsd'));
    assert.isTrue(_.hasNamespace('owl'));

    assert.strictEqual(_.getNamespace('rdf'), 'http://www.w3.org/1999/02/22-rdf-syntax-ns#');
    assert.strictEqual(_.getNamespace('rdfs'), 'http://www.w3.org/2000/01/rdf-schema#');
    assert.strictEqual(_.getNamespace('xsd'), 'http://www.w3.org/2001/XMLSchema#');
    assert.strictEqual(_.getNamespace('owl'), 'http://www.w3.org/2002/07/owl#');
  });

  it('does not know all prefixes', () => {
    const _ = new SemanticToolkit();

    assert.isFalse(_.hasNamespace('foaf'));
    assert.strictEqual(_.getNamespace('foaf'), null);
  });

  it('accepts namespaces at instanciation', () => {
    const _ = new SemanticToolkit({
      '': 'http://base-namespace.com/',
      foo: 'http://foo.com#', // with end delimiter
      bar: 'http://bar.com', // without end delimiter
    });

    assert.isTrue(_.hasNamespace(''));
    assert.isTrue(_.hasNamespace('foo'));
    assert.isTrue(_.hasNamespace('bar'));
    assert.strictEqual(_.getNamespace(''), 'http://base-namespace.com/');
    assert.strictEqual(_.getNamespace('foo'), 'http://foo.com#');
    assert.strictEqual(_.getNamespace('bar'), 'http://bar.com');
  });

  // TODO: _.addNamespace({ n1: ..., n2: ... })
  it('accepts namespaces after instanciation', () => {
    const _ = new SemanticToolkit();

    assert.doesNotThrow(() => _.addNamespace('foo', 'http://foo.com#'));
    assert.isTrue(_.hasNamespace('foo'));
    assert.strictEqual(_.getNamespace('foo'), 'http://foo.com#');
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

    assert.strictEqual(_.getNamespace(), null);
    assert.strictEqual(_.getNamespace({}), null);
    assert.strictEqual(_.getNamespace(111), null);
    assert.strictEqual(_.getNamespace(() => 'rdf'), null);

    assert.isFalse(_.hasNamespace());
    assert.isFalse(_.hasNamespace({}));
    assert.isFalse(_.hasNamespace(111));
    assert.isFalse(_.hasNamespace(() => 'rdf'));
  });
});

// Comming up:
// localNames
// IRIs
// literals
// Wrapping/Unwrapping
// way more
