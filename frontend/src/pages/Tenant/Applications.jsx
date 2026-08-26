import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, X, FileText, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../../api/api';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/tenant/applications');
      setApplications(response.data || []);
    } catch (error) {
      console.error('Failed to fetch applications', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (applicationId) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) return;
    try {
      await api.put(`/api/tenant/applications/${applicationId}/withdraw`);
      setApplications((prev) =>
        prev.map((app) => (app.id === applicationId ? { ...app, status: 'WITHDRAWN' } : app))
      );
    } catch (error) {
      console.error('Failed to withdraw application', error);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <Loader2 className="animate-spin" size={32} color="var(--color-primary)" />
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <FileText size={48} color="var(--color-bebe)" style={{ margin: '0 auto 1rem' }} />
        <h2 style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-on-surface)', marginBottom: '0.5rem' }}>
          No applications yet
        </h2>
        <p style={{ color: 'var(--color-foggy)', marginBottom: '1.5rem' }}>
          When you apply for a property, you'll see the status here.
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-on-surface)', marginBottom: '2rem' }}>
        My Applications
      </h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {applications.map((app) => {
          const canWithdraw = app.status === 'SUBMITTED' || app.status === 'UNDER_REVIEW';

          return (
            <div key={app.id} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-on-surface)', fontSize: '1.125rem', marginBottom: '0.25rem' }}>
                    {app.propertyTitle}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-foggy)', fontSize: '0.875rem' }}>
                    <MapPin size={14} />
                    <span>{app.city}</span>
                  </div>
                </div>
                <div style={{ fontWeight: '600', color: 'var(--color-primary)', fontSize: '1.125rem' }}>
                  ₹{app.rent?.toLocaleString()}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-foggy)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                <Calendar size={14} />
                <span>Applied on {new Date(app.appliedDate).toLocaleDateString()}</span>
              </div>

              <div style={{ background: 'var(--color-background)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-on-surface)' }}>
                  <span>Status: {app.status.replace('_', ' ')}</span>
                </div>
                <div style={{ display: 'flex', height: '4px', background: 'var(--color-bebe)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: app.status === 'SUBMITTED' ? '33%' : app.status === 'UNDER_REVIEW' ? '66%' : '100%', background: app.status === 'REJECTED' || app.status === 'WITHDRAWN' ? '#ef4444' : 'var(--color-primary)' }} />
                </div>
              </div>

              {app.status === 'APPROVED' && (
                <div style={{ background: 'rgba(34,197,94,0.1)', color: '#166534', padding: '1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <CheckCircle2 size={18} />
                  <span>Congratulations! Your application was approved. The owner will contact you shortly.</span>
                </div>
              )}

              {app.status === 'REJECTED' && app.ownerResponse && (
                <div style={{ background: 'rgba(239,68,68,0.1)', color: '#991b1b', padding: '1rem', borderRadius: '8px', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '1rem' }}>
                  <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Owner's Note:</strong>
                    {app.ownerResponse}
                  </div>
                </div>
              )}

              {canWithdraw && (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => handleWithdraw(app.id)}
                    style={{ background: 'transparent', border: '1px solid var(--color-bebe)', color: 'var(--color-foggy)', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem' }}
                  >
                    <X size={14} /> Withdraw Application
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

export default Applications;
