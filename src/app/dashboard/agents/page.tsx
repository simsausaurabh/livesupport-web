'use client';
import { useEffect, useState } from 'react';
import { analyticsApi } from '@/lib/api';
import { Circle, UserPlus } from 'lucide-react';

const STATUS_COLOR: Record<string, string> = {
  ONLINE: 'var(--green)', AWAY: 'var(--accent)', OFFLINE: 'var(--text-3)',
};

export default function AgentsPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsApi.agents()
      .then(setAgents)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>Agents</h1>
          <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 4 }}>{agents.length} team members</p>
        </div>
        <button className="btn-primary" style={{ fontSize: 13 }}>
          <UserPlus size={14} /> Invite agent
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
          <div style={{ width: 24, height: 24, border: '2px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
          {agents.map(a => (
            <div key={a.id} className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--bg-3)', border: '1px solid var(--border-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, color: 'var(--accent)' }}>
                  {a.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>{a.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                    <Circle size={6} fill={STATUS_COLOR[a.status]} color={STATUS_COLOR[a.status]} />
                    <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{a.status}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { label: 'Chats', value: a.totalConversations },
                  { label: 'Resolved', value: `${a.resolutionRate}%` },
                  { label: 'Avg resp', value: a.avgFirstResponseSeconds > 0 ? `${Math.round(a.avgFirstResponseSeconds / 60)}m` : '—' },
                  { label: 'Rating', value: a.ratingAvg > 0 ? `★ ${a.ratingAvg.toFixed(1)}` : '—' },
                ].map(({ label, value }) => (
                  <div key={label} style={{ background: 'var(--bg-2)', borderRadius: 8, padding: '8px 10px' }}>
                    <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 2 }}>{label}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
