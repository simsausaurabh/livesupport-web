import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About — LiveSupport',
  description: 'The story behind LiveSupport — built by a solo founder tired of paying $100/seat for live chat.',
};

const STACK = [
  { name: 'Next.js 14',     role: 'Dashboard & marketing' },
  { name: 'Node.js + Express', role: 'API server' },
  { name: 'Socket.IO',      role: 'Real-time messaging' },
  { name: 'Prisma + MySQL', role: 'Database ORM' },
  { name: 'Redis',          role: 'Presence & caching' },
  { name: 'Claude Haiku',   role: 'AI suggestions & summaries' },
  { name: 'Stripe',         role: 'Billing & subscriptions' },
  { name: 'Tailwind CSS',   role: 'Styling system' },
];

const TIMELINE = [
  { date: 'Week 1', title: 'Backend foundation', desc: 'Server, auth, Socket.IO, MySQL schema, Redis, widget embed API.' },
  { date: 'Week 2', title: 'Agent dashboard', desc: 'Inbox, conversation thread, AI suggestions panel, real-time updates.' },
  { date: 'Week 3', title: 'Monetisation layer', desc: 'Stripe billing, canned responses, widget customizer, webhooks.' },
  { date: 'Week 4', title: 'Launch', desc: 'Marketing site, onboarding wizard, PWA, this page.' },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section style={{ padding: '80px 24px 60px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20 }}>Our story</div>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--text)', lineHeight: 1.07, marginBottom: 28 }}>
            Built because Intercom costs $100 per seat.
          </h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              `LiveSupport started when I needed live chat for a SaaS side-project. Every option I evaluated — Intercom, Crisp, LiveChat, Tidio — either charged more than my MRR or locked key features behind enterprise plans.`,
              `So I built my own. A proper, production-grade replacement with real-time Socket.IO, AI reply suggestions powered by Claude, Stripe billing, and a customizable widget — all in a clean TypeScript monorepo you can self-host or use as-is.`,
              `The goal is simple: give every team the tools the big companies use, without the big-company price tag.`,
            ].map((p, i) => (
              <p key={i} style={{ fontSize: 16, color: 'var(--text-2)', lineHeight: 1.75 }}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Build timeline */}
      <section style={{ padding: '60px 24px', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--bg-1)' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em', marginBottom: 40 }}>Built in 4 weeks</h2>
          <div style={{ position: 'relative' }}>
            {/* Timeline line */}
            <div style={{ position: 'absolute', left: 72, top: 8, bottom: 8, width: 1, background: 'var(--border)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
              {TIMELINE.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 28, alignItems: 'flex-start' }}>
                  <div style={{ width: 56, flexShrink: 0, textAlign: 'right' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>{item.date}</span>
                  </div>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--accent)', border: '2px solid var(--bg-1)', flexShrink: 0, marginTop: 3, zIndex: 1 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{item.title}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.55 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em', marginBottom: 32 }}>Tech stack</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
            {STACK.map(s => (
              <div key={s.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg-1)', border: '1px solid var(--border)', borderRadius: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>{s.name}</span>
                <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{s.role}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: '0 24px 80px', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 700, margin: '40px auto 0' }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em', marginBottom: 32 }}>What we believe</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { title: 'Simple pricing is a feature', body: 'One price per seat. No add-ons, no hidden charges, no "contact sales" walls. If you need to ask how much it costs, it costs too much.' },
              { title: 'Self-hosting is a right', body: 'You should always be able to run your own infrastructure. The full source code is available. No licence servers, no call-home, no lock-in.' },
              { title: 'AI should assist, not replace', body: 'AI reply suggestions are presented as options, not sent automatically. Agents always review before sending. Your customers talk to humans.' },
              { title: 'Speed is respect', body: 'Sub-100ms message delivery, a widget that loads in under 50ms, and a dashboard that feels instant. Your customers and agents don\'t wait.' },
            ].map(v => (
              <div key={v.title} style={{ padding: '20px 22px', background: 'var(--bg-1)', border: '1px solid var(--border)', borderRadius: 12 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>{v.title}</div>
                <div style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.65 }}>{v.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '60px 24px 100px', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
        <h2 style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)', marginBottom: 16 }}>Try it yourself</h2>
        <p style={{ fontSize: 15, color: 'var(--text-3)', marginBottom: 32 }}>Free plan available. No credit card required.</p>
        <Link href="/register" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'var(--accent)', color: 'black', textDecoration: 'none',
          fontWeight: 700, fontSize: 14, padding: '12px 28px', borderRadius: 10,
        }}>Create your workspace →</Link>
      </section>
    </>
  );
}
