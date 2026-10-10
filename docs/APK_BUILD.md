# Android APK build

The repository is configured for an installable preview APK through EAS Build.

## Build from a machine with Expo/EAS credentials

```bash
pnpm install
npx eas-cli@latest login
npx eas-cli@latest build:configure
npx eas-cli@latest build --platform android --profile preview
```

The `preview` profile uses `distribution: internal` and `android.buildType: apk`. EAS returns a downloadable APK URL when the remote build completes.

## Why this Sandbox did not produce the binary

This plain-local Sandbox has no Android SDK/Gradle installation and no Expo account token. A binary build requires either:

- a local Android SDK + Java/Gradle toolchain, or
- authenticated EAS Build access.

Do not add Expo tokens or provider credentials to the repository.

## Scope note

Freq Music currently delivers a feature-rich cross-platform UI prototype and integration seams. Full production parity with Echo Music, BitChord, and SpotiFLAC requires user-authorized provider adapters for streaming, DRM-safe FLAC/Atmos manifests, native background media sessions, offline downloads, lyrics providers, Discord OAuth/RPC, scrobbling, local media access, equalizer/ringtone APIs, and extension execution. Those capabilities cannot be truthfully shipped as live features without their service credentials and native modules.
