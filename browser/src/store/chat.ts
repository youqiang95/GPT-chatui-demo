import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage} from 'zustand/middleware';
import { get, set, del } from 'idb-keyval'
import {genUniqId} from '../common/genUniqId'

// Custom storage object
const storage: StateStorage = {
    getItem: async (name: string): Promise<string | null> => {
      return (await get(name)) || null
    },
    setItem: async (name: string, value: string): Promise<void> => {
      await set(name, value)
    },
    removeItem: async (name: string): Promise<void> => {
      await del(name)
    },
}

interface Session {
    id: string;
    title: string;
    chats: string[];
}

interface State {
    sessions: Session[];
    currentSession: Session | null;
    createSession: () => void;
    deleteSession: (id: string) => void;
    setCurrentSession: (id: string) => void;
    addChatMessage: (sessionId:string, chatMessage:string)=>void
}

export const useStore = create<State>(
    persist(
        (set, get)=>({
            sessions: [],
            currentSession: null,
            createSession: () => {
                // 新增会话逻辑
                const newSession:Session = {
                    id: genUniqId(),
                    title: "New Session",
                    chats: []
                }
                set((state) => ({
                    sessions: [
                      ...state.sessions,
                      newSession
                    ],
                    currentSession: newSession
                }));
            },
            deleteSession(id: string) => {
                // 删除会话逻辑
                set((state) => ({
                    sessions: state.sessions.filter(session => session.id !== id),
                }));
            },
            setCurrentSession(id: string) => {
                // 设置当前会话逻辑
                const session = get().sessions.find(session => session.id === id);
                set({ currentSession: session });
            },

            addChatMessage(sessionId:string, chatMessage:string)=>{
                // 新增chat messgae
                const state = get()
                const updatedSessions = state.sessions.map(session => {
                    if(session.id === sessionId) {
                      return {
                        ...session,
                        chats: [...session.chats, chatMessage]
                      };
                    }
                    return session;
                });
                let updateCurrentSession = state.currentSession
                if(currentSession && currentSession.id === sessionId){
                    updateCurrentSession = {
                        ...updateCurrentSession,
                        chat:[...updateCurrentSession.chats, chatMessage]
                    }
                }
                set({
                    sessions: updatedSessions,
                    currentSession: updateCurrentSession
                })
            }
        }),

        {
            name: 'chat',
            version: 1,
            storage: createJSONStorage(() => storage)
        }
    )
);