'use client';
import Link from 'next/link';

const FEATURES = [
  { icon: '💬', title: 'Real-time messaging', desc: 'Socket.IO-powered with sub-100ms delivery. Typing indicators, read receipts, live presence — zero polling.' },
  { icon: '🤖', title: 'AI chatbots', desc: 'Train bots on your knowledge base. Handle FAQs 24/7, auto-handoff to human agents the moment it matters.' },
  { icon: '🧠', title: 'Knowledge base', desc: 'Feed your bot via URLs, file uploads (PDF, DOCX), or written articles. Always up-to-date.' },
  { icon: '✋', title: 'Human handoff', desc: 'One click to escalate bot conversations to a live agent. Full context transferred — visitors never repeat themselves.' },
  { icon: '⚡', title: 'AI reply suggestions', desc: 'Claude reads your conversation and proposes 3 one-click replies. Accept, edit, or ignore — you stay in control.' },
  { icon: '/', title: 'Canned responses', desc: 'Type /shortcut and your saved replies pop up. Build a library for every scenario.' },
  { icon: '📊', title: 'Advanced analytics', desc: 'First response time, resolution rate, CSAT, agent leaderboard, and bot performance on one screen.' },
  { icon: '🎨', title: 'Widget customiser', desc: 'Brand colours, position, greeting, border radius, fonts, and custom CSS. Live preview as you type.' },
  { icon: '🔗', title: 'Webhooks & API', desc: 'Push events to Zapier, Slack, or your CRM. Full REST API for custom workflows. Business plan.' },
];

const USE_CASES = [
  { emoji: '🛒', title: 'Reduce cart abandonment', desc: 'Proactive greetings trigger after 5 seconds. A bot answers common questions instantly — no waiting, no lost sales.', stat: '23% fewer abandoned carts' },
  { emoji: '🎫', title: 'Deflect tier-1 support', desc: 'Let your knowledge base handle password resets, shipping status, and refund policy. Your team focuses on hard problems.', stat: '60% ticket deflection' },
  { emoji: '🤝', title: 'Qualify leads instantly', desc: 'A bot greets every visitor, collects their use case, and routes hot leads directly to a sales agent in real time.', stat: '3× faster lead response' },
  { emoji: '💡', title: 'Onboard new customers', desc: 'Trigger contextual help based on the page a visitor is on. Guide step-by-step without code.', stat: '40% better activation' },
];

const INDUSTRIES = [
  { name: 'SaaS & Tech',   icon: '💻', features: ['In-app widget', 'AI reply suggestions', 'Webhook integrations', 'API access'] },
  { name: 'E-commerce',    icon: '🛍️', features: ['Proactive cart help', 'Order tracking bot', 'Refund automation', 'CSAT scoring'] },
  { name: 'Healthcare',    icon: '🏥', features: ['Appointment booking bot', 'FAQ knowledge base', 'Human handoff', 'Compliant messaging'] },
  { name: 'Education',     icon: '🎓', features: ['Enrollment Q&A bot', 'Student portal chat', 'Multi-language', 'Off-hours bot'] },
  { name: 'Finance',       icon: '💳', features: ['Secure messaging', 'Document collection', 'Compliance tags', 'Audit trail'] },
  { name: 'Travel & Hospitality', icon: '✈️', features: ['Booking support bot', 'Itinerary changes', 'Proactive check-ins', 'Multi-agent routing'] },
];

const PLANS = [
  { name: 'Free',     monthly: 0,  desc: 'For solo founders',      highlight: false, features: ['1 agent', '250 conversations/mo', 'Basic analytics', 'Widget customiser', 'Proactive greeting'] },
  { name: 'Starter',  monthly: 9,  desc: 'Per agent / month',     highlight: false, features: ['3 agents', '2,500 conversations/mo', '1 AI chatbot', '5 knowledge sources', 'AI reply suggestions', 'Human handoff'] },
  { name: 'Team',     monthly: 19, desc: 'Per agent / month',     highlight: true,  badge: 'Most popular', features: ['10 agents', '2,500 conversations/mo', '10 AI chatbots', '25 knowledge sources', 'Custom AI persona', 'Webhooks', 'Advanced analytics'] },
  { name: 'Business', monthly: 29, desc: 'Per agent / month',     highlight: false, features: ['Unlimited agents', 'Unlimited conversations', '50 AI chatbots', '200 knowledge sources', 'REST API', 'SLA reports', 'Custom roles'] },
];

