import React from 'react';
import styles from './ChatContainer.module.css';
import ChatMessage from '../ChatMessage/ChatMessage';

const ChatContainer = ({ messages, isBranched = false, onClose, onBranch, isExiting = false, hasBranch = false }) => {
  const containerClassName = `${styles.container} ${isBranched ? styles.branched : ''} ${isExiting ? styles.exiting : ''}`;

  return (
    <div className={containerClassName}>
      {!isBranched && hasBranch && <div className={styles.overlay} />}
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
          />
        ))}
      </div>
    </div>
  );
};

export default ChatContainer;
