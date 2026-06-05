# MapPaste

A Flow Launcher plugin that opens pasted text as a Google Maps search.

## Usage

Open Flow Launcher and type:

```text
mp coffee near Barcelona
mp flower shop near Carrer del Camp 69 Barcelona
mp Park Güell
```

Choose **Open in Google Maps** and press Enter. MapPaste opens a standard Google Maps
search URL in your default browser.

## Settings

- **Append default location**: Adds the default location to searches when it is not already present.
- **Default location**: The location to append, for example `Barcelona`.
- **App name for URL attribution**: Used as the `utm_source` value in generated URLs.

## Local Installation

MapPaste requires Node.js 20 or newer.

Copy or install the plugin into Flow Launcher's plugins folder and restart Flow Launcher.

For local development, the folder should be placed at:

```text
%APPDATA%\FlowLauncher\Plugins\Flow.Launcher.Plugin.MapPaste
```

Then install development dependencies:

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
