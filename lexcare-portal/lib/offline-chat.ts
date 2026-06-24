// Offline chat system using WebSocket signaling server for peer discovery, broadcast, and P2P messaging

const WS_URL = 'ws://localhost:3001';
const MESSAGE_KEY = 'offline-chat-messages';

export type ChatMessage = {
  id: string;
  sender: string;
  content: string;
  timestamp: number;
  type: 'p2p' | 'broadcast';
};

export type Peer = {
  id: string;
  name: string;
};

// --- WebSocket signaling ---
let ws: WebSocket | null = null;
let myPeer: Peer | null = null;
let peers: Peer[] = [];
let onPeersUpdate: ((peers: Peer[]) => void) | null = null;
let onMessageCallbacks: ((msg: ChatMessage) => void)[] = [];
let onConnectionStateChange: ((state: string) => void) | null = null;
let peerStatusCallbacks: ((peerId: string, status: string) => void)[] = [];

function connectWebSocket(name: string, serverUrl: string) {
  ws = new window.WebSocket(serverUrl);
  let opened = false;
  ws.onopen = () => {
    opened = true;
    ws!.send(JSON.stringify({ type: 'announce', name }));
  };
  ws.onerror = (err) => {
    if (!opened && typeof (OfflineChat as any)._onWsError === 'function') {
      (OfflineChat as any)._onWsError(err);
    }
  };
  ws.onclose = (event) => {
    if (!opened && typeof (OfflineChat as any)._onWsError === 'function') {
      (OfflineChat as any)._onWsError(event);
      return;
    }
    setTimeout(() => connectWebSocket(name, serverUrl), 1000); // Reconnect
  };
  ws.onmessage = (event) => {
    let data;
    try { data = JSON.parse(event.data); } catch { return; }
    if (data.type === 'welcome' && myPeer) {
      myPeer.id = data.id;
      myPeer.name = data.name;
    }
    if (data.type === 'peers') {
      peers = data.peers.filter((p: Peer) => p.id !== myPeer?.id);
      onPeersUpdate?.(peers);
    }
    if (data.type === 'broadcast') {
      const msg: ChatMessage = {
        id: genId(),
        sender: data.name,
        content: data.content,
        timestamp: data.timestamp,
        type: 'broadcast',
      };
      saveMessage(msg);
      onMessageCallbacks.forEach((cb) => cb(msg));
    }
    if (data.type === 'signal' && data.from && data.signal) {
      handleSignal(data.from, data.signal);
    }
  };
}

function announcePresence(name: string, serverUrl: string) {
  myPeer = { id: '', name };
  connectWebSocket(name, serverUrl);
}

function subscribePeersUpdate(cb: (peers: Peer[]) => void) {
  onPeersUpdate = cb;
}

function getPeers() {
  return peers;
}

// --- Broadcast messaging ---
function sendBroadcastMessage(content: string) {
  if (!ws || ws.readyState !== 1) return;
  ws.send(JSON.stringify({ type: 'broadcast', name: myPeer?.name, content }));
  const msg: ChatMessage = {
    id: genId(),
    sender: myPeer?.name || '',
    content,
    timestamp: Date.now(),
    type: 'broadcast',
  };
  saveMessage(msg);
  onMessageCallbacks.forEach((cb) => cb(msg));
}

// --- WebRTC P2P messaging ---
const rtcConfig = { iceServers: [] }; // Only local candidates for offline/LAN

// Multi-peer support
let peerConnections: { [peerId: string]: RTCPeerConnection } = {};
let dataChannels: { [peerId: string]: RTCDataChannel } = {};

function cleanupPeer(peerId: string) {
  if (peerConnections[peerId]) {
    try { peerConnections[peerId].close(); } catch {}
    delete peerConnections[peerId];
  }
  if (dataChannels[peerId]) {
    delete dataChannels[peerId];
  }
}

function connectToPeer(peer: Peer) {
  if (!ws) return;
  if (peerConnections[peer.id]) {
    console.log('[P2P] Already connected to', peer.id);
    return;
  }
  console.log('[P2P] Initiating connection to peer:', peer);
  const rtcConn = new RTCPeerConnection(rtcConfig);
  peerConnections[peer.id] = rtcConn;
  const channel = rtcConn.createDataChannel('chat');
  dataChannels[peer.id] = channel;
  setupRTCEvents(peer.id);
  rtcConn.onicecandidate = (e) => {
    if (e.candidate && ws) {
      console.log('[P2P] Sending ICE candidate to', peer.id, e.candidate);
      ws.send(JSON.stringify({ type: 'signal', targetId: peer.id, signal: { candidate: e.candidate } }));
    }
  };
  rtcConn.createOffer().then((offer) => {
    rtcConn.setLocalDescription(offer);
    console.log('[P2P] Sending offer to', peer.id, offer);
    ws.send(JSON.stringify({ type: 'signal', targetId: peer.id, signal: { offer } }));
  });
}

