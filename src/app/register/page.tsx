'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth';

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [form, setForm]     = useState({ orgName: '', name: '', email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await authApi.register(form.orgName, form.name, form.email, form.password);
      setAuth(data.token, data.agent, data.organization);
      router.push('/onboarding');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-sm px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 18 }}>LiveSupport</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 6 }}>Create your workspace</h1>
          <p style={{ color: 'var(--text-2)', fontSize: 14 }}>Get started in 30 seconds</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {error && (
            <div style={{ background: 'var(--red-bg)', border: '1px solid var(--red)', borderRadius: 8, padding: '10px 14px', color: 'var(--red)', fontSize: 13 }}>
              {error}
            </div>
          )}
          {[
            { key: 'orgName',  label: 'Company name', type: 'text',     ph: 'Acme Inc.' },
            { key: 'name',     label: 'Your name',    type: 'text',     ph: 'Alex Smith' },
            { key: 'email',    label: 'Email',        type: 'email',    ph: 'alex@acme.com' },
            { key: 'password', label: 'Password',     type: 'password', ph: 'Min. 8 characters' },
          ].map(f => (
            <div key={f.key}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-2)', marginBottom: 6 }}>{f.label}</label>
              <input
                type={f.type}
                className="input"
                placeholder={f.ph}
                value={(form as any)[f.key]}
                onChange={e => set(f.key, e.target.value)}
                required
                minLength={f.key === 'password' ? 8 : 1}
              />
            </div>
          ))}
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', height: 42, marginTop: 4, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Creating…' : 'Create workspace'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--text-3)', fontSize: 13 }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