const FAQS = [
  { q: 'How does the AI chatbot work?', a: 'You train it by adding URLs, uploading PDFs/DOCX files, or writing knowledge articles. The bot uses Claude Haiku to answer questions based only on your content. When it cannot answer, it auto-escalates to a human agent.' },
  { q: 'What is human handoff?', a: 'When an AI chatbot conversation needs a human, the bot posts a handoff message and the conversation appears in your agent inbox. The agent sees the full context and picks up seamlessly — no repeated questions.' },
  { q: 'Does the proactive greeting work for all visitors?', a: 'Yes. 5 seconds after a visitor lands on any page with your widget, it gently opens and greets them. You can customise the message, delay, and disable it per plan.' },
  { q: 'Can I self-host LiveSupport?', a: 'Yes. The full TypeScript monorepo is available. Deploy on any server with Node.js, MySQL, and Redis. No licence restrictions or call-home.' },
  { q: 'Is the 20% yearly discount automatic?', a: 'Yes. Toggle to annual billing at checkout or in your billing settings. The 20% discount applies immediately across all paid plans.' },
  { q: 'What happens if I exceed my conversation limit?', a: 'The widget stops accepting new conversations until the next billing month resets. Existing conversations are never interrupted.' },
  { q: 'Do paid plans have a free trial?', a: 'All paid plans come with a 14-day free trial. No credit card required to start.' },
  { q: 'What counts as a conversation?', a: 'Any unique conversation started by a visitor during the billing month, whether handled by a bot or a human agent.' },
];

const LOGOS = ['Vercel', 'Supabase', 'Railway', 'Netlify', 'Render', 'Fly.io', 'PlanetScale', 'Cloudflare', 'Linear', 'Notion'];

