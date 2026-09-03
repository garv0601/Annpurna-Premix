import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function AddressForm({ initialData, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pinCode: '',
    mobileNumber: '',
    type: 'HOME',
    isDefault: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        addressLine2: initialData.addressLine2 || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error on type
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Address Line 1 is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    
    // PIN Validation
    const pinRegex = /^[1-9][0-9]{5}$/;
    if (!formData.pinCode.trim()) {
      newErrors.pinCode = 'PIN Code is required';
    } else if (!pinRegex.test(formData.pinCode)) {
      newErrors.pinCode = 'Please enter a valid 6-digit PIN code.';
    }

    // Mobile Validation
    // Simple check: allows +, spaces, hyphens, min 10 digits
    const mobileRaw = formData.mobileNumber.replace(/[\s-]/g, '');
    const mobileRegex = /^(\+91)?[6-9]\d{9}$/;
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile Number is required';
    } else if (!mobileRegex.test(mobileRaw)) {
      newErrors.mobileNumber = 'Please enter a valid Indian mobile number.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      await onSave(formData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1.5px solid rgba(93, 64, 55, 0.2)',
    boxSizing: 'border-box',
    fontFamily: "'Be Vietnam Pro', sans-serif",
    fontSize: '14px',
    color: '#1C1007',
    background: '#FFF',
    transition: 'border-color 0.2s',
    outline: 'none'
  };

  const labelStyle = {
    display: 'block',
    fontFamily: "'Be Vietnam Pro', sans-serif",
    fontSize: '13px',
    fontWeight: 600,
    color: '#3D2B1F',
    marginBottom: '6px'
  };

  const errorStyle = {
    fontFamily: "'Be Vietnam Pro', sans-serif",
    fontSize: '12px',
    color: '#B22222',
    marginTop: '4px'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{
        background: '#FFF',
        borderRadius: '16px',
        padding: 'clamp(16px, 4vw, 32px)',
        width: '100%',
        maxWidth: '600px',
        margin: '0 auto',
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        boxSizing: 'border-box'
      }}
    >
      <h2 style={{
        fontFamily: "'Literata', Georgia, serif",
        fontSize: '24px',
        fontWeight: 600,
        color: '#1C1007',
        margin: '0 0 24px 0'
      }}>
        {initialData ? 'Edit Address' : 'Add New Address'}
      </h2>

      <form onSubmit={handleSubmit} className="address-form-grid">
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            style={{ ...inputStyle, borderColor: errors.fullName ? '#B22222' : 'rgba(93, 64, 55, 0.2)' }}
            placeholder="E.g. Priya Sharma"
          />
          {errors.fullName && <div style={errorStyle}>{errors.fullName}</div>}
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Address Line 1</label>
          <input
            type="text"
            name="addressLine1"
            value={formData.addressLine1}
            onChange={handleChange}
            style={{ ...inputStyle, borderColor: errors.addressLine1 ? '#B22222' : 'rgba(93, 64, 55, 0.2)' }}
            placeholder="House/Flat No., Building Name, Street"
          />
          {errors.addressLine1 && <div style={errorStyle}>{errors.addressLine1}</div>}
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Address Line 2 (Optional)</label>
          <input
            type="text"
            name="addressLine2"
            value={formData.addressLine2}
            onChange={handleChange}
            style={inputStyle}
            placeholder="Landmark, Area, etc."
          />
        </div>

        <div>
          <label style={labelStyle}>City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            style={{ ...inputStyle, borderColor: errors.city ? '#B22222' : 'rgba(93, 64, 55, 0.2)' }}
          />
          {errors.city && <div style={errorStyle}>{errors.city}</div>}
        </div>

        <div>
          <label style={labelStyle}>State</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            style={{ ...inputStyle, borderColor: errors.state ? '#B22222' : 'rgba(93, 64, 55, 0.2)' }}
          />
          {errors.state && <div style={errorStyle}>{errors.state}</div>}
        </div>

        <div>
          <label style={labelStyle}>PIN Code</label>
          <input
            type="text"
            name="pinCode"
            value={formData.pinCode}
            onChange={handleChange}
            style={{ ...inputStyle, borderColor: errors.pinCode ? '#B22222' : 'rgba(93, 64, 55, 0.2)' }}
            maxLength="6"
          />
          {errors.pinCode && <div style={errorStyle}>{errors.pinCode}</div>}
        </div>

        <div>
          <label style={labelStyle}>Mobile Number</label>
          <input
            type="text"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            style={{ ...inputStyle, borderColor: errors.mobileNumber ? '#B22222' : 'rgba(93, 64, 55, 0.2)' }}
            placeholder="+91 "
          />
          {errors.mobileNumber && <div style={errorStyle}>{errors.mobileNumber}</div>}
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Address Type</label>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {['HOME', 'OFFICE', 'OTHER'].map(type => (
              <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="type"
                  value={type}
                  checked={formData.type === type}
                  onChange={handleChange}
                  style={{ accentColor: '#B22222', width: '16px', height: '16px' }}
                />
                <span style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '14px', color: '#1C1007' }}>
                  {type.charAt(0) + type.slice(1).toLowerCase()}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div style={{ gridColumn: '1 / -1', marginTop: '8px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleChange}
              style={{ accentColor: '#B22222', width: '18px', height: '18px' }}
            />
            <span style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1C1007' }}>
              Set as Default
            </span>
          </label>
        </div>

        <div className="edit-profile-buttons" style={{ gridColumn: '1 / -1', marginTop: '16px' }}>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            style={{
              padding: '12px 24px',
              borderRadius: '24px',
              border: '1.5px solid rgba(93, 64, 55, 0.2)',
              background: 'transparent',
              color: '#5D4037',
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontSize: '14px',
              fontWeight: 600,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.background = 'rgba(93, 64, 55, 0.05)')}
            onMouseLeave={(e) => !isSubmitting && (e.currentTarget.style.background = 'transparent')}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: '12px 24px',
              borderRadius: '24px',
              border: 'none',
              background: '#B22222',
              color: '#FFF',
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontSize: '14px',
              fontWeight: 600,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
              opacity: isSubmitting ? 0.7 : 1
            }}
            onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.background = '#8B1A1A')}
            onMouseLeave={(e) => !isSubmitting && (e.currentTarget.style.background = '#B22222')}
          >
            {isSubmitting ? 'Saving...' : 'Save Address'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
