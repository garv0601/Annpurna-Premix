import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import AuthLayout from '../../components/auth/AuthLayout';
import { useAuth } from '../../hooks/useAuth';

const RESET_IMAGE = 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=900&q=85&auto=format&fit=crop';

/**
 * Password reset landing page.
 * Supabase (detectSessionInUrl) turns the emailed recovery link into a
 * temporary session, so the user can set a new password here via
 * supabase.auth.updateUser — no password is ever stored outside Supabase Auth.
 */
export default function ResetPasswordPage() {
  const { session, loading, updatePassword } = useAuth();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [linkError, setLinkError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  // Surface an expired / invalid recovery link (Supabase returns it in the URL hash).
  useEffect(() => {
    const hash = window.location.hash || '';
    if (hash.includes('error')) {
      const params = new URLSearchParams(hash.replace(/^#/, ''));
      const desc = params.get('error_description');
      setLinkError(desc ? desc.replace(/\+/g, ' ') : 'This password reset link is invalid or has expired.');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    const { error: updateError } = await updatePassword(password);
    setIsSubmitting(false);

    if (updateError) {
      setError(updateError.message || 'Failed to update password. Please request a new reset link.');
      return;
    }
    setDone(true);
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 44px 14px 44px',
    background: '#FFFFFF',
    border: '1px solid rgba(93, 64, 55, 0.15)',
    borderRadius: '8px',
    fontFamily: "'Be Vietnam Pro', sans-serif",
    fontSize: '15px',
    color: '#3D2B1F',
    outline: 'none',
    transition: 'all 0.2s ease',
  };

  const buttonStyle = {
    width: '100%',
    padding: '15px 24px',
    background: '#B22222',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    fontFamily: "'Be Vietnam Pro', sans-serif",
    fontSize: '15px',
    fontWeight: 600,
    cursor: isSubmitting ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'background 0.2s ease',
  };

  const linkStyle = { fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '14px', fontWeight: 600, color: '#B22222', textDecoration: 'none' };

  return (
    <AuthLayout imageUrl={RESET_IMAGE}>
      <div style={{ maxWidth: '420px', width: '100%', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontFamily: "'Literata', Georgia, serif", fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', fontWeight: 500, color: '#1C1007', marginBottom: '12px', lineHeight: 1.2 }}>
            {done ? 'Password updated' : 'Set a new password'}
          </h1>
          <p style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '15px', color: '#7A5C4A', lineHeight: 1.6 }}>
            {done
              ? 'Your password has been changed. You can now use it to log in.'
              : 'Choose a strong password for your Annapurna account.'}
          </p>
        </div>

        {/* Success state */}
        {done && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2F8B57', fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '14px', marginBottom: '24px' }}>
              <CheckCircle2 size={18} /> Password changed successfully.
            </div>
            <button type="button" onClick={() => navigate('/account')} style={buttonStyle}>Go to My Account</button>
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <Link to="/login" style={linkStyle}>Back to Login</Link>
            </div>
          </motion.div>
        )}

        {/* Invalid / expired link */}
        {!done && linkError && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', background: 'rgba(178, 34, 34, 0.08)', color: '#B22222', padding: '14px 16px', borderRadius: '8px', fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '13px', marginBottom: '24px' }}>
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '1px' }} /> <span>{linkError}</span>
            </div>
            <Link to="/login" style={{ ...linkStyle, display: 'inline-block' }}>Request a new reset link</Link>
          </motion.div>
        )}

        {/* No recovery session detected */}
        {!done && !linkError && !loading && !session && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', background: 'rgba(178, 34, 34, 0.08)', color: '#B22222', padding: '14px 16px', borderRadius: '8px', fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '13px', marginBottom: '24px' }}>
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '1px' }} /> <span>Open this page from the password reset link in your email to continue.</span>
            </div>
            <Link to="/login" style={{ ...linkStyle, display: 'inline-block' }}>Back to Login</Link>
          </motion.div>
        )}

        {/* Reset form */}
        {!done && !linkError && (loading || session) && (
          <motion.form initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleSubmit} style={{ marginBottom: '32px' }}>
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '13px', fontWeight: 600, color: '#5D4037', marginBottom: '8px' }}>New Password</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#A8816A' }}><Lock size={18} /></div>
                <input type={showPassword ? 'text' : 'password'} placeholder="At least 8 characters" value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }} style={inputStyle} />
                <button type="button" onClick={() => setShowPassword((s) => !s)} aria-label={showPassword ? 'Hide password' : 'Show password'} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#A8816A', cursor: 'pointer', display: 'flex', padding: 0 }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '13px', fontWeight: 600, color: '#5D4037', marginBottom: '8px' }}>Confirm New Password</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#A8816A' }}><Lock size={18} /></div>
                <input type={showPassword ? 'text' : 'password'} placeholder="Re-enter password" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }} style={inputStyle} />
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, height: 0, marginTop: 0 }} animate={{ opacity: 1, height: 'auto', marginTop: 10 }} exit={{ opacity: 0, height: 0, marginTop: 0 }} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#B22222', fontSize: '13px', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                    <AlertCircle size={14} /><span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button type="submit" disabled={isSubmitting} style={buttonStyle}>
              {isSubmitting ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Updating...</> : 'Update Password'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <Link to="/login" style={linkStyle}>Back to Login</Link>
            </div>
          </motion.form>
        )}

        <style>{`
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </div>
    </AuthLayout>
  );
}
