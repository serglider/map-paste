const {
    createErrorResult,
    createInfoResult,
    createOpenMapsResult,
    writeResponse,
} = require('./src/flow-response');
const { buildGoogleMapsSearchUrl } = require('./src/maps-url');
const { openUrl } = require('./src/open-url');
const { getQueryFromParameters } = require('./src/query');
const { buildEffectiveQuery } = require('./src/settings');

function readRequest(rawInput) {
    if (!rawInput || !rawInput.trim()) {
        return {
            method: 'query',
            parameters: [],
            settings: {},
        };
    }

    try {
        return JSON.parse(rawInput);
    } catch (_error) {
        return {
            method: 'query',
            parameters: [rawInput],
            settings: {},
        };
    }
}

function handleQuery(request) {
    const settings = request.settings || {};
    const query = getQueryFromParameters(request.parameters);

    if (!query) {
        return [
            createInfoResult(
                'Paste or type a Google Maps search',
                'Example: mp coffee near Sagrada Familia Barcelona',
            ),
        ];
    }

    const effectiveQuery = buildEffectiveQuery(query, settings);
    const url = buildGoogleMapsSearchUrl(effectiveQuery, settings);

    return [createOpenMapsResult(effectiveQuery, url)];
}

async function handleOpenMaps(parameters) {
    const url = Array.isArray(parameters) ? parameters[0] : parameters;

    if (typeof url !== 'string' || !url.trim()) {
        throw new Error('No Google Maps URL was provided.');
    }

    const normalizedUrl = url.trim();

    await openUrl(normalizedUrl);

    return [createInfoResult('Opened Google Maps', normalizedUrl)];
}

async function handleRequest(request) {
    const method = request && request.method;

    if (method === 'query') {
        return handleQuery(request);
    }

    if (method === 'open_maps') {
        return handleOpenMaps(request.parameters);
    }

    return [createErrorResult(new Error(`Unknown method: ${method || 'missing'}`))];
}

async function main() {
    const rawInput = process.argv.slice(2).join(' ');
    const request = readRequest(rawInput);

    try {
        const result = await handleRequest(request);
        writeResponse(result);
    } catch (error) {
        writeResponse([createErrorResult(error)]);
    }
}

if (require.main === module) {
    main().catch((error) => {
        writeResponse([createErrorResult(error)]);
    });
}

module.exports = {
    handleOpenMaps,
    handleQuery,
    handleRequest,
    readRequest,
};
