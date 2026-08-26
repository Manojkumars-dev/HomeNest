import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProperty } from '../../api/propertyApi';
import {
  Home, Building2, Trees, Users, Square,
  MapPin, BedDouble, Layers, Maximize2,
  IndianRupee, Calendar, Sofa, Wifi,
  Car, Shield, Dumbbell, Waves, Leaf,
  Camera, Check, ChevronLeft, ChevronRight,
  AlertCircle, CheckCircle
} from 'lucide-react';

// ── STEP DEFINITIONS ──────────────────────────────────────────
const STEPS = [
  { number:1, title:'Property Type',   desc:'What type of property is it?' },
  { number:2, title:'Location',        desc:'Where is it located?' },
  { number:3, title:'Basic Details',   desc:'Size, floor, and configuration' },
  { number:4, title:'Rent & Deposit',  desc:'Pricing and availability' },
  { number:5, title:'Furnishing',      desc:'What is included?' },
  { number:6, title:'Amenities',       desc:'Facilities available' },
  { number:7, title:'House Rules',     desc:'Your preferences for tenants' },
  { number:8, title:'Photos',          desc:'Add photos to attract tenants' },
  { number:9, title:'Review & Submit', desc:'Preview your listing' },
];

const PROPERTY_TYPES = [
  { id:'Apartment', icon:Building2, label:'Apartment', desc:'Flat in a multi-storey building' },
  { id:'House',     icon:Home,      label:'House',     desc:'Independent / row house' },
  { id:'Villa',     icon:Trees,     label:'Villa',     desc:'Luxury independent home' },
  { id:'PG',        icon:Users,     label:'PG/Hostel', desc:'Paying guest accommodation' },
  { id:'Studio',    icon:Square,    label:'Studio',    desc:'Open plan single room' },
];

const AMENITY_LIST = [
  { id:'Gym',           icon:Dumbbell,  label:'Gym' },
  { id:'Pool',          icon:Waves,     label:'Swimming Pool' },
  { id:'Parking',       icon:Car,       label:'Parking' },
  { id:'Security',      icon:Shield,    label:'24H Security' },
  { id:'WiFi',          icon:Wifi,      label:'WiFi Ready' },
  { id:'Garden',        icon:Leaf,      label:'Garden' },
  { id:'Power Backup',  icon:Building2, label:'Power Backup' },
  { id:'Lift',          icon:Building2, label:'Lift' },
  { id:'CCTV',          icon:Building2, label:'CCTV' },
  { id:'Club House',    icon:Building2, label:'Club House' },
];

const FURNISHING_ITEMS = ['Bed','Wardrobe','Sofa','Dining Table','TV','Fridge','Washing Machine','AC','Microwave','Geyser'];

// ── STEP PROGRESS BAR ─────────────────────────────────────────
function StepProgress({ current, total }) {
  return (
    <div style={{ marginBottom:'32px' }}>
      {/* Step dots */}
      <div style={{ display:'flex', gap:'6px', marginBottom:'12px' }}>
        {STEPS.map(s => (
          <div key={s.number} style={{
            flex:1, height:'4px', borderRadius:'2px',
            backgroundColor: s.number <= current ? 'var(--color-primary)' : 'var(--color-bebe)',
            transition:'background-color 0.3s',
          }} />
        ))}
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <p style={{ fontSize:'12px', color:'var(--color-foggy)', marginBottom:'2px' }}>Step {current} of {total}</p>
          <h2 style={{ fontFamily:'var(--font-headline)', fontSize:'22px', fontWeight:700 }}>{STEPS[current-1].title}</h2>
          <p style={{ color:'var(--color-foggy)', fontSize:'14px' }}>{STEPS[current-1].desc}</p>
        </div>
        <div style={{ width:'52px', height:'52px', borderRadius:'50%', backgroundColor:'rgba(186,0,54,0.08)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-headline)', fontSize:'18px', fontWeight:700, color:'var(--color-primary)' }}>
          {current}/{total}
        </div>
      </div>
    </div>
  );
}

