import { initialMockPaymentMethods, initialMockUPI } from '../data/mockPaymentMethods';

const STORAGE_KEY_PM = 'aether_payment_methods';
const STORAGE_KEY_UPI = 'aether_upi_methods';

const loadData = (key, fallback) => {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  } catch {
    return fallback;
  }
};

const saveData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save data', err);
  }
};

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const getPaymentMethods = async (userId) => {
  await delay();
  const allCards = loadData(STORAGE_KEY_PM, initialMockPaymentMethods);
  const allUpi = loadData(STORAGE_KEY_UPI, initialMockUPI);

  // Filter for user or map mock-user
  const userCards = allCards.filter(a => a.userId === userId || a.userId === 'mock-user').map(a => ({ ...a, userId }));
  if (allCards.some(a => a.userId === 'mock-user')) {
    saveData(STORAGE_KEY_PM, [...allCards.filter(a => a.userId !== 'mock-user'), ...userCards]);
  }

  const userUpi = allUpi.filter(a => a.userId === userId || a.userId === 'mock-user').map(a => ({ ...a, userId }));
  if (allUpi.some(a => a.userId === 'mock-user')) {
    saveData(STORAGE_KEY_UPI, [...allUpi.filter(a => a.userId !== 'mock-user'), ...userUpi]);
  }

  return {
    cards: userCards,
    upis: userUpi
  };
};

export const deletePaymentMethod = async (userId, methodId, type = 'card') => {
  await delay(600);
  const key = type === 'card' ? STORAGE_KEY_PM : STORAGE_KEY_UPI;
  let allMethods = loadData(key, type === 'card' ? initialMockPaymentMethods : initialMockUPI);
  
  const methodToDelete = allMethods.find(m => m.id === methodId && m.userId === userId);
  if (!methodToDelete) throw new Error("Payment method not found");

  allMethods = allMethods.filter(m => m.id !== methodId);

  // Reassign default if needed
  if (methodToDelete.isDefault) {
    const remaining = allMethods.filter(m => m.userId === userId);
    if (remaining.length > 0) {
      remaining[0].isDefault = true;
    }
  }

  saveData(key, allMethods);
  return true;
};

export const setDefaultPaymentMethod = async (userId, methodId, type = 'card') => {
  await delay(400);
  const key = type === 'card' ? STORAGE_KEY_PM : STORAGE_KEY_UPI;
  const allMethods = loadData(key, type === 'card' ? initialMockPaymentMethods : initialMockUPI);
  let found = false;

  allMethods.forEach(m => {
    if (m.userId === userId) {
      if (m.id === methodId) {
        m.isDefault = true;
        found = true;
      } else {
        m.isDefault = false;
      }
    }
  });

  if (!found) throw new Error("Payment method not found");
  
  saveData(key, allMethods);
  return true;
};
