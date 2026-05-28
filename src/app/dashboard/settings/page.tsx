'use client';
import { useEffect, useState } from 'react';
import { widgetSettingsApi, webhooksApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { Save, Copy, RefreshCw, Plus, Trash2, Send, Globe, Palette, Code } from 'lucide-react';

const WEBHOOK_EVENTS = [
  'conversation.created','conversation.assigned','conversation.resolved',
  'message.created','visitor.created','agent.status_changed',
];

export default function SettingsPage() {
  const { agent, organization } = useAuthStore();
  const [settings, setSettings] = useState<any>({});
  const [widgetKey, setWidgetKey] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState<'widget'|'webhooks'|'account'>('widget');
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [whForm, setWhForm] = useState({ url: '', events: [] as string[] });
  const [whSaving, setWhSaving] = useState(false);
  const [testing, setTesting] = useState('');

  useEffect(() => {
    widgetSettingsApi.get().then(d => { setSettings(d.settings ?? {}); setWidgetKey(d.widgetKey ?? ''); }).catch(console.error);
    webhooksApi.list().then(setWebhooks).catch(() => {});
  }, []);

  const saveSettings = async () => {
    setSaving(true);
    try { await widgetSettingsApi.update(settings); setSaved(true); setTimeout(() => setSaved(false), 2000); }
    catch (e: any) { alert(e.message); } finally { setSaving(false); }
  };

  const regenerateKey = async () => {
    if (!confirm('This will break your current embed snippet. Continue?')) return;
    const { widgetKey: nk } = await widgetSettingsApi.regenerateKey();
    setWidgetKey(nk);
  };

  const addWebhook = async () => {
    if (!whForm.url || whForm.events.length === 0) return;
    setWhSaving(true);
    try { const wh = await webhooksApi.create(whForm.url, whForm.events); setWebhooks(p => [...p, wh]); setWhForm({ url: '', events: [] }); }
    catch (e: any) { alert(e.message); } finally { setWhSaving(false); }
  };

  const deleteWebhook = async (id: string) => {
    if (!confirm('Delete webhook?')) return;
    await webhooksApi.delete(id);
    setWebhooks(p => p.filter(w => w.id !== id));
  };

  const testWebhook = async (id: string) => {
    setTesting(id);
    const r = await webhooksApi.test(id).catch(e => ({ ok: false, error: e.message }));
    setTesting('');
    alert(r.ok ? `✅ Success (${r.statusCode})` : `❌ Failed: ${(r as any).error ?? r.statusCode}`);
  };

  const toggleEvent = (ev: string) => setWhForm(f => ({
    ...f, events: f.events.includes(ev) ? f.events.filter(e => e !== ev) : [...f.events, ev],
  }));

  const copy = (t: string) => navigator.clipboard.writeText(t);
  const snippet = `<script\n  src="http://localhost:3001/widget.js"\n  data-widget-key="${widgetKey}"\n  async\n></script>`;

  const TABS = [
    { key: 'widget',   label: 'Widget',   icon: Palette },
    { key: 'webhooks', label: 'Webhooks', icon: Globe },
    { key: 'account',  label: 'Account',  icon: Code },
  ] as const;

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: 28 }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 24 }}>Settings</h1>

      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--border)', marginBottom: 24 }}>
        {TABS.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setTab(key as any)} style={{
            display:'flex',alignItems:'center',gap:6,padding:'8px 16px',border:'none',background:'none',cursor:'pointer',
            fontSize:13,fontWeight:tab===key?600:400,fontFamily:'var(--font-sans)',
            color:tab===key?'var(--accent)':'var(--text-3)',
            borderBottom:`2px solid ${tab===key?'var(--accent)':'transparent'}`,marginBottom:-1,transition:'all 0.15s',
          }}><Icon size={14}/>{label}</button>
        ))}
      </div>

      {tab === 'widget' && (
        <div style={{ display:'grid',gridTemplateColumns:'1fr 300px',gap:20,maxWidth:860 }}>
          <div style={{ display:'flex',flexDirection:'column',gap:14 }}>
            <Sec title="Appearance">
              <Row label="Brand name"><input className="input" value={settings.brandName??''} onChange={e=>setSettings((s:any)=>({...s,brandName:e.target.value}))}/></Row>
              <Row label="Primary color">
                <div style={{display:'flex',gap:8,alignItems:'center'}}>
                  <input type="color" value={settings.primaryColor??'#0f172a'} onChange={e=>setSettings((s:any)=>({...s,primaryColor:e.target.value}))} style={{width:38,height:34,borderRadius:8,border:'1px solid var(--border)',padding:2,background:'var(--bg-2)',cursor:'pointer'}}/>
                  <input className="input" style={{width:120,fontFamily:'var(--font-mono)'}} value={settings.primaryColor??''} onChange={e=>setSettings((s:any)=>({...s,primaryColor:e.target.value}))}/>
                </div>
              </Row>
              <Row label="Launcher position">
                <select className="input" style={{width:200}} value={settings.launcherPosition??'bottom-right'} onChange={e=>setSettings((s:any)=>({...s,launcherPosition:e.target.value}))}>
                  <option value="bottom-right">Bottom right</option>
                  <option value="bottom-left">Bottom left</option>
                </select>
              </Row>
            </Sec>
            <Sec title="Messages">
              <Row label="Greeting"><textarea className="input" style={{minHeight:60,resize:'vertical'}} value={settings.greetingMessage??''} onChange={e=>setSettings((s:any)=>({...s,greetingMessage:e.target.value}))}/></Row>
              <Row label="Offline message"><textarea className="input" style={{minHeight:60,resize:'vertical'}} value={settings.offlineMessage??''} onChange={e=>setSettings((s:any)=>({...s,offlineMessage:e.target.value}))}/></Row>
            </Sec>
            <Sec title="Options">
              <Toggle label="Show agent avatar" value={!!settings.showAgentAvatar} onChange={v=>setSettings((s:any)=>({...s,showAgentAvatar:v}))}/>
              <Toggle label="Collect email before chat" value={!!settings.collectEmailBeforeChat} onChange={v=>setSettings((s:any)=>({...s,collectEmailBeforeChat:v}))}/>
            </Sec>
            <button onClick={saveSettings} disabled={saving} className="btn-primary" style={{width:'fit-content',opacity:saving?0.7:1}}>
              <Save size={14}/>{saved?'Saved!':saving?'Saving…':'Save changes'}
            </button>
          </div>

          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            <div className="card" style={{padding:16}}>
              <p style={{fontSize:11,fontWeight:700,color:'var(--text-3)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:12}}>Live preview</p>
              <div style={{background:'#f0f0f4',borderRadius:12,padding:16,position:'relative',minHeight:110}}>
                <div style={{background:settings.primaryColor??'#0f172a',color:'#fff',borderRadius:10,padding:'8px 12px',fontSize:12,maxWidth:'85%'}}>
                  {settings.greetingMessage||'Hi! How can we help?'}
                </div>
                <div style={{position:'absolute',bottom:12,right:12,width:40,height:40,borderRadius:'50%',background:settings.primaryColor??'#0f172a',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 14px rgba(0,0,0,.25)'}}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </div>
              </div>
            </div>
            <div className="card" style={{padding:14}}>
              <p style={{fontSize:11,fontWeight:700,color:'var(--text-3)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:8}}>Widget key</p>
              <div style={{display:'flex',gap:6}}>
                <code style={{flex:1,background:'var(--bg-2)',border:'1px solid var(--border)',borderRadius:6,padding:'5px 8px',fontSize:10,color:'var(--accent)',fontFamily:'var(--font-mono)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{widgetKey}</code>
                <button onClick={()=>copy(widgetKey)} className="btn-ghost" style={{padding:'5px 7px',border:'1px solid var(--border)',borderRadius:6}}><Copy size={11}/></button>
                <button onClick={regenerateKey} className="btn-ghost" style={{padding:'5px 7px',border:'1px solid var(--border)',borderRadius:6}}><RefreshCw size={11}/></button>
              </div>
            </div>
            <div className="card" style={{padding:14}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                <p style={{fontSize:11,fontWeight:700,color:'var(--text-3)',textTransform:'uppercase',letterSpacing:'0.06em'}}>Embed snippet</p>
                <button onClick={()=>copy(snippet)} className="btn-ghost" style={{padding:'3px 7px',borderRadius:6,fontSize:11}}><Copy size={10}/> Copy</button>
              </div>
              <pre style={{background:'var(--bg-2)',border:'1px solid var(--border)',borderRadius:8,padding:'8px 10px',fontSize:10,fontFamily:'var(--font-mono)',color:'var(--text-2)',overflowX:'auto',whiteSpace:'pre-wrap',wordBreak:'break-all',lineHeight:1.6}}>{snippet}</pre>
            </div>
          </div>
        </div>
      )}

      {tab === 'webhooks' && (
        <div style={{maxWidth:680}}>
          {organization?.plan !== 'BUSINESS' && (
            <div style={{background:'var(--accent-bg)',border:'1px solid var(--border)',borderRadius:10,padding:'12px 16px',marginBottom:20,fontSize:13,color:'var(--text-2)'}}>
              ⚡ Webhooks require the <strong style={{color:'var(--accent)'}}>Business plan</strong>.
            </div>
          )}
          <Sec title="Add webhook">
            <Row label="Endpoint URL"><input className="input" placeholder="https://your-server.com/webhook" value={whForm.url} onChange={e=>setWhForm(f=>({...f,url:e.target.value}))}/></Row>
            <div style={{marginBottom:14}}>
              <label style={{fontSize:12,fontWeight:600,color:'var(--text-3)',display:'block',marginBottom:8}}>Events</label>
              <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
                {WEBHOOK_EVENTS.map(ev=>(
                  <label key={ev} style={{display:'flex',alignItems:'center',gap:5,cursor:'pointer',fontSize:12,color:whForm.events.includes(ev)?'var(--accent)':'var(--text-3)'}}>
                    <input type="checkbox" checked={whForm.events.includes(ev)} onChange={()=>toggleEvent(ev)} style={{accentColor:'var(--accent)'}}/>{ev}
                  </label>
                ))}
              </div>
            </div>
            <button onClick={addWebhook} disabled={whSaving||!whForm.url||whForm.events.length===0} className="btn-primary" style={{opacity:(whSaving||!whForm.url||whForm.events.length===0)?0.5:1,fontSize:13}}>
              <Plus size={13}/>{whSaving?'Adding…':'Add webhook'}
            </button>
          </Sec>
          <div style={{display:'flex',flexDirection:'column',gap:10,marginTop:16}}>
            {webhooks.map(wh=>(
              <div key={wh.id} className="card" style={{padding:'14px 16px'}}>
                <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:12}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:500,color:'var(--text)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',marginBottom:6}}>{wh.url}</div>
                    <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
                      {(wh.events??[]).map((ev:string)=>(
                        <span key={ev} style={{fontSize:10,padding:'2px 6px',borderRadius:999,background:'var(--bg-3)',color:'var(--text-3)',fontFamily:'var(--font-mono)'}}>{ev}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{display:'flex',gap:6,flexShrink:0}}>
                    <button onClick={()=>testWebhook(wh.id)} disabled={testing===wh.id} className="btn-ghost" style={{padding:'5px 9px',border:'1px solid var(--border)',borderRadius:6,fontSize:12}}>
                      <Send size={11}/>{testing===wh.id?'…':'Test'}
                    </button>
                    <button onClick={()=>deleteWebhook(wh.id)} className="btn-danger" style={{padding:'5px 7px',borderRadius:6}}><Trash2 size={12}/></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'account' && (
        <div style={{maxWidth:480}}>
          <Sec title="Your profile">
            <Field label="Name" value={agent?.name}/><Field label="Email" value={agent?.email}/><Field label="Role" value={agent?.role}/>
          </Sec>
          <Sec title="Workspace">
            <Field label="Company" value={organization?.name}/><Field label="Plan" value={organization?.plan}/><Field label="Slug" value={organization?.slug}/>
          </Sec>
        </div>
      )}
    </div>
  );
}

function Sec({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="card" style={{padding:'18px 22px',marginBottom:14}}><h2 style={{fontSize:13,fontWeight:700,color:'var(--text)',marginBottom:14,paddingBottom:10,borderBottom:'1px solid var(--border)'}}>{title}</h2>{children}</div>;
}
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return <div style={{display:'flex',flexDirection:'column',gap:6,marginBottom:12}}><label style={{fontSize:12,fontWeight:600,color:'var(--text-3)'}}>{label}</label>{children}</div>;
}
function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
      <span style={{fontSize:13,color:'var(--text-2)'}}>{label}</span>
      <button onClick={()=>onChange(!value)} style={{width:38,height:20,borderRadius:10,border:'none',cursor:'pointer',position:'relative',background:value?'var(--accent)':'var(--bg-3)',transition:'background 0.2s'}}>
        <div style={{position:'absolute',top:2,left:value?19:2,width:16,height:16,borderRadius:'50%',background:'#fff',transition:'left 0.2s',boxShadow:'0 1px 3px rgba(0,0,0,.3)'}}/>
      </button>
    </div>
  );
}
function Field({ label, value }: { label: string; value?: string }) {
  return <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}><span style={{fontSize:13,color:'var(--text-3)'}}>{label}</span><span style={{fontSize:13,fontWeight:500,color:'var(--text)'}}>{value??'—'}</span></div>;
}
