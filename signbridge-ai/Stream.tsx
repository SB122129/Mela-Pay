import React, { useState, useCallback, useRef } from 'react';
import { AppStatus, Message } from './types';
import CameraView from './components/CameraView';
import * as gemini from './services/geminiService';

const Stream: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [isCameraEnabled, setIsCameraEnabled] = useState(false);
  const [history, setHistory] = useState<Message[]>([]);
  const [lastTranslation, setLastTranslation] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);

  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };

  const handleSpeak = async (text: string) => {
    if (!text) return;
    initAudio();
    try {
      setStatus(AppStatus.SPEAKING);
      const base64Audio = await gemini.textToSpeech(text);
      const audioData = gemini.decodeBase64(base64Audio);
      const buffer = await gemini.decodeAudioData(audioData, audioContextRef.current!);
      
      const source = audioContextRef.current!.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContextRef.current!.destination);
      source.onended = () => setStatus(AppStatus.LISTENING);
      source.start();
    } catch (err) {
      console.error("Voice Error:", err);
      setStatus(AppStatus.ERROR);
    }
  };

  const onFrame = useCallback(async (base64: string) => {
    if (isProcessing || status === AppStatus.IDLE || !isCameraEnabled) return;
    setIsProcessing(true);
    setStatus(AppStatus.INTERPRETING);

    const text = await gemini.interpretSign(base64);
    if (text && text.toLowerCase() !== lastTranslation.toLowerCase()) {
      setLastTranslation(text);
      setHistory(prev => [{ role: 'assistant' as const, content: text, timestamp: Date.now() }, ...prev].slice(0, 10));
      await handleSpeak(text);
    } else {
      setStatus(AppStatus.LISTENING);
    }
    setIsProcessing(false);
  }, [isProcessing, status, isCameraEnabled, lastTranslation]);

  return (
    <div className="p-6 md:p-14 space-y-16 animate-fade-in">
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        {/* Left Section: Visual Feed */}
        <div className="lg:col-span-7 space-y-10">
          <CameraView 
            isCameraEnabled={isCameraEnabled} 
            isAiActive={status !== AppStatus.IDLE} 
            onFrame={onFrame} 
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 bg-[#f5f5f7] rounded-[2rem] border border-zinc-100 flex flex-col justify-between min-h-[140px]">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4">Neural Engine</span>
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-black">
                  {status === AppStatus.IDLE && 'Standby'}
                  {status === AppStatus.LISTENING && 'Listening'}
                  {status === AppStatus.INTERPRETING && 'Analyzing'}
                  {status === AppStatus.SPEAKING && 'Speaking'}
                </span>
                <div className={`w-2 h-2 rounded-full ${status !== AppStatus.IDLE ? 'bg-black animate-pulse' : 'bg-zinc-200'}`} />
              </div>
            </div>

            <div className="p-8 bg-zinc-50 border border-zinc-100 rounded-[2rem] flex flex-col justify-between min-h-[140px]">
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4">System Controls</span>
               <div className="flex gap-4">
                 <button 
                  onClick={() => { initAudio(); setIsCameraEnabled(!isCameraEnabled); }}
                  className={`flex-1 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${isCameraEnabled ? 'bg-black text-white' : 'bg-white border border-zinc-200 text-black'}`}
                 >
                   {isCameraEnabled ? 'Camera On' : 'Camera Off'}
                 </button>
                 <button 
                  onClick={() => { initAudio(); setStatus(status === AppStatus.IDLE ? AppStatus.LISTENING : AppStatus.IDLE); }}
                  className={`flex-1 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${status !== AppStatus.IDLE ? 'bg-black text-white' : 'bg-white border border-zinc-200 text-black'}`}
                 >
                   {status !== AppStatus.IDLE ? 'Stop AI' : 'Start AI'}
                 </button>
               </div>
            </div>

            {/* Added Textarea Card: Displays and allows editing of current translation */}
            <div className="md:col-span-2 p-8 bg-white border border-zinc-200 rounded-[2rem] flex flex-col space-y-4 shadow-sm">
               <div className="flex justify-between items-center">
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Write Here To Communicate</span>
                 <button 
                   onClick={() => setLastTranslation("")}
                   className="text-[10px] font-bold text-zinc-400 hover:text-black uppercase tracking-widest transition-colors"
                 >
                   Reset
                 </button>
               </div>
               <textarea
                 className="w-full min-h-[120px] bg-transparent text-2xl font-semibold text-black focus:outline-none resize-none placeholder-zinc-200 leading-tight"
                 value={lastTranslation}
                 onChange={(e) => setLastTranslation(e.target.value)}
                 placeholder="Hello ..."
               />
            </div>
          </div>
        </div>

        {/* Right Section: Transcription History */}
        <div className="lg:col-span-5 h-full flex flex-col space-y-8">
          <div className="bg-white border border-zinc-200 rounded-[3rem] flex-1 flex flex-col overflow-hidden shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] min-h-[600px]">
            <div className="p-10 border-b border-zinc-100 flex justify-between items-center">
              <h2 className="text-base font-bold tracking-tight text-black">Live Transcript</h2>
              <button 
                onClick={() => setHistory([])}
                className="text-[10px] font-bold text-zinc-300 hover:text-black uppercase tracking-widest transition-all"
              >
                Clear
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
              {history.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-30 text-center space-y-6">
                  <div className="w-16 h-16 rounded-full border border-zinc-100 flex items-center justify-center">
                     <svg className="w-6 h-6 text-zinc-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                     </svg>
                  </div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 max-w-[180px] leading-relaxed">
                    Awaiting hand gestures for translation
                  </p>
                </div>
              ) : (
                history.map((msg) => (
                  <div key={msg.timestamp} className="group flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest group-hover:text-black transition-colors">Detected Gesture</span>
                      <button 
                        onClick={() => handleSpeak(msg.content)}
                        className="w-8 h-8 rounded-full bg-[#f5f5f7] flex items-center justify-center text-zinc-400 hover:text-black hover:bg-zinc-200 transition-all shadow-sm"
                      >
                        <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-4xl font-semibold tracking-tight text-black leading-tight">
                      {msg.content}
                    </p>
                    <span className="text-[9px] font-bold text-zinc-200 font-mono tracking-widest">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #eeeeee; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #dddddd; }
      `}</style>
    </div>
  );
};

export default Stream;