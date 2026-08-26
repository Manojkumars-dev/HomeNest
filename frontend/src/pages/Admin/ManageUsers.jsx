import React, { useState, useEffect } from 'react';
import { Loader2, Search } from 'lucide-react';
import api from '../../api/api';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id, currentStatus) => {
    try {
      await api.put(`/admin/users/${id}/toggle-active`);
      setUsers(users.map(u => u.id === id ? { ...u, active: !currentStatus } : u));
    } catch (error) {
      console.error('Failed to toggle active status:', error);
    }
  };

  const toggleVerified = async (id, currentStatus) => {
    try {
      await api.put(`/admin/users/${id}/toggle-verified`);
      setUsers(users.map(u => u.id === id ? { ...u, verified: !currentStatus } : u));
    } catch (error) {
      console.error('Failed to toggle verified status:', error);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const getRoleBadgeStyle = (role) => {
    const baseStyle = { padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' };
    switch(role) {
      case 'TENANT': return { ...baseStyle, backgroundColor: '#e0f2fe', color: '#0369a1' };
      case 'OWNER': return { ...baseStyle, backgroundColor: '#f3e8ff', color: '#7e22ce' };
      case 'ADMIN': return { ...baseStyle, backgroundColor: '#fee2e2', color: '#b91c1c' };
      default: return { ...baseStyle, backgroundColor: '#f3f4f6', color: '#374151' };
    }
  };

  return (
    <div style={{ padding: '24px', backgroundColor: 'var(--color-background)', minHeight: '100vh' }}>
      <h1 style={{ fontFamily: 'var(--font-headline)', marginBottom: '24px' }}>Manage Users</h1>
      
      <div className="card" style={{ backgroundColor: 'var(--color-white)', borderRadius: '12px', padding: '20px', border: '1px solid var(--color-bebe)' }}>
        <div style={{ display: 'flex', marginBottom: '20px', position: 'relative' }}>
          <Search size={20} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--color-foggy)' }} />
          <input 
            type="text" 
            className="input"
            placeholder="Search users by name or email..." 
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
                  <th style={{ padding: '12px' }}>Name</th>
                  <th style={{ padding: '12px' }}>Email</th>
                  <th style={{ padding: '12px' }}>Role</th>
                  <th style={{ padding: '12px' }}>Active</th>
                  <th style={{ padding: '12px' }}>Verified</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, i) => (
                  <tr key={user.id} style={{ 
                    borderBottom: '1px solid var(--color-bebe)', 
                    backgroundColor: i % 2 === 0 ? 'var(--color-white)' : '#f9f9f9'
                  }}>
                    <td style={{ padding: '12px', fontWeight: '500' }}>{user.name}</td>
                    <td style={{ padding: '12px', color: 'var(--color-foggy)' }}>{user.email}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={getRoleBadgeStyle(user.role)}>{user.role}</span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ 
                        padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold',
                        backgroundColor: user.active ? '#dcfce7' : '#fee2e2', color: user.active ? '#166534' : '#991b1b'
                      }}>
                        {user.active ? 'YES' : 'NO'}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ 
                        padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold',
                        backgroundColor: user.verified ? '#dcfce7' : '#f3f4f6', color: user.verified ? '#166534' : '#4b5563'
                      }}>
                        {user.verified ? 'VERIFIED' : 'UNVERIFIED'}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', gap: '8px', display: 'flex', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => toggleActive(user.id, user.active)}
                        style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #d1d5db', background: 'white', cursor: 'pointer', fontSize: '12px' }}
                      >
                        {user.active ? 'Ban' : 'Unban'}
                      </button>
                      <button 
                        onClick={() => toggleVerified(user.id, user.verified)}
                        style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #d1d5db', background: 'white', cursor: 'pointer', fontSize: '12px' }}
                      >
                        {user.verified ? 'Unverify' : 'Verify'}
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: 'var(--color-foggy)' }}>
                      No users found.
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
