import { supabase } from './supabase';

export interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'system';
}

export interface Peer {
  id: string;
  name: string;
  isOnline: boolean;
  connection?: RTCPeerConnection;
  dataChannel?: RTCDataChannel;
  connectionState?: string;
  lastSeen?: Date;
}

class WebRTCChat {
  private peers: Map<string, Peer> = new Map();
  private localPeerId: string;
  private localName: string;
  private signalingChannel: any;
  private isInitialized = false;
  private connectionTimeouts: Map<string, NodeJS.Timeout> = new Map();
  private reconnectAttempts: Map<string, number> = new Map();
  private readonly CONNECTION_TIMEOUT = 30000; // 30 seconds
  private readonly MAX_RECONNECT_ATTEMPTS = 3;
  private readonly RECONNECT_DELAY = 5000; // 5 seconds

  constructor() {
    this.localPeerId = this.generatePeerId();
    this.localName = 'Anonymous';
  }

  private generatePeerId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  async initialize(userName: string = 'Anonymous'): Promise<void> {
    if (this.isInitialized) return;

    this.localName = userName;
    
    // Initialize Supabase realtime for signaling
    this.signalingChannel = supabase
      .channel('local-chat-signaling')
      .on('presence', { event: 'sync' }, () => {
        this.handlePresenceSync();
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        this.handlePeerJoin(key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        this.handlePeerLeave(key, leftPresences);
      })
      .on('broadcast', { event: 'offer' }, ({ payload }) => {
        this.handleOffer(payload);
      })
      .on('broadcast', { event: 'answer' }, ({ payload }) => {
        this.handleAnswer(payload);
      })
      .on('broadcast', { event: 'ice-candidate' }, ({ payload }) => {
        this.handleIceCandidate(payload);
      });

    await this.signalingChannel.subscribe(async (status: string) => {
      if (status === 'SUBSCRIBED') {
        await this.signalingChannel.track({
          id: this.localPeerId,
          name: this.localName,
          isOnline: true,
        });
        this.isInitialized = true;
        console.log('[WebRTC] Connected to signaling server');
      }
    });
  }

  private handlePresenceSync(): void {
    const presences = this.signalingChannel.presenceState();
    Object.keys(presences).forEach(channelId => {
      presences[channelId].forEach((presence: any) => {
        if (presence.id !== this.localPeerId) {
          this.addPeer(presence.id, presence.name);
        }
      });
    });
  }

  private handlePeerJoin(key: string, newPresences: any[]): void {
    newPresences.forEach((presence: any) => {
      if (presence.id !== this.localPeerId) {
        this.addPeer(presence.id, presence.name);
        this.createOffer(presence.id);
      }
    });
  }

  private handlePeerLeave(key: string, leftPresences: any[]): void {
    leftPresences.forEach((presence: any) => {
      this.removePeer(presence.id);
    });
  }

  private addPeer(peerId: string, peerName: string): void {
    if (!this.peers.has(peerId)) {
      const peer: Peer = {
        id: peerId,
        name: peerName,
        isOnline: true,
        lastSeen: new Date(),
        connectionState: 'connecting'
      };
      this.peers.set(peerId, peer);
      console.log(`[WebRTC] Peer joined: ${peerName} (${peerId})`);
    }
  }

  private removePeer(peerId: string): void {
    const peer = this.peers.get(peerId);
    if (peer) {
      // Clear any pending timeout
      const timeout = this.connectionTimeouts.get(peerId);
      if (timeout) {
        clearTimeout(timeout);
        this.connectionTimeouts.delete(peerId);
      }

      // Clear reconnect attempts
      this.reconnectAttempts.delete(peerId);

      if (peer.connection) {
        peer.connection.close();
      }
      this.peers.delete(peerId);
      console.log(`[WebRTC] Peer left: ${peer.name} (${peerId})`);
    }
  }

  private setConnectionTimeout(peerId: string): void {
    // Clear existing timeout
    const existingTimeout = this.connectionTimeouts.get(peerId);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Set new timeout
    const timeout = setTimeout(() => {
      console.log(`[WebRTC] Connection timeout for peer ${peerId}`);
      const peer = this.peers.get(peerId);
      if (peer && peer.connectionState === 'connecting') {
        this.handleConnectionFailure(peerId);
      }
    }, this.CONNECTION_TIMEOUT);

    this.connectionTimeouts.set(peerId, timeout);
  }

  private handleConnectionFailure(peerId: string): void {
    const peer = this.peers.get(peerId);
    if (!peer) return;

    const attempts = this.reconnectAttempts.get(peerId) || 0;
    
    if (attempts < this.MAX_RECONNECT_ATTEMPTS) {
      console.log(`[WebRTC] Attempting to reconnect to ${peer.name} (attempt ${attempts + 1})`);
      this.reconnectAttempts.set(peerId, attempts + 1);
      
      // Clean up failed connection
      if (peer.connection) {
        peer.connection.close();
        peer.connection = undefined;
      }
      if (peer.dataChannel) {
        peer.dataChannel.close();
        peer.dataChannel = undefined;
      }

      // Retry connection after delay
      setTimeout(() => {
        if (this.peers.has(peerId)) {
          peer.connectionState = 'connecting';
          peer.lastSeen = new Date();
          this.createOffer(peerId);
        }
      }, this.RECONNECT_DELAY);
    } else {
      console.log(`[WebRTC] Max reconnection attempts reached for ${peer.name}`);
      peer.connectionState = 'failed';
      peer.lastSeen = new Date();
      
      // Clean up failed connection
      if (peer.connection) {
        peer.connection.close();
        peer.connection = undefined;
      }
      if (peer.dataChannel) {
        peer.dataChannel.close();
        peer.dataChannel = undefined;
      }
    }
  }

  private async createOffer(peerId: string): Promise<void> {
    const peer = this.peers.get(peerId);
    if (!peer) return;

    try {
      // Get the appropriate RTCPeerConnection implementation
      const RTCPeerConnectionImpl = window.RTCPeerConnection || 
        (window as any).webkitRTCPeerConnection || 
        (window as any).mozRTCPeerConnection;

      if (!RTCPeerConnectionImpl) {
        throw new Error('RTCPeerConnection not available');
      }

      // Try with STUN servers first
      const connection = new RTCPeerConnectionImpl({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' },
          { urls: 'stun:stun3.l.google.com:19302' },
          { urls: 'stun:stun4.l.google.com:19302' },
        ],
        iceCandidatePoolSize: 10,
      });

      // If STUN fails, try with local network only
      const fallbackConnection = new RTCPeerConnectionImpl({
        iceServers: [],
        iceCandidatePoolSize: 10,
      });

      peer.connection = connection;
      peer.connectionState = 'connecting';
      peer.lastSeen = new Date();

      // Set connection timeout
      this.setConnectionTimeout(peerId);

      // Monitor connection state changes
      connection.onconnectionstatechange = () => {
        console.log(`[WebRTC] Connection state for ${peer.name}: ${connection.connectionState}`);
        peer.connectionState = connection.connectionState;
        peer.lastSeen = new Date();

        if (connection.connectionState === 'connected' || connection.connectionState === 'completed') {
          // Clear timeout on successful connection
          const timeout = this.connectionTimeouts.get(peerId);
          if (timeout) {
            clearTimeout(timeout);
            this.connectionTimeouts.delete(peerId);
          }
          // Reset reconnect attempts on successful connection
          this.reconnectAttempts.delete(peerId);
        } else if (connection.connectionState === 'failed') {
          console.log(`[WebRTC] STUN connection failed for ${peer.name}, trying local network...`);
          // Try fallback connection
          this.tryFallbackConnection(peerId, fallbackConnection);
        } else if (connection.connectionState === 'disconnected') {
          // Handle connection failure
          this.handleConnectionFailure(peerId);
        }
      };

      // Monitor ICE connection state
      connection.oniceconnectionstatechange = () => {
        console.log(`[WebRTC] ICE connection state for ${peer.name}: ${connection.iceConnectionState}`);
        if (connection.iceConnectionState === 'failed') {
          console.log(`[WebRTC] ICE connection failed for ${peer.name}, trying local network...`);
          this.tryFallbackConnection(peerId, fallbackConnection);
        } else if (connection.iceConnectionState === 'disconnected') {
          this.handleConnectionFailure(peerId);
        }
      };

      // Monitor ICE gathering state
      connection.onicegatheringstatechange = () => {
        console.log(`[WebRTC] ICE gathering state for ${peer.name}: ${connection.iceGatheringState}`);
      };

      // Monitor signaling state
      connection.onsignalingstatechange = () => {
        console.log(`[WebRTC] Signaling state for ${peer.name}: ${connection.signalingState}`);
      };

      // Create data channel
      const dataChannel = connection.createDataChannel('chat', {
        ordered: true,
        maxRetransmits: 3,
      });
      
      dataChannel.onopen = () => {
        console.log(`[WebRTC] Data channel opened with ${peer.name}`);
        peer.dataChannel = dataChannel;
        peer.connectionState = 'connected';
        peer.lastSeen = new Date();
        
        // Clear timeout
        const timeout = this.connectionTimeouts.get(peerId);
        if (timeout) {
          clearTimeout(timeout);
          this.connectionTimeouts.delete(peerId);
        }
      };
      
      dataChannel.onclose = () => {
        console.log(`[WebRTC] Data channel closed with ${peer.name}`);
        peer.dataChannel = undefined;
        peer.connectionState = 'disconnected';
        peer.lastSeen = new Date();
      };

      dataChannel.onerror = (error) => {
        console.error(`[WebRTC] Data channel error with ${peer.name}:`, error);
      };

      dataChannel.onmessage = (event) => {
        this.handleMessage(peerId, event.data);
        peer.lastSeen = new Date();
      };

      // Handle ICE candidates
      connection.onicecandidate = (event) => {
        if (event.candidate) {
          console.log(`[WebRTC] Sending ICE candidate to ${peer.name}:`, event.candidate.type);
          this.signalingChannel.send({
            type: 'broadcast',
            event: 'ice-candidate',
            payload: {
              to: peerId,
              candidate: event.candidate,
            },
          });
        } else {
          console.log(`[WebRTC] ICE gathering complete for ${peer.name}`);
        }
      };

      // Create and send offer
      const offer = await connection.createOffer({
        offerToReceiveAudio: false,
        offerToReceiveVideo: false,
      });
      await connection.setLocalDescription(offer);
      
      console.log(`[WebRTC] Sending offer to ${peer.name}`);
      this.signalingChannel.send({
        type: 'broadcast',
        event: 'offer',
        payload: {
          to: peerId,
          offer: offer,
        },
      });

    } catch (error) {
      console.error('[WebRTC] Error creating offer:', error);
      peer.connectionState = 'failed';
      peer.lastSeen = new Date();
    }
  }

