'use client';
import { useState } from 'react';
import Link from 'next/link';

const PLANS = [
  {
    key:'FREE', name:'Free', monthly:0, yearly:0,
    desc:'For solo founders and side projects',
    features:['1 agent','250 conversations/month','Widget customiser','Proactive greeting (5s)','Periodic check-in messages','Basic analytics','3-month history'],
    chatbots:0, knowledge:0, highlight:false,
  },
  {
    key:'STARTER', name:'Starter', monthly:9, yearly:7,
    desc:'Per agent / month',
    features:['3 agents','2,500 conversations/month','1 AI chatbot','5 knowledge sources (URL/file/manual)','AI reply suggestions','Human handoff','Canned responses + /shortcuts','CSAT ratings','6-month history'],
    chatbots:1, knowledge:5, highlight:false,
  },
  {
    key:'TEAM', name:'Team', monthly:19, yearly:15,
    desc:'Per agent / month', badge:'Most popular',
    features:['10 agents','2,500 conversations/month','10 AI chatbots','25 knowledge sources','Custom AI persona','Advanced analytics','Webhooks','Remove branding','Data export','12-month history'],
    chatbots:10, knowledge:25, highlight:true,
  },
  {
    key:'BUSINESS', name:'Business', monthly:29, yearly:23,
    desc:'Per agent / month',
    features:['Unlimited agents','2,500 conversations/month','50 AI chatbots','200 knowledge sources','REST API','Custom roles','SLA reports','Priority support','24-month history'],
    chatbots:50, knowledge:200, highlight:false,
  },
];

const COMPARE = [
  { label:'Agents',               free:'1',      starter:'3',      team:'10',      biz:'Unlimited' },
  { label:'Conversations/mo',     free:'250',    starter:'2,500',  team:'2,500',   biz:'2,500' },
  { label:'AI chatbots',          free:'—',      starter:'1',      team:'10',      biz:'50' },
  { label:'Knowledge sources',    free:'—',      starter:'5',      team:'25',      biz:'200' },
  { label:'Chat history',         free:'3 mo',   starter:'6 mo',   team:'12 mo',   biz:'24 mo' },
  { label:'Proactive greeting',   free:true,     starter:true,     team:true,      biz:true },
  { label:'Periodic check-in',    free:true,     starter:true,     team:true,      biz:true },
  { label:'AI reply suggestions', free:false,    starter:true,     team:true,      biz:true },
  { label:'AI chatbot + KB',      free:false,    starter:true,     team:true,      biz:true },
  { label:'Human handoff',        free:false,    starter:true,     team:true,      biz:true },
  { label:'Custom AI persona',    free:false,    starter:false,    team:true,      biz:true },
  { label:'Webhooks',             free:false,    starter:false,    team:true,      biz:true },
  { label:'REST API',             free:false,    starter:false,    team:false,     biz:true },
  { label:'SLA reports',          free:false,    starter:false,    team:false,     biz:true },
];

