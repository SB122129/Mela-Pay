import React from 'react';

export const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-black p-6 md:p-14 lg:p-20 animate-fade-in">
      {/* Header Section */}
      <div className="max-w-4xl mb-20">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
          The Minds Behind <span className="text-zinc-400">SignBridge.</span>
        </h1>
        <p className="text-xl md:text-2xl text-zinc-500 font-medium leading-relaxed">
          We are a team of developers dedicated to bridging the gap between human experience and artificial intelligence, ensuring that communication remains a universal right.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: The Project Story */}
        <div className="lg:col-span-7 space-y-12">
          <section className="space-y-6">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Our Mission</h2>
            <p className="text-lg text-zinc-700 leading-relaxed">
              SignBridge was born out of a simple question: <span className="text-black font-bold">"How can we use neural processing to make the world more accessible?"</span> We realized that while AI has advanced rapidly, the tools for real-time sign language translation were still lagging. We built SignBridge to be an ephemeral, secure, and instant bridge between signers and the hearing world.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Technical Execution</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-8 bg-zinc-50 rounded-[2rem] border border-zinc-100">
                <h3 className="font-bold mb-2">Visual Processing</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  We leveraged Google’s Gemini 1.5 Flash to analyze video frames, identifying complex hand movements and converting them into semantic text with low latency.
                </p>
              </div>
              <div className="p-8 bg-zinc-50 rounded-[2rem] border border-zinc-100">
                <h3 className="font-bold mb-2">Vocal Synthesis</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  By integrating ElevenLabs API, we ensured the translated text isn't just displayed, but spoken in a natural, high-fidelity human voice.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: The Developers */}
        <div className="lg:col-span-5 space-y-8">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">The Developers</h2>
          
          {/* Developer Card 1: Samson Berhanu */}
          <div className="group p-6 bg-white border border-zinc-200 rounded-[2.5rem] flex items-center gap-6 transition-all hover:shadow-xl hover:shadow-zinc-200/50">
            <div className="w-24 h-24 rounded-2xl bg-zinc-100 overflow-hidden grayscale group-hover:grayscale-0 transition-all">
              {/* Replace with actual image: <img src="/samson.jpg" alt="Samson" /> */}
              <div className="w-full h-full flex items-center justify-center text-zinc-300 font-bold">SB</div>
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight">Samson Berhanu</h3>
              <p className="text-sm text-zinc-500 font-medium">Full-Stack & AI Integration</p>
              <div className="mt-3 flex gap-4">
                <span className="text-[10px] font-black text-black uppercase tracking-widest cursor-pointer hover:underline">GitHub</span>
                <span className="text-[10px] font-black text-black uppercase tracking-widest cursor-pointer hover:underline">LinkedIn</span>
              </div>
            </div>
          </div>

          {/* Developer Card 2: Yeabsira Ketema */}
          <div className="group p-6 bg-white border border-zinc-200 rounded-[2.5rem] flex items-center gap-6 transition-all hover:shadow-xl hover:shadow-zinc-200/50">
            <div className="w-24 h-24 rounded-2xl bg-zinc-100 overflow-hidden grayscale group-hover:grayscale-0 transition-all">
              {/* Replace with actual image: <img src="/yeabsira.jpg" alt="Yeabsira" /> */}
              <div className="w-full h-full flex items-center justify-center text-zinc-300 font-bold">YK</div>
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight">Yeabsira Ketema</h3>
              <p className="text-sm text-zinc-500 font-medium">UI/UX & Frontend Architecture</p>
              <div className="mt-3 flex gap-4">
                <span className="text-[10px] font-black text-black uppercase tracking-widest cursor-pointer hover:underline">GitHub</span>
                <span className="text-[10px] font-black text-black uppercase tracking-widest cursor-pointer hover:underline">LinkedIn</span>
              </div>
            </div>
          </div>
        </div>
      </div>


       
        <div className="flex gap-8 text-[10px] font-bold uppercase tracking-[0.3em] mt-12 text-black">
          
          <span>Addis Ababa, Ethiopia</span>
        </div>
      
    </div>
  );
};

export default About;