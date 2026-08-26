
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Search, Heart, Calendar, FileText, MessageSquare,
  MapPin, ArrowRight, Clock, CheckCircle, XCircle,
  Bell, TrendingUp, BadgeCheck, ChevronRight
} from 'lucide-react';

const STATS = [
  { label:'Saved Homes',    value:'8',  icon: Heart,        color:'#ba0036', bg:'rgba(186,0,54,0.08)',  link:'/tenant/saved' },
  { label:'Upcoming Visits',value:'3',  icon: Calendar,     color:'#3b82f6', bg:'rgba(59,130,246,0.08)', link:'/tenant/visits' },
  { label:'Applications',   value:'2',  icon: FileText,     color:'#f59e0b', bg:'rgba(245,158,11,0.08)', link:'/tenant/applications' },
  { label:'Unread Messages', value:'5', icon: MessageSquare, color:'#22c55e', bg:'rgba(34,197,94,0.08)', link:'/tenant/messages' },
];

const SAVED_PROPERTIES = [
  { id:1, title:'Modern 2BHK in Bandra',    locality:'Bandra West, Mumbai',   rent:45000, bhk:2, verified:true,  gradient:'linear-gradient(135deg,#667eea,#764ba2)' },
  { id:2, title:'Cozy Studio in Koramangala', locality:'Koramangala, Bangalore', rent:22000, bhk:1, verified:true, gradient:'linear-gradient(135deg,#f093fb,#f5576c)' },
  { id:4, title:'Luxury 3BHK in Juhu',       locality:'Juhu, Mumbai',           rent:80000, bhk:3, verified:true, gradient:'linear-gradient(135deg,#43e97b,#38f9d7)' },
];

const UPCOMING_VISITS = [
  { id:1, property:'Modern 2BHK in Bandra',     date:'Aug 14, 2026', time:'11:00 AM', status:'Confirmed', owner:'Amit Sharma' },
  { id:2, property:'Cozy Studio Koramangala',   date:'Aug 16, 2026', time:'3:00 PM',  status:'Pending',   owner:'Priya Nair' },
  { id:3, property:'2BHK in Whitefield',        date:'Aug 18, 2026', time:'10:00 AM', status:'Confirmed', owner:'Ravi Kumar' },
];

const APPLICATIONS = [
  { id:1, property:'Luxury 3BHK in Juhu', status:'Under Review', date:'Aug 10, 2026', step:2, totalSteps:4 },
  { id:2, property:'Modern 2BHK in Bandra', status:'Approved',   date:'Aug 8, 2026',  step:4, totalSteps:4 },
];

// Status pill colors
const STATUS_COLORS = {
  Confirmed:     { bg:'#e8f5e9', color:'#2e7d32' },
  Pending:       { bg:'#fff8e1', color:'#f59e0b' },
  Cancelled:     { bg:'#fdecea', color:'#ba1a1a' },
  'Under Review':{ bg:'#e3f2fd', color:'#1565c0' },
  Approved:      { bg:'#e8f5e9', color:'#2e7d32' },
  Rejected:      { bg:'#fdecea', color:'#ba1a1a' },
};

function StatusPill({ status }) {
  const colors = STATUS_COLORS[status] || { bg:'#f3f3f3', color:'#6a6a6a' };
  return (
    <span style={{ padding:'3px 10px', borderRadius:'999px', fontSize:'12px', fontWeight:600, backgroundColor:colors.bg, color:colors.color }}>
      {status}
    </span>
  );
}

// Application progress bar
function ApplicationProgress({ step, totalSteps, steps }) {
  return (
    <div style={{ marginTop:'10px' }}>
      <div style={{ display:'flex', gap:'4px' }}>
        {Array(totalSteps).fill(0).map((_,i) => (
          <div key={i} style={{ flex:1, height:'4px', borderRadius:'2px', backgroundColor: i < step ? 'var(--color-primary)' : 'var(--color-bebe)', transition:'background-color 0.3s' }} />
        ))}
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', marginTop:'6px' }}>
        {['Applied','In Review','Verification','Move In'].map((s,i) => (
          <span key={s} style={{ fontSize:'10px', color: i < step ? 'var(--color-primary)' : 'var(--color-foggy)', fontWeight: i < step ? 600 : 400, textAlign: i===0?'left':i===totalSteps-1?'right':'center', flex:1 }}>{s}</span>
        ))}
      </div>
    </div>
  );
}

