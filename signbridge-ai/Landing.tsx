import React, { useState } from 'react';
interface LandingProps {
  onStart: () => void;
}

const Landing: React.FC<LandingProps> = ({ onStart }) => {

    const [currentPath, setCurrentPath] = useState<'landing' | 'stream' | 'upload'>('landing');

  return (
    <>
    <div className="flex flex-col items-center justify-center text-center px-6 min-h-[80vh] animate-fade-i">

<div className="flex flex-col items-center justify-center p-8 ">
              <div className="max-w-2xl text-center space-y-12">
                <div className="space-y-4">
                  <h1 className="text-6xl font-black tracking-tight text-black">
                    SignBridge
                  </h1>
                  <p className="text-xl font-medium text-zinc-600">
                    Real-time voice-controlled sign language translation 
                  </p>
                  <p className="text-base text-zinc-500 leading-relaxed">
                    Uses your camera and microphone to record sign language clips,
                    interprets them with Gemini Vision, and speaks the translation aloud using ElevenLabs.
                  </p>
                </div>



                <div className=" text-xs font-bold uppercase tracking-[0.3em] text-zinc-400">
                  Powered by Gemini • ElevenLabs • Web Media APIs
                </div>
              </div>
            </div>


      <div className="max-w-4xl space-y-8 ">
        <h6 className="text-2xl md:text-4xl font-bold tracking-tighter leading-[0.9] text-black">
          Communication,without barriers.
        </h6>
        <p className="text-lg md:text-xl text-zinc-500 max-w-2xl mx-auto font-medium leading-relaxed">
          SignBridge uses advanced neural processing to translate sign language into speech in real-time. Designed for the human experience.
        </p>
        


                  <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">

                  <a
                    href="https://github.com/yeabgenet/SignBridgeAi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-black hover:text-zinc-700 uppercase tracking-wider"
                  >
                    View Source →
                  </a>
                </div>

            
      </div>

      {/* Feature Grid - Updated to Card Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 max-w-6xl w-full">
        <div className="p-8 rounded-3xl bg-white border border-zinc-100 space-y-4 text-left transition-all hover:shadow-xl hover:shadow-zinc-200/50">
          <div className="w-10 h-10 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center">
            <div className="w-2 h-2 bg-black rounded-full" />
          </div>
          <h3 className="font-bold text-lg tracking-tight text-black">Real-time Vision</h3>
          <p className="text-sm text-zinc-500 leading-relaxed font-medium">Instantly interprets complex hand gestures into precise textual data using Gemini 3 Flash.</p>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-zinc-100 space-y-4 text-left transition-all hover:shadow-xl hover:shadow-zinc-200/50">
          <div className="w-10 h-10 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center">
            <div className="w-2 h-2 bg-black rounded-full" />
          </div>
          <h3 className="font-bold text-lg tracking-tight text-black">Natural Voice</h3>
          <p className="text-sm text-zinc-500 leading-relaxed font-medium">High-fidelity vocal synthesis provides a natural, human-like voice for every translation.</p>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-zinc-100 space-y-4 text-left transition-all hover:shadow-xl hover:shadow-zinc-200/50">
          <div className="w-10 h-10 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center">
            <div className="w-2 h-2 bg-black rounded-full" />
          </div>
          <h3 className="font-bold text-lg tracking-tight text-black">Privacy by Design</h3>
          <p className="text-sm text-zinc-500 leading-relaxed font-medium">Your video feed is processed securely and never stored. Communication is strictly ephemeral.</p>
        </div>
      </div>
    </div>
    



<style>{`
@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
.animate-fade-in { animation: fade-in 1s ease-out; }
`}</style>
</>
  );
};

export default Landing;