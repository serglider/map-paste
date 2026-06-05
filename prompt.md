# MapPaste implementation plan for local AI agents

## Context

You are starting inside a folder named `map-paste`.

The folder currently contains only this file, `prompt.md`.

Build a Flow Launcher plugin named **MapPaste**.

MapPaste is a small JavaScript/Node.js plugin for Flow Launcher. The user activates Flow Launcher, types the plugin keyword, pastes or types text, and the plugin opens a Google Maps search URL for that text.

The intended workflow is:

```text
Flow hotkey
  -> user types "mp <pasted text>"
  -> plugin shows an "Open in Google Maps" result
  -> user presses Enter
  -> default browser opens Google Maps search
```

Do not use Google Maps SDK, Google Maps JavaScript API, Places API, Geocoding API, Routes API, or any Google Maps Platform API key. This plugin should only generate normal Google Maps URLs.

Use the Google Maps URL format:

```text
https://www.google.com/maps/search/?api=1&query=<encoded query>
```

The `api=1` parameter is required for Google Maps URLs.

## Project naming

Use these names consistently:

```text
Folder name: map-paste
npm package name: map-paste
Visible Flow Launcher plugin name: MapPaste
Flow Launcher plugin namespace/release folder: Flow.Launcher.Plugin.MapPaste
Default action keyword: mp
Description: Search Google Maps from pasted text
```

## Main goals

Implement a working local Flow Launcher Node.js plugin with:

1. A valid `plugin.json`.
2. A Node.js entry point.
3. A small, well-tested URL builder.
4. Flow Launcher query handling.
5. A result that opens Google Maps in the default browser.
6. Optional settings for appending a default location.
7. Reasonable npm scripts.
8. Formatting with Prettier.
9. A README explaining installation and usage.
10. Git initialized with a clean first commit.

## Technical constraints

Use JavaScript, not TypeScript, unless there is a very strong reason to switch.

Use CommonJS for maximum compatibility with simple Flow Launcher Node.js plugin execution:

```js
const open = require('open');
```

Prefer simple code and few dependencies.

Expected runtime dependency:

```text
open
```

Expected dev dependency:

```text
prettier
```

Avoid heavy build tooling for v1. No bundler is needed.

## Recommended file structure

Create this structure:

```text
map-paste/
  prompt.md
  plugin.json
  package.json
  package-lock.json
  main.js
  src/
    constants.js
    flow-response.js
    maps-url.js
    query.js
    settings.js
  test/
    maps-url.test.js
    query.test.js
  Images/
    app.svg
  SettingsTemplate.yaml
  README.md
  .gitignore
```

It is acceptable to use `Images/app.png` instead of `Images/app.svg` if Flow Launcher requires or strongly prefers PNG icons in practice. If you create only SVG, check whether Flow Launcher accepts it. If unsure, create both `Images/app.svg` and `Images/app.png`, and use PNG in `plugin.json`.

## package.json

Create a `package.json` similar to this:

```json
{
    "name": "map-paste",
    "version": "0.1.0",
    "description": "Flow Launcher plugin to search Google Maps from pasted text.",
    "main": "main.js",
    "private": true,
    "scripts": {
        "format": "prettier --write .",
        "format:check": "prettier --check .",
        "test": "node --test"
    },
    "dependencies": {
        "open": "^10.0.0"
    },
    "devDependencies": {
        "prettier": "^3.0.0"
    }
}
```

Use the latest compatible versions available locally from npm, unless this breaks CommonJS usage. If the current `open` package version is ESM-only and awkward to use from CommonJS, choose one of these solutions:

1. Use dynamic import inside CommonJS:

```js
async function openUrl(url) {
    const { default: open } = await import('open');
    await open(url);
}
```

2. Or use a compatible older version of `open`.

Prefer the dynamic import solution if it works cleanly.

## Prettier configuration

Put this in `package.json`:

```json
"prettier": {
    "printWidth": 100,
    "tabWidth": 4,
    "semi": true,
    "singleQuote": true,
    "trailingComma": "all",
    "bracketSpacing": true,
    "arrowParens": "always",
    "endOfLine": "lf"
}
```

## plugin.json

Create a valid Flow Launcher `plugin.json`.

Use:

```json
{
    "ID": "<generate-a-stable-guid-or-32-char-id>",
    "ActionKeyword": "mp",
    "Name": "MapPaste",
    "Description": "Search Google Maps from pasted text",
    "Author": "Sergey Chernykh",
    "Version": "0.1.0",
    "Language": "javascript",
    "Website": "https://github.com/chernyh39157/map-paste",
    "ExecuteFileName": "main.js",
    "IcoPath": "Images\\app.png"
}
```

