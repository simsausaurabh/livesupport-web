'use client';
import { useEffect, useState } from 'react';
import { analyticsApi } from '@/lib/api';
import { MessageSquare, Clock, Star, TrendingUp, Users, CheckCircle } from 'lucide-react';

function Stat({ icon: Icon, label, value, sub, color = 'var(--accent)' }: any) {
  return (
    <div className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={15} color={color} />
        </div>
      </div>
      <div>
        <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text)', lineHeight: 1 }}>{value ?? '—'}</div>
        {sub && <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>{sub}</div>}
      </div>
    </div>
  );
}

function AgentRow({ agent }: { agent: any }) {
  const pct = agent.resolutionRate;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--bg-3)', border: '1px solid var(--border-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--accent)', fontSize: 13, flexShrink: 0 }}>
        {agent.name.charAt(0).toUpperCase()}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{agent.name}</div>
        <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{agent.totalConversations} chats · avg {Math.round(agent.avgFirstResponseSeconds / 60)}m response</div>
        <div style={{ marginTop: 6, height: 4, background: 'var(--bg-3)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: pct > 70 ? 'var(--green)' : 'var(--accent)', borderRadius: 2, transition: 'width 0.6s ease' }} />
        </div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{pct}%</div>
        <div style={{ fontSize: 11, color: 'var(--text-3)' }}>resolved</div>
        {agent.ratingAvg > 0 && (
          <div style={{ fontSize: 11, color: 'var(--accent)', marginTop: 2 }}>★ {agent.ratingAvg.toFixed(1)}</div>
        )}
      </div>
    </div>
  );
}

function fmtTime(s: number) {
  if (!s) return '—';
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}

export default function AnalyticsPage() {
  const [overview, setOverview] = useState<any>(null);
  const [agents,   setAgents]   = useState<any[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    Promise.all([analyticsApi.overview(), analyticsApi.agents()])
      .then(([ov, ag]) => { setOverview(ov); setAgents(ag); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: 28 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>Analytics</h1>
        <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 4 }}>Last 30 days overview</p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
          <div style={{ width: 28, height: 28, border: '2px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      ) : (
        <>
          {/* Stats grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14, marginBottom: 28 }}>
            <Stat icon={MessageSquare} label="Total chats"   value={overview?.totalConversations}  color="var(--accent)" />
            <Stat icon={CheckCircle}   label="Resolved"      value={overview?.resolvedConversations} sub={`${overview?.resolutionRate}% rate`} color="var(--green)" />
            <Stat icon={TrendingUp}    label="Missed"        value={overview?.missedConversations}  color="var(--red)" />
            <Stat icon={Clock}         label="Avg response"  value={fmtTime(overview?.avgFirstResponseSeconds)} color="var(--blue)" />
            <Stat icon={Clock}         label="Avg duration"  value={fmtTime(overview?.avgDurationSeconds)} color="var(--text-2)" />
            <Stat icon={Star}          label="Avg CSAT"      value={overview?.avgRating > 0 ? `${overview.avgRating} ★` : '—'} color="var(--accent)" />
          </div>

          {/* Agent leaderboard */}
          <div className="card" style={{ padding: '20px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <Users size={15} color="var(--accent)" />
              <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>Agent Performance</h2>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 16 }}>Ranked by resolution rate</p>

            {agents.length === 0
              ? <p style={{ color: 'var(--text-3)', fontSize: 13 }}>No agent data yet</p>
              : agents
                  .sort((a, b) => b.resolutionRate - a.resolutionRate)
                  .map(a => <AgentRow key={a.id} agent={a} />)
            }
          </div>
        </>
      )}
    </div>
  );
}
