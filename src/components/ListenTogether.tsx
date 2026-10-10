import { useAudioPlayer } from 'expo-audio';
import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

const c = { ink: '#090B10', panel: '#11151D', panel2: '#171D27', line: '#293140', text: '#F4F7FB', muted: '#8A96A8', cyan: '#8BE9FD', lime: '#B8F38B', peach: '#FFB38B', purple: '#B8A7FF' };

export default function ListenTogether() {
  const [open, setOpen] = useState(false);
  const [joined, setJoined] = useState(false);
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [activity, setActivity] = useState(['Alex started the room', 'Maya joined the room']);
  const joinChime = useAudioPlayer(require('../../assets/room-join.wav'));
  const leaveChime = useAudioPlayer(require('../../assets/room-leave.wav'));

  const play = (player: typeof joinChime) => { try { player.seekTo(0); player.play(); } catch {} };
  const enter = (kind: 'create' | 'join') => {
    const nextCode = code.trim().toUpperCase() || 'FREQ-7K2M';
    setCode(nextCode);
    setJoined(true);
    setActivity(kind === 'create' ? ['Alex created the room', 'Join chime enabled'] : ['Maya is already listening', 'You joined the room']);
    play(joinChime);
  };

  return <>
    <Pressable style={styles.banner} onPress={() => setOpen(true)}>
      <View style={styles.signal}><Text style={styles.signalGlyph}>⌁</Text></View>
      <View style={{ flex: 1 }}><Text style={styles.title}>{joined ? 'Listening together · live' : 'Listen Together'}</Text><Text style={styles.meta}>{joined ? '3 people · synced to Midnight City' : 'Create a room or join friends with a code'}</Text></View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
    <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
      <Pressable style={styles.backdrop} onPress={() => setOpen(false)}><View style={styles.card}>
        <View style={styles.header}><View><Text style={styles.eyebrow}>REAL-TIME SESSION</Text><Text style={styles.modalTitle}>Listen Together</Text></View><View style={[styles.pill, { borderColor: joined ? c.lime + '55' : c.cyan + '55' }]}><Text style={[styles.pillText, { color: joined ? c.lime : c.cyan }]}>{joined ? 'LIVE' : 'READY'}</Text></View></View>
        {joined ? <>
          <View style={styles.codeCard}><Text style={styles.label}>ROOM CODE</Text><Text style={styles.roomCode}>{code}</Text><Pressable onPress={() => setActivity([...activity, 'Alex copied the invite link'])}><Text style={styles.invite}>Copy invite link ↗</Text></Pressable></View>
          <View style={styles.sync}><View><Text style={styles.rowTitle}>Synchronized playback</Text><Text style={styles.detail}>Host controls seek, pause and queue</Text></View><Text style={styles.synced}>SYNCED</Text></View>
          <Text style={styles.sectionLabel}>PEOPLE IN THIS ROOM · 3</Text>
          {[['A', 'Alex · host', c.peach, 'HOST'], ['M', 'Maya', c.purple, 'listening'], ['J', 'Jules', c.lime, 'listening']].map(([letter, name, color, status]) => <View key={String(name)} style={styles.person}><View style={[styles.avatar, { backgroundColor: color as string }]}><Text style={styles.avatarText}>{letter}</Text></View><Text style={styles.personName}>{name}</Text><Text style={[styles.personStatus, { color: status === 'HOST' ? c.peach : c.lime }]}>{status}</Text></View>)}
          <View style={styles.chat}><Text style={styles.sectionLabel}>ROOM ACTIVITY</Text>{activity.slice(-3).map((line, i) => <Text key={`${line}-${i}`} style={styles.chatLine}>· {line}</Text>)}<View style={styles.compose}><TextInput value={message} onChangeText={setMessage} placeholder="Say something…" placeholderTextColor={c.muted} style={styles.input} /><Pressable style={styles.send} onPress={() => { if (message.trim()) { setActivity([...activity, `Alex: ${message.trim()}`]); setMessage(''); } }}><Text style={styles.sendText}>Send</Text></Pressable></View></View>
          <Pressable style={styles.leave} onPress={() => { play(leaveChime); setJoined(false); setOpen(false); }}><Text style={styles.leaveText}>Leave room</Text></Pressable>
        </> : <>
          <Text style={styles.intro}>Share a room code and stay in sync while everyone streams from their own authorized provider.</Text>
          <TextInput value={code} onChangeText={setCode} autoCapitalize="characters" placeholder="Enter room code" placeholderTextColor={c.muted} style={styles.roomInput} />
          <Pressable style={styles.create} onPress={() => enter('create')}><Text style={styles.createText}>Create room</Text></Pressable>
          <Pressable style={styles.join} onPress={() => enter('join')}><Text style={styles.joinText}>Join room</Text></Pressable>
          <Text style={styles.foot}>Join and leave chimes are enabled. Room sync and chat are ready for a WebSocket backend.</Text>
        </>}
      </View></Pressable>
    </Modal>
  </>;
}

