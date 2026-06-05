const { normalizeQuery } = require('./query');

function getBooleanSetting(settings, name, defaultValue) {
    if (!settings || !Object.prototype.hasOwnProperty.call(settings, name)) {
        return defaultValue;
    }

    const value = settings[name];

    if (typeof value === 'boolean') {
        return value;
    }

    if (typeof value === 'string') {
        const normalizedValue = value.trim().toLowerCase();

        if (['true', '1', 'yes', 'on'].includes(normalizedValue)) {
            return true;
        }

        if (['false', '0', 'no', 'off'].includes(normalizedValue)) {
            return false;
        }
    }

    return defaultValue;
}

function getStringSetting(settings, name, defaultValue) {
    if (!settings || !Object.prototype.hasOwnProperty.call(settings, name)) {
        return defaultValue;
    }

    const value = settings[name];

    if (value === null || value === undefined) {
        return defaultValue;
    }

    const normalizedValue = normalizeQuery(value);
    return normalizedValue || defaultValue;
}

function buildEffectiveQuery(query, settings = {}) {
    const normalizedQuery = normalizeQuery(query);

    if (!normalizedQuery) {
        return '';
    }

    const appendDefaultLocation = getBooleanSetting(settings, 'appendDefaultLocation', false);
    const defaultLocation = getStringSetting(settings, 'defaultLocation', '');

    if (!appendDefaultLocation || !defaultLocation) {
        return normalizedQuery;
    }

    if (normalizedQuery.toLocaleLowerCase().includes(defaultLocation.toLocaleLowerCase())) {
        return normalizedQuery;
    }

    return normalizeQuery(`${normalizedQuery} ${defaultLocation}`);
}

module.exports = {
    getBooleanSetting,
    getStringSetting,
    buildEffectiveQuery,
};
