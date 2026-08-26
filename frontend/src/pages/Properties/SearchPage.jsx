import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, MapPin, Heart, SlidersHorizontal, X, BadgeCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { searchProperties } from '../../api/propertyApi';

// Gradient fallback for properties without images
const GRADIENTS = [
  'linear-gradient(135deg,#667eea,#764ba2)', 'linear-gradient(135deg,#f093fb,#f5576c)',
  'linear-gradient(135deg,#4facfe,#00f2fe)', 'linear-gradient(135deg,#43e97b,#38f9d7)',
  'linear-gradient(135deg,#fa709a,#fee140)', 'linear-gradient(135deg,#a18cd1,#fbc2eb)',
];

// ── PROPERTY CARD ─────────────────────────────────────────────
function PropertyCard({ property }) {
  const [saved, setSaved] = useState(false);
  const bg = property.images?.[0]
    ? `url(${property.images[0]}) center/cover`
    : GRADIENTS[property.id % GRADIENTS.length];
  return (
    <div className="card" style={{ cursor:'pointer' }}>
      {/* Image area */}
      <div style={{ height:'180px', background: bg, position:'relative', overflow:'hidden' }}>
        <button onClick={e => { e.preventDefault(); setSaved(!saved); }}
          style={{ position:'absolute', top:'10px', right:'10px', width:'34px', height:'34px', borderRadius:'50%', backgroundColor:'rgba(255,255,255,0.9)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'transform 0.15s' }}
          onMouseOver={e => e.currentTarget.style.transform='scale(1.1)'}
          onMouseOut={e => e.currentTarget.style.transform='scale(1)'}
        >
          <Heart size={15} fill={saved?'#ba0036':'none'} color={saved?'#ba0036':'#1a1c1c'} />
        </button>
        {property.verified && (
          <div style={{ position:'absolute', top:'10px', left:'10px', backgroundColor:'rgba(255,255,255,0.95)', borderRadius:'999px', padding:'3px 8px', fontSize:'11px', fontWeight:600, color:'#2e7d32', display:'flex', alignItems:'center', gap:'3px' }}>
            <BadgeCheck size={11} />Verified
          </div>
        )}
        <div style={{ position:'absolute', bottom:'10px', left:'10px', backgroundColor:'rgba(26,28,28,0.75)', borderRadius:'999px', padding:'3px 10px', color:'#fff', fontSize:'13px', fontWeight:700, backdropFilter:'blur(4px)' }}>
          ₹{property.rent?.toLocaleString('en-IN')}/mo
        </div>
      </div>
      {/* Info */}
      <div style={{ padding:'14px' }}>
        <h3 style={{ fontFamily:'var(--font-headline)', fontSize:'15px', fontWeight:700, marginBottom:'4px', color:'var(--color-on-surface)' }}>
          {property.title}
        </h3>
        <p style={{ color:'var(--color-foggy)', fontSize:'12px', display:'flex', alignItems:'center', gap:'3px', marginBottom:'10px' }}>
          <MapPin size={12}/>{property.locality}, {property.city}
        </p>
        <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', marginBottom:'12px' }}>
          <span className="chip">{property.bhk} BHK</span>
          <span className="chip">{property.area} sq.ft</span>
          <span className="chip">{property.furnished}</span>
        </div>
        <Link to={`/property/${property.id}`} className="btn-primary"
          style={{ display:'block', textAlign:'center', padding:'10px', fontSize:'14px' }}>
          View Details
        </Link>
      </div>
    </div>
  );
}

// ── FILTER SECTION ────────────────────────────────────────────
function FilterSection({ title, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ borderBottom:'1px solid var(--color-bebe)', paddingBottom:'20px', marginBottom:'20px' }}>
      <button onClick={() => setOpen(!open)}
        style={{ display:'flex', justifyContent:'space-between', alignItems:'center', width:'100%', background:'none', border:'none', cursor:'pointer', padding:0, marginBottom: open?'14px':0 }}>
        <span style={{ fontFamily:'var(--font-body)', fontWeight:600, fontSize:'14px', color:'var(--color-on-surface)' }}>{title}</span>
        {open ? <ChevronUp size={16} color="var(--color-foggy)"/> : <ChevronDown size={16} color="var(--color-foggy)"/>}
      </button>
      {open && children}
    </div>
  );
}

