import React from 'react';

// eslint-disable-next-line import/prefer-default-export
export const handleEnterForChat = (
  e: React.KeyboardEvent<HTMLTextAreaElement>,
  customFunc: () => void
) => {
  const keyCode = e.code;
  // 13 represents the Enter key
  if (keyCode === 'Enter' && !e.shiftKey) {
    // Don't generate a new line
    e.preventDefault();
    customFunc();
  }
};
