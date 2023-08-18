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

type MessageId = string | number;

interface User {
    avatar?: string;
    name?: string;
    url?: string;
    [k: string]: any;
}

interface IMessage {
    /**
     * 唯一ID
     */
    _id: MessageId;
    /**
     * 消息类型
     */
    type: string;
    /**
     * 消息内容
     */
    content?: any;
    /**
     * 消息发送者信息
     */
    user?: User;
    /**
     * 消息位置
     */
    position?: 'left' | 'right' | 'center' | 'pop';
}

interface Session {
    id: string;
    title: string;
    chats: IMessage[];
}

interface State {
    sessions: Session[];
    currentSession: Session | null | undefined;
    createSession: () => void;
    deleteSession: (id: string) => void;
    setCurrentSession: (id: string) => void;
    addChatMessage: (sessionId:string, chatMessage:IMessage)=>void;
    sendMessage: (text:string)=>void,
    updateChatMessage: (sessionId: string, messageId: MessageId, updatedMessage: IMessage)=>void
}

export const useStore = create<State>()(
    persist(
        (set, get)=>({
            sessions: [],
            currentSession: null,
            createSession(){
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
            deleteSession(id: string){
                // 删除会话逻辑
                set((state) => ({
                    sessions: state.sessions.filter(session => session.id !== id),
                }));
            },
            setCurrentSession(id: string){
                // 设置当前会话逻辑
                const session = get().sessions.find(session => session.id === id);
                set({ currentSession: session });
            },

            addChatMessage(sessionId:string, chatMessage:IMessage){
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
                if(updateCurrentSession && updateCurrentSession.id === sessionId){
                    updateCurrentSession = {
                        ...updateCurrentSession,
                        chats:[...updateCurrentSession.chats, chatMessage]
                    }
                }
                set({
                    sessions: updatedSessions,
                    currentSession: updateCurrentSession
                })
            },

            updateChatMessage(sessionId: string, messageId: MessageId, updatedMessage: IMessage){
                const sessions = get().sessions;
                const updatedSessions = sessions.map(session => {
                    if (session.id === sessionId) {
                    return {
                        ...session,
                        chats: session.chats.map(chat => {
                        if (chat._id === messageId) {
                            return {...updatedMessage, _id:chat._id};
                        }
                        return chat;
                        })  
                    };
                    }
                    return session;
                });
                set({sessions: updatedSessions})
            },

            sendMessage(text:string){
                if(!get().currentSession){
                    get().createSession()
                }
                const session = get().currentSession
                const sessionId = session!.id
                const userMessage: IMessage = {
                    _id: genUniqId(),
                    type: 'text', 
                    content: { text},
                    position: 'right'
                }
                get().addChatMessage(sessionId, userMessage)

                const loadingMessage: IMessage = {
                    _id: genUniqId(),
                    type: 'loading', 
                    content: { text: 'Loading...'},
                    position: 'left'
                };
                get().addChatMessage(sessionId, loadingMessage)

                setTimeout(() => {
                    const realMessage: IMessage = {
                        ...loadingMessage,
                        type: 'text',
                        content: { text: 'hello i am real message!'},
                    };
                    get().updateChatMessage(sessionId, loadingMessage._id, realMessage)
                    const currentSession = get().currentSession
                    if (currentSession && sessionId === currentSession.id) {
                        const newSession = get().sessions.find(s => s.id === sessionId) as Session
                        set({
                          currentSession: {...newSession}
                        });
                    }
                  }, 5000);
            }
        }),

        {
            name: 'chat',
            version: 1,
            storage: createJSONStorage(() => storage)
        }
    )
);