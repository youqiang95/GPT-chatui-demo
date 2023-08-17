import { useStore } from '../store/chat';
import React from 'react';
import '@chatui/core/es/styles/index.less';
import Chat, { Bubble, useMessages } from '@chatui/core'; 
import '@chatui/core/dist/index.css';

const ChatWindow = () => {
  const {currentSession} = useStore()
  const initMessages = currentSession ? currentSession.chats : []
  const title = currentSession ? currentSession.title : '智能助理'
  const { messages, appendMsg, setTyping } = useMessages(initMessages);

  function handleSend(type, val) {
    if (type === 'text' && val.trim()) {
      appendMsg({
        type: 'text',
        content: { text: val },
        position: 'right'
      });
      
      setTyping(true);
      
      setTimeout(() => {
        appendMsg({
          type: 'text',  
          content: { text: '你好,我是智能助理Claude!' },
        });
        
        setTyping(false);
      }, 1000); 
    }
  }

  function renderMessageContent(msg) {
    const { content } = msg;
    return <Bubble content={content.text} />;
  }

  return (
    <Chat
      navbar={{title}}
      messages={messages}
      renderMessageContent={renderMessageContent}
      onSend={handleSend}
    />
  );
};

export default ChatWindow;