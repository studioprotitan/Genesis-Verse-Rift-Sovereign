/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Wifi, Activity, Terminal, Shield, RefreshCw } from 'lucide-react';

interface PreparingGridEntryProps {
  onBootComplete: () => void;
}

const BOOT_LOGS = [
  "UNIT_A: Initiating neural core upload...",
  "UNIT_A: Calibrating geothermal siphon-turbines...",
  "UNIT_A: Verifying Abex lock frequencies...",
  "UNIT_A: Synchronizing low-frequency sensory nodes...",
  "UNIT_A: Hydrating CORS pipelines...",
  "UNIT_A: Connecting to OSU Cognitive Brain matrix...",
];

export const PreparingGridEntry: React.FC<PreparingGridEntryProps> = ({ onBootComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentLog, setCurrentLog] = useState(BOOT_LOGS[0]);
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [agentId, setAgentId] = useState<string>(() => {
    // Attempt configuration from VITE_ELEVENLABS_AGENT_ID, fallback to a representative public placeholder ID
    return (import.meta.env.VITE_ELEVENLABS_AGENT_ID as string) || "2c8bf73df5300d8903c7349bcbd7ae67";
  });
  const [isEditingId, setIsEditingId] = useState(false);
  const [tempAgentId, setTempAgentId] = useState(agentId);

  // Load ElevenLabs widget script when progress completes
  useEffect(() => {
    if (progress >= 100) {
      const script = document.createElement('script');
      script.src = "https://elevenlabs.io/convai-widget/index.js";
      script.async = true;
      script.type = "text/javascript";
      document.body.appendChild(script);

      setIsLiveConnected(true);

      return () => {
        // Clean up script on unmount
        const existingScript = document.head.querySelector(`script[src="${script.src}"]`);
        if (existingScript) existingScript.remove();
      };
    }
  }, [progress]);

  // Loading animation simulation
  useEffect(() => {
    let index = 0;
    const intervalTime = 40; // fast loading simulation
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        
        // Progressively shift logs along with percent benchmarks
        const logIndex = Math.min(Math.floor(prev / 17), BOOT_LOGS.length - 1);
        if (BOOT_LOGS[logIndex] !== currentLog) {
          setCurrentLog(BOOT_LOGS[logIndex]);
        }

        return prev + 1;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [currentLog]);

  const handleApplyAgentId = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempAgentId.trim()) {
      setAgentId(tempAgentId.trim());
      setIsEditingId(false);
      
      // Reload script to re-initialize ElevenLabs widget with new ID
      const existingScript = document.body.querySelector('script[src="https://elevenlabs.io/convai-widget/index.js"]');
      if (existingScript) existingScript.remove();
      
      const script = document.createElement('script');
      script.src = "https://elevenlabs.io/convai-widget/index.js";
      script.async = true;
      script.type = "text/javascript";
      document.body.appendChild(script);
      
      // Post alert info to visual console
      console.log(`ElevenLabs agent synchronized: ${tempAgentId}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#030307] text-white flex flex-col justify-between p-6 overflow-hidden blueprint-grid">
      {/* Visual cyber background accents */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-950/20 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-950/20 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-20" />
      </div>

      {/* Top Header Block */}
      <header className="relative z-10 flex justify-between items-center border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-950/40 border border-orange-500/30 flex items-center justify-center font-display font-black text-orange-400 text-lg shadow-[0_0_15px_rgba(249,115,22,0.15)] animate-pulse">
            Ω
          </div>
          <div>
            <h2 className="text-sm font-extrabold tracking-widest uppercase text-white font-display">
              Genesis Verse Link
            </h2>
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest leading-none">
              SECURE GRID ACCESS CONSOLE · CO-CORE TERMINAL
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 border border-white/5 py-1 px-3 rounded-lg bg-zinc-950/40">
          <Activity size={11} className="text-orange-500 animate-pulse" />
          <span>PORTAL_LOCK: ENHANCED</span>
        </div>
      </header>

      {/* Central Interactive Brain Grid */}
      <main className="relative z-10 flex-1 flex flex-col justify-center items-center max-w-2xl mx-auto w-full py-8">
        
        <AnimatePresence mode="wait">
          {progress < 100 ? (
            /* 1. BOOT SEQUENCE SCREEN */
            <motion.div
              key="boot-screen"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              className="w-full space-y-8 text-center px-4"
            >
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-950/40 border border-orange-500/20 rounded-full text-[10px] text-orange-400 font-mono tracking-widest uppercase animate-pulse">
                  <Cpu className="w-3.5 h-3.5 animate-spin" />
                  PREPARING FOR GRID ENTRY
                </div>
                
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase font-display">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-yellow-400 to-cyan-400 drop-shadow-sm">
                    OSU Cognitive Brain
                  </span>
                </h1>
                
                <p className="text-zinc-400 font-mono text-[11px] uppercase tracking-wider max-w-md mx-auto">
                  Syncing core biological signals with tactile Abex gateway systems...
                </p>
              </div>

              {/* Progress bars UI */}
              <div className="w-full max-w-md mx-auto space-y-2">
                <div className="h-2 w-full bg-zinc-950 rounded-full border border-white/5 p-0.5 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-gradient-to-r from-orange-500 via-yellow-400 to-cyan-400 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]"
                    transition={{ duration: 0.1 }}
                  />
                </div>
                
                <div className="flex justify-between font-mono text-[9px] text-zinc-500 uppercase tracking-widest">
                  <span>BOOT_SEQUENCE_STATUS</span>
                  <span className="font-extrabold text-orange-400">{progress}% COMPLETE</span>
                </div>
              </div>

              {/* Ticker Terminal Details */}
              <div className="w-full max-w-md bg-zinc-950/80 border border-white/5 rounded-xl p-4 text-left font-mono text-[10px] text-zinc-400 space-y-1 relative overflow-hidden backdrop-blur-md">
                <div className="absolute top-2 right-3 text-[8px] uppercase font-bold text-zinc-600">UNIT_A_LOGS</div>
                <div className="text-orange-500/80 animate-pulse mb-1">&gt; STATUS: SYS_CALIBRATING</div>
                <div className="h-4 overflow-hidden text-zinc-300">
                  <span className="text-green-500">&gt; </span>{currentLog}
                </div>
              </div>
            </motion.div>
          ) : (
            /* 2. ELEVENLABS TRANSMISSION INTERFACE */
            <motion.div
              key="elevenlabs-interface"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full space-y-6 px-4"
            >
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950/40 border border-emerald-500/20 rounded-full text-[10px] text-emerald-400 font-mono tracking-widest uppercase">
                  <Wifi className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                  COGNITIVE CONNECTED
                </div>
                
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tighter uppercase font-display text-white">
                  Opening Transmission
                </h1>
                
                <p className="text-zinc-500 font-mono text-[11px] uppercase tracking-wider max-w-md mx-auto">
                  Brae Grindstone OSU Unit A Speaks Only In Canon
                </p>
              </div>

              {/* Transmission Grid Interface Panel */}
              <div className="bg-zinc-950/80 border border-orange-500/20 p-6 rounded-2xl relative overflow-hidden space-y-6 shadow-[0_0_30px_rgba(249,115,22,0.05)] backdrop-blur-xl">
                {/* Visual corners */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-orange-500/60" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-orange-500/60" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-orange-500/60" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-orange-500/60" />

                <div className="flex flex-col md:flex-row items-center gap-5">
                  {/* Holographic glowing orb representing Unit A */}
                  <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full blur-2xl opacity-10 animate-pulse" />
                    
                    {/* Pulsing circular waveform rings */}
                    <motion.div 
                      animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-0 border border-orange-500/30 rounded-full"
                    />
                    <motion.div 
                      animate={{ scale: [0.8, 1.05, 0.8], opacity: [0.5, 0.8, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute w-20 h-20 border-2 border-yellow-500/20 rounded-full"
                    />
                    <div className="w-14 h-14 rounded-full bg-zinc-900 border border-orange-500/40 flex items-center justify-center relative z-10 shadow-[inner_0_0_10px_rgba(249,115,22,0.3)]">
                      <Terminal className="w-6 h-6 text-orange-400" />
                    </div>
                  </div>

                  {/* Character speech blocks in Canon */}
                  <div className="flex-1 space-y-2.5 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-orange-400">BRAE GRINDSTONE [ OSU UNIT A ]</span>
                      <span className="font-mono text-[9px] text-zinc-500 uppercase">SYS_CO_FREQUENCY: 8.4 HZ</span>
                    </div>

                    <div className="bg-black/60 border border-white/5 p-3 rounded-xl">
                      <p className="text-zinc-200 font-mono text-sm leading-relaxed border-l-2 border-orange-500/50 pl-3">
                        "Grid calibration lock initiated. Unit A online. Core temperature stable at 4,200 Kelvin. Slag carrier link confirmed. Initiate audio link below before entering gateway matrix."
                      </p>
                    </div>
                  </div>
                </div>

                {/* Integration with ElevenLabs element widget representation */}
                <div className="border-t border-white/5 pt-5 flex flex-col items-center gap-3">
                  <div className="text-center">
                    <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">
                      Live Conversational Brain Channel
                    </span>
                    <p className="text-xs text-zinc-400 font-sans max-w-sm">
                      Tap the ElevenLabs voice agent widget positioned at the bottom-left of the screen to engage with our tactical command construct.
                    </p>
                  </div>

                  {/* Quick toggle settings to change Agent ID */}
                  <div className="w-full max-w-md pt-2">
                    {isEditingId ? (
                      <form onSubmit={handleApplyAgentId} className="flex gap-2 w-full">
                        <input 
                          type="text" 
                          value={tempAgentId} 
                          onChange={(e) => setTempAgentId(e.target.value)}
                          placeholder="PASTE ELEVENLABS AGENT ID..."
                          className="flex-1 bg-black border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-zinc-300 uppercase focus:border-orange-500/40 focus:outline-none"
                        />
                        <button 
                          type="submit"
                          className="bg-orange-600 hover:bg-orange-500 text-white text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-2 rounded-xl transition-all"
                        >
                          CONFIRM
                        </button>
                      </form>
                    ) : (
                      <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500">
                        <span>AGENT ID: <span className="text-zinc-300 uppercase">{agentId}</span></span>
                        <button 
                          type="button" 
                          onClick={() => {
                            setTempAgentId(agentId);
                            setIsEditingId(true);
                          }}
                          className="text-orange-400 hover:text-orange-300 uppercase hover:underline"
                        >
                          [ Change Agent ID ]
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Proceed Action Button */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={onBootComplete}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-bold font-display uppercase tracking-widest shadow-lg shadow-orange-950/30 border border-orange-500/30 transform active:scale-95 transition-all"
                >
                  [ AUTHORIZE CHANNEL & ENTER HUB ]
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* Cybernetic Footer diagnostic details */}
      <footer className="relative z-10 mt-4 border-t border-white/5 pt-4 flex flex-col md:flex-row justify-between items-center text-[9px] font-mono text-zinc-500 uppercase tracking-widest shrink-0 gap-2">
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-emerald-500" />
          <span>Biometric frequency encryption online</span>
        </div>
        <div className="flex items-center gap-4">
          <span>CO-CORE RESISTANCE: 94.2%</span>
          <span>SENSORY FEED: ACTIVE</span>
          <span>OSU-UNITAL-MATRIX</span>
        </div>
      </footer>

      {/* Floating ElevenLabs Speech bubble co-factor positioned at bottom-left */}
      {isLiveConnected && (
        <div className="fixed bottom-10 left-3 md:left-8 z-[100] w-[320px] md:w-[360px] h-24 scale-95 md:scale-100 transition-all origin-bottom-left pointer-events-none">
          <div className="w-full h-full relative pointer-events-auto">
            {/* Bypassing TypeScript intrinsic tag validation through React.createElement */}
            {React.createElement('elevenlabs-convai', { 
              'agent-id': agentId 
            })}
          </div>
        </div>
      )}
    </div>
  );
};
