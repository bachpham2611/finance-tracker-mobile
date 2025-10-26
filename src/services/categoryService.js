const defaultCategories = [
  { id: '1', name: 'Food & Dining', type: 'expense', icon: '🍔', color: '#ef4444' },
  { id: '2', name: 'Transportation', type: 'expense', icon: '🚗', color: '#f59e0b' },
  { id: '3', name: 'Entertainment', type: 'expense', icon: '🎬', color: '#8b5cf6' },
  { id: '4', name: 'Shopping', type: 'expense', icon: '🛍️', color: '#ec4899' },
  { id: '5', name: 'Bills', type: 'expense', icon: '📄', color: '#6b7280' },
  { id: '6', name: 'Health', type: 'expense', icon: '⚕️', color: '#10b981' },
  { id: '7', name: 'Salary', type: 'income', icon: '💼', color: '#10b981' },
  { id: '8', name: 'Freelance', type: 'income', icon: '💻', color: '#3b82f6' },
  { id: '9', name: 'Investment', type: 'income', icon: '📈', color: '#059669' },
];

export const getCategories = () => {
  return defaultCategories;
};

export const getCategoriesByType = (type) => {
  return defaultCategories.filter(cat => cat.type === type);
};