export default function TenantDashboard() {
  const { user } = useAuth();

  return (
    <div style={{ maxWidth:'900px' }}>

      {/* ── WELCOME BANNER ─────────────────────────────────── */}
      <div style={{ background:'linear-gradient(135deg, #ba0036 0%, #5c0020 100%)', borderRadius:'20px', padding:'28px 32px', marginBottom:'28px', color:'#fff', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <p style={{ fontSize:'14px', opacity:0.8, marginBottom:'4px' }}>Good morning 👋</p>
          <h1 style={{ fontFamily:'var(--font-headline)', fontSize:'26px', fontWeight:700, marginBottom:'6px' }}>
            Welcome back, {user.name.split(' ')[0]}!
          </h1>
          <p style={{ opacity:0.8, fontSize:'14px' }}>You have 3 upcoming visits this week</p>
        </div>
        <Link to="/search" style={{ textDecoration:'none', backgroundColor:'rgba(255,255,255,0.15)', color:'#fff', border:'1px solid rgba(255,255,255,0.3)', borderRadius:'999px', padding:'10px 20px', fontFamily:'var(--font-body)', fontWeight:600, fontSize:'14px', display:'flex', alignItems:'center', gap:'8px', backdropFilter:'blur(8px)', transition:'background 0.2s' }}
          onMouseOver={e => e.currentTarget.style.backgroundColor='rgba(255,255,255,0.25)'}
          onMouseOut={e => e.currentTarget.style.backgroundColor='rgba(255,255,255,0.15)'}
        >
          <Search size={16}/> Find Homes
        </Link>
      </div>

      {/* ── STATS CARDS ────────────────────────────────────── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px', marginBottom:'28px' }}>
        {STATS.map(({ label, value, icon:Icon, color, bg, link }) => (
          <Link key={label} to={link} style={{ textDecoration:'none' }}>
            <div style={{ backgroundColor:'var(--color-white)', border:'1px solid var(--color-bebe)', borderRadius:'16px', padding:'20px', transition:'transform 0.2s, box-shadow 0.2s', cursor:'pointer' }}
              onMouseOver={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 6px 20px rgba(0,0,0,0.08)'; }}
              onMouseOut={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}
            >
              <div style={{ width:'42px', height:'42px', borderRadius:'12px', backgroundColor:bg, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'12px' }}>
                <Icon size={20} color={color}/>
              </div>
              <div style={{ fontFamily:'var(--font-headline)', fontSize:'26px', fontWeight:700, color:'var(--color-on-surface)', marginBottom:'2px' }}>{value}</div>
              <div style={{ fontSize:'13px', color:'var(--color-foggy)' }}>{label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* ── TWO COLUMN LAYOUT ──────────────────────────────── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginBottom:'20px' }}>

        {/* Saved Properties */}
        <div style={{ backgroundColor:'var(--color-white)', border:'1px solid var(--color-bebe)', borderRadius:'16px', padding:'20px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
            <h2 style={{ fontFamily:'var(--font-headline)', fontSize:'16px', fontWeight:700 }}>Saved Homes</h2>
            <Link to="/tenant/saved" style={{ color:'var(--color-primary)', fontSize:'13px', fontWeight:600, textDecoration:'none', display:'flex', alignItems:'center', gap:'4px' }}>
              View all <ArrowRight size={14}/>
            </Link>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
            {SAVED_PROPERTIES.map(p => (
              <Link key={p.id} to={`/property/${p.id}`} style={{ textDecoration:'none', display:'flex', gap:'12px', alignItems:'center' }}>
                <div style={{ width:'60px', height:'50px', borderRadius:'10px', background:p.gradient, flexShrink:0 }}/>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontWeight:600, fontSize:'13px', color:'var(--color-on-surface)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', marginBottom:'2px' }}>{p.title}</p>
                  <p style={{ color:'var(--color-foggy)', fontSize:'11px', display:'flex', alignItems:'center', gap:'3px' }}><MapPin size={10}/>{p.locality}</p>
                  <p style={{ fontFamily:'var(--font-headline)', fontSize:'14px', fontWeight:700, color:'var(--color-primary)', marginTop:'2px' }}>₹{p.rent.toLocaleString('en-IN')}/mo</p>
                </div>
                <Heart size={14} color="var(--color-primary)" fill="var(--color-primary)"/>
              </Link>
            ))}
          </div>
        </div>

        {/* Upcoming Visits */}
        <div style={{ backgroundColor:'var(--color-white)', border:'1px solid var(--color-bebe)', borderRadius:'16px', padding:'20px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
            <h2 style={{ fontFamily:'var(--font-headline)', fontSize:'16px', fontWeight:700 }}>Upcoming Visits</h2>
            <Link to="/tenant/visits" style={{ color:'var(--color-primary)', fontSize:'13px', fontWeight:600, textDecoration:'none', display:'flex', alignItems:'center', gap:'4px' }}>
              View all <ArrowRight size={14}/>
            </Link>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
            {UPCOMING_VISITS.map(visit => (
              <div key={visit.id} style={{ borderLeft:'3px solid var(--color-primary)', paddingLeft:'12px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                  <p style={{ fontWeight:600, fontSize:'13px', color:'var(--color-on-surface)', marginBottom:'2px' }}>{visit.property}</p>
                  <StatusPill status={visit.status}/>
                </div>
                <p style={{ fontSize:'11px', color:'var(--color-foggy)', display:'flex', alignItems:'center', gap:'4px' }}>
                  <Clock size={10}/>{visit.date} · {visit.time}
                </p>
                <p style={{ fontSize:'11px', color:'var(--color-foggy)', marginTop:'2px' }}>with {visit.owner}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── APPLICATIONS ───────────────────────────────────── */}
      <div style={{ backgroundColor:'var(--color-white)', border:'1px solid var(--color-bebe)', borderRadius:'16px', padding:'20px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
          <h2 style={{ fontFamily:'var(--font-headline)', fontSize:'16px', fontWeight:700 }}>My Applications</h2>
          <Link to="/tenant/applications" style={{ color:'var(--color-primary)', fontSize:'13px', fontWeight:600, textDecoration:'none', display:'flex', alignItems:'center', gap:'4px' }}>
            View all <ArrowRight size={14}/>
          </Link>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
          {APPLICATIONS.map(app => (
            <div key={app.id} style={{ padding:'16px', backgroundColor:'var(--color-surface-container-low)', borderRadius:'12px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'4px' }}>
                <p style={{ fontWeight:600, fontSize:'14px', color:'var(--color-on-surface)' }}>{app.property}</p>
                <StatusPill status={app.status}/>
              </div>
              <p style={{ fontSize:'12px', color:'var(--color-foggy)', marginBottom:'8px' }}>Applied on {app.date}</p>
              <ApplicationProgress step={app.step} totalSteps={app.totalSteps}/>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
