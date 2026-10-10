# Freq Music

A dark, hi-fi music client for Android and iOS, inspired by the public Echo Music, BitChord, and SpotiFLAC Extension feature sets.

## Run locally

```bash
pnpm install
pnpm start
# press w for web preview, or scan the Expo QR with Expo Go
pnpm android
pnpm ios
```

> iOS native builds require macOS/Xcode; Expo Go can preview the app on iOS from a non-Mac development machine.

## Included product surfaces

- Home discovery, charts/moods-style entry points, recommendations, queue actions, likes, playlists and offline library surface
- Full now-playing card with Canvas-style motion-art direction, crossfade controls and animated progress treatment
- Quality selector for Dolby Atmos, 24-bit Hi-Res FLAC, 16-bit lossless FLAC and data saver fallback behavior
- Word-synced lyrics / translation / Music DNA / recognition entry-point direction in the player architecture
- Discord Rich Presence customization surface, Last.fm / ListenBrainz scrobble controls, and provider connections
- Extension manager surface for Spotify, TIDAL, Qobuz, YouTube Music and other SpotiFLAC-style providers
- Settings for equalizer integration, bit-perfect output, sleep timer, skip silence, playback speed, data saver, UI feel and smart playback
- Portrait-first, one-handed navigation with Home / Search / Library / Settings tabs
- Listen Together flow with create/join room codes, participant presence, synchronized playback status, room activity chat, leave action, and local join/leave chimes

## Important implementation boundary

This repository is a functional UI and interaction prototype. Live playback, provider authentication, DRM-safe FLAC/Atmos manifests, downloads, background media sessions, native equalizer/ringtone APIs, Discord OAuth, and platform-specific audio routing should be connected through user-authorized service adapters before production distribution. The UI labels connected providers and unavailable integrations explicitly rather than pretending third-party credentials exist.

## Source inspiration

The feature inventory was mapped from:

- https://github.com/EchoMusicApp/Echo-Music
- https://github.com/kushagrasinghx/BitChord
- https://github.com/spotiflacapp/spotiflac-extension

Do not copy third-party branding or bypass provider terms. Use licensed/user-authorized streams and comply with each service's policies.