function handleSignal(fromId: string, signal: any) {
  console.log('[P2P] Received signal from', fromId, signal);
  let rtcConn = peerConnections[fromId];
  if (!rtcConn) {
    console.log('[P2P] Creating RTCPeerConnection as receiver for', fromId);
    rtcConn = new RTCPeerConnection(rtcConfig);
    peerConnections[fromId] = rtcConn;
    rtcConn.onicecandidate = (e) => {
      if (e.candidate && ws) {
        console.log('[P2P] Receiver sending ICE candidate to', fromId, e.candidate);
        ws.send(JSON.stringify({ type: 'signal', targetId: fromId, signal: { candidate: e.candidate } }));
      }
    };
    rtcConn.ondatachannel = (e) => {
      console.log('[P2P] Receiver got data channel from', fromId);
      dataChannels[fromId] = e.channel;
      setupRTCEvents(fromId);
    };
  }
  if (signal.offer) {
    console.log('[P2P] Receiver setting remote offer for', fromId);
    rtcConn.setRemoteDescription(new RTCSessionDescription(signal.offer));
    rtcConn.createAnswer().then((answer) => {
      rtcConn.setLocalDescription(answer);
      console.log('[P2P] Receiver sending answer to', fromId, answer);
      ws.send(JSON.stringify({ type: 'signal', targetId: fromId, signal: { answer } }));
    });
  } else if (signal.answer) {
    console.log('[P2P] Initiator received answer from', fromId);
    rtcConn.setRemoteDescription(new RTCSessionDescription(signal.answer));
  } else if (signal.candidate) {
    console.log('[P2P] Adding ICE candidate for', fromId, signal.candidate);
    rtcConn.addIceCandidate(new RTCIceCandidate(signal.candidate));
  }
}

function subscribePeerStatus(cb: (peerId: string, status: string) => void) {
  peerStatusCallbacks.push(cb);
}

function notifyPeerStatus(peerId: string, status: string) {
  for (const cb of peerStatusCallbacks) {
    cb(peerId, status);
  }
}

function setupRTCEvents(peerId: string) {
  const rtcConn = peerConnections[peerId];
  const channel = dataChannels[peerId];
  if (!rtcConn || !channel) return;
  rtcConn.onicecandidate = (e) => {
    if (e.candidate && ws) {
      console.log('[P2P] (setup) Sending ICE candidate to', peerId, e.candidate);
      ws.send(JSON.stringify({ type: 'signal', targetId: peerId, signal: { candidate: e.candidate } }));
    }
  };
  channel.onmessage = (e) => {
    const msg: ChatMessage = JSON.parse(e.data);
    saveMessage(msg);
    onMessageCallbacks.forEach((cb) => cb(msg));
  };
  channel.onopen = () => {
    console.log('[P2P] Data channel open with', peerId);
    onConnectionStateChange?.('connected');
    notifyPeerStatus(peerId, 'connected');
  };
  channel.onclose = () => {
    console.log('[P2P] Data channel closed with', peerId);
    onConnectionStateChange?.('disconnected');
    notifyPeerStatus(peerId, 'disconnected');
  };
  channel.onerror = (e) => {
    console.error('[P2P] Data channel error with', peerId, e);
    notifyPeerStatus(peerId, 'error');
  };
  // Initial state
  if (channel.readyState === 'connecting') notifyPeerStatus(peerId, 'connecting');
  if (channel.readyState === 'open') notifyPeerStatus(peerId, 'connected');
  if (channel.readyState === 'closed') notifyPeerStatus(peerId, 'disconnected');
}

function sendP2PMessage(content: string, selectedPeerId?: string) {
  if (!selectedPeerId) return;
  const channel = dataChannels[selectedPeerId];
  if (!channel || channel.readyState !== 'open') return;
  const msg: ChatMessage = {
    id: genId(),
    sender: myPeer?.name || '',
    content,
    timestamp: Date.now(),
    type: 'p2p',
  };
  channel.send(JSON.stringify(msg));
  saveMessage(msg);
  onMessageCallbacks.forEach((cb) => cb(msg));
}

function subscribeMessages(cb: (msg: ChatMessage) => void) {
  onMessageCallbacks.push(cb);
}

function subscribeConnectionState(cb: (state: string) => void) {
  onConnectionStateChange = cb;
}

// --- Local message storage ---
function saveMessage(msg: ChatMessage) {
  const messages = loadMessages();
  messages.push(msg);
  localStorage.setItem(MESSAGE_KEY, JSON.stringify(messages));
}

function loadMessages(): ChatMessage[] {
  try {
    const data = localStorage.getItem(MESSAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function genId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export const OfflineChat = {
  announcePresence,
  getPeers,
  subscribePeersUpdate,
  connectToPeer,
  sendP2PMessage,
  sendBroadcastMessage,
  subscribeMessages,
  subscribeConnectionState,
  loadMessages,
  subscribePeerStatus,
}; 