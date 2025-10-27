import React, { useState, useEffect } from 'react'; //useState and useEffect hooks
import { View, StyleSheet, FlatList, Alert, Text } from 'react-native'; // View, StyleSheet, FlatList, Alert, Text components 
import { FAB, Card, IconButton, ActivityIndicator } from 'react-native-paper';  // FAB: Floating Action Button; Card: For displaying transaction details; IconButton: For edit/delete icons; ActivityIndicator: For loading spinner
import { getTransactions, deleteTransaction } from '../services/transactionService';  // Service functions to get and delete transactions

export default function TransactionsScreen({ navigation }) {  // Main component for Transactions Screen
  const [transactions, setTransactions] = useState([]); // State to hold the list of transactions
  const [loading, setLoading] = useState(true); // State to manage loading indicator

  const loadTransactions = async () => {  // Function to load transactions from the service
    try { // Try to fetch transactions
      const data = await getTransactions(); // Call to service: Get transactions
      setTransactions(data);  // Update state with fetched transactions
    } catch (error) { // Error handling: Show alert if fetching fails
      Alert.alert('Error', 'Failed to load transactions');  // Show error alert
    } finally {
      setLoading(false);  // Reset loading state after attempt
    }
  };

  useEffect(() => { // useEffect hook to load transactions on component mount and when screen is focused
    const unsubscribe = navigation.addListener('focus', () => { // Listener for screen focus
      loadTransactions(); // Load transactions when screen is focused
    });
    return unsubscribe; // Cleanup the listener on unmount
  }, [navigation]);  // Dependency array with navigation

  const handleDelete = (id) => {  // Function to handle transaction deletion
    Alert.alert(  // Confirmation alert before deletion
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        { text: 'Cancel', style: 'cancel' },  // Cancel button
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {  // On confirm, delete the transaction
            try { // Try to delete transaction
              await deleteTransaction(id);  // Call to service: Delete transaction by id
              loadTransactions(); // Reload transactions after deletion
            } catch (error) { // Error handling: Show alert if deletion fails
              Alert.alert('Error', 'Failed to delete transaction'); // Show error alert
            }
          },
        },
      ]
    );
  };

  const renderTransaction = ({ item }) => ( // Function to render each transaction item
    <Card style={styles.card}>  
      <Card.Content>
        <View style={styles.transactionHeader}> {/* Transaction header container */}
          <View style={styles.transactionInfo}> {/* Transaction info container */}
            <Text style={styles.description}>{item.description}</Text>  {/* Transaction description */}
            <Text style={styles.category}>  {/* Transaction category with icon */}
              {item.categoryIcon} {item.categoryName}  {/* Display category icon and name */}
            </Text>
            <Text style={styles.date}>{item.date}</Text>  {/* Transaction date */}
          </View>
          <View style={styles.transactionActions}>  {/* Transaction actions container */}
            {/* Display transaction amount */}
            <Text 
              style={[  
                styles.amount,
                item.type === 'income' ? styles.incomeAmount : styles.expenseAmount
              ]}
            >
              {item.type === 'income' ? '+' : '-'}${item.amount}
            </Text>
            <View style={styles.actionButtons}>
              <IconButton
                icon="pencil"
                size={20}
                onPress={() => navigation.navigate('AddTransaction', { transaction: item })}
              />
              <IconButton
                icon="delete"
                size={20}
                onPress={() => handleDelete(item.id)}
              />
            </View>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  if (loading) {  // Show loading indicator while transactions are being loaded
    return (  // Loading state return
      //
      <View style={styles.loadingContainer}>  
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {transactions.length === 0 ? (  // Show empty state if no transactions are available
        <View style={styles.emptyContainer}>  
          <Text style={styles.emptyText}>No transactions yet</Text> 
          <Text style={styles.emptySubtext}>Tap the + button to add your first transaction</Text>
        </View>
      ) : (
        <FlatList
          data={transactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
      
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddTransaction')}
      />
    </View>
  );
}
// Style definitions for TransactionsScreen component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 15,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 10,
    elevation: 2,
    backgroundColor: '#fff',
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  transactionInfo: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  category: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  transactionActions: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  incomeAmount: {
    color: '#10b981',
  },
  expenseAmount: {
    color: '#ef4444',
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 5,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#667eea',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});