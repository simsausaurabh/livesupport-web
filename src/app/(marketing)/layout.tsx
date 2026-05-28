import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LiveSupport — AI-powered live chat for growing teams',
  description: 'Real-time chat, AI chatbots, human handoff, and analytics. The affordable Intercom alternative.',
};

function Logo({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lg1" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563eb"/>
          <stop offset="1" stopColor="#059669"/>
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="10" fill="url(#lg1)"/>
      <rect x="7" y="10" width="18" height="13" rx="3.5" fill="white" opacity="0.95"/>
      <polygon points="9,23 13,23 9,29" fill="white" opacity="0.95"/>
      <rect x="16" y="19" width="17" height="11" rx="3" fill="white" opacity="0.65"/>
      <polygon points="31,30 27,30 31,35" fill="white" opacity="0.65"/>
      <circle cx="32" cy="11" r="4.5" fill="#34d399"/>
      <circle cx="32" cy="11" r="2.2" fill="white"/>
    </svg>
  );
}

const NAV_LINKS = [
  { href: '/#features',   label: 'Features' },
  { href: '/#usecases',   label: 'Use Cases' },
  { href: '/#industries', label: 'Industries' },
  { href: '/pricing',     label: 'Pricing' },
  { href: '/about',       label: 'About' },
];

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', fontFamily: 'Inter, sans-serif', color: '#0f172a' }}>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 28px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Logo size={34} />
            <span style={{ fontWeight: 800, fontSize: 18, background: 'linear-gradient(135deg,#2563eb,#059669)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', letterSpacing: '-0.03em' }}>LiveSupport</span>
          </Link>
          <nav style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {NAV_LINKS.map(({ href, label }) => (
              <Link key={href} href={href} style={{ fontSize: 13.5, fontWeight: 500, color: '#475569', textDecoration: 'none', padding: '7px 13px', borderRadius: 8, transition: 'all 0.15s' }}>{label}</Link>
            ))}
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link href="/login" style={{ fontSize: 13.5, fontWeight: 500, color: '#475569', textDecoration: 'none', padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: 'white' }}>Log in</Link>
            <Link href="/register" style={{ fontSize: 13.5, fontWeight: 700, color: 'white', textDecoration: 'none', padding: '9px 22px', borderRadius: 10, background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', boxShadow: '0 2px 10px rgba(37,99,235,0.35)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>Get started free →</Link>
          </div>
        </div>
      </header>

      <div style={{ paddingTop: 64 }}>{children}</div>

      <footer style={{ background: '#0f172a', color: 'white', padding: '64px 28px 36px', marginTop: 80 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 60, flexWrap: 'wrap', marginBottom: 48 }}>
            <div style={{ flex: '1 1 240px', minWidth: 200 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <Logo size={30} />
                <span style={{ fontWeight: 800, fontSize: 17, color: 'white', letterSpacing: '-0.02em' }}>LiveSupport</span>
              </div>
              <p style={{ fontSize: 13.5, color: '#94a3b8', lineHeight: 1.65, maxWidth: 240 }}>AI-powered live chat built for growing teams. Affordable, powerful, and human-first.</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 16 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#34d399' }} />
                <span style={{ fontSize: 12, color: '#64748b' }}>All systems operational</span>
              </div>
            </div>
            {[
              { title: 'Product',   links: [{ l: 'Features', h: '/#features' }, { l: 'Pricing', h: '/pricing' }, { l: 'Changelog', h: '#' }, { l: 'Roadmap', h: '#' }] },
              { title: 'Use Cases', links: [{ l: 'SaaS', h: '#' }, { l: 'E-commerce', h: '#' }, { l: 'Healthcare', h: '#' }, { l: 'Education', h: '#' }] },
              { title: 'Company',   links: [{ l: 'About', h: '/about' }, { l: 'Blog', h: '#' }, { l: 'Careers', h: '#' }, { l: 'Contact', h: '#' }] },
              { title: 'Legal',     links: [{ l: 'Privacy', h: '#' }, { l: 'Terms', h: '#' }, { l: 'Security', h: '#' }] },
            ].map(col => (
              <div key={col.title} style={{ flex: '0 0 auto' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>{col.title}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {col.links.map(({ l, h }) => (
                    <Link key={l} href={h} style={{ fontSize: 13.5, color: '#cbd5e1', textDecoration: 'none' }}>{l}</Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ fontSize: 12.5, color: '#64748b' }}>© {new Date().getFullYear()} LiveSupport. All rights reserved.</div>
            <div style={{ fontSize: 12.5, color: '#64748b' }}>Made with care for teams that care about customers.</div>
          </div>
        </div>
      </footer>
      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        .mlink:hover{color:#2563eb!important}
        .nav-link:hover{background:#eff6ff!important;color:#2563eb!important}
      `}</style>
    </div>
  );
}
