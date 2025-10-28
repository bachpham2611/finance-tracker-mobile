import { // Firebase Firestore imports
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
import { db, auth } from '../../firebase';  // Firebase configuration import

// Add new transaction
export const addTransaction = async (transactionData) => {  // Function to add a new transaction
  try { // Try block to handle adding transaction
    const userId = auth.currentUser.uid;  // Get current user ID
    
    const docRef = await addDoc(collection(db, 'transactions'), { // Add document to 'transactions' collection
      ...transactionData,
      userId: userId,
      createdAt: new Date().toISOString() // Timestamp of creation
    });
    
    return docRef.id; // Return the new document ID
  } catch (error) { // Error handling
    throw error;  // Rethrow error for caller to handle
  }
};

// Get all user transactions
export const getTransactions = async () => {  // Function to get all transactions for current user
  try { // Try block to handle fetching transactions
    const userId = auth.currentUser.uid;  // Get current user ID
    
    const q = query(  // Create query to fetch transactions for user
      collection(db, 'transactions'), // Collection reference
      where('userId', '==', userId),  // Filter by current user ID
      orderBy('date', 'desc') // Order by date descending
    );
    
    const querySnapshot = await getDocs(q); // Execute query
    const transactions = [];  // Initialize empty array for transactions
    
    querySnapshot.forEach((doc) => {  // Iterate through query results
      transactions.push({ // Push each transaction to transactions array
        id: doc.id, // Document ID
        ...doc.data() // Document data
      });
    });
    
    return transactions;  // Return fetched transactions
  } catch (error) { // Error handling
    throw error;  // Rethrow error for caller to handle
  }
};

// Update transaction
export const updateTransaction = async (transactionId, updatedData) => {  // Function to update an existing transaction
  try { // Try block to handle updating transaction
    const transactionRef = doc(db, 'transactions', transactionId);  // Document reference
    await updateDoc(transactionRef, updatedData); // Update document with new data
  } catch (error) { // Error handling
    throw error;  // Rethrow error for caller to handle
  }
};

// Delete transaction
export const deleteTransaction = async (transactionId) => { // Function to delete a transaction
  try { // Try block to handle deletion
    await deleteDoc(doc(db, 'transactions', transactionId));  // Delete document by ID
  } catch (error) { // Error handling
    throw error;  // Rethrow error for caller to handle
  }
};

// Get statistics
export const getStatistics = async () => {  // Function to get transaction statistics
  try { // Try block to handle fetching statistics
    const transactions = await getTransactions(); // Get all user transactions
    
    let totalIncome = 0;  // Initialize total income
    let totalExpense = 0; // Initialize total expense
    const categoryExpenses = {};  // Initialize category-wise expenses
    
    transactions.forEach(transaction => { // Iterate through each transaction
      const amount = parseFloat(transaction.amount);  // Parse amount as float
      
      if (transaction.type === 'income') {  // If transaction is income
        totalIncome += amount;  // Add to total income
      } else {  // If transaction is expense
        totalExpense += amount; // Add to total expense
        
        // Group by category
        if (categoryExpenses[transaction.categoryName]) { // If category exists, accumulate amount
          categoryExpenses[transaction.categoryName] += amount; // Accumulate amount
        } else {  // If category doesn't exist, initialize amount
          categoryExpenses[transaction.categoryName] = amount;  // Initialize amount
        }
      }
    });
    
    const balance = totalIncome - totalExpense; // Calculate balance
    
    return {  // Return statistics object
      totalIncome,
      totalExpense,
      balance,
      categoryExpenses
    };
  } catch (error) { // Error handling
    throw error;  // Rethrow error for caller to handle
  }
};