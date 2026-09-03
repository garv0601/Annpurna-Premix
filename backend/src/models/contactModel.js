let contactsStore = [];

export const contactModel = {
  create: (data) => {
    const newContact = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      subject: data.subject,
      message: data.message,
      status: 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    contactsStore.push(newContact);
    // Note: In production, this would be saved to MongoDB collections
    return newContact;
  }
};
