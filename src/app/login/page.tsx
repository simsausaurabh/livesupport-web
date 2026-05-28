'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth';

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await authApi.login(email, password);
      setAuth(data.token, data.agent, data.organization);
      router.push('/dashboard/conversations');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-sm px-4">

        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 18, color: 'var(--text)' }}>LiveSupport</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>Welcome back</h1>
          <p style={{ color: 'var(--text-2)', fontSize: 14 }}>Sign in to your agent dashboard</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {error && (
            <div style={{ background: 'var(--red-bg)', border: '1px solid var(--red)', borderRadius: 8, padding: '10px 14px', color: 'var(--red)', fontSize: 13 }}>
              {error}
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-2)', marginBottom: 6 }}>Email</label>
            <input
              type="email"
              className="input"
              placeholder="agent@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-2)', marginBottom: 6 }}>Password</label>
            <input
              type="password"
              className="input"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', height: 42, marginTop: 4, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--text-3)', fontSize: 13 }}>
          No account?{' '}
          <Link href="/register" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Create one</Link>
        </p>

        {/* Demo hint */}
        <div style={{ marginTop: 32, padding: '12px 14px', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 10 }}>
          <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Demo credentials</p>
          <p style={{ fontSize: 12, color: 'var(--text-2)', fontFamily: 'var(--font-mono)' }}>owner@demo.com / password123</p>
          <p style={{ fontSize: 12, color: 'var(--text-2)', fontFamily: 'var(--font-mono)' }}>agent@demo.com / password123</p>
        </div>
      </div>
    </div>
  );
}
