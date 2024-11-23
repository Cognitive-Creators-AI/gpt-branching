import React from 'react';
import styles from './ChatContainer.module.css';
import ChatMessage from '../ChatMessage/ChatMessage';

const ChatContainer = ({ messages, isBranched = false, onClose, onBranch, isExiting = false, isLoading = false }) => {
  const containerClassName = `${styles.container} ${isBranched ? styles.branched : ''} ${isExiting ? styles.exiting : ''}`;

  return (
    <div className={containerClassName}>
      {isBranched && (
        <div className={styles.header}>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>
      )}
      
      <div className={styles.chatContainer}>
        {messages.map((msg, idx) => (
          <ChatMessage 
            key={idx}
            role={msg.role}
            content={msg.content}
            allowBranching={!isBranched}
            onBranch={onBranch}
            isLoading={isLoading && idx === messages.length - 1 && msg.role === 'assistant'}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatContainer;
