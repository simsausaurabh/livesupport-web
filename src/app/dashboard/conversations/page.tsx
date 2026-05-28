'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { conversationsApi } from '@/lib/api';
import { useSocket } from '@/hooks/useSocket';
import { formatDistanceToNowStrict } from 'date-fns';
import { Search, RefreshCw, MessageSquare, Inbox, Bot, User, Filter } from 'lucide-react';

const STATUS_TABS = [
  { key: '',         label: 'All',      color: 'var(--text-3)' },
  { key: 'OPEN',     label: 'Open',     color: 'var(--amber)' },
  { key: 'BOT',      label: 'Bot',      color: 'var(--purple)' },
  { key: 'ASSIGNED', label: 'Assigned', color: 'var(--blue)' },
  { key: 'RESOLVED', label: 'Resolved', color: 'var(--green)' },
];

function statusStyle(status: string) {
  const map: Record<string, string> = {
    OPEN:      'badge-amber', ASSIGNED: 'badge-blue',
    BOT:       'badge-purple', RESOLVED: 'badge-green', ABANDONED: 'badge-muted',
  };
  return map[status] ?? 'badge-muted';
}

export default function ConversationsPage() {
  const router = useRouter();
  const { on }  = useSocket();

  const [conversations, setConversations] = useState<any[]>([]);
  const [total, setTotal]       = useState(0);
  const [loading, setLoading]   = useState(true);
  const [status, setStatus]     = useState('');
  const [search, setSearch]     = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [refreshing, setRefreshing]   = useState(false);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const data = await conversationsApi.list({ status: status || undefined, search: search || undefined });
      setConversations(data.items);
      setTotal(data.total);
    } catch (e) { console.error(e); }
    finally { setLoading(false); setRefreshing(false); }
  }, [status, search]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const off1 = on('conversation:new',     () => load(true));
    const off2 = on('message:new',          () => load(true));
    const off3 = on('conversation:updated', () => load(true));
    return () => { off1(); off2(); off3(); };
  }, [on, load]);

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  const openCount = conversations.filter(c => c.status === 'OPEN').length;
  const botCount  = conversations.filter(c => c.status === 'BOT').length;

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>

      {/* Conversation List Panel */}
      <div style={{ width: 340, flexShrink: 0, borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', background: 'var(--bg-1)' }}>

        {/* Header */}
        <div style={{ padding: '16px 16px 10px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <h1 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em' }}>Inbox</h1>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                {openCount > 0 && (
                  <span style={{ fontSize: 11, color: 'var(--amber)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--amber)', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                    {openCount} open
                  </span>
                )}
                {botCount > 0 && (
                  <span style={{ fontSize: 11, color: 'var(--purple)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Bot size={10} /> {botCount} bot
                  </span>
                )}
              </div>
            </div>
            <button onClick={() => load(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 8, color: 'var(--text-3)', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-2)'; e.currentTarget.style.color = 'var(--text)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-3)'; }}>
              <RefreshCw size={14} style={{ animation: refreshing ? 'spin 0.7s linear infinite' : 'none' }} />
            </button>
          </div>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', pointerEvents: 'none' }} />
            <input className="input" style={{ paddingLeft: 30, fontSize: 13, height: 36 }}
              placeholder="Search conversations…"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            />
          </div>
        </div>

        {/* Status tabs */}
        <div style={{ display: 'flex', padding: '6px 10px', gap: 2, borderBottom: '1px solid var(--border)', background: 'var(--bg-2)' }}>
          {STATUS_TABS.map(tab => (
            <button key={tab.key} onClick={() => setStatus(tab.key)} style={{
              flex: 1, padding: '5px 4px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 11.5,
              fontWeight: status === tab.key ? 700 : 400,
              background: status === tab.key ? 'var(--bg-1)' : 'transparent',
              color: status === tab.key ? tab.color : 'var(--text-3)',
              boxShadow: status === tab.key ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.15s', fontFamily: 'var(--font-sans)',
            }}>{tab.label}</button>
          ))}
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loading ? (
            <div style={{ padding: '20px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[1,2,3,4].map(i => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div className="skeleton" style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0 }} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div className="skeleton" style={{ height: 12, width: '60%' }} />
                    <div className="skeleton" style={{ height: 10, width: '80%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : conversations.length === 0 ? (
            <div style={{ padding: 48, textAlign: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--bg-2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <Inbox size={22} color="var(--text-3)" />
              </div>
              <p style={{ color: 'var(--text-3)', fontSize: 13 }}>No conversations found</p>
            </div>
          ) : (
            conversations.map(conv => (
              <ConvRow key={conv.id} conv={conv} onClick={() => router.push(`/dashboard/conversations/${conv.id}`)} />
            ))
          )}
        </div>

        {/* Total count */}
        {!loading && conversations.length > 0 && (
          <div style={{ padding: '8px 14px', borderTop: '1px solid var(--border)', fontSize: 11, color: 'var(--text-3)', background: 'var(--bg-2)', textAlign: 'center' }}>
            {total} total conversation{total !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Empty state */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <div style={{ width: 64, height: 64, borderRadius: 18, background: 'linear-gradient(135deg,var(--blue-light),var(--green-light))', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <MessageSquare size={28} color="var(--blue)" />
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text)', fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Select a conversation</p>
          <p style={{ color: 'var(--text-3)', fontSize: 13 }}>Choose from the inbox to start replying</p>
        </div>
      </div>
    </div>
  );
}

function ConvRow({ conv, onClick }: { conv: any; onClick: () => void }) {
  const visitor = conv.visitor;
  const lastMsg = conv.messages?.[0];
  const visitorName = visitor?.name || visitor?.email || 'Anonymous';

  return (
    <div onClick={onClick} style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)', cursor: 'pointer', transition: 'background 0.1s' }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-2)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: conv.chatbotId ? 'var(--purple-light)' : 'var(--blue-light)', border: `1px solid ${conv.chatbotId ? 'var(--purple)' : 'var(--blue-mid)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: conv.chatbotId ? 'var(--purple)' : 'var(--blue)', flexShrink: 0 }}>
            {conv.chatbotId ? <Bot size={13} /> : visitorName.charAt(0).toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{visitorName}</div>
            {conv.assignedAgent && <div style={{ fontSize: 11, color: 'var(--blue)', marginTop: 1 }}>→ {conv.assignedAgent.name}</div>}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
          <span className={statusStyle(conv.status)}>{conv.status}</span>
          <span style={{ fontSize: 10, color: 'var(--text-3)' }}>
            {formatDistanceToNowStrict(new Date(conv.updatedAt), { addSuffix: true })}
          </span>
        </div>
      </div>
      {lastMsg && (
        <div style={{ fontSize: 12, color: 'var(--text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingLeft: 38 }}>
          {lastMsg.senderType === 'AGENT' ? '↩ ' : lastMsg.senderType === 'BOT' ? '🤖 ' : ''}{lastMsg.content}
        </div>
      )}
    </div>
  );
}
