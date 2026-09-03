import supabase from '../lib/supabase';

// Map database column names to frontend camelCase expectations
const mapAddressToFrontend = (dbAddr) => {
  if (!dbAddr) return null;
  return {
    id: dbAddr.id,
    userId: dbAddr.customer_id,
    label: dbAddr.label || 'HOME',
    type: dbAddr.label || 'HOME', // fallback for old UI
    fullName: dbAddr.full_name || '',
    phone: dbAddr.phone || '',
    mobileNumber: dbAddr.phone || '', // fallback for old UI
    addressLine1: dbAddr.address_line_1 || '',
    addressLine2: dbAddr.address_line_2 || '',
    city: dbAddr.city || '',
    state: dbAddr.state || '',
    postalCode: dbAddr.postal_code || '',
    pinCode: dbAddr.postal_code || '', // fallback for old UI
    isDefault: dbAddr.is_default || false,
    createdAt: dbAddr.created_at,
    updatedAt: dbAddr.updated_at,
  };
};

export const getAddresses = async (userId) => {
  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('customer_id', userId)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching addresses:', error);
    throw error;
  }
  return data.map(mapAddressToFrontend);
};

export const addAddress = async (userId, addressData) => {
  // Check if it's the first address to make it default automatically if needed
  // Alternatively, just trust the isDefault passed from the form
  const { data: existing } = await supabase
    .from('addresses')
    .select('id')
    .eq('customer_id', userId)
    .limit(1);

  const isFirst = !existing || existing.length === 0;
  const isDefault = isFirst ? true : !!addressData.isDefault;

  // If this one is set to default, we must unset others
  if (isDefault && !isFirst) {
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('customer_id', userId)
      .eq('is_default', true);
  }

  const { data, error } = await supabase
    .from('addresses')
    .insert({
      customer_id: userId,
      label: addressData.type || addressData.label || 'HOME',
      full_name: addressData.fullName,
      phone: addressData.mobileNumber || addressData.phone,
      address_line_1: addressData.addressLine1,
      address_line_2: addressData.addressLine2,
      city: addressData.city,
      state: addressData.state,
      postal_code: addressData.pinCode || addressData.postalCode,
      is_default: isDefault
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding address:', error);
    throw error;
  }
  
  if (!data) throw new Error("Address was not saved");
  
  return mapAddressToFrontend(data);
};

export const updateAddress = async (userId, addressId, addressData) => {
  if (addressData.isDefault) {
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('customer_id', userId)
      .eq('is_default', true);
  }

  const { data, error } = await supabase
    .from('addresses')
    .update({
      label: addressData.type || addressData.label,
      full_name: addressData.fullName,
      phone: addressData.mobileNumber || addressData.phone,
      address_line_1: addressData.addressLine1,
      address_line_2: addressData.addressLine2,
      city: addressData.city,
      state: addressData.state,
      postal_code: addressData.pinCode || addressData.postalCode,
      is_default: addressData.isDefault
    })
    .eq('id', addressId)
    .eq('customer_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating address:', error);
    throw error;
  }
  
  return mapAddressToFrontend(data);
};

export const deleteAddress = async (userId, addressId) => {
  // Get the address to see if it was default
  const { data: addressToDelete } = await supabase
    .from('addresses')
    .select('is_default')
    .eq('id', addressId)
    .eq('customer_id', userId)
    .single();

  const { error } = await supabase
    .from('addresses')
    .delete()
    .eq('id', addressId)
    .eq('customer_id', userId);

  if (error) {
    console.error('Error deleting address:', error);
    throw error;
  }

  // If we deleted the default, set a new default
  if (addressToDelete?.is_default) {
    const { data: remaining } = await supabase
      .from('addresses')
      .select('id')
      .eq('customer_id', userId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (remaining && remaining.length > 0) {
      await setDefaultAddress(userId, remaining[0].id);
    }
  }

  return true;
};

export const setDefaultAddress = async (userId, addressId) => {
  // Unset previous defaults
  await supabase
    .from('addresses')
    .update({ is_default: false })
    .eq('customer_id', userId)
    .eq('is_default', true);

  // Set new default
  const { error } = await supabase
    .from('addresses')
    .update({ is_default: true })
    .eq('id', addressId)
    .eq('customer_id', userId);

  if (error) {
    console.error('Error setting default address:', error);
    throw error;
  }
  return true;
};
