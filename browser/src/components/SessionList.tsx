import React from 'react';
import { useStore } from '../store/chat';
import { Popconfirm  } from 'antd';

export default function SessionList() {
  const { sessions, createSession, deleteSession, setCurrentSession, currentSession} = useStore();
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const handleSelect = (id:string) => {
    setCurrentSession(id);
  }

  const handleDelete = (id:string) => {
    deleteSession(id);
  }

  return (
    <div className="session-list">
      <div className='session-list-main'>
        <div className='session-list-main-header'>
          <button className="create-session-button" onClick={createSession}>
            <div className="create-session-content">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" style={{marginRight: 5}}>
                <g fill="none" fill-rule="evenodd" stroke="#FFF" stroke-linejoin="round" stroke-width="1.6">
                  <path d="M9 16.875a7.875 7.875 0 1 0 0-15.75 7.875 7.875 0 0 0 0 15.75Z"></path>
                  <path stroke-linecap="round" d="M9 5.85v6.3M5.85 9h6.3"></path>
                </g>
              </svg>
              Create New Session
            </div>
          </button>
        </div>
        
        <div className='session-list-main-content'>
          <ul>
            {sessions.map(session => (
              <li 
                key={session.id}
                onClick={() => handleSelect(session.id)}
              >
                <div className={currentSession && currentSession.id === session.id ? 'session-item session-item-select' : 'session-item'}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18">
                    <g fill="none" fill-rule="evenodd" stroke="#202430" stroke-linecap="round" stroke-width="1.6">
                      <path stroke-linejoin="round" d="M12.544 14.593H9.337a1.125 1.125 0 0 1-1.124-1.125v-1.96h3.262a2.25 2.25 0 0 0 2.25-2.25V8.42h2.025c.621 0 1.125.504 1.125 1.125v3.922c0 .621-.504 1.125-1.125 1.125h-.844 0l-1.181 1.157-1.181-1.157Z"></path>
                      <path stroke-linejoin="round" d="M2.25 2.25H12.6c.621 0 1.125.504 1.125 1.125v7.007c0 .621-.504 1.125-1.125 1.125H6.244h0L4.669 13.05l-1.575-1.543H2.25a1.125 1.125 0 0 1-1.125-1.125V3.375c0-.621.504-1.125 1.125-1.125Z"></path>
                      <path d="M4.275 8.421h2.363M4.275 5.336H9"></path>
                    </g>
                  </svg>
                  <div className='session-title-wrap'>{session.title}</div>
                  <div className='session-item-delete-wrap'>
                    <Popconfirm
                      title="Delete this session"
                      description="Are you sure to delete this session?"
                      onConfirm={() => handleDelete(session.id)}
                      onCancel={()=>{}}
                      okText="Yes"
                      cancelText="No"
                    >
                      <button 
                        className='session-delete-button'
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                          <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"></path>
                        </svg>
                      </button>
                    </Popconfirm>
                  </div>
                  
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}