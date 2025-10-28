import { collection, addDoc, query, where, orderBy, getDocs } from 'firebase/firestore';  // Firestore imports
import { db, auth } from '../../firebase';  // Firebase configuration import
import { getStatistics, getTransactions } from './transactionService';  // Service functions to get statistics and transactions

// Process chat message
export const processChatMessage = async (message) => {  // Function to process user chat message and generate response
  try { // Try block to handle message processing
    const userId = auth.currentUser?.uid; // Get current user ID
    
    if (!userId) {  // If user is not logged in
      return "Please log in to use the chatbot.";
    }
    
    const lowerMessage = message.toLowerCase(); // Convert message to lowercase for easier matching
    let response = '';  // Initialize response variable
    
    // Balance query
    if (lowerMessage.includes('balance')) { // Check if message is about balance
      try { // Try to get statistics
        const stats = await getStatistics();  // Call to service: Get user statistics
        response = `💰 Your current balance is $${stats.balance.toFixed(2)}\n\n📊 Breakdown:\n• Income: $${stats.totalIncome.toFixed(2)}\n• Expenses: $${stats.totalExpense.toFixed(2)}`; 
      } catch (error) { // Error handling
        response = "I couldn't fetch your balance. Make sure you have added some transactions first!";  // Inform user of failure
      }
    }
    // Spending query
    else if (lowerMessage.includes('spend') || lowerMessage.includes('expense')) {  // Check if message is about spending
      try { // Try to get statistics
        const stats = await getStatistics();  // Call to service: Get user statistics
        response = `💸 You have spent $${stats.totalExpense.toFixed(2)} in total.`; 
        
        if (Object.keys(stats.categoryExpenses).length > 0) { // If there are category expenses
          response += '\n\n📊 Breakdown by category:\n';
          Object.entries(stats.categoryExpenses)  // Get entries of category expenses
            .sort((a, b) => b[1] - a[1]) // Sort by amount descending
            .forEach(([category, amount]) => {  // For each category and amount
              response += `• ${category}: $${amount.toFixed(2)}\n`;
            });
        } else {  // No expenses found
          response += '\n\nYou have no expense transactions yet.';
        }
      } catch (error) { // Error handling
        response = "I couldn't fetch your spending data. Try adding some transactions first!";
      }
    }
    // Income query
    else if (lowerMessage.includes('income') || lowerMessage.includes('earn')) {  // Check if message is about income
      try { // Try to get statistics
        const stats = await getStatistics();  // Call to service: Get user statistics
        response = `💵 Your total income is $${stats.totalIncome.toFixed(2)}`;
        
        if (stats.totalIncome === 0) {  // If no income
          response += '\n\nYou have no income transactions yet. Tap the Transactions tab to add your income!';
        }
      } catch (error) { // Error handling
        response = "I couldn't fetch your income data. Try adding some transactions first!";
      }
    }
    // Recent transactions
    else if (lowerMessage.includes('recent') || lowerMessage.includes('last') || lowerMessage.includes('transaction')) {  //Check if message is about recent transactions
      try { // Try to get transactions
        const transactions = await getTransactions(); // Call to service: Get user transactions
        
        if (transactions.length === 0) {  // No transactions found
          response = "You don't have any transactions yet. Go to the Transactions tab and tap the + button to add one!";
        } else {  // Transactions found
          const recent = transactions.slice(0, 5);  // Get the 5 most recent transactions
          response = '📝 Here are your recent transactions:\n\n';
          
          recent.forEach(t => { // For each recent transaction
            const sign = t.type === 'income' ? '+' : '-'; // Determine sign based on type
            const color = t.type === 'income' ? '💚' : '❤️'; 
            response += `${color} ${sign}$${t.amount} - ${t.description}\n   ${t.categoryIcon} ${t.categoryName} (${t.date})\n\n`;
          });
        }
      } catch (error) { // Error handling
        response = "I couldn't fetch your recent transactions. Try adding some first!";
      }
    }
    // Advice
    else if (lowerMessage.includes('advice') || lowerMessage.includes('tip') || lowerMessage.includes('help')) {  //Check if message is about advice
      try { // Try to get statistics
        const stats = await getStatistics();  // Call to service: Get user statistics
        response = `💡 Here are some personalized financial tips:\n\n`; 
        
        if (stats.totalExpense > stats.totalIncome * 0.8) { // If expenses exceed 80% of income
          response += `⚠️ You're spending ${((stats.totalExpense / stats.totalIncome) * 100).toFixed(0)}% of your income. Try to keep it under 80%!\n\n`;
        }
        
        if (stats.totalIncome > 0 && stats.totalExpense > 0) {  // If there is income and expense data
          const savingsRate = ((stats.balance / stats.totalIncome) * 100).toFixed(0); // Calculate savings rate
          response += `💰 Your savings rate: ${savingsRate}%\n\n`;
        }
        
        response += `📌 General Tips:\n`;
        response += `• Track daily expenses\n`;
        response += `• Set monthly budgets\n`;
        response += `• Review spending weekly\n`;
        response += `• Save at least 20% of income\n`;
        response += `• Avoid impulse purchases\n`;
        response += `• Use the 50/30/20 rule (needs/wants/savings)`;
      } catch (error) { // Error handling
        response = `💡 Here are some financial tips:\n\n📌 Track your expenses daily\n💰 Save at least 20% of your income\n📊 Review your spending weekly\n🎯 Set financial goals\n💳 Avoid unnecessary debt`;
      }
    }
    // Greeting
    else if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('hey')) { // Check if message is a greeting
      response = "Hello! 👋 I'm your finance assistant. I can help you with:\n\n💰 Check your balance\n📊 View spending\n💵 See income\n📝 Recent transactions\n💡 Financial advice\n\nWhat would you like to know?";
    }
    // Default
    else {  // Default response for unrecognized messages
      response = "I can help you with:\n\n💰 Check your balance\n📊 View spending\n💵 See income\n📝 Recent transactions\n💡 Financial advice\n\nTry asking:\n• What's my balance?\n• How much did I spend?\n• Show recent transactions\n• Give me advice";
    }
    
    // Save to chat history (optional - comment out if causing issues)
    /*
    try {
      await addDoc(collection(db, 'chatMessages'), {
        userId: userId,
        message: message,
        response: response,
        timestamp: new Date().toISOString()
      });
    } catch (saveError) {
      console.log('Could not save chat history:', saveError);
      // Don't throw error, just continue
    }
      */
    
    return response;  
    
  } catch (error) { // General error handling
    console.error('Chatbot error:', error); // Log error to console
    return "Sorry, I encountered an error. This might be because:\n\n• You don't have any transactions yet\n• There's a connection issue\n\nTry adding some transactions first, then chat with me again! 😊";
  }
};

// Get chat history (optional)
export const getChatHistory = async () => { // Function to get chat history for current user
  try { // Try block to handle fetching chat history
    const userId = auth.currentUser?.uid; // Get current user ID
    
    if (!userId) {  // If user is not logged in
      return [];  // Return empty array
    }
    
    const q = query(  // Create query to fetch chat messages for user
      collection(db, 'chatMessages'), // Collection reference
      where('userId', '==', userId),  // Filter by current user ID
      orderBy('timestamp', 'asc') // Order by timestamp ascending
    );
    
    const querySnapshot = await getDocs(q); // Execute query
    const messages = [];  // Initialize empty array for messages
      
    querySnapshot.forEach((doc) => {  // Iterate through query results
      messages.push({ // Push each message to messages array
        id: doc.id, // Document ID
        ...doc.data() // Document data
      });
    });
    
    return messages;  // Return fetched messages
  } catch (error) { // Error handling
    console.error('Error getting chat history:', error);  // Log error to console
    return [];  // Return empty array on error
  }
};