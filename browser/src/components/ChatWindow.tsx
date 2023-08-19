import { useStore } from '../store/chat';
import React from 'react';
import '@chatui/core/es/styles/index.less';
import Chat, { Bubble, useMessages } from '@chatui/core'; 
import '@chatui/core/dist/index.css';
import { genUniqId } from '../common/genUniqId'
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

const ChatWindow = () => {
  const {currentSession, addChatMessage, sendMessageStream} = useStore()
  const messages = currentSession ? currentSession.chats : []
  console.log('re enter', messages)
  const title = currentSession ? currentSession.title : 'Intelligent Assistant'
  const { appendMsg, setTyping } = useMessages([]);

  React.useEffect(()=>{
    console.log('messages changed!', messages)
  }, [messages])

  function handleSend(type:any, val:any) {
    const text = val.trim()
    if (type === 'text' && text) {
      sendMessageStream(text)     
    }
  }

  function renderMessageContent(msg:any) {
    const { content, type } = msg;
    if(type === 'loading'){
      const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
      const child = <Spin indicator={antIcon}/>
      return  <Bubble children={child}/>;
    }
    console.log('render message!', content.text)
    return <Bubble content={content.text} />;
  }

  return (
    <div className='chat-window'>
      <Chat
        locale='en'
        navbar={{title}}
        messages={messages}
        renderMessageContent={renderMessageContent}
        onSend={handleSend}
      />
    </div>
  );
};

export default ChatWindow;