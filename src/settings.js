const { normalizeQuery } = require('./query');

const TRUE_SETTING_VALUES = new Set(['true', '1', 'yes', 'on']);
const FALSE_SETTING_VALUES = new Set(['false', '0', 'no', 'off']);

function hasSetting(settings, name) {
    return Boolean(settings && Object.prototype.hasOwnProperty.call(settings, name));
}

function getBooleanSetting(settings, name, defaultValue) {
    if (!hasSetting(settings, name)) {
        return defaultValue;
    }

    const value = settings[name];

    if (typeof value === 'boolean') {
        return value;
    }

    if (typeof value === 'string') {
        const normalizedValue = value.trim().toLowerCase();

        if (TRUE_SETTING_VALUES.has(normalizedValue)) {
            return true;
        }

        if (FALSE_SETTING_VALUES.has(normalizedValue)) {
            return false;
        }
    }

    return defaultValue;
}

function getStringSetting(settings, name, defaultValue) {
    if (!hasSetting(settings, name)) {
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
