import React, { useState, useEffect } from 'react'; // useState and useEffect hooks
import { ActivityIndicator, View, StyleSheet } from 'react-native'; // ActivityIndicator, View, StyleSheet components
import { Provider as PaperProvider } from 'react-native-paper'; // PaperProvider for theming
import { onAuthStateChanged } from 'firebase/auth'; // Firebase auth state listener
import { auth } from './firebase';  // Firebase auth instance
import AppNavigator from './src/navigation/AppNavigator'; // Main app navigator

export default function App() { //  Main App component
  const [isAuthenticated, setIsAuthenticated] = useState(false);  // State to track authentication status
  const [loading, setLoading] = useState(true); // State to manage loading indicator

  useEffect(() => {
    // Listen to authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setIsAuthenticated(true);
      } else {
        // User is signed out
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  if (loading) {  // Show loading indicator while checking auth state
    return (  // Return statement for loading state
      // Loading container
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

  return (  // Main return statement rendering the app with PaperProvider
    // PaperProvider for theming
    <PaperProvider>
      <AppNavigator isAuthenticated={isAuthenticated} />
    </PaperProvider>
  );
}

const styles = StyleSheet.create({  // Stylesheet for the component
  loadingContainer: { // Style for loading container
    flex: 1,  // Full flex
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    backgroundColor: '#f5f5f5', // Light background color
  },
});