
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin, Heart, Share2, BadgeCheck, BedDouble,
  Maximize2, Building2, Sofa, Calendar, Phone,
  MessageSquare, ChevronLeft, ChevronRight,
  Wifi, Car, Shield, Dumbbell, Waves, Leaf,
  Star, ArrowLeft, Flag
} from 'lucide-react';
import { getPropertyById } from '../../api/propertyApi';
import { scheduleVisit } from '../../api/tenantApi';
import { useAuth } from '../../context/AuthContext';

// Gradient fallback for properties without images
const GRADIENTS = [
  'linear-gradient(135deg,#667eea,#764ba2)', 'linear-gradient(135deg,#f093fb,#f5576c)',
  'linear-gradient(135deg,#4facfe,#00f2fe)', 'linear-gradient(135deg,#43e97b,#38f9d7)',
];

// Amenity icon map
const AMENITY_ICONS = {
  'Gym': Dumbbell, 'Pool': Waves, 'Parking': Car,
  'Security': Shield, 'WiFi': Wifi, 'Garden': Leaf,
  'Power Backup': Building2, 'Lift': Building2, 'Meals': Building2,
};

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [property,    setProperty]    = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [saved,       setSaved]       = useState(false);
  const [activeImg,   setActiveImg]   = useState(0);
  const [visitDate,   setVisitDate]   = useState('');
  const [visitTime,   setVisitTime]   = useState('');
  const [visitBooked, setVisitBooked] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const data = await getPropertyById(id);
        // Build images array: real images or gradient fallbacks
        if (!data.images || data.images.length === 0) {
          data.images = GRADIENTS;
        }
        setProperty(data);
      } catch (err) {
        console.error('Failed to load property:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const nextImg = () => setActiveImg(i => (i+1) % (property?.images?.length || 1));
  const prevImg = () => setActiveImg(i => (i-1+(property?.images?.length || 1)) % (property?.images?.length || 1));

  const handleBookVisit = async () => {
    if (!visitDate || !visitTime) return;
    if (!user) { navigate('/login'); return; }
    try {
      await scheduleVisit({ propertyId: property.id, date: visitDate, time: visitTime, note: '' });
      setVisitBooked(true);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to schedule visit');
    }
  };

  // ── TODAY's date as min for visit date picker ──────────────
  const today = new Date().toISOString().split('T')[0];

  if (loading) {
    return (
      <div style={{ display:'flex', justifyContent:'center', alignItems:'center', minHeight:'60vh' }}>
        <div style={{ width:'36px', height:'36px', border:'3px solid var(--color-bebe)', borderTopColor:'var(--color-primary)', borderRadius:'50%', animation:'spin 0.8s linear infinite' }}></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div style={{ textAlign:'center', padding:'80px 24px' }}>
        <h2 style={{ fontFamily:'var(--font-headline)', marginBottom:'8px' }}>Property not found</h2>
        <Link to="/search" className="btn-primary" style={{ display:'inline-block', marginTop:'16px' }}>Browse Properties</Link>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor:'var(--color-background)', minHeight:'100vh' }}>

      {/* Back button */}
      <div style={{ padding:'16px 24px', maxWidth:'1100px', margin:'0 auto' }}>
        <button onClick={() => navigate(-1)}
          style={{ display:'flex', alignItems:'center', gap:'6px', background:'none', border:'none', cursor:'pointer', color:'var(--color-foggy)', fontFamily:'var(--font-body)', fontSize:'14px', padding:0 }}>
          <ArrowLeft size={16}/> Back to results
        </button>
      </div>

      <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'0 24px 48px', display:'grid', gridTemplateColumns:'1fr 340px', gap:'32px', alignItems:'start' }}>

        {/* ── LEFT COLUMN ──────────────────────────────────── */}
        <div>

          {/* Photo Gallery */}
          <div style={{ borderRadius:'20px', overflow:'hidden', position:'relative', marginBottom:'24px', height:'400px' }}>
            {/* Main photo */}
            <div style={{ height:'100%', background:property.images[activeImg], transition:'background 0.4s' }} />
            {/* Arrows */}
            {property.images.length > 1 && (
              <>
                <button onClick={prevImg} style={{ position:'absolute', left:'16px', top:'50%', transform:'translateY(-50%)', width:'40px', height:'40px', borderRadius:'50%', backgroundColor:'rgba(255,255,255,0.9)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(4px)' }}>
                  <ChevronLeft size={20}/>
                </button>
                <button onClick={nextImg} style={{ position:'absolute', right:'16px', top:'50%', transform:'translateY(-50%)', width:'40px', height:'40px', borderRadius:'50%', backgroundColor:'rgba(255,255,255,0.9)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(4px)' }}>
                  <ChevronRight size={20}/>
                </button>
              </>
            )}
            {/* Dots */}
            <div style={{ position:'absolute', bottom:'16px', left:'50%', transform:'translateX(-50%)', display:'flex', gap:'6px' }}>
              {property.images.map((_,i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  style={{ width: i===activeImg?'20px':'8px', height:'8px', borderRadius:'4px', backgroundColor: i===activeImg?'#fff':'rgba(255,255,255,0.5)', border:'none', cursor:'pointer', transition:'all 0.2s', padding:0 }} />
              ))}
            </div>
            {/* Thumbnail strip */}
            <div style={{ position:'absolute', bottom:'44px', left:'16px', display:'flex', gap:'8px' }}>
              {property.images.map((img,i) => (
                <div key={i} onClick={() => setActiveImg(i)} style={{ width:'52px', height:'38px', borderRadius:'8px', background:img, cursor:'pointer', border: i===activeImg?'2px solid #fff':'2px solid transparent', opacity: i===activeImg?1:0.7, transition:'all 0.2s' }} />
              ))}
            </div>
          </div>

          {/* Title + actions */}
          <div style={{ backgroundColor:'var(--color-white)', borderRadius:'16px', border:'1px solid var(--color-bebe)', padding:'24px', marginBottom:'20px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'16px', marginBottom:'12px' }}>
              <div>
                {property.verified && (
                  <div className="badge-verified" style={{ marginBottom:'8px' }}>
                    <BadgeCheck size={12}/> Verified Property
                  </div>
                )}
                <h1 style={{ fontFamily:'var(--font-headline)', fontSize:'24px', fontWeight:700, marginBottom:'6px', color:'var(--color-on-surface)' }}>
                  {property.title}
                </h1>
                <p style={{ color:'var(--color-foggy)', fontSize:'14px', display:'flex', alignItems:'center', gap:'4px' }}>
                  <MapPin size={14}/> {property.fullAddress}
                </p>
              </div>
              {/* Action buttons */}
              <div style={{ display:'flex', gap:'8px', flexShrink:0 }}>
                <button onClick={() => setSaved(!saved)}
                  style={{ width:'40px', height:'40px', borderRadius:'50%', border:'1px solid var(--color-bebe)', background:saved?'rgba(186,0,54,0.08)':'var(--color-white)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.15s' }}>
                  <Heart size={18} fill={saved?'#ba0036':'none'} color={saved?'#ba0036':'#1a1c1c'}/>
                </button>
                <button style={{ width:'40px', height:'40px', borderRadius:'50%', border:'1px solid var(--color-bebe)', backgroundColor:'var(--color-white)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Share2 size={18}/>
                </button>
                <button style={{ width:'40px', height:'40px', borderRadius:'50%', border:'1px solid var(--color-bebe)', backgroundColor:'var(--color-white)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Flag size={16} color="var(--color-foggy)"/>
                </button>
              </div>
            </div>

            {/* Quick stats */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'12px', padding:'16px 0', borderTop:'1px solid var(--color-bebe)', borderBottom:'1px solid var(--color-bebe)', margin:'16px 0' }}>
              {[
                { icon: BedDouble,  label:'BHK',       value:`${property.bhk} BHK` },
                { icon: Maximize2,  label:'Area',      value:`${property.area} sq.ft` },
                { icon: Building2,  label:'Floor',     value:property.floor },
                { icon: Sofa,       label:'Furnished', value:property.furnished },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} style={{ textAlign:'center' }}>
                  <Icon size={20} color="var(--color-primary)" style={{ marginBottom:'6px' }}/>
                  <div style={{ fontSize:'13px', fontWeight:700, color:'var(--color-on-surface)', marginBottom:'2px' }}>{value}</div>
                  <div style={{ fontSize:'11px', color:'var(--color-foggy)' }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Rent + Deposit */}
            <div style={{ display:'flex', gap:'24px', alignItems:'center' }}>
              <div>
                <div style={{ fontFamily:'var(--font-headline)', fontSize:'28px', fontWeight:700, color:'var(--color-on-surface)' }}>
                  ₹{property.rent.toLocaleString('en-IN')}
                  <span style={{ fontFamily:'var(--font-body)', fontSize:'16px', fontWeight:400, color:'var(--color-foggy)' }}>/month</span>
                </div>
              </div>
              <div style={{ width:'1px', height:'40px', backgroundColor:'var(--color-bebe)' }}/>
              <div>
                <div style={{ fontSize:'13px', color:'var(--color-foggy)', marginBottom:'2px' }}>Security Deposit</div>
                <div style={{ fontSize:'18px', fontWeight:700, fontFamily:'var(--font-headline)' }}>₹{property.deposit.toLocaleString('en-IN')}</div>
              </div>
              <div style={{ marginLeft:'auto' }}>
                <span style={{ backgroundColor:'#e8f5e9', color:'#2e7d32', padding:'4px 12px', borderRadius:'999px', fontSize:'13px', fontWeight:600 }}>
                  Available: {property.available}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div style={{ backgroundColor:'var(--color-white)', borderRadius:'16px', border:'1px solid var(--color-bebe)', padding:'24px', marginBottom:'20px' }}>
            <h2 style={{ fontFamily:'var(--font-headline)', fontSize:'18px', fontWeight:700, marginBottom:'14px' }}>About this property</h2>
            <p style={{ color:'var(--color-on-surface)', lineHeight:1.8, fontSize:'15px' }}>{property.description}</p>
          </div>

          {/* Amenities */}
          <div style={{ backgroundColor:'var(--color-white)', borderRadius:'16px', border:'1px solid var(--color-bebe)', padding:'24px', marginBottom:'20px' }}>
            <h2 style={{ fontFamily:'var(--font-headline)', fontSize:'18px', fontWeight:700, marginBottom:'16px' }}>Amenities</h2>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'12px' }}>
              {property.amenities.map(a => {
                const Icon = AMENITY_ICONS[a] || Building2;
                return (
                  <div key={a} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'10px 16px', backgroundColor:'var(--color-surface-container-low)', borderRadius:'12px', border:'1px solid var(--color-bebe)' }}>
                    <Icon size={16} color="var(--color-primary)"/>
                    <span style={{ fontSize:'14px', fontWeight:500 }}>{a}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* ── RIGHT COLUMN (Sticky) ─────────────────────────── */}
        <div style={{ position:'sticky', top:'84px', display:'flex', flexDirection:'column', gap:'16px' }}>

          {/* Owner Card */}
          <div style={{ backgroundColor:'var(--color-white)', borderRadius:'16px', border:'1px solid var(--color-bebe)', padding:'24px' }}>
            <h2 style={{ fontFamily:'var(--font-headline)', fontSize:'16px', fontWeight:700, marginBottom:'16px' }}>About the Owner</h2>
            <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'16px' }}>
              <div style={{ width:'48px', height:'48px', borderRadius:'50%', backgroundColor:'var(--color-primary)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-headline)', fontWeight:700, fontSize:'20px', flexShrink:0 }}>
                {property.owner.name.charAt(0)}
              </div>
              <div>
                <div style={{ fontWeight:700, fontSize:'15px' }}>{property.owner.name}</div>
                <div style={{ color:'var(--color-foggy)', fontSize:'12px' }}>Owner since {property.owner.since}</div>
                <div style={{ display:'flex', alignItems:'center', gap:'4px', marginTop:'2px' }}>
                  <Star size={12} fill="#f59e0b" color="#f59e0b"/>
                  <span style={{ fontSize:'12px', fontWeight:600 }}>{property.owner.rating}</span>
                  <span style={{ fontSize:'12px', color:'var(--color-foggy)' }}>({property.owner.reviews} reviews)</span>
                </div>
              </div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
              <button className="btn-primary" style={{ width:'100%', justifyContent:'center', gap:'8px' }}>
                <Phone size={16}/> Show Number
              </button>
              <button className="btn-secondary" style={{ width:'100%', justifyContent:'center', gap:'8px' }}>
                <MessageSquare size={16}/> Send Message
              </button>
            </div>
            <p style={{ textAlign:'center', marginTop:'12px', fontSize:'12px', color:'var(--color-foggy)' }}>
              🔒 Your number is not shared with the owner
            </p>
          </div>

          {/* Schedule Visit Card */}
          <div style={{ backgroundColor:'var(--color-white)', borderRadius:'16px', border:'1px solid var(--color-bebe)', padding:'24px' }}>
            <h2 style={{ fontFamily:'var(--font-headline)', fontSize:'16px', fontWeight:700, marginBottom:'4px', display:'flex', alignItems:'center', gap:'8px' }}>
              <Calendar size={18} color="var(--color-primary)"/> Schedule a Visit
            </h2>
            <p style={{ color:'var(--color-foggy)', fontSize:'13px', marginBottom:'16px' }}>Pick a date and time that works for you</p>

            {visitBooked ? (
              <div style={{ textAlign:'center', padding:'20px', backgroundColor:'rgba(34,197,94,0.08)', borderRadius:'12px', border:'1px solid rgba(34,197,94,0.2)' }}>
                <div style={{ fontSize:'32px', marginBottom:'8px' }}>✅</div>
                <p style={{ fontWeight:700, color:'#166534', fontSize:'15px' }}>Visit Requested!</p>
                <p style={{ color:'var(--color-foggy)', fontSize:'13px', marginTop:'4px' }}>
                  {visitDate} at {visitTime}
                </p>
                <p style={{ color:'var(--color-foggy)', fontSize:'12px', marginTop:'8px' }}>The owner will confirm shortly</p>
              </div>
            ) : (
              <>
                <div style={{ marginBottom:'12px' }}>
                  <label className="input-label" style={{ fontSize:'13px' }}>Preferred Date</label>
                  <input className="input" type="date" min={today}
                    value={visitDate} onChange={e => setVisitDate(e.target.value)}
                    style={{ fontSize:'14px' }} />
                </div>
                <div style={{ marginBottom:'16px' }}>
                  <label className="input-label" style={{ fontSize:'13px' }}>Preferred Time</label>
                  <select className="input" value={visitTime} onChange={e => setVisitTime(e.target.value)} style={{ fontSize:'14px', cursor:'pointer' }}>
                    <option value="">Select time</option>
                    {['9:00 AM','10:00 AM','11:00 AM','12:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <button onClick={handleBookVisit} className="btn-primary"
                  style={{ width:'100%', justifyContent:'center', gap:'8px', opacity:(!visitDate||!visitTime)?0.5:1, cursor:(!visitDate||!visitTime)?'not-allowed':'pointer' }}
                  disabled={!visitDate||!visitTime}>
                  <Calendar size={16}/> Request Visit
                </button>
                <p style={{ textAlign:'center', marginTop:'10px', fontSize:'12px', color:'var(--color-foggy)' }}>Free of charge · No commitment needed</p>
              </>
            )}
          </div>

          {/* Report link */}
          <button style={{ background:'none', border:'none', color:'var(--color-foggy)', fontSize:'13px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'4px' }}>
            <Flag size={13}/> Report this listing
          </button>
        </div>

      </div>
    </div>
  );
}
