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
    const isBranched = !!branchedChat;
    setIsLoading(true);

    const userMessage = { role: 'user', content: input };
    const loadingMessage = { role: 'assistant', content: '...' };
    const targetChat = isBranched ? branchedChat : mainChat;
    const newMessages = [...targetChat.messages, userMessage, loadingMessage];

    console.log('[Chat] Sending message:', {
      isBranchedChat: isBranched,
      message: userMessage,
      allMessages: newMessages
    });

    // Update UI immediately with loading message
    if (isBranched) {
      setBranchedChat(prev => ({ ...prev, messages: newMessages }));
    } else {
      setMainChat(prev => ({ ...prev, messages: newMessages }));
    }

    setInput('');

    try {
      const response = await axios.post(`${API_URL}/chat`, { messages: targetChat.messages.concat(userMessage) });
      console.log('[Chat] Received response:', response.data);

      const assistantMessage = {
        role: 'assistant',
        content: response.data.reply,
      };

      // Replace loading message with actual response
      const finalMessages = [...targetChat.messages, userMessage, assistantMessage];
      
      if (isBranched) {
        setBranchedChat(prev => ({
          ...prev,
          messages: finalMessages
        }));
      } else {
        setMainChat(prev => ({
          ...prev,
          messages: finalMessages
        }));
      }
    } catch (error) {
      console.error('[Chat] Error sending message:', error);
      // Remove loading message on error
      const messagesWithoutLoading = [...targetChat.messages, userMessage];
      if (isBranched) {
        setBranchedChat(prev => ({
          ...prev,
          messages: messagesWithoutLoading
        }));
      } else {
        setMainChat(prev => ({
          ...prev,
          messages: messagesWithoutLoading
        }));
      }
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
    const loadingMessage = { role: 'assistant', content: '...' };

    // Create branch immediately with loading message
    setBranchedChat({
      messages: [initialMessage, loadingMessage]
    });

    try {
      console.log('[Branch] Sending initial message:', initialMessage);
      
      // Get initial AI response for the branch
      const response = await axios.post(`${API_URL}/chat`, { 
        messages: [
          { role: 'system', content: 'You are starting a new conversation branch based on selected text from a previous conversation. Acknowledge the context and answer the user or ask for further information if needed.' },
          initialMessage
        ]
      });

      console.log('[Branch] Received initial response:', response.data);

      // Replace loading message with actual response
      setBranchedChat({
        messages: [
          initialMessage,
          { role: 'assistant', content: response.data.reply }
        ]
      });
    } catch (error) {
      console.error('[Branch] Error creating branch:', error);
      // Remove loading message on error
      setBranchedChat({
        messages: [initialMessage]
      });
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
