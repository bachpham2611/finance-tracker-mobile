import React, { useState, useRef } from 'react';  // useState and useRef hooks
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform, Text } from 'react-native';  // View, StyleSheet, FlatList, KeyboardAvoidingView, Platform, Text components
import { TextInput, IconButton, Card, Chip } from 'react-native-paper'; // TextInput: For user input; IconButton: For send button; Card: For displaying messages; Chip: For quick message buttons
import { processChatMessage } from '../services/chatbotService';  // Service function to process chat messages

export default function ChatbotScreen() { // Main component for Chatbot Screen
  const [messages, setMessages] = useState([  // State to hold chat messages, initialized with a welcome message
    {
      id: '1',  // Unique ID for the message
      text: "Hi! I'm your AI finance assistant. Ask me about your balance, spending, or get financial advice!", // Welcome message text
      isBot: true,  // Flag to indicate message is from bot
      timestamp: new Date(),  // Timestamp of the message
    },
  ]);
  const [inputText, setInputText] = useState(''); // State to hold the current input text
  const [loading, setLoading] = useState(false);  // State to manage loading indicator
  const flatListRef = useRef(null); // Ref for FlatList to scroll to bottom

  const quickMessages = [ // Predefined quick message options
    "What's my balance? ",
    "How much did I spend? ",
    "Give me advice ",
    "Recent transactions ",
  ];

  const sendMessage = async (text) => { // Function to send a message
    if (!text.trim()) return; // Do nothing if input is empty

    const userMessage = { // Create user message object
      id: Date.now().toString(),  // Unique ID based on timestamp
      text: text, // Message text
      isBot: false, // Flag to indicate message is from user
      timestamp: new Date(),  // Timestamp of the message
    };

    setMessages((prev) => [...prev, userMessage]);  // Append user message to messages state
    setInputText(''); // Clear input field
    setLoading(true); // Set loading state to true while processing

    try { // Try to process the chat message
      const response = await processChatMessage(text);  // Call to service: Process user message and get bot response
      
      const botMessage = {  // Create bot message object
        id: (Date.now() + 1).toString(),  // Unique ID based on timestamp
        text: response, // Bot response text
        isBot: true,  // Flag to indicate message is from bot
        timestamp: new Date(),  // Timestamp of the message
      };

      setMessages((prev) => [...prev, botMessage]); // Append bot message to messages state
    } catch (error) { // Error handling: Show error message if processing fails
      const errorMessage = {  // Create error message object
        id: (Date.now() + 1).toString(),  // Unique ID based on timestamp
        text: "Sorry, I encountered an error. Please try again.",
        isBot: true,  // Flag to indicate message is from bot
        timestamp: new Date(),  // Timestamp of the message
      };
      setMessages((prev) => [...prev, errorMessage]); // Append error message to messages state
    } finally { // Finally block to reset loading state
      setLoading(false);  // Reset loading state
    }
  };

  const renderMessage = ({ item }) => ( // Function to render each chat message
    <View style={[styles.messageContainer, item.isBot ? styles.botMessage : styles.userMessage]}> {/* Message container with conditional styling */}
      <Card style={[styles.messageCard, item.isBot ? styles.botCard : styles.userCard]}>  {/* Card component with conditional styling */}
        <Card.Content>  {/* Card content */}
          <Text style={item.isBot ? styles.botText : styles.userText}>{item.text}</Text>  {/* Message text with conditional styling */}
        </Card.Content>
      </Card>
      <Text style={styles.timestamp}> {/* Timestamp text */}
        {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} {/* Format timestamp to HH:MM */}
      </Text>
    </View>
  );

  return (  // Main return statement rendering the Chatbot screen
    /* KeyboardAvoidingView to manage keyboard behavior */
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      {/* FlatList to display chat messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />
      {/* Quick message buttons */}
      <View style={styles.quickMessagesContainer}>
        {quickMessages.map((msg, index) => (
          <Chip
            key={index}
            mode="outlined"
            onPress={() => sendMessage(msg)}
            style={styles.quickChip}
          >
            {msg}
          </Chip>
        ))}
      </View>
      {/* Input area for user messages */}
      <View style={styles.inputContainer}>
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ask me anything..."
          mode="outlined"
          style={styles.input}
          disabled={loading}
          onSubmitEditing={() => sendMessage(inputText)}
        />
        <IconButton
          icon="send"
          size={24}
          onPress={() => sendMessage(inputText)}
          disabled={loading || !inputText.trim()}
          style={styles.sendButton}
          iconColor="#fff"
        />
      </View>
    </KeyboardAvoidingView>
  );
}
// Style definitions for ChatbotScreen component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messagesList: {
    padding: 15,
    paddingBottom: 20,
  },
  messageContainer: {
    marginBottom: 15,
    maxWidth: '80%',
  },
  botMessage: {
    alignSelf: 'flex-start',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  messageCard: {
    elevation: 2,
  },
  botCard: {
    backgroundColor: '#fff',
  },
  userCard: {
    backgroundColor: '#667eea',
  },
  botText: {
    color: '#333',
    fontSize: 15,
  },
  userText: {
    color: '#fff',
    fontSize: 15,
  },
  timestamp: {
    fontSize: 11,
    color: '#999',
    marginTop: 5,
    marginLeft: 5,
  },
  quickMessagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  quickChip: {
    margin: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#667eea',
  },
});