function Cell({ val }: { val: boolean | string }) {
  if (typeof val === 'string') return <span style={{ fontSize:13, color: val==='—'?'#cbd5e1':'#0f172a', fontWeight: val==='—'?400:500 }}>{val}</span>;
  return val
    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
}

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);

  return (
    <>
      <section style={{ padding:'80px 28px 56px', textAlign:'center', background:'linear-gradient(180deg,#f0f7ff,#fff)' }}>
        <div style={{ fontSize:12, fontWeight:700, color:'#2563eb', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:14 }}>Pricing</div>
        <h1 style={{ fontSize:'clamp(34px,5vw,58px)', fontWeight:900, letterSpacing:'-0.04em', color:'#0f172a', lineHeight:1.05, marginBottom:14 }}>
          No seat minimums.<br />No hidden fees.
        </h1>
        <p style={{ fontSize:16, color:'#64748b', marginBottom:36 }}>Start free. Pay as your team grows. Cancel any time.</p>

        <div style={{ display:'inline-flex', alignItems:'center', gap:14, background:'#f1f5f9', borderRadius:999, padding:'8px 20px', border:'1px solid #e2e8f0' }}>
          <span style={{ fontSize:14, fontWeight:yearly?400:700, color:yearly?'#94a3b8':'#0f172a' }}>Monthly</span>
          <button onClick={() => setYearly(y => !y)} style={{ width:48, height:26, borderRadius:13, border:'none', cursor:'pointer', background:yearly?'#059669':'#cbd5e1', position:'relative', transition:'background .2s', flexShrink:0 }}>
            <span style={{ position:'absolute', top:3, left:yearly?25:3, width:20, height:20, borderRadius:'50%', background:'white', transition:'left .2s', boxShadow:'0 1px 4px rgba(0,0,0,.2)' }} />
          </button>
          <span style={{ fontSize:14, fontWeight:yearly?700:400, color:yearly?'#0f172a':'#94a3b8' }}>Annual</span>
          {yearly && <span style={{ fontSize:12, fontWeight:800, color:'white', background:'#059669', padding:'3px 10px', borderRadius:999, marginLeft:4 }}>Save 20%</span>}
        </div>
      </section>

      <section style={{ padding:'0 28px 80px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:16 }}>
          {PLANS.map(plan => {
            const price = yearly ? plan.yearly : plan.monthly;
            return (
              <div key={plan.key} style={{ background:plan.highlight?'linear-gradient(135deg,#2563eb,#1d4ed8)':'white', border:plan.highlight?'none':'1px solid #e2e8f0', borderRadius:18, padding:'28px 24px', display:'flex', flexDirection:'column', position:'relative', boxShadow:plan.highlight?'0 12px 40px rgba(37,99,235,0.3)':'0 2px 8px rgba(0,0,0,0.04)', transform:plan.highlight?'scale(1.04)':'none' }}>
                {(plan as any).badge && <div style={{ position:'absolute', top:-10, left:'50%', transform:'translateX(-50%)', background:'#f59e0b', color:'black', fontSize:10, fontWeight:800, padding:'3px 12px', borderRadius:999, whiteSpace:'nowrap' }}>{(plan as any).badge}</div>}
                <div style={{ fontSize:15, fontWeight:700, color:plan.highlight?'rgba(255,255,255,0.85)':'#0f172a', marginBottom:6 }}>{plan.name}</div>
                <div style={{ display:'flex', alignItems:'baseline', gap:4, marginBottom:4 }}>
                  <span style={{ fontSize:42, fontWeight:900, letterSpacing:'-0.04em', color:plan.highlight?'white':'#0f172a', lineHeight:1 }}>{price===0?'Free':`$${price}`}</span>
                  {price>0 && <span style={{ fontSize:12, color:plan.highlight?'rgba(255,255,255,0.6)':'#94a3b8' }}>/agent/mo</span>}
                </div>
                {yearly && price>0 && <div style={{ fontSize:11.5, color:plan.highlight?'#86efac':'#059669', fontWeight:600, marginBottom:4 }}>Billed ${price*12}/agent/year — 20% off</div>}
                <div style={{ fontSize:12, color:plan.highlight?'rgba(255,255,255,0.55)':'#94a3b8', marginBottom:16 }}>{plan.desc}</div>
                <div style={{ display:'flex', gap:6, marginBottom:18, flexWrap:'wrap' }}>
                  <span style={{ fontSize:10.5, fontWeight:700, padding:'3px 8px', borderRadius:999, background:plan.highlight?'rgba(255,255,255,0.15)':'#eff6ff', color:plan.highlight?'white':'#2563eb' }}>{plan.chatbots===0?'No chatbots':`${plan.chatbots} chatbot${plan.chatbots>1?'s':''}`}</span>
                  <span style={{ fontSize:10.5, fontWeight:700, padding:'3px 8px', borderRadius:999, background:plan.highlight?'rgba(255,255,255,0.15)':'#ecfdf5', color:plan.highlight?'white':'#059669' }}>{plan.knowledge===0?'No KB':`${plan.knowledge} KB sources`}</span>
                </div>
                <ul style={{ listStyle:'none', flex:1, display:'flex', flexDirection:'column', gap:8, marginBottom:24 }}>
                  {plan.features.map(f => (
                    <li key={f} style={{ display:'flex', alignItems:'flex-start', gap:8, fontSize:13, color:plan.highlight?'rgba(255,255,255,0.85)':'#475569' }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={plan.highlight?'#86efac':'#059669'} strokeWidth="2.5" strokeLinecap="round" style={{ marginTop:1, flexShrink:0 }}><polyline points="20 6 9 17 4 12"/></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/register" style={{ display:'flex', alignItems:'center', justifyContent:'center', textDecoration:'none', fontWeight:700, fontSize:14, padding:'12px 20px', borderRadius:10, background:plan.highlight?'rgba(255,255,255,0.15)':'#eff6ff', color:plan.highlight?'white':'#2563eb', border:plan.highlight?'1px solid rgba(255,255,255,0.25)':'none' }}>
                  {plan.monthly===0?'Get started free':'Start 14-day trial'} →
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      <section style={{ padding:'0 28px 96px' }}>
        <div style={{ maxWidth:960, margin:'0 auto' }}>
          <h2 style={{ fontSize:26, fontWeight:900, letterSpacing:'-0.03em', color:'#0f172a', marginBottom:32, textAlign:'center' }}>Full feature comparison</h2>
          <div style={{ border:'1px solid #e2e8f0', borderRadius:16, overflow:'hidden' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 100px 100px 100px 110px', background:'#f8fafc', borderBottom:'1px solid #e2e8f0' }}>
              <div style={{ padding:'14px 20px', fontSize:11, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.06em' }}>Feature</div>
              {['Free','Starter','Team','Business'].map((p,i) => <div key={p} style={{ padding:'14px 0', textAlign:'center', fontSize:13, fontWeight:700, color:i===2?'#2563eb':'#475569' }}>{p}</div>)}
            </div>
            {COMPARE.map((row, i) => (
              <div key={row.label} style={{ display:'grid', gridTemplateColumns:'1fr 100px 100px 100px 110px', background:i%2===0?'white':'#f8fafc', borderBottom:i<COMPARE.length-1?'1px solid #e2e8f0':'none' }}>
                <div style={{ padding:'12px 20px', fontSize:13, color:'#475569' }}>{row.label}</div>
                {[row.free,row.starter,row.team,row.biz].map((val,j) => <div key={j} style={{ padding:'12px 0', display:'flex', alignItems:'center', justifyContent:'center' }}><Cell val={val} /></div>)}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding:'0 28px 96px', background:'#f8fafc', borderTop:'1px solid #e2e8f0' }}>
        <div style={{ maxWidth:680, margin:'0 auto', paddingTop:64 }}>
          <h2 style={{ fontSize:26, fontWeight:900, letterSpacing:'-0.03em', color:'#0f172a', marginBottom:40, textAlign:'center' }}>Common questions</h2>
          {[
            { q:'Does the 20% annual discount apply automatically?', a:'Yes. Toggle to annual billing at checkout and the 20% is applied immediately — no coupon needed.' },
            { q:'What counts as a conversation?', a:'Any unique chat started by a visitor during the billing month, whether handled by a bot or human.' },
            { q:'Can I self-host LiveSupport?', a:'Yes. The full TypeScript monorepo is yours. Run it on any server with Node.js, MySQL, and Redis.' },
            { q:'Is there a free trial on paid plans?', a:'All paid plans include a 14-day free trial. No credit card required to start.' },
            { q:'What happens when I hit the conversation limit?', a:'The widget stops accepting new conversations until your monthly reset. Existing chats are never interrupted.' },
          ].map(({ q, a }, i) => (
            <div key={i} style={{ borderBottom:'1px solid #e2e8f0', padding:'20px 0' }}>
              <div style={{ fontSize:14.5, fontWeight:700, color:'#0f172a', marginBottom:8 }}>{q}</div>
              <div style={{ fontSize:13.5, color:'#64748b', lineHeight:1.7 }}>{a}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
