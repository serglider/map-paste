const { DEFAULT_UTM_CAMPAIGN, PLUGIN_SLUG } = require('./constants');
const { normalizeQuery } = require('./query');
const { buildEffectiveQuery, getStringSetting } = require('./settings');

const GOOGLE_MAPS_SEARCH_URL = 'https://www.google.com/maps/search/';

function buildGoogleMapsSearchUrl(query, settings = {}) {
    const normalizedQuery = normalizeQuery(query);

    if (!normalizedQuery) {
        throw new Error('Google Maps search query cannot be empty.');
    }

    const effectiveQuery = buildEffectiveQuery(normalizedQuery, settings);
    const utmSource = getStringSetting(settings, 'appNameForUtm', PLUGIN_SLUG) || PLUGIN_SLUG;
    const params = new URLSearchParams();

    params.set('api', '1');
    params.set('query', effectiveQuery);
    params.set('utm_source', utmSource);
    params.set('utm_campaign', DEFAULT_UTM_CAMPAIGN);

    return `${GOOGLE_MAPS_SEARCH_URL}?${params.toString().replace(/\+/g, '%20')}`;
}

module.exports = {
    buildGoogleMapsSearchUrl,
};
