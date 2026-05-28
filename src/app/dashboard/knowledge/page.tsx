'use client';
import { useEffect, useState, useRef } from 'react';
import { knowledgeApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { BookOpen, Plus, Trash2, Link2, FileText, PenLine, RefreshCw, X, Lock, Zap, Check } from 'lucide-react';
import Link from 'next/link';

const TYPE_ICON: Record<string, React.ReactNode> = {
  URL:    <Link2 size={13} />,
  FILE:   <FileText size={13} />,
  MANUAL: <PenLine size={13} />,
};
const TYPE_COLOR: Record<string, string> = {
  URL: 'var(--blue)', FILE: 'var(--green)', MANUAL: 'var(--amber)',
};
const TYPE_BG: Record<string, string> = {
  URL: 'var(--blue-light)', FILE: 'var(--green-light)', MANUAL: 'var(--amber-light)',
};

type Mode = 'url' | 'file' | 'manual' | null;

export default function KnowledgePage() {
  const { organization } = useAuthStore();
  const plan = organization?.plan ?? 'FREE';
  const maxSources = plan === 'FREE' ? 0 : plan === 'STARTER' ? 5 : plan === 'TEAM' ? 25 : 200;
  const canUse = maxSources > 0;

  const [sources, setSources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode,    setMode]    = useState<Mode>(null);
  const [saving,  setSaving]  = useState(false);
  const [form, setForm] = useState({ title:'', url:'', content:'' });
  const [file, setFile]  = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    try { setSources(await knowledgeApi.list()); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.title.trim()) { alert('Title is required'); return; }
    setSaving(true);
    try {
      if (mode === 'url') {
        if (!form.url.startsWith('http')) { alert('Enter a valid URL'); return; }
        await knowledgeApi.createUrl(form.title, form.url);
      } else if (mode === 'manual') {
        if (!form.content.trim()) { alert('Content is required'); return; }
        await knowledgeApi.createManual(form.title, form.content);
      } else if (mode === 'file') {
        if (!file) { alert('Please select a file'); return; }
        await knowledgeApi.uploadFile(form.title, file);
      }
      setMode(null); setForm({ title:'', url:'', content:'' }); setFile(null);
      await load();
    } catch (e: any) { alert(e.message); }
    finally { setSaving(false); }
  };

  const del = async (id: string) => {
    if (!confirm('Delete this knowledge source?')) return;
    try { await knowledgeApi.delete(id); await load(); }
    catch (e: any) { alert(e.message); }
  };

  const reindex = async (id: string) => {
    try { await knowledgeApi.reindex(id); await load(); }
    catch (e: any) { alert(e.message); }
  };

  if (!canUse) return (
    <div style={{ height:'100%', display:'flex', alignItems:'center', justifyContent:'center', padding:40 }}>
      <div className="card" style={{ maxWidth:440, padding:40, textAlign:'center' }}>
        <div style={{ width:60, height:60, borderRadius:18, background:'var(--green-light)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 18px', border:'1px solid var(--green-mid)' }}>
          <BookOpen size={28} color="var(--green)" />
        </div>
        <div className="badge-blue" style={{ marginBottom:14, padding:'4px 12px' }}>Starter plan+</div>
        <h2 style={{ fontSize:20, fontWeight:800, color:'var(--text)', marginBottom:10, letterSpacing:'-0.02em' }}>Knowledge Base</h2>
        <p style={{ fontSize:14, color:'var(--text-3)', lineHeight:1.65, marginBottom:24 }}>
          Train your AI chatbot using URLs, uploaded files (PDF, DOCX), or manually written articles.
        </p>
        <Link href="/dashboard/billing">
          <button className="btn-primary" style={{ width:'100%', justifyContent:'center', height:44, fontSize:14 }}>
            <Zap size={14} /> Upgrade to unlock
          </button>
        </Link>
      </div>
    </div>
  );

  return (
    <div style={{ height:'100%', overflowY:'auto', padding:28 }}>

      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:28 }}>
        <div>
          <h1 style={{ fontSize:20, fontWeight:800, color:'var(--text)', letterSpacing:'-0.02em', marginBottom:4 }}>Knowledge Base</h1>
          <p style={{ fontSize:13, color:'var(--text-3)' }}>{sources.length} / {maxSources} sources · Used by AI chatbots for accurate answers</p>
        </div>
        {!mode && sources.length < maxSources && (
          <div style={{ display:'flex', gap:8 }}>
            {[{ m:'url' as Mode, icon:<Link2 size={13}/>, label:'URL' }, { m:'file' as Mode, icon:<FileText size={13}/>, label:'File' }, { m:'manual' as Mode, icon:<PenLine size={13}/>, label:'Write' }].map(({ m, icon, label }) => (
              <button key={m} onClick={() => { setMode(m); setForm({ title:'', url:'', content:'' }); setFile(null); }} className="btn-secondary" style={{ fontSize:12, gap:6 }}>
                {icon} {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Add form */}
      {mode && (
        <div className="card" style={{ padding:24, marginBottom:24 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
            <h3 style={{ fontSize:14, fontWeight:700, color:'var(--text)', display:'flex', alignItems:'center', gap:7 }}>
              <span style={{ color: TYPE_COLOR[mode.toUpperCase()] }}>{TYPE_ICON[mode.toUpperCase()]}</span>
              {mode === 'url' ? 'Add from URL' : mode === 'file' ? 'Upload file' : 'Write manually'}
            </h3>
            <button onClick={() => setMode(null)} className="btn-ghost" style={{ padding:6, borderRadius:7 }}><X size={14} /></button>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:'var(--text-2)', display:'block', marginBottom:6 }}>Title</label>
              <input className="input" value={form.title} onChange={e => setForm(f => ({ ...f, title:e.target.value }))} placeholder="e.g. Refund Policy" />
            </div>
            {mode === 'url' && (
              <div>
                <label style={{ fontSize:12, fontWeight:600, color:'var(--text-2)', display:'block', marginBottom:6 }}>URL to crawl</label>
                <input className="input" type="url" value={form.url} onChange={e => setForm(f => ({ ...f, url:e.target.value }))} placeholder="https://yoursite.com/help/refunds" />
                <div style={{ fontSize:11, color:'var(--text-3)', marginTop:5 }}>We'll scrape this page and extract the text content.</div>
              </div>
            )}
            {mode === 'file' && (
              <div>
                <label style={{ fontSize:12, fontWeight:600, color:'var(--text-2)', display:'block', marginBottom:6 }}>File (PDF, DOCX, TXT)</label>
                <input ref={fileRef} type="file" accept=".pdf,.docx,.txt,.md" onChange={e => setFile(e.target.files?.[0] ?? null)} style={{ display:'none' }} />
                <div onClick={() => fileRef.current?.click()} style={{ border:'2px dashed var(--border-2)', borderRadius:10, padding:'20px', textAlign:'center', cursor:'pointer', background:'var(--bg-2)', transition:'border-color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--blue)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-2)'}
                >
                  {file ? (
                    <div style={{ fontSize:13, color:'var(--green)', fontWeight:600, display:'flex', alignItems:'center', gap:6, justifyContent:'center' }}>
                      <Check size={14} /> {file.name}
                    </div>
                  ) : (
                    <>
                      <FileText size={22} color="var(--text-3)" style={{ margin:'0 auto 8px' }} />
                      <div style={{ fontSize:13, color:'var(--text-2)', fontWeight:500 }}>Click to select a file</div>
                      <div style={{ fontSize:11.5, color:'var(--text-3)', marginTop:4 }}>PDF, DOCX, TXT, Markdown</div>
                    </>
                  )}
                </div>
              </div>
            )}
            {mode === 'manual' && (
              <div>
                <label style={{ fontSize:12, fontWeight:600, color:'var(--text-2)', display:'block', marginBottom:6 }}>Content</label>
                <textarea className="input" rows={8} value={form.content} onChange={e => setForm(f => ({ ...f, content:e.target.value }))} placeholder="Write your knowledge article here. Be specific and accurate — this text will be used by the AI to answer visitor questions." style={{ resize:'vertical', fontSize:13 }} />
                <div style={{ fontSize:11, color:'var(--text-3)', marginTop:5 }}>{form.content.length} characters</div>
              </div>
            )}
            <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
              <button onClick={() => setMode(null)} className="btn-secondary">Cancel</button>
              <button onClick={save} disabled={saving} className="btn-primary" style={{ opacity:saving ? 0.7 : 1 }}>
                {saving ? 'Saving…' : 'Add source'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sources list */}
      {loading ? (
        <div style={{ display:'flex', justifyContent:'center', paddingTop:60 }}>
          <div style={{ width:24, height:24, border:'2px solid var(--border)', borderTopColor:'var(--blue)', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} />
        </div>
      ) : sources.length === 0 && !mode ? (
        <div className="card" style={{ padding:48, textAlign:'center' }}>
          <BookOpen size={36} color="var(--text-3)" style={{ margin:'0 auto 14px' }} />
          <p style={{ color:'var(--text-2)', fontSize:14, fontWeight:600, marginBottom:6 }}>No knowledge sources yet</p>
          <p style={{ color:'var(--text-3)', fontSize:13, marginBottom:20 }}>Add URLs, upload files, or write articles to train your AI chatbot.</p>
          <div style={{ display:'flex', gap:8, justifyContent:'center' }}>
            {[{ m:'url' as Mode, label:'Add URL'}, { m:'file' as Mode, label:'Upload file'}, { m:'manual' as Mode, label:'Write article'}].map(({ m, label }) => (
              <button key={m} onClick={() => { setMode(m); setForm({ title:'', url:'', content:'' }); }} className="btn-secondary" style={{ fontSize:12 }}>{label}</button>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {sources.map(s => (
            <div key={s.id} className="card" style={{ padding:'14px 18px', display:'flex', alignItems:'center', gap:14 }}>
              <div style={{ width:36, height:36, borderRadius:10, background: TYPE_BG[s.type], display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, border:`1px solid ${TYPE_COLOR[s.type]}33` }}>
                <span style={{ color: TYPE_COLOR[s.type] }}>{TYPE_ICON[s.type]}</span>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:14, fontWeight:600, color:'var(--text)', marginBottom:3 }}>{s.title}</div>
                <div style={{ display:'flex', alignItems:'center', gap:10, fontSize:11.5, color:'var(--text-3)' }}>
                  <span className={`badge badge-${s.type === 'URL' ? 'blue' : s.type === 'FILE' ? 'green' : 'amber'}`}>{s.type}</span>
                  {s.charCount > 0 && <span>{s.charCount.toLocaleString()} chars</span>}
                  {s.sourceUrl && <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:240 }}>{s.sourceUrl}</span>}
                  <span style={{ display:'flex', alignItems:'center', gap:3, color: s.isIndexed ? 'var(--green)' : 'var(--amber)' }}>
                    <div style={{ width:5, height:5, borderRadius:'50%', background: s.isIndexed ? 'var(--green)' : 'var(--amber)' }} />
                    {s.isIndexed ? 'Indexed' : 'Pending'}
                  </span>
                </div>
              </div>
              <div style={{ display:'flex', gap:6 }}>
                <button onClick={() => reindex(s.id)} className="btn-ghost" style={{ padding:'6px 8px', fontSize:11 }} title="Re-index">
                  <RefreshCw size={12} />
                </button>
                <button onClick={() => del(s.id)} className="btn-danger" style={{ padding:'6px 8px' }}>
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
