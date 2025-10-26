import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  getDocs 
} from 'firebase/firestore';
import { db, auth } from '../../firebase';

// Add new transaction
export const addTransaction = async (transactionData) => {
  try {
    const userId = auth.currentUser.uid;
    
    const docRef = await addDoc(collection(db, 'transactions'), {
      ...transactionData,
      userId: userId,
      createdAt: new Date().toISOString()
    });
    
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

// Get all user transactions
export const getTransactions = async () => {
  try {
    const userId = auth.currentUser.uid;
    
    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const transactions = [];
    
    querySnapshot.forEach((doc) => {
      transactions.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return transactions;
  } catch (error) {
    throw error;
  }
};

// Update transaction
export const updateTransaction = async (transactionId, updatedData) => {
  try {
    const transactionRef = doc(db, 'transactions', transactionId);
    await updateDoc(transactionRef, updatedData);
  } catch (error) {
    throw error;
  }
};

// Delete transaction
export const deleteTransaction = async (transactionId) => {
  try {
    await deleteDoc(doc(db, 'transactions', transactionId));
  } catch (error) {
    throw error;
  }
};

// Get statistics
export const getStatistics = async () => {
  try {
    const transactions = await getTransactions();
    
    let totalIncome = 0;
    let totalExpense = 0;
    const categoryExpenses = {};
    
    transactions.forEach(transaction => {
      const amount = parseFloat(transaction.amount);
      
      if (transaction.type === 'income') {
        totalIncome += amount;
      } else {
        totalExpense += amount;
        
        // Group by category
        if (categoryExpenses[transaction.categoryName]) {
          categoryExpenses[transaction.categoryName] += amount;
        } else {
          categoryExpenses[transaction.categoryName] = amount;
        }
      }
    });
    
    const balance = totalIncome - totalExpense;
    
    return {
      totalIncome,
      totalExpense,
      balance,
      categoryExpenses
    };
  } catch (error) {
    throw error;
  }
};