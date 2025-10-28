import React from 'react';  // React library
import { NavigationContainer } from '@react-navigation/native'; // Navigation container
import { createStackNavigator } from '@react-navigation/stack'; // Stack navigator
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // Bottom tab navigator
import { Ionicons } from '@expo/vector-icons';  // Ionicons for tab icons
import { IconButton } from 'react-native-paper';  // IconButton component for header buttons

import LoginScreen from '../screens/LoginScreen'; // Login screen component
import RegisterScreen from '../screens/RegisterScreen'; // Register screen component
import DashboardScreen from '../screens/DashboardScreen'; // Dashboard screen component
import TransactionsScreen from '../screens/TransactionsScreen'; // Transactions screen component
import AddTransactionScreen from '../screens/AddTransactionScreen'; // Add/Edit Transaction screen component
import ChatbotScreen from '../screens/ChatbotScreen'; // Chatbot screen component

import { logoutUser } from '../services/authService'; // Service function to log out user

const Stack = createStackNavigator(); // Stack navigator instance
const Tab = createBottomTabNavigator(); // Bottom tab navigator instance

function AuthStack() {  // Authentication stack navigator
  return (  // Main return statement rendering the Auth stack
    /* Stack navigator for authentication screens */
    <Stack.Navigator> 
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ 
          headerShown: false 
        }}
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen}
        options={{ 
          title: 'Create Account',
          headerStyle: { backgroundColor: '#667eea' },
          headerTintColor: '#fff',
        }}
      />
    </Stack.Navigator>
  );
}

function TransactionsStack() {  // Stack navigator for Transactions screens
  return (  // Main return statement rendering the Transactions stack
    /* Stack navigator for Transactions screens */
    <Stack.Navigator>
      <Stack.Screen 
        name="TransactionsList" 
        component={TransactionsScreen}
        options={{
          title: 'Transactions',
          headerStyle: { backgroundColor: '#667eea' },
          headerTintColor: '#fff',
          headerRight: () => (
            <IconButton
              icon="logout"
              iconColor="#fff"
              onPress={async () => {
                await logoutUser();
              }}
            />
          ),
        }}
      />
      <Stack.Screen 
        name="AddTransaction" 
        component={AddTransactionScreen}
        options={({ route }) => ({
          title: route.params?.transaction ? 'Edit Transaction' : 'Add Transaction',
          headerStyle: { backgroundColor: '#667eea' },
          headerTintColor: '#fff',
        })}
      />
    </Stack.Navigator>
  );
}

function MainTabs() { // Main tab navigator for authenticated users
  return (  // Main return statement rendering the main tab navigator
    /* Bottom tab navigator for main app screens */
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          
          if (route.name === 'Dashboard') {
            iconName = 'home';
          } else if (route.name === 'Transactions') {
            iconName = 'list';
          } else if (route.name === 'Chatbot') {
            iconName = 'chatbubbles';
          }
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#667eea',
        tabBarInactiveTintColor: 'gray',
        headerStyle: { backgroundColor: '#667eea' },
        headerTintColor: '#fff',
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ 
          title: 'Dashboard',
          headerRight: () => (
            <IconButton
              icon="logout"
              iconColor="#fff"
              onPress={async () => {
                await logoutUser();
              }}
            />
          ),
        }}
      />
      <Tab.Screen 
        name="Transactions" 
        component={TransactionsStack}
        options={{ 
          headerShown: false
        }}
      />
      <Tab.Screen 
        name="Chatbot" 
        component={ChatbotScreen}
        options={{ 
          title: 'AI Assistant',
          headerRight: () => (
            <IconButton
              icon="logout"
              iconColor="#fff"
              onPress={async () => {
                await logoutUser();
              }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator({ isAuthenticated }) { // Main app navigator component
  return (  // Main return statement rendering the app navigator
    /* Navigation container managing app navigation */
    <NavigationContainer>
      {isAuthenticated ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}