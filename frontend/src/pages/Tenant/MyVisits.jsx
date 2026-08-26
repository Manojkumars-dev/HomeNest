import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, X, Search, Loader2 } from 'lucide-react';
import api from '../../api/api';

const statusConfig = {
  PENDING: { bg: 'rgba(245,158,11,0.1)', color: '#b45309', label: 'Pending' },
  CONFIRMED: { bg: 'rgba(34,197,94,0.1)', color: '#166534', label: 'Confirmed' },
  COMPLETED: { bg: 'rgba(59,130,246,0.1)', color: '#1d4ed8', label: 'Completed' },
  CANCELLED: { bg: 'rgba(239,68,68,0.1)', color: '#991b1b', label: 'Cancelled' },
};

const MyVisits = () => {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/tenant/visits');
      setVisits(response.data || []);
    } catch (error) {
      console.error('Failed to fetch visits', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (visitId) => {
    if (!window.confirm('Are you sure you want to cancel this visit?')) return;
    try {
      await api.put(`/api/tenant/visits/${visitId}/cancel`);
      setVisits((prev) =>
        prev.map((v) => (v.id === visitId ? { ...v, status: 'CANCELLED' } : v))
      );
    } catch (error) {
      console.error('Failed to cancel visit', error);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <Loader2 className="animate-spin" size={32} color="var(--color-primary)" />
      </div>
    );
  }

  if (visits.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <Calendar size={48} color="var(--color-bebe)" style={{ margin: '0 auto 1rem' }} />
        <h2 style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-on-surface)', marginBottom: '0.5rem' }}>
          No visits scheduled
        </h2>
        <p style={{ color: 'var(--color-foggy)', marginBottom: '1.5rem' }}>
          Find your dream home and schedule a visit.
        </p>
        <Link to="/search" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <Search size={18} />
          Find Homes
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-on-surface)', marginBottom: '2rem' }}>
        My Visits
      </h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {visits.map((visit) => {
          const statusStyle = statusConfig[visit.status] || statusConfig.PENDING;
          const canCancel = visit.status === 'PENDING' || visit.status === 'CONFIRMED';

          return (
            <div key={visit.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '1.5rem' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-on-surface)', fontSize: '1.125rem', marginBottom: '0.5rem' }}>
                  {visit.propertyTitle}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-foggy)', marginBottom: '1rem', fontSize: '0.875rem' }}>
                  <MapPin size={16} />
                  <span>{visit.city}</span>
                </div>
                
                <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--color-on-surface)', fontSize: '0.875rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={16} color="var(--color-primary)" />
                    <span>{new Date(visit.date).toLocaleDateString()}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={16} color="var(--color-primary)" />
                    <span>{visit.time}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
                <span className="chip" style={{ backgroundColor: statusStyle.bg, color: statusStyle.color, fontWeight: '500' }}>
                  {statusStyle.label}
                </span>
                {canCancel && (
                  <button
                    onClick={() => handleCancel(visit.id)}
                    style={{ background: 'transparent', border: '1px solid var(--color-bebe)', color: 'var(--color-foggy)', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem' }}
                  >
                    <X size={14} /> Cancel
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyVisits;
