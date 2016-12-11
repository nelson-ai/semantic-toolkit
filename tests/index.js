/* global describe it */
const { assert } = require('chai');
const SemanticToolkit = require('..');

describe('Instanciation', () => {

  it('does not throw when instanciated', () => {

    assert.doesNotThrow(() => new SemanticToolkit());
    assert.doesNotThrow(() => new SemanticToolkit({}));
  });
});

describe('Namespaces', () => {

  it('has methods to deal with namespaces', () => {
    const _ = new SemanticToolkit();

    assert.isFunction(_.getNamespace);
    assert.isFunction(_.addNamespace);
    assert.isFunction(_.hasNamespace);

    assert.isFunction(_.isNamespace);
    assert.isFunction(SemanticToolkit.isNamespace);
    assert.isStrictEqual(_.isNamespace, SemanticToolkit.isNamespace);
  });

  it('knows what a namespace is', () => {
    // See https://www.w3.org/TR/1999/REC-xml-names-19990114/#NT-NCNameChar
    const _ = new SemanticToolkit();

    assert.isFalse(_.isNamespace());
    assert.isFalse(_.isNamespace({}));
    assert.isFalse(_.isNamespace(111));
    assert.isFalse(_.isNamespace(() => 'rdf'));

    assert.isFalse(_.isNamespace('foo:'));
    assert.isFalse(_.isNamespace(':foo'));
    assert.isFalse(_.isNamespace('.'));
    assert.isFalse(_.isNamespace('-'));
    assert.isFalse(_.isNamespace('$'));
    assert.isFalse(_.isNamespace('x!'));
    assert.isFalse(_.isNamespace('foo#'));
    assert.isFalse(_.isNamespace('foo/'));
    assert.isFalse(_.isNamespace('.foo'));
    assert.isFalse(_.isNamespace('-foo'));
    assert.isFalse(_.isNamespace('1'));
    assert.isFalse(_.isNamespace('111foo'));
    assert.isFalse(_.isNamespace('http://foo.com#'));

    assert.isTrue(_.isNamespace(''));
    assert.isTrue(_.isNamespace('_'));
    assert.isTrue(_.isNamespace('x'));
    assert.isTrue(_.isNamespace('x1'));
    assert.isTrue(_.isNamespace('foo'));
    assert.isTrue(_.isNamespace('Foo'));
    assert.isTrue(_.isNamespace('FOO'));
    assert.isTrue(_.isNamespace('foo111'));
    assert.isTrue(_.isNamespace('_foo'));
    assert.isTrue(_.isNamespace('_111'));
    assert.isTrue(_.isNamespace('foo.-_'));
    assert.isTrue(_.isNamespace('foo.bar'));
    assert.isTrue(_.isNamespace('foo-bar'));
    assert.isTrue(_.isNamespace('foo_bar'));
  });

  it('knows common namespaces', () => {
    const _ = new SemanticToolkit();

    assert.isTrue(_.hasNamespace('rdf'));
    assert.isTrue(_.hasNamespace('rdfs'));
    assert.isTrue(_.hasNamespace('xsd'));
    assert.isTrue(_.hasNamespace('owl'));

    assert.isStrictEqual(_.getNamespace('rdf'), 'http://www.w3.org/1999/02/22-rdf-syntax-ns#');
    assert.isStrictEqual(_.getNamespace('rdfs'), 'http://www.w3.org/2000/01/rdf-schema#');
    assert.isStrictEqual(_.getNamespace('xsd'), 'http://www.w3.org/2001/XMLSchema#');
    assert.isStrictEqual(_.getNamespace('owl'), 'http://www.w3.org/2002/07/owl#');
  });

  it('does not know all namespaces', () => {
    const _ = new SemanticToolkit();

    assert.isFalse(_.hasNamespace('foaf'));
    assert.isStrictEqual(_.getNamespace('foaf'), null);
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
    assert.isStrictEqual(_.getNamespace(''), 'http://base-namespace.com/');
    assert.isStrictEqual(_.getNamespace('foo'), 'http://foo.com#');
    assert.isStrictEqual(_.getNamespace('bar'), 'http://bar.com');
  });

  // TODO: _.addNamespace({ n1: ..., n2: ... })
  it('accepts namespaces after instanciation', () => {
    const _ = new SemanticToolkit();

    assert.doesNotThrow(() => _.addNamespace('foo', 'http://foo.com#'));
    assert.isTrue(_.hasNamespace('foo'));
    assert.isStrictEqual(_.getNamespace('foo'), 'http://foo.com#');
  });

  it('does not add malformed namespaces', () => {
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

  it('otherwise deals with malformed namespaces gracefully', () => {
    const _ = new SemanticToolkit();

    assert.isStrictEqual(_.getNamespace(), null);
    assert.isStrictEqual(_.getNamespace({}), null);
    assert.isStrictEqual(_.getNamespace(111), null);
    assert.isStrictEqual(_.getNamespace(() => 'rdf'), null);

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
