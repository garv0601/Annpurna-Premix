import { contactModel } from '../models/contactModel.js';

export const submitContact = (req, res, next) => {
  try {
    const { name, email, subject, message, phone } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    const newContact = contactModel.create({ name, email, subject, message, phone });
    res.status(201).json({ success: true, data: newContact });
  } catch (error) {
    next(error);
  }
};
