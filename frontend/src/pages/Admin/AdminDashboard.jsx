import React, { useState, useEffect } from 'react';
import { Users, Building2, Home, Calendar, FileText, Clock, Loader2 } from 'lucide-react';
import api from '../../api/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/api/admin/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
        <Loader2 size={32} className="animate-spin" color="var(--color-primary)" />
      </div>
    );
  }

  // Fallback data if API fails or returns null
  const defaultStats = stats || {
    totalUsers: 0,
    totalProperties: 0,
    activeListings: 0,
    totalVisits: 0,
    totalApplications: 0,
    pendingVisits: 0,
    recentUsers: [],
    recentProperties: []
  };

  const statCards = [
    { label: 'Total Users', value: defaultStats.totalUsers, icon: Users, color: '#4f46e5' },
    { label: 'Total Properties', value: defaultStats.totalProperties, icon: Building2, color: '#059669' },
    { label: 'Active Listings', value: defaultStats.activeListings, icon: Home, color: '#ba0036' },
    { label: 'Total Visits', value: defaultStats.totalVisits, icon: Calendar, color: '#d97706' },
    { label: 'Total Applications', value: defaultStats.totalApplications, icon: FileText, color: '#2563eb' },
    { label: 'Pending Visits', value: defaultStats.pendingVisits, icon: Clock, color: '#dc2626' }
  ];

  return (
    <div style={{ padding: '24px', backgroundColor: 'var(--color-background)', minHeight: '100vh' }}>
      <h1 style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-on-surface)', marginBottom: '24px' }}>
        Admin Dashboard
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="card" style={{ 
              backgroundColor: 'var(--color-white)', 
              border: '1px solid var(--color-bebe)', 
              borderRadius: '12px', 
              padding: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div style={{ 
                backgroundColor: `${card.color}15`, 
                color: card.color, 
                padding: '12px', 
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Icon size={24} />
              </div>
              <div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', fontFamily: 'var(--font-headline)', color: 'var(--color-on-surface)' }}>
                  {card.value}
                </div>
                <div style={{ fontSize: '14px', fontFamily: 'var(--font-body)', color: 'var(--color-foggy)' }}>
                  {card.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        <div className="card" style={{ backgroundColor: 'var(--color-white)', border: '1px solid var(--color-bebe)', borderRadius: '12px', padding: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: '18px', marginBottom: '16px' }}>Recent Users</h2>
          {defaultStats.recentUsers.length === 0 ? (
            <p style={{ color: 'var(--color-foggy)' }}>No recent users.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {defaultStats.recentUsers.map((user, i) => (
                <li key={i} style={{ borderBottom: i !== defaultStats.recentUsers.length - 1 ? '1px solid var(--color-bebe)' : 'none', padding: '12px 0' }}>
                  <div style={{ fontWeight: '500' }}>{user.name}</div>
                  <div style={{ fontSize: '13px', color: 'var(--color-foggy)', display: 'flex', gap: '8px', marginTop: '4px' }}>
                    <span>{user.email}</span> &bull; <span>{user.role}</span> &bull; <span>{new Date(user.joinedDate || Date.now()).toLocaleDateString()}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card" style={{ backgroundColor: 'var(--color-white)', border: '1px solid var(--color-bebe)', borderRadius: '12px', padding: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: '18px', marginBottom: '16px' }}>Recent Properties</h2>
          {defaultStats.recentProperties.length === 0 ? (
            <p style={{ color: 'var(--color-foggy)' }}>No recent properties.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {defaultStats.recentProperties.map((prop, i) => (
                <li key={i} style={{ borderBottom: i !== defaultStats.recentProperties.length - 1 ? '1px solid var(--color-bebe)' : 'none', padding: '12px 0' }}>
                  <div style={{ fontWeight: '500' }}>{prop.title}</div>
                  <div style={{ fontSize: '13px', color: 'var(--color-foggy)', display: 'flex', gap: '8px', marginTop: '4px' }}>
                    <span>{prop.city}</span> &bull; <span>₹{prop.rent}/mo</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
