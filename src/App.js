import React, { useState } from 'react';
import axios from 'axios';
import styles from './App.module.css';
import Sidebar from './components/Sidebar/Sidebar';
import ChatContainer from './components/ChatContainer/ChatContainer';
import InputBox from './components/InputBox/InputBox';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function App() {
  const [mainChat, setMainChat] = useState({
    messages: [
      { role: 'assistant', content: 'Hello! How can I assist you today?' },
    ]
  });
  
  const [branchedChat, setBranchedChat] = useState(null);
  const [isExiting, setIsExiting] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    setIsLoading(true);

    const userMessage = { role: 'user', content: input };
    const targetChat = branchedChat ? branchedChat : mainChat;
    const newMessages = [...targetChat.messages, userMessage];

    console.log('[Chat] Sending message:', {
      isBranchedChat: !!branchedChat,
      message: userMessage,
      allMessages: newMessages
    });

    // Update UI immediately
    if (branchedChat) {
      setBranchedChat(prev => ({ ...prev, messages: newMessages }));
    } else {
      setMainChat(prev => ({ ...prev, messages: newMessages }));
    }

    setInput('');

    try {
      const response = await axios.post(`${API_URL}/api/chat`, { messages: newMessages });
      console.log('[Chat] Received response:', response.data);

      const assistantMessage = {
        role: 'assistant',
        content: response.data.reply,
      };

      // Update with AI response
      if (branchedChat) {
        setBranchedChat(prev => ({
          ...prev,
          messages: [...prev.messages, assistantMessage]
        }));
      } else {
        setMainChat(prev => ({
          ...prev,
          messages: [...prev.messages, assistantMessage]
        }));
      }
    } catch (error) {
      console.error('[Chat] Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBranch = async (selectedText) => {
    console.log('[Branch] Creating new branch with context:', selectedText);
    setIsLoading(true);

    const initialMessage = { 
      role: 'user', 
      content: `Branch: "${selectedText}". Can we please explore this futher?.` 
    };

    // Create branch immediately with just the user message
    setBranchedChat({
      messages: [initialMessage]
    });

    try {
      console.log('[Branch] Sending initial message:', initialMessage);
      
      // Get initial AI response for the branch
      const response = await axios.post(`${API_URL}/api/chat`, { 
        messages: [
          { role: 'system', content: 'You are starting a new conversation branch based on selected text from a previous conversation. Acknowledge the context and answer the user or ask for further information if needed.' },
          initialMessage
        ]
      });

      console.log('[Branch] Received initial response:', response.data);

      // Update branch with AI response
      setBranchedChat(prev => ({
        messages: [
          ...prev.messages,
          { role: 'assistant', content: response.data.reply }
        ]
      }));
    } catch (error) {
      console.error('[Branch] Error creating branch:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const closeBranchedChat = () => {
    console.log('[Branch] Closing branched chat');
    setIsExiting(true);
    setTimeout(() => {
      setBranchedChat(null);
      setIsExiting(false);
    }, 300); // Match animation duration
  };

  const handleNewChat = () => {
    setMainChat({
      messages: [
        { role: 'assistant', content: 'Hello! How can I assist you today?' },
      ]
    });
    setBranchedChat(null);
  };

  return (
    <div className={styles.app}>
      <Sidebar onNewChat={handleNewChat} />
      <main className={styles.main}>
        <div className={styles.chatContainers}>
          <ChatContainer
            messages={mainChat.messages}
            onBranch={handleBranch}
            hasBranch={!!branchedChat}
          />
          {branchedChat && (
            <ChatContainer
              messages={branchedChat.messages}
              onClose={closeBranchedChat}
              isBranched={true}
              isExiting={isExiting}
            />
          )}
        </div>
        <div className={styles.inputContainer}>
          <InputBox
            input={input}
            setInput={setInput}
            sendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
