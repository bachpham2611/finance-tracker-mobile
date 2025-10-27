import React, { useState } from 'react';  //useState: React hook for state management
import { View, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native'; // View: Container for layout; StyleSheet: For styling components; KeyboardAvoidingView: To adjust UI when keyboard is open; Platform: To handle platform-specific behavior; Alert: For displaying alert dialogs.
import { TextInput, Button } from 'react-native-paper'; // TextInput: For input fields; Button: For clickable buttons.
import { Text } from 'react-native';  // Text: To display text elements.
import { registerUser } from '../services/authService'; // registerUser: Function to handle user registration via auth service.   

export default function RegisterScreen({ navigation }) {  // export default function, define the main component
  const [username, setUsername] = useState(''); // username state to store the entered username
  const [email, setEmail] = useState(''); // email state to store the entered email
  const [password, setPassword] = useState(''); // password state to store the entered password
  const [confirmPassword, setConfirmPassword] = useState(''); // confirmPassword state to store the entered password confirmation
  const [loading, setLoading] = useState(''); // loading state to manage the loading indicator during registration process

  const handleRegister = async () => {  // Function to handle user registration
    if (!username || !email || !password || !confirmPassword) { // Basic validation: Check if all fields are filled
      Alert.alert('Error', 'Please fill in all fields');  // Show alert if any field is empty
      return;
    }

    if (password !== confirmPassword) { // Check if password and confirmPassword match
      Alert.alert('Error', 'Passwords do not match'); // Show alert if passwords do not match
      return;
    }

    if (password.length < 6) {  // Check for minimum password length
      Alert.alert('Error', 'Password must be at least 6 characters'); // Show alert if password is too short
      return;
    }

    setLoading(true); // Set loading state to true to show loading indicator
    try {
      await registerUser(username, email, password);  // Call to service: Register the user with provided credentials
      Alert.alert('Success', 'Account created successfully!');  // Show success alert upon successful registration
      navigation.navigate('Login'); // Navigate to Login screen after successful registration
    } catch (error) { // Error handling: Show alert if registration fails
      Alert.alert('Registration Failed', error.message);  // Show error message from the caught error
    } finally {
      setLoading(false);  // Reset loading state after registration attempt
    }
  };

  return (  // Main return for RegisterScreen component
    // KeyboardAvoidingView: Adjusts the UI when the keyboard is open to prevent overlapping
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to get started</Text>

        <TextInput
          label="Username"
          value={username}
          onChangeText={setUsername}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry
          style={styles.input}
        />

        <TextInput
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          mode="outlined"
          secureTextEntry
          style={styles.input}
        />

        <Button 
          mode="contained" 
          onPress={handleRegister}
          loading={loading}
          disabled={loading}
          style={styles.button}
        >
          Register
        </Button>

        <Button 
          mode="text" 
          onPress={() => navigation.navigate('Login')}
          style={styles.loginButton}
        >
          Already have an account? Login
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}
// Style definitions for RegisterScreen component
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
    fontSize: 28,
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
  loginButton: {
    marginTop: 15,
  },
});