import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Eye, MessageSquare, Edit, Pause, Play, Trash2, Plus, Loader2, Home } from 'lucide-react';
import api from '../../api/api';

const statusConfig = {
  ACTIVE: { bg: 'rgba(34,197,94,0.1)', color: '#166534', label: 'Active' },
  PAUSED: { bg: 'rgba(245,158,11,0.1)', color: '#b45309', label: 'Paused' },
  RENTED: { bg: 'rgba(59,130,246,0.1)', color: '#1d4ed8', label: 'Rented' },
};

const gradients = [
  'linear-gradient(135deg, #a18cd1, #fbc2eb)',
  'linear-gradient(135deg, #84fab0, #8fd3f4)',
  'linear-gradient(135deg, #fccb90, #d57eeb)',
];

const MyProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/owner/properties');
      setProperties(response.data || []);
    } catch (error) {
      console.error('Failed to fetch properties', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (propertyId, currentStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    try {
      await api.put(`/api/owner/properties/${propertyId}/status`, { status: newStatus });
      setProperties((prev) =>
        prev.map((p) => (p.id === propertyId ? { ...p, status: newStatus } : p))
      );
    } catch (error) {
      console.error('Failed to toggle status', error);
    }
  };

  const handleDelete = async (propertyId) => {
    if (!window.confirm('Are you sure you want to delete this property? This cannot be undone.')) return;
    try {
      await api.delete(`/api/owner/properties/${propertyId}`);
      setProperties((prev) => prev.filter((p) => p.id !== propertyId));
    } catch (error) {
      console.error('Failed to delete property', error);
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
        <Home size={48} color="var(--color-bebe)" style={{ margin: '0 auto 1rem' }} />
        <h2 style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-on-surface)', marginBottom: '0.5rem' }}>
          No properties listed yet
        </h2>
        <p style={{ color: 'var(--color-foggy)', marginBottom: '1.5rem' }}>
          Add your first property to start receiving tenant applications.
        </p>
        <Link to="/owner/add-property" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <Plus size={18} />
          Add Property
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-on-surface)' }}>
          My Properties
        </h1>
        <Link to="/owner/add-property" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <Plus size={18} /> Add Property
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {properties.map((property, index) => {
          const bgGradient = gradients[index % gradients.length];
          const statusStyle = statusConfig[property.status] || statusConfig.ACTIVE;

          return (
            <div key={property.id} className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '160px', background: bgGradient, position: 'relative' }}>
                <span className="chip" style={{ position: 'absolute', top: '1rem', right: '1rem', backgroundColor: statusStyle.bg, color: statusStyle.color, fontWeight: '600' }}>
                  {statusStyle.label}
                </span>
              </div>
              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-on-surface)', fontSize: '1.125rem', marginBottom: '0.5rem' }}>
                  {property.title}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-foggy)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                  <MapPin size={14} />
                  <span>{property.city}</span>
                </div>
                <div style={{ color: 'var(--color-primary)', fontWeight: '600', fontSize: '1.125rem', marginBottom: '1rem' }}>
                  ₹{property.rent?.toLocaleString()} <span style={{ fontSize: '0.875rem', color: 'var(--color-foggy)', fontWeight: 'normal' }}>/mo</span>
                </div>

                <div style={{ display: 'flex', gap: '1rem', padding: '1rem 0', borderTop: '1px solid var(--color-bebe)', borderBottom: '1px solid var(--color-bebe)', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-foggy)', fontSize: '0.875rem' }}>
                    <Eye size={16} /> {property.views || 0} views
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-foggy)', fontSize: '0.875rem' }}>
                    <MessageSquare size={16} /> {property.inquiries || 0} inquiries
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <Link to={`/owner/edit-property/${property.id}`} style={{ color: 'var(--color-foggy)', display: 'flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none', fontSize: '0.875rem' }}>
                    <Edit size={16} /> Edit
                  </Link>
                  <button
                    onClick={() => handleToggleStatus(property.id, property.status)}
                    style={{ background: 'none', border: 'none', color: 'var(--color-foggy)', display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', fontSize: '0.875rem' }}
                  >
                    {property.status === 'ACTIVE' ? <><Pause size={16} /> Pause</> : <><Play size={16} /> Activate</>}
                  </button>
                  <button
                    onClick={() => handleDelete(property.id)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', fontSize: '0.875rem' }}
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyProperties;