// ── MAIN SEARCH PAGE ──────────────────────────────────────────
export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    type:     searchParams.get('type')     || '',
    bhk:      searchParams.get('bhk')      || '',
    minRent:  '',
    maxRent:  '',
    furnished:'',
    amenities: [],
  });
  const [results,      setResults]      = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [sortBy,       setSortBy]       = useState('relevance');
  const [showFilters,  setShowFilters]  = useState(false);
  const [searchInput,  setSearchInput]  = useState(filters.location);

  // Fetch from real API whenever filters change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await searchProperties({
          city:      filters.location || undefined,
          bhk:       filters.bhk      || undefined,
          minRent:   filters.minRent  || undefined,
          maxRent:   filters.maxRent  || undefined,
          type:      filters.type     || undefined,
          furnished: filters.furnished|| undefined,
        });
        let sorted = [...data];
        // Client-side sort (API returns by date)
        if (sortBy === 'price_low')  sorted.sort((a,b) => a.rent - b.rent);
        if (sortBy === 'price_high') sorted.sort((a,b) => b.rent - a.rent);
        if (sortBy === 'area')       sorted.sort((a,b) => b.area - a.area);
        setResults(sorted);
      } catch (err) {
        console.error('Search failed:', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters, sortBy]);

  const setFilter = (key, value) => setFilters(prev => ({...prev, [key]: value}));
  const toggleAmenity = (amenity) => setFilters(prev => ({
    ...prev,
    amenities: prev.amenities.includes(amenity) ? prev.amenities.filter(a=>a!==amenity) : [...prev.amenities, amenity]
  }));
  const clearAll = () => setFilters({ location:'', type:'', bhk:'', minRent:'', maxRent:'', furnished:'', amenities:[] });

  const activeFilterCount = [filters.type, filters.bhk, filters.minRent, filters.maxRent, filters.furnished].filter(Boolean).length + filters.amenities.length;

  // ── FILTER PANEL ───────────────────────────────────────────
  const FilterPanel = () => (
    <aside style={{ width:'268px', flexShrink:0, backgroundColor:'var(--color-white)', border:'1px solid var(--color-bebe)', borderRadius:'16px', padding:'24px', height:'fit-content', position:'sticky', top:'84px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' }}>
        <span style={{ fontFamily:'var(--font-headline)', fontWeight:700, fontSize:'16px' }}>Filters</span>
        {activeFilterCount > 0 && (
          <button onClick={clearAll} style={{ background:'none', border:'none', color:'var(--color-primary)', fontSize:'13px', fontWeight:600, cursor:'pointer' }}>
            Clear all ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Property Type */}
      <FilterSection title="Property Type">
        {['Apartment','House','Villa','Studio','PG'].map(t => (
          <label key={t} style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'8px', cursor:'pointer' }}>
            <input type="radio" name="type" value={t} checked={filters.type===t} onChange={e => setFilter('type', e.target.value)} style={{ accentColor:'var(--color-primary)' }} />
            <span style={{ fontSize:'14px', color:'var(--color-on-surface)' }}>{t}</span>
          </label>
        ))}
        {filters.type && <button onClick={() => setFilter('type','')} style={{ background:'none', border:'none', color:'var(--color-foggy)', fontSize:'12px', cursor:'pointer', padding:0, marginTop:'4px' }}>Clear</button>}
      </FilterSection>

      {/* BHK */}
      <FilterSection title="BHK">
        <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
          {['1','2','3','4'].map(b => (
            <button key={b} onClick={() => setFilter('bhk', filters.bhk===b ? '' : b)}
              style={{ padding:'6px 14px', borderRadius:'999px', border:`1px solid ${filters.bhk===b ? 'var(--color-primary)':'var(--color-bebe)'}`, backgroundColor: filters.bhk===b ? 'rgba(186,0,54,0.08)':'transparent', color: filters.bhk===b?'var(--color-primary)':'var(--color-on-surface)', fontFamily:'var(--font-body)', fontSize:'13px', fontWeight:600, cursor:'pointer', transition:'all 0.15s' }}>
              {b}{b==='4'?'+':''} BHK
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Rent Range */}
      <FilterSection title="Monthly Rent (₹)">
        <div style={{ display:'flex', gap:'8px' }}>
          <input className="input" type="number" placeholder="Min" style={{ padding:'8px 12px', fontSize:'13px' }}
            value={filters.minRent} onChange={e => setFilter('minRent', e.target.value)} />
          <input className="input" type="number" placeholder="Max" style={{ padding:'8px 12px', fontSize:'13px' }}
            value={filters.maxRent} onChange={e => setFilter('maxRent', e.target.value)} />
        </div>
      </FilterSection>

      {/* Furnished */}
      <FilterSection title="Furnished Status">
        {['Fully','Semi','Unfurnished'].map(f => (
          <label key={f} style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'8px', cursor:'pointer' }}>
            <input type="radio" name="furnished" value={f} checked={filters.furnished===f} onChange={e => setFilter('furnished', e.target.value)} style={{ accentColor:'var(--color-primary)' }} />
            <span style={{ fontSize:'14px', color:'var(--color-on-surface)' }}>{f}{f!=='Unfurnished'?' Furnished':''}</span>
          </label>
        ))}
        {filters.furnished && <button onClick={() => setFilter('furnished','')} style={{ background:'none', border:'none', color:'var(--color-foggy)', fontSize:'12px', cursor:'pointer', padding:0 }}>Clear</button>}
      </FilterSection>

      {/* Amenities */}
      <FilterSection title="Amenities">
        {['Gym','Pool','Parking','Security','WiFi','Garden','Meals'].map(a => (
          <label key={a} style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'8px', cursor:'pointer' }}>
            <input type="checkbox" checked={filters.amenities.includes(a)} onChange={() => toggleAmenity(a)} style={{ accentColor:'var(--color-primary)', width:'15px', height:'15px' }} />
            <span style={{ fontSize:'14px', color:'var(--color-on-surface)' }}>{a}</span>
          </label>
        ))}
      </FilterSection>
    </aside>
  );

  // ── RENDER ─────────────────────────────────────────────────
  return (
    <div style={{ backgroundColor:'var(--color-background)', minHeight:'100vh' }}>

      {/* Search bar row */}
      <div style={{ backgroundColor:'var(--color-white)', borderBottom:'1px solid var(--color-bebe)', padding:'16px 24px', position:'sticky', top:'65px', zIndex:50 }}>
        <div style={{ maxWidth:'1200px', margin:'0 auto', display:'flex', gap:'12px', alignItems:'center' }}>
          {/* Search input */}
          <div style={{ flex:1, position:'relative', maxWidth:'480px' }}>
            <Search size={16} style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', color:'var(--color-foggy)' }} />
            <input className="input" type="text" placeholder="City, locality or landmark..." style={{ paddingLeft:'40px', paddingRight:'12px', borderRadius:'999px' }}
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={e => e.key==='Enter' && setFilter('location', searchInput)}
            />
          </div>
          <button onClick={() => setFilter('location', searchInput)} className="btn-primary" style={{ padding:'11px 22px', whiteSpace:'nowrap' }}>
            Search
          </button>

          {/* Mobile filter toggle */}
          <button onClick={() => setShowFilters(!showFilters)} className="btn-ghost" style={{ display:'flex', alignItems:'center', gap:'6px', padding:'10px 16px', position:'relative' }}>
            <SlidersHorizontal size={16} /> Filters
            {activeFilterCount > 0 && (
              <span style={{ position:'absolute', top:'-6px', right:'-6px', backgroundColor:'var(--color-primary)', color:'#fff', width:'18px', height:'18px', borderRadius:'50%', fontSize:'11px', fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }}>
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort */}
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            style={{ border:'1px solid var(--color-bebe)', borderRadius:'999px', padding:'10px 16px', fontFamily:'var(--font-body)', fontSize:'14px', backgroundColor:'var(--color-white)', color:'var(--color-on-surface)', cursor:'pointer', outline:'none' }}>
            <option value="relevance">Sort: Relevance</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="area">Area: Largest First</option>
          </select>
        </div>
      </div>

      {/* Main layout */}
      <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'28px 24px', display:'flex', gap:'28px', alignItems:'flex-start' }}>

        {/* Filter panel — desktop always visible */}
        <div style={{ display: window.innerWidth > 1024 || showFilters ? 'block' : 'none' }}>
          <FilterPanel />
        </div>

        {/* Results */}
        <div style={{ flex:1, minWidth:0 }}>
          {/* Results header */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' }}>
            <div>
              <h1 style={{ fontFamily:'var(--font-headline)', fontSize:'20px', fontWeight:700, marginBottom:'2px' }}>
                {results.length} {results.length === 1 ? 'Home' : 'Homes'} Found
              </h1>
              {filters.location && (
                <p style={{ color:'var(--color-foggy)', fontSize:'14px', display:'flex', alignItems:'center', gap:'4px' }}>
                  <MapPin size={13}/> {filters.location}
                  <button onClick={() => { setFilter('location',''); setSearchInput(''); }} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--color-foggy)', padding:'0 4px' }}>
                    <X size={12}/>
                  </button>
                </p>
              )}
            </div>
            {/* Active filter chips */}
            {activeFilterCount > 0 && (
              <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', justifyContent:'flex-end' }}>
                {filters.bhk && <span className="chip chip-active">{filters.bhk} BHK <X size={10} style={{ cursor:'pointer' }} onClick={() => setFilter('bhk','')} /></span>}
                {filters.type && <span className="chip chip-active">{filters.type} <X size={10} style={{ cursor:'pointer' }} onClick={() => setFilter('type','')} /></span>}
                {filters.furnished && <span className="chip chip-active">{filters.furnished} <X size={10} style={{ cursor:'pointer' }} onClick={() => setFilter('furnished','')} /></span>}
              </div>
            )}
          </div>

          {/* Grid */}
          {loading ? (
            <div style={{ textAlign:'center', padding:'80px 24px' }}>
              <div style={{ width:'36px', height:'36px', border:'3px solid var(--color-bebe)', borderTopColor:'var(--color-primary)', borderRadius:'50%', margin:'0 auto 16px', animation:'spin 0.8s linear infinite' }}></div>
              <p style={{ color:'var(--color-foggy)', fontSize:'14px' }}>Searching properties...</p>
            </div>
          ) : results.length > 0 ? (
            <div style={{ display:'grid', gap:'20px', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))' }}>
              {results.map(p => <PropertyCard key={p.id} property={p} />)}
            </div>
          ) : (
            <div style={{ textAlign:'center', padding:'80px 24px', backgroundColor:'var(--color-white)', borderRadius:'16px', border:'1px solid var(--color-bebe)' }}>
              <div style={{ fontSize:'48px', marginBottom:'16px' }}>🏠</div>
              <h3 style={{ fontFamily:'var(--font-headline)', fontSize:'20px', fontWeight:700, marginBottom:'8px' }}>No homes found</h3>
              <p style={{ color:'var(--color-foggy)', marginBottom:'20px' }}>Try adjusting your filters or searching a different location</p>
              <button onClick={clearAll} className="btn-primary">Clear all filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
