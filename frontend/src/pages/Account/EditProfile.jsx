import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import MaasTip from '../../components/account/MaasTip';
import AccountSidebar from '../../components/account/AccountSidebar';
import {
  Camera, AlertCircle, CheckCircle2, User, Sparkles, Bell,
  ShieldCheck, Settings2, KeyRound, Smartphone, LogOut, Trash2, X
} from 'lucide-react';

// ── Theme tokens (match existing Maa's Kitchen design) ────────────────────────
const COLORS = {
  primary: '#B22222',
  primaryHover: '#8B1A1A',
  text: '#1C1007',
  textBody: '#3D2B1F',
  textMuted: '#5D4037',
  textFaint: '#7A5C4A',
  border: 'rgba(93, 64, 55, 0.1)',
  borderInput: 'rgba(93, 64, 55, 0.15)',
  cardBg: '#FFF',
  pageBg: '#FFF8F4',
  accent: '#FFC300',
};

const SERIF = "'Literata', Georgia, serif";
const SANS = "'Be Vietnam Pro', sans-serif";

const LANGUAGES = ['English', 'हिन्दी (Hindi)', 'मराठी (Marathi)', 'ગુજરાતી (Gujarati)', 'தமிழ் (Tamil)', 'తెలుగు (Telugu)', 'বাংলা (Bengali)', 'ಕನ್ನಡ (Kannada)', 'Others'];

// ISD codes shown in the phone number country-code selector (most relevant first)
const COUNTRY_CODES = [
  { code: '+91', label: '🇮🇳 +91' },
  { code: '+1',  label: '🇺🇸 +1'  },
  { code: '+44', label: '🇬🇧 +44' },
  { code: '+61', label: '🇦🇺 +61' },
  { code: '+971', label: '🇦🇪 +971' },
  { code: '+65', label: '🇸🇬 +65' },
  { code: '+81', label: '🇯🇵 +81' },
  { code: '+49', label: '🇩🇪 +49' },
  { code: '+33', label: '🇫🇷 +33' },
  { code: '+86', label: '🇨🇳 +86' },
];

/** Split a stored mobile string like "+91 9876543210" into { countryCode, phone }. */
function parsePhone(raw) {
  const value = (raw || '').trim();
  if (!value) return { countryCode: '+91', phone: '' };
  if (value.startsWith('+')) {
    const match = COUNTRY_CODES
      .slice()
      .sort((a, b) => b.code.length - a.code.length)
      .find((c) => value.startsWith(c.code));
    if (match) {
      return { countryCode: match.code, phone: value.slice(match.code.length).trim().replace(/\D/g, '') };
    }
    // Unknown code — keep the digits after '+' as the country code guess (first 1-3 digits)
    const digitsOnly = value.replace(/[^\d]/g, '');
    return { countryCode: '+91', phone: digitsOnly.replace(/\D/g, '') };
  }
  return { countryCode: '+91', phone: value.replace(/\D/g, '') };
}

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  background: '#FFFFFF',
  border: `1px solid ${COLORS.borderInput}`,
  borderRadius: '8px',
  boxSizing: 'border-box',
  fontFamily: SANS,
  fontSize: '15px',
  color: COLORS.textBody,
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
  fontFamily: SANS,
  fontSize: '13px',
  fontWeight: 600,
  color: COLORS.textMuted,
  marginBottom: '6px',
};

const focusIn = (e) => { e.target.style.borderColor = COLORS.primary; };
const focusOut = (e) => { e.target.style.borderColor = COLORS.borderInput; };

// ── Reusable presentational pieces ────────────────────────────────────────────