Important:

- Generate a stable unique plugin ID.
- Do not leave placeholder text in `plugin.json`.
- If you use SVG successfully, set `IcoPath` accordingly. If unsure, create a PNG and use `Images\\app.png`.
- Keep version aligned with `package.json`.

## SettingsTemplate.yaml

Create plugin settings with only useful v1 settings:

```yaml
body:
  - type: checkbox
    attributes:
      name: appendDefaultLocation
      label: Append default location
      description: Append the default location to searches when it is not already present.
      defaultValue: false

  - type: input
    attributes:
      name: defaultLocation
      label: Default location
      description: Example: Barcelona. Used only when "Append default location" is enabled.
      defaultValue: ""

  - type: input
    attributes:
      name: appNameForUtm
      label: App name for URL attribution
      description: Used as the utm_source value in generated Google Maps URLs.
      defaultValue: "map-paste"
```

Do not add too many settings in v1.

## Core behavior

### Empty query

When the user types only:

```text
mp
```

Return a helpful Flow result:

```text
Title: Paste or type a Google Maps search
Subtitle: Example: mp coffee near Sagrada Familia Barcelona
```

This result should not attempt to open anything.

### Normal query

When the user types:

```text
mp flower shop near Carrer del Camp 69 Barcelona
```

Return one main result:

```text
Title: Open in Google Maps
Subtitle: flower shop near Carrer del Camp 69 Barcelona
```

On Enter, open:

```text
https://www.google.com/maps/search/?api=1&query=flower%20shop%20near%20Carrer%20del%20Camp%2069%20Barcelona&utm_source=map-paste&utm_campaign=maps_search
```

The exact parameter order may differ. That is fine.

### Query normalization

Normalize pasted text carefully:

- Trim leading and trailing whitespace.
- Replace repeated whitespace and newlines with a single space.
- Preserve meaningful punctuation.
- Do not over-process addresses.
- Do not lowercase the user's input.
- Do not remove accents or non-ASCII characters.
- Let `URLSearchParams` or `encodeURIComponent` handle encoding.

Examples:

```text
"  flower   shop\nnear   Barcelona  "
```

should become:

```text
"flower shop near Barcelona"
```

### Default location behavior

If `appendDefaultLocation` is true and `defaultLocation` is non-empty:

```text
Input query: flower shop
Default location: Barcelona
Effective query: flower shop Barcelona
```

But avoid appending if the query already contains the default location case-insensitively:

```text
Input query: flower shop Barcelona
Default location: Barcelona
Effective query: flower shop Barcelona
```

Keep this logic simple. Do not try to detect every possible location.

## Source files

### src/constants.js

Define shared constants:

```js
const PLUGIN_NAME = 'MapPaste';
const PLUGIN_SLUG = 'map-paste';
const ICON_PATH = 'Images\\app.png';
const DEFAULT_UTM_CAMPAIGN = 'maps_search';

module.exports = {
    PLUGIN_NAME,
    PLUGIN_SLUG,
    ICON_PATH,
    DEFAULT_UTM_CAMPAIGN,
};
```

If you decide to use SVG in `plugin.json`, keep constants consistent.

### src/query.js

Implement:

```js
function normalizeQuery(value) {}
function getQueryFromParameters(parameters) {}
```

`getQueryFromParameters` should handle likely Flow Launcher JSON-RPC input shapes safely:

- array of strings
- single string
- null or undefined

Return a normalized string.

### src/settings.js

Implement helpers:

```js
function getBooleanSetting(settings, name, defaultValue) {}
function getStringSetting(settings, name, defaultValue) {}
function buildEffectiveQuery(query, settings) {}
```

Keep this defensive. Settings may be missing.

### src/maps-url.js

Implement:

```js
function buildGoogleMapsSearchUrl(query, settings = {}) {}
```

Requirements:

- Throw a clear error if `query` is empty after normalization.
- Use `URLSearchParams`.
- Always include `api=1`.
- Always include `query=<effective query>`.
- Include `utm_source`, defaulting to `map-paste`.
- Include `utm_campaign=maps_search`.

### src/flow-response.js

Implement small helpers for Flow Launcher results:

```js
function createInfoResult(title, subtitle) {}
function createOpenMapsResult(query, url) {}
function createErrorResult(error) {}
function writeResponse(result) {}
```

`writeResponse` should output:

```js
console.log(JSON.stringify({ result }));
```

The result object should include:

- `Title`
- `Subtitle`
- `IcoPath`
- `score`

For the open action, include:

