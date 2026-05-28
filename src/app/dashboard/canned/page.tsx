'use client';
import { useEffect, useState } from 'react';
import { cannedApi } from '@/lib/api';
import { Plus, Trash2, Edit2, Save, X, Search } from 'lucide-react';

const EMPTY = { shortcut: '/', title: '', content: '' };

export default function CannedPage() {
  const [items,    setItems]   = useState<any[]>([]);
  const [search,   setSearch]  = useState('');
  const [loading,  setLoading] = useState(true);
  const [editing,  setEditing] = useState<any>(null);  // null | item | 'new'
  const [saving,   setSaving]  = useState(false);
  const [form,     setForm]    = useState(EMPTY);
  const [error,    setError]   = useState('');

  const load = async (q?: string) => {
    setLoading(true);
    try { setItems(await cannedApi.list(q)); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const t = setTimeout(() => load(search || undefined), 300);
    return () => clearTimeout(t);
  }, [search]);

  const openNew = () => { setForm(EMPTY); setEditing('new'); setError(''); };
  const openEdit = (item: any) => { setForm({ shortcut: item.shortcut, title: item.title, content: item.content }); setEditing(item); setError(''); };
  const close = () => { setEditing(null); setError(''); };

  const save = async () => {
    if (!form.shortcut.startsWith('/')) { setError('Shortcut must start with /'); return; }
    if (!form.title || !form.content)  { setError('Title and content are required'); return; }
    setSaving(true); setError('');
    try {
      if (editing === 'new') {
        await cannedApi.create(form);
      } else {
        await cannedApi.update(editing.id, form);
      }
      await load(search || undefined);
      close();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this canned response?')) return;
    try { await cannedApi.delete(id); await load(search || undefined); }
    catch (e: any) { alert(e.message); }
  };

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>Canned Responses</h1>
          <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 4 }}>Type <code style={{ background: 'var(--bg-3)', padding: '1px 5px', borderRadius: 4, color: 'var(--accent)' }}>/shortcut</code> in the reply box to use</p>
        </div>
        <button onClick={openNew} className="btn-primary" style={{ fontSize: 13 }}>
          <Plus size={14} /> New response
        </button>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 16, maxWidth: 360 }}>
        <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
        <input className="input" style={{ paddingLeft: 30 }} placeholder="Search shortcuts…" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Edit / Create panel */}
      {editing && (
        <div className="card" style={{ padding: 20, marginBottom: 20, borderColor: 'var(--border-2)' }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 16 }}>
            {editing === 'new' ? 'New canned response' : `Edit: ${editing.shortcut}`}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {error && <div style={{ background: 'var(--red-bg)', border: '1px solid var(--red)', borderRadius: 8, padding: '8px 12px', color: 'var(--red)', fontSize: 13 }}>{error}</div>}
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', display: 'block', marginBottom: 6 }}>Shortcut</label>
                <input className="input" placeholder="/greeting" value={form.shortcut} onChange={e => setForm(f => ({ ...f, shortcut: e.target.value }))} style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }} />
              </div>
              <div style={{ flex: 2 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', display: 'block', marginBottom: 6 }}>Title</label>
                <input className="input" placeholder="Greeting message" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', display: 'block', marginBottom: 6 }}>Content</label>
              <textarea className="input" style={{ minHeight: 90, resize: 'vertical' }} placeholder="Hi there! 👋 How can I help you today?" value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} />
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={close} className="btn-ghost" style={{ border: '1px solid var(--border)' }}><X size={13} /> Cancel</button>
              <button onClick={save} disabled={saving} className="btn-primary" style={{ opacity: saving ? 0.7 : 1 }}><Save size={13} /> {saving ? 'Saving…' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 60 }}>
          <div style={{ width: 24, height: 24, border: '2px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      ) : items.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <p style={{ color: 'var(--text-3)', fontSize: 14 }}>No canned responses yet. Create one to speed up replies.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.map(item => (
            <div key={item.id} className="card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <code style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)', background: 'var(--accent-bg)', padding: '3px 8px', borderRadius: 6, flexShrink: 0, fontFamily: 'var(--font-mono)' }}>
                {item.shortcut}
              </code>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.content}</div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                <button onClick={() => openEdit(item)} className="btn-ghost" style={{ padding: '6px 8px', borderRadius: 6 }}><Edit2 size={13} /></button>
                <button onClick={() => remove(item.id)} className="btn-danger" style={{ padding: '6px 8px', borderRadius: 6 }}><Trash2 size={13} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
