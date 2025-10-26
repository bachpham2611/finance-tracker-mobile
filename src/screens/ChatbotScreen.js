import React, { useState, useRef } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform, Text } from 'react-native';
import { TextInput, IconButton, Card, Chip } from 'react-native-paper';
import { processChatMessage } from '../services/chatbotService';

export default function ChatbotScreen() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: "Hi! I'm your AI finance assistant. Ask me about your balance, spending, or get financial advice!",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);

  const quickMessages = [
    "What's my balance? ",
    "How much did I spend? ",
    "Give me advice ",
    "Recent transactions ",
  ];

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: text,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      const response = await processChatMessage(text);
      
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        isBot: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I encountered an error. Please try again.",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }) => (
    <View style={[styles.messageContainer, item.isBot ? styles.botMessage : styles.userMessage]}>
      <Card style={[styles.messageCard, item.isBot ? styles.botCard : styles.userCard]}>
        <Card.Content>
          <Text style={item.isBot ? styles.botText : styles.userText}>{item.text}</Text>
        </Card.Content>
      </Card>
      <Text style={styles.timestamp}>
        {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

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