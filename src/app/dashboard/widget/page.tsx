'use client';
import { useEffect, useState, useCallback } from 'react';
import { widgetSettingsApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { Save, RefreshCw, Copy, MessageSquare, X, Minus, Send } from 'lucide-react';

const DEFAULTS = {
  primaryColor:           '#f59e0b',
  textColor:              '#ffffff',
  brandName:              'Support',
  greetingMessage:        'Hi there 👋 How can we help?',
  offlineMessage:         'We are offline right now. Leave us a message!',
  launcherPosition:       'bottom-right' as 'bottom-right' | 'bottom-left',
  showAgentAvatar:        true,
  collectEmailBeforeChat: false,
  language:               'en',
};

export default function WidgetPage() {
  const { organization } = useAuthStore();
  const [settings, setSettings] = useState<any>(DEFAULTS);
  const [original, setOriginal] = useState<any>(DEFAULTS);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [widgetKey, setWidgetKey] = useState('');
  const [regenLoading, setRegenLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    widgetSettingsApi.get()
      .then(d => {
        const merged = { ...DEFAULTS, ...d.settings };
        setSettings(merged);
        setOriginal(merged);
        setWidgetKey(d.widgetKey ?? '');
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const set = (k: string, v: any) => setSettings((s: any) => ({ ...s, [k]: v }));
  const isDirty = JSON.stringify(settings) !== JSON.stringify(original);

  const save = async () => {
    setSaving(true);
    try {
      const saved = await widgetSettingsApi.update(settings);
      setOriginal(saved);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e: any) { alert(e.message); }
    finally { setSaving(false); }
  };

  const regenerate = async () => {
    if (!confirm('Regenerate widget key? Your current embed snippet will stop working.')) return;
    setRegenLoading(true);
    try {
      const d = await widgetSettingsApi.regenerateKey();
      setWidgetKey(d.widgetKey);
    } catch (e: any) { alert(e.message); }
    finally { setRegenLoading(false); }
  };

  const snippet = `<script src="http://localhost:3001/widget.js" data-widget-key="${widgetKey}" async></script>`;

  const copySnippet = () => {
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 24, height: 24, border: '2px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>

      {/* ── Settings panel ─────────────────────── */}
      <div style={{ width: 340, flexShrink: 0, overflowY: 'auto', borderRight: '1px solid var(--border)', padding: '24px 20px', background: 'var(--bg-1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h1 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>Widget</h1>
          <button
            onClick={save}
            disabled={!isDirty || saving}
            className="btn-primary"
            style={{ fontSize: 12, padding: '6px 14px', opacity: (!isDirty || saving) ? 0.5 : 1 }}
          >
            <Save size={12} /> {saving ? 'Saving…' : saved ? 'Saved!' : 'Save'}
          </button>
        </div>

        <Section title="Brand">
          <Field label="Brand name">
            <input className="input" value={settings.brandName} onChange={e => set('brandName', e.target.value)} placeholder="Your Company" />
          </Field>
          <Field label="Primary color">
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="color" value={settings.primaryColor} onChange={e => set('primaryColor', e.target.value)}
                style={{ width: 38, height: 34, borderRadius: 8, border: '1px solid var(--border)', background: 'none', cursor: 'pointer', padding: 2 }} />
              <input className="input" value={settings.primaryColor} onChange={e => set('primaryColor', e.target.value)}
                style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }} />
            </div>
          </Field>
          <Field label="Text color">
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="color" value={settings.textColor} onChange={e => set('textColor', e.target.value)}
                style={{ width: 38, height: 34, borderRadius: 8, border: '1px solid var(--border)', background: 'none', cursor: 'pointer', padding: 2 }} />
              <input className="input" value={settings.textColor} onChange={e => set('textColor', e.target.value)}
                style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }} />
            </div>
          </Field>
        </Section>

        <Section title="Messages">
          <Field label="Greeting">
            <textarea className="input" rows={2} value={settings.greetingMessage}
              onChange={e => set('greetingMessage', e.target.value)} style={{ resize: 'vertical' }} />
          </Field>
          <Field label="Offline message">
            <textarea className="input" rows={2} value={settings.offlineMessage}
              onChange={e => set('offlineMessage', e.target.value)} style={{ resize: 'vertical' }} />
          </Field>
        </Section>

        <Section title="Behaviour">
          <Field label="Launcher position">
            <div style={{ display: 'flex', gap: 8 }}>
              {['bottom-right', 'bottom-left'].map(pos => (
                <button key={pos} onClick={() => set('launcherPosition', pos)}
                  style={{
                    flex: 1, padding: '7px 10px', borderRadius: 8, border: `1px solid ${settings.launcherPosition === pos ? 'var(--accent)' : 'var(--border)'}`,
                    background: settings.launcherPosition === pos ? 'var(--accent-bg)' : 'transparent',
                    color: settings.launcherPosition === pos ? 'var(--accent)' : 'var(--text-3)',
                    fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 500,
                  }}>
                  {pos === 'bottom-right' ? '↘ Right' : '↙ Left'}
                </button>
              ))}
            </div>
          </Field>
          <Toggle label="Show agent avatar"        value={settings.showAgentAvatar}        onChange={v => set('showAgentAvatar', v)} />
          <Toggle label="Collect email before chat" value={settings.collectEmailBeforeChat} onChange={v => set('collectEmailBeforeChat', v)} />
        </Section>

        <Section title="Installation">
          <div style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Widget key</span>
              <button onClick={regenerate} disabled={regenLoading} style={{ fontSize: 11, color: 'var(--text-3)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                <RefreshCw size={10} /> Regenerate
              </button>
            </div>
            <code style={{ display: 'block', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 10px', fontSize: 11, color: 'var(--accent)', fontFamily: 'var(--font-mono)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {widgetKey}
            </code>
          </div>
          <pre style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-2)', overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all', lineHeight: 1.6, marginBottom: 8 }}>
            {snippet}
          </pre>
          <button onClick={copySnippet} className="btn-ghost" style={{ fontSize: 12, border: '1px solid var(--border)', width: '100%', justifyContent: 'center' }}>
            <Copy size={12} /> {copied ? 'Copied!' : 'Copy snippet'}
          </button>
        </Section>
      </div>

      {/* ── Live preview ───────────────────────── */}
      <div style={{ flex: 1, background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* mock page bg */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 30% 40%, rgba(245,158,11,0.04) 0%, transparent 60%), radial-gradient(circle at 70% 80%, rgba(99,102,241,0.04) 0%, transparent 60%)' }} />

        {/* fake browser chrome */}
        <div style={{ width: 480, maxWidth: '90%' }}>
          <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '12px 12px 0 0', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex', gap: 5 }}>
              {['#ef4444','#f59e0b','#10b981'].map(c => (
                <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
              ))}
            </div>
            <div style={{ flex: 1, background: 'var(--bg-3)', borderRadius: 6, padding: '3px 10px', fontSize: 11, color: 'var(--text-3)' }}>
              yoursite.com
            </div>
          </div>
          <div style={{ background: 'var(--bg-1)', border: '1px solid var(--border)', borderTop: 'none', borderRadius: '0 0 12px 12px', height: 340, position: 'relative', overflow: 'hidden' }}>
            {/* mock page content */}
            <div style={{ padding: '24px 28px' }}>
              <div style={{ width: '60%', height: 14, background: 'var(--bg-3)', borderRadius: 4, marginBottom: 10 }} />
              <div style={{ width: '80%', height: 10, background: 'var(--bg-3)', borderRadius: 4, marginBottom: 6 }} />
              <div style={{ width: '70%', height: 10, background: 'var(--bg-3)', borderRadius: 4, marginBottom: 6 }} />
              <div style={{ width: '50%', height: 10, background: 'var(--bg-3)', borderRadius: 4 }} />
            </div>

            {/* Widget launcher */}
            <div style={{
              position: 'absolute', bottom: 16,
              [settings.launcherPosition === 'bottom-left' ? 'left' : 'right']: 16,
              display: 'flex', flexDirection: 'column', alignItems: settings.launcherPosition === 'bottom-left' ? 'flex-start' : 'flex-end', gap: 10,
            }}>
              {/* Chat bubble */}
              <div style={{
                width: 260, borderRadius: 14, overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                border: '1px solid var(--border)',
              }}>
                {/* Header */}
                <div style={{ background: settings.primaryColor, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MessageSquare size={14} color={settings.textColor} />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: settings.textColor, lineHeight: 1 }}>{settings.brandName}</div>
                      <div style={{ fontSize: 10, color: settings.textColor, opacity: 0.8, marginTop: 2 }}>● Online</div>
                    </div>
                  </div>
                  <Minus size={14} color={settings.textColor} style={{ opacity: 0.8 }} />
                </div>

                {/* Body */}
                <div style={{ background: 'var(--bg-1)', padding: '14px 14px 10px' }}>
                  {/* Greeting */}
                  <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: settings.primaryColor, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: settings.textColor }}>
                      {settings.brandName?.charAt(0) ?? 'S'}
                    </div>
                    <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '10px 10px 10px 2px', padding: '7px 10px', fontSize: 11, color: 'var(--text)', maxWidth: 180, lineHeight: 1.4 }}>
                      {settings.greetingMessage}
                    </div>
                  </div>

                  {/* Fake input */}
                  {settings.collectEmailBeforeChat && (
                    <div style={{ marginBottom: 8 }}>
                      <input
                        readOnly
                        placeholder="Your email address…"
                        style={{ width: '100%', fontSize: 11, background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 8, padding: '7px 10px', color: 'var(--text-3)', outline: 'none', fontFamily: 'var(--font-sans)' }}
                      />
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: 6 }}>
                    <div style={{ flex: 1, background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 8, padding: '7px 10px', fontSize: 11, color: 'var(--text-3)' }}>
                      Type a message…
                    </div>
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: settings.primaryColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Send size={12} color={settings.textColor} />
                    </div>
                  </div>
                </div>

                {/* Branding footer */}
                <div style={{ background: 'var(--bg-2)', padding: '6px 12px', textAlign: 'center' }}>
                  <span style={{ fontSize: 10, color: 'var(--text-3)' }}>Powered by <span style={{ color: 'var(--accent)', fontWeight: 600 }}>LiveSupport</span></span>
                </div>
              </div>

              {/* Launcher button */}
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: settings.primaryColor, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 16px ${settings.primaryColor}66`, cursor: 'pointer' }}>
                <X size={20} color={settings.textColor} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12, paddingBottom: 6, borderBottom: '1px solid var(--border)' }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-2)', marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' }}>
      <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{label}</span>
      <button
        onClick={() => onChange(!value)}
        style={{
          width: 40, height: 22, borderRadius: 11, border: 'none', cursor: 'pointer',
          background: value ? 'var(--accent)' : 'var(--bg-3)',
          position: 'relative', transition: 'background 0.2s',
        }}
      >
        <div style={{
          width: 16, height: 16, borderRadius: '50%', background: 'white',
          position: 'absolute', top: 3, left: value ? 21 : 3,
          transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        }} />
      </button>
    </div>
  );
}
