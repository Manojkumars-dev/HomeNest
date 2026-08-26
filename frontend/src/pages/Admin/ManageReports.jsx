import React from 'react';
import { BarChart3, Building2, IndianRupee, TrendingUp, Info } from 'lucide-react';

export default function ManageReports() {
  const reports = [
    { title: 'User Growth', icon: BarChart3, desc: 'View user registration trends', color: 'var(--color-primary)' },
    { title: 'Property Listings', icon: Building2, desc: 'Track property listing activity', color: '#059669' },
    { title: 'Revenue', icon: IndianRupee, desc: 'Monitor platform revenue', color: '#2563eb' },
    { title: 'Engagement', icon: TrendingUp, desc: 'Analyze user engagement', color: '#d97706' },
  ];

  return (
    <div style={{ padding: '24px', backgroundColor: 'var(--color-background)', minHeight: '100vh' }}>
      <h1 style={{ fontFamily: 'var(--font-headline)', marginBottom: '24px' }}>Reports Overview</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {reports.map((report, idx) => {
          const Icon = report.icon;
          return (
            <div 
              key={idx} 
              className="card" 
              style={{ 
                backgroundColor: 'var(--color-white)', 
                borderRadius: '12px', 
                padding: '24px', 
                border: '1px solid var(--color-bebe)',
                cursor: 'pointer',
                transition: 'box-shadow 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
            >
              <div style={{ 
                backgroundColor: `${report.color}15`, 
                color: report.color, 
                padding: '16px', 
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Icon size={28} />
              </div>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 'bold', fontFamily: 'var(--font-headline)' }}>
                  {report.title}
                </h3>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--color-foggy)', fontFamily: 'var(--font-body)' }}>
                  {report.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card" style={{ 
        backgroundColor: 'var(--color-white)', 
        borderRadius: '12px', 
        padding: '32px', 
        border: '1px solid var(--color-bebe)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        textAlign: 'center',
        gap: '12px'
      }}>
        <Info size={48} color="var(--color-primary)" style={{ opacity: 0.8 }} />
        <h2 style={{ fontFamily: 'var(--font-headline)', margin: 0 }}>Detailed analytics dashboard coming soon</h2>
        <p style={{ color: 'var(--color-foggy)', margin: 0 }}>
          We are currently working on bringing you more insightful charts and exportable reports.
        </p>
      </div>
    </div>
  );
}
