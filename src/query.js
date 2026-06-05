function normalizeQuery(value) {
    if (value === null || value === undefined) {
        return '';
    }

    return String(value).trim().replace(/\s+/g, ' ');
}

function getQueryFromParameters(parameters) {
    if (Array.isArray(parameters)) {
        return normalizeQuery(
            parameters
                .filter((parameter) => parameter !== null && parameter !== undefined)
                .join(' '),
        );
    }

    return normalizeQuery(parameters);
}

module.exports = {
    normalizeQuery,
    getQueryFromParameters,
};