function SectionCard({ icon: Icon, title, description, children }) {
  return (
    <div style={{
      background: COLORS.cardBg,
      border: `1px solid ${COLORS.border}`,
      borderRadius: '12px',
      padding: 'clamp(16px, 4vw, 28px)',
      marginBottom: '24px',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: description ? '4px' : '20px' }}>
        {Icon && (
          <div style={{
            width: '36px', height: '36px', borderRadius: '8px', flexShrink: 0,
            background: 'rgba(178, 34, 34, 0.08)', color: COLORS.primary,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon size={18} />
          </div>
        )}
        <div style={{ minWidth: 0 }}>
          <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(1.1rem, 2.4vw, 1.3rem)', fontWeight: 600, color: COLORS.text, margin: 0 }}>
            {title}
          </h2>
          {description && (
            <p style={{ fontFamily: SANS, fontSize: '13px', color: COLORS.textFaint, margin: '4px 0 0 0' }}>
              {description}
            </p>
          )}
        </div>
      </div>
      <div style={{ marginTop: description ? '20px' : 0 }}>
        {children}
      </div>
    </div>
  );
}

function ToggleSwitch({ checked, onChange, label, description, disabled, last }) {
  return (
    <div className="pref-toggle-row" style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: '16px', padding: '14px 0', borderBottom: last ? 'none' : `1px solid ${COLORS.border}`,
    }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: SANS, fontSize: '14px', fontWeight: 600, color: COLORS.textBody }}>{label}</div>
        {description && (
          <div style={{ fontFamily: SANS, fontSize: '12px', color: COLORS.textFaint, marginTop: '2px' }}>{description}</div>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        style={{
          position: 'relative', width: '46px', height: '26px', flexShrink: 0,
          borderRadius: '999px', border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
          background: checked ? COLORS.primary : 'rgba(93, 64, 55, 0.2)',
          opacity: disabled ? 0.6 : 1, transition: 'background 0.2s', padding: 0,
        }}
      >
        <span style={{
          position: 'absolute', top: '3px', left: checked ? '23px' : '3px',
          width: '20px', height: '20px', borderRadius: '50%', background: '#FFF',
          transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }} />
      </button>
    </div>
  );
}

function RadioPills({ options, value, onChange, name }) {
  return (
    <div className="radio-pill-group" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            name={name}
            onClick={() => onChange(opt.value)}
            style={{
              padding: '10px 18px', borderRadius: '999px', cursor: 'pointer',
              fontFamily: SANS, fontSize: '13px', fontWeight: 600,
              border: `1px solid ${active ? COLORS.primary : COLORS.borderInput}`,
              background: active ? 'rgba(178, 34, 34, 0.08)' : 'transparent',
              color: active ? COLORS.primary : COLORS.textMuted,
              transition: 'all 0.2s',
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/** Per-section Cancel / Save Changes bar, with an inline result message. */
function SectionSaveBar({ onCancel, onSave, hasChanges, isSaving, error, success }) {
  return (
    <div>
      <div style={{ height: '1px', background: COLORS.border, margin: '24px 0 16px' }} />
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: COLORS.primary, fontFamily: SANS, fontSize: '13px', marginBottom: '12px' }}>
          <AlertCircle size={15} /> {error}
        </div>
      )}
      {success && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2F8B57', fontFamily: SANS, fontSize: '13px', marginBottom: '12px' }}>
          <CheckCircle2 size={15} /> {success}
        </div>
      )}
      <div className="edit-profile-buttons">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving || !hasChanges}
          style={{
            padding: '10px 22px', background: 'transparent', border: `1px solid ${COLORS.textMuted}`,
            color: COLORS.textMuted, borderRadius: '24px', fontFamily: SANS, fontSize: '13px', fontWeight: 600,
            cursor: (isSaving || !hasChanges) ? 'not-allowed' : 'pointer', opacity: (isSaving || !hasChanges) ? 0.6 : 1,
          }}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={!hasChanges || isSaving}
          style={{
            padding: '10px 22px', background: (!hasChanges || isSaving) ? 'rgba(178, 34, 34, 0.5)' : COLORS.primary,
            color: '#FFF', border: 'none', borderRadius: '24px', fontFamily: SANS, fontSize: '13px', fontWeight: 600,
            cursor: (!hasChanges || isSaving) ? 'not-allowed' : 'pointer',
          }}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function EditProfile() {
  const {
    user, updateProfile, syncProfileRow, uploadProfileImage, signOut,
    updatePassword, listMfaFactors, enrollTotpFactor, verifyTotpFactor, unenrollFactor,
    signOutAllDevices, deleteAccount,
  } = useAuth();
  const navigate = useNavigate();
  const shouldReduce = useReducedMotion();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const meta = user?.user_metadata || {};

  // Derive name pieces: prefer explicit first/last, else split fullName.
  const derivedFullName = meta.fullName || meta.full_name || user?.email?.split('@')[0] || '';
  const initialFirst = meta.firstName || derivedFullName.split(' ')[0] || '';
  const initialLast = meta.lastName ?? (derivedFullName.split(' ').slice(1).join(' ') || '');

  const currentEmail = user?.email || '';
  const currentPhoto = meta.avatar_url || '';

  const buildInitialForm = useCallback(() => {
    const m = user?.user_metadata || {};
    const fn = m.fullName || m.full_name || user?.email?.split('@')[0] || '';
    const { countryCode, phone } = parsePhone(m.mobile || m.phone || '');
    return {
      firstName: m.firstName || fn.split(' ')[0] || '',
      lastName: m.lastName ?? (fn.split(' ').slice(1).join(' ') || ''),
      countryCode: m.countryCode || countryCode,
      phone,
      dateOfBirth: m.dateOfBirth || '',
      preferredLanguage: m.preferredLanguage || 'English',
      customLanguage: m.customLanguage || '',
      dietaryPreference: m.dietaryPreference || '',
      foodAllergies: m.foodAllergies || '',
      spicePreference: m.spicePreference || '',
      promotionalOffers: m.promotionalOffers ?? true,
      newProductNotifications: m.newProductNotifications ?? true,
      emailNotifications: m.emailNotifications ?? true,
      smsNotifications: m.smsNotifications ?? false,
      whatsappNotifications: m.whatsappNotifications ?? false,
    };
  }, [user]);

  const [form, setForm] = useState(buildInitialForm);
  const [initialForm, setInitialForm] = useState(buildInitialForm);

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(currentPhoto);
  const [photoError, setPhotoError] = useState('');
  const fileInputRef = useRef(null);

  // Per-section save state — each section (Personal Info, Preferences,
  // Communication) saves and reports independently of the others.
  const [personalSaving, setPersonalSaving] = useState(false);
  const [personalError, setPersonalError] = useState('');
  const [personalSuccess, setPersonalSuccess] = useState('');

  const [prefSaving, setPrefSaving] = useState(false);
  const [prefError, setPrefError] = useState('');
  const [prefSuccess, setPrefSuccess] = useState('');

  const [commSaving, setCommSaving] = useState(false);
  const [commError, setCommError] = useState('');
  const [commSuccess, setCommSuccess] = useState('');

  // Rebuild the form when the user object becomes available / changes.
  useEffect(() => {
    const fresh = buildInitialForm();
    setForm(fresh);
    setInitialForm(fresh);
    setPhotoPreview(user?.user_metadata?.avatar_url || '');
    setPhotoFile(null);
  }, [user, buildInitialForm]);

  const setField = (key, val) => {
    setForm((prev) => ({ ...prev, [key]: val }));
  };

  const PERSONAL_KEYS = ['firstName', 'lastName', 'countryCode', 'phone', 'dateOfBirth'];
  const PREFERENCE_KEYS = ['preferredLanguage', 'customLanguage', 'dietaryPreference', 'foodAllergies', 'spicePreference'];
  const COMMUNICATION_KEYS = ['promotionalOffers', 'newProductNotifications', 'emailNotifications', 'smsNotifications', 'whatsappNotifications'];

  const hasPersonalChanges = photoFile !== null || PERSONAL_KEYS.some((k) => form[k] !== initialForm[k]);
  const hasPreferenceChanges = PREFERENCE_KEYS.some((k) => form[k] !== initialForm[k]);
  const hasCommunicationChanges = COMMUNICATION_KEYS.some((k) => form[k] !== initialForm[k]);

  // ── Photo ───────────────────────────────────────────────────────────────────
  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoError('');
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setPhotoError('Please upload a JPG, PNG, or WEBP image under 5 MB.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('Image exceeds the 5 MB limit. Please choose a smaller file.');
      return;
    }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };


  const getInitial = () => (form.firstName || initialFirst || 'U').charAt(0).toUpperCase();

  // ── 1. Personal Information (name, photo, phone, date of birth) ──────────────
  const handleSavePersonal = async () => {
    setPersonalError('');
    setPersonalSuccess('');

    const trimmedFirst = form.firstName.trim();
    const trimmedLast = form.lastName.trim();

    if (!trimmedFirst) {
      setPersonalError('First Name is required.');
      return;
    }
    const trimmedPhone = form.phone.trim();
    if (trimmedPhone && !/^\d{6,12}$/.test(trimmedPhone)) {
      setPersonalError('Please enter a valid phone number (6-12 digits).');
      return;
    }

    setPersonalSaving(true);
    let finalPhotoUrl = currentPhoto;

    if (photoFile) {
      const { data: uploadData, error: uploadError } = await uploadProfileImage(user.id, photoFile);
      if (uploadError) {
        setPersonalSaving(false);
        setPersonalError('Failed to upload profile photo. Please try again.');
        console.error('Photo upload error:', uploadError);
        return;
      }
      finalPhotoUrl = uploadData.publicUrl;
    }

    const newFullName = trimmedLast ? `${trimmedFirst} ${trimmedLast}` : trimmedFirst;
    const mobile = trimmedPhone ? `${form.countryCode} ${trimmedPhone}` : '';

    const { error: updateError } = await updateProfile({
      // Keep existing keys so navbar / profile card / checkout keep working.
      fullName: newFullName,
      full_name: newFullName,
      avatar_url: finalPhotoUrl,
      mobile,
      countryCode: form.countryCode,
      firstName: trimmedFirst,
      lastName: trimmedLast,
      dateOfBirth: form.dateOfBirth || '',
    });

    setPersonalSaving(false);

    if (updateError) {
      setPersonalError(updateError.message || 'Unable to update your details. Please try again.');
      return;
    }

    // auth.updateUser() only touches user_metadata — also sync the Profiles
    // table row so the admin dashboard shows the same name/phone/avatar.
    const { error: syncError } = await syncProfileRow({
      fullName: newFullName,
      phone: mobile,
      avatarUrl: finalPhotoUrl,
      dateOfBirth: form.dateOfBirth || '',
    });
    if (syncError) console.error('Profile row sync error:', syncError);

    setForm((prev) => ({ ...prev, firstName: trimmedFirst, lastName: trimmedLast, phone: trimmedPhone }));
    setInitialForm((prev) => ({
      ...prev, firstName: trimmedFirst, lastName: trimmedLast,
      countryCode: form.countryCode, phone: trimmedPhone, dateOfBirth: form.dateOfBirth,
    }));
    setPhotoFile(null);
    setPersonalSuccess(
      syncError
        ? 'Personal information updated. (Admin profile record sync failed — please try again later.)'
        : 'Personal information updated successfully.'
    );
  };

  const handleCancelPersonal = () => {
    setForm((prev) => ({
      ...prev,
      firstName: initialForm.firstName, lastName: initialForm.lastName,
      countryCode: initialForm.countryCode, phone: initialForm.phone, dateOfBirth: initialForm.dateOfBirth,
    }));
    setPhotoFile(null);
    setPhotoPreview(currentPhoto);
    setPersonalError('');
    setPersonalSuccess('');
  };

  // ── 2. Profile Preferences (language, diet, allergies, spice) ────────────────
  const handleSavePreferences = async () => {
    setPrefError('');
    setPrefSuccess('');

    if (form.preferredLanguage === 'Others' && !form.customLanguage.trim()) {
      setPrefError('Please specify your preferred language.');
      return;
    }

    setPrefSaving(true);
    const trimmedAllergies = form.foodAllergies.trim();
    const trimmedCustomLanguage = form.preferredLanguage === 'Others' ? form.customLanguage.trim() : '';

    const { error: updateError } = await updateProfile({
      preferredLanguage: form.preferredLanguage,
      customLanguage: trimmedCustomLanguage,
      dietaryPreference: form.dietaryPreference,
      foodAllergies: trimmedAllergies,
      spicePreference: form.spicePreference,
    });

    if (updateError) {
      setPrefSaving(false);
      setPrefError(updateError.message || 'Unable to update your preferences. Please try again.');
      return;
    }

    // Also mirror onto the Profiles table row for admin visibility.
    const { error: syncError } = await syncProfileRow({
      preferredLanguage: form.preferredLanguage,
      customLanguage: trimmedCustomLanguage,
      dietaryPreference: form.dietaryPreference,
      foodAllergies: trimmedAllergies,
      spicePreference: form.spicePreference,
    });
    if (syncError) console.error('Profile row sync error:', syncError);

    setPrefSaving(false);
    setForm((prev) => ({ ...prev, foodAllergies: trimmedAllergies, customLanguage: trimmedCustomLanguage }));
    setInitialForm((prev) => ({
      ...prev,
      preferredLanguage: form.preferredLanguage, customLanguage: trimmedCustomLanguage,
      dietaryPreference: form.dietaryPreference, foodAllergies: trimmedAllergies, spicePreference: form.spicePreference,
    }));
    setPrefSuccess(
      syncError
        ? 'Profile preferences updated. (Admin profile record sync failed — please try again later.)'
        : 'Profile preferences updated successfully.'
    );
  };

  const handleCancelPreferences = () => {
    setForm((prev) => ({
      ...prev,
      preferredLanguage: initialForm.preferredLanguage, customLanguage: initialForm.customLanguage,
      dietaryPreference: initialForm.dietaryPreference, foodAllergies: initialForm.foodAllergies,
      spicePreference: initialForm.spicePreference,
    }));
    setPrefError('');
    setPrefSuccess('');
  };

  // ── 3. Communication Preferences (toggles) ────────────────────────────────────
  const handleSaveCommunication = async () => {
    setCommError('');
    setCommSuccess('');
    setCommSaving(true);

    const { error: updateError } = await updateProfile({
      promotionalOffers: form.promotionalOffers,
      newProductNotifications: form.newProductNotifications,
      emailNotifications: form.emailNotifications,
      smsNotifications: form.smsNotifications,
      whatsappNotifications: form.whatsappNotifications,
    });

    if (updateError) {
      setCommSaving(false);
      setCommError(updateError.message || 'Unable to update your communication preferences. Please try again.');
      return;
    }

    // Also mirror onto the Profiles table row for admin visibility.
    const { error: syncError } = await syncProfileRow({
      promotionalOffers: form.promotionalOffers,
      newProductNotifications: form.newProductNotifications,
      emailNotifications: form.emailNotifications,
      smsNotifications: form.smsNotifications,
      whatsappNotifications: form.whatsappNotifications,
    });
    if (syncError) console.error('Profile row sync error:', syncError);

    setCommSaving(false);
    setInitialForm((prev) => ({
      ...prev,
      promotionalOffers: form.promotionalOffers, newProductNotifications: form.newProductNotifications,
      emailNotifications: form.emailNotifications, smsNotifications: form.smsNotifications,
      whatsappNotifications: form.whatsappNotifications,
    }));
    setCommSuccess(
      syncError
        ? 'Communication preferences updated. (Admin profile record sync failed — please try again later.)'
        : 'Communication preferences updated successfully.'
    );
  };

  const handleCancelCommunication = () => {
    setForm((prev) => ({
      ...prev,
      promotionalOffers: initialForm.promotionalOffers, newProductNotifications: initialForm.newProductNotifications,
      emailNotifications: initialForm.emailNotifications, smsNotifications: initialForm.smsNotifications,
      whatsappNotifications: initialForm.whatsappNotifications,
    }));
    setCommError('');
    setCommSuccess('');
  };

  return (
    <div className="account-page-root" style={{ minHeight: '100vh', background: COLORS.pageBg, paddingTop: '64px' }}>
      <div
        id="account-layout"
        data-has-sidebar="true"
        style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '260px 1fr', minHeight: 'calc(100vh - 64px)' }}
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
            <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 600, color: COLORS.text, marginBottom: '8px', marginTop: 0 }}>
              Edit Profile
            </h1>
            <p style={{ fontFamily: SANS, fontSize: '15px', color: COLORS.textMuted, margin: '0 0 24px 0' }}>
              Manage your personal details, preferences, and account security.
            </p>

            {/* Photo error banner */}
            {photoError && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: 'rgba(178, 34, 34, 0.08)', color: COLORS.primary,
                padding: '12px 16px', borderRadius: '8px', marginBottom: '24px',
                fontFamily: SANS, fontSize: '13px',
              }}>
                <AlertCircle size={16} /> {photoError}
              </div>
            )}

            {/* Photo Section */}
            <div className="edit-profile-photo-section" style={{
              background: COLORS.cardBg, border: `1px solid ${COLORS.border}`,
              borderRadius: '12px', padding: 'clamp(16px, 4vw, 24px)', marginBottom: '24px',
            }}>
              <div style={{
                width: '80px', height: '80px', borderRadius: '50%', background: COLORS.accent,
                overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                {photoPreview ? (
                  <img src={photoPreview} alt="Profile preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '32px', fontWeight: 600, color: COLORS.textBody, fontFamily: SERIF }}>
                    {getInitial()}
                  </span>
                )}
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'transparent',
                    border: `1px solid ${COLORS.textMuted}`, color: COLORS.textMuted, padding: '8px 16px',
                    borderRadius: '24px', fontFamily: SANS, fontSize: '13px', fontWeight: 600,
                    cursor: 'pointer', marginBottom: '8px', transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(93, 64, 55, 0.04)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <Camera size={14} /> Change Photo
                </button>
                <input type="file" ref={fileInputRef} onChange={handlePhotoSelect} accept="image/jpeg, image/png, image/webp" style={{ display: 'none' }} />
                <p style={{ margin: 0, fontSize: '12px', color: COLORS.textFaint, fontFamily: SANS }}>
                  JPG, PNG, or WEBP. Max size of 5 MB
                </p>
              </div>
            </div>

            {/* Tip */}
            <div style={{ marginBottom: '24px' }}>
              <MaasTip />
            </div>

            {/* 1. Personal Information */}
            <SectionCard icon={User} title="Personal Information" description="Your basic contact details.">
              <div className="edit-profile-form-grid" style={{ marginBottom: '20px' }}>
                <div>
                  <label style={labelStyle}>First Name</label>
                  <input type="text" value={form.firstName} onChange={(e) => setField('firstName', e.target.value)} style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
                </div>
                <div>
                  <label style={labelStyle}>Last Name</label>
                  <input type="text" value={form.lastName} onChange={(e) => setField('lastName', e.target.value)} style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Email Address</label>
                <input type="email" value={currentEmail} readOnly style={readOnlyStyle} title="Email cannot be changed here." />
              </div>

              <div className="edit-profile-form-grid">
                <div>
                  <label style={labelStyle}>Phone Number</label>
                  <div className="phone-input-row" style={{ display: 'flex', gap: '8px' }}>
                    <select
                      value={form.countryCode}
                      onChange={(e) => setField('countryCode', e.target.value)}
                      style={{ ...inputStyle, appearance: 'auto', width: '110px', flexShrink: 0, padding: '12px 8px' }}
                      onFocus={focusIn}
                      onBlur={focusOut}
                      aria-label="Country code"
                    >
                      {COUNTRY_CODES.map((c) => <option key={c.code} value={c.code}>{c.label}</option>)}
                    </select>
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={form.phone}
                      onChange={(e) => setField('phone', e.target.value.replace(/\D/g, ''))}
                      placeholder="XXXXX XXXXX"
                      style={{ ...inputStyle, flex: 1, minWidth: 0 }}
                      onFocus={focusIn}
                      onBlur={focusOut}
                    />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Date of Birth <span style={{ fontWeight: 400, color: COLORS.textFaint }}>(optional)</span></label>
                  <input type="date" value={form.dateOfBirth} onChange={(e) => setField('dateOfBirth', e.target.value)} max={new Date().toISOString().split('T')[0]} style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
                </div>
              </div>

              <SectionSaveBar
                onCancel={handleCancelPersonal}
                onSave={handleSavePersonal}
                hasChanges={hasPersonalChanges}
                isSaving={personalSaving}
                error={personalError}
                success={personalSuccess}
              />
            </SectionCard>

            {/* 2. Profile Preferences */}
            <SectionCard icon={Sparkles} title="Profile Preferences" description="Help us tailor Maa's Kitchen to your taste.">
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Preferred Language</label>
                <select value={form.preferredLanguage} onChange={(e) => setField('preferredLanguage', e.target.value)} style={{ ...inputStyle, appearance: 'auto' }} onFocus={focusIn} onBlur={focusOut}>
                  {LANGUAGES.map((lang) => <option key={lang} value={lang}>{lang}</option>)}
                </select>
                {form.preferredLanguage === 'Others' && (
                  <input
                    type="text"
                    value={form.customLanguage}
                    onChange={(e) => setField('customLanguage', e.target.value)}
                    placeholder="Please specify your preferred language"
                    style={{ ...inputStyle, marginTop: '10px' }}
                    onFocus={focusIn}
                    onBlur={focusOut}
                  />
                )}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Dietary Preference</label>
                <RadioPills
                  name="dietary"
                  value={form.dietaryPreference}
                  onChange={(v) => setField('dietaryPreference', v)}
                  options={[
                    { value: 'vegetarian', label: 'Vegetarian' },
                    { value: 'non-vegetarian', label: 'Non-Vegetarian' },
                  ]}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Food Allergies <span style={{ fontWeight: 400, color: COLORS.textFaint }}>(optional)</span></label>
                <input type="text" value={form.foodAllergies} onChange={(e) => setField('foodAllergies', e.target.value)} placeholder="e.g. Peanuts, Gluten, Dairy" style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
              </div>

              <div>
                <label style={labelStyle}>Spice Preference</label>
                <RadioPills
                  name="spice"
                  value={form.spicePreference}
                  onChange={(v) => setField('spicePreference', v)}
                  options={[
                    { value: 'mild', label: 'Mild' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'spicy', label: 'Spicy' },
                  ]}
                />
              </div>

              <SectionSaveBar
                onCancel={handleCancelPreferences}
                onSave={handleSavePreferences}
                hasChanges={hasPreferenceChanges}
                isSaving={prefSaving}
                error={prefError}
                success={prefSuccess}
              />
            </SectionCard>

            {/* 3. Communication Preferences */}
            <SectionCard icon={Bell} title="Communication Preferences" description="Choose what updates you'd like to receive.">
              <ToggleSwitch label="Promotional Offers" description="Discounts, festive deals, and special offers." checked={form.promotionalOffers} onChange={(v) => setField('promotionalOffers', v)} />
              <ToggleSwitch label="New Product Notifications" description="Be the first to know when we launch something new." checked={form.newProductNotifications} onChange={(v) => setField('newProductNotifications', v)} />
              <ToggleSwitch label="Email Notifications" description="Order updates and account alerts via email." checked={form.emailNotifications} onChange={(v) => setField('emailNotifications', v)} />
              <ToggleSwitch label="SMS Notifications" description="Delivery and order updates via text message." checked={form.smsNotifications} onChange={(v) => setField('smsNotifications', v)} />
              <ToggleSwitch label="WhatsApp Notifications" description="Get updates on WhatsApp." checked={form.whatsappNotifications} onChange={(v) => setField('whatsappNotifications', v)} last />

              <SectionSaveBar
                onCancel={handleCancelCommunication}
                onSave={handleSaveCommunication}
                hasChanges={hasCommunicationChanges}
                isSaving={commSaving}
                error={commError}
                success={commSuccess}
              />
            </SectionCard>

            {/* Back to account overview */}
            <div style={{ marginBottom: '32px' }}>
              <button
                type="button"
                onClick={() => navigate('/account')}
                style={{
                  padding: '12px 24px', background: 'transparent', border: `1px solid ${COLORS.textMuted}`,
                  color: COLORS.textMuted, borderRadius: '24px', fontFamily: SANS, fontSize: '14px', fontWeight: 600,
                  cursor: 'pointer', transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(93, 64, 55, 0.04)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                Back to Account
              </button>
            </div>

            {/* 4. Security */}
            <SectionCard icon={ShieldCheck} title="Security" description="Protect your account.">
              <SecuritySection
                hasPassword={!!meta.has_password}
                updatePassword={updatePassword}
                listMfaFactors={listMfaFactors}
                enrollTotpFactor={enrollTotpFactor}
                verifyTotpFactor={verifyTotpFactor}
                unenrollFactor={unenrollFactor}
              />
            </SectionCard>

            {/* 5. Account Management */}
            <SectionCard icon={Settings2} title="Account Management" description="Manage sessions and account status.">
              <AccountManagementSection
                signOutAllDevices={signOutAllDevices}
                deleteAccount={deleteAccount}
                navigate={navigate}
              />
            </SectionCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ── Security section ──────────────────────────────────────────────────────────

function SecuritySection({ hasPassword, updatePassword, listMfaFactors, enrollTotpFactor, verifyTotpFactor, unenrollFactor }) {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');

  // "Set Password" for accounts that only use Google / one-time codes,
  // "Change Password" once a password has been configured via Supabase Auth.
  const pwLabel = hasPassword ? 'Change Password' : 'Set Password';

  const [mfaLoading, setMfaLoading] = useState(true);
  const [mfaFactor, setMfaFactor] = useState(null); // verified totp factor
  const [mfaError, setMfaError] = useState('');
  const [enrollData, setEnrollData] = useState(null); // { id, qr, secret }
  const [enrollCode, setEnrollCode] = useState('');
  const [enrollBusy, setEnrollBusy] = useState(false);

  const refreshFactors = useCallback(async () => {
    setMfaLoading(true);
    const { data, error } = await listMfaFactors();
    if (error) {
      setMfaFactor(null);
    } else {
      const list = data?.totp || data?.all || [];
      const verified = list.find((f) => f.status === 'verified');
      setMfaFactor(verified || null);
    }
    setMfaLoading(false);
  }, [listMfaFactors]);

  useEffect(() => { refreshFactors(); }, [refreshFactors]);

  const handleChangePassword = async () => {
    setPwError('');
    setPwSuccess('');
    if (newPassword.length < 8) { setPwError('Password must be at least 8 characters.'); return; }
    if (newPassword !== confirmPassword) { setPwError('Passwords do not match.'); return; }
    setPwSaving(true);
    const { error } = await updatePassword(newPassword);
    setPwSaving(false);
    if (error) { setPwError(error.message || 'Failed to update password.'); return; }
    setNewPassword('');
    setConfirmPassword('');
    setShowPasswordForm(false);
    setPwSuccess(hasPassword ? 'Password updated successfully.' : 'Password set successfully. You can now log in with your email and password.');
  };

  const handleStartEnroll = async () => {
    setMfaError('');
    setEnrollBusy(true);
    const { data, error } = await enrollTotpFactor();
    setEnrollBusy(false);
    if (error) {
      setMfaError(error.message || 'Two-factor authentication is unavailable. It may be disabled for this project.');
      return;
    }
    setEnrollData({ id: data.id, qr: data.totp?.qr_code, secret: data.totp?.secret });
  };

  const handleVerifyEnroll = async () => {
    if (!enrollData) return;
    setMfaError('');
    if (!/^\d{6}$/.test(enrollCode)) { setMfaError('Enter the 6-digit code from your authenticator app.'); return; }
    setEnrollBusy(true);
    const { error } = await verifyTotpFactor(enrollData.id, enrollCode);
    setEnrollBusy(false);
    if (error) { setMfaError(error.message || 'Invalid code. Please try again.'); return; }
    setEnrollData(null);
    setEnrollCode('');
    await refreshFactors();
  };

  const handleDisable2FA = async () => {
    if (!mfaFactor) return;
    setMfaError('');
    setEnrollBusy(true);
    const { error } = await unenrollFactor(mfaFactor.id);
    setEnrollBusy(false);
    if (error) { setMfaError(error.message || 'Failed to disable two-factor authentication.'); return; }
    await refreshFactors();
  };

  const rowStyle = {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
    flexWrap: 'wrap', padding: '14px 0',
  };
  const outlineBtn = {
    display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'transparent',
    border: `1px solid ${COLORS.textMuted}`, color: COLORS.textMuted, padding: '9px 18px',
    borderRadius: '24px', fontFamily: SANS, fontSize: '13px', fontWeight: 600, cursor: 'pointer',
  };

  return (
    <div>
      {/* Change Password */}
      <div style={{ ...rowStyle, borderBottom: `1px solid ${COLORS.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
          <KeyRound size={18} color={COLORS.textMuted} />
          <div>
            <div style={{ fontFamily: SANS, fontSize: '14px', fontWeight: 600, color: COLORS.textBody }}>{pwLabel}</div>
            <div style={{ fontFamily: SANS, fontSize: '12px', color: COLORS.textFaint }}>
              {hasPassword
                ? 'Set a new password for your account.'
                : 'Add a password so you can log in with your email address.'}
            </div>
          </div>
        </div>
        <button type="button" style={outlineBtn} onClick={() => { setShowPasswordForm((s) => !s); setPwError(''); setPwSuccess(''); }}>
          {showPasswordForm ? 'Close' : (hasPassword ? 'Change' : 'Set')}
        </button>
      </div>

      {pwSuccess && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2F8B57', fontFamily: SANS, fontSize: '13px', padding: '10px 0' }}>
          <CheckCircle2 size={15} /> {pwSuccess}
        </div>
      )}

      {showPasswordForm && (
        <div style={{ padding: '16px 0', display: 'grid', gap: '14px' }}>
          <div className="edit-profile-form-grid">
            <div>
              <label style={labelStyle}>New Password</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="At least 8 characters" style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
            </div>
            <div>
              <label style={labelStyle}>Confirm New Password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter password" style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
            </div>
          </div>
          {pwError && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: COLORS.primary, fontFamily: SANS, fontSize: '13px' }}>
              <AlertCircle size={15} /> {pwError}
            </div>
          )}
          <div>
            <button
              type="button"
              onClick={handleChangePassword}
              disabled={pwSaving}
              style={{
                padding: '10px 22px', background: pwSaving ? 'rgba(178,34,34,0.5)' : COLORS.primary, color: '#FFF',
                border: 'none', borderRadius: '24px', fontFamily: SANS, fontSize: '13px', fontWeight: 600,
                cursor: pwSaving ? 'not-allowed' : 'pointer',
              }}
            >
              {pwSaving ? 'Saving...' : pwLabel}
            </button>
          </div>
        </div>
      )}

      {/* Two-Factor Authentication */}
      <div style={{ ...rowStyle }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
          <Smartphone size={18} color={COLORS.textMuted} />
          <div>
            <div style={{ fontFamily: SANS, fontSize: '14px', fontWeight: 600, color: COLORS.textBody }}>
              Two-Factor Authentication
              {mfaFactor && (
                <span style={{ marginLeft: '8px', fontSize: '11px', fontWeight: 700, color: '#2F8B57', background: 'rgba(47,139,87,0.12)', padding: '2px 8px', borderRadius: '999px' }}>ON</span>
              )}
            </div>
            <div style={{ fontFamily: SANS, fontSize: '12px', color: COLORS.textFaint }}>
              Add an extra layer of security with an authenticator app.
            </div>
          </div>
        </div>
        {mfaLoading ? (
          <span style={{ fontFamily: SANS, fontSize: '12px', color: COLORS.textFaint }}>Loading...</span>
        ) : mfaFactor ? (
          <button type="button" style={{ ...outlineBtn, borderColor: COLORS.primary, color: COLORS.primary }} onClick={handleDisable2FA} disabled={enrollBusy}>
            {enrollBusy ? 'Working...' : 'Disable'}
          </button>
        ) : (
          <button type="button" style={outlineBtn} onClick={handleStartEnroll} disabled={enrollBusy}>
            {enrollBusy ? 'Working...' : 'Enable'}
          </button>
        )}
      </div>

      {mfaError && !enrollData && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: COLORS.primary, fontFamily: SANS, fontSize: '13px', padding: '4px 0 12px' }}>
          <AlertCircle size={15} /> {mfaError}
        </div>
      )}

      {/* Enrollment modal */}
      {enrollData && (
        <ModalOverlay onClose={() => { setEnrollData(null); setEnrollCode(''); setMfaError(''); }}>
          <h3 style={{ fontFamily: SERIF, fontSize: '20px', fontWeight: 600, color: COLORS.text, margin: '0 0 8px' }}>
            Set Up Two-Factor Authentication
          </h3>
          <p style={{ fontFamily: SANS, fontSize: '13px', color: COLORS.textFaint, margin: '0 0 16px' }}>
            Scan this QR code with an authenticator app (Google Authenticator, Authy), then enter the 6-digit code.
          </p>
          {enrollData.qr && (
            <div style={{ textAlign: 'center', marginBottom: '12px' }}>
              <img src={enrollData.qr} alt="2FA QR code" style={{ width: '180px', height: '180px' }} />
            </div>
          )}
          {enrollData.secret && (
            <p style={{ fontFamily: SANS, fontSize: '12px', color: COLORS.textFaint, textAlign: 'center', margin: '0 0 16px', wordBreak: 'break-all' }}>
              Or enter this key manually: <strong style={{ color: COLORS.textBody }}>{enrollData.secret}</strong>
            </p>
          )}
          <label style={labelStyle}>Verification Code</label>
          <input
            type="text" inputMode="numeric" maxLength={6} value={enrollCode}
            onChange={(e) => setEnrollCode(e.target.value.replace(/\D/g, ''))}
            placeholder="123456" style={{ ...inputStyle, textAlign: 'center', letterSpacing: '0.3em', fontSize: '18px' }}
            onFocus={focusIn} onBlur={focusOut}
          />
          {mfaError && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: COLORS.primary, fontFamily: SANS, fontSize: '13px', marginTop: '10px' }}>
              <AlertCircle size={15} /> {mfaError}
            </div>
          )}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px', flexWrap: 'wrap' }}>
            <button type="button" onClick={() => { setEnrollData(null); setEnrollCode(''); setMfaError(''); }} style={{ ...outlineBtn }}>Cancel</button>
            <button
              type="button" onClick={handleVerifyEnroll} disabled={enrollBusy}
              style={{ padding: '9px 22px', background: enrollBusy ? 'rgba(178,34,34,0.5)' : COLORS.primary, color: '#FFF', border: 'none', borderRadius: '24px', fontFamily: SANS, fontSize: '13px', fontWeight: 600, cursor: enrollBusy ? 'not-allowed' : 'pointer' }}
            >
              {enrollBusy ? 'Verifying...' : 'Verify & Enable'}
            </button>
          </div>
        </ModalOverlay>
      )}
    </div>
  );
}

// ── Account management section ────────────────────────────────────────────────

function AccountManagementSection({ signOutAllDevices, deleteAccount, navigate }) {
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [showDelete, setShowDelete] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const handleLogoutAll = async () => {
    setError('');
    setBusy('logout');
    const { error } = await signOutAllDevices();
    setBusy('');
    if (error) { setError(error.message || 'Failed to log out of all devices.'); return; }
    navigate('/');
  };

  const handleDelete = async () => {
    setError('');
    setBusy('delete');
    const { error } = await deleteAccount();
    setBusy('');
    if (error) { setError(error.message || 'Failed to delete account.'); return; }
    navigate('/');
  };

  const rowStyle = {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
    flexWrap: 'wrap', padding: '14px 0',
  };
  const outlineBtn = {
    display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'transparent',
    border: `1px solid ${COLORS.textMuted}`, color: COLORS.textMuted, padding: '9px 18px',
    borderRadius: '24px', fontFamily: SANS, fontSize: '13px', fontWeight: 600, cursor: 'pointer',
  };

  return (
    <div>
      {/* Logout all devices */}
      <div style={{ ...rowStyle, borderBottom: `1px solid ${COLORS.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
          <LogOut size={18} color={COLORS.textMuted} />
          <div>
            <div style={{ fontFamily: SANS, fontSize: '14px', fontWeight: 600, color: COLORS.textBody }}>Logout from All Devices</div>
            <div style={{ fontFamily: SANS, fontSize: '12px', color: COLORS.textFaint }}>End every active session, including this one.</div>
          </div>
        </div>
        <button type="button" style={outlineBtn} onClick={handleLogoutAll} disabled={busy === 'logout'}>
          {busy === 'logout' ? 'Logging out...' : 'Logout All'}
        </button>
      </div>

      {/* Delete account */}
      <div style={{ ...rowStyle }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
          <Trash2 size={18} color={COLORS.primary} />
          <div>
            <div style={{ fontFamily: SANS, fontSize: '14px', fontWeight: 600, color: COLORS.primary }}>Delete Account</div>
            <div style={{ fontFamily: SANS, fontSize: '12px', color: COLORS.textFaint }}>Permanently remove your account and data. This cannot be undone.</div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => { setShowDelete(true); setConfirmText(''); setError(''); }}
          style={{ ...outlineBtn, borderColor: COLORS.primary, color: COLORS.primary }}
        >
          Delete
        </button>
      </div>

      {error && !showDelete && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: COLORS.primary, fontFamily: SANS, fontSize: '13px', paddingTop: '8px' }}>
          <AlertCircle size={15} /> {error}
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDelete && (
        <ModalOverlay onClose={() => setShowDelete(false)}>
          <h3 style={{ fontFamily: SERIF, fontSize: '20px', fontWeight: 600, color: COLORS.primary, margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Trash2 size={20} /> Delete Account
          </h3>
          <p style={{ fontFamily: SANS, fontSize: '14px', color: COLORS.textBody, margin: '0 0 8px' }}>
            This will permanently delete your account, order history, saved addresses, and preferences. This action <strong>cannot be undone</strong>.
          </p>
          <p style={{ fontFamily: SANS, fontSize: '13px', color: COLORS.textFaint, margin: '0 0 12px' }}>
            Type <strong style={{ color: COLORS.primary }}>DELETE</strong> to confirm.
          </p>
          <input
            type="text" value={confirmText} onChange={(e) => setConfirmText(e.target.value)}
            placeholder="DELETE" style={inputStyle} onFocus={focusIn} onBlur={focusOut}
          />
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: COLORS.primary, fontFamily: SANS, fontSize: '13px', marginTop: '10px' }}>
              <AlertCircle size={15} /> {error}
            </div>
          )}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px', flexWrap: 'wrap' }}>
            <button type="button" onClick={() => setShowDelete(false)} style={outlineBtn}>Cancel</button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={confirmText !== 'DELETE' || busy === 'delete'}
              style={{
                padding: '9px 22px', background: (confirmText !== 'DELETE' || busy === 'delete') ? 'rgba(178,34,34,0.5)' : COLORS.primary,
                color: '#FFF', border: 'none', borderRadius: '24px', fontFamily: SANS, fontSize: '13px', fontWeight: 600,
                cursor: (confirmText !== 'DELETE' || busy === 'delete') ? 'not-allowed' : 'pointer',
              }}
            >
              {busy === 'delete' ? 'Deleting...' : 'Delete My Account'}
            </button>
          </div>
        </ModalOverlay>
      )}
    </div>
  );
}

// ── Modal overlay ─────────────────────────────────────────────────────────────

function ModalOverlay({ children, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(28, 16, 7, 0.5)', zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: COLORS.cardBg, borderRadius: '16px', padding: 'clamp(20px, 5vw, 32px)',
          width: '100%', maxWidth: '440px', maxHeight: '90vh', overflowY: 'auto', position: 'relative',
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
        }}
      >
        <button
          type="button" onClick={onClose} aria-label="Close"
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', cursor: 'pointer', color: COLORS.textMuted, padding: '4px' }}
        >
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  );
}
