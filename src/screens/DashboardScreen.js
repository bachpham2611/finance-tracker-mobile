import React, { useState, useEffect } from 'react'; //useState, useEffect: React hooks for state management and side effects
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';  // View: Container for layout; StyleSheet: For styling components; ScrollView: For scrollable content; RefreshControl: For pull-to-refresh functionality.
import { Card, ActivityIndicator } from 'react-native-paper'; // Card: For displaying information in card format; ActivityIndicator: For showing loading spinner.
import { Text } from 'react-native';  // Text: To display text elements.
import { getStatistics } from '../services/transactionService'; // getStatistics: Function to fetch dashboard statistics from transaction service.

export default function DashboardScreen() { // export default function, define the main component
  const [stats, setStats] = useState(null); // stats state to store fetched statistics data
  const [loading, setLoading] = useState(true); // 'loading' is true initially, controls the display of the full-screen spinner
  const [refreshing, setRefreshing] = useState(false);  // 'refreshing' controls the native RefreshControl spinner during a pull-to-refresh action

  const loadStats = async () => { // Function to load statistics data
    try { 
      const data = await getStatistics(); // Call to service: Fetch the pre-calculated financial statistics
      setStats(data); // Update state with fetched data
    } catch (error) { // Error handling: Log the error if data fetching fails
      console.error('Error loading stats:', error);
    } finally { // Final block to ensure loading states are reset
      setLoading(false); // Turn off the initial full-screen loader
      setRefreshing(false); // Turn off the pull-to-refresh loader
    }
  };

  useEffect(() => { // useEffect hook to load stats on component mount
    loadStats();  // Load stats on component mount
  }, []);

  const onRefresh = () => { // Function to handle pull-to-refresh action
    setRefreshing(true);  // Set refreshing state to true to show RefreshControl spinner
    loadStats();  // Reload stats data
  };

  if (loading) {  // Show full-screen loading indicator while data is being fetched initially
    return (  // Return loading view
      <View style={styles.loadingContainer}>  
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (  // Main return for DashboardScreen component
    // ScrollView: Allows the dashboard to scroll if the content is too long
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.header}>Dashboard Overview</Text>

      {/* Stats Cards */}
      <View style={styles.statsGrid}>
        <Card style={[styles.statCard, styles.incomeCard]}>
          <Card.Content>
            <Text style={styles.statLabel}>Total Income</Text>
            <Text style={styles.incomeValue}>
              ${stats?.totalIncome.toFixed(2) || '0.00'}
            </Text>
          </Card.Content>
        </Card>

        <Card style={[styles.statCard, styles.expenseCard]}>
          <Card.Content>
            <Text style={styles.statLabel}>Total Expenses</Text>
            <Text style={styles.expenseValue}>
              ${stats?.totalExpense.toFixed(2) || '0.00'}
            </Text>
          </Card.Content>
        </Card>

        <Card style={[styles.statCard, styles.balanceCard]}>
          <Card.Content>
            <Text style={styles.statLabel}>Balance</Text>
            <Text style={styles.balanceValue}>
              ${stats?.balance.toFixed(2) || '0.00'}
            </Text>
          </Card.Content>
        </Card>
      </View>

      {/* Category Expenses */}
      <Card style={styles.categoryCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Expenses by Category</Text>
          
          {stats && Object.keys(stats.categoryExpenses).length > 0 ? (
            Object.entries(stats.categoryExpenses).map(([category, amount], index) => (
              <View key={index} style={styles.categoryItem}>
                <Text>{category}</Text>
                <Text style={styles.categoryAmount}>
                  ${amount.toFixed(2)}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.noData}>No expenses yet</Text>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

// Style definitions for DashboardScreen component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    marginTop: 10,
  },
  statsGrid: {
    marginBottom: 20,
  },
  statCard: {
    marginBottom: 15,
    elevation: 4,
  },
  incomeCard: {
    backgroundColor: '#d1fae5',
  },
  expenseCard: {
    backgroundColor: '#fee2e2',
  },
  balanceCard: {
    backgroundColor: '#dbeafe',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  incomeValue: {
    color: '#10b981',
    fontSize: 32,
  },
  expenseValue: {
    color: '#ef4444',
    fontSize: 32,
  },
  balanceValue: {
    color: '#3b82f6',
    fontSize: 32,
  },
  categoryCard: {
    marginBottom: 20,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 15,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryAmount: {
    fontWeight: 'bold',
  },
  noData: {
    textAlign: 'center',
    color: '#999',
    paddingVertical: 20,
  },
});