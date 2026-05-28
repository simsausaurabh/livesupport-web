'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth';
import { useSocket } from '@/hooks/useSocket';
import {
  MessageSquare, BarChart2, Users, Settings, LogOut, Circle, Zap,
  CreditCard, Hash, Webhook, Palette, Bot, BookOpen, ChevronDown,
  Bell, Search,
} from 'lucide-react';

const NAV_MAIN = [
  { href: '/dashboard/conversations', icon: MessageSquare, label: 'Conversations', badge: null },
  { href: '/dashboard/analytics',     icon: BarChart2,     label: 'Analytics' },
  { href: '/dashboard/agents',        icon: Users,         label: 'Agents' },
];

const NAV_AI = [
  { href: '/dashboard/chatbots',   icon: Bot,      label: 'AI Chatbots' },
  { href: '/dashboard/knowledge',  icon: BookOpen, label: 'Knowledge Base' },
];

const NAV_CONFIG = [
  { href: '/dashboard/canned',     icon: Hash,       label: 'Canned Responses' },
  { href: '/dashboard/widget',     icon: Palette,    label: 'Widget' },
  { href: '/dashboard/webhooks',   icon: Webhook,    label: 'Webhooks' },
  { href: '/dashboard/billing',    icon: CreditCard, label: 'Billing' },
  { href: '/dashboard/settings',   icon: Settings,   label: 'Settings' },
];

const STATUS_OPTIONS = ['ONLINE','AWAY','OFFLINE'];
const STATUS_COLOR: Record<string, string> = {
  ONLINE: '#059669', AWAY: '#d97706', OFFLINE: '#94a3b8',
};
const STATUS_LABEL: Record<string, string> = {
  ONLINE: 'Online', AWAY: 'Away', OFFLINE: 'Offline',
};

function NavSection({ title, items, pathname }: { title?: string; items: typeof NAV_MAIN; pathname: string }) {
  return (
    <div>
      {title && (
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '10px 12px 4px' }}>
          {title}
        </div>
      )}
      {items.map(({ href, icon: Icon, label }) => {
        const active = pathname.startsWith(href);
        return (
          <Link key={href} href={href} style={{ textDecoration: 'none', display: 'block' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 12px', borderRadius: 8, margin: '1px 6px',
              background: active ? 'var(--blue-light)' : 'transparent',
              color: active ? 'var(--blue)' : 'var(--text-2)',
              fontWeight: active ? 600 : 400, fontSize: 13.5,
              transition: 'all 0.12s', cursor: 'pointer',
            }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--bg-2)'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
            >
              <Icon size={15} style={{ flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{label}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const { agent, organization, isLoaded, logout, load } = useAuthStore();
  const [statusOpen, setStatusOpen] = useState(false);
  useSocket();

  useEffect(() => { load(); }, []);
  useEffect(() => { if (isLoaded && !agent) router.push('/login'); }, [isLoaded, agent]);

  if (!isLoaded || !agent) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div style={{ textAlign: 'center' }}>
        {/* Logo spinner */}
        <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 4px 14px rgba(37,99,235,0.4)' }}>
          <Zap size={22} color="white" fill="white" />
        </div>
        <div style={{ width: 24, height: 24, border: '2px solid var(--border-2)', borderTopColor: 'var(--blue)', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );

  const planColor = { FREE: '#94a3b8', STARTER: '#059669', TEAM: '#2563eb', BUSINESS: '#7c3aed' };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>

      {/* ════ SIDEBAR ════════════════════════════════════════════════ */}
      <aside style={{
        width: 'var(--sidebar-w)', flexShrink: 0,
        background: 'var(--bg-1)',
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        boxShadow: '2px 0 8px rgba(0,0,0,0.04)',
      }}>

        {/* Logo */}
        <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#2563eb,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 8px rgba(37,99,235,0.3)' }}>
              <Zap size={17} color="white" fill="white" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 14.5, color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1 }}>LiveSupport</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 160 }}>{organization?.name}</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto' }}>
          <NavSection items={NAV_MAIN} pathname={pathname} />
          <div style={{ margin: '6px 12px', borderTop: '1px solid var(--border)' }} />
          <NavSection title="AI" items={NAV_AI} pathname={pathname} />
          <div style={{ margin: '6px 12px', borderTop: '1px solid var(--border)' }} />
          <NavSection title="Configure" items={NAV_CONFIG} pathname={pathname} />
        </nav>

        {/* Plan */}
        <div style={{ padding: '8px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', borderRadius: 8, background: 'var(--bg-2)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: (planColor as any)[organization?.plan ?? 'FREE'] }} />
              <span style={{ fontSize: 11.5, color: 'var(--text-2)', fontWeight: 600 }}>{organization?.plan ?? 'FREE'} plan</span>
            </div>
            {organization?.plan === 'FREE' && (
              <Link href="/dashboard/billing" style={{ fontSize: 11, color: 'var(--blue)', fontWeight: 700, textDecoration: 'none' }}>Upgrade</Link>
            )}
          </div>
        </div>

        {/* Agent status + logout */}
        <div style={{ padding: '10px 12px 14px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Avatar */}
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb22,#05966922)', border: '2px solid var(--blue-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'var(--blue)', flexShrink: 0 }}>
              {agent.name.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{agent.name}</div>
              {/* Status picker */}
              <div style={{ position: 'relative' }}>
                <button onClick={() => setStatusOpen(o => !o)} style={{
                  display: 'flex', alignItems: 'center', gap: 4, background: 'none',
                  border: 'none', cursor: 'pointer', padding: 0, marginTop: 2,
                }}>
                  <Circle size={7} fill={STATUS_COLOR[agent.status]} color={STATUS_COLOR[agent.status]} />
                  <span style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-sans)' }}>{STATUS_LABEL[agent.status]}</span>
                  <ChevronDown size={10} color="var(--text-3)" />
                </button>
                {statusOpen && (
                  <div style={{ position: 'absolute', bottom: '100%', left: 0, marginBottom: 4, background: 'var(--bg-1)', border: '1px solid var(--border)', borderRadius: 8, boxShadow: 'var(--shadow)', zIndex: 50, minWidth: 110, overflow: 'hidden' }}>
                    {STATUS_OPTIONS.map(s => (
                      <div key={s} onClick={() => setStatusOpen(false)} style={{
                        display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
                        cursor: 'pointer', fontSize: 12.5, color: 'var(--text-2)',
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-2)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <Circle size={7} fill={STATUS_COLOR[s]} color={STATUS_COLOR[s]} />
                        {STATUS_LABEL[s]}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button onClick={logout} className="btn-ghost" style={{ padding: 6, borderRadius: 6, flexShrink: 0 }} title="Sign out">
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* ════ MAIN ═══════════════════════════════════════════════════ */}
      <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
        {children}
      </main>
    </div>
  );
}
