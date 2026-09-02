import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, MapPin, Heart, Star, Shield,
  CheckCircle, ArrowRight, Building2,
  Users, BadgeCheck, Home, Sparkles, User, Gem
} from 'lucide-react';
import { getAllProperties } from '../../api/propertyApi';

const CITIES = [
  { name: 'Mumbai',    count: '12,400+', gradient: 'linear-gradient(135deg,#f5c6cb,#f8a5c2)' },
  { name: 'Bangalore', count: '9,800+',  gradient: 'linear-gradient(135deg,#a8edea,#fed6e3)' },
  { name: 'Delhi',     count: '11,200+', gradient: 'linear-gradient(135deg,#fbc2eb,#a6c1ee)' },
  { name: 'Hyderabad', count: '7,600+',  gradient: 'linear-gradient(135deg,#fddb92,#d1fdff)' },
  { name: 'Chennai',   count: '6,300+',  gradient: 'linear-gradient(135deg,#c2e9fb,#a1c4fd)' },
  { name: 'Pune',      count: '8,100+',  gradient: 'linear-gradient(135deg,#e0c3fc,#8ec5fc)' },
];

const FALLBACK_PROPERTIES = [
  {
    id: 7,
    title: 'Ultra-Luxury 5 BHK Beachfront Villa with Private Infinity Pool',
    city: 'Mumbai',
    locality: 'Juhu Beach',
    rent: 275000,
    bhk: 5,
    area: 4800,
    type: 'Villa',
    verified: true,
    images: [
      '/properties/villa_exterior.jpg',
      '/properties/villa_living.jpg',
      '/properties/villa_bedroom.jpg',
      '/properties/villa_kitchen.jpg'
    ]
  },
  {
    id: 8,
    title: 'Lavish 4 BHK Sky Penthouse with Rooftop Jacuzzi',
    city: 'Bangalore',
    locality: 'Indiranagar',
    rent: 180000,
    bhk: 4,
    area: 3600,
    type: 'Apartment',
    verified: true,
    images: [
      '/properties/penthouse_rooftop.jpg',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    id: 1,
    title: 'Modern 2 BHK Sea-Breeze Apartment in Bandra West',
    city: 'Mumbai',
    locality: 'Bandra West',
    rent: 65000,
    bhk: 2,
    area: 950,
    type: 'Apartment',
    verified: true,
    images: [
      '/properties/apt_living.jpg',
      '/properties/apt_bedroom.jpg',
      '/properties/apt_kitchen.jpg'
    ]
  },
  {
    id: 9,
    title: 'Palatial 4 BHK Modern Architectural Mansion',
    city: 'Hyderabad',
    locality: 'Jubilee Hills',
    rent: 160000,
    bhk: 4,
    area: 4200,
    type: 'House',
    verified: true,
    images: ['https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80']
  },
  {
    id: 10,
    title: 'Boutique Luxury 1 BHK Garden Terrace Suite',
    city: 'Pune',
    locality: 'Koregaon Park',
    rent: 42000,
    bhk: 1,
    area: 750,
    type: 'Studio',
    verified: true,
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80']
  },
  {
    id: 2,
    title: 'Luxurious 4 BHK Gated Villa with Private Garden',
    city: 'Bangalore',
    locality: 'Whitefield',
    rent: 95000,
    bhk: 4,
    area: 3200,
    type: 'Villa',
    verified: true,
    images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80']
  },
  {
    id: 6,
    title: 'Contemporary 3 BHK Golf-Course View Condominium',
    city: 'Delhi NCR',
    locality: 'DLF Phase 5',
    rent: 78000,
    bhk: 3,
    area: 1850,
    type: 'Apartment',
    verified: true,
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80']
  }
];

const TESTIMONIALS = [
  { name:'Priya Sharma',   role:'Tenant — Mumbai',    stars:5, text:'Found my dream apartment in just 3 days! No broker, no hassle. The owner verification gave me complete confidence.' },
  { name:'Rahul Mehta',    role:'Owner — Bangalore',  stars:5, text:'Listed my property and got genuine inquiries within hours. The platform is incredibly easy to use.' },
  { name:'Ananya Singh',   role:'Tenant — Delhi',     stars:5, text:'The visit scheduling feature saved so much time. I booked 3 visits in one afternoon and moved in the same week!' },
];

// ---------- PROPERTY CARD COMPONENT ----------
function PropertyCard({ property }) {
  const [saved, setSaved] = useState(false);
  const imageUrl = property.images && property.images.length > 0 ? property.images[0] : null;
  const isLuxury = property.rent >= 70000;

  return (
    <div className="card" style={{ cursor:'pointer', position:'relative', overflow:'hidden' }}>
      {/* Image Container */}
      <div style={{
        height:'220px',
        backgroundColor:'#1a1c1c',
        backgroundImage: imageUrl ? `url(${imageUrl})` : (property.gradient || 'linear-gradient(135deg,#667eea,#764ba2)'),
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position:'relative'
      }}>
        <button
          onClick={(e) => { e.stopPropagation(); setSaved(!saved); }}
          style={{
            position:'absolute', top:'12px', right:'12px',
            width:'36px', height:'36px', borderRadius:'50%',
            backgroundColor:'rgba(255,255,255,0.9)',
            border:'none', cursor:'pointer', display:'flex',
            alignItems:'center', justifyContent:'center',
            backdropFilter:'blur(4px)',
            transition:'transform 0.2s',
            zIndex: 2
          }}
          aria-label="Save property"
        >
          <Heart size={16} fill={saved ? '#ba0036' : 'none'} color={saved ? '#ba0036' : '#1a1c1c'} />
        </button>

        <div style={{ position:'absolute', top:'12px', left:'12px', display:'flex', gap:'6px', zIndex: 2 }}>
          {property.verified && (
            <div style={{
              backgroundColor:'rgba(255,255,255,0.95)',
              borderRadius:'999px', padding:'3px 10px',
              fontSize:'11px', fontWeight:600, color:'#2e7d32',
              display:'flex', alignItems:'center', gap:'4px',
            }}>
              <BadgeCheck size={12} /> Verified
            </div>
          )}
          {isLuxury && (
            <div style={{
              backgroundColor:'rgba(26,28,28,0.9)',
              borderRadius:'999px', padding:'3px 10px',
              fontSize:'11px', fontWeight:600, color:'#ffd700',
              display:'flex', alignItems:'center', gap:'4px',
              border:'1px solid rgba(255,215,0,0.4)'
            }}>
              <Gem size={11} /> Luxury
            </div>
          )}
        </div>

        <div style={{
          position:'absolute', bottom:'12px', left:'12px',
          backgroundColor:'rgba(26,28,28,0.85)',
          borderRadius:'999px', padding:'4px 12px',
          color:'#fff', fontSize:'13px', fontWeight:700,
          backdropFilter:'blur(4px)',
          border:'1px solid rgba(255,255,255,0.1)'
        }}>
          ₹{property.rent.toLocaleString('en-IN')}/mo
        </div>
      </div>

      {/* Info */}
      <div style={{ padding:'18px' }}>
        <h3 style={{
          fontFamily:'var(--font-headline)',
          fontSize:'16px',
          fontWeight:700,
          marginBottom:'6px',
          color:'var(--color-on-surface)',
          whiteSpace:'nowrap',
          overflow:'hidden',
          textOverflow:'ellipsis'
        }}>
          {property.title}
        </h3>
        <p style={{ color:'var(--color-foggy)', fontSize:'13px', display:'flex', alignItems:'center', gap:'4px', marginBottom:'14px' }}>
          <MapPin size={13} color="var(--color-primary)" /> {property.locality}, {property.city}
        </p>
        <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'16px' }}>
          <span className="chip">{property.bhk} BHK</span>
          <span className="chip">{property.area} sq.ft</span>
          <span className="chip">{property.type}</span>
        </div>
        <Link to={`/property/${property.id}`} className="btn-primary" style={{ width:'100%', justifyContent:'center' }}>
          View Details
        </Link>
      </div>
    </div>
  );
}

