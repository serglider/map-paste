const assert = require('node:assert');
const test = require('node:test');

const { buildGoogleMapsSearchUrl } = require('../src/maps-url');

function getSearchParams(url) {
    return new URL(url).searchParams;
}

test('builds a basic Google Maps search URL', () => {
    const url = buildGoogleMapsSearchUrl('coffee');

    assert.equal(url.startsWith('https://www.google.com/maps/search/?'), true);
    assert.equal(getSearchParams(url).get('query'), 'coffee');
});

test('encodes query spaces as URL-safe characters', () => {
    const url = buildGoogleMapsSearchUrl('coffee near Barcelona');

    assert.match(url, /query=coffee%20near%20Barcelona/);
    assert.equal(getSearchParams(url).get('query'), 'coffee near Barcelona');
});

test('encodes non-ASCII characters', () => {
    const url = buildGoogleMapsSearchUrl('Park Güell');

    assert.match(url, /Park%20G%C3%BCell/);
    assert.equal(getSearchParams(url).get('query'), 'Park Güell');
});

test('throws for an empty query', () => {
    assert.throws(() => buildGoogleMapsSearchUrl('   '), /cannot be empty/i);
});

test('includes required Google Maps and attribution parameters', () => {
    const url = buildGoogleMapsSearchUrl('coffee', { appNameForUtm: 'map-paste-test' });
    const params = getSearchParams(url);

    assert.equal(params.get('api'), '1');
    assert.equal(params.get('query'), 'coffee');
    assert.equal(params.get('utm_source'), 'map-paste-test');
    assert.equal(params.get('utm_campaign'), 'maps_search');
});

test('appends default location when enabled and missing', () => {
    const url = buildGoogleMapsSearchUrl('flower shop', {
        appendDefaultLocation: true,
        defaultLocation: 'Barcelona',
    });

    assert.equal(getSearchParams(url).get('query'), 'flower shop Barcelona');
});

test('does not append default location when it is already present', () => {
    const url = buildGoogleMapsSearchUrl('flower shop Barcelona', {
        appendDefaultLocation: true,
        defaultLocation: 'barcelona',
    });

    assert.equal(getSearchParams(url).get('query'), 'flower shop Barcelona');
});
