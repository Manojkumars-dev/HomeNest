import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Maximize, Home, Search, Loader2 } from 'lucide-react';
import api from '../../api/api';

const gradients = [
  'linear-gradient(135deg, #667eea, #764ba2)',
  'linear-gradient(135deg, #f093fb, #f5576c)',
  'linear-gradient(135deg, #4facfe, #00f2fe)',
  'linear-gradient(135deg, #43e97b, #38f9d7)',
  'linear-gradient(135deg, #fa709a, #fee140)',
  'linear-gradient(135deg, #a18cd1, #fbc2eb)',
];

const SavedProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedProperties();
  }, []);

  const fetchSavedProperties = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/tenant/saved');
      setProperties(response.data || []);
    } catch (error) {
      console.error('Failed to fetch saved properties', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (propertyId, e) => {
    e.preventDefault();
    try {
      await api.delete(`/api/tenant/saved/${propertyId}`);
      setProperties((prev) => prev.filter((p) => p.id !== propertyId));
    } catch (error) {
      console.error('Failed to unsave property', error);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <Loader2 className="animate-spin" size={32} color="var(--color-primary)" />
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <Heart size={48} color="var(--color-bebe)" style={{ margin: '0 auto 1rem' }} />
        <h2 style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-on-surface)', marginBottom: '0.5rem' }}>
          No saved homes yet
        </h2>
        <p style={{ color: 'var(--color-foggy)', marginBottom: '1.5rem' }}>
          Start exploring and save your favorite properties here.
        </p>
        <Link to="/search" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <Search size={18} />
          Browse Properties
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-on-surface)', marginBottom: '2rem' }}>
        Saved Properties
      </h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {properties.map((property, index) => {
          const bgGradient = gradients[index % gradients.length];
          return (
            <Link key={property.id} to={`/property/${property.id}`} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ overflow: 'hidden', position: 'relative' }}>
                <div style={{ height: '200px', background: bgGradient }} />
                <button
                  onClick={(e) => handleUnsave(property.id, e)}
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'var(--color-white)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  }}
                >
                  <Heart size={18} fill="var(--color-primary)" color="var(--color-primary)" />
                </button>
                <div style={{ padding: '1.25rem' }}>
                  <h3 style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-on-surface)', fontSize: '1.125rem', marginBottom: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {property.title}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-foggy)', marginBottom: '1rem', fontSize: '0.875rem' }}>
                    <MapPin size={16} />
                    <span>{property.locality}, {property.city}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--color-bebe)', paddingTop: '1rem' }}>
                    <div style={{ color: 'var(--color-primary)', fontWeight: '600', fontSize: '1.25rem' }}>
                      ₹{property.rent?.toLocaleString()} <span style={{ fontSize: '0.875rem', color: 'var(--color-foggy)', fontWeight: 'normal' }}>/mo</span>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', color: 'var(--color-foggy)', fontSize: '0.875rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Home size={16} /> {property.bhk} BHK</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Maximize size={16} /> {property.area} sqft</div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default SavedProperties;
