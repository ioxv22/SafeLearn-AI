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
  setCurrentUser: (user: UserData | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useStore = create<StoreState>((set) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  isLoading: true,
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
