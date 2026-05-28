'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { conversationsApi, cannedApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { useSocket, getSocket } from '@/hooks/useSocket';
import { formatDistanceToNowStrict, format } from 'date-fns';
import {
  ArrowLeft, Send, Sparkles, CheckCheck, User, Bot, Lock,
  X, ChevronRight, AlertTriangle, UserCheck, Phone, Globe, Monitor,
} from 'lucide-react';

export default function ConversationPage() {
  const { id }    = useParams<{ id: string }>();
  const router    = useRouter();
  const { agent } = useAuthStore();

  const [conv,        setConv]        = useState<any>(null);
  const [messages,    setMessages]    = useState<any[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [input,       setInput]       = useState('');
  const [isInternal,  setIsInternal]  = useState(false);
  const [sending,     setSending]     = useState(false);
  const [isTyping,    setIsTyping]    = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSug,  setLoadingSug]  = useState(false);
  const [resolving,   setResolving]   = useState(false);
  const [handingOff,  setHandingOff]  = useState(false);
  const [cannedResults, setCannedResults] = useState<any[]>([]);
  const [showHandoff, setShowHandoff] = useState(false);
  const [handoffNote, setHandoffNote] = useState('');

  const bottomRef    = useRef<HTMLDivElement>(null);
  const typingTimer  = useRef<ReturnType<typeof setTimeout>>();
  const textareaRef  = useRef<HTMLTextAreaElement>(null);

  const load = useCallback(async () => {
    try {
      const data = await conversationsApi.get(id);
      setConv(data);
      setMessages((data.messages ?? []).sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
    } catch { router.push('/dashboard/conversations'); }
    finally { setLoading(false); }
  }, [id]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  // Real-time — join conversation room and listen for all message/typing events
  const { on, emit } = useSocket();

  useEffect(() => {
    if (!id) return;

    // Ensure we're in the org room
    if (agent?.organizationId) emit('agent:join', { organizationId: agent.organizationId });

    const onMsg = (msg: any) => {
      if (msg.conversationId !== id) return;
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== msg.id);
        return [...filtered, msg].sort((a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });
      setIsTyping('');
    };

    const onVisitorTyping = ({ conversationId, isTyping: t }: any) => {
      if (conversationId === id) setIsTyping(t ? 'Visitor' : '');
    };

    const onAgentTyping = ({ conversationId, isTyping: t, agentName, name }: any) => {
      if (conversationId === id) setIsTyping(t ? (agentName || name || 'Agent') : '');
    };

    const onUpdated = (conv: any) => { if (conv.id === id) load(); };

    const off1 = on('message:new',          onMsg);
    const off2 = on('visitor:typing',       onVisitorTyping);
    const off3 = on('agent:typing',         onAgentTyping);
    const off4 = on('conversation:updated', onUpdated);

    return () => { off1(); off2(); off3(); off4(); };
  }, [id, agent?.organizationId, on, emit]);

  // Canned autocomplete — triggers on /
  const handleInputChange = async (val: string) => {
    setInput(val);
    if (val.startsWith('/') && val.length > 1) {
      const results = await cannedApi.list(val.slice(1)).catch(() => []);
      setCannedResults(results.slice(0, 5));
    } else {
      setCannedResults([]);
    }
  };

  const fetchSuggestions = async () => {
    setLoadingSug(true); setSuggestions([]);
    try { const d = await conversationsApi.getSuggestions(id); setSuggestions(d.suggestions); }
    catch (e: any) { setSuggestions(e.code === 'PLAN_LIMIT' ? ['⚡ Upgrade to unlock AI suggestions'] : ['Could not load suggestions']); }
    finally { setLoadingSug(false); }
  };

  const emitTyping = () => {
    emit('agent:typing', { conversationId: id, isTyping: true });
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() =>
      emit('agent:typing', { conversationId: id, isTyping: false }), 2000);
  };

  const send = async (content = input, aiSuggested = false) => {
    const text = content.trim();
    if (!text || sending) return;
    setSending(true); setInput(''); setSuggestions([]); setCannedResults([]);
    try { await conversationsApi.sendMessage(id, text, isInternal, aiSuggested); setIsInternal(false); }
    catch (e) { console.error(e); }
    finally { setSending(false); }
  };

  const resolve = async () => {
    setResolving(true);
    try { await conversationsApi.resolve(id); await load(); }
    finally { setResolving(false); }
  };

  const doHandoff = async () => {
    setHandingOff(true);
    try { await conversationsApi.handoff(id, handoffNote); setShowHandoff(false); await load(); }
    catch (e: any) { alert(e.message); }
    finally { setHandingOff(false); }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { setCannedResults([]); return; }
    if (cannedResults.length > 0 && e.key === 'Enter') { e.preventDefault(); send(cannedResults[0].content); return; }
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); return; }
    emitTyping();
  };

  if (loading) return (
    <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', height:'100%' }}>
      <div style={{ width:24, height:24, border:'2px solid var(--border)', borderTopColor:'var(--blue)', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} />
    </div>
  );

  const visitor = conv?.visitor;
  const visitorName = visitor?.name || visitor?.email || 'Anonymous';
  const isResolved = conv?.status === 'RESOLVED';
  const isBot = conv?.status === 'BOT';

  return (
    <div style={{ display:'flex', height:'100%', overflow:'hidden' }}>

      {/* ── Thread ──────────────────────────────────────── */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>

        {/* Header */}
        <div style={{ padding:'12px 16px', borderBottom:'1px solid var(--border)', background:'var(--bg-1)', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <button onClick={() => router.push('/dashboard/conversations')} className="btn-ghost" style={{ padding:7, borderRadius:8 }}>
              <ArrowLeft size={15} />
            </button>
            <div style={{ width:36, height:36, borderRadius:'50%', background: isBot ? 'var(--purple-light)' : 'var(--blue-light)', border:`2px solid ${isBot ? 'var(--purple)' : 'var(--blue-mid)'}`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:14, color:isBot ? 'var(--purple)' : 'var(--blue)' }}>
              {isBot ? <Bot size={16} /> : visitorName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight:700, fontSize:14, color:'var(--text)', letterSpacing:'-0.01em' }}>{visitorName}</div>
              <div style={{ fontSize:11.5, color:'var(--text-3)', marginTop:1 }}>
                {visitor?.email && <span>{visitor.email}</span>}
                {conv?.assignedAgent && <span style={{ color:'var(--blue)' }}> · {conv.assignedAgent.name}</span>}
                {isBot && <span style={{ color:'var(--purple)' }}> · 🤖 Bot handling</span>}
              </div>
            </div>
          </div>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            {isBot && !conv?.botHandedOff && (
              <button onClick={() => setShowHandoff(true)} className="btn" style={{ background:'var(--purple-light)', color:'var(--purple)', fontSize:12, padding:'6px 12px', border:'1px solid rgba(124,58,237,0.2)' }}>
                <UserCheck size={13} /> Take over
              </button>
            )}
            {!isResolved && (
              <button onClick={resolve} disabled={resolving} className="btn-green" style={{ fontSize:12, padding:'6px 14px' }}>
                <CheckCheck size={13} /> {resolving ? 'Resolving…' : 'Resolve'}
              </button>
            )}
            {isResolved && <span className="badge-green" style={{ padding:'5px 10px' }}>✓ Resolved</span>}
          </div>
        </div>

        {/* Bot handoff alert */}
        {isBot && !conv?.botHandedOff && (
          <div style={{ padding:'10px 16px', background:'var(--purple-light)', borderBottom:'1px solid rgba(124,58,237,0.15)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, color:'var(--purple)' }}>
              <Bot size={14} />
              <span><strong>AI chatbot</strong> is handling this conversation. You can take over any time.</span>
            </div>
          </div>
        )}

        {/* Handoff panel */}
        {showHandoff && (
          <div style={{ margin:'12px 16px', padding:'14px 16px', background:'var(--blue-light)', border:'1px solid var(--blue-mid)', borderRadius:12 }}>
            <div style={{ fontSize:13, fontWeight:700, color:'var(--blue)', marginBottom:10 }}>Take over from bot</div>
            <textarea className="input" rows={2} placeholder="Optional: describe why you're taking over (visible to visitor)…" value={handoffNote} onChange={e => setHandoffNote(e.target.value)} style={{ marginBottom:10, resize:'none' }} />
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={doHandoff} disabled={handingOff} className="btn-primary" style={{ fontSize:12 }}>
                <UserCheck size={12} /> {handingOff ? 'Taking over…' : 'Take over conversation'}
              </button>
              <button onClick={() => setShowHandoff(false)} className="btn-secondary" style={{ fontSize:12 }}>Cancel</button>
            </div>
          </div>
        )}

        {/* Messages */}
        <div style={{ flex:1, overflowY:'auto', padding:'16px', display:'flex', flexDirection:'column', gap:14 }}>
          {messages.map(msg => <MessageBubble key={msg.id} msg={msg} agentId={agent?.id ?? ''} />)}
          {isTyping && (
            <div style={{ display:'flex', alignItems:'center', gap:8, color:'var(--text-3)', fontSize:12 }}>
              <div style={{ display:'flex', gap:3 }}>
                {[0,1,2].map(i => <span key={i} style={{ width:5, height:5, borderRadius:'50%', background:'var(--text-3)', display:'inline-block', animation:'pulseDot 1.4s infinite', animationDelay:`${i*0.2}s` }} />)}
              </div>
              <span>{isTyping} is typing…</span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* AI suggestions */}
        {suggestions.length > 0 && (
          <div style={{ padding:'10px 14px', background:'var(--blue-light)', borderTop:'1px solid var(--blue-mid)' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
              <div style={{ display:'flex', alignItems:'center', gap:5, color:'var(--blue)', fontSize:12, fontWeight:700 }}>
                <Sparkles size={12} /> AI Suggestions
              </div>
              <button onClick={() => setSuggestions([])} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-3)' }}><X size={12} /></button>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {suggestions.map((s, i) => (
                <div key={i} onClick={() => send(s, true)} style={{ padding:'9px 12px', borderRadius:8, background:'var(--bg-1)', border:'1px solid var(--border)', fontSize:13, color:'var(--text)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'space-between', gap:8, transition:'border-color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--blue)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <span style={{ flex:1 }}>{s}</span>
                  <ChevronRight size={12} color="var(--text-3)" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Canned autocomplete */}
        {cannedResults.length > 0 && (
          <div style={{ margin:'0 14px 8px', border:'1px solid var(--border)', borderRadius:10, background:'var(--bg-1)', boxShadow:'var(--shadow)', overflow:'hidden' }}>
            {cannedResults.map((c, i) => (
              <div key={i} onClick={() => { setInput(c.content); setCannedResults([]); textareaRef.current?.focus(); }}
                style={{ padding:'9px 14px', cursor:'pointer', borderBottom: i < cannedResults.length-1 ? '1px solid var(--border)' : 'none', transition:'background 0.1s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--blue-light)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <code style={{ fontSize:11, color:'var(--blue)', fontFamily:'var(--font-mono)', fontWeight:600 }}>/{c.shortcut}</code>
                <span style={{ fontSize:12, color:'var(--text-2)', marginLeft:8 }}>{c.title}</span>
              </div>
            ))}
          </div>
        )}

        {/* Input */}
        {!isResolved && (
          <div style={{ borderTop:'1px solid var(--border)', background:'var(--bg-1)' }}>
            <div style={{ display:'flex', gap:6, padding:'8px 14px 0' }}>
              {['Reply','Internal note'].map((label, i) => {
                const active = i === 0 ? !isInternal : isInternal;
                return (
                  <button key={label} onClick={() => setIsInternal(i === 1)} style={{
                    fontSize:12, fontWeight:active ? 700 : 400, padding:'4px 10px', borderRadius:6, border:'none', cursor:'pointer',
                    background: active ? (i===1 ? 'rgba(37,99,235,0.1)' : 'var(--blue-light)') : 'transparent',
                    color: active ? (i===1 ? 'var(--blue)' : 'var(--blue)') : 'var(--text-3)',
                    fontFamily:'var(--font-sans)', display:'flex', alignItems:'center', gap:4,
                  }}>
                    {i===1 && <Lock size={10} />}{label}
                  </button>
                );
              })}
            </div>
            <div style={{ display:'flex', alignItems:'flex-end', gap:8, padding:'8px 14px 12px' }}>
              <textarea ref={textareaRef} className="input" style={{ flex:1, resize:'none', minHeight:40, maxHeight:120, fontSize:13, background: isInternal ? 'rgba(37,99,235,0.04)' : undefined }}
                placeholder={isInternal ? 'Internal note (only agents see this)…' : 'Type a reply… (Enter to send, Shift+Enter for newline)'}
                value={input}
                onChange={e => handleInputChange(e.target.value)}
                onKeyDown={handleKey}
                rows={1}
              />
              <button onClick={fetchSuggestions} disabled={loadingSug} title="AI suggestions" style={{
                width:38, height:38, borderRadius:8, border:'1px solid var(--blue-mid)',
                background:'var(--blue-light)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
                flexShrink:0, opacity: loadingSug ? 0.6 : 1, transition:'all 0.15s',
              }}>
                <Sparkles size={15} color="var(--blue)" />
              </button>
              <button onClick={() => send()} disabled={!input.trim() || sending} className="btn-primary" style={{ height:38, padding:'0 14px', flexShrink:0, opacity:(!input.trim()||sending) ? 0.5 : 1, fontSize:13 }}>
                <Send size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Visitor Info Panel ─────────────────────── */}
      <div style={{ width:256, flexShrink:0, overflowY:'auto', background:'var(--bg-1)', borderLeft:'1px solid var(--border)', padding:'16px 14px' }}>
        <SideSection title="Visitor">
          <InfoRow icon={<User size={11}/>}   label="Name"    value={visitor?.name} />
          <InfoRow icon={<span>@</span>}       label="Email"   value={visitor?.email} />
          <InfoRow icon={<Globe size={11}/>}   label="Country" value={visitor?.country} />
          <InfoRow icon={<Monitor size={11}/>} label="Browser" value={visitor?.browserName} />
          {visitor?.currentUrl && (
            <div style={{ marginTop:8 }}>
              <div style={{ fontSize:10, fontWeight:700, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:4 }}>Current URL</div>
              <div style={{ fontSize:11, color:'var(--blue)', wordBreak:'break-all', lineHeight:1.4 }}>{visitor.currentUrl}</div>
            </div>
          )}
        </SideSection>

        <SideSection title="Conversation">
          <InfoRow label="Status"   value={conv?.status} />
          <InfoRow label="Messages" value={String(conv?.messageCount ?? 0)} />
          <InfoRow label="Started"  value={conv?.createdAt ? formatDistanceToNowStrict(new Date(conv.createdAt), { addSuffix:true }) : undefined} />
          {conv?.durationSeconds && <InfoRow label="Duration" value={`${Math.round(conv.durationSeconds/60)}m`} />}
          {conv?.firstResponseSeconds && <InfoRow label="1st response" value={`${Math.round(conv.firstResponseSeconds/60)}m`} />}
        </SideSection>

        {conv?.aiSummary && (
          <SideSection title="AI Summary">
            <div style={{ fontSize:12, color:'var(--text-2)', lineHeight:1.55, background:'var(--blue-light)', borderRadius:8, padding:'10px 12px', border:'1px solid var(--blue-mid)' }}>
              <Sparkles size={11} color="var(--blue)" style={{ display:'inline', marginRight:4 }} />
              {conv.aiSummary}
            </div>
          </SideSection>
        )}

        {conv?.rating && (
          <SideSection title="Rating">
            <div style={{ display:'flex', gap:2, marginBottom:6 }}>
              {[1,2,3,4,5].map(n => <span key={n} style={{ fontSize:18, color: n<=conv.rating ? '#d97706' : 'var(--border-2)' }}>★</span>)}
            </div>
            {conv.ratingComment && <div style={{ fontSize:12, color:'var(--text-2)', lineHeight:1.5 }}>{conv.ratingComment}</div>}
          </SideSection>
        )}
      </div>
    </div>
  );
}

function MessageBubble({ msg, agentId }: { msg: any; agentId: string }) {
  const isVisitor  = msg.senderType === 'VISITOR';
  const isBot      = msg.senderType === 'BOT';
  const isSystem   = msg.senderType === 'SYSTEM';
  const isInternal = msg.isInternalNote;

  if (isSystem) return (
    <div style={{ textAlign:'center', fontSize:11, color:'var(--text-3)', padding:'2px 0', display:'flex', alignItems:'center', gap:8 }}>
      <div style={{ flex:1, height:1, background:'var(--border)' }} />
      <span>{msg.content}</span>
      <div style={{ flex:1, height:1, background:'var(--border)' }} />
    </div>
  );

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems: isVisitor ? 'flex-start' : 'flex-end', gap:3 }}>
      <div style={{ display:'flex', alignItems:'flex-end', gap:7, flexDirection: isVisitor ? 'row' : 'row-reverse' }}>
        <div style={{ width:26, height:26, borderRadius:'50%', flexShrink:0, background: isVisitor ? 'var(--bg-3)' : isBot ? 'var(--purple-light)' : 'var(--blue-light)', border:`1px solid ${isBot ? 'rgba(124,58,237,0.2)' : isVisitor ? 'var(--border)' : 'var(--blue-mid)'}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
          {isVisitor ? <User size={11} color="var(--text-3)" /> : isBot ? <Bot size={11} color="var(--purple)" /> : <span style={{ fontSize:9, fontWeight:800, color:'var(--blue)' }}>AG</span>}
        </div>
        <div style={{ maxWidth:'68%', padding:'10px 13px', borderRadius:14, fontSize:13, lineHeight:1.55, wordBreak:'break-word',
          background: isVisitor ? 'var(--bg-2)' : isInternal ? 'rgba(37,99,235,0.06)' : isBot ? 'var(--purple-light)' : 'var(--blue-light)',
          border:`1px solid ${isInternal ? 'rgba(37,99,235,0.15)' : isBot ? 'rgba(124,58,237,0.15)' : isVisitor ? 'var(--border)' : 'var(--blue-mid)'}`,
          color:'var(--text)',
          borderBottomLeftRadius: isVisitor ? 4 : 14,
          borderBottomRightRadius: isVisitor ? 14 : 4,
          boxShadow:'var(--shadow-sm)',
        }}>
          {isInternal && <div style={{ fontSize:10, color:'var(--blue)', fontWeight:700, marginBottom:4, display:'flex', alignItems:'center', gap:3 }}><Lock size={9} /> Internal note</div>}
          {msg.isAiSuggested && <div style={{ fontSize:10, color:'var(--blue)', fontWeight:700, marginBottom:4, display:'flex', alignItems:'center', gap:3 }}><Sparkles size={9} /> AI suggested</div>}
          <span style={{ whiteSpace:'pre-wrap' }}>{msg.content}</span>
        </div>
      </div>
      <span style={{ fontSize:10, color:'var(--text-3)', padding:`0 ${isVisitor ? 0 : 0}px`, marginLeft: isVisitor ? 33 : 0, marginRight: isVisitor ? 0 : 33 }}>
        {format(new Date(msg.createdAt), 'h:mm a')}
      </span>
    </div>
  );
}

function SideSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom:20 }}>
      <div style={{ fontSize:10, fontWeight:800, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:10, paddingBottom:6, borderBottom:'1px solid var(--border)' }}>{title}</div>
      {children}
    </div>
  );
}

function InfoRow({ label, value, icon }: { label: string; value?: string|null; icon?: React.ReactNode }) {
  if (!value) return null;
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:7, gap:8 }}>
      <span style={{ fontSize:11, color:'var(--text-3)', flexShrink:0 }}>{label}</span>
      <span style={{ fontSize:11.5, color:'var(--text-2)', fontWeight:500, textAlign:'right', wordBreak:'break-all' }}>{value}</span>
    </div>
  );
}
