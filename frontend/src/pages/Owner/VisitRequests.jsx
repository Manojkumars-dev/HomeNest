import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Check, X, User, MessageSquare, Loader2 } from 'lucide-react';
import api from '../../api/api';

const statusConfig = {
  PENDING: { bg: 'rgba(245,158,11,0.1)', color: '#b45309', label: 'Pending' },
  CONFIRMED: { bg: 'rgba(34,197,94,0.1)', color: '#166534', label: 'Confirmed' },
  CANCELLED: { bg: 'rgba(239,68,68,0.1)', color: '#991b1b', label: 'Declined' },
};

const VisitRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/owner/visits');
      // Sort: PENDING first
      const sorted = (response.data || []).sort((a, b) => {
        if (a.status === 'PENDING' && b.status !== 'PENDING') return -1;
        if (a.status !== 'PENDING' && b.status === 'PENDING') return 1;
        return new Date(b.date) - new Date(a.date);
      });
      setRequests(sorted);
    } catch (error) {
      console.error('Failed to fetch visit requests', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      await api.put(`/api/owner/visits/${id}/${action}`);
      const newStatus = action === 'confirm' ? 'CONFIRMED' : 'CANCELLED';
      setRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req, status: newStatus } : req))
      );
    } catch (error) {
      console.error(`Failed to ${action} request`, error);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <Loader2 className="animate-spin" size={32} color="var(--color-primary)" />
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <Calendar size={48} color="var(--color-bebe)" style={{ margin: '0 auto 1rem' }} />
        <h2 style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-on-surface)', marginBottom: '0.5rem' }}>
          No visit requests
        </h2>
        <p style={{ color: 'var(--color-foggy)' }}>
          You don't have any pending visit requests right now.
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-on-surface)', marginBottom: '2rem' }}>
        Visit Requests
      </h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {requests.map((req) => {
          const statusStyle = statusConfig[req.status] || statusConfig.PENDING;

          return (
            <div key={req.id} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-bebe)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={20} color="var(--color-foggy)" />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-on-surface)', fontSize: '1.125rem', margin: 0 }}>
                      {req.tenantName}
                    </h3>
                    <div style={{ color: 'var(--color-foggy)', fontSize: '0.875rem' }}>
                      wants to visit <strong>{req.propertyTitle}</strong>
                    </div>
                  </div>
                </div>
                {req.status === 'PENDING' ? (
                  <span className="chip" style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}>
                    Action Required
                  </span>
                ) : (
                  <span className="chip" style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}>
                    {statusStyle.label}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', background: 'var(--color-background)', padding: '1rem', borderRadius: '8px', marginBottom: req.note ? '1rem' : '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-on-surface)' }}>
                  <Calendar size={16} color="var(--color-primary)" />
                  <span>{new Date(req.date).toLocaleDateString()}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-on-surface)' }}>
                  <Clock size={16} color="var(--color-primary)" />
                  <span>{req.time}</span>
                </div>
              </div>

              {req.note && (
                <div style={{ display: 'flex', gap: '0.5rem', color: 'var(--color-foggy)', fontSize: '0.875rem', marginBottom: '1.5rem', fontStyle: 'italic' }}>
                  <MessageSquare size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>"{req.note}"</span>
                </div>
              )}

              {req.status === 'PENDING' && (
                <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid var(--color-bebe)', paddingTop: '1rem' }}>
                  <button
                    onClick={() => handleAction(req.id, 'confirm')}
                    style={{ flex: 1, padding: '0.75rem', background: '#16a34a', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '500', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <Check size={18} /> Confirm Visit
                  </button>
                  <button
                    onClick={() => handleAction(req.id, 'cancel')}
                    style={{ flex: 1, padding: '0.75rem', background: 'transparent', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: '6px', fontWeight: '500', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <X size={18} /> Decline
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VisitRequests;
