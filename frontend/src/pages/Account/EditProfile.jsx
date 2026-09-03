import React, { useState, useRef, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import MaasTip from '../../components/account/MaasTip';
import AccountSidebar from '../../components/account/AccountSidebar';
import { Camera, AlertCircle } from 'lucide-react';

export default function EditProfile() {
  const { user, updateProfile, uploadProfileImage, signOut } = useAuth();
  const navigate = useNavigate();
  const shouldReduce = useReducedMotion();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Extract initial values
  const currentFullName = user?.user_metadata?.fullName || user?.email?.split('@')[0] || '';
  const currentFirstName = currentFullName.split(' ')[0] || '';
  const currentLastName = currentFullName.split(' ').slice(1).join(' ') || '';
  
  const currentEmail = user?.email || '';
  const currentMobile = user?.user_metadata?.mobile || '';
  const currentPhoto = user?.user_metadata?.avatar_url || '';

  const [firstName, setFirstName] = useState(currentFirstName);
  const [lastName, setLastName] = useState(currentLastName);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(currentPhoto);
  
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef(null);

  // Check if anything actually changed
  const hasChanges = 
    firstName.trim() !== currentFirstName ||
    lastName.trim() !== currentLastName ||
    photoFile !== null;

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    
    // Validate type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a JPG, PNG, or WEBP image under 5 MB.');
      return;
    }

    // Validate size (5MB = 5 * 1024 * 1024 bytes)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image exceeds the 5 MB limit. Please choose a smaller file.');
      return;
    }

    setPhotoFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPhotoPreview(objectUrl);
  };

  const handleSave = async () => {
    setError('');

    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();

    if (!trimmedFirst) {
      setError('First Name is required.');
      return;
    }

    setIsSaving(true);
    let finalPhotoUrl = currentPhoto;

    // 1. Upload photo if changed
    if (photoFile) {
      const { data: uploadData, error: uploadError } = await uploadProfileImage(user.id, photoFile);
      if (uploadError) {
        setIsSaving(false);
        setError('Failed to upload profile photo. Please try again.');
        console.error('Photo upload error:', uploadError);
        return; // Stop save process if photo fails
      }
      finalPhotoUrl = uploadData.publicUrl;
    }

    // 2. Update auth metadata
    const newFullName = trimmedLast ? `${trimmedFirst} ${trimmedLast}` : trimmedFirst;
    const { error: updateError } = await updateProfile({
      fullName: newFullName,
      avatar_url: finalPhotoUrl
    });

    setIsSaving(false);

    if (updateError) {
      setError(updateError.message || 'Unable to update your profile. Please try again.');
      return;
    }

    // Success! Navigate back to account overview
    navigate('/account');
  };

  const getInitial = () => {
    return (firstName || currentFirstName || 'U').charAt(0).toUpperCase();
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    background: '#FFFFFF',
    border: '1px solid rgba(93, 64, 55, 0.15)',
    borderRadius: '8px',
    boxSizing: 'border-box',
    fontFamily: "'Be Vietnam Pro', sans-serif",
    fontSize: '15px',
    color: '#3D2B1F',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const readOnlyStyle = {
    ...inputStyle,
    background: 'rgba(93, 64, 55, 0.04)',
    color: 'rgba(93, 64, 55, 0.6)',
    borderColor: 'transparent',
    cursor: 'not-allowed',
  };

  const labelStyle = {
    display: 'block',
    fontFamily: "'Be Vietnam Pro', sans-serif",
    fontSize: '13px',
    fontWeight: 600,
    color: '#5D4037',
    marginBottom: '6px'
  };

  return (
    <div className="account-page-root" style={{
      minHeight: '100vh',
      background: '#FFF8F4',
      paddingTop: '64px',
    }}>
      <div 
        id="account-layout"
        data-has-sidebar="true"
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '260px 1fr',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        {/* Sidebar */}
        {!isMobile && (
          <motion.div
            initial={shouldReduce ? false : { opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <AccountSidebar user={user} onSignOut={signOut} />
          </motion.div>
        )}

        {/* Main Content */}
        <div className="account-content-area" style={{ padding: isMobile ? '16px' : 'clamp(24px, 4vw, 40px)', maxWidth: '1000px', width: '100%', boxSizing: 'border-box' }}>
          
          {/* Mobile Sidebar Navigation (Compact) */}
          {isMobile && (
            <div style={{ marginBottom: '32px' }}>
              <AccountSidebar user={user} onSignOut={signOut} isMobile={true} />
            </div>
          )}
        
        <motion.div
          initial={shouldReduce ? false : { opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 style={{
            fontFamily: "'Literata', Georgia, serif",
            fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
            fontWeight: 600,
            color: '#1C1007',
            marginBottom: '24px',
            marginTop: 0
          }}>
            Edit Profile
          </h1>

          {/* Photo Section */}
          <div className="edit-profile-photo-section" style={{
            background: '#FFF',
            border: '1px solid rgba(93, 64, 55, 0.1)',
            borderRadius: '12px',
            padding: 'clamp(16px, 4vw, 24px)',
            marginBottom: '24px',
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: '#FFC300',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              {photoPreview ? (
                <img src={photoPreview} alt="Profile preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '32px', fontWeight: 600, color: '#3D2B1F', fontFamily: "'Literata', Georgia, serif" }}>
                  {getInitial()}
                </span>
              )}
            </div>
            
            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'transparent',
                  border: '1px solid #5D4037',
                  color: '#5D4037',
                  padding: '8px 16px',
                  borderRadius: '24px',
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  marginBottom: '8px',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(93, 64, 55, 0.04)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <Camera size={14} />
                Change Photo
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoSelect}
                accept="image/jpeg, image/png, image/webp"
                style={{ display: 'none' }}
              />
              <p style={{ margin: 0, fontSize: '12px', color: '#7A5C4A', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                JPG, PNG, or WEBP. Max size of 5 MB
              </p>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(178, 34, 34, 0.08)',
              color: '#B22222',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '24px',
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontSize: '13px'
            }}>
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Tip Section */}
          <div style={{ marginBottom: '24px' }}>
            <MaasTip />
          </div>

          {/* Form Card */}
          <div style={{
            background: '#FFF',
            border: '1px solid rgba(93, 64, 55, 0.1)',
            borderRadius: '12px',
            padding: 'clamp(16px, 4vw, 32px)',
          }}>
            <div className="edit-profile-form-grid" style={{ marginBottom: '24px' }}>
              <div>
                <label style={labelStyle}>First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = '#B22222'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(93, 64, 55, 0.15)'}
                />
              </div>
              <div>
                <label style={labelStyle}>Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = '#B22222'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(93, 64, 55, 0.15)'}
                />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email"
                value={currentEmail}
                readOnly
                style={readOnlyStyle}
                title="Email cannot be changed here."
              />
            </div>

            {currentMobile && (
              <div style={{ marginBottom: '32px' }}>
                <label style={labelStyle}>Mobile Number</label>
                <input
                  type="tel"
                  value={currentMobile}
                  readOnly
                  style={readOnlyStyle}
                  title="Mobile number cannot be changed here."
                />
              </div>
            )}

            <div style={{ height: '1px', background: 'rgba(93, 64, 55, 0.1)', margin: '24px 0' }} />

            <div className="edit-profile-buttons">
              <button
                type="button"
                onClick={() => navigate('/account')}
                disabled={isSaving}
                style={{
                  padding: '12px 24px',
                  background: 'transparent',
                  border: '1px solid #5D4037',
                  color: '#5D4037',
                  borderRadius: '24px',
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  opacity: isSaving ? 0.6 : 1,
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => !isSaving && (e.currentTarget.style.background = 'rgba(93, 64, 55, 0.04)')}
                onMouseLeave={(e) => !isSaving && (e.currentTarget.style.background = 'transparent')}
              >
                Cancel
              </button>
              
              <button
                type="button"
                onClick={handleSave}
                disabled={!hasChanges || isSaving}
                style={{
                  padding: '12px 24px',
                  background: (!hasChanges || isSaving) ? 'rgba(178, 34, 34, 0.5)' : '#B22222',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: '24px',
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: (!hasChanges || isSaving) ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => (!hasChanges || isSaving) ? null : (e.currentTarget.style.background = '#8B1A1A')}
                onMouseLeave={(e) => (!hasChanges || isSaving) ? null : (e.currentTarget.style.background = '#B22222')}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </motion.div>
        </div>
      </div>
    </div>
  );
}
