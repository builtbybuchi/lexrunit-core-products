"use client"

import { useEffect, useRef, useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { MessageCircle, Send, Users, Wifi, WifiOff } from "lucide-react"
import { OfflineChat, type ChatMessage, type Peer } from "@/lib/offline-chat"

export default function ChatsPage() {
  const [userName, setUserName] = useState("")
  const [peers, setPeers] = useState<Peer[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [selectedPeer, setSelectedPeer] = useState<Peer | null>(null)
  const [connectionState, setConnectionState] = useState<string>("")
  const [serverUrl, setServerUrl] = useState<string>("")
  const [showServerPrompt, setShowServerPrompt] = useState(false)
  const [serverUrlError, setServerUrlError] = useState<string>("")
  const [peerStatuses, setPeerStatuses] = useState<{ [peerId: string]: string }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const DEFAULT_SERVER_URL = 'ws://localhost:3001';

  // On mount: get server URL, prompt if not set
  useEffect(() => {
    // Try saved server URL, else default
    let url = localStorage.getItem('offline-chat-server-url') || DEFAULT_SERVER_URL;
    setServerUrl(url);
  }, []);

  // On serverUrl set, initialize chat
  useEffect(() => {
    if (!serverUrl) return
    // Try to get profile name from offline profile
    let name = '';
    try {
      const data = localStorage.getItem('doctorProfileDetails');
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed && parsed.profile && parsed.profile.full_name) {
          name = parsed.profile.full_name;
        }
      }
    } catch {}
    // Fallback to previous logic if no profile name
    if (!name || !name.trim() || name === 'Anonymous') {
      name = localStorage.getItem('offline-chat-username') || '';
      if (!name || !name.trim() || name === 'Anonymous') {
        name = `User-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      }
      localStorage.setItem('offline-chat-username', name);
    }
    setUserName(name);
    OfflineChat.announcePresence(name, serverUrl);
    OfflineChat.subscribePeersUpdate(setPeers);
    OfflineChat.subscribeMessages((msg) => setMessages((prev) => [...prev, msg]));
    OfflineChat.subscribeConnectionState(setConnectionState);
    setMessages(OfflineChat.loadMessages());
    // Listen for per-peer data channel status changes
    (OfflineChat as any).subscribePeerStatus?.((peerId: string, status: string) => {
      setPeerStatuses(prev => ({ ...prev, [peerId]: status }));
    });
    // Optionally: cleanup if you add unsubscribe logic
  }, [serverUrl]);

  // Listen for connection errors and prompt for server if needed
  useEffect(() => {
    if (!serverUrl) return;
    // Patch OfflineChat to allow error callback
    let errorListener = (err: any) => {
      setShowServerPrompt(true);
    };
    (OfflineChat as any)._onWsError = errorListener;
  }, [serverUrl]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = () => {
    if (!newMessage.trim()) return
    if (selectedPeer) {
      // Always initiate connection if not already connected
      OfflineChat.connectToPeer(selectedPeer)
      setTimeout(() => {
        OfflineChat.sendP2PMessage(newMessage.trim(), selectedPeer.id)
        setNewMessage("")
      }, 500)
    } else {
      OfflineChat.sendBroadcastMessage(newMessage.trim())
      setNewMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleServerUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = new URL(serverUrl)
      if (url.protocol !== 'ws:' && url.protocol !== 'wss:') {
        throw new Error()
      }
      localStorage.setItem('offline-chat-server-url', serverUrl)
      setShowServerPrompt(false)
      setServerUrlError("")
      window.location.reload()
    } catch {
      setServerUrlError('Please enter a valid ws:// or wss:// address (e.g., ws://192.168.1.10:3001)')
    }
  }

  return (
    <MainLayout>
      {showServerPrompt ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <form onSubmit={handleServerUrlSubmit} className="space-y-4 bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg border">
            <h2 className="text-xl font-bold mb-2">Enter Signaling Server Address</h2>
            <input
              type="text"
              className="border p-2 rounded w-80"
              placeholder="ws://192.168.1.10:3001"
              value={serverUrl}
              onChange={e => { setServerUrl(e.target.value); setServerUrlError("") }}
              autoFocus
            />
            {serverUrlError && <div className="text-red-500 text-sm">{serverUrlError}</div>}
            <button type="submit" className="bg-[#0A91F9] text-white px-4 py-2 rounded hover:bg-[#021488]">Save & Continue</button>
          </form>
        </div>
      ) : (
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-[#021488] dark:text-[#C5ECF4] tracking-tight">Offline Chat</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Peer-to-peer and broadcast chat (no internet required)</p>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <Badge variant="secondary">You: {userName}</Badge>
            <Badge variant={connectionState === 'connected' ? 'default' : 'outline'} className={connectionState === 'connected' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'}>
              {connectionState === 'connected' ? <Wifi className="inline w-4 h-4 mr-1" /> : <WifiOff className="inline w-4 h-4 mr-1" />} {connectionState || 'disconnected'}
            </Badge>
            <span className="text-xs text-gray-500 mt-1">Server: {serverUrl}</span>
            <button className="text-xs underline text-[#0A91F9]" onClick={() => { setShowServerPrompt(true); }}>Change Server</button>
          </div>
        </div>
        <Card className="shadow-lg border-2 border-[#0A91F9]/10">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-[#0A91F9]" />
              <span>Peers on Network</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {peers.length === 0 && <span className="text-gray-500">No peers found</span>}
              {peers.map((peer) => (
                <Button
                  key={peer.id}
                  size="sm"
                  variant={selectedPeer?.id === peer.id ? "default" : "outline"}
                  className={selectedPeer?.id === peer.id ? 'ring-2 ring-[#0A91F9]' : ''}
                  onClick={() => setSelectedPeer(peer)}
                >
                  <Avatar className="w-6 h-6 mr-2">
                    <AvatarFallback>{peer.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  {peer.name}
                  <span className="ml-2 text-xs">
                    {peerStatuses[peer.id] === 'connected' && <span className="text-green-600">●</span>}
                    {peerStatuses[peer.id] === 'connecting' && <span className="text-yellow-600">●</span>}
                    {peerStatuses[peer.id] === 'disconnected' && <span className="text-gray-400">●</span>}
                    {peerStatuses[peer.id] && <span className="ml-1">{peerStatuses[peer.id]}</span>}
                  </span>
                </Button>
              ))}
              <Button size="sm" variant={!selectedPeer ? "default" : "ghost"} className={!selectedPeer ? 'ring-2 ring-[#0A91F9]' : ''} onClick={() => setSelectedPeer(null)}>
                <MessageCircle className="w-4 h-4 mr-1" /> Broadcast
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-2 border-[#0A91F9]/10">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5 text-[#0A91F9]" />
              <span>Messages</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-72">
              <div className="space-y-2">
                {messages.length === 0 && <div className="text-gray-500">No messages yet</div>}
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex items-start gap-2 ${msg.type === 'p2p' ? 'bg-[#C5ECF4]/40' : 'bg-gray-100 dark:bg-gray-800/40'} rounded-lg px-2 py-1`}>
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>{msg.sender.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#021488]">{msg.sender}</span>
                        <span className="text-xs text-gray-400">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                        <Badge variant={msg.type === 'broadcast' ? 'outline' : 'default'} className={msg.type === 'p2p' ? 'bg-[#0A91F9] text-white' : ''}>{msg.type}</Badge>
                      </div>
                      <div className="text-sm break-words max-w-xs">{msg.content}</div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            <Separator className="my-4" />
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={selectedPeer ? `Message to ${selectedPeer.name}` : "Message to everyone (broadcast)"}
                className="flex-1 border-2 border-[#0A91F9]/30 focus:border-[#0A91F9]"
              />
              <Button onClick={handleSend} disabled={!newMessage.trim() || Boolean(selectedPeer && peerStatuses[selectedPeer.id] !== 'connected')} className="bg-[#0A91F9] hover:bg-[#021488] text-white">
                <Send className="w-4 h-4 mr-1" /> Send
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )}
    </MainLayout>
  )
}
