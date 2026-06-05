# MapPaste

A Flow Launcher plugin that opens pasted text as a Google Maps search.

## Usage

Open Flow Launcher and type:

```text
mp coffee near me
mp flower shop near me
mp Park Güell
```

Choose **Open in Google Maps** and press Enter. MapPaste opens a standard Google Maps
search URL in your default browser.

## Settings

- **Append default location**: Adds the default location to searches when it is not already present.
- **Default location**: The location to append, for example `Paris`.
- **App name for URL attribution**: Used as the `utm_source` value in generated URLs.

## Local Installation

MapPaste requires Node.js 20 or newer.

Copy or install the plugin into Flow Launcher's plugins folder and restart Flow Launcher.

For local development, run:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\install-local.ps1
```

This installs the plugin into:

```text
%APPDATA%\FlowLauncher\Plugins\map-paste
```

Restart Flow Launcher after manifest changes such as edits to `plugin.json`.

To install development dependencies:

```bash
npm install
```

## Development

```bash
npm install
npm test
npm run format
```

To simulate a Flow Launcher query locally:

```powershell
node .\main.js '{"method":"query","parameters":["coffee near Barcelona"],"settings":{}}'
```

## Distribution

The release package does not include `node_modules` because MapPaste has no runtime npm
dependencies.

To create a release package:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\package-release.ps1
```

### Manual Release Installation

1. Download `map-paste-vX.Y.Z.zip` from GitHub Releases.
2. Extract the `map-paste` folder into `%APPDATA%\FlowLauncher\Plugins`.
3. Restart Flow Launcher.
4. Type `mp coffee near Barcelona`.

## Google Maps URLs

MapPaste uses normal Google Maps search URLs:

```text
https://www.google.com/maps/search/?api=1&query=<encoded query>
```

It does not use the Google Maps SDK, Google Maps JavaScript API, Places API, Geocoding API,
Routes API, or any Google Maps Platform API key.

## Privacy

MapPaste does not call any backend service, does not use telemetry, and does not require a
Google Maps API key. It only builds a Google Maps URL and opens it in the default browser.

## License

MIT
