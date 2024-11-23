import React from 'react';
import styles from './Sidebar.module.css';

const Sidebar = ({ onNewChat }) => {
  return (
    <div className={styles.sidebar}>
      <button className={styles.newChat} onClick={onNewChat}>
        + New chat
      </button>
      <div className={styles.chatHistory}>
        {/* Chat history items would go here */}
      </div>
    </div>
  );
};

export default Sidebar;
