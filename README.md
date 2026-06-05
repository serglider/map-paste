# MapPaste

MapPaste is a Flow Launcher plugin that searches Google Maps from pasted text.

## Screenshot

Screenshot coming soon.

## Usage

Open Flow Launcher and type:

```text
mp coffee near Sagrada Familia Barcelona
mp flower shop near Carrer del Camp 69 Barcelona
mp Park Güell
```

Choose **Open in Google Maps** and press Enter. MapPaste opens a standard Google Maps
search URL in your default browser.

## Settings

- **Append default location**: Adds the default location to searches when it is not
  already present.
- **Default location**: The location to append, for example `Barcelona`.
- **App name for URL attribution**: Used as the `utm_source` value in generated URLs.

## Local Installation

MapPaste requires Node.js 20 or newer for the currently installed `open` package.

1. Copy or clone this folder into your Flow Launcher plugins directory as
   `Flow.Launcher.Plugin.MapPaste`.
2. Install dependencies:

    ```bash
    npm install
    ```

3. Restart Flow Launcher or reload plugins.
4. Use the default action keyword `mp`.

## Development

```bash
npm install
npm test
npm run format
```

To simulate a Flow Launcher query locally:

```powershell
cd C:\Users\s-che\Projects\map-paste
node .\main.js '{"method":"query","parameters":["coffee near Barcelona"],"settings":{}}'
```

If you are in another directory, pass the full path to `main.js`:

```powershell
node C:\Users\s-che\Projects\map-paste\main.js '{"method":"query","parameters":["coffee near Barcelona"],"settings":{}}'
```

## Google Maps URLs

MapPaste uses normal Google Maps search URLs:

```text
https://www.google.com/maps/search/?api=1&query=<encoded query>
```

It does not use the Google Maps SDK, Google Maps JavaScript API, Places API,
Geocoding API, Routes API, or any Google Maps Platform API key.

## Privacy

MapPaste does not call any backend service. It only builds a Google Maps URL and
opens it in your browser.

## License

License is not decided yet.
