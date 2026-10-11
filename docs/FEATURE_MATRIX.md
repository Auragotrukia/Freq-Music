# Freq Music feature matrix

| Area | UI delivered | Production adapter needed |
| --- | --- | --- |
| Discovery | 12-track searchable local catalog, title/artist/album matching, home recommendations, tags, track rows | Authorized catalog/search API and recommendation history |
| Playback | Bundled offline demo audio, working play/pause, selectable tracks, now playing, queue affordances | Provider stream resolver, native media session, background controls, gapless/crossfade |
| Quality | Dolby Atmos / 24-bit / lossless selector and fallback copy | Provider manifest resolver with legal credentials and device capability checks |
| Canvas | Motion-art state and live Canvas badge | Provider Canvas/animated artwork URL + low-power playback policy |
| Lyrics | Lyrics entry-point direction in settings and player design | LRC/word-timestamp provider, translation service, cache |
| Library | Likes, playlists, downloads/local music surfaces | Database, device storage, metadata tagging, download manager |
| Presence | Discord Rich Presence toggle and custom-card entry point | Discord OAuth/RPC bridge and native background lifecycle |
| Scrobbling | Last.fm/ListenBrainz controls | OAuth tokens, 50% play threshold, retry queue |
| Sources | Provider cards and extension manager entry point | Signed extension registry, source health checks, provider adapters |
| Listen Together | Create/join/leave room UI, participant list, room activity chat, sync status, join/leave chimes | WebSocket room service, host election, clock drift correction, provider playback authorization |
| Audio tools | Bit-perfect, Atmos fallback, data saver, sleep timer, smart playback | Native audio route/equalizer APIs and per-network policy |
