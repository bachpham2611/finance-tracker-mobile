import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Card, ActivityIndicator } from 'react-native-paper';
import { Text } from 'react-native';
import { getStatistics } from '../services/transactionService';

export default function DashboardScreen() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = async () => {
    try {
      const data = await getStatistics();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadStats();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
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