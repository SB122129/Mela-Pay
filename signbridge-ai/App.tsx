// src/App.tsx
import Landing from './Landing';
import Stream from './Stream';
import Upload from './components/Upload';
import React, { useState } from 'react';
import About from './About'; // Ensure this matches your filename (About.tsx)

const App: React.FC = () => {
  // 1. UPDATED: Added 'about' to the allowed state types
  const [currentPath, setCurrentPath] = useState<'landing' | 'stream' | 'upload' | 'about'>('landing');

  return (
    <>
      <div className="min-h-screen flex flex-col ">
        {/* Navigation Bar */}
        <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100 px-6 md:px-14 py-4 flex justify-between items-center">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => setCurrentPath('landing')}
          >
            <div className="w-6 h-6 bg-black rounded-lg flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
            <span className="text-lg font-bold tracking-tight text-black">SignBridge</span>
          </div>

          <div className="flex items-center gap-8">
            <button 
              onClick={() => setCurrentPath('landing')}
              className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-colors ${currentPath === 'landing' ? 'text-black' : 'text-zinc-400 hover:text-black'}`}
            >
              Home
            </button>
            <button 
              onClick={() => setCurrentPath('stream')}
              className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-colors ${currentPath === 'stream' ? 'text-black' : 'text-zinc-400 hover:text-black'}`}
            >
              Stream
            </button>
            <button 
              onClick={() => setCurrentPath('upload')}
              className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-colors ${currentPath === 'upload' ? 'text-black' : 'text-zinc-400 hover:text-black'}`}
            >
              Upload
            </button>
            <button 
              onClick={() => setCurrentPath('about')}
              className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-colors ${currentPath === 'about' ? 'text-black' : 'text-zinc-400 hover:text-black'}`}
            >
              About Us
            </button>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 pt-20">
          {currentPath === 'landing' && (
            <Landing onStart={() => setCurrentPath('stream')} /> 
          )}

          {currentPath === 'stream' && <Stream />}
          {currentPath === 'upload' && <Upload />}
          {currentPath === 'about' && <About />}
        </main>
      </div>

      <footer className="py-12 px-6 mt-20 md:px-14 flex flex-col bg-black md:flex-row justify-between items-center border-t border-zinc-100 gap-6 text-zinc-300">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em]">© 2026 SignBridge Lab</span>
        <div className="flex gap-12">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] hover:text-white cursor-default transition-colors">Privacy</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] hover:text-white cursor-default transition-colors">Safety</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] hover:text-white cursor-default transition-colors">v2.1</span>
        </div>
      </footer>
    </>
  );
};

export default App;