```js
JsonRPCAction: {
    method: 'open_maps',
    parameters: [url]
}
```

### main.js

Implement the JSON-RPC entry point.

Expected behavior:

```text
method === "query"
    -> parse query
    -> if empty, return info result
    -> else build effective query and URL
    -> return "Open in Google Maps" result

method === "open_maps"
    -> open URL in default browser

unknown method
    -> return helpful error result
```

Be defensive:

- Wrap main execution in `try/catch`.
- If an error occurs during query handling, return a Flow error result.
- If an error occurs during `open_maps`, also return or log a useful error.
- Do not crash with an unhandled promise rejection.

Opening URLs:

Prefer:

```js
async function openUrl(url) {
    const { default: open } = await import('open');
    await open(url);
}
```

This should work even if the `open` package is ESM-only.

## Tests

Use Node's built-in test runner.

Create tests for:

### maps-url.test.js

Cover:

1. Basic query.
2. Query with spaces.
3. Query with non-ASCII characters, for example `Park Güell`.
4. Empty query throws.
5. URL contains `api=1`.
6. URL contains `query`.
7. URL contains `utm_source`.
8. URL contains `utm_campaign`.

### query.test.js

Cover:

1. Trimming.
2. Collapsing repeated spaces.
3. Collapsing newlines.
4. Handling array parameters.
5. Handling null/undefined.
6. Preserving case.
7. Preserving accented characters.

Run:

```bash
npm test
```

## README.md

Create a useful README with:

1. Project title: `MapPaste`.
2. One-sentence description.
3. Screenshot placeholder section, if there is no screenshot yet.
4. Usage:

```text
mp coffee near Sagrada Familia Barcelona
mp flower shop near Carrer del Camp 69 Barcelona
mp Park Güell
```

5. Settings explanation.
6. Installation for local development.
7. Development commands:

```bash
npm install
npm test
npm run format
```

8. Note that MapPaste uses Google Maps URLs and does not require a Google Maps API key.
9. Privacy note:

```text
MapPaste does not call any backend service. It only builds a Google Maps URL and opens it in your browser.
```

10. License placeholder. Use `MIT` if you create a `LICENSE` file, otherwise say license is not decided yet.

## .gitignore

Create a normal Node.js `.gitignore`:

```gitignore
node_modules/
npm-debug.log*
.DS_Store
Thumbs.db
dist/
coverage/
```

Do not ignore `package-lock.json`.

## Icon

Create a simple, readable icon.

Preferred concept:

- A map pin.
- A small paste/clipboard shape.
- Keep it simple and recognizable at small size.

If you create SVG manually, also generate PNG if possible. Use a simple local method if available. If PNG generation is not available without adding heavy dependencies, keep SVG and document that the icon may need replacement if Flow Launcher does not display it.

Do not spend too much time on the icon. Functionality matters more.

## Git workflow

At the start:

```bash
git status
```

If this is not a git repo, initialize it:

```bash
git init
```

After implementation:

1. Run formatting.
2. Run tests.
3. Check `git status`.
4. Commit all files.

Suggested first commit message:

```text
Initial MapPaste Flow Launcher plugin
```

## Validation checklist

Before finishing, verify:

- `npm install` works.
- `npm test` passes.
- `npm run format:check` passes.
- `plugin.json` has no placeholders.
- `package.json` has no placeholders.
- `README.md` is accurate.
- `main.js` can be run with a simulated Flow query.

Example local simulation:

```bash
node main.js "{\"method\":\"query\",\"parameters\":[\"coffee near Barcelona\"],\"settings\":{}}"
```

Expected output should be valid JSON with a `result` array and a `JsonRPCAction`.

Also simulate empty query:

```bash
node main.js "{\"method\":\"query\",\"parameters\":[\"\"]}"
```

Expected output should be a helpful instruction result.

Also simulate open action only if it is safe on the local machine:

```bash
node main.js "{\"method\":\"open_maps\",\"parameters\":[\"https://www.google.com/maps/search/?api=1&query=coffee%20Barcelona\"]}"
```

## Scope control

Do not implement these in v1:

- Directions syntax.
- Multiple map providers.
- Google Places autocomplete.
- Google Maps API calls.
- Geocoding.
- Search result previews.
- Ratings or opening hours.
- Browser extension.
- GUI outside Flow Launcher.
- Telemetry.
- Backend service.
- Build/bundling pipeline.

Keep v1 simple and reliable.

## Final response from the local agent

When done, report:

1. Files created.
2. Commands run.
3. Test results.
4. Formatting result.
5. Git commit hash.
6. Any known limitations or manual steps, especially around Flow Launcher installation and icon display.
