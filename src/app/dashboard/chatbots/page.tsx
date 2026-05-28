'use client';
import { useEffect, useState } from 'react';
import { chatbotApi, knowledgeApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { Bot, Plus, Trash2, Play, Pause, Edit3, BookOpen, Lock, Zap, X, Check } from 'lucide-react';
import Link from 'next/link';

const STATUS_STYLE: Record<string, string> = {
  ACTIVE: 'badge-green', PAUSED: 'badge-amber', DRAFT: 'badge-muted',
};

export default function ChatbotsPage() {
  const { organization } = useAuthStore();
  const plan = organization?.plan ?? 'FREE';
  const maxBots = plan === 'FREE' ? 0 : plan === 'STARTER' ? 1 : plan === 'TEAM' ? 10 : 50;
  const canUse  = maxBots > 0;

  const [bots,    setBots]    = useState<any[]>([]);
  const [sources, setSources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editBot,  setEditBot]  = useState<any>(null);
  const [saving,   setSaving]   = useState(false);
  const [form, setForm] = useState({
    name: '', persona: '', welcomeMessage: '', handoffMessage: 'Let me connect you with a human agent.',
    handoffKeywords: 'human,agent,speak to someone,talk to person', autoHandoff: true,
    knowledgeIds: [] as string[],
  });

  const load = async () => {
    setLoading(true);
    try {
      const [b, s] = await Promise.all([chatbotApi.list(), knowledgeApi.list()]);
      setBots(b); setSources(s);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditBot(null);
    setForm({ name:'', persona:'You are a helpful support assistant. Be concise, friendly, and accurate.', welcomeMessage:'Hi! 👋 How can I help you today?', handoffMessage:'Let me connect you with a human agent.', handoffKeywords:'human,agent,speak to someone', autoHandoff:true, knowledgeIds:[] });
    setShowForm(true);
  };

  const openEdit = (bot: any) => {
    setEditBot(bot);
    setForm({ name:bot.name, persona:bot.persona, welcomeMessage:bot.welcomeMessage, handoffMessage:bot.handoffMessage, handoffKeywords:bot.handoffKeywords, autoHandoff:bot.autoHandoff, knowledgeIds: bot.knowledgeSources?.map((k: any) => k.id) ?? [] });
    setShowForm(true);
  };

  const save = async () => {
    if (!form.name.trim()) { alert('Name is required'); return; }
    setSaving(true);
    try {
      if (editBot) await chatbotApi.update(editBot.id, form);
      else await chatbotApi.create(form);
      setShowForm(false);
      await load();
    } catch (e: any) { alert(e.message); }
    finally { setSaving(false); }
  };

  const del = async (id: string) => {
    if (!confirm('Delete this chatbot?')) return;
    try { await chatbotApi.delete(id); await load(); }
    catch (e: any) { alert(e.message); }
  };

  const toggle = async (bot: any) => {
    try {
      if (bot.status === 'ACTIVE') await chatbotApi.pause(bot.id);
      else await chatbotApi.activate(bot.id);
      await load();
    } catch (e: any) { alert(e.message); }
  };

  if (!canUse) return (
    <div style={{ height:'100%', display:'flex', alignItems:'center', justifyContent:'center', padding:40 }}>
      <div className="card" style={{ maxWidth:440, padding:40, textAlign:'center' }}>
        <div style={{ width:60, height:60, borderRadius:18, background:'linear-gradient(135deg,var(--blue-light),var(--green-light))', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 18px', border:'1px solid var(--border)' }}>
          <Bot size={28} color="var(--blue)" />
        </div>
        <div className="badge-blue" style={{ marginBottom:16, padding:'4px 12px' }}>Starter plan+</div>
        <h2 style={{ fontSize:20, fontWeight:800, color:'var(--text)', marginBottom:10, letterSpacing:'-0.02em' }}>AI Chatbots</h2>
        <p style={{ fontSize:14, color:'var(--text-3)', lineHeight:1.65, marginBottom:28 }}>
          Deploy AI chatbots trained on your knowledge base to handle common questions 24/7. Auto-handoff to human agents when needed.
        </p>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:28, textAlign:'left' }}>
          {['Starter: 1 bot','Team: 10 bots','Business: 50 bots','Human handoff','Custom persona','Knowledge base'].map(f => (
            <div key={f} style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, color:'var(--text-2)' }}>
              <Check size={13} color="var(--green)" />{f}
            </div>
          ))}
        </div>
        <Link href="/dashboard/billing" style={{ textDecoration:'none' }}>
          <button className="btn-primary" style={{ width:'100%', justifyContent:'center', height:44, fontSize:14 }}>
            <Zap size={14} /> Upgrade to Starter
          </button>
        </Link>
      </div>
    </div>
  );

  return (
    <div style={{ height:'100%', overflowY:'auto', padding:28 }}>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:28 }}>
        <div>
          <h1 style={{ fontSize:20, fontWeight:800, color:'var(--text)', letterSpacing:'-0.02em', marginBottom:4 }}>AI Chatbots</h1>
          <p style={{ fontSize:13, color:'var(--text-3)' }}>{bots.length} / {maxBots} bots used · Handles conversations 24/7, hands off to humans when needed</p>
        </div>
        <button onClick={openCreate} disabled={bots.length >= maxBots} className="btn-primary" style={{ fontSize:13, opacity: bots.length >= maxBots ? 0.5 : 1 }}>
          <Plus size={14} /> New chatbot
        </button>
      </div>

      {/* Create/Edit form */}
      {showForm && (
        <div className="card" style={{ padding:24, marginBottom:24 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
            <h2 style={{ fontSize:15, fontWeight:700, color:'var(--text)' }}>{editBot ? 'Edit chatbot' : 'New chatbot'}</h2>
            <button onClick={() => setShowForm(false)} className="btn-ghost" style={{ padding:6, borderRadius:7 }}><X size={14} /></button>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
            <div>
              <FormField label="Chatbot name">
                <input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name:e.target.value }))} placeholder="e.g. Support Bot" />
              </FormField>
              <FormField label="Welcome message">
                <textarea className="input" rows={2} value={form.welcomeMessage} onChange={e => setForm(f => ({ ...f, welcomeMessage:e.target.value }))} style={{ resize:'vertical' }} />
              </FormField>
              <FormField label="Handoff message (shown when escalating)">
                <input className="input" value={form.handoffMessage} onChange={e => setForm(f => ({ ...f, handoffMessage:e.target.value }))} />
              </FormField>
              <FormField label="Handoff keywords (comma separated)">
                <input className="input" value={form.handoffKeywords} onChange={e => setForm(f => ({ ...f, handoffKeywords:e.target.value }))} placeholder="human,agent,speak to someone" />
              </FormField>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 0' }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:600, color:'var(--text)' }}>Auto-handoff</div>
                  <div style={{ fontSize:11.5, color:'var(--text-3)', marginTop:2 }}>Auto-escalate when bot can't answer</div>
                </div>
                <button onClick={() => setForm(f => ({ ...f, autoHandoff:!f.autoHandoff }))} style={{ width:42, height:24, borderRadius:12, border:'none', cursor:'pointer', background: form.autoHandoff ? 'var(--green)' : 'var(--bg-3)', position:'relative', transition:'background 0.2s' }}>
                  <span style={{ position:'absolute', top:4, left: form.autoHandoff ? 20 : 4, width:16, height:16, borderRadius:'50%', background:'white', transition:'left 0.2s', boxShadow:'0 1px 4px rgba(0,0,0,0.2)' }} />
                </button>
              </div>
            </div>
            <div>
              <FormField label="AI persona / system prompt">
                <textarea className="input" rows={6} value={form.persona} onChange={e => setForm(f => ({ ...f, persona:e.target.value }))} style={{ resize:'vertical', fontFamily:'var(--font-mono)', fontSize:12 }} placeholder="You are a helpful support assistant…" />
              </FormField>
              <FormField label="Knowledge sources (select which the bot can use)">
                <div style={{ display:'flex', flexDirection:'column', gap:6, maxHeight:200, overflowY:'auto' }}>
                  {sources.length === 0
                    ? <p style={{ fontSize:12, color:'var(--text-3)' }}>No knowledge sources yet. <Link href="/dashboard/knowledge" style={{ color:'var(--blue)' }}>Add some →</Link></p>
                    : sources.map(s => {
                        const selected = form.knowledgeIds.includes(s.id);
                        return (
                          <label key={s.id} style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', padding:'8px 10px', borderRadius:8, border:`1px solid ${selected ? 'var(--blue)' : 'var(--border)'}`, background: selected ? 'var(--blue-light)' : 'transparent', transition:'all 0.15s' }}>
                            <input type="checkbox" checked={selected} onChange={() => setForm(f => ({ ...f, knowledgeIds: selected ? f.knowledgeIds.filter(id => id !== s.id) : [...f.knowledgeIds, s.id] }))} style={{ accentColor:'var(--blue)' }} />
                            <div>
                              <div style={{ fontSize:12, fontWeight:600, color:selected ? 'var(--blue)' : 'var(--text)' }}>{s.title}</div>
                              <div style={{ fontSize:10.5, color:'var(--text-3)' }}>{s.type} · {s.charCount?.toLocaleString()} chars</div>
                            </div>
                          </label>
                        );
                      })
                  }
                </div>
              </FormField>
            </div>
          </div>
          <div style={{ display:'flex', gap:8, justifyContent:'flex-end', marginTop:16, paddingTop:16, borderTop:'1px solid var(--border)' }}>
            <button onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
            <button onClick={save} disabled={saving} className="btn-primary" style={{ opacity:saving ? 0.7 : 1 }}>
              {saving ? 'Saving…' : editBot ? 'Save changes' : 'Create chatbot'}
            </button>
          </div>
        </div>
      )}

      {/* Bot list */}
      {loading ? (
        <div style={{ display:'flex', justifyContent:'center', paddingTop:60 }}>
          <div style={{ width:28, height:28, border:'2px solid var(--border)', borderTopColor:'var(--blue)', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} />
        </div>
      ) : bots.length === 0 && !showForm ? (
        <div className="card" style={{ padding:48, textAlign:'center' }}>
          <Bot size={36} color="var(--text-3)" style={{ margin:'0 auto 14px' }} />
          <p style={{ color:'var(--text-2)', fontSize:14, fontWeight:600, marginBottom:6 }}>No chatbots yet</p>
          <p style={{ color:'var(--text-3)', fontSize:13 }}>Create your first chatbot to automate support 24/7.</p>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:14 }}>
          {bots.map(bot => (
            <div key={bot.id} className="card" style={{ padding:20 }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:14 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:38, height:38, borderRadius:12, background:'linear-gradient(135deg,var(--blue-light),var(--purple-light))', border:'1px solid var(--blue-mid)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Bot size={18} color="var(--blue)" />
                  </div>
                  <div>
                    <div style={{ fontSize:14, fontWeight:700, color:'var(--text)' }}>{bot.name}</div>
                    <span className={STATUS_STYLE[bot.status]}>{bot.status}</span>
                  </div>
                </div>
                <div style={{ display:'flex', gap:6 }}>
                  <button onClick={() => toggle(bot)} className={bot.status === 'ACTIVE' ? 'btn-ghost' : 'btn-green'} style={{ padding:'6px 10px', fontSize:12 }}>
                    {bot.status === 'ACTIVE' ? <Pause size={12} /> : <Play size={12} />}
                  </button>
                  <button onClick={() => openEdit(bot)} className="btn-ghost" style={{ padding:'6px 8px' }}><Edit3 size={12} /></button>
                  <button onClick={() => del(bot.id)} className="btn-danger" style={{ padding:'6px 8px' }}><Trash2 size={12} /></button>
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginBottom:12 }}>
                {[{ label:'Chats', value: bot.totalChats }, { label:'Handoffs', value: bot.handoffCount }, { label:'Resolved', value: bot.resolutionCount }].map(s => (
                  <div key={s.label} style={{ background:'var(--bg-2)', borderRadius:8, padding:'8px 10px' }}>
                    <div style={{ fontSize:16, fontWeight:800, color:'var(--text)' }}>{s.value}</div>
                    <div style={{ fontSize:10.5, color:'var(--text-3)', marginTop:2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
              {bot.knowledgeSources?.length > 0 && (
                <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:11.5, color:'var(--text-3)' }}>
                  <BookOpen size={11} />{bot.knowledgeSources.length} knowledge source{bot.knowledgeSources.length>1?'s':''}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom:16 }}>
      <label style={{ display:'block', fontSize:12, fontWeight:600, color:'var(--text-2)', marginBottom:6 }}>{label}</label>
      {children}
    </div>
  );
}
