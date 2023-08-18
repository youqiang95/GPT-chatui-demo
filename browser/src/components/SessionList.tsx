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
                <g fill="none" fill-rule="evenodd" stroke="#FFF" strokeLinejoin="round" stroke-width="1.6">
                  <path d="M9 16.875a7.875 7.875 0 1 0 0-15.75 7.875 7.875 0 0 0 0 15.75Z"></path>
                  <path strokeLinecap="round" d="M9 5.85v6.3M5.85 9h6.3"></path>
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
                  <svg className="icon" style={{width: '1em', height: '1em', verticalAlign: 'middle', fill: 'currentColor', overflow: 'hidden'}} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3150">
                    <path d="M512 64c259.2 0 469.333333 200.576 469.333333 448s-210.133333 448-469.333333 448a484.48 484.48 0 0 1-232.725333-58.88l-116.394667 50.645333a42.666667 42.666667 0 0 1-58.517333-49.002666l29.76-125.013334C76.629333 703.402667 42.666667 611.477333 42.666667 512 42.666667 264.576 252.8 64 512 64z m0 64C287.488 128 106.666667 300.586667 106.666667 512c0 79.573333 25.557333 155.434667 72.554666 219.285333l5.525334 7.317334 18.709333 24.192-26.965333 113.237333 105.984-46.08 27.477333 15.018667C370.858667 878.229333 439.978667 896 512 896c224.512 0 405.333333-172.586667 405.333333-384S736.512 128 512 128z m-157.696 341.333333a42.666667 42.666667 0 1 1 0 85.333334 42.666667 42.666667 0 0 1 0-85.333334z m159.018667 0a42.666667 42.666667 0 1 1 0 85.333334 42.666667 42.666667 0 0 1 0-85.333334z m158.997333 0a42.666667 42.666667 0 1 1 0 85.333334 42.666667 42.666667 0 0 1 0-85.333334z" fill="#333333" p-id="3151"></path>
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