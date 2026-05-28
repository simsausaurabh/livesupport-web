'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { widgetSettingsApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { CheckCircle, ArrowRight, Copy, Zap, Paintbrush, Code2, MessageSquare } from 'lucide-react';

const STEPS = [
  { id: 'brand',   label: 'Brand',   icon: Paintbrush },
  { id: 'widget',  label: 'Widget',  icon: Zap },
  { id: 'install', label: 'Install', icon: Code2 },
  { id: 'done',    label: 'Done',    icon: CheckCircle },
];

const PRESET_COLORS = [
  '#f59e0b', '#6366f1', '#10b981', '#3b82f6',
  '#ef4444', '#8b5cf6', '#ec4899', '#0ea5e9',
];

export default function OnboardingPage() {
  const router = useRouter();
  const { organization } = useAuthStore();
  const [step,    setStep]   = useState(0);
  const [saving,  setSaving] = useState(false);
  const [copied,  setCopied] = useState(false);

  const [brand, setBrand] = useState({
    brandName:    organization?.name ?? 'Support',
    primaryColor: '#f59e0b',
    greetingMessage: "Hi there 👋 How can we help you today?",
  });

  const [behavior, setBehavior] = useState({
    launcherPosition: 'bottom-right',
    collectEmailBeforeChat: false,
    showAgentAvatar: true,
  });

  const widgetKey = organization?.widgetKey ?? '';
  const apiUrl    = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
  const snippet   = `<script\n  src="${apiUrl.replace(':4000', ':3001')}/widget.js"\n  data-widget-key="${widgetKey}"\n  data-api-url="${apiUrl}"\n  async\n></script>`;

  const copy = () => {
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const saveAndNext = async () => {
    if (step === 1) {
      setSaving(true);
      try {
        await widgetSettingsApi.update({ ...brand, ...behavior });
      } catch (e) { console.error(e); }
      finally { setSaving(false); }
    }
    if (step < STEPS.length - 1) setStep(s => s + 1);
    else router.push('/dashboard/conversations');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>

      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 40 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Zap size={16} color="black" fill="black" />
        </div>
        <span style={{ fontWeight: 700, fontSize: 18, color: 'var(--text)' }}>LiveSupport</span>
      </div>

      {/* Step indicators */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 36 }}>
        {STEPS.map((s, i) => (
          <div key={s.id} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: i < step ? 'var(--green)' : i === step ? 'var(--accent)' : 'var(--bg-2)',
              border: `1px solid ${i < step ? 'var(--green)' : i === step ? 'var(--accent)' : 'var(--border)'}`,
              fontSize: 12, fontWeight: 700,
              color: i <= step ? (i < step ? 'white' : 'black') : 'var(--text-3)',
              transition: 'all 0.3s',
            }}>
              {i < step ? '✓' : i + 1}
            </div>
            <span style={{ fontSize: 12, fontWeight: i === step ? 600 : 400, color: i === step ? 'var(--text)' : 'var(--text-3)', margin: '0 6px', display: i === STEPS.length - 1 ? 'none' : undefined }}>{s.label}</span>
            {i < STEPS.length - 1 && <div style={{ width: 24, height: 1, background: i < step ? 'var(--green)' : 'var(--border)', transition: 'background 0.3s' }} />}
          </div>
        ))}
      </div>

      {/* Card */}
      <div className="card" style={{ width: '100%', maxWidth: 520, padding: 36 }}>

        {/* Step 0: Brand */}
        {step === 0 && (
          <>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>Customize your brand</h1>
            <p style={{ fontSize: 14, color: 'var(--text-3)', marginBottom: 28 }}>This will be shown to your visitors in the chat widget.</p>

            <FormField label="Brand name">
              <input className="input" value={brand.brandName} onChange={e => setBrand(b => ({ ...b, brandName: e.target.value }))} placeholder="Acme Support" />
            </FormField>

            <FormField label="Greeting message">
              <textarea className="input" style={{ minHeight: 76, resize: 'none' }} value={brand.greetingMessage} onChange={e => setBrand(b => ({ ...b, greetingMessage: e.target.value }))} />
            </FormField>

            <FormField label="Brand color">
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                {PRESET_COLORS.map(c => (
                  <button key={c} onClick={() => setBrand(b => ({ ...b, primaryColor: c }))} style={{
                    width: 28, height: 28, borderRadius: 6, background: c, border: 'none', cursor: 'pointer',
                    outline: brand.primaryColor === c ? `2px solid ${c}` : '2px solid transparent',
                    outlineOffset: 2,
                  }} />
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input type="color" value={brand.primaryColor} onChange={e => setBrand(b => ({ ...b, primaryColor: e.target.value }))} style={{ width: 40, height: 36, padding: 2, borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg-2)', cursor: 'pointer' }} />
                <input className="input" value={brand.primaryColor} onChange={e => setBrand(b => ({ ...b, primaryColor: e.target.value }))} style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }} />
              </div>
            </FormField>
          </>
        )}

        {/* Step 1: Widget behavior */}
        {step === 1 && (
          <>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>Widget settings</h1>
            <p style={{ fontSize: 14, color: 'var(--text-3)', marginBottom: 28 }}>Choose how your widget behaves.</p>

            <FormField label="Launcher position">
              <div style={{ display: 'flex', gap: 10 }}>
                {['bottom-right', 'bottom-left'].map(pos => (
                  <button key={pos} onClick={() => setBehavior(b => ({ ...b, launcherPosition: pos }))} style={{
                    flex: 1, padding: '10px 0', borderRadius: 8, border: '1px solid var(--border)', cursor: 'pointer', fontSize: 13,
                    background: behavior.launcherPosition === pos ? 'var(--accent-bg)' : 'transparent',
                    color: behavior.launcherPosition === pos ? 'var(--accent)' : 'var(--text-3)',
                    fontWeight: behavior.launcherPosition === pos ? 600 : 400,
                    fontFamily: 'var(--font-sans)',
                  }}>{pos}</button>
                ))}
              </div>
            </FormField>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              <ToggleRow label="Collect visitor email before chat" sub="Helps identify returning visitors" value={behavior.collectEmailBeforeChat} onChange={v => setBehavior(b => ({ ...b, collectEmailBeforeChat: v }))} />
              <ToggleRow label="Show agent avatars" sub="Display agent profile pictures in chat" value={behavior.showAgentAvatar} onChange={v => setBehavior(b => ({ ...b, showAgentAvatar: v }))} />
            </div>
          </>
        )}

        {/* Step 2: Install */}
        {step === 2 && (
          <>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>Install the widget</h1>
            <p style={{ fontSize: 14, color: 'var(--text-3)', marginBottom: 24 }}>
              Paste this snippet before the <code style={{ background: 'var(--bg-3)', padding: '1px 6px', borderRadius: 4, color: 'var(--accent)', fontSize: 12 }}>&lt;/body&gt;</code> tag on every page.
            </p>

            <div style={{ position: 'relative', marginBottom: 20 }}>
              <pre style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px', fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-2)', lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{snippet}</pre>
              <button onClick={copy} className="btn-primary" style={{ position: 'absolute', top: 10, right: 10, fontSize: 11, padding: '5px 10px' }}>
                <Copy size={11} /> {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              {[
                { name: 'HTML', code: `<!-- Paste in your HTML -->` },
                { name: 'React', code: `// Add to _document.tsx` },
                { name: 'WordPress', code: `// Use a plugin or theme footer` },
              ].map(p => (
                <div key={p.name} style={{ flex: 1, background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 10px', fontSize: 11, color: 'var(--text-3)', textAlign: 'center' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>{p.name}</div>
                  <div style={{ fontFamily: 'var(--font-mono)' }}>{p.code}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Step 3: Done */}
        {step === 3 && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--green-bg)', border: '2px solid var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <CheckCircle size={28} color="var(--green)" />
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>You're all set! 🎉</h1>
            <p style={{ fontSize: 14, color: 'var(--text-3)', lineHeight: 1.6, marginBottom: 24 }}>
              Your widget is configured and ready. Head to the dashboard to handle incoming conversations.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { icon: MessageSquare, text: 'Monitor conversations in real-time' },
                { icon: Zap,           text: 'Use AI suggestions to reply faster' },
                { icon: Paintbrush,    text: 'Further customize in Widget settings' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--bg-2)', borderRadius: 8, border: '1px solid var(--border)' }}>
                  <Icon size={15} color="var(--accent)" />
                  <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 32, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
          {step > 0 && step < 3 ? (
            <button onClick={() => setStep(s => s - 1)} className="btn-ghost" style={{ border: '1px solid var(--border)' }}>← Back</button>
          ) : <div />}
          <button onClick={saveAndNext} disabled={saving} className="btn-primary" style={{ minWidth: 140, justifyContent: 'center', opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Saving…' : step === 3 ? 'Go to Dashboard' : step === 2 ? 'Done — Go to Dashboard' : <>Next <ArrowRight size={14} /></>}
          </button>
        </div>
      </div>

      <p style={{ marginTop: 16, fontSize: 12, color: 'var(--text-3)' }}>
        You can change all these settings anytime in <span style={{ color: 'var(--accent)' }}>Widget Customizer</span>.
      </p>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-2)', marginBottom: 8 }}>{label}</label>
      {children}
    </div>
  );
}

function ToggleRow({ label, sub, value, onChange }: { label: string; sub: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{label}</div>
        <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{sub}</div>
      </div>
      <button onClick={() => onChange(!value)} style={{
        width: 42, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer', flexShrink: 0,
        background: value ? 'var(--accent)' : 'var(--bg-3)', position: 'relative', transition: 'background 0.2s',
      }}>
        <span style={{ position: 'absolute', top: 4, left: value ? 20 : 4, width: 16, height: 16, borderRadius: '50%', background: 'white', transition: 'left 0.2s' }} />
      </button>
    </div>
  );
}
