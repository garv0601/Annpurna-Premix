import { supabaseAdmin, verifyUser } from '../config/supabase.js';

function extractBearerToken(req) {
  const auth = req.headers.authorization;
  return auth?.startsWith('Bearer ') ? auth.slice(7) : null;
}

export async function requireAdmin(req, res, next) {
  const token = extractBearerToken(req);
  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorised' });
  }

  try {
    const user = await verifyUser(token);
    const { data: admin, error } = await supabaseAdmin
      .from('admin_users')
      .select('id')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .maybeSingle();

    if (error) throw error;
    if (!admin) {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    req.admin = { id: admin.id, userId: user.id };
    next();
  } catch (error) {
    if (error.message === 'Invalid or expired authentication token') {
      return res.status(401).json({ success: false, message: 'Invalid or expired authentication token' });
    }
    next(error);
  }
}