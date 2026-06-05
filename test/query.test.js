const assert = require('node:assert');
const test = require('node:test');

const { getQueryFromParameters, normalizeQuery } = require('../src/query');

test('trims leading and trailing whitespace', () => {
    assert.equal(normalizeQuery('  coffee near Barcelona  '), 'coffee near Barcelona');
});

test('collapses repeated spaces', () => {
    assert.equal(normalizeQuery('coffee    near     Barcelona'), 'coffee near Barcelona');
});

test('collapses newlines', () => {
    assert.equal(normalizeQuery('coffee\nnear\r\nBarcelona'), 'coffee near Barcelona');
});

test('handles array parameters', () => {
    assert.equal(getQueryFromParameters(['coffee', 'near', 'Barcelona']), 'coffee near Barcelona');
});

test('handles null and undefined parameters', () => {
    assert.equal(getQueryFromParameters(null), '');
    assert.equal(getQueryFromParameters(undefined), '');
    assert.equal(getQueryFromParameters([null, undefined]), '');
});

test('preserves case', () => {
    assert.equal(normalizeQuery('Park GÜELL Barcelona'), 'Park GÜELL Barcelona');
});

test('preserves accented characters', () => {
    assert.equal(normalizeQuery('  Park Güell  '), 'Park Güell');
});
