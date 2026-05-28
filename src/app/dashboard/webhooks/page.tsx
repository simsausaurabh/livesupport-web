'use client';
import { useEffect, useState } from 'react';
import { webhooksApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { Plus, Trash2, Zap, CheckCircle, XCircle, FlaskConical, Power, Lock } from 'lucide-react';

const ALL_EVENTS = [
  'conversation.created', 'conversation.assigned', 'conversation.resolved',
  'message.created', 'visitor.created', 'agent.status_changed',
];

export default function WebhooksPage() {
  const { organization } = useAuthStore();
  const isPaid = organization?.plan === 'BUSINESS';

  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ url: '', events: [] as string[] });
  const [saving, setSaving]  = useState(false);
  const [testing, setTesting] = useState<string>('');
  const [error, setError]   = useState('');

  const load = async () => {
    if (!isPaid) { setLoading(false); return; }
    try { setWebhooks(await webhooksApi.list()); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const toggleEvent = (e: string) =>
    setForm(f => ({ ...f, events: f.events.includes(e) ? f.events.filter(x => x !== e) : [...f.events, e] }));

  const create = async () => {
    if (!form.url) { setError('URL is required'); return; }
    if (!form.events.length) { setError('Select at least one event'); return; }
    setSaving(true); setError('');
    try {
      await webhooksApi.create(form.url, form.events);
      setShowForm(false);
      setForm({ url: '', events: [] });
      await load();
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this webhook?')) return;
    try { await webhooksApi.delete(id); await load(); }
    catch (e: any) { alert(e.message); }
  };

  const toggleActive = async (wh: any) => {
    try { await webhooksApi.update(wh.id, { isActive: !wh.isActive }); await load(); }
    catch (e: any) { alert(e.message); }
  };

  const test = async (id: string) => {
    setTesting(id);
    try {
      const r = await webhooksApi.test(id);
      alert(r.ok ? `✅ Delivered (HTTP ${r.statusCode})` : `❌ Failed (HTTP ${r.statusCode ?? 'no response'})`);
    } catch (e: any) { alert(`Error: ${e.message}`); }
    finally { setTesting(''); }
  };

  // Upsell gate
  if (!isPaid) return (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
      <div className="card" style={{ maxWidth: 420, padding: 40, textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--accent-bg)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <Lock size={24} color="var(--accent)" />
        </div>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Webhooks — Business plan</h2>
        <p style={{ fontSize: 14, color: 'var(--text-3)', marginBottom: 24, lineHeight: 1.6 }}>
          Send real-time events to your systems when conversations are created, assigned, or resolved. Available on the Business plan.
        </p>
        <a href="/dashboard/billing" style={{ textDecoration: 'none' }}>
          <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', height: 42 }}>
            <Zap size={14} /> Upgrade to Business
          </button>
        </a>
      </div>
    </div>
  );

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>Webhooks</h1>
          <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 4 }}>Push real-time events to external URLs</p>
        </div>
        <button onClick={() => { setShowForm(true); setError(''); }} className="btn-primary" style={{ fontSize: 13 }}>
          <Plus size={14} /> Add webhook
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="card" style={{ padding: 20, marginBottom: 20, borderColor: 'var(--border-2)' }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 16 }}>New webhook endpoint</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {error && <div style={{ background: 'var(--red-bg)', border: '1px solid var(--red)', borderRadius: 8, padding: '8px 12px', color: 'var(--red)', fontSize: 13 }}>{error}</div>}

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', display: 'block', marginBottom: 6 }}>Endpoint URL</label>
              <input className="input" placeholder="https://yourapp.com/webhooks/livesupport" value={form.url}
                onChange={e => setForm(f => ({ ...f, url: e.target.value }))} />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', display: 'block', marginBottom: 10 }}>Events to receive</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {ALL_EVENTS.map(evt => (
                  <label key={evt} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '8px 10px', borderRadius: 8, border: `1px solid ${form.events.includes(evt) ? 'var(--accent)' : 'var(--border)'}`, background: form.events.includes(evt) ? 'var(--accent-bg)' : 'transparent', transition: 'all 0.15s' }}>
                    <input type="checkbox" checked={form.events.includes(evt)} onChange={() => toggleEvent(evt)} style={{ accentColor: 'var(--accent)' }} />
                    <code style={{ fontSize: 11, color: form.events.includes(evt) ? 'var(--accent)' : 'var(--text-2)', fontFamily: 'var(--font-mono)' }}>{evt}</code>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowForm(false)} className="btn-ghost" style={{ border: '1px solid var(--border)' }}>Cancel</button>
              <button onClick={create} disabled={saving} className="btn-primary" style={{ opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Creating…' : 'Create webhook'}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 60 }}>
          <div style={{ width: 24, height: 24, border: '2px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      ) : webhooks.length === 0 && !showForm ? (
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <Zap size={32} color="var(--text-3)" style={{ margin: '0 auto 12px' }} />
          <p style={{ color: 'var(--text-3)', fontSize: 14 }}>No webhooks yet. Add one to start receiving events.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {webhooks.map(wh => (
            <div key={wh.id} className="card" style={{ padding: 18, opacity: wh.isActive ? 1 : 0.6 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: wh.isActive ? 'var(--green)' : 'var(--text-3)', flexShrink: 0 }} />
                    <code style={{ fontSize: 13, color: 'var(--text)', fontFamily: 'var(--font-mono)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{wh.url}</code>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, paddingLeft: 16 }}>
                    {(wh.events ?? []).map((e: string) => (
                      <code key={e} style={{ fontSize: 10, background: 'var(--bg-3)', color: 'var(--text-3)', padding: '2px 6px', borderRadius: 4, fontFamily: 'var(--font-mono)' }}>{e}</code>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  <button onClick={() => test(wh.id)} disabled={!!testing} className="btn-ghost" style={{ fontSize: 12, border: '1px solid var(--border)', padding: '6px 10px', opacity: testing === wh.id ? 0.6 : 1 }}>
                    <FlaskConical size={12} /> {testing === wh.id ? 'Sending…' : 'Test'}
                  </button>
                  <button onClick={() => toggleActive(wh)} className="btn-ghost" style={{ border: '1px solid var(--border)', padding: '6px 10px' }} title={wh.isActive ? 'Disable' : 'Enable'}>
                    <Power size={12} color={wh.isActive ? 'var(--green)' : 'var(--text-3)'} />
                  </button>
                  <button onClick={() => remove(wh.id)} className="btn-danger" style={{ padding: '6px 8px' }}>
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>

              {/* Recent deliveries */}
              {wh.deliveries?.length > 0 && (
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 6, fontWeight: 600 }}>Recent deliveries</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {wh.deliveries.map((d: any, i: number) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11 }}>
                        {d.success
                          ? <CheckCircle size={11} color="var(--green)" />
                          : <XCircle size={11} color="var(--red)" />}
                        <code style={{ color: 'var(--text-2)', fontFamily: 'var(--font-mono)' }}>{d.event}</code>
                        {d.statusCode && <span style={{ color: 'var(--text-3)' }}>HTTP {d.statusCode}</span>}
                        <span style={{ color: 'var(--text-3)', marginLeft: 'auto' }}>
                          {new Date(d.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
