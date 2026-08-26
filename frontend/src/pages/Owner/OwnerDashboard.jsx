import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Home, Eye, Calendar, MessageSquare, Plus,
  TrendingUp, IndianRupee, ArrowRight, Clock,
  CheckCircle, XCircle, AlertCircle, BarChart3,
  BadgeCheck, MoreVertical, Users
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const STATS = [
  { label:'Active Listings', value:'3',       icon:Home,         color:'#ba0036', bg:'rgba(186,0,54,0.08)' },
  { label:'Total Views',     value:'1,284',   icon:Eye,          color:'#3b82f6', bg:'rgba(59,130,246,0.08)' },
  { label:'Visit Requests',  value:'8',       icon:Calendar,     color:'#f59e0b', bg:'rgba(245,158,11,0.08)' },
  { label:'Total Inquiries', value:'24',      icon:MessageSquare,color:'#22c55e', bg:'rgba(34,197,94,0.08)' },
];

const MY_PROPERTIES = [
  { id:1, title:'2BHK in Bandra West',      rent:45000, status:'Active',  views:542, inquiries:9,  gradient:'linear-gradient(135deg,#667eea,#764ba2)', verified:true },
  { id:3, title:'3BHK Villa Jubilee Hills',  rent:65000, status:'Rented',  views:389, inquiries:7,  gradient:'linear-gradient(135deg,#4facfe,#00f2fe)', verified:false },
  { id:4, title:'Luxury 3BHK Juhu',          rent:80000, status:'Paused',  views:353, inquiries:8,  gradient:'linear-gradient(135deg,#43e97b,#38f9d7)', verified:true },
];

const VISIT_REQUESTS = [
  { id:1, tenant:'Rahul Mehta',    property:'2BHK in Bandra West',   date:'Aug 14', time:'11:00 AM', status:'Pending' },
  { id:2, tenant:'Priya Singh',    property:'Luxury 3BHK Juhu',      date:'Aug 15', time:'3:00 PM',  status:'Confirmed' },
  { id:3, tenant:'Ananya Kumar',   property:'2BHK in Bandra West',   date:'Aug 16', time:'10:00 AM', status:'Pending' },
];

const STATUS_COLORS = {
  Active:    { bg:'#e8f5e9', color:'#2e7d32' },
  Rented:    { bg:'#e3f2fd', color:'#1565c0' },
  Paused:    { bg:'#f3f3f3', color:'#6a6a6a' },
  Pending:   { bg:'#fff8e1', color:'#b45309' },
  Confirmed: { bg:'#e8f5e9', color:'#2e7d32' },
};

function StatusPill({ status }) {
  const c = STATUS_COLORS[status] || { bg:'#f3f3f3', color:'#6a6a6a' };
  return <span style={{ padding:'3px 10px', borderRadius:'999px', fontSize:'12px', fontWeight:600, backgroundColor:c.bg, color:c.color }}>{status}</span>;
}