  private async tryFallbackConnection(peerId: string, fallbackConnection: RTCPeerConnection): Promise<void> {
    const peer = this.peers.get(peerId);
    if (!peer) return;

    try {
      console.log(`[WebRTC] Attempting local network connection for ${peer.name}`);
      
      // Get the appropriate RTCPeerConnection implementation
      const RTCPeerConnectionImpl = window.RTCPeerConnection || 
        (window as any).webkitRTCPeerConnection || 
        (window as any).mozRTCPeerConnection;

      if (!RTCPeerConnectionImpl) {
        throw new Error('RTCPeerConnection not available');
      }

      // Create new fallback connection
      const newFallbackConnection = new RTCPeerConnectionImpl({
        iceServers: [],
        iceCandidatePoolSize: 10,
      });
      
      // Replace the connection
      if (peer.connection) {
        try {
          peer.connection.close();
        } catch (error) {
          console.error(`[WebRTC] Error closing connection for ${peer.name}:`, error);
        }
      }
      peer.connection = newFallbackConnection;
      peer.connectionState = 'connecting';

      // Set up the same event handlers for fallback connection
      newFallbackConnection.onconnectionstatechange = () => {
        console.log(`[WebRTC] Fallback connection state for ${peer.name}: ${newFallbackConnection.connectionState}`);
        peer.connectionState = newFallbackConnection.connectionState;
        peer.lastSeen = new Date();

        if (newFallbackConnection.connectionState === 'connected' || newFallbackConnection.connectionState === 'completed') {
          const timeout = this.connectionTimeouts.get(peerId);
          if (timeout) {
            clearTimeout(timeout);
            this.connectionTimeouts.delete(peerId);
          }
          this.reconnectAttempts.delete(peerId);
        } else if (newFallbackConnection.connectionState === 'failed' || newFallbackConnection.connectionState === 'disconnected') {
          this.handleConnectionFailure(peerId);
        }
      };

      // Create data channel on fallback connection
      const dataChannel = newFallbackConnection.createDataChannel('chat', {
        ordered: true,
        maxRetransmits: 3,
      });
      
      dataChannel.onopen = () => {
        console.log(`[WebRTC] Fallback data channel opened with ${peer.name}`);
        peer.dataChannel = dataChannel;
        peer.connectionState = 'connected';
        peer.lastSeen = new Date();
        
        const timeout = this.connectionTimeouts.get(peerId);
        if (timeout) {
          clearTimeout(timeout);
          this.connectionTimeouts.delete(peerId);
        }
      };

      dataChannel.onmessage = (event) => {
        this.handleMessage(peerId, event.data);
        peer.lastSeen = new Date();
      };

      // Create and send fallback offer
      const offer = await newFallbackConnection.createOffer({
        offerToReceiveAudio: false,
        offerToReceiveVideo: false,
      });
      await newFallbackConnection.setLocalDescription(offer);
      
      console.log(`[WebRTC] Sending fallback offer to ${peer.name}`);
      this.signalingChannel.send({
        type: 'broadcast',
        event: 'offer',
        payload: {
          to: peerId,
          offer: offer,
        },
      });

    } catch (error) {
      console.error('[WebRTC] Error creating fallback offer:', error);
      peer.connectionState = 'failed';
      peer.lastSeen = new Date();
    }
  }

