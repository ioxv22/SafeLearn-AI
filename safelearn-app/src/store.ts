import { create } from 'zustand';

export type UserLevel = 'weak' | 'medium' | 'advanced';
export type ViewMode = 'chat' | 'dashboard';
export type UserRole = 'student' | 'teacher' | null;

export interface User {
  name: string;
  role: UserRole;
  email: string;
}

export interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface AppState {
  currentUser: User | null;
  login: (user: User) => void;
  logout: () => void;

  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  
  safeMode: boolean;
  toggleSafeMode: () => void;
  
  examMode: boolean;
  toggleExamMode: () => void;

  isVideoModalOpen: boolean;
  setVideoModalOpen: (isOpen: boolean) => void;
  
  userLevel: UserLevel;
  setUserLevel: (level: UserLevel) => void;
  
  messages: Message[];
  addMessage: (msg: Message) => void;
  clearMessages: () => void;
  
  cheatAttempts: number;
  incrementCheatAttempts: () => void;
  
  stats: {
    questionsAttempted: number;
    questionsSolved: number;
    streak: number;
  };
  incrementStat: (stat: keyof AppState['stats']) => void;
}

export const useStore = create<AppState>((set) => ({
  currentUser: null,
  login: (user) => set({ currentUser: user, viewMode: user.role === 'teacher' ? 'dashboard' : 'chat' }),
  logout: () => set({ currentUser: null, cheatAttempts: 0 }),

  viewMode: 'chat',
  setViewMode: (mode) => set({ viewMode: mode }),
  
  isDarkMode: true,
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  
  safeMode: true,
  toggleSafeMode: () => set((state) => ({ safeMode: !state.safeMode })),
  
  examMode: false,
  toggleExamMode: () => set((state) => ({ examMode: !state.examMode, safeMode: !state.examMode ? true : state.safeMode })),

  isVideoModalOpen: false,
  setVideoModalOpen: (isOpen) => set({ isVideoModalOpen: isOpen }),
  
  userLevel: 'medium',
  setUserLevel: (level) => set({ userLevel: level }),
  
  messages: [
    {
      id: '1',
      role: 'ai',
      content: 'مرحباً! أنا SafeLearn AI، معلمك الذكي. يمكنني الآن فهم السياق وتقييم إجاباتك بشكل دقيق. كما يمكنك توليد فيديوهات تعليمية للمفاهيم الصعبة!',
      timestamp: new Date()
    }
  ],
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  clearMessages: () => set({ messages: [] }),
  
  cheatAttempts: 0,
  incrementCheatAttempts: () => set((state) => ({ cheatAttempts: state.cheatAttempts + 1 })),
  
  stats: {
    questionsAttempted: 12,
    questionsSolved: 8,
    streak: 4
  },
  incrementStat: (stat) => set((state) => ({ 
    stats: { ...state.stats, [stat]: state.stats[stat] + 1 } 
  }))
}));
