const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3001 });
const os = require('os');
const interfaces = os.networkInterfaces();
const addresses = ['localhost'];
for (const name of Object.keys(interfaces)) {
  for (const iface of interfaces[name]) {
    if (iface.family === 'IPv4' && !iface.internal) {
      addresses.push(iface.address);
    }
  }
}

let peers = {};

wss.on('connection', function connection(ws) {
  ws.id = Math.random().toString(36).substr(2, 9);

  ws.on('message', function incoming(message) {
    let data;
    try { data = JSON.parse(message); } catch { return; }

    if (data.type === 'announce') {
      peers[ws.id] = { id: ws.id, name: data.name, ws };
      // Send assigned id and name back to the client
      ws.send(JSON.stringify({ type: 'welcome', id: ws.id, name: data.name }));
      broadcastPeers();
    }

    if (data.type === 'signal') {
      // Forward signaling data to the target peer
      const target = peers[data.targetId];
      if (target) {
        target.ws.send(JSON.stringify({
          type: 'signal',
          from: ws.id,
          signal: data.signal,
        }));
      }
    }

    if (data.type === 'broadcast') {
      // Relay broadcast message to all peers
      Object.values(peers).forEach(peer => {
        if (peer.ws !== ws) {
          peer.ws.send(JSON.stringify({
            type: 'broadcast',
            from: ws.id,
            name: data.name,
            content: data.content,
            timestamp: Date.now(),
          }));
        }
      });
    }
  });

  ws.on('close', () => {
    delete peers[ws.id];
    broadcastPeers();
  });

  function broadcastPeers() {
    const peerList = Object.values(peers).map(p => ({ id: p.id, name: p.name }));
    Object.values(peers).forEach(peer => {
      peer.ws.send(JSON.stringify({ type: 'peers', peers: peerList }));
    });
  }
});

console.log('Offline chat signaling server running on:');
addresses.forEach(addr => {
  console.log(`  ws://${addr}:3001`);
}); 