import { collection, addDoc, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { getStatistics, getTransactions } from './transactionService';

// Process chat message
export const processChatMessage = async (message) => {
  try {
    const userId = auth.currentUser?.uid;
    
    if (!userId) {
      return "Please log in to use the chatbot.";
    }
    
    const lowerMessage = message.toLowerCase();
    let response = '';
    
    // Balance query
    if (lowerMessage.includes('balance')) {
      try {
        const stats = await getStatistics();
        response = `💰 Your current balance is $${stats.balance.toFixed(2)}\n\n📊 Breakdown:\n• Income: $${stats.totalIncome.toFixed(2)}\n• Expenses: $${stats.totalExpense.toFixed(2)}`;
      } catch (error) {
        response = "I couldn't fetch your balance. Make sure you have added some transactions first!";
      }
    }
    // Spending query
    else if (lowerMessage.includes('spend') || lowerMessage.includes('expense')) {
      try {
        const stats = await getStatistics();
        response = `💸 You have spent $${stats.totalExpense.toFixed(2)} in total.`;
        
        if (Object.keys(stats.categoryExpenses).length > 0) {
          response += '\n\n📊 Breakdown by category:\n';
          Object.entries(stats.categoryExpenses)
            .sort((a, b) => b[1] - a[1]) // Sort by amount descending
            .forEach(([category, amount]) => {
              response += `• ${category}: $${amount.toFixed(2)}\n`;
            });
        } else {
          response += '\n\nYou have no expense transactions yet.';
        }
      } catch (error) {
        response = "I couldn't fetch your spending data. Try adding some transactions first!";
      }
    }
    // Income query
    else if (lowerMessage.includes('income') || lowerMessage.includes('earn')) {
      try {
        const stats = await getStatistics();
        response = `💵 Your total income is $${stats.totalIncome.toFixed(2)}`;
        
        if (stats.totalIncome === 0) {
          response += '\n\nYou have no income transactions yet. Tap the Transactions tab to add your income!';
        }
      } catch (error) {
        response = "I couldn't fetch your income data. Try adding some transactions first!";
      }
    }
    // Recent transactions
    else if (lowerMessage.includes('recent') || lowerMessage.includes('last') || lowerMessage.includes('transaction')) {
      try {
        const transactions = await getTransactions();
        
        if (transactions.length === 0) {
          response = "You don't have any transactions yet. Go to the Transactions tab and tap the + button to add one!";
        } else {
          const recent = transactions.slice(0, 5);
          response = '📝 Here are your recent transactions:\n\n';
          
          recent.forEach(t => {
            const sign = t.type === 'income' ? '+' : '-';
            const color = t.type === 'income' ? '💚' : '❤️';
            response += `${color} ${sign}$${t.amount} - ${t.description}\n   ${t.categoryIcon} ${t.categoryName} (${t.date})\n\n`;
          });
        }
      } catch (error) {
        response = "I couldn't fetch your recent transactions. Try adding some first!";
      }
    }
    // Advice
    else if (lowerMessage.includes('advice') || lowerMessage.includes('tip') || lowerMessage.includes('help')) {
      try {
        const stats = await getStatistics();
        response = `💡 Here are some personalized financial tips:\n\n`;
        
        if (stats.totalExpense > stats.totalIncome * 0.8) {
          response += `⚠️ You're spending ${((stats.totalExpense / stats.totalIncome) * 100).toFixed(0)}% of your income. Try to keep it under 80%!\n\n`;
        }
        
        if (stats.totalIncome > 0 && stats.totalExpense > 0) {
          const savingsRate = ((stats.balance / stats.totalIncome) * 100).toFixed(0);
          response += `💰 Your savings rate: ${savingsRate}%\n\n`;
        }
        
        response += `📌 General Tips:\n`;
        response += `• Track daily expenses\n`;
        response += `• Set monthly budgets\n`;
        response += `• Review spending weekly\n`;
        response += `• Save at least 20% of income\n`;
        response += `• Avoid impulse purchases\n`;
        response += `• Use the 50/30/20 rule (needs/wants/savings)`;
      } catch (error) {
        response = `💡 Here are some financial tips:\n\n📌 Track your expenses daily\n💰 Save at least 20% of your income\n📊 Review your spending weekly\n🎯 Set financial goals\n💳 Avoid unnecessary debt`;
      }
    }
    // Greeting
    else if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('hey')) {
      response = "Hello! 👋 I'm your finance assistant. I can help you with:\n\n💰 Check your balance\n📊 View spending\n💵 See income\n📝 Recent transactions\n💡 Financial advice\n\nWhat would you like to know?";
    }
    // Default
    else {
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
    
  } catch (error) {
    console.error('Chatbot error:', error);
    return "Sorry, I encountered an error. This might be because:\n\n• You don't have any transactions yet\n• There's a connection issue\n\nTry adding some transactions first, then chat with me again! 😊";
  }
};

// Get chat history (optional)
export const getChatHistory = async () => {
  try {
    const userId = auth.currentUser?.uid;
    
    if (!userId) {
      return [];
    }
    
    const q = query(
      collection(db, 'chatMessages'),
      where('userId', '==', userId),
      orderBy('timestamp', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    const messages = [];
    
    querySnapshot.forEach((doc) => {
      messages.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return messages;
  } catch (error) {
    console.error('Error getting chat history:', error);
    return [];
  }
};