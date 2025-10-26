import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Platform, Text } from 'react-native';
import { TextInput, Button, SegmentedButtons } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addTransaction, updateTransaction } from '../services/transactionService';
import { getCategories } from '../services/categoryService';

export default function AddTransactionScreen({ navigation, route }) {
  const editTransaction = route.params?.transaction;
  const isEditing = !!editTransaction;

  const [amount, setAmount] = useState(editTransaction?.amount?.toString() || '');
  const [description, setDescription] = useState(editTransaction?.description || '');
  const [type, setType] = useState(editTransaction?.type || 'expense');
  const [date, setDate] = useState(editTransaction ? new Date(editTransaction.date) : new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);  // Initialize as empty array
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load categories
    const loadCategories = () => {
      try {
        const allCategories = getCategories();
        setCategories(allCategories || []);  // Fallback to empty array
        
        if (editTransaction && allCategories) {
          const category = allCategories.find(c => c.name === editTransaction.categoryName);
          if (category) {
            setSelectedCategory(category);
          }
        }
      } catch (error) {
        console.error('Error loading categories:', error);
        setCategories([]);
      }
    };
    
    loadCategories();
  }, [editTransaction]);

  // Safe filter with fallback
  const filteredCategories = Array.isArray(categories) 
    ? categories.filter(c => c.type === type)
    : [];

  const handleSubmit = async () => {
    if (!amount || !description || !selectedCategory) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Amount must be greater than 0');
      return;
    }

    setLoading(true);
    try {
      const transactionData = {
        amount: parseFloat(amount),
        description: description.trim(),
        type,
        date: date.toISOString().split('T')[0],
        categoryName: selectedCategory.name,
        categoryIcon: selectedCategory.icon,
        categoryId: selectedCategory.id,
      };

      if (isEditing) {
        await updateTransaction(editTransaction.id, transactionData);
        Alert.alert('Success', 'Transaction updated!');
      } else {
        await addTransaction(transactionData);
        Alert.alert('Success', 'Transaction added!');
      }
      
      navigation.goBack();
    } catch (error) {
      console.error('Submit error:', error);
      Alert.alert('Error', error.message || 'Failed to save transaction');
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{isEditing ? 'Edit Transaction' : 'Add Transaction'}</Text>

      <SegmentedButtons
        value={type}
        onValueChange={(value) => {
          setType(value);
          setSelectedCategory(null); // Reset category when type changes
        }}
        buttons={[
          { value: 'expense', label: 'Expense' },
          { value: 'income', label: 'Income' },
        ]}
        style={styles.segmentedButtons}
      />

      <TextInput
        label="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
        mode="outlined"
        style={styles.input}
        left={<TextInput.Icon icon="currency-usd" />}
      />

      <TextInput
        label="Description"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        style={styles.input}
        left={<TextInput.Icon icon="text" />}
        placeholder="Enter description (e.g., Lunch, Taxi)"
      />

      <Button
        mode="outlined"
        onPress={() => setShowDatePicker(true)}
        style={styles.dateButton}
        icon="calendar"
      >
        {date.toLocaleDateString()}
      </Button>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      <Text style={styles.categoryTitle}>Select Category</Text>
      
      {filteredCategories.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
          {filteredCategories.map((category) => (
            <Button
              key={category.id}
              mode={selectedCategory?.id === category.id ? 'contained' : 'outlined'}
              onPress={() => setSelectedCategory(category)}
              style={styles.categoryButton}
              contentStyle={styles.categoryButtonContent}
            >
              {category.icon} {category.name}
            </Button>
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.noCategories}>No categories available for {type}</Text>
      )}

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={loading}
        disabled={loading}
        style={styles.submitButton}
      >
        {isEditing ? 'Update Transaction' : 'Add Transaction'}
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  segmentedButtons: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
  },
  dateButton: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  categoriesScroll: {
    marginBottom: 20,
    maxHeight: 120,
  },
  categoryButton: {
    marginRight: 10,
    marginBottom: 10,
  },
  categoryButtonContent: {
    paddingHorizontal: 10,
  },
  submitButton: {
    marginTop: 10,
    marginBottom: 30,
    paddingVertical: 8,
    backgroundColor: '#667eea',
  },
  noCategories: {
    textAlign: 'center',
    color: '#999',
    marginBottom: 20,
    padding: 20,
  },
});