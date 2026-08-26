// Login.jsx — Sign in page
// Calls useAuth().login() → stores user → redirects to their dashboard

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import Logo from '../../components/Logo';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { login } = useAuth();

  const [form,        setForm]        = useState({ email:'', password:'' });
  const [showPassword,setShowPassword]= useState(false);
  const [error,       setError]       = useState('');
  const [isLoading,   setIsLoading]   = useState(false);

  // Where to go after login — defaults to role-based dashboard
  // or wherever the user was trying to go before being redirected to /login
  const from = location.state?.from || null;

  const getDashboardPath = (role) => {
    if (role === 'TENANT') return '/tenant/dashboard';
    if (role === 'OWNER')  return '/owner/dashboard';
    if (role === 'ADMIN')  return '/admin/dashboard';
    return '/';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.email)    { setError('Please enter your email'); return; }
    if (!form.password) { setError('Please enter your password'); return; }

    setIsLoading(true);
    try {
      const user = await login(form.email, form.password);
      // Redirect to their dashboard (or where they came from)
      navigate(from || getDashboardPath(user.role), { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight:'100vh', backgroundColor:'var(--color-background)', display:'flex', alignItems:'center', justifyContent:'center', padding:'24px' }}>
      <div style={{ width:'100%', maxWidth:'440px' }}>

        {/* HomeNest Logo at top — centered */}
        <div style={{ textAlign:'center', marginBottom:'32px' }}>
          <Logo size={48} />
        </div>

        {/* Login Card */}
        <div style={{ backgroundColor:'var(--color-white)', border:'1px solid var(--color-bebe)', borderRadius:'20px', padding:'40px' }}>
          <h1 style={{ fontFamily:'var(--font-headline)', fontSize:'24px', fontWeight:700, marginBottom:'6px', textAlign:'center' }}>Welcome back</h1>
          <p style={{ color:'var(--color-foggy)', fontSize:'14px', textAlign:'center', marginBottom:'28px' }}>Sign in to your HomeNest account</p>


          {/* Error message */}
          {error && (
            <div style={{ backgroundColor:'rgba(186,0,54,0.06)', border:'1px solid rgba(186,0,54,0.2)', borderRadius:'10px', padding:'12px 16px', marginBottom:'16px', display:'flex', alignItems:'center', gap:'8px' }}>
              <AlertCircle size={16} color="var(--color-primary)"/>
              <p style={{ fontSize:'13px', color:'var(--color-primary)', fontWeight:500 }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom:'14px' }}>
              <label className="input-label">Email address</label>
              <div style={{ position:'relative' }}>
                <Mail size={16} style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', color:'var(--color-foggy)' }} />
                <input className="input" type="email" placeholder="you@example.com"
                  style={{ paddingLeft:'42px' }}
                  value={form.email}
                  onChange={e => { setForm({...form, email:e.target.value}); setError(''); }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom:'24px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'6px' }}>
                <label className="input-label" style={{ margin:0 }}>Password</label>
                <Link to="/forgot-password" style={{ fontSize:'13px', color:'var(--color-primary)', textDecoration:'none', fontWeight:500 }}>Forgot password?</Link>
              </div>
              <div style={{ position:'relative' }}>
                <Lock size={16} style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', color:'var(--color-foggy)' }} />
                <input className="input" type={showPassword ? 'text' : 'password'} placeholder="Your password"
                  style={{ paddingLeft:'42px', paddingRight:'42px' }}
                  value={form.password}
                  onChange={e => { setForm({...form, password:e.target.value}); setError(''); }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position:'absolute', right:'14px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--color-foggy)', padding:0, display:'flex' }}>
                  {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={isLoading}
              style={{ width:'100%', justifyContent:'center', padding:'14px', fontSize:'15px', opacity:isLoading?0.7:1, cursor:isLoading?'wait':'pointer' }}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign:'center', marginTop:'20px', fontSize:'14px', color:'var(--color-foggy)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color:'var(--color-primary)', fontWeight:700, textDecoration:'none' }}>Create one free</Link>
          </p>
        </div>

      </div>
    </div>
  );
}
