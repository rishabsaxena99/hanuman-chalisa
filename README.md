# Hanuman Chalisa

An immersive devotional website with the complete 43 Hanuman Chalisa verse units, Devanagari text, Roman transliteration, English meanings, an animated Hanumanji portrait, and a translucent glass audio player.

## Run locally

Open `index.html` in a modern browser, or run:

```sh
python3 -m http.server 8766 --bind 127.0.0.1
```

Then visit http://127.0.0.1:8766. No npm installation or build step is required. HTML, CSS and JavaScript are in `index.html`; media stays in `audio/` and `images/`.

## Features

- Play/pause, seek, volume, playback speed, repeat and ambient mode.
- Click a verse to seek, automatic following, and manual-scroll override.
- Toggle Roman transliteration and English meanings.
- Audio-reactive portrait/glow on HTTP; gentle breathing fallback for direct file playback.
- Calibration with 43 taps, undo, browser persistence, JSON copy, import and download.
- Responsive layout, keyboard controls, reduced-motion support and WebGL/audio fallbacks.

## Timing status

**The bundled verse timings are placeholders. Exact synchronization to the supplied recording is not finished.** Playback and timing-engine tests pass, but this is not a claim that the highlighted verse matches the singing accurately.

To calibrate: press C or open settings, start calibration over, play the recording, and tap Space when each verse starts. Backspace undoes the previous mark. Download `timings.json` beside `index.html`. When opening with `file://`, use Import timings JSON; on HTTP it loads automatically. Browser-saved calibration takes precedence.

## Verification

Run `node verification/check.cjs` if Node is installed (Node is only needed for tests). Checks cover 43 complete units, timing validation across five durations, boundary searches, seeks, calibration completion/undo, persistence, invalid marking, animation bounds and reduced motion.

Browser checks on 1280×800 desktop and 360×800 mobile verified the layout, portrait, player controls, seeking and toggles. Calibration JSON download was also verified on disk. This does not guarantee every browser/device is bug-free.

## Hosting

Upload `index.html`, `favicon.svg`, `audio/`, and `images/` to a static host, preserving their paths. Include `timings.json` after calibration. This repository does not automatically publish the website.

Three.js and Google Fonts are loaded from CDNs. The reading UI has local fallbacks. The supplied MP3 is approximately 9 minutes 46 seconds; the portrait is AI-generated devotional artwork.

## Tuning

Use the `CONFIG` object in `index.html` for colors, verse size, portrait motion, particle intensity and follow behavior.
