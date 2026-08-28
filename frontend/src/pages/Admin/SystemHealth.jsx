import React, { useState, useEffect } from 'react';
import { Activity, Database, Monitor, Loader2 } from 'lucide-react';
import api from '../../api/api';

export default function SystemHealth() {
  const [apiStatus, setApiStatus] = useState('Checking...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        await api.get('/api/auth/health');
        setApiStatus('Online');
      } catch (error) {
        setApiStatus('Offline');
      } finally {
        setLoading(false);
      }
    };
    checkHealth();
  }, []);

  const isOnline = apiStatus === 'Online';

  const healthCards = [
    { title: 'API Server', status: apiStatus, icon: Activity, isGood: isOnline },
    { title: 'Database', status: isOnline ? 'Connected' : 'Unknown', icon: Database, isGood: isOnline },
    { title: 'Frontend', status: 'Running', icon: Monitor, isGood: true },
  ];

  return (
    <div style={{ padding: '24px', backgroundColor: 'var(--color-background)', minHeight: '100vh' }}>
      <h1 style={{ fontFamily: 'var(--font-headline)', marginBottom: '24px' }}>System Health</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {healthCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="card" style={{ 
              backgroundColor: 'var(--color-white)', 
              borderRadius: '12px', 
              padding: '24px', 
              border: '1px solid var(--color-bebe)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div style={{ 
                backgroundColor: card.isGood ? '#dcfce7' : (loading ? '#f3f4f6' : '#fee2e2'), 
                color: card.isGood ? '#166534' : (loading ? '#4b5563' : '#991b1b'), 
                padding: '16px', 
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Icon size={24} />
              </div>
              <div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: 'var(--color-foggy)' }}>{card.title}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '18px' }}>
                  {loading && card.title === 'API Server' ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <div style={{ 
                      width: '10px', height: '10px', borderRadius: '50%', 
                      backgroundColor: card.isGood ? '#22c55e' : '#ef4444' 
                    }} />
                  )}
                  {card.status}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card" style={{ 
        backgroundColor: 'var(--color-white)', 
        borderRadius: '12px', 
        padding: '24px', 
        border: '1px solid var(--color-bebe)'
      }}>
        <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: '18px', marginBottom: '16px' }}>System Information</h2>
        <div style={{ fontFamily: 'monospace', fontSize: '14px', backgroundColor: '#1e293b', color: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
          <p style={{ margin: '0 0 8px 0' }}>{`> Backend: Render Cloud Service`}</p>
          <p style={{ margin: '0 0 8px 0' }}>{`> Frontend: Vercel Cloud`}</p>
          <p style={{ margin: '0 0 8px 0', color: '#94a3b8' }}>---</p>
          <p style={{ margin: '0 0 8px 0' }}>{`> Database: Aiven Cloud MySQL`}</p>
          <p style={{ margin: '0 0 8px 0' }}>{`> Java: 21 | Spring Boot: 3.2.5 | MySQL: 8.0`}</p>
        </div>
      </div>
    </div>
  );
}
