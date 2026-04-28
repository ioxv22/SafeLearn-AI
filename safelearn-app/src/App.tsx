import React, { useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Chat } from './components/Chat';
import { Dashboard } from './components/Dashboard';
import { Login } from './components/Login';
import { VideoModal } from './components/VideoModal';
import { useStore } from './store';
import { Sun, Moon } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

function App() {
  const { currentUser, viewMode, isDarkMode, toggleDarkMode } = useStore();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="flex h-screen w-full bg-background text-foreground transition-colors font-sans overflow-hidden">


      <AnimatePresence mode="wait">
        {!currentUser ? (
          <motion.div key="login" className="w-full h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Login />
          </motion.div>
        ) : (
          <motion.div key="app" className="flex w-full h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Sidebar />
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
              {viewMode === 'chat' ? <Chat /> : <Dashboard />}
            </main>
            <VideoModal />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
