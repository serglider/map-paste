# Flow Launcher submission notes for MapPaste

## Plugin

MapPaste

## Repository

https://github.com/serglider/map-paste

## Description

Search Google Maps from pasted text.

## Action keyword

`mp`

## Plugin type

JavaScript / Node.js

## License

MIT

## Privacy

MapPaste does not call any backend service, does not use telemetry, and does not require a Google Maps API key. It only builds a Google Maps URL and opens it in the user's default browser.

## Release asset

Use the latest GitHub Release zip:

`map-paste-vX.Y.Z.zip`

## Manifest entry fields

The current Flow Launcher PluginsManifest submission instructions ask for a file named `${name}-${uuid}.json` in the `plugins` directory. Copy these values from MapPaste's `plugin.json`:

- `ID`
- `Name`
- `Description`
- `Author`
- `Version`
- `Language`
- `Website`

Then add:

- `UrlDownload`
- `UrlSourceCode`
- `IcoPath`

Current useful values after the release workflow publishes the latest version:

```json
{
    "ID": "3361362c-97e0-46f3-9461-31d24975f0a9",
    "Name": "MapPaste",
    "Description": "Search Google Maps from pasted text",
    "Author": "Sergey Chernykh",
    "Version": "0.1.3",
    "Language": "javascript",
    "Website": "https://github.com/serglider/map-paste",
    "UrlDownload": "https://github.com/serglider/map-paste/releases/download/v0.1.3/map-paste-v0.1.3.zip",
    "UrlSourceCode": "https://github.com/serglider/map-paste",
    "IcoPath": "https://cdn.jsdelivr.net/gh/serglider/map-paste@master/Images/app.png"
}
```

Do not add category or keyword fields unless the current Flow Launcher PluginsManifest schema adds support for them.

## Manual verification

- `npm test` passes.
- `npm run format:check` passes.
- Manual Flow Launcher install works.
- Query `mp coffee near Barcelona` opens Google Maps.
- Release zip contains `plugin.json` inside the `map-paste` plugin folder.
- Release zip does not contain `node_modules`.

## Submission timing

Submit to the official Flow Launcher PluginsManifest after the protected `master` merge creates the latest GitHub Release. At the time these notes were prepared, `dev` contains the `0.1.3` release candidate and PR #1 is expected to trigger the `v0.1.3` release after merge.

## Current submission process to verify before PR

Before making an official submission, re-check:

https://github.com/Flow-Launcher/Flow.Launcher.PluginsManifest

As of the latest check, the process is:

1. Create a plugin manifest file in the upstream `plugins` directory.
2. Include the required metadata fields and CDN icon URL.
3. Ensure an automated build and release workflow exists.
4. Ensure the plugin conforms to the Plugin Store policy.
5. Submit a pull request to the upstream default branch.
