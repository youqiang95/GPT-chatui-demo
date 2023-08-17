import { useStore } from '../store/chat';

export default function SessionList() {
  const { sessions, createSession, deleteSession } = useStore();

  return (
    <div className="session-list">
      {sessions.map(session => (
        <div key={session.id} className="session">
          <span>{session.title}</span>
          <button onClick={() => deleteSession(session.id)}>Delete</button>
        </div>
      ))}
      <button onClick={createSession}>New Session</button>
    </div>
  );
}