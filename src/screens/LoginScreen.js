import React, { useState } from 'react';  // useState: Used to manage the local state of the component (email, password, loading status).
import { View, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native'; // View: Container for layout; StyleSheet: For styling components; KeyboardAvoidingView: To adjust UI when keyboard appears; Platform: To handle platform-specific code; Alert: To show alert dialogs.
import { TextInput, Button } from 'react-native-paper'; // TextInput: For user input fields; Button: For clickable buttons.
import { Text } from 'react-native';  // Text: To display text elements.
import { loginUser } from '../services/authService';  // loginUser: Function to handle user login via authentication service.

export default function LoginScreen({ navigation }) { // export default function, define the main component, accepting 'navigation' prop to handle screen transitions
  const [email, setEmail] = useState('');  // email state to store user input for email
  const [password, setPassword] = useState(''); // password state to store user input for password
  const [loading, setLoading] = useState(false);  // loading state to indicate whether a login request is in progress

  const handleLogin = async () => { // Function to handle login button press
    if (!email || !password) {  
      Alert.alert('Error', 'Please fill in all fields');  
      return;
    }

    setLoading(true);
    try {
      await loginUser(email, password);
      // Navigation handled by auth state listener in App.js
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Application title */}
      <View style={styles.content}>
        <Text style={styles.title}>💰 Finance Tracker</Text>
        <Text style={styles.subtitle}>Login to your account</Text>

        {/* Email input field (React Native Paper Component) */}
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        {/* Password input field (React Native Paper Component) */}
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry
          style={styles.input}
        />

        {/* Login button (React Native Paper Component) */}
        <Button 
          mode="contained" 
          onPress={handleLogin}
          loading={loading}
          disabled={loading}
          style={styles.button}
        >
          Login
        </Button>

        {/* Navigation to Register screen */}
        <Button 
          mode="text" 
          onPress={() => navigation.navigate('Register')}
          style={styles.registerButton}
        >
          Don't have an account? Register
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

{/* Style Login Screen */}
const styles = StyleSheet.create({  
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    paddingVertical: 8,
  },
  registerButton: {
    marginTop: 15,
  },
});