// ── FORM FIELD HELPERS ────────────────────────────────────────
function Field({ label, children, error }) {
  return (
    <div style={{ marginBottom:'16px' }}>
      <label className="input-label">{label}</label>
      {children}
      {error && <p style={{ color:'var(--color-error)', fontSize:'12px', marginTop:'4px', display:'flex', alignItems:'center', gap:'4px' }}><AlertCircle size={12}/>{error}</p>}
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────
export default function AddProperty() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // The complete form data — all 9 steps combined
  const [data, setData] = useState({
    // Step 1
    type: '',
    // Step 2
    city:'', locality:'', address:'', pincode:'', landmark:'',
    // Step 3
    bhk:'2', area:'', floor:'', totalFloors:'', facing:'',
    // Step 4
    rent:'', deposit:'', availableFrom:'', rentNegotiable:false,
    // Step 5
    furnished:'Semi', furnishingItems:[],
    // Step 6
    amenities:[],
    // Step 7
    petsAllowed:false, smokingAllowed:false, bachelorAllowed:true, preferredTenant:'Any',
    // Step 8
    photos:[], description:'',
  });

  const set = (field, value) => {
    setData(prev => ({...prev, [field]: value}));
    if (errors[field]) setErrors(prev => ({...prev, [field]:''}));
  };

  const toggle = (field, value) => {
    setData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value]
    }));
  };

  // Validate current step before going next
  const validate = () => {
    const e = {};
    if (step === 1 && !data.type)           e.type      = 'Please select a property type';
    if (step === 2) {
      if (!data.city)     e.city     = 'City is required';
      if (!data.locality) e.locality = 'Locality is required';
      if (!data.address)  e.address  = 'Full address is required';
      if (!/^\d{6}$/.test(data.pincode)) e.pincode = 'Enter a valid 6-digit pincode';
    }
    if (step === 3) {
      if (!data.area || isNaN(data.area))   e.area  = 'Enter valid area in sq.ft';
      if (!data.floor)                      e.floor = 'Floor is required';
    }
    if (step === 4) {
      if (!data.rent || isNaN(data.rent))       e.rent    = 'Enter valid monthly rent';
      if (!data.deposit || isNaN(data.deposit)) e.deposit = 'Enter valid deposit amount';
      if (!data.availableFrom)                  e.availableFrom = 'Select availability date';
    }
    if (step === 8 && !data.description) e.description = 'Write a short description';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => { if (validate()) setStep(s => Math.min(s+1, 9)); };
  const prevStep = () => setStep(s => Math.max(s-1, 1));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await createProperty({
        type: data.type,
        city: data.city,
        locality: data.locality,
        address: data.address,
        pincode: data.pincode,
        landmark: data.landmark,
        bhk: parseInt(data.bhk) || 2,
        area: parseInt(data.area) || 0,
        floor: data.floor,
        totalFloors: data.totalFloors,
        facing: data.facing,
        rent: parseInt(data.rent) || 0,
        deposit: parseInt(data.deposit) || 0,
        availableFrom: data.availableFrom,
        rentNegotiable: data.rentNegotiable,
        furnished: data.furnished,
        furnishingItems: data.furnishingItems,
        amenities: data.amenities,
        preferredTenant: data.preferredTenant,
        petsAllowed: data.petsAllowed,
        smokingAllowed: data.smokingAllowed,
        bachelorAllowed: data.bachelorAllowed,
        description: data.description,
        images: data.photos, // photos from upload step
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Failed to create property:', err);
      alert(err.response?.data?.error || 'Failed to list property. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── SUCCESS SCREEN ────────────────────────────────────────
  if (submitted) {
    return (
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'60vh', textAlign:'center', padding:'40px' }}>
        <div style={{ width:'80px', height:'80px', backgroundColor:'rgba(34,197,94,0.1)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'24px' }}>
          <CheckCircle size={40} color="#22c55e"/>
        </div>
        <h2 style={{ fontFamily:'var(--font-headline)', fontSize:'28px', fontWeight:700, marginBottom:'8px' }}>Property Listed!</h2>
        <p style={{ color:'var(--color-foggy)', fontSize:'16px', marginBottom:'8px' }}>Your property has been submitted for verification.</p>
        <p style={{ color:'var(--color-foggy)', fontSize:'14px', marginBottom:'32px' }}>Our team will verify and publish it within 24 hours.</p>
        <div style={{ display:'flex', gap:'12px' }}>
          <button onClick={() => { setSubmitted(false); setStep(1); setData({ type:'', city:'', locality:'', address:'', pincode:'', landmark:'', bhk:'2', area:'', floor:'', totalFloors:'', facing:'', rent:'', deposit:'', availableFrom:'', rentNegotiable:false, furnished:'Semi', furnishingItems:[], amenities:[], petsAllowed:false, smokingAllowed:false, bachelorAllowed:true, preferredTenant:'Any', photos:[], description:'' }); }}
            className="btn-secondary">Add Another Property</button>
          <button onClick={() => navigate('/owner/properties')} className="btn-primary">View My Properties</button>
        </div>
      </div>
    );
  }

  // ── STEP CONTENT ──────────────────────────────────────────
  const renderStep = () => {
    switch(step) {

      // ── STEP 1: Property Type ─────────────────────────────
      case 1: return (
        <div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(140px,1fr))', gap:'14px' }}>
            {PROPERTY_TYPES.map(({ id, icon:Icon, label, desc }) => (
              <button key={id} onClick={() => set('type', id)}
                style={{ padding:'24px 16px', border:`2px solid ${data.type===id?'var(--color-primary)':'var(--color-bebe)'}`, borderRadius:'16px', backgroundColor: data.type===id?'rgba(186,0,54,0.04)':'var(--color-white)', cursor:'pointer', textAlign:'center', transition:'all 0.2s', position:'relative' }}>
                {data.type===id && <Check size={14} color="var(--color-primary)" style={{ position:'absolute', top:'10px', right:'10px' }}/>}
                <div style={{ width:'48px', height:'48px', borderRadius:'12px', backgroundColor: data.type===id?'rgba(186,0,54,0.1)':'var(--color-surface-container)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px' }}>
                  <Icon size={24} color={data.type===id?'var(--color-primary)':'var(--color-foggy)'}/>
                </div>
                <p style={{ fontWeight:700, fontSize:'14px', marginBottom:'4px', color: data.type===id?'var(--color-primary)':'var(--color-on-surface)' }}>{label}</p>
                <p style={{ fontSize:'11px', color:'var(--color-foggy)', lineHeight:1.4 }}>{desc}</p>
              </button>
            ))}
          </div>
          {errors.type && <p style={{ color:'var(--color-error)', fontSize:'13px', marginTop:'12px', display:'flex', alignItems:'center', gap:'4px' }}><AlertCircle size={14}/>{errors.type}</p>}
        </div>
      );

      // ── STEP 2: Location ──────────────────────────────────
      case 2: return (
        <div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
            <Field label="City *" error={errors.city}>
              <select className="input" value={data.city} onChange={e => set('city', e.target.value)} style={{ cursor:'pointer', borderColor: errors.city?'var(--color-error)':undefined }}>
                <option value="">Select city</option>
                {['Mumbai','Delhi','Bangalore','Hyderabad','Chennai','Pune','Kolkata','Ahmedabad'].map(c => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Locality / Area *" error={errors.locality}>
              <input className="input" placeholder="e.g. Bandra West" value={data.locality} onChange={e => set('locality', e.target.value)} style={{ borderColor: errors.locality?'var(--color-error)':undefined }}/>
            </Field>
          </div>
          <Field label="Full Address *" error={errors.address}>
            <input className="input" placeholder="House/Flat no., Building name, Street" value={data.address} onChange={e => set('address', e.target.value)} style={{ borderColor: errors.address?'var(--color-error)':undefined }}/>
          </Field>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
            <Field label="Pincode *" error={errors.pincode}>
              <input className="input" placeholder="400050" maxLength={6} value={data.pincode} onChange={e => set('pincode', e.target.value.replace(/\D/,''))} style={{ borderColor: errors.pincode?'var(--color-error)':undefined }}/>
            </Field>
            <Field label="Nearby Landmark">
              <input className="input" placeholder="e.g. Near Liking Road" value={data.landmark} onChange={e => set('landmark', e.target.value)}/>
            </Field>
          </div>
        </div>
      );

      // ── STEP 3: Basic Details ─────────────────────────────
      case 3: return (
        <div>
          <Field label="Number of Bedrooms (BHK)">
            <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
              {['1','2','3','4','5+'].map(b => (
                <button key={b} onClick={() => set('bhk', b)}
                  style={{ padding:'10px 20px', borderRadius:'999px', border:`1.5px solid ${data.bhk===b?'var(--color-primary)':'var(--color-bebe)'}`, backgroundColor:data.bhk===b?'rgba(186,0,54,0.08)':'transparent', color:data.bhk===b?'var(--color-primary)':'var(--color-on-surface)', fontFamily:'var(--font-body)', fontWeight:600, fontSize:'14px', cursor:'pointer', transition:'all 0.15s' }}>
                  {b} BHK
                </button>
              ))}
            </div>
          </Field>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
            <Field label="Built-up Area (sq.ft) *" error={errors.area}>
              <input className="input" type="number" placeholder="e.g. 950" value={data.area} onChange={e => set('area', e.target.value)} style={{ borderColor: errors.area?'var(--color-error)':undefined }}/>
            </Field>
            <Field label="Property on Which Floor? *" error={errors.floor}>
              <input className="input" placeholder="e.g. 4" value={data.floor} onChange={e => set('floor', e.target.value)} style={{ borderColor: errors.floor?'var(--color-error)':undefined }}/>
            </Field>
            <Field label="Total Floors in Building">
              <input className="input" placeholder="e.g. 12" value={data.totalFloors} onChange={e => set('totalFloors', e.target.value)}/>
            </Field>
            <Field label="Facing Direction">
              <select className="input" value={data.facing} onChange={e => set('facing', e.target.value)} style={{ cursor:'pointer' }}>
                <option value="">Select facing</option>
                {['East','West','North','South','North-East','North-West','South-East','South-West'].map(f => <option key={f}>{f}</option>)}
              </select>
            </Field>
          </div>
        </div>
      );

      // ── STEP 4: Rent & Deposit ────────────────────────────
      case 4: return (
        <div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
            <Field label="Monthly Rent (₹) *" error={errors.rent}>
              <div style={{ position:'relative' }}>
                <span style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', color:'var(--color-foggy)', fontSize:'16px' }}>₹</span>
                <input className="input" type="number" placeholder="45000" style={{ paddingLeft:'28px', borderColor:errors.rent?'var(--color-error)':undefined }} value={data.rent} onChange={e => set('rent', e.target.value)}/>
              </div>
            </Field>
            <Field label="Security Deposit (₹) *" error={errors.deposit}>
              <div style={{ position:'relative' }}>
                <span style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', color:'var(--color-foggy)', fontSize:'16px' }}>₹</span>
                <input className="input" type="number" placeholder="90000" style={{ paddingLeft:'28px', borderColor:errors.deposit?'var(--color-error)':undefined }} value={data.deposit} onChange={e => set('deposit', e.target.value)}/>
              </div>
            </Field>
          </div>
          <Field label="Available From *" error={errors.availableFrom}>
            <input className="input" type="date" min={new Date().toISOString().split('T')[0]} value={data.availableFrom} onChange={e => set('availableFrom', e.target.value)} style={{ borderColor:errors.availableFrom?'var(--color-error)':undefined }}/>
          </Field>
          <label style={{ display:'flex', alignItems:'center', gap:'10px', cursor:'pointer', marginTop:'8px' }}>
            <input type="checkbox" checked={data.rentNegotiable} onChange={e => set('rentNegotiable', e.target.checked)} style={{ accentColor:'var(--color-primary)', width:'16px', height:'16px' }}/>
            <span style={{ fontSize:'14px', color:'var(--color-on-surface)' }}>Rent is negotiable</span>
          </label>
          {/* Auto-calculated suggestion */}
          {data.rent && (
            <div style={{ marginTop:'16px', padding:'14px', backgroundColor:'rgba(59,130,246,0.06)', borderRadius:'12px', border:'1px solid rgba(59,130,246,0.15)' }}>
              <p style={{ fontSize:'13px', color:'#1565c0' }}>💡 <strong>Suggested deposit:</strong> ₹{(Number(data.rent)*2).toLocaleString('en-IN')} (2 months rent — industry standard)</p>
            </div>
          )}
        </div>
      );

      // ── STEP 5: Furnishing ────────────────────────────────
      case 5: return (
        <div>
          <Field label="Furnishing Status">
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'12px', marginBottom:'20px' }}>
              {[
                { id:'Fully',        label:'Fully Furnished',   desc:'All furniture & appliances included' },
                { id:'Semi',         label:'Semi Furnished',    desc:'Some furniture provided' },
                { id:'Unfurnished',  label:'Unfurnished',       desc:'Empty, just walls & fixtures' },
              ].map(({ id, label, desc }) => (
                <button key={id} onClick={() => set('furnished', id)}
                  style={{ padding:'20px 16px', border:`2px solid ${data.furnished===id?'var(--color-primary)':'var(--color-bebe)'}`, borderRadius:'14px', backgroundColor: data.furnished===id?'rgba(186,0,54,0.04)':'var(--color-white)', cursor:'pointer', textAlign:'left', transition:'all 0.15s' }}>
                  <p style={{ fontWeight:700, fontSize:'14px', marginBottom:'4px', color:data.furnished===id?'var(--color-primary)':'var(--color-on-surface)' }}>{label}</p>
                  <p style={{ fontSize:'12px', color:'var(--color-foggy)', lineHeight:1.4 }}>{desc}</p>
                </button>
              ))}
            </div>
          </Field>
          {data.furnished !== 'Unfurnished' && (
            <Field label={`What's included? (select all that apply)`}>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'8px' }}>
                {FURNISHING_ITEMS.map(item => (
                  <button key={item} onClick={() => toggle('furnishingItems', item)}
                    style={{ padding:'7px 14px', borderRadius:'999px', border:`1.5px solid ${data.furnishingItems.includes(item)?'var(--color-primary)':'var(--color-bebe)'}`, backgroundColor: data.furnishingItems.includes(item)?'rgba(186,0,54,0.08)':'transparent', color:data.furnishingItems.includes(item)?'var(--color-primary)':'var(--color-on-surface)', fontFamily:'var(--font-body)', fontSize:'13px', fontWeight:500, cursor:'pointer', transition:'all 0.15s', display:'flex', alignItems:'center', gap:'5px' }}>
                    {data.furnishingItems.includes(item) && <Check size={12}/>}{item}
                  </button>
                ))}
              </div>
            </Field>
          )}
        </div>
      );

      // ── STEP 6: Amenities ─────────────────────────────────
      case 6: return (
        <div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(140px,1fr))', gap:'12px' }}>
            {AMENITY_LIST.map(({ id, icon:Icon, label }) => (
              <button key={id} onClick={() => toggle('amenities', id)}
                style={{ padding:'16px 12px', border:`2px solid ${data.amenities.includes(id)?'var(--color-primary)':'var(--color-bebe)'}`, borderRadius:'14px', backgroundColor: data.amenities.includes(id)?'rgba(186,0,54,0.04)':'var(--color-white)', cursor:'pointer', textAlign:'center', transition:'all 0.15s', position:'relative' }}>
                {data.amenities.includes(id) && <Check size={13} color="var(--color-primary)" style={{ position:'absolute', top:'8px', right:'8px' }}/>}
                <Icon size={22} color={data.amenities.includes(id)?'var(--color-primary)':'var(--color-foggy)'} style={{ marginBottom:'8px' }}/>
                <p style={{ fontSize:'13px', fontWeight:600, color:data.amenities.includes(id)?'var(--color-primary)':'var(--color-on-surface)' }}>{label}</p>
              </button>
            ))}
          </div>
        </div>
      );

      // ── STEP 7: House Rules ───────────────────────────────
      case 7: return (
        <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
          {/* Preferred tenant */}
          <Field label="Preferred Tenant">
            <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
              {['Any','Family','Single','Working Professional','Students'].map(t => (
                <button key={t} onClick={() => set('preferredTenant', t)}
                  style={{ padding:'8px 18px', borderRadius:'999px', border:`1.5px solid ${data.preferredTenant===t?'var(--color-primary)':'var(--color-bebe)'}`, backgroundColor:data.preferredTenant===t?'rgba(186,0,54,0.08)':'transparent', color:data.preferredTenant===t?'var(--color-primary)':'var(--color-on-surface)', fontFamily:'var(--font-body)', fontWeight:600, fontSize:'13px', cursor:'pointer', transition:'all 0.15s' }}>
                  {t}
                </button>
              ))}
            </div>
          </Field>
          {/* Toggle rules */}
          {[
            { key:'bachelorAllowed', label:'Bachelors / Singles welcome', desc:'Allow single tenants to apply' },
            { key:'petsAllowed',     label:'Pets allowed',                desc:'Tenants can keep pets' },
            { key:'smokingAllowed',  label:'Smoking allowed',             desc:'Smoking permitted on premises' },
          ].map(({ key, label, desc }) => (
            <div key={key} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px', backgroundColor:'var(--color-surface-container-low)', borderRadius:'14px' }}>
              <div>
                <p style={{ fontWeight:600, fontSize:'14px', color:'var(--color-on-surface)', marginBottom:'2px' }}>{label}</p>
                <p style={{ fontSize:'12px', color:'var(--color-foggy)' }}>{desc}</p>
              </div>
              {/* Toggle switch */}
              <button onClick={() => set(key, !data[key])}
                style={{ width:'48px', height:'26px', borderRadius:'13px', backgroundColor:data[key]?'var(--color-primary)':'var(--color-bebe)', border:'none', cursor:'pointer', position:'relative', transition:'background-color 0.2s', flexShrink:0 }}>
                <div style={{ position:'absolute', top:'3px', left:data[key]?'22px':'3px', width:'20px', height:'20px', borderRadius:'50%', backgroundColor:'#fff', transition:'left 0.2s', boxShadow:'0 1px 4px rgba(0,0,0,0.2)' }}/>
              </button>
            </div>
          ))}
        </div>
      );

      // ── STEP 8: Photos & Description ─────────────────────
      case 8: return (
        <div>
          {/* Photo upload area */}
          <div style={{ border:'2px dashed var(--color-bebe)', borderRadius:'16px', padding:'40px', textAlign:'center', marginBottom:'20px', cursor:'pointer', transition:'all 0.2s', backgroundColor:'var(--color-surface-container-lowest)' }}
            onMouseOver={e => { e.currentTarget.style.borderColor='var(--color-primary)'; e.currentTarget.style.backgroundColor='rgba(186,0,54,0.02)'; }}
            onMouseOut={e => { e.currentTarget.style.borderColor='var(--color-bebe)'; e.currentTarget.style.backgroundColor='var(--color-surface-container-lowest)'; }}>
            <Camera size={36} color="var(--color-foggy)" style={{ marginBottom:'12px' }}/>
            <p style={{ fontWeight:600, fontSize:'15px', marginBottom:'4px' }}>Upload Property Photos</p>
            <p style={{ color:'var(--color-foggy)', fontSize:'13px', marginBottom:'16px' }}>Drag & drop or click to browse · JPG, PNG, WEBP · Max 5MB each · Up to 10 photos</p>
            <input type="file" accept="image/*" multiple style={{ display:'none' }} id="photo-upload"/>
            <label htmlFor="photo-upload" className="btn-secondary" style={{ cursor:'pointer', padding:'10px 24px', display:'inline-flex', alignItems:'center', gap:'8px' }}>
              <Camera size={16}/> Choose Photos
            </label>
          </div>
          {/* Description */}
          <Field label="Property Description *" error={errors.description}>
            <textarea className="input" rows={5} placeholder="Describe your property — what makes it special? Mention nearby landmarks, recent renovations, and anything a tenant should know..."
              style={{ resize:'vertical', borderColor:errors.description?'var(--color-error)':undefined }}
              value={data.description} onChange={e => set('description', e.target.value)}/>
            <p style={{ fontSize:'12px', color:'var(--color-foggy)', marginTop:'4px', textAlign:'right' }}>{data.description.length}/1000 characters</p>
          </Field>
        </div>
      );

      // ── STEP 9: Review & Submit ───────────────────────────
      case 9: return (
        <div>
          <div style={{ backgroundColor:'rgba(34,197,94,0.06)', border:'1px solid rgba(34,197,94,0.2)', borderRadius:'14px', padding:'16px', marginBottom:'24px', display:'flex', alignItems:'center', gap:'12px' }}>
            <CheckCircle size={20} color="#22c55e"/>
            <p style={{ fontSize:'14px', color:'#166534' }}>Almost there! Review your listing details before publishing.</p>
          </div>
          {/* Summary cards */}
          {[
            { title:'Property Type & Location', items:[
              ['Type',     data.type],
              ['City',     data.city],
              ['Locality', data.locality],
              ['Address',  data.address],
              ['Pincode',  data.pincode],
            ]},
            { title:'Details & Pricing', items:[
              ['BHK',       `${data.bhk} BHK`],
              ['Area',      data.area ? `${data.area} sq.ft` : '-'],
              ['Floor',     data.floor || '-'],
              ['Rent',      data.rent ? `₹${Number(data.rent).toLocaleString('en-IN')}/month` : '-'],
              ['Deposit',   data.deposit ? `₹${Number(data.deposit).toLocaleString('en-IN')}` : '-'],
              ['Available', data.availableFrom || '-'],
            ]},
            { title:'Furnishing & Amenities', items:[
              ['Furnished',  data.furnished],
              ['Items',      data.furnishingItems.join(', ') || 'None'],
              ['Amenities',  data.amenities.join(', ') || 'None'],
            ]},
            { title:'House Rules', items:[
              ['Preferred Tenant', data.preferredTenant],
              ['Bachelors',        data.bachelorAllowed ? 'Yes' : 'No'],
              ['Pets',             data.petsAllowed     ? 'Yes' : 'No'],
              ['Smoking',          data.smokingAllowed  ? 'Yes' : 'No'],
            ]},
          ].map(section => (
            <div key={section.title} style={{ backgroundColor:'var(--color-white)', border:'1px solid var(--color-bebe)', borderRadius:'14px', padding:'20px', marginBottom:'12px' }}>
              <h3 style={{ fontFamily:'var(--font-headline)', fontWeight:700, fontSize:'15px', marginBottom:'14px', color:'var(--color-on-surface)' }}>{section.title}</h3>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
                {section.items.map(([label, value]) => value && (
                  <div key={label}>
                    <p style={{ fontSize:'11px', color:'var(--color-foggy)', marginBottom:'2px' }}>{label}</p>
                    <p style={{ fontSize:'14px', fontWeight:500, color:'var(--color-on-surface)' }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {/* Terms */}
          <div style={{ padding:'16px', backgroundColor:'var(--color-surface-container-low)', borderRadius:'12px', marginBottom:'8px' }}>
            <p style={{ fontSize:'13px', color:'var(--color-foggy)', lineHeight:1.6 }}>
              By submitting, you confirm that all information is accurate and you agree to HomeNest's <span style={{ color:'var(--color-primary)', fontWeight:600 }}>Listing Guidelines</span> and <span style={{ color:'var(--color-primary)', fontWeight:600 }}>Terms of Service</span>.
            </p>
          </div>
        </div>
      );

      default: return null;
    }
  };

  // ── MAIN RENDER ───────────────────────────────────────────
  return (
    <div style={{ maxWidth:'720px' }}>
      <StepProgress current={step} total={9}/>

      {/* Step content */}
      <div style={{ backgroundColor:'var(--color-white)', border:'1px solid var(--color-bebe)', borderRadius:'20px', padding:'32px', marginBottom:'24px', minHeight:'300px' }}>
        {renderStep()}
      </div>

      {/* Navigation buttons */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <button onClick={prevStep} disabled={step === 1}
          style={{ display:'flex', alignItems:'center', gap:'6px', padding:'12px 20px', background:'none', border:'1px solid var(--color-bebe)', borderRadius:'999px', fontFamily:'var(--font-body)', fontWeight:500, fontSize:'14px', cursor:step===1?'not-allowed':'pointer', opacity:step===1?0.4:1, color:'var(--color-on-surface)', transition:'all 0.15s' }}>
          <ChevronLeft size={16}/> Previous
        </button>

        <span style={{ fontSize:'13px', color:'var(--color-foggy)' }}>
          {step < 9 ? `${9 - step} steps remaining` : 'Ready to publish!'}
        </span>

        {step < 9 ? (
          <button onClick={nextStep} className="btn-primary" style={{ display:'flex', alignItems:'center', gap:'6px', padding:'12px 24px' }}>
            Next <ChevronRight size={16}/>
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={isSubmitting} className="btn-primary"
            style={{ display:'flex', alignItems:'center', gap:'6px', padding:'13px 28px', opacity:isSubmitting?0.7:1, cursor:isSubmitting?'wait':'pointer' }}>
            {isSubmitting ? 'Publishing...' : <>Publish Listing <CheckCircle size={16}/></>}
          </button>
        )}
      </div>
    </div>
  );
}
