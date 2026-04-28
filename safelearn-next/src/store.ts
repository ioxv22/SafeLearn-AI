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
  progress: {
    solved: number;
    hintsUsed: number;
    streak: number;
  };
  setCurrentUser: (user: UserData | null) => void;
  setLoading: (loading: boolean) => void;
  setSafeMode: (mode: boolean) => void;
  setExamMode: (mode: boolean) => void;
  addProgress: (type: 'solved' | 'hint') => void;
}

export const useStore = create<StoreState>((set) => ({
  currentUser: null,
  isLoading: true,
  safeMode: true,
  examMode: false,
  progress: {
    solved: 5,
    hintsUsed: 12,
    streak: 3,
  },
  setCurrentUser: (user) => set({ currentUser: user }),
  setLoading: (loading) => set({ isLoading: loading }),
  setSafeMode: (mode) => set({ safeMode: mode }),
  setExamMode: (mode) => set({ examMode: mode }),
  addProgress: (type) => set((state) => ({
    progress: {
      ...state.progress,
      solved: type === 'solved' ? state.progress.solved + 1 : state.progress.solved,
      hintsUsed: type === 'hint' ? state.progress.hintsUsed + 1 : state.progress.hintsUsed,
    }
  })),
}));
