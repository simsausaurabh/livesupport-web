'use client';
import { useState } from 'react';
import { billingApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { Check, Zap, CreditCard, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const PLANS = [
  {
    key: 'FREE', name: 'Free', monthly: 0, yearly: 0,
    desc: 'For solo founders and side projects',
    features: ['1 agent', '250 conversations/mo', 'Basic analytics', 'Widget customiser', 'Proactive greeting & check-in'],
    limits: '0 chatbots · 0 knowledge sources',
  },
  {
    key: 'STARTER', name: 'Starter', monthly: 9, yearly: 7,
    desc: 'For small teams getting started with AI support',
    features: ['3 agents', '2,500 conversations/mo', '1 AI chatbot', '5 knowledge sources', 'AI reply suggestions', 'Human handoff', 'Canned responses', 'File attachments'],
    limits: '1 chatbot · 5 sources',
  },
  {
    key: 'TEAM', name: 'Team', monthly: 19, yearly: 15,
    desc: 'For growing teams needing full AI & analytics',
    badge: 'Most popular',
    features: ['10 agents', '2,500 conversations/mo', '10 AI chatbots', '25 knowledge sources', 'Custom AI persona', 'Advanced analytics', 'Webhooks', 'CSAT & ratings', 'Remove branding'],
    limits: '10 chatbots · 25 sources',
  },
  {
    key: 'BUSINESS', name: 'Business', monthly: 29, yearly: 23,
    desc: 'Unlimited scale with full API & compliance',
    features: ['Unlimited agents', '2,500 conversations/mo', '50 AI chatbots', '200 knowledge sources', 'REST API access', 'SLA reports', 'Custom roles', 'Data export', 'Priority support'],
    limits: '50 chatbots · 200 sources',
  },
];

export default function BillingPage() {
  const { organization } = useAuthStore();
  const currentPlan = organization?.plan ?? 'FREE';
  const [yearly, setYearly]   = useState(false);
  const [loading, setLoading] = useState<string>('');
  const [portalLoading, setPortalLoading] = useState(false);

  const upgrade = async (planKey: string) => {
    if (planKey === 'FREE' || planKey === currentPlan) return;
    setLoading(planKey);
    try {
      const priceMap: Record<string, string> = {
        STARTER:  yearly ? 'price_starter_yearly'  : 'price_starter_monthly',
        TEAM:     yearly ? 'price_team_yearly'     : 'price_team_monthly',
        BUSINESS: yearly ? 'price_business_yearly' : 'price_business_monthly',
      };
      const data = await billingApi.checkout(priceMap[planKey], 1, yearly);
      if (data.url) window.location.href = data.url;
    } catch (e: any) { alert(e.message); }
    finally { setLoading(''); }
  };

  const openPortal = async () => {
    setPortalLoading(true);
    try {
      const data = await billingApi.portal();
      if (data.url) window.location.href = data.url;
    } catch (e: any) { alert(e.message); }
    finally { setPortalLoading(false); }
  };

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: 28 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: 4 }}>Billing</h1>
          <p style={{ fontSize: 13, color: 'var(--text-3)' }}>
            Current plan: <strong style={{ color: 'var(--blue)' }}>{currentPlan}</strong>
          </p>
        </div>
        {currentPlan !== 'FREE' && (
          <button onClick={openPortal} disabled={portalLoading} className="btn-secondary" style={{ fontSize: 13, gap: 6 }}>
            <CreditCard size={14} /> {portalLoading ? 'Opening…' : 'Manage subscription'}
            <ExternalLink size={11} />
          </button>
        )}
      </div>

      {/* Yearly toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 36, padding: '14px', background: 'var(--bg-2)', borderRadius: 12, border: '1px solid var(--border)' }}>
        <span style={{ fontSize: 13.5, fontWeight: yearly ? 400 : 700, color: yearly ? 'var(--text-3)' : 'var(--text)' }}>Monthly</span>
        <button onClick={() => setYearly(y => !y)} style={{
          width: 48, height: 26, borderRadius: 13, border: 'none', cursor: 'pointer',
          background: yearly ? 'var(--green)' : 'var(--border-2)', position: 'relative', transition: 'background .2s',
        }}>
          <span style={{
            position: 'absolute', top: 3, left: yearly ? 24 : 3, width: 20, height: 20,
            borderRadius: '50%', background: 'white', transition: 'left .2s',
            boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
          }} />
        </button>
        <span style={{ fontSize: 13.5, fontWeight: yearly ? 700 : 400, color: yearly ? 'var(--text)' : 'var(--text-3)' }}>
          Annual
        </span>
        {yearly && (
          <span style={{ fontSize: 12, fontWeight: 700, color: 'white', background: 'var(--green)', padding: '3px 10px', borderRadius: 999, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Zap size={10} fill="white" /> Save 20%
          </span>
        )}
      </div>

      {/* Plan cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(230px,1fr))', gap: 14, marginBottom: 32 }}>
        {PLANS.map(plan => {
          const isCurrent  = plan.key === currentPlan;
          const isHighlight = plan.key === 'TEAM';
          const price      = yearly ? plan.yearly : plan.monthly;

          return (
            <div key={plan.key} style={{
              background: isHighlight ? 'linear-gradient(135deg,var(--blue),var(--blue-2))' : 'var(--bg-1)',
              border: isCurrent
                ? '2px solid var(--green)'
                : isHighlight ? 'none' : '1px solid var(--border)',
              borderRadius: 16, padding: '24px 20px',
              display: 'flex', flexDirection: 'column', gap: 0,
              position: 'relative',
              boxShadow: isHighlight ? '0 8px 32px rgba(37,99,235,0.25)' : 'var(--shadow-sm)',
              transform: isHighlight ? 'scale(1.03)' : 'none',
            }}>
              {/* Badges */}
              {isCurrent && (
                <div style={{ position: 'absolute', top: -10, right: 14, background: 'var(--green)', color: 'white', fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 999 }}>Current</div>
              )}
              {(plan as any).badge && !isCurrent && (
                <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: 'var(--amber)', color: 'black', fontSize: 10, fontWeight: 800, padding: '3px 12px', borderRadius: 999 }}>{(plan as any).badge}</div>
              )}

              <div style={{ fontSize: 14, fontWeight: 700, color: isHighlight ? 'rgba(255,255,255,0.8)' : 'var(--text)', marginBottom: 6 }}>{plan.name}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginBottom: 4 }}>
                <span style={{ fontSize: 38, fontWeight: 900, letterSpacing: '-0.04em', color: isHighlight ? 'white' : 'var(--text)', lineHeight: 1 }}>
                  {price === 0 ? 'Free' : `$${price}`}
                </span>
                {price > 0 && <span style={{ fontSize: 12, color: isHighlight ? 'rgba(255,255,255,0.6)' : 'var(--text-3)' }}>/agent/mo</span>}
              </div>
              {yearly && price > 0 && (
                <div style={{ fontSize: 11, color: isHighlight ? 'rgba(255,255,255,0.55)' : 'var(--green)', marginBottom: 4, fontWeight: 600 }}>
                  Billed ${price * 12}/agent/year
                </div>
              )}
              <div style={{ fontSize: 12, color: isHighlight ? 'rgba(255,255,255,0.55)' : 'var(--text-3)', marginBottom: 18 }}>{plan.desc}</div>

              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 7, flex: 1, marginBottom: 20 }}>
                {plan.features.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 7, fontSize: 12.5, color: isHighlight ? 'rgba(255,255,255,0.85)' : 'var(--text-2)' }}>
                    <Check size={12} color={isHighlight ? '#86efac' : 'var(--green)'} style={{ marginTop: 2, flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
              </ul>

              <div style={{ fontSize: 10.5, color: isHighlight ? 'rgba(255,255,255,0.4)' : 'var(--text-3)', marginBottom: 14, fontStyle: 'italic' }}>{plan.limits}</div>

              <button
                onClick={() => upgrade(plan.key)}
                disabled={isCurrent || plan.key === 'FREE' || !!loading}
                style={{
                  padding: '10px', borderRadius: 10, border: isHighlight ? '1px solid rgba(255,255,255,0.3)' : '1px solid var(--border-2)',
                  background: isCurrent ? 'var(--green-light)' : isHighlight ? 'rgba(255,255,255,0.15)' : 'var(--blue-light)',
                  color: isCurrent ? 'var(--green)' : isHighlight ? 'white' : 'var(--blue)',
                  fontWeight: 700, fontSize: 13, cursor: (isCurrent || plan.key === 'FREE') ? 'default' : 'pointer',
                  opacity: (plan.key !== 'FREE' && !isCurrent && loading === plan.key) ? 0.7 : 1,
                  fontFamily: 'var(--font-sans)', transition: 'all .15s',
                }}
              >
                {loading === plan.key ? 'Redirecting…' :
                 isCurrent           ? '✓ Current plan' :
                 plan.key === 'FREE' ? 'Free forever' :
                                       `Upgrade to ${plan.name} →`}
              </button>
            </div>
          );
        })}
      </div>

      {/* Note */}
      <div style={{ textAlign: 'center', fontSize: 12.5, color: 'var(--text-3)' }}>
        All paid plans include a 14-day free trial. No credit card required to start.
        &nbsp;·&nbsp; Annual billing saves 20% vs monthly.
      </div>
    </div>
  );
}
