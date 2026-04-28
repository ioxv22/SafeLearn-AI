import { create } from 'zustand';

interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: 'student' | 'teacher';
}

interface StoreState {
  currentUser: UserData | null;
  isLoading: boolean;
  safeMode: boolean;
  examMode: boolean;
  activeClass: any | null; // Added this
  progress: {
    solved: number;
    hintsUsed: number;
    streak: number;
  };
  setCurrentUser: (user: UserData | null) => void;
  setLoading: (loading: boolean) => void;
  setSafeMode: (mode: boolean) => void;
  setExamMode: (mode: boolean) => void;
  setActiveClass: (cls: any | null) => void; // Added this
  addProgress: (type: 'solved' | 'hint') => void;
}

export const useStore = create<StoreState>((set) => ({
  currentUser: null,
  isLoading: true,
  safeMode: true,
  examMode: false,
  activeClass: null, // Initial value
  progress: {
    solved: 42,
    hintsUsed: 128,
    streak: 15,
  },
  setCurrentUser: (user) => set({ currentUser: user }),
  setLoading: (loading) => set({ isLoading: loading }),
  setSafeMode: (mode) => set({ safeMode: mode }),
  setExamMode: (mode) => set({ examMode: mode }),
  setActiveClass: (cls) => set({ activeClass: cls }), // Implementation
  addProgress: (type) => set((state) => ({
    progress: {
      ...state.progress,
      solved: type === 'solved' ? state.progress.solved + 1 : state.progress.solved,
      hintsUsed: type === 'hint' ? state.progress.hintsUsed + 1 : state.progress.hintsUsed,
    }
  })),
}));
