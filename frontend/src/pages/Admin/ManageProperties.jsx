import React, { useState, useEffect } from 'react';
import { Loader2, Search, AlertCircle } from 'lucide-react';
import api from '../../api/api';

export default function ManageProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/properties');
      setProperties(response.data);
    } catch (error) {
      console.error('Failed to fetch properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id) => {
    try {
      await api.put(`/admin/properties/${id}/verify`);
      setProperties(properties.map(p => p.id === id ? { ...p, verified: true } : p));
    } catch (error) {
      console.error('Failed to verify property:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/admin/properties/${id}/reject`);
      setProperties(properties.map(p => p.id === id ? { ...p, status: 'REJECTED' } : p));
    } catch (error) {
      console.error('Failed to reject property:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      try {
        await api.delete(`/admin/properties/${id}`);
        setProperties(properties.filter(p => p.id !== id));
      } catch (error) {
        console.error('Failed to delete property:', error);
      }
    }
  };

  const filteredProperties = properties.filter(p => 
    p.title?.toLowerCase().includes(search.toLowerCase()) || 
    p.city?.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadgeStyle = (status) => {
    const baseStyle = { padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' };
    switch(status) {
      case 'ACTIVE': return { ...baseStyle, backgroundColor: '#dcfce7', color: '#166534' };
      case 'PAUSED': return { ...baseStyle, backgroundColor: '#fef08a', color: '#854d0e' };
      case 'RENTED': return { ...baseStyle, backgroundColor: '#e0f2fe', color: '#0369a1' };
      case 'REJECTED': return { ...baseStyle, backgroundColor: '#fee2e2', color: '#991b1b' };
      default: return { ...baseStyle, backgroundColor: '#f3f4f6', color: '#374151' };
    }
  };

  return (
    <div style={{ padding: '24px', backgroundColor: 'var(--color-background)', minHeight: '100vh' }}>
      <h1 style={{ fontFamily: 'var(--font-headline)', marginBottom: '24px' }}>Manage Properties</h1>
      
      <div className="card" style={{ backgroundColor: 'var(--color-white)', borderRadius: '12px', padding: '20px', border: '1px solid var(--color-bebe)' }}>
        <div style={{ display: 'flex', marginBottom: '20px', position: 'relative' }}>
          <Search size={20} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--color-foggy)' }} />
          <input 
            type="text" 
            className="input"
            placeholder="Search properties by title or city..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', paddingLeft: '40px', maxWidth: '400px' }}
          />
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <Loader2 size={32} className="animate-spin" color="var(--color-primary)" />
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-bebe)', color: 'var(--color-foggy)' }}>
                  <th style={{ padding: '12px' }}>Title</th>
                  <th style={{ padding: '12px' }}>City</th>
                  <th style={{ padding: '12px' }}>Owner</th>
                  <th style={{ padding: '12px' }}>Rent</th>
                  <th style={{ padding: '12px' }}>Status</th>
                  <th style={{ padding: '12px' }}>Verified</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProperties.map((prop, i) => (
                  <tr key={prop.id} style={{ 
                    borderBottom: '1px solid var(--color-bebe)', 
                    backgroundColor: i % 2 === 0 ? 'var(--color-white)' : '#f9f9f9'
                  }}>
                    <td style={{ padding: '12px', fontWeight: '500' }}>{prop.title}</td>
                    <td style={{ padding: '12px', color: 'var(--color-foggy)' }}>{prop.city}</td>
                    <td style={{ padding: '12px' }}>{prop.ownerName || 'Unknown'}</td>
                    <td style={{ padding: '12px' }}>₹{prop.rent?.toLocaleString() || 0}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={getStatusBadgeStyle(prop.status)}>{prop.status}</span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ 
                        padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold',
                        backgroundColor: prop.verified ? '#dcfce7' : '#f3f4f6', color: prop.verified ? '#166534' : '#4b5563'
                      }}>
                        {prop.verified ? 'VERIFIED' : 'PENDING'}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', gap: '8px', display: 'flex', justifyContent: 'flex-end' }}>
                      {!prop.verified && prop.status !== 'REJECTED' && (
                        <button 
                          onClick={() => handleVerify(prop.id)}
                          style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #166534', background: '#dcfce7', color: '#166534', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                        >
                          Verify
                        </button>
                      )}
                      {prop.status !== 'REJECTED' && (
                        <button 
                          onClick={() => handleReject(prop.id)}
                          style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #d1d5db', background: 'white', cursor: 'pointer', fontSize: '12px' }}
                        >
                          Reject
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(prop.id)}
                        style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #fca5a5', background: '#fee2e2', color: '#991b1b', cursor: 'pointer', fontSize: '12px' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredProperties.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: 'var(--color-foggy)' }}>
                      No properties found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