export default function OwnerDashboard() {
  const { user } = useAuth();
  const [visitActions, setVisitActions] = useState({});

  const handleVisit = (id, action) => setVisitActions(prev => ({...prev, [id]: action}));

  return (
    <div style={{ maxWidth:'960px' }}>

      {/* Welcome Banner */}
      <div style={{ background:'linear-gradient(135deg,#1a1c1c 0%,#2f3131 100%)', borderRadius:'20px', padding:'28px 32px', marginBottom:'28px', color:'#fff', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <p style={{ fontSize:'14px', opacity:0.6, marginBottom:'4px' }}>Owner Dashboard</p>
          <h1 style={{ fontFamily:'var(--font-headline)', fontSize:'26px', fontWeight:700, marginBottom:'6px' }}>
            Hello, {user.name.split(' ')[0]} 👋
          </h1>
          <p style={{ opacity:0.6, fontSize:'14px' }}>You have 2 pending visit requests to respond to</p>
        </div>
        <Link to="/owner/add-property" className="btn-primary" style={{ display:'flex', alignItems:'center', gap:'8px', whiteSpace:'nowrap' }}>
          <Plus size={18}/> List New Property
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px', marginBottom:'28px' }}>
        {STATS.map(({ label, value, icon:Icon, color, bg }) => (
          <div key={label} style={{ backgroundColor:'var(--color-white)', border:'1px solid var(--color-bebe)', borderRadius:'16px', padding:'20px' }}>
            <div style={{ width:'42px', height:'42px', borderRadius:'12px', backgroundColor:bg, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'12px' }}>
              <Icon size={20} color={color}/>
            </div>
            <div style={{ fontFamily:'var(--font-headline)', fontSize:'26px', fontWeight:700, color:'var(--color-on-surface)', marginBottom:'2px' }}>{value}</div>
            <div style={{ fontSize:'13px', color:'var(--color-foggy)' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Earnings Summary */}
      <div style={{ backgroundColor:'var(--color-white)', border:'1px solid var(--color-bebe)', borderRadius:'16px', padding:'24px', marginBottom:'20px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' }}>
          <h2 style={{ fontFamily:'var(--font-headline)', fontSize:'16px', fontWeight:700 }}>Earnings Overview</h2>
          <span style={{ fontSize:'13px', color:'var(--color-foggy)' }}>August 2026</span>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'20px' }}>
          {[
            { label:'Monthly Revenue', value:'₹1,25,000', note:'+₹45,000 from last month', up:true },
            { label:'Active Properties', value:'1 of 3',  note:'2 properties inactive',    up:false },
            { label:'Avg. Rent',         value:'₹56,667', note:'per property/month',       up:true },
          ].map(item => (
            <div key={item.label} style={{ padding:'16px', backgroundColor:'var(--color-surface-container-low)', borderRadius:'12px' }}>
              <p style={{ fontSize:'12px', color:'var(--color-foggy)', marginBottom:'6px' }}>{item.label}</p>
              <p style={{ fontFamily:'var(--font-headline)', fontSize:'22px', fontWeight:700, color:'var(--color-on-surface)', marginBottom:'4px' }}>{item.value}</p>
              <p style={{ fontSize:'12px', color: item.up ? '#22c55e' : 'var(--color-foggy)', display:'flex', alignItems:'center', gap:'4px' }}>
                {item.up && <TrendingUp size={12}/>}{item.note}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Two columns */}
      <div style={{ display:'grid', gridTemplateColumns:'1.2fr 1fr', gap:'20px', marginBottom:'20px' }}>

        {/* My Properties */}
        <div style={{ backgroundColor:'var(--color-white)', border:'1px solid var(--color-bebe)', borderRadius:'16px', padding:'20px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
            <h2 style={{ fontFamily:'var(--font-headline)', fontSize:'16px', fontWeight:700 }}>My Properties</h2>
            <Link to="/owner/properties" style={{ color:'var(--color-primary)', fontSize:'13px', fontWeight:600, textDecoration:'none', display:'flex', alignItems:'center', gap:'4px' }}>
              View all <ArrowRight size={14}/>
            </Link>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
            {MY_PROPERTIES.map(p => (
              <div key={p.id} style={{ display:'flex', gap:'12px', alignItems:'center' }}>
                <div style={{ width:'52px', height:'44px', borderRadius:'10px', background:p.gradient, flexShrink:0, position:'relative' }}>
                  {p.verified && <BadgeCheck size={14} color="#22c55e" style={{ position:'absolute', bottom:'-4px', right:'-4px', backgroundColor:'#fff', borderRadius:'50%' }}/>}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'8px' }}>
                    <p style={{ fontWeight:600, fontSize:'13px', color:'var(--color-on-surface)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{p.title}</p>
                    <StatusPill status={p.status}/>
                  </div>
                  <div style={{ display:'flex', gap:'12px', marginTop:'4px' }}>
                    <p style={{ fontSize:'12px', fontWeight:700, color:'var(--color-primary)' }}>₹{p.rent.toLocaleString('en-IN')}/mo</p>
                    <p style={{ fontSize:'12px', color:'var(--color-foggy)', display:'flex', alignItems:'center', gap:'3px' }}><Eye size={10}/>{p.views}</p>
                    <p style={{ fontSize:'12px', color:'var(--color-foggy)', display:'flex', alignItems:'center', gap:'3px' }}><Users size={10}/>{p.inquiries}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Link to="/owner/add-property" style={{ textDecoration:'none', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', padding:'12px', marginTop:'14px', border:'1.5px dashed var(--color-bebe)', borderRadius:'12px', color:'var(--color-foggy)', fontSize:'13px', fontWeight:500, transition:'all 0.15s' }}
            onMouseOver={e => { e.currentTarget.style.borderColor='var(--color-primary)'; e.currentTarget.style.color='var(--color-primary)'; e.currentTarget.style.backgroundColor='rgba(186,0,54,0.03)'; }}
            onMouseOut={e => { e.currentTarget.style.borderColor='var(--color-bebe)'; e.currentTarget.style.color='var(--color-foggy)'; e.currentTarget.style.backgroundColor='transparent'; }}
          >
            <Plus size={16}/> Add new property
          </Link>
        </div>

        {/* Visit Requests */}
        <div style={{ backgroundColor:'var(--color-white)', border:'1px solid var(--color-bebe)', borderRadius:'16px', padding:'20px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
            <h2 style={{ fontFamily:'var(--font-headline)', fontSize:'16px', fontWeight:700 }}>Visit Requests</h2>
            <Link to="/owner/visits" style={{ color:'var(--color-primary)', fontSize:'13px', fontWeight:600, textDecoration:'none', display:'flex', alignItems:'center', gap:'4px' }}>
              View all <ArrowRight size={14}/>
            </Link>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
            {VISIT_REQUESTS.map(v => (
              <div key={v.id} style={{ padding:'12px', backgroundColor:'var(--color-surface-container-low)', borderRadius:'12px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'4px' }}>
                  <p style={{ fontWeight:600, fontSize:'13px', color:'var(--color-on-surface)' }}>{v.tenant}</p>
                  <StatusPill status={visitActions[v.id] === 'accept' ? 'Confirmed' : visitActions[v.id] === 'decline' ? 'Cancelled' : v.status}/>
                </div>
                <p style={{ fontSize:'11px', color:'var(--color-foggy)', marginBottom:'2px' }}>{v.property}</p>
                <p style={{ fontSize:'11px', color:'var(--color-foggy)', display:'flex', alignItems:'center', gap:'4px' }}><Clock size={10}/>{v.date} · {v.time}</p>
                {/* Accept/Decline only for pending and not yet acted on */}
                {v.status === 'Pending' && !visitActions[v.id] && (
                  <div style={{ display:'flex', gap:'6px', marginTop:'8px' }}>
                    <button onClick={() => handleVisit(v.id,'accept')}
                      style={{ flex:1, padding:'6px', backgroundColor:'rgba(34,197,94,0.1)', color:'#166534', border:'1px solid rgba(34,197,94,0.3)', borderRadius:'8px', fontFamily:'var(--font-body)', fontSize:'12px', fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'4px' }}>
                      <CheckCircle size={13}/> Accept
                    </button>
                    <button onClick={() => handleVisit(v.id,'decline')}
                      style={{ flex:1, padding:'6px', backgroundColor:'rgba(186,0,54,0.08)', color:'var(--color-primary)', border:'1px solid var(--color-outline-variant)', borderRadius:'8px', fontFamily:'var(--font-body)', fontSize:'12px', fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'4px' }}>
                      <XCircle size={13}/> Decline
                    </button>
                  </div>
                )}
                {visitActions[v.id] === 'accept' && <p style={{ fontSize:'11px', color:'#166534', fontWeight:600, marginTop:'6px' }}>✅ Visit confirmed</p>}
                {visitActions[v.id] === 'decline' && <p style={{ fontSize:'11px', color:'var(--color-error)', fontWeight:600, marginTop:'6px' }}>❌ Declined</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