const styles = StyleSheet.create({
  banner: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: c.cyan + '12', borderWidth: 1, borderColor: c.cyan + '44', borderRadius: 18, padding: 13, marginTop: 18 }, signal: { width: 42, height: 42, borderRadius: 14, backgroundColor: c.cyan, alignItems: 'center', justifyContent: 'center' }, signalGlyph: { color: c.ink, fontSize: 26, fontWeight: '900' }, title: { color: c.text, fontWeight: '800', fontSize: 14 }, meta: { color: c.muted, fontSize: 11, marginTop: 4 }, chevron: { color: c.muted, fontSize: 25 }, backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.66)', justifyContent: 'flex-end' }, card: { backgroundColor: c.panel2, borderTopLeftRadius: 26, borderTopRightRadius: 26, padding: 24, paddingBottom: 35, borderTopWidth: 1, borderColor: c.line }, header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }, eyebrow: { color: c.cyan, fontSize: 11, letterSpacing: 1.4, fontWeight: '800' }, modalTitle: { color: c.text, fontSize: 26, fontWeight: '800', marginTop: 8, marginBottom: 22 }, pill: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 5 }, pillText: { fontSize: 10, letterSpacing: .8, fontWeight: '800' }, codeCard: { backgroundColor: c.ink, borderRadius: 16, padding: 16, marginBottom: 16 }, label: { color: c.muted, fontSize: 10, letterSpacing: 1.2, fontWeight: '800' }, roomCode: { color: c.cyan, fontSize: 29, fontWeight: '900', letterSpacing: 2, marginTop: 6 }, invite: { color: c.peach, fontSize: 11, fontWeight: '800', marginTop: 8 }, sync: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: c.panel, borderRadius: 14, padding: 13, marginBottom: 18 }, rowTitle: { color: c.text, fontSize: 14, fontWeight: '700' }, detail: { color: c.muted, fontSize: 11, marginTop: 4 }, synced: { color: c.lime, fontWeight: '900', fontSize: 10 }, sectionLabel: { color: c.cyan, fontSize: 10, letterSpacing: 1.2, fontWeight: '800', marginBottom: 8 }, person: { flexDirection: 'row', alignItems: 'center', gap: 9, paddingVertical: 7 }, avatar: { width: 28, height: 28, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }, avatarText: { color: c.ink, fontWeight: '900', fontSize: 12 }, personName: { color: c.text, fontSize: 13, fontWeight: '700', flex: 1 }, personStatus: { fontSize: 10, fontWeight: '800' }, chat: { backgroundColor: c.ink, borderRadius: 14, padding: 13, marginTop: 14 }, chatLine: { color: c.muted, fontSize: 11, marginBottom: 5 }, compose: { flexDirection: 'row', gap: 7, marginTop: 8 }, input: { flex: 1, color: c.text, fontSize: 12, backgroundColor: c.panel2, borderRadius: 9, paddingHorizontal: 10, paddingVertical: 8 }, send: { backgroundColor: c.cyan, borderRadius: 9, justifyContent: 'center', paddingHorizontal: 10 }, sendText: { color: c.ink, fontWeight: '900', fontSize: 11 }, leave: { alignItems: 'center', paddingVertical: 14, marginTop: 12 }, leaveText: { color: c.peach, fontWeight: '900', fontSize: 13 }, intro: { color: c.muted, fontSize: 13, lineHeight: 19, marginBottom: 18 }, roomInput: { backgroundColor: c.ink, borderWidth: 1, borderColor: c.line, borderRadius: 12, color: c.text, paddingHorizontal: 13, paddingVertical: 13, fontSize: 14, marginBottom: 10 }, create: { backgroundColor: c.cyan, borderRadius: 12, alignItems: 'center', paddingVertical: 14 }, createText: { color: c.ink, fontWeight: '900', fontSize: 13 }, join: { borderWidth: 1, borderColor: c.line, borderRadius: 12, alignItems: 'center', paddingVertical: 13, marginTop: 9 }, joinText: { color: c.text, fontWeight: '800', fontSize: 13 }, foot: { color: c.muted, fontSize: 10, lineHeight: 15, marginTop: 16, textAlign: 'center' },
});
