export type ProviderAdapter = {
  id: 'youtube-music' | 'jiosaavn';
  name: string;
  role: 'metadata_search' | 'metadata_and_authorized_audio';
  searchPlaceholder: string;
  filters: string[];
  officialUrl: string;
  sourceRepository: string;
  status: 'ready_for_authorized_connection' | 'metadata_surface_ready';
};

/**
 * Provider contracts are intentionally kept separate from the UI. The upstream
 * SpotiFLAC manifests describe capabilities and permissions; Freq Music does
 * not copy their packaged stream-download code or provider credentials.
 */
export const providerAdapters: ProviderAdapter[] = [
  {
    id: 'youtube-music',
    name: 'YouTube Music',
    role: 'metadata_and_authorized_audio',
    searchPlaceholder: 'Search YouTube Music…',
    filters: ['Songs', 'Albums', 'Artists', 'Playlists'],
    officialUrl: 'https://music.youtube.com',
    sourceRepository: 'SpotiFLAC Extension · ytmusic-spotiflac',
    status: 'ready_for_authorized_connection',
  },
  {
    id: 'jiosaavn',
    name: 'JioSaavn',
    role: 'metadata_search',
    searchPlaceholder: 'Search JioSaavn…',
    filters: ['Songs', 'Albums', 'Artists'],
    officialUrl: 'https://www.jiosaavn.com',
    sourceRepository: 'SpotiFLAC Extension · jiosaavn',
    status: 'metadata_surface_ready',
  },
];

export const providerAttribution =
  'Provider capability labels informed by SpotiFLAC Extension manifests; see docs/UPSTREAM_NOTES.md.';
