import React from 'react';
import styles from './BranchTooltip.module.css';

const BranchTooltip = ({ position, onBranch, selectedText }) => {
  if (!position) return null;

  const handleClick = (e) => {
    // Prevent any selection changes
    e.preventDefault();
    e.stopPropagation();
    
    // Prevent the click from triggering a new selection
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    
    if (onBranch) {
      onBranch();
    }
    
    // Restore the selection after a short delay
    setTimeout(() => {
      selection.removeAllRanges();
      selection.addRange(range);
    }, 0);
  };

  return (
    <div
      className={styles.tooltip}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`
      }}
      onClick={handleClick}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onMouseUp={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <svg width="16" height="16" viewBox="0 0 20 20" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.25 6.5C5.04493 6.5 6.5 5.04493 6.5 3.25C6.5 1.45507 5.04493 0 3.25 0C1.45507 0 0 1.45507 0 3.25C0 5.04493 1.45507 6.5 3.25 6.5Z" />
        <path d="M3 20C4.65685 20 6 18.6569 6 17C6 15.3431 4.65685 14 3 14C1.34315 14 0 15.3431 0 17C0 18.6569 1.34315 20 3 20Z" />
        <path d="M17 20C18.6569 20 20 18.6569 20 17C20 15.3431 18.6569 14 17 14C15.3431 14 14 15.3431 14 17C14 18.6569 15.3431 20 17 20Z" />
        <path d="M17.17 13.98C16.2 11.2 13.58 9.33 10.63 9.33C10.62 9.33 10.61 9.33 10.6 9.33L7.07 9.34C5.55 9.36 4.19 8.33 3.78 6.85V5.01C3.78 4.59 3.44 4.25 3.01 4.25C2.58 4.25 2.25 4.59 2.25 5.01V16.23C2.25 16.65 2.59 16.99 3.01 16.99C3.43 16.99 3.78 16.65 3.78 16.23V9.61C4.66 10.39 5.81 10.87 7.06 10.87C7.07 10.87 7.07 10.87 7.08 10.87L10.61 10.86C10.62 10.86 10.62 10.86 10.63 10.86C12.92 10.86 14.97 12.31 15.72 14.48C15.84 14.8 16.13 15 16.45 15C16.53 15 16.62 14.99 16.7 14.96C17.1 14.82 17.31 14.38 17.17 13.98Z" />
      </svg>
    </div>
  );
};

export default BranchTooltip;
