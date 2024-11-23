import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import styles from './ChatMessage.module.css';
import BranchTooltip from '../BranchTooltip/BranchTooltip';

const ChatMessage = ({ role, content, allowBranching = true, onBranch }) => {
  const [tooltipPosition, setTooltipPosition] = useState(null);
  const [selectedText, setSelectedText] = useState('');
  const textRef = useRef(null);
  const isLoading = content === '...';

  useEffect(() => {
    const handleSelection = (e) => {
      // Check if the selection is within this message's text element
      const isWithinTextElement = textRef.current?.contains(e.target);

      if (!isWithinTextElement) return;

      // Only show tooltip for assistant messages and when branching is allowed
      if (role !== 'assistant' || !allowBranching) return;

      const selection = window.getSelection();
      const text = selection.toString().trim();
      
      if (text === '') {
        setTooltipPosition(null);
        setSelectedText('');
        return;
      }

      const range = selection.getRangeAt(0);
      const textElement = textRef.current;
      const textRect = textElement.getBoundingClientRect();
      
      // Create a range for just the start point
      const startRange = document.createRange();
      startRange.setStart(range.startContainer, range.startOffset);
      startRange.setEnd(range.startContainer, range.startOffset);
      const startRect = startRange.getBoundingClientRect();
      
      const position = {
        top: startRect.top - textRect.top - 40,
        left: startRect.left - textRect.left
      };
      
      setSelectedText(text);
      setTooltipPosition(position);
    };

    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection.rangeCount) {
        setTooltipPosition(null);
        setSelectedText('');
        return;
      }

      const range = selection.getRangeAt(0);
      const textElement = textRef.current;

      // Check if the range intersects with our text element
      const textRange = document.createRange();
      textRange.selectNode(textElement);

      const isIntersecting = !(
        range.compareBoundaryPoints(Range.END_TO_START, textRange) > 0 ||
        range.compareBoundaryPoints(Range.START_TO_END, textRange) < 0
      );

      if (!isIntersecting || selection.toString().trim() === '') {
        setTooltipPosition(null);
        setSelectedText('');
      }
    };

    // Handle clicks outside the message
    const handleClickOutside = (e) => {
      if (!textRef.current?.contains(e.target)) {
        setTooltipPosition(null);
        setSelectedText('');
      }
    };

    document.addEventListener('mouseup', handleSelection);
    document.addEventListener('selectionchange', handleSelectionChange);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mouseup', handleSelection);
      document.removeEventListener('selectionchange', handleSelectionChange);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [role, allowBranching]);

  const handleBranch = () => {
    if (onBranch && selectedText) {
      onBranch(selectedText);
      // Clear selection and state after branching
      setTooltipPosition(null);
      setSelectedText('');
      window.getSelection().removeAllRanges();
    }
  };

  return (
    <div className={`${styles.message} ${role === 'assistant' ? styles.assistant : styles.user}`}>
      <div className={styles.messageContent}>
        {role === 'assistant' && (
          <div className={styles.icon}>
            <svg width="18" height="18" viewBox="0 0 24 24" role="img" xmlns="http://www.w3.org/2000/svg">
              <title>OpenAI icon</title>
              <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/>
            </svg>
          </div>
        )}
        <div ref={textRef} className={`${styles.text} ${isLoading ? styles.loading : ''}`} style={{ position: 'relative' }}>
          <ReactMarkdown>{content}</ReactMarkdown>
          {tooltipPosition && (
            <BranchTooltip 
              position={tooltipPosition}
              onBranch={handleBranch}
              selectedText={selectedText}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
