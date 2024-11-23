import React from 'react';
import styles from './InputBox.module.css';

const InputBox = ({ input, setInput, sendMessage, isLoading }) => {
  return (
    <div className={styles.inputContainer}>
      <div className={styles.inputBox}>
        <input
          className={styles.input}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Send a message..."
        />
        <button 
          onClick={sendMessage}
          className={styles.sendButton}
          disabled={!input.trim() || isLoading}
        >
          ➤
        </button>
      </div>
      <div className={styles.disclaimer}>
        This demo cannot make mistakes. I hard coded everything.
      </div>
    </div>
  );
};

export default InputBox;
