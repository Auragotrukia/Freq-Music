import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import ListenTogether from './src/components/ListenTogether';
import { useAudioPlayer } from 'expo-audio';
import { Animated, Easing, Linking } from 'react-native';
import { providerAdapters } from './src/services/providerAdapters';
import {
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

const colors = {
  ink: '#090B10',
  panel: '#11151D',
  panel2: '#171D27',
  line: '#293140',
  text: '#F4F7FB',
  muted: '#8A96A8',
  cyan: '#8BE9FD',
  lime: '#B8F38B',
  peach: '#FFB38B',
  purple: '#B8A7FF',
};

const tracks = [
  { id: '1', title: 'Midnight City', artist: 'M83', album: 'Hurry Up, We’re Dreaming', duration: '4:03', art: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=900', quality: '24-bit / 96 kHz', badge: 'ATMOS', audio: require('./assets/demo-1.wav') },
  { id: '2', title: 'Neon Rain', artist: 'Freq Studio', album: 'Night Drive', duration: '3:42', art: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=800', quality: 'FLAC 24-bit', badge: 'HI-RES', audio: require('./assets/demo-2.wav') },
  { id: '3', title: 'Kerala', artist: 'Bonobo', album: 'Migration', duration: '3:49', art: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800', quality: 'FLAC 16-bit', badge: 'LOSSLESS', audio: require('./assets/demo-3.wav') },
  { id: '4', title: 'A Walk', artist: 'Tycho', album: 'Dive', duration: '5:18', art: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800', quality: 'FLAC 24-bit', badge: 'HI-RES', audio: require('./assets/demo-4.wav') },
  { id: '5', title: 'Afterglow', artist: 'Freq Studio', album: 'Soft Signals', duration: '4:12', art: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800', quality: 'FLAC 24-bit', badge: 'HI-RES', audio: require('./assets/demo-5.wav') },
  { id: '6', title: 'Low Light', artist: 'Freq Studio', album: 'Soft Signals', duration: '3:28', art: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800', quality: 'FLAC 16-bit', badge: 'LOSSLESS', audio: require('./assets/demo-6.wav') },
  { id: '7', title: 'Parallel Lines', artist: 'The xx', album: 'xx', duration: '2:55', art: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800', quality: 'FLAC 24-bit', badge: 'HI-RES', audio: require('./assets/demo-7.wav') },
  { id: '8', title: 'Golden Hour', artist: 'Freq Studio', album: 'Sunset Radio', duration: '4:20', art: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800', quality: 'FLAC 16-bit', badge: 'LOSSLESS', audio: require('./assets/demo-8.wav') },
  { id: '9', title: 'Static Bloom', artist: 'Freq Studio', album: 'Night Drive', duration: '3:16', art: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?w=800', quality: 'FLAC 24-bit', badge: 'HI-RES', audio: require('./assets/demo-9.wav') },
  { id: '10', title: 'Tides', artist: 'Bonobo', album: 'Migration', duration: '5:01', art: 'https://images.unsplash.com/photo-1507527453650-8d0c5a1a5e3d?w=800', quality: 'FLAC 16-bit', badge: 'LOSSLESS', audio: require('./assets/demo-10.wav') },
  { id: '11', title: 'Blue Hour', artist: 'Freq Studio', album: 'After Dark', duration: '3:37', art: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=800', quality: 'FLAC 24-bit', badge: 'HI-RES', audio: require('./assets/demo-11.wav') },
  { id: '12', title: 'Open Roads', artist: 'Tycho', album: 'Dive', duration: '4:48', art: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800', quality: 'FLAC 16-bit', badge: 'LOSSLESS', audio: require('./assets/demo-12.wav') },
];

const providers = [
  { name: 'TIDAL', desc: 'Dolby Atmos + Hi-Res FLAC', action: 'Connected', tone: colors.cyan, url: 'https://tidal.com' },
  { name: 'QOBUZ', desc: '24-bit / 192 kHz', action: 'Connect', tone: colors.peach, url: 'https://www.qobuz.com' },
  { name: 'SPOTIFY', desc: 'Metadata + playlists', action: 'Connect', tone: colors.lime, url: 'https://open.spotify.com' },
  { name: 'YOUTUBE MUSIC', desc: 'Search + authorized audio adapter', action: 'Open / connect', tone: colors.purple, url: providerAdapters[0].officialUrl },
  { name: 'JIOSAAVN', desc: 'Catalog search + metadata adapter', action: 'Open / connect', tone: colors.peach, url: providerAdapters[1].officialUrl },
];

function Chip({ children, tone = 'cyan' }: { children: React.ReactNode; tone?: keyof typeof colors }) {
  return <View style={[styles.chip, { borderColor: colors[tone] + '55', backgroundColor: colors[tone] + '14' }]}><Text style={[styles.chipText, { color: colors[tone] }]}>{children}</Text></View>;
}

function IconButton({ label, onPress, active = false }: { label: string; onPress?: () => void; active?: boolean }) {
  return <Pressable onPress={onPress} style={[styles.iconButton, active && styles.iconButtonActive]}><Text style={styles.iconText}>{label}</Text></Pressable>;
}

export default function App() {
  const [tab, setTab] = useState('Home');
  const [playing, setPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const audioPlayer = useAudioPlayer(tracks[0].audio);
  const canvasPulse = useRef(new Animated.Value(1)).current;
  const [liked, setLiked] = useState(false);
  const [qualityOpen, setQualityOpen] = useState(false);
  const [quality, setQuality] = useState('Dolby Atmos');
  const [query, setQuery] = useState('');
  const [presence, setPresence] = useState(true);
  const [canvas, setCanvas] = useState(true);
  const [scrobble, setScrobble] = useState(true);
  const [toast, setToast] = useState('');

  const current = tracks[currentTrack];
  const filteredTracks = useMemo(() => { const q = query.trim().toLowerCase(); return tracks.filter(t => !q || `${t.title} ${t.artist} ${t.album}`.toLowerCase().includes(q)); }, [query]);
  useEffect(() => { const loop = Animated.loop(Animated.sequence([Animated.timing(canvasPulse, { toValue: 1.18, duration: 520, easing: Easing.inOut(Easing.sin), useNativeDriver: true }), Animated.timing(canvasPulse, { toValue: .82, duration: 520, easing: Easing.inOut(Easing.sin), useNativeDriver: true })])); loop.start(); return () => loop.stop(); }, [canvasPulse]);
  const selectTrack = (index: number) => { setCurrentTrack(index); try { audioPlayer.replace(tracks[index].audio); audioPlayer.play(); } catch {} setPlaying(true); };
  const togglePlayback = () => { try { playing ? audioPlayer.pause() : audioPlayer.play(); } catch {} setPlaying(!playing); };
  const notify = (message: string) => { setToast(message); setTimeout(() => setToast(''), 2200); };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <View style={styles.shell}>
        <View style={styles.topBar}>
          <View style={styles.wordmark}><View style={styles.wordmarkMark}><Text style={styles.wordmarkPulse}>∿</Text></View><Text style={styles.wordmarkText}>freq</Text></View>
          <View style={styles.topActions}><Chip tone="lime">ONLINE</Chip><IconButton label="⌕" onPress={() => setTab('Search')} /><IconButton label="◉" onPress={() => notify('Account menu coming next')} /></View>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {tab === 'Home' && <>
            <View style={styles.heroRow}><View><Text style={styles.eyebrow}>YOUR DAILY FREQUENCY</Text><Text style={styles.heroTitle}>Good evening, Alex.</Text><Text style={styles.heroSub}>A little signal for the ride home.</Text></View><View style={styles.avatar}><Text style={styles.avatarText}>A</Text></View></View>
            <View style={styles.nowPlayingCard}>
              <Image source={{ uri: current.art }} style={styles.heroArt} />
              <View style={styles.heroOverlay} />
              {canvas && <View style={styles.canvasVisualizer}>{[.45,.8,1.2,.65,1,.55,.9,.4].map((height, i) => <Animated.View key={i} style={[styles.canvasBar, { height: 34 * height, transform: [{ scaleY: canvasPulse }] }]} />)}</View>}
              <View style={styles.heroMeta}><View style={styles.heroPills}><Chip tone="cyan">{quality}</Chip><Chip tone="peach">{canvas ? 'CANVAS LIVE' : 'STILL ART'}</Chip></View><Text style={styles.heroTrack}>{current.title}</Text><Text style={styles.heroArtist}>{current.artist} · {current.album}</Text><View style={styles.progressTrack}><View style={styles.progressFill} /></View><View style={styles.progressLabels}><Text style={styles.miniText}>1:42</Text><Text style={styles.miniText}>4:03</Text></View><View style={styles.playerControls}><IconButton label="↶" /><IconButton label="◀" /><Pressable style={styles.playButton} onPress={togglePlayback}><Text style={styles.playText}>{playing ? 'Ⅱ' : '▶'}</Text></Pressable><IconButton label="▶" /><IconButton label="↷" active /></View></View>
            </View>
            <ListenTogether />
            <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Made for your signal</Text><Text style={styles.link}>See all</Text></View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalRow}>{tracks.slice(1, 7).map((track, i) => <Pressable key={track.id} style={styles.mixCard} onPress={() => selectTrack(tracks.findIndex(x => x.id === track.id))}><Image source={{ uri: track.art }} style={styles.mixArt} /><Text style={styles.mixTitle}>{['Late night / low light', 'Focus, but make it warm', 'Sunday in slow motion'][i]}</Text><Text style={styles.mixMeta}>{track.artist} · {track.quality}</Text></Pressable>)}</ScrollView>
            <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Tonight’s constellation</Text><Chip tone="purple">NEW RELEASES</Chip></View>
            <View style={styles.trackList}>{filteredTracks.map(track => <TrackRow key={track.id} track={track} liked={liked} onLike={() => setLiked(!liked)} onPress={() => selectTrack(tracks.findIndex(x => x.id === track.id))} />)}</View>
          </>}

          {tab === 'Search' && <><Text style={styles.eyebrow}>DISCOVER</Text><Text style={styles.pageTitle}>Find your next frequency.</Text><TextInput value={query} onChangeText={setQuery} placeholder="Search tracks, albums, artists…" placeholderTextColor={colors.muted} style={styles.searchInput} autoFocus /><View style={styles.searchTags}>{['Charts', 'Moods', 'Podcasts', 'Genres', 'New releases'].map(x => <Chip key={x} tone={x === 'Charts' ? 'lime' : 'cyan'}>{x}</Chip>)}</View><Text style={styles.sectionTitle}>{filteredTracks.length} results</Text><View style={styles.trackList}>{filteredTracks.map(track => <TrackRow key={track.id} track={track} liked={liked} onLike={() => setLiked(!liked)} onPress={() => selectTrack(tracks.findIndex(x => x.id === track.id))} />)}</View></>}

          {tab === 'Library' && <><Text style={styles.eyebrow}>YOUR LIBRARY</Text><Text style={styles.pageTitle}>Saved in the quiet.</Text><View style={styles.libraryStats}><Stat value="18" label="PLAYLISTS" /><Stat value="246" label="LIKED SONGS" /><Stat value="42 GB" label="OFFLINE" /></View><View style={styles.libraryTabs}><Chip tone="cyan">Playlists</Chip><Chip tone="purple">Downloads</Chip><Chip tone="peach">Local music</Chip></View><View style={styles.playlistCard}><View style={styles.playlistArt}><Text style={styles.playlistGlyph}>✦</Text></View><View style={{ flex: 1 }}><Text style={styles.trackTitle}>Night Drive / 24-bit</Text><Text style={styles.trackMeta}>42 tracks · 3h 16m · Offline ready</Text></View><Text style={styles.chevron}>›</Text></View><View style={styles.playlistCard}><View style={[styles.playlistArt, { backgroundColor: colors.purple + '30' }]}><Text style={styles.playlistGlyph}>◌</Text></View><View style={{ flex: 1 }}><Text style={styles.trackTitle}>The long way home</Text><Text style={styles.trackMeta}>18 tracks · mixed sources</Text></View><Text style={styles.chevron}>›</Text></View></>}

          {tab === 'Settings' && <><Text style={styles.eyebrow}>SYSTEM / AUDIO / PRESENCE</Text><Text style={styles.pageTitle}>Tune the room.</Text><SettingsSection title="Audio fidelity"><SettingRow title="Preferred quality" detail={quality} onPress={() => setQualityOpen(true)} /><SettingRow title="Bit-perfect output" detail="24-bit when hardware supports it" toggle /><SettingRow title="Crossfade" detail="4 seconds" /><SettingRow title="Dolby Atmos" detail="Auto fallback to Hi-Res FLAC" toggle /></SettingsSection><SettingsSection title="Presence & history"><SettingRow title="Discord Rich Presence" detail="Show Freq card + progress" value={presence} onToggle={setPresence} toggle /><SettingRow title="Last.fm / ListenBrainz" detail="Scrobble after 50%" value={scrobble} onToggle={setScrobble} toggle /><SettingRow title="Custom presence card" detail="Artwork · status · buttons" onPress={() => notify('Presence card editor opened')} /></SettingsSection><SettingsSection title="Playback feel"><SettingRow title="Spotify Canvas visuals" detail="Motion artwork on now playing" value={canvas} onToggle={setCanvas} toggle /><SettingRow title="Data saver" detail="Wi‑Fi / cellular quality ceilings" toggle /><SettingRow title="Sleep timer" detail="Off" onPress={() => notify('Sleep timer presets ready')} /></SettingsSection><SettingsSection title="Sources & extensions"><SettingRow title="Extension store" detail="10 providers · health checks" onPress={() => notify('Extension manager opened')} /><View style={styles.providerGrid}>{providers.map(({ name, desc, action, tone, url }) => <Pressable key={name} style={styles.providerCard} onPress={() => Linking.openURL(url).catch(() => notify(`Could not open ${name}`))}><View style={[styles.providerDot, { backgroundColor: tone }]} /><Text style={styles.providerName}>{name}</Text><Text style={styles.providerDesc}>{desc}</Text><Text style={[styles.providerAction, { color: tone }]}>{action} ›</Text></Pressable>)}</View></SettingsSection></>}
        </ScrollView>

        <View style={styles.miniPlayer}><Image source={{ uri: current.art }} style={styles.miniArt} /><View style={{ flex: 1 }}><Text style={styles.miniTitle}>{current.title}</Text><Text style={styles.miniMeta}>{current.artist} · {quality}</Text></View><Pressable onPress={() => setLiked(!liked)}><Text style={[styles.miniIcon, liked && { color: colors.peach }]}>{liked ? '♥' : '♡'}</Text></Pressable><Pressable onPress={togglePlayback} style={styles.miniPlay}><Text style={styles.miniPlayText}>{playing ? 'Ⅱ' : '▶'}</Text></Pressable></View>
        <View style={styles.nav}>{[['Home','⌂'], ['Search','⌕'], ['Library','▤'], ['Settings','⚙']].map(([name, icon]) => <Pressable key={name} onPress={() => setTab(name)} style={styles.navItem}><Text style={[styles.navIcon, tab === name && { color: colors.cyan }]}>{icon}</Text><Text style={[styles.navText, tab === name && { color: colors.cyan }]}>{name}</Text></Pressable>)}</View>
      </View>
      {toast ? <View style={styles.toast}><Text style={styles.toastText}>{toast}</Text></View> : null}
      <Modal visible={qualityOpen} transparent animationType="slide" onRequestClose={() => setQualityOpen(false)}><Pressable style={styles.modalBackdrop} onPress={() => setQualityOpen(false)}><View style={styles.modalCard}><Text style={styles.eyebrow}>OUTPUT TARGET</Text><Text style={styles.modalTitle}>Choose your signal.</Text>{['Dolby Atmos', 'Hi-Res FLAC · 24-bit / 96 kHz', 'Lossless FLAC · 16-bit / 44.1 kHz', 'AAC · Data saver'].map(x => <Pressable key={x} onPress={() => { setQuality(x); setQualityOpen(false); notify(`Quality set to ${x}`); }} style={styles.qualityRow}><Text style={styles.qualityLabel}>{x}</Text><Text style={styles.radio}>{quality === x ? '◉' : '○'}</Text></Pressable>)}<Text style={styles.modalFoot}>Atmos falls back to the best available FLAC tier when a provider does not expose an Atmos manifest.</Text></View></Pressable></Modal>
    </SafeAreaView>
  );
}

function TrackRow({ track, liked, onLike, onPress }: { track: typeof tracks[number]; liked: boolean; onLike: () => void; onPress: () => void }) {
  return <Pressable style={styles.trackRow} onPress={onPress}><Image source={{ uri: track.art }} style={styles.trackArt} /><View style={{ flex: 1 }}><Text style={styles.trackTitle}>{track.title}</Text><Text style={styles.trackMeta}>{track.artist} · {track.album}</Text><View style={styles.trackBadges}><Chip tone={track.badge === 'ATMOS' ? 'peach' : track.badge === 'HI-RES' ? 'cyan' : 'lime'}>{track.badge}</Chip><Text style={styles.trackMeta}>{track.quality}</Text></View></View><Pressable onPress={onLike} hitSlop={8}><Text style={[styles.heart, liked && { color: colors.peach }]}>{liked ? '♥' : '♡'}</Text></Pressable><Text style={styles.trackDuration}>{track.duration}</Text></Pressable>;
}
function Stat({ value, label }: { value: string; label: string }) { return <View style={styles.stat}><Text style={styles.statValue}>{value}</Text><Text style={styles.statLabel}>{label}</Text></View>; }
function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) { return <View style={styles.settingsSection}><Text style={styles.settingsTitle}>{title}</Text>{children}</View>; }
function SettingRow({ title, detail, toggle, value, onToggle, onPress }: { title: string; detail: string; toggle?: boolean; value?: boolean; onToggle?: (value: boolean) => void; onPress?: () => void }) { return <Pressable style={styles.settingRow} onPress={onPress}><View style={{ flex: 1 }}><Text style={styles.settingTitle}>{title}</Text><Text style={styles.settingDetail}>{detail}</Text></View>{toggle ? <Switch value={value ?? false} onValueChange={onToggle} trackColor={{ false: colors.line, true: colors.cyan + '80' }} thumbColor={value ? colors.cyan : colors.muted} /> : <Text style={styles.chevron}>›</Text>}</Pressable>; }

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.ink }, shell: { flex: 1, backgroundColor: colors.ink }, topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 14 }, wordmark: { flexDirection: 'row', alignItems: 'center', gap: 9 }, wordmarkMark: { width: 30, height: 30, borderRadius: 10, backgroundColor: colors.cyan, alignItems: 'center', justifyContent: 'center' }, wordmarkPulse: { color: colors.ink, fontSize: 24, fontWeight: '900', marginTop: -2 }, wordmarkText: { color: colors.text, fontSize: 24, fontWeight: '800', letterSpacing: -1 }, topActions: { flexDirection: 'row', alignItems: 'center', gap: 8 }, iconButton: { width: 34, height: 34, borderRadius: 12, backgroundColor: colors.panel, alignItems: 'center', justifyContent: 'center' }, iconButtonActive: { backgroundColor: colors.cyan + '22' }, iconText: { color: colors.text, fontSize: 17 }, content: { paddingHorizontal: 20, paddingBottom: 160 }, heroRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, paddingBottom: 20 }, eyebrow: { color: colors.cyan, fontSize: 11, letterSpacing: 1.4, fontWeight: '800' }, heroTitle: { color: colors.text, fontSize: 29, fontWeight: '800', marginTop: 7, letterSpacing: -1 }, pageTitle: { color: colors.text, fontSize: 29, fontWeight: '800', marginTop: 7, marginBottom: 18, letterSpacing: -1 }, heroSub: { color: colors.muted, fontSize: 14, marginTop: 4 }, avatar: { width: 44, height: 44, borderRadius: 16, backgroundColor: colors.peach, alignItems: 'center', justifyContent: 'center' }, avatarText: { color: colors.ink, fontWeight: '900', fontSize: 17 }, nowPlayingCard: { height: 430, borderRadius: 26, overflow: 'hidden', backgroundColor: colors.panel, position: 'relative' }, heroArt: { width: '100%', height: '100%', position: 'absolute', opacity: 0.78 }, heroOverlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(9,11,16,0.48)' }, canvasVisualizer: { position: 'absolute', top: 22, left: 22, right: 22, height: 90, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', opacity: .7 }, canvasBar: { width: 8, borderRadius: 8, backgroundColor: colors.cyan }, heroMeta: { flex: 1, justifyContent: 'flex-end', padding: 20 }, heroPills: { flexDirection: 'row', gap: 8, marginBottom: 12 }, chip: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 5, alignSelf: 'flex-start' }, chipText: { fontSize: 10, letterSpacing: 0.8, fontWeight: '800' }, heroTrack: { color: colors.text, fontSize: 30, fontWeight: '800', letterSpacing: -0.8 }, heroArtist: { color: colors.text + 'CC', fontSize: 14, marginTop: 5 }, progressTrack: { height: 4, backgroundColor: colors.text + '33', borderRadius: 4, marginTop: 22 }, progressFill: { width: '42%', height: 4, borderRadius: 4, backgroundColor: colors.cyan }, progressLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }, miniText: { color: colors.text + '99', fontSize: 11 }, playerControls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }, playButton: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.text, alignItems: 'center', justifyContent: 'center' }, playText: { color: colors.ink, fontSize: 20, fontWeight: '800' }, sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 30, marginBottom: 14 }, sectionTitle: { color: colors.text, fontSize: 18, fontWeight: '800', marginBottom: 14 }, link: { color: colors.cyan, fontWeight: '700', fontSize: 12 }, horizontalRow: { gap: 12, paddingBottom: 4 }, mixCard: { width: 154 }, mixArt: { width: 154, height: 154, borderRadius: 18, marginBottom: 9 }, mixTitle: { color: colors.text, fontWeight: '700', fontSize: 13 }, mixMeta: { color: colors.muted, fontSize: 11, marginTop: 4 }, trackList: { gap: 7 }, trackRow: { minHeight: 75, flexDirection: 'row', alignItems: 'center', gap: 11, paddingVertical: 8 }, trackArt: { width: 57, height: 57, borderRadius: 14 }, trackTitle: { color: colors.text, fontWeight: '800', fontSize: 14 }, trackMeta: { color: colors.muted, fontSize: 11, marginTop: 4 }, trackBadges: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 6 }, heart: { color: colors.muted, fontSize: 23, paddingHorizontal: 4 }, trackDuration: { color: colors.muted, fontSize: 11, width: 30, textAlign: 'right' }, miniPlayer: { position: 'absolute', bottom: 70, left: 12, right: 12, height: 68, borderRadius: 18, backgroundColor: colors.panel2, borderWidth: 1, borderColor: colors.line, flexDirection: 'row', alignItems: 'center', padding: 9, gap: 10 }, miniArt: { width: 50, height: 50, borderRadius: 12 }, miniTitle: { color: colors.text, fontWeight: '800', fontSize: 13 }, miniMeta: { color: colors.muted, fontSize: 10, marginTop: 3 }, miniIcon: { color: colors.muted, fontSize: 22 }, miniPlay: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.cyan, alignItems: 'center', justifyContent: 'center' }, miniPlayText: { color: colors.ink, fontWeight: '900' }, nav: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 70, backgroundColor: colors.ink, borderTopWidth: 1, borderTopColor: colors.line, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }, navItem: { alignItems: 'center', gap: 3, minWidth: 60 }, navIcon: { color: colors.muted, fontSize: 21 }, navText: { color: colors.muted, fontSize: 10, fontWeight: '700' }, searchInput: { backgroundColor: colors.panel, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 15, color: colors.text, fontSize: 15, borderWidth: 1, borderColor: colors.line, marginBottom: 15 }, searchTags: { flexDirection: 'row', gap: 7, flexWrap: 'wrap', marginBottom: 26 }, libraryStats: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: colors.panel, borderRadius: 18, padding: 17, marginBottom: 20 }, stat: { alignItems: 'center', flex: 1 }, statValue: { color: colors.text, fontSize: 20, fontWeight: '800' }, statLabel: { color: colors.muted, fontSize: 9, letterSpacing: 0.8, marginTop: 5 }, libraryTabs: { flexDirection: 'row', gap: 8, marginBottom: 18 }, playlistCard: { flexDirection: 'row', alignItems: 'center', gap: 13, backgroundColor: colors.panel, borderRadius: 18, padding: 12, marginBottom: 9 }, playlistArt: { width: 58, height: 58, borderRadius: 14, backgroundColor: colors.cyan + '28', alignItems: 'center', justifyContent: 'center' }, playlistGlyph: { color: colors.cyan, fontSize: 26 }, chevron: { color: colors.muted, fontSize: 25 }, settingsSection: { marginTop: 12, marginBottom: 22 }, settingsTitle: { color: colors.cyan, fontSize: 11, letterSpacing: 1.2, fontWeight: '800', marginBottom: 8 }, settingRow: { minHeight: 62, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: colors.line, paddingVertical: 12 }, settingTitle: { color: colors.text, fontSize: 14, fontWeight: '700' }, settingDetail: { color: colors.muted, fontSize: 11, marginTop: 4 }, providerGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 9, marginTop: 12 }, providerCard: { width: '48%', minHeight: 120, backgroundColor: colors.panel, borderRadius: 15, padding: 13 }, providerDot: { width: 8, height: 8, borderRadius: 4, marginBottom: 11 }, providerName: { color: colors.text, fontWeight: '800', fontSize: 12 }, providerDesc: { color: colors.muted, fontSize: 10, marginTop: 5, lineHeight: 15 }, providerAction: { fontWeight: '800', fontSize: 11, marginTop: 10 }, toast: { position: 'absolute', bottom: 150, left: 25, right: 25, padding: 13, borderRadius: 13, backgroundColor: colors.text }, toastText: { color: colors.ink, textAlign: 'center', fontWeight: '800', fontSize: 12 }, modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.66)', justifyContent: 'flex-end' }, modalCard: { backgroundColor: colors.panel2, borderTopLeftRadius: 26, borderTopRightRadius: 26, padding: 24, paddingBottom: 35, borderTopWidth: 1, borderColor: colors.line }, modalTitle: { color: colors.text, fontSize: 26, fontWeight: '800', marginTop: 8, marginBottom: 22 }, qualityRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.line, paddingVertical: 17 }, qualityLabel: { color: colors.text, fontSize: 14, fontWeight: '700' }, radio: { color: colors.cyan, fontSize: 21 }, modalFoot: { color: colors.muted, fontSize: 11, lineHeight: 16, marginTop: 18 },
});
