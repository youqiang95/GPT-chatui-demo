import React from 'react';
import logo from './logo.svg';
import './App.css';
import SessionList from './components/SessionList';
import ChatWindow from './components/ChatWindow';

function App() {
  return (
    <div className="app">
      <SessionList />
      <ChatWindow />
    </div>
  );
}

export default App;
