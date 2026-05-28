'use client';
import { useEffect, useCallback } from 'react';
import { io, type Socket }        from 'socket.io-client';
import { useAuthStore }           from '@/store/auth';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? 'http://localhost:4000';

// ── Global singleton socket ───────────────────────────────────────────────
// One socket per browser tab, shared across all components.
let _socket: Socket | null = null;
let _connecting            = false;

function getOrCreateSocket(token: string, orgId: string): Socket {
  if (_socket?.connected) return _socket;
  if (_connecting && _socket) return _socket;

  _connecting = true;
  _socket = io(WS_URL, {
    auth:              { token },
    transports:        ['websocket', 'polling'],
    reconnection:      true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 20,
  });

  _socket.on('connect', () => {
    _connecting = false;
    console.log('[LiveSupport] agent socket connected:', _socket!.id);
    _socket!.emit('agent:join', { organizationId: orgId });
  });

  _socket.on('reconnect', () => {
    console.log('[LiveSupport] socket reconnected, rejoining org room');
    _socket!.emit('agent:join', { organizationId: orgId });
  });

  _socket.on('connect_error', (err) => {
    _connecting = false;
    console.warn('[LiveSupport] socket connect error:', err.message);
  });

  return _socket;
}

// ── Hook ──────────────────────────────────────────────────────────────────
export function useSocket() {
  const { token, organization } = useAuthStore();

  useEffect(() => {
    if (!token || !organization) return;
    getOrCreateSocket(token, organization.id);
  }, [token, organization]);

  // emit — always uses the live global socket
  const emit = useCallback((event: string, data?: any) => {
    if (_socket?.connected) {
      _socket.emit(event, data);
    } else {
      // Queue after connect
      _socket?.once('connect', () => _socket?.emit(event, data));
    }
  }, []);

  // on — register listener on global socket; returns off() cleanup
  const on = useCallback((event: string, handler: (...args: any[]) => void) => {
    const s = _socket;
    if (!s) return () => {};
    s.on(event, handler);
    return () => { s.off(event, handler); };
  }, []);

  return { emit, on, socket: _socket };
}

// ── Direct access for non-hook code ──────────────────────────────────────
export function getSocket() { return _socket; }
