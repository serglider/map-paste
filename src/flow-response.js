const { ICON_PATH } = require('./constants');

function createBaseResult(title, subtitle, score = 100) {
    return {
        Title: title,
        Subtitle: subtitle,
        IcoPath: ICON_PATH,
        score,
    };
}

function createInfoResult(title, subtitle) {
    return createBaseResult(title, subtitle, 100);
}

function createOpenMapsResult(query, url) {
    return {
        ...createBaseResult('Open in Google Maps', query, 100),
        JsonRPCAction: {
            method: 'open_maps',
            parameters: [url],
        },
    };
}

function createErrorResult(error) {
    const message = error && error.message ? error.message : String(error);
    return createBaseResult('MapPaste error', message, 1);
}

function writeResponse(result) {
    console.log(JSON.stringify({ result }));
}

module.exports = {
    createInfoResult,
    createOpenMapsResult,
    createErrorResult,
    writeResponse,
};
