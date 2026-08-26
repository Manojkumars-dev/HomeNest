

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Phone, User, CheckCircle, Home, Building2 } from 'lucide-react';
import Logo from '../../components/Logo';
import { useAuth } from '../../context/AuthContext';

// Password strength calculator
// Returns: { score: 0-4, label, color }
function getPasswordStrength(password) {
  if (!password) return { score: 0, label: '', color: '#ebebeb' };
  let score = 0;
  if (password.length >= 8)          score++;   // At least 8 chars
  if (/[A-Z]/.test(password))        score++;   // Has uppercase
  if (/[0-9]/.test(password))        score++;   // Has number
  if (/[^A-Za-z0-9]/.test(password)) score++;   // Has special char

  const levels = [
    { label: '', color: '#ebebeb' },
    { label: 'Weak',   color: '#ba1a1a' },
    { label: 'Fair',   color: '#f59e0b' },
    { label: 'Good',   color: '#3b82f6' },
    { label: 'Strong', color: '#22c55e' },
  ];
  return { score, ...levels[score] };
}

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');

  // ── Form state ─────────────────────────────────────────────
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    password: '', confirmPassword: '',
    agreeTerms: false,
  });
  const [showPassword, setShowPassword]   = useState(false);
  const [showConfirm,  setShowConfirm]    = useState(false);
  const [errors,       setErrors]         = useState({});
  const [isLoading,    setIsLoading]      = useState(false);

  const strength = getPasswordStrength(form.password);

  // ── Input helper ───────────────────────────────────────────
  const set = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  // ── Validation ─────────────────────────────────────────────
  const validate = () => {
    const errs = {};
    if (!form.name.trim())                          errs.name    = 'Full name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email';
    if (!/^\d{10}$/.test(form.phone))               errs.phone   = 'Enter a 10-digit phone number';
    if (form.password.length < 8)                   errs.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword)     errs.confirmPassword = 'Passwords do not match';
    if (!form.agreeTerms)                           errs.agreeTerms = 'You must agree to the terms';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Submit ─────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      const user = await register(form, role);
      // Redirect to the right dashboard based on role
      if (user.role === 'TENANT') navigate('/tenant/dashboard', { replace: true });
      else if (user.role === 'OWNER') navigate('/owner/dashboard', { replace: true });
      else navigate('/', { replace: true });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // ── STEP 1: Role Selector UI ───────────────────────────────
  if (step === 1) {
    return (
      <div style={{
        minHeight: '100vh', backgroundColor: 'var(--color-background)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
      }}>
        <div style={{ width: '100%', maxWidth: '480px' }}>

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Logo size={48} />
          </div>

          {/* Card */}
          <div style={{ backgroundColor: 'var(--color-white)', border: '1px solid var(--color-bebe)', borderRadius: '20px', padding: '40px' }}>
            <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '26px', fontWeight: 700, textAlign: 'center', marginBottom: '8px' }}>
              Join HomeNest
            </h1>
            <p style={{ color: 'var(--color-foggy)', textAlign: 'center', marginBottom: '36px', fontSize: '15px' }}>
              First, tell us — how will you use HomeNest?
            </p>

            {/* Role Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>

              {/* TENANT card */}
              <button
                onClick={() => setRole('TENANT')}
                style={{
                  padding: '28px 16px', border: `2px solid ${role === 'TENANT' ? 'var(--color-primary)' : 'var(--color-bebe)'}`,
                  borderRadius: '16px', backgroundColor: role === 'TENANT' ? 'rgba(186,0,54,0.04)' : 'var(--color-white)',
                  cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center', position: 'relative',
                }}
              >
                {role === 'TENANT' && (
                  <CheckCircle size={18} color="var(--color-primary)" style={{ position: 'absolute', top: '12px', right: '12px' }} />
                )}
                <div style={{
                  width: '56px', height: '56px', borderRadius: '14px', margin: '0 auto 14px',
                  backgroundColor: role === 'TENANT' ? 'rgba(186,0,54,0.1)' : 'var(--color-surface-container)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background-color 0.2s',
                }}>
                  <Home size={26} color={role === 'TENANT' ? 'var(--color-primary)' : 'var(--color-foggy)'} />
                </div>
                <div style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, fontSize: '16px', marginBottom: '6px' }}>I'm a Tenant</div>
                <div style={{ color: 'var(--color-foggy)', fontSize: '13px', lineHeight: 1.5 }}>Looking for a home to rent</div>
              </button>

              {/* OWNER card */}
              <button
                onClick={() => setRole('OWNER')}
                style={{
                  padding: '28px 16px', border: `2px solid ${role === 'OWNER' ? 'var(--color-primary)' : 'var(--color-bebe)'}`,
                  borderRadius: '16px', backgroundColor: role === 'OWNER' ? 'rgba(186,0,54,0.04)' : 'var(--color-white)',
                  cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center', position: 'relative',
                }}
              >
                {role === 'OWNER' && (
                  <CheckCircle size={18} color="var(--color-primary)" style={{ position: 'absolute', top: '12px', right: '12px' }} />
                )}
                <div style={{
                  width: '56px', height: '56px', borderRadius: '14px', margin: '0 auto 14px',
                  backgroundColor: role === 'OWNER' ? 'rgba(186,0,54,0.1)' : 'var(--color-surface-container)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background-color 0.2s',
                }}>
                  <Building2 size={26} color={role === 'OWNER' ? 'var(--color-primary)' : 'var(--color-foggy)'} />
                </div>
                <div style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, fontSize: '16px', marginBottom: '6px' }}>I'm an Owner</div>
                <div style={{ color: 'var(--color-foggy)', fontSize: '13px', lineHeight: 1.5 }}>Want to list my property</div>
              </button>
            </div>

            {/* Continue button */}
            <button
              onClick={() => role && setStep(2)}
              disabled={!role}
              className="btn-primary"
              style={{
                width: '100%', justifyContent: 'center', padding: '14px',
                opacity: role ? 1 : 0.45, cursor: role ? 'pointer' : 'not-allowed',
              }}
            >
              Continue as {role === 'TENANT' ? 'Tenant' : role === 'OWNER' ? 'Owner' : '...'}
            </button>

            <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'var(--color-foggy)' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── STEP 2: Registration Form UI ───────────────────────────
  return (
    <div style={{
      minHeight: '100vh', backgroundColor: 'var(--color-background)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Logo size={44} />
        </div>

        {/* Progress indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
          <div style={{ width: '28px', height: '4px', borderRadius: '2px', backgroundColor: 'var(--color-primary)' }} />
          <div style={{ width: '28px', height: '4px', borderRadius: '2px', backgroundColor: 'var(--color-primary)' }} />
          <span style={{ fontSize: '12px', color: 'var(--color-foggy)', marginLeft: '8px' }}>Step 2 of 2</span>
        </div>

        {/* Card */}
        <div style={{ backgroundColor: 'var(--color-white)', border: '1px solid var(--color-bebe)', borderRadius: '20px', padding: '40px' }}>

          {/* Role badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '22px', fontWeight: 700 }}>Create your account</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 12px', backgroundColor: 'rgba(186,0,54,0.08)', borderRadius: '999px' }}>
              {role === 'TENANT' ? <Home size={14} color="var(--color-primary)" /> : <Building2 size={14} color="var(--color-primary)" />}
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-primary)' }}>{role === 'TENANT' ? 'Tenant' : 'Owner'}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>

            {/* Full Name */}
            <div style={{ marginBottom: '14px' }}>
              <label className="input-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={15} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-foggy)' }} />
                <input className="input" type="text" placeholder="Rahul Mehta" style={{ paddingLeft: '38px', borderColor: errors.name ? 'var(--color-error)' : undefined }}
                  value={form.name} onChange={e => set('name', e.target.value)} />
              </div>
              {errors.name && <p style={{ color: 'var(--color-error)', fontSize: '12px', marginTop: '4px' }}>{errors.name}</p>}
            </div>

            {/* Email */}
            <div style={{ marginBottom: '14px' }}>
              <label className="input-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-foggy)' }} />
                <input className="input" type="email" placeholder="you@example.com" style={{ paddingLeft: '38px', borderColor: errors.email ? 'var(--color-error)' : undefined }}
                  value={form.email} onChange={e => set('email', e.target.value)} />
              </div>
              {errors.email && <p style={{ color: 'var(--color-error)', fontSize: '12px', marginTop: '4px' }}>{errors.email}</p>}
            </div>

            {/* Phone */}
            <div style={{ marginBottom: '14px' }}>
              <label className="input-label">Phone Number</label>
              <div style={{ position: 'relative' }}>
                <Phone size={15} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-foggy)' }} />
                <input className="input" type="tel" placeholder="9876543210" maxLength={10} style={{ paddingLeft: '38px', borderColor: errors.phone ? 'var(--color-error)' : undefined }}
                  value={form.phone} onChange={e => set('phone', e.target.value.replace(/\D/g, ''))} />
              </div>
              {errors.phone && <p style={{ color: 'var(--color-error)', fontSize: '12px', marginTop: '4px' }}>{errors.phone}</p>}
            </div>

            {/* Password */}
            <div style={{ marginBottom: '14px' }}>
              <label className="input-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-foggy)' }} />
                <input className="input" type={showPassword ? 'text' : 'password'} placeholder="Min. 8 characters"
                  style={{ paddingLeft: '38px', paddingRight: '40px', borderColor: errors.password ? 'var(--color-error)' : undefined }}
                  value={form.password} onChange={e => set('password', e.target.value)} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-foggy)', padding: 0 }}>
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {/* Password strength bar */}
              {form.password && (
                <div style={{ marginTop: '8px' }}>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                    {[1,2,3,4].map(i => (
                      <div key={i} style={{ flex: 1, height: '3px', borderRadius: '2px', backgroundColor: i <= strength.score ? strength.color : 'var(--color-bebe)', transition: 'background-color 0.3s' }} />
                    ))}
                  </div>
                  <p style={{ fontSize: '11px', color: strength.color, fontWeight: 600 }}>{strength.label}</p>
                </div>
              )}
              {errors.password && <p style={{ color: 'var(--color-error)', fontSize: '12px', marginTop: '4px' }}>{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: '20px' }}>
              <label className="input-label">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-foggy)' }} />
                <input className="input" type={showConfirm ? 'text' : 'password'} placeholder="Repeat your password"
                  style={{ paddingLeft: '38px', paddingRight: '40px', borderColor: errors.confirmPassword ? 'var(--color-error)' : undefined }}
                  value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-foggy)', padding: 0 }}>
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.confirmPassword && <p style={{ color: 'var(--color-error)', fontSize: '12px', marginTop: '4px' }}>{errors.confirmPassword}</p>}
            </div>

            {/* Terms */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.agreeTerms} onChange={e => set('agreeTerms', e.target.checked)}
                  style={{ marginTop: '2px', accentColor: 'var(--color-primary)', width: '15px', height: '15px', flexShrink: 0 }} />
                <span style={{ fontSize: '13px', color: 'var(--color-foggy)', lineHeight: 1.5 }}>
                  I agree to the{' '}
                  <Link to="/terms" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>Terms of Service</Link>
                  {' '}and{' '}
                  <Link to="/privacy" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>Privacy Policy</Link>
                </span>
              </label>
              {errors.agreeTerms && <p style={{ color: 'var(--color-error)', fontSize: '12px', marginTop: '6px' }}>{errors.agreeTerms}</p>}
            </div>

            {/* Submit */}
            <button type="submit" className="btn-primary" disabled={isLoading}
              style={{ width: '100%', justifyContent: 'center', padding: '14px', opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'wait' : 'pointer' }}>
              {isLoading ? 'Creating your account...' : `Create ${role === 'TENANT' ? 'Tenant' : 'Owner'} Account`}
            </button>

            {/* Back */}
            <button type="button" onClick={() => setStep(1)}
              style={{ width: '100%', marginTop: '12px', padding: '12px', background: 'none', border: 'none', color: 'var(--color-foggy)', fontFamily: 'var(--font-body)', fontSize: '14px', cursor: 'pointer' }}>
              ← Back to role selection
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: 'var(--color-foggy)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