// ---------- MAIN LANDING PAGE ----------
export default function LandingPage() {
  const navigate = useNavigate();
  const [searchForm, setSearchForm] = useState({ location:'', type:'', bhk:'' });
  const [featuredProperties, setFeaturedProperties] = useState(FALLBACK_PROPERTIES);

  useEffect(() => {
    const fetchHomes = async () => {
      try {
        const data = await getAllProperties();
        if (data && data.length > 0) {
          setFeaturedProperties(data);
        }
      } catch (err) {
        console.warn('Using fallback featured properties:', err);
      }
    };
    fetchHomes();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchForm).toString();
    navigate(`/search?${params}`);
  };

  return (
    <div style={{ fontFamily:'var(--font-body)', color:'var(--color-on-surface)', backgroundColor:'var(--color-background)' }}>

      {/* ═══════════════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════════════ */}
      <section style={{ backgroundColor:'var(--color-white)', padding:'80px 24px 64px', textAlign:'center' }}>
        <div style={{ maxWidth:'900px', margin:'0 auto' }}>

          {/* Headline */}
          <h1 style={{
            fontFamily:'var(--font-headline)',
            fontSize:'clamp(32px, 5vw, 52px)',
            fontWeight:700, lineHeight:1.15,
            marginBottom:'16px',
            color:'var(--color-on-surface)',
          }}>
            Find a place that<br />
            <span style={{ color:'var(--color-primary)' }}>feels like home.</span>
          </h1>
          <p style={{ color:'var(--color-foggy)', fontSize:'18px', marginBottom:'40px', lineHeight:1.6 }}>
            Discover thousands of verified rental homes across India — no brokers, no hidden fees.
          </p>

          {/* Search Capsule */}
          <form onSubmit={handleSearch} style={{
            display:'flex', flexWrap:'wrap', gap:'0',
            backgroundColor:'var(--color-white)',
            border:'1px solid var(--color-bebe)',
            borderRadius:'999px',
            boxShadow:'var(--shadow-search)',
            maxWidth:'780px', margin:'0 auto',
            overflow:'hidden',
          }}>
            {/* Location */}
            <div style={{ flex:'2 1 180px', display:'flex', alignItems:'center', padding:'0 20px', borderRight:'1px solid var(--color-bebe)', gap:'10px' }}>
              <MapPin size={18} color="var(--color-foggy)" />
              <input
                type="text"
                placeholder="City or locality"
                value={searchForm.location}
                onChange={e => setSearchForm({...searchForm, location: e.target.value})}
                style={{ border:'none', outline:'none', fontSize:'14px', fontFamily:'var(--font-body)', width:'100%', padding:'16px 0', background:'transparent', color:'var(--color-on-surface)' }}
              />
            </div>
            {/* Type */}
            <div style={{ flex:'1 1 130px', borderRight:'1px solid var(--color-bebe)' }}>
              <select
                value={searchForm.type}
                onChange={e => setSearchForm({...searchForm, type: e.target.value})}
                style={{ border:'none', outline:'none', fontSize:'14px', fontFamily:'var(--font-body)', width:'100%', height:'100%', padding:'0 16px', background:'transparent', color: searchForm.type ? 'var(--color-on-surface)' : 'var(--color-foggy)', cursor:'pointer' }}
              >
                <option value="">Property Type</option>
                <option value="Apartment">Apartment</option>
                <option value="House">Independent House</option>
                <option value="Villa">Villa</option>
                <option value="PG">PG</option>
                <option value="Studio">Studio</option>
              </select>
            </div>
            {/* BHK */}
            <div style={{ flex:'1 1 100px', borderRight:'1px solid var(--color-bebe)' }}>
              <select
                value={searchForm.bhk}
                onChange={e => setSearchForm({...searchForm, bhk: e.target.value})}
                style={{ border:'none', outline:'none', fontSize:'14px', fontFamily:'var(--font-body)', width:'100%', height:'100%', padding:'0 16px', background:'transparent', color: searchForm.bhk ? 'var(--color-on-surface)' : 'var(--color-foggy)', cursor:'pointer' }}
              >
                <option value="">BHK</option>
                <option value="1">1 BHK</option>
                <option value="2">2 BHK</option>
                <option value="3">3 BHK</option>
                <option value="4">4+ BHK</option>
              </select>
            </div>
            {/* Search Button */}
            <button type="submit" style={{
              padding:'14px 28px',
              backgroundColor:'var(--color-primary)',
              color:'#fff', border:'none',
              cursor:'pointer', fontFamily:'var(--font-body)',
              fontSize:'15px', fontWeight:600,
              display:'flex', alignItems:'center', gap:'8px',
              margin:'8px',
              borderRadius:'999px',
              transition:'background-color 0.15s',
            }}
              onMouseOver={e => e.currentTarget.style.backgroundColor='var(--color-rausch-600)'}
              onMouseOut={e => e.currentTarget.style.backgroundColor='var(--color-primary)'}
            >
              <Search size={18} /> Search
            </button>
          </form>

          {/* Stats */}
          <div style={{ display:'flex', justifyContent:'center', gap:'48px', flexWrap:'wrap', marginTop:'48px' }}>
            {[
              { value:'50,000+', label:'Properties Listed' },
              { value:'10,000+', label:'Verified Owners' },
              { value:'1M+',     label:'Happy Tenants' },
            ].map(stat => (
              <div key={stat.label} style={{ textAlign:'center' }}>
                <div style={{ fontFamily:'var(--font-headline)', fontSize:'28px', fontWeight:700, color:'var(--color-on-surface)' }}>{stat.value}</div>
                <div style={{ color:'var(--color-foggy)', fontSize:'14px', marginTop:'4px' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          POPULAR CITIES
          ═══════════════════════════════════════════════════ */}
      <section style={{ padding:'64px 24px' }}>
        <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'32px' }}>
            <h2 style={{ fontFamily:'var(--font-headline)', fontSize:'28px', fontWeight:700 }}>Popular Cities</h2>
            <Link to="/search" style={{ color:'var(--color-primary)', textDecoration:'none', fontSize:'14px', fontWeight:500, display:'flex', alignItems:'center', gap:'4px' }}>
              View all <ArrowRight size={16} />
            </Link>
          </div>
          <div className="scroll-row">
            {CITIES.map(city => (
              <Link
                key={city.name}
                to={`/search?location=${city.name}`}
                style={{ textDecoration:'none', color:'inherit' }}
              >
                <div style={{
                  width:'160px', borderRadius:'16px', overflow:'hidden',
                  border:'1px solid var(--color-bebe)', backgroundColor:'var(--color-white)',
                  transition:'transform 0.2s, box-shadow 0.2s',
                  cursor:'pointer',
                }}
                  onMouseOver={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(0,0,0,0.1)'; }}
                  onMouseOut={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}
                >
                  <div style={{ height:'100px', background: city.gradient }} />
                  <div style={{ padding:'12px 14px' }}>
                    <div style={{ fontWeight:600, fontSize:'15px', fontFamily:'var(--font-headline)' }}>{city.name}</div>
                    <div style={{ color:'var(--color-foggy)', fontSize:'12px', marginTop:'2px' }}>{city.count} homes</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FEATURED PROPERTIES
          ═══════════════════════════════════════════════════ */}
      <section style={{ padding:'0 24px 64px' }}>
        <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'32px' }}>
            <div>
              <h2 style={{ fontFamily:'var(--font-headline)', fontSize:'28px', fontWeight:700, marginBottom:'4px' }}>Featured Homes</h2>
              <p style={{ color:'var(--color-foggy)', fontSize:'14px' }}>Hand-picked properties by our team</p>
            </div>
            <Link to="/search" style={{ color:'var(--color-primary)', textDecoration:'none', fontSize:'14px', fontWeight:500, display:'flex', alignItems:'center', gap:'4px' }}>
              View all <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid-properties">
            {featuredProperties.map(p => <PropertyCard key={p.id} property={p} />)}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          WHY HOMENEST
          ═══════════════════════════════════════════════════ */}
      <section style={{ padding:'64px 24px', backgroundColor:'var(--color-white)' }}>
        <div style={{ maxWidth:'1100px', margin:'0 auto', textAlign:'center' }}>
          <h2 style={{ fontFamily:'var(--font-headline)', fontSize:'32px', fontWeight:700, marginBottom:'12px' }}>Why choose HomeNest?</h2>
          <p style={{ color:'var(--color-foggy)', fontSize:'16px', marginBottom:'48px' }}>We've built the rental platform we always wished existed</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'24px' }}>
            {[
              { Icon: CheckCircle, title:'Verified Properties', desc:'Every listing is verified by our team. No fake ads, no outdated listings.' },
              { Icon: Users,       title:'Direct Owner Contact', desc:'Zero broker fees. Talk directly to the owner and negotiate your rent.' },
              { Icon: Shield,      title:'Safe & Secure',        desc:'Bank-level security. Your data and personal info is always protected.' },
              { Icon: Sparkles,    title:'Smart Recommendations', desc:'AI-powered suggestions based on your preferences, budget, and location.' },
            ].map(({ Icon, title, desc }) => (
              <div key={title} style={{ padding:'32px', border:'1px solid var(--color-bebe)', borderRadius:'16px', textAlign:'left', transition:'box-shadow 0.2s', backgroundColor:'var(--color-surface-container-lowest)' }}
                onMouseOver={e => e.currentTarget.style.boxShadow='0 8px 32px rgba(0,0,0,0.08)'}
                onMouseOut={e => e.currentTarget.style.boxShadow='none'}
              >
                <div style={{ width:'52px', height:'52px', backgroundColor:'rgba(186,0,54,0.08)', color:'var(--color-primary)', borderRadius:'14px', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'20px' }}>
                  <Icon size={26} />
                </div>
                <h3 style={{ fontFamily:'var(--font-headline)', fontSize:'18px', fontWeight:700, marginBottom:'10px' }}>{title}</h3>
                <p style={{ color:'var(--color-foggy)', fontSize:'14px', lineHeight:1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          HOW IT WORKS
          ═══════════════════════════════════════════════════ */}
      <section style={{ padding:'64px 24px' }}>
        <div style={{ maxWidth:'900px', margin:'0 auto', textAlign:'center' }}>
          <h2 style={{ fontFamily:'var(--font-headline)', fontSize:'32px', fontWeight:700, marginBottom:'12px' }}>How HomeNest works</h2>
          <p style={{ color:'var(--color-foggy)', fontSize:'16px', marginBottom:'52px' }}>Find your home in 3 simple steps</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:'32px' }}>
            {[
              { step:'01', Icon: Search,    title:'Search',         desc:'Enter your city, BHK, and budget. Our smart filters find exactly what you need.' },
              { step:'02', Icon: Building2, title:'Schedule a Visit', desc:'Pick a date and time that works for you. The owner confirms the visit.' },
              { step:'03', Icon: Home,      title:'Move In',         desc:'Submit your application and move into your new home. That simple!' },
            ].map(({ step, Icon, title, desc }, i) => (
              <div key={step} style={{ position:'relative' }}>
                <div style={{
                  width:'60px', height:'60px', borderRadius:'50%',
                  backgroundColor:'var(--color-primary)',
                  color:'#fff', fontFamily:'var(--font-headline)',
                  fontSize:'18px', fontWeight:700,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  margin:'0 auto 20px',
                }}>
                  {step}
                </div>
                <h3 style={{ fontFamily:'var(--font-headline)', fontSize:'20px', fontWeight:600, marginBottom:'10px' }}>{title}</h3>
                <p style={{ color:'var(--color-foggy)', fontSize:'14px', lineHeight:1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          TESTIMONIALS
          ═══════════════════════════════════════════════════ */}
      <section style={{ padding:'64px 24px', backgroundColor:'var(--color-white)' }}>
        <div style={{ maxWidth:'1100px', margin:'0 auto' }}>
          <h2 style={{ fontFamily:'var(--font-headline)', fontSize:'32px', fontWeight:700, marginBottom:'8px', textAlign:'center' }}>What our users say</h2>
          <p style={{ color:'var(--color-foggy)', fontSize:'16px', marginBottom:'48px', textAlign:'center' }}>Real stories from real HomeNest users</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(290px, 1fr))', gap:'24px' }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} style={{ padding:'28px', border:'1px solid var(--color-bebe)', borderRadius:'16px', backgroundColor:'var(--color-surface-container-lowest)' }}>
                <div style={{ display:'flex', gap:'4px', marginBottom:'16px' }}>
                  {Array(t.stars).fill(0).map((_, i) => (
                    <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
                <p style={{ fontSize:'15px', lineHeight:1.7, color:'var(--color-on-surface)', marginBottom:'20px', fontStyle:'italic' }}>"{t.text}"</p>
                <div>
                  <div style={{ fontWeight:600, fontSize:'15px', fontFamily:'var(--font-headline)' }}>{t.name}</div>
                  <div style={{ color:'var(--color-foggy)', fontSize:'13px' }}>{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          CTA SECTION
          ═══════════════════════════════════════════════════ */}
      <section style={{ padding:'80px 24px', backgroundColor:'var(--color-inverse-surface)', textAlign:'center' }}>
        <div style={{ maxWidth:'600px', margin:'0 auto' }}>
          <h2 style={{ fontFamily:'var(--font-headline)', fontSize:'clamp(24px,4vw,36px)', fontWeight:700, color:'var(--color-inverse-on-surface)', marginBottom:'12px' }}>
            Ready to find your perfect home?
          </h2>
          <p style={{ color:'rgba(241,241,241,0.7)', fontSize:'16px', marginBottom:'36px' }}>
            Join over 1 million tenants who found their dream home on HomeNest
          </p>
          <div style={{ display:'flex', gap:'16px', justifyContent:'center', flexWrap:'wrap' }}>
            <Link to="/search" className="btn-primary" style={{ fontSize:'16px', padding:'14px 32px' }}>
              Search Properties
            </Link>
            <Link to="/register" style={{
              padding:'13px 32px', border:'1px solid rgba(241,241,241,0.4)',
              color:'var(--color-inverse-on-surface)', borderRadius:'999px',
              textDecoration:'none', fontSize:'16px', fontWeight:500,
              fontFamily:'var(--font-body)', transition:'all 0.15s',
              display:'inline-flex', alignItems:'center', gap:'8px',
            }}
              onMouseOver={e => { e.currentTarget.style.backgroundColor='rgba(255,255,255,0.1)'; }}
              onMouseOut={e => { e.currentTarget.style.backgroundColor='transparent'; }}
            >
              List Your Property <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