  private async handleOffer(payload: any): Promise<void> {
    if (payload.to !== this.localPeerId) return;

    const peer = this.peers.get(payload.from);
    if (!peer) return;

    try {
      // Get the appropriate RTCPeerConnection implementation
      const RTCPeerConnectionImpl = window.RTCPeerConnection || 
        (window as any).webkitRTCPeerConnection || 
        (window as any).mozRTCPeerConnection;

      if (!RTCPeerConnectionImpl) {
        throw new Error('RTCPeerConnection not available');
      }

      const connection = new RTCPeerConnectionImpl({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' },
          { urls: 'stun:stun3.l.google.com:19302' },
          { urls: 'stun:stun4.l.google.com:19302' },
        ],
        iceCandidatePoolSize: 10,
      });

      peer.connection = connection;
      peer.connectionState = 'connecting';
      peer.lastSeen = new Date();

      // Set connection timeout
      this.setConnectionTimeout(payload.from);

      // Monitor connection state changes
      connection.onconnectionstatechange = () => {
        console.log(`[WebRTC] Connection state for ${peer.name}: ${connection.connectionState}`);
        peer.connectionState = connection.connectionState;
        peer.lastSeen = new Date();

        if (connection.connectionState === 'connected' || connection.connectionState === 'completed') {
          // Clear timeout on successful connection
          const timeout = this.connectionTimeouts.get(payload.from);
          if (timeout) {
            clearTimeout(timeout);
            this.connectionTimeouts.delete(payload.from);
          }
          // Reset reconnect attempts on successful connection
          this.reconnectAttempts.delete(payload.from);
        } else if (connection.connectionState === 'failed' || connection.connectionState === 'disconnected') {
          // Handle connection failure
          this.handleConnectionFailure(payload.from);
        }
      };

      // Monitor ICE connection state
      connection.oniceconnectionstatechange = () => {
        console.log(`[WebRTC] ICE connection state for ${peer.name}: ${connection.iceConnectionState}`);
        if (connection.iceConnectionState === 'failed' || connection.iceConnectionState === 'disconnected') {
          this.handleConnectionFailure(payload.from);
        }
      };

      // Monitor ICE gathering state
      connection.onicegatheringstatechange = () => {
        console.log(`[WebRTC] ICE gathering state for ${peer.name}: ${connection.iceGatheringState}`);
      };

      // Monitor signaling state
      connection.onsignalingstatechange = () => {
        console.log(`[WebRTC] Signaling state for ${peer.name}: ${connection.signalingState}`);
      };

      // Handle incoming data channel
      connection.ondatachannel = (event) => {
        const dataChannel = event.channel;
        dataChannel.onopen = () => {
          console.log(`[WebRTC] Data channel opened with ${peer.name}`);
          peer.dataChannel = dataChannel;
          peer.connectionState = 'connected';
          peer.lastSeen = new Date();
          
          // Clear timeout
          const timeout = this.connectionTimeouts.get(payload.from);
          if (timeout) {
            clearTimeout(timeout);
            this.connectionTimeouts.delete(payload.from);
          }
        };
        
        dataChannel.onclose = () => {
          console.log(`[WebRTC] Data channel closed with ${peer.name}`);
          peer.dataChannel = undefined;
          peer.connectionState = 'disconnected';
          peer.lastSeen = new Date();
        };

        dataChannel.onerror = (error) => {
          console.error(`[WebRTC] Data channel error with ${peer.name}:`, error);
        };

        dataChannel.onmessage = (event) => {
          this.handleMessage(payload.from, event.data);
          peer.lastSeen = new Date();
        };
      };

      // Handle ICE candidates
      connection.onicecandidate = (event) => {
        if (event.candidate) {
          console.log(`[WebRTC] Sending ICE candidate to ${peer.name}:`, event.candidate.type);
          this.signalingChannel.send({
            type: 'broadcast',
            event: 'ice-candidate',
            payload: {
              to: payload.from,
              candidate: event.candidate,
            },
          });
        } else {
          console.log(`[WebRTC] ICE gathering complete for ${peer.name}`);
        }
      };

      // Set remote description and create answer
      console.log(`[WebRTC] Setting remote description for ${peer.name}`);
      await connection.setRemoteDescription(payload.offer);
      const answer = await connection.createAnswer({
        offerToReceiveAudio: false,
        offerToReceiveVideo: false,
      });
      await connection.setLocalDescription(answer);

      console.log(`[WebRTC] Sending answer to ${peer.name}`);
      this.signalingChannel.send({
        type: 'broadcast',
        event: 'answer',
        payload: {
          to: payload.from,
          answer: answer,
        },
      });

    } catch (error) {
      console.error('[WebRTC] Error handling offer:', error);
      peer.connectionState = 'failed';
      peer.lastSeen = new Date();
    }
  }

  private async handleAnswer(payload: any): Promise<void> {
    if (payload.to !== this.localPeerId) return;

    const peer = this.peers.get(payload.from);
    if (!peer || !peer.connection) return;

    try {
      await peer.connection.setRemoteDescription(payload.answer);
      peer.lastSeen = new Date();
    } catch (error) {
      console.error('[WebRTC] Error handling answer:', error);
      peer.connectionState = 'failed';
      peer.lastSeen = new Date();
    }
  }

  private async handleIceCandidate(payload: any): Promise<void> {
    if (payload.to !== this.localPeerId) return;

    const peer = this.peers.get(payload.from);
    if (!peer || !peer.connection) return;

    try {
      await peer.connection.addIceCandidate(payload.candidate);
      peer.lastSeen = new Date();
    } catch (error) {
      console.error('[WebRTC] Error handling ICE candidate:', error);
    }
  }

  private handleMessage(peerId: string, message: string): void {
    try {
      const parsedMessage = JSON.parse(message);
      const chatMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: this.peers.get(peerId)?.name || 'Unknown',
        content: parsedMessage.content,
        timestamp: new Date(),
        type: 'text',
      };
      
      // Update peer's last seen
      const peer = this.peers.get(peerId);
      if (peer) {
        peer.lastSeen = new Date();
      }
      
      // Emit message event
      this.onMessage?.(chatMessage);
    } catch (error) {
      console.error('[WebRTC] Error parsing message:', error);
    }
  }

  // Public methods
  onMessage?: (message: ChatMessage) => void;
  onPeerJoin?: (peer: Peer) => void;
  onPeerLeave?: (peer: Peer) => void;

  getPeers(): Peer[] {
    try {
      return Array.from(this.peers.values());
    } catch (error) {
      console.error('[WebRTC] Error getting peers:', error);
      return [];
    }
  }

  async sendMessage(content: string): Promise<void> {
    try {
      const message = {
        content,
        timestamp: new Date().toISOString(),
      };

      // Send to all connected peers
      this.peers.forEach((peer) => {
        if (peer.dataChannel && peer.dataChannel.readyState === 'open') {
          try {
            peer.dataChannel.send(JSON.stringify(message));
          } catch (error) {
            console.error(`[WebRTC] Error sending message to ${peer.name}:`, error);
          }
        }
      });

      // Create local message
      const localMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: this.localName,
        content,
        timestamp: new Date(),
        type: 'text',
      };

      this.onMessage?.(localMessage);
    } catch (error) {
      console.error('[WebRTC] Error sending message:', error);
    }
  }

  forceReconnect(peerId: string): void {
    try {
      const peer = this.peers.get(peerId);
      if (!peer) {
        console.warn(`[WebRTC] Peer ${peerId} not found for reconnection`);
        return;
      }

      console.log(`[WebRTC] Force reconnecting to ${peer.name}`);
      
      // Reset reconnect attempts
      this.reconnectAttempts.delete(peerId);
      
      // Clean up existing connection
      if (peer.connection) {
        try {
          peer.connection.close();
        } catch (error) {
          console.error(`[WebRTC] Error closing connection for ${peer.name}:`, error);
        }
        peer.connection = undefined;
      }
      if (peer.dataChannel) {
        try {
          peer.dataChannel.close();
        } catch (error) {
          console.error(`[WebRTC] Error closing data channel for ${peer.name}:`, error);
        }
        peer.dataChannel = undefined;
      }

      // Reset connection state and attempt new connection
      peer.connectionState = 'connecting';
      peer.lastSeen = new Date();
      this.createOffer(peerId);
    } catch (error) {
      console.error('[WebRTC] Error in forceReconnect:', error);
    }
  }

  async disconnect(): Promise<void> {
    try {
      // Clear all timeouts
      this.connectionTimeouts.forEach((timeout) => {
        try {
          clearTimeout(timeout);
        } catch (error) {
          console.error('[WebRTC] Error clearing timeout:', error);
        }
      });
      this.connectionTimeouts.clear();

      this.reconnectAttempts.clear(); // Clear reconnect attempts on disconnect

      this.peers.forEach((peer) => {
        if (peer.connection) {
          try {
            peer.connection.close();
          } catch (error) {
            console.error(`[WebRTC] Error closing connection for ${peer.name}:`, error);
          }
        }
        if (peer.dataChannel) {
          try {
            peer.dataChannel.close();
          } catch (error) {
            console.error(`[WebRTC] Error closing data channel for ${peer.name}:`, error);
          }
        }
      });
      this.peers.clear();
      
      if (this.signalingChannel) {
        try {
          await this.signalingChannel.unsubscribe();
        } catch (error) {
          console.error('[WebRTC] Error unsubscribing from signaling channel:', error);
        }
      }
      
      this.isInitialized = false;
    } catch (error) {
      console.error('[WebRTC] Error during disconnect:', error);
    }
  }
}

// Export singleton instance
export const webRTCChat = new WebRTCChat();