export default function HomePage() {
  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '96px 28px 80px', background: 'linear-gradient(180deg,#f0f7ff 0%,#ffffff 100%)' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(#e2e8f0 1px,transparent 1px),linear-gradient(90deg,#e2e8f0 1px,transparent 1px)', backgroundSize: '48px 48px', opacity: 0.5 }} />
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 400, borderRadius: '50%', background: 'radial-gradient(ellipse,rgba(37,99,235,0.1) 0%,transparent 70%)', filter: 'blur(40px)', zIndex: 0 }} />

        <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 28, border: '1px solid #bfdbfe', borderRadius: 999, padding: '5px 16px', background: '#eff6ff' }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#059669' }} />
            <span style={{ fontSize: 12.5, color: '#2563eb', fontWeight: 600 }}>AI-powered · Real-time · Self-hostable</span>
          </div>

          <h1 style={{ fontSize: 'clamp(40px,6.5vw,76px)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.04, color: '#0f172a', marginBottom: 24 }}>
            Customer support that<br />
            <span style={{ background: 'linear-gradient(135deg,#2563eb,#059669)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              works while you sleep
            </span>
          </h1>

          <p style={{ fontSize: 'clamp(15px,2vw,19px)', color: '#475569', lineHeight: 1.65, maxWidth: 580, margin: '0 auto 40px' }}>
            AI chatbots answer 24/7. Human agents get AI suggestions. Visitors get instant help.
            All for <strong style={{ color: '#2563eb' }}>$9/agent/month</strong> — a fraction of Intercom.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', marginBottom: 52 }}>
            <Link href="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', color: 'white', textDecoration: 'none', fontWeight: 700, fontSize: 15, padding: '14px 30px', borderRadius: 12, boxShadow: '0 4px 20px rgba(37,99,235,0.3)' }}>
              Start free — no credit card
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <a href="#demo" style={{ fontSize: 14, color: '#64748b', textDecoration: 'none', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 6 }}>Watch 2-min demo ↓</a>
          </div>

          <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 56 }}>
            {[{ value: '$9', sub: 'per agent / month' }, { value: '4 min', sub: 'average setup time' }, { value: '<100ms', sub: 'message delivery' }, { value: '20%', sub: 'off annual billing' }].map(s => (
              <div key={s.value} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(22px,3vw,32px)', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 5 }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Dashboard preview */}
          <div style={{ borderRadius: 16, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.12)', border: '1px solid #e2e8f0', background: 'white', maxWidth: 820, margin: '0 auto' }}>
            <div style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ display: 'flex', gap: 5 }}>
                {['#ef4444','#f59e0b','#22c55e'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
              </div>
              <div style={{ flex: 1, background: '#e2e8f0', borderRadius: 6, padding: '4px 12px', fontSize: 11.5, color: '#64748b', textAlign: 'center' }}>app.livesupport.io/dashboard/conversations</div>
            </div>
            <div style={{ display: 'flex', height: 300 }}>
              <div style={{ width: 180, background: '#f8fafc', borderRight: '1px solid #e2e8f0', padding: '14px 0' }}>
                {[{ label: 'Conversations', active: true }, { label: 'Analytics', active: false }, { label: 'AI Chatbots', active: false }, { label: 'Knowledge Base', active: false }].map(({ label, active }) => (
                  <div key={label} style={{ padding: '7px 14px', display: 'flex', alignItems: 'center', gap: 8, background: active ? '#eff6ff' : 'transparent', margin: '2px 6px', borderRadius: 7 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: active ? '#2563eb' : '#e2e8f0', flexShrink: 0 }} />
                    <span style={{ fontSize: 11.5, fontWeight: active ? 700 : 400, color: active ? '#2563eb' : '#64748b' }}>{label}</span>
                  </div>
                ))}
              </div>
              <div style={{ width: 200, borderRight: '1px solid #e2e8f0', padding: '12px 0' }}>
                {[{ name: 'Sarah M.', msg: 'Need help with billing...', status: 'OPEN' }, { name: 'AI Bot', msg: 'Bot handled this ✓', status: 'BOT' }, { name: 'James T.', msg: 'Reset my password?', status: 'ASSIGNED' }].map((c, i) => (
                  <div key={i} style={{ padding: '9px 12px', background: i === 0 ? '#f0f7ff' : 'transparent', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                      <span style={{ fontSize: 11.5, fontWeight: 600, color: '#0f172a' }}>{c.name}</span>
                      <span style={{ fontSize: 9.5, fontWeight: 700, color: c.status === 'OPEN' ? '#d97706' : c.status === 'BOT' ? '#7c3aed' : '#2563eb', background: c.status === 'OPEN' ? '#fffbeb' : c.status === 'BOT' ? '#f5f3ff' : '#eff6ff', padding: '1px 5px', borderRadius: 4 }}>{c.status}</span>
                    </div>
                    <div style={{ fontSize: 10.5, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.msg}</div>
                  </div>
                ))}
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '12px', gap: 8 }}>
                {[{ from: 'visitor', msg: 'Hi, I need help with my billing statement' }, { from: 'agent', msg: 'Of course! Let me pull up your account.', ai: true }, { from: 'visitor', msg: 'I was charged twice this month' }].map((m, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: m.from === 'agent' ? 'flex-end' : 'flex-start' }}>
                    <div style={{ maxWidth: '75%', padding: '7px 11px', borderRadius: 10, fontSize: 11, background: m.from === 'agent' ? '#eff6ff' : '#f1f5f9', border: `1px solid ${m.from === 'agent' ? '#bfdbfe' : '#e2e8f0'}`, color: '#0f172a' }}>
                      {(m as any).ai && <div style={{ fontSize: 9, color: '#2563eb', fontWeight: 700, marginBottom: 3 }}>✨ AI suggested</div>}
                      {m.msg}
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: 'auto', background: '#eff6ff', borderRadius: 8, padding: '8px 10px', border: '1px solid #bfdbfe' }}>
                  <div style={{ fontSize: 9.5, fontWeight: 700, color: '#2563eb', marginBottom: 5 }}>✨ 3 AI Suggestions</div>
                  <div style={{ fontSize: 10, color: '#475569', padding: '4px 8px', background: 'white', borderRadius: 6, border: '1px solid #e2e8f0' }}>I will issue a full refund right away. It should appear within 3–5 days.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LOGO MARQUEE ───────────────────────────────────────────────── */}
      <div style={{ borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '16px 0', overflow: 'hidden', background: '#f8fafc' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center', marginBottom: 12 }}>Trusted by teams at</div>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ display: 'flex', gap: 56, animation: 'marquee 28s linear infinite', width: 'max-content' }}>
            {[...LOGOS, ...LOGOS].map((name, i) => (
              <span key={i} style={{ fontSize: 14.5, fontWeight: 700, color: '#cbd5e1', whiteSpace: 'nowrap' }}>{name}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── FEATURES ───────────────────────────────────────────────────── */}
      <section id="features" style={{ padding: '96px 28px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Everything you need</div>
            <h2 style={{ fontSize: 'clamp(28px,4vw,46px)', fontWeight: 900, letterSpacing: '-0.03em', color: '#0f172a', lineHeight: 1.1, marginBottom: 14 }}>Built for support teams that move fast</h2>
            <p style={{ fontSize: 16, color: '#64748b', maxWidth: 480, margin: '0 auto', lineHeight: 1.65 }}>Every feature Intercom or LiveChat has — plus AI capabilities they charge extra for.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 1, border: '1px solid #e2e8f0', borderRadius: 18, overflow: 'hidden' }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{ padding: '32px 28px', background: 'white', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', transition: 'background 0.2s, transform 0.2s' }}
                className="ls-feat-card"
              >
                <div style={{ marginBottom: 14 }}>
                  {f.icon.startsWith('/') ? <code style={{ fontSize: 14, background: '#eff6ff', color: '#2563eb', padding: '4px 8px', borderRadius: 6, fontWeight: 700 }}>{f.icon}</code> : <span style={{ fontSize: 28 }}>{f.icon}</span>}
                </div>
                <div style={{ fontSize: 15.5, fontWeight: 700, color: '#0f172a', marginBottom: 8, letterSpacing: '-0.02em' }}>{f.title}</div>
                <div style={{ fontSize: 13.5, color: '#64748b', lineHeight: 1.65 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS + VIDEO ───────────────────────────────────────── */}
      <section id="demo" style={{ padding: '0 28px 96px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', paddingTop: 80, textAlign: 'center' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>How it works</div>
          <h2 style={{ fontSize: 'clamp(26px,4vw,44px)', fontWeight: 900, letterSpacing: '-0.03em', color: '#0f172a', marginBottom: 16 }}>Up and running in 4 minutes</h2>
          <p style={{ fontSize: 15.5, color: '#64748b', marginBottom: 48, lineHeight: 1.65 }}>Register → paste one script tag → your first chat arrives.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 20, marginBottom: 56, textAlign: 'left' }}>
            {[
              { step: '01', title: 'Create workspace', desc: 'Register with email. Organisation ready in seconds.', color: '#2563eb' },
              { step: '02', title: 'Paste the snippet', desc: 'One script tag before </body>. Works on any site.', color: '#7c3aed' },
              { step: '03', title: 'Train your bot', desc: 'Add URLs or upload docs. AI chatbot live in minutes.', color: '#059669' },
              { step: '04', title: 'Start chatting', desc: 'Visitors greeted automatically. Agents get AI suggestions.', color: '#d97706' },
            ].map(({ step, title, desc, color }) => (
              <div key={step} style={{ padding: '22px', background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color, marginBottom: 10, fontFamily: 'monospace', letterSpacing: '0.05em' }}>STEP {step}</div>
                <div style={{ fontSize: 14.5, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>{title}</div>
                <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>

          {/* Video placeholder */}
          <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', background: 'linear-gradient(135deg,#1e3a8a,#065f46)', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
            <div style={{ textAlign: 'center', zIndex: 1 }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', border: '2px solid rgba(255,255,255,0.3)' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21"/></svg>
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'white', marginBottom: 6 }}>Watch the 2-minute demo</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>Real-time chat, AI suggestions, and bot handoff in action</div>
            </div>
            <div style={{ position: 'absolute', top: 20, right: 20, background: '#ecfdf5', borderRadius: 8, padding: '5px 12px', fontSize: 11.5, fontWeight: 700, color: '#059669', display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#059669' }} /> LIVE DEMO
            </div>
          </div>
        </div>
      </section>

      {/* ── USE CASES ──────────────────────────────────────────────────── */}
      <section id="usecases" style={{ padding: '96px 28px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Use cases</div>
            <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 900, letterSpacing: '-0.03em', color: '#0f172a', lineHeight: 1.1, marginBottom: 14 }}>Real problems, solved fast</h2>
            <p style={{ fontSize: 15.5, color: '#64748b', maxWidth: 440, margin: '0 auto', lineHeight: 1.65 }}>From e-commerce to SaaS, here is how teams use LiveSupport to grow.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 20 }}>
            {USE_CASES.map(uc => (
              <div key={uc.title} style={{ padding: '28px', background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'box-shadow 0.2s, transform 0.2s' }}
                className="ls-uc-card"
              >
                <div style={{ fontSize: 32, marginBottom: 14 }}>{uc.emoji}</div>
                <div style={{ fontSize: 15.5, fontWeight: 700, color: '#0f172a', marginBottom: 10, letterSpacing: '-0.02em' }}>{uc.title}</div>
                <div style={{ fontSize: 13.5, color: '#64748b', lineHeight: 1.65, marginBottom: 16 }}>{uc.desc}</div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#ecfdf5', color: '#059669', padding: '5px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700 }}>↑ {uc.stat}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INDUSTRIES ─────────────────────────────────────────────────── */}
      <section id="industries" style={{ padding: '96px 28px', background: '#f0f7ff', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Industries</div>
            <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 900, letterSpacing: '-0.03em', color: '#0f172a', lineHeight: 1.1 }}>Works for your industry</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
            {INDUSTRIES.map(ind => (
              <div key={ind.name} style={{ padding: '24px', background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{ fontSize: 28 }}>{ind.icon}</div>
                  <div style={{ fontSize: 15.5, fontWeight: 700, color: '#0f172a' }}>{ind.name}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {ind.features.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, color: '#475569' }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ────────────────────────────────────────────────────── */}
      <section id="pricing" style={{ padding: '96px 28px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Pricing</div>
          <h2 style={{ fontSize: 'clamp(28px,4vw,46px)', fontWeight: 900, letterSpacing: '-0.03em', color: '#0f172a', lineHeight: 1.1, marginBottom: 12 }}>Simple, honest pricing</h2>
          <p style={{ fontSize: 15.5, color: '#64748b', marginBottom: 14, lineHeight: 1.6 }}>Start free. Pay as you grow.</p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 999, padding: '5px 16px', fontSize: 13, color: '#059669', fontWeight: 700, marginBottom: 52 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            Save 20% with annual billing
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 16, marginBottom: 40 }}>
            {PLANS.map(plan => (
              <div key={plan.name} style={{ background: plan.highlight ? 'linear-gradient(135deg,#2563eb,#1d4ed8)' : 'white', border: plan.highlight ? 'none' : '1px solid #e2e8f0', borderRadius: 18, padding: '28px 24px', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: plan.highlight ? '0 12px 40px rgba(37,99,235,0.3)' : '0 2px 8px rgba(0,0,0,0.04)', transform: plan.highlight ? 'scale(1.04)' : 'none' }}>
                {(plan as any).badge && <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: '#f59e0b', color: 'black', fontSize: 10, fontWeight: 800, padding: '3px 12px', borderRadius: 999 }}>{(plan as any).badge}</div>}
                <div style={{ fontSize: 15, fontWeight: 700, color: plan.highlight ? 'rgba(255,255,255,0.85)' : '#0f172a', marginBottom: 4 }}>{plan.name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
                  <span style={{ fontSize: 40, fontWeight: 900, letterSpacing: '-0.04em', color: plan.highlight ? 'white' : '#0f172a', lineHeight: 1 }}>{plan.monthly === 0 ? 'Free' : `$${plan.monthly}`}</span>
                  {plan.monthly > 0 && <span style={{ fontSize: 12.5, color: plan.highlight ? 'rgba(255,255,255,0.6)' : '#94a3b8' }}>/mo</span>}
                </div>
                <div style={{ fontSize: 12, color: plan.highlight ? 'rgba(255,255,255,0.55)' : '#94a3b8', marginBottom: 20 }}>{plan.desc}</div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, flex: 1, marginBottom: 24 }}>
                  {plan.features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: plan.highlight ? 'rgba(255,255,255,0.85)' : '#475569' }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={plan.highlight ? '#86efac' : '#059669'} strokeWidth="2.5" strokeLinecap="round" style={{ marginTop: 1, flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/register" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', fontWeight: 700, fontSize: 14, padding: '12px 20px', borderRadius: 10, background: plan.highlight ? 'rgba(255,255,255,0.15)' : '#eff6ff', color: plan.highlight ? 'white' : '#2563eb', border: plan.highlight ? '1px solid rgba(255,255,255,0.25)' : 'none', transition: 'all 0.15s' }}>
                  {plan.monthly === 0 ? 'Get started free' : 'Start 14-day trial'} →
                </Link>
              </div>
            ))}
          </div>
          <Link href="/pricing" style={{ fontSize: 14, color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>See full feature comparison →</Link>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────── */}
      <section id="faq" style={{ padding: '96px 28px', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>FAQ</div>
            <h2 style={{ fontSize: 'clamp(28px,4vw,42px)', fontWeight: 900, letterSpacing: '-0.03em', color: '#0f172a', lineHeight: 1.1 }}>Everything you are wondering</h2>
          </div>
          <div>
            {FAQS.map(({ q, a }, i) => (
              <div key={i} style={{ borderBottom: '1px solid #e2e8f0', padding: '22px 0' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#2563eb' }}>Q</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 8, letterSpacing: '-0.01em' }}>{q}</div>
                    <div style={{ fontSize: 13.5, color: '#64748b', lineHeight: 1.7 }}>{a}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────────────────── */}
      <section style={{ padding: '96px 28px 110px', background: 'linear-gradient(135deg,#1e3a8a 0%,#065f46 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.12)', borderRadius: 999, padding: '6px 18px', marginBottom: 24, border: '1px solid rgba(255,255,255,0.2)' }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#34d399' }} />
            <span style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>Ready in 4 minutes</span>
          </div>
          <h2 style={{ fontSize: 'clamp(32px,5vw,56px)', fontWeight: 900, letterSpacing: '-0.04em', color: 'white', lineHeight: 1.05, marginBottom: 18 }}>Your customers are waiting</h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', lineHeight: 1.65, marginBottom: 40, maxWidth: 480, margin: '0 auto 40px' }}>
            Join teams who replaced Intercom, Crisp, and LiveChat. Start free. Upgrade only when you grow.
          </p>
          <Link href="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'white', color: '#2563eb', textDecoration: 'none', fontWeight: 800, fontSize: 15, padding: '14px 32px', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
            Create your free workspace →
          </Link>
          <div style={{ marginTop: 20, fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>No credit card · 14-day trial on paid plans · Cancel any time</div>
        </div>
      </section>

      <style>{`
        @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        .ls-feat-card { background: white; transition: background .2s; }
        .ls-feat-card:hover { background: #f0f7ff !important; }
        .ls-uc-card { transition: box-shadow .2s, transform .2s; }
        .ls-uc-card:hover { box-shadow: 0 8px 28px rgba(37,99,235,0.12) !important; transform: translateY(-2px) !important; }
      `}</style>
    </>
  );
}
