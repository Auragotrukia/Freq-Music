export type AudioQuality = 'DOLBY_ATMOS' | 'HI_RES_FLAC_24' | 'LOSSLESS_FLAC_16' | 'AAC_DATA_SAVER';

export type Provider = {
  id: string;
  name: string;
  capabilities: Array<'metadata' | 'stream' | 'download' | 'lyrics' | 'atmos' | 'hiResFlac'>;
  connected: boolean;
};

export const providers: Provider[] = [
  { id: 'tidal', name: 'TIDAL', capabilities: ['metadata', 'stream', 'download', 'lyrics', 'atmos', 'hiResFlac'], connected: true },
  { id: 'qobuz', name: 'Qobuz', capabilities: ['metadata', 'stream', 'download', 'lyrics', 'hiResFlac'], connected: false },
  { id: 'spotify', name: 'Spotify', capabilities: ['metadata'], connected: false },
  { id: 'ytmusic', name: 'YouTube Music', capabilities: ['metadata', 'stream', 'lyrics'], connected: false },
];

export function resolveFallback(requested: AudioQuality, supported: AudioQuality[]): AudioQuality {
  if (supported.includes(requested)) return requested;
  if (requested === 'DOLBY_ATMOS' && supported.includes('HI_RES_FLAC_24')) return 'HI_RES_FLAC_24';
  if (supported.includes('LOSSLESS_FLAC_16')) return 'LOSSLESS_FLAC_16';
  return 'AAC_DATA_SAVER';
}

export function buildDiscordPresence(track: { title: string; artist: string; album: string }, options: { showArtwork: boolean; showProgress: boolean }) {
  return {
    details: track.title,
    state: `${track.artist} · ${track.album}`,
    largeImageKey: options.showArtwork ? 'album-art' : 'freq-mark',
    buttons: ['Open in Freq', 'View album'],
    showProgress: options.showProgress,
  };
}
