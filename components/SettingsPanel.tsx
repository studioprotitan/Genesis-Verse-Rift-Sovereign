/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Settings, 
  Lock, 
  Unlock, 
  Cpu, 
  ShieldCheck, 
  Terminal as TermIcon, 
  Volume2, 
  Trash2, 
  Check, 
  AlertCircle,
  Clock,
  Fingerprint,
  Music
} from 'lucide-react';
import { DevLogTerminal } from './DevLogTerminal';
import { ambientSoundscape, playSyntheticDiagnosticSound } from '../lib/ambientMusic';

interface SettingsPanelProps {
  onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'GENERAL' | 'ADVANCED'>('GENERAL');
  
  // 2FA Security System State
  const [is2faVerified, setIs2faVerified] = useState(() => {
    return localStorage.getItem('genesis-verse-2fa-passed') === 'true';
  });
  const [inputCode, setInputCode] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Configuration settings (simulated client preferences)
  const [hologramIntensity, setHologramIntensity] = useState(85);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [soundDiagnostics, setSoundDiagnostics] = useState(() => {
    return localStorage.getItem('genesis-verse-sound-diagnostics') !== 'false';
  });
  const [ambientSound, setAmbientSound] = useState(() => {
    return localStorage.getItem('genesis-verse-ambient-sound') === 'true';
  });
  const [autoSync, setAutoSync] = useState(true);
  const [ambientTheme, setAmbientTheme] = useState<'slate' | 'cosmic' | 'abyss'>('cosmic');

  useEffect(() => {
    if (ambientSound) {
      ambientSoundscape.start();
    } else {
      ambientSoundscape.stop();
    }
  }, [ambientSound]);

  // Trigger token simulation
  const handleRequestToken = () => {
    setIsGenerating(true);
    setErrorMsg(null);
    setInputCode('');
    
    setTimeout(() => {
      // 6 Digit passcode
      const r1 = Math.floor(100 + Math.random() * 900);
      const r2 = Math.floor(100 + Math.random() * 900);
      const code = `${r1}-${r2}`;
      setGeneratedCode(code);
      setIsGenerating(false);
      setTimeRemaining(45); // 45 seconds to type
    }, 1200);
  };

  // Timer countdown
  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && generatedCode) {
      setGeneratedCode(null);
      setErrorMsg("TRANSMISSION TOKEN EXPIRED. REQUEST A FRESH FREQUENCY PAYLOAD.");
    }
  }, [timeRemaining, generatedCode]);

  // Submission handler
  const handleVerify2FA = (e: React.FormEvent) => {
    e.preventDefault();
    if (!generatedCode) {
      setErrorMsg("NO TOKEN DETECTED. RETRIEVE A SIGNED SYNC KEY FIRST.");
      return;
    }

    const cleanInput = inputCode.trim().replace(/\s+/g, '');
    const cleanGenerated = generatedCode.replace(/-/g, '');

    if (cleanInput === cleanGenerated || cleanInput === generatedCode) {
      setIs2faVerified(true);
      setErrorMsg(null);
      localStorage.setItem('genesis-verse-2fa-passed', 'true');
    } else {
      setErrorMsg("MUTUAL CO-FACTOR SYNCHRONIZATION FAILURE. SECURITY FREQUENCY DRIFT DETECTED.");
    }
  };

  const handleReset2FA = () => {
    setIs2faVerified(false);
    setGeneratedCode(null);
    setInputCode('');
    setErrorMsg(null);
    setTimeRemaining(0);
    localStorage.removeItem('genesis-verse-2fa-passed');
  };

  const handlePurgeAllStorage = () => {
    if (window.confirm("CRITICAL DELETION REQUEST: Wipe all local state archives, bookmarks, and parameters permanently?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
      {/* Dark backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
      />

      {/* Main interface frame */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 15 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-5xl h-[85vh] bg-[#030307]/95 border border-white/10 rounded-2xl flex flex-col pointer-events-auto overflow-hidden shadow-2xl blueprint-grid"
      >
        {/* CRT Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.12)_50%)] bg-[length:100%_4px] opacity-10 pointer-events-none z-30" />

        {/* Panel Header */}
        <header className="px-5 py-4 border-b border-white/5 bg-zinc-950/80 flex items-center justify-between relative z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-950/40 border border-orange-500/20 flex items-center justify-center font-bold text-orange-400 text-sm animate-pulse shadow-[0_0_10px_rgba(249,115,22,0.2)]">
              ⚙️
            </div>
            <div>
              <h3 className="text-xs font-extrabold tracking-widest font-display uppercase text-white leading-none">
                GENESIS VERSE CONTROL PANEL
              </h3>
              <p className="text-[9px] font-mono text-zinc-500 leading-none mt-1 uppercase tracking-widest">
                CO-CORE HYBRID COGNITION UTILITY
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Modular Tab Selection Bar */}
            <div className="flex rounded-lg bg-zinc-950 p-0.5 border border-white/5 font-mono text-[9px] font-bold">
              {/* General Settings button with Gear Icon */}
              <button
                type="button"
                onClick={() => setActiveTab('GENERAL')}
                className={`px-3 py-1 rounded-md transition-all uppercase flex items-center gap-1.5 cursor-pointer ${activeTab === 'GENERAL' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/15' : 'text-zinc-550 hover:text-zinc-300'}`}
              >
                <Settings size={10} />
                <span>GENERAL</span>
              </button>

              {/* Advanced Settings with Lock Icon */}
              <button
                type="button"
                onClick={() => setActiveTab('ADVANCED')}
                className={`px-3 py-1 rounded-md transition-all uppercase flex items-center gap-1.5 cursor-pointer ${activeTab === 'ADVANCED' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/15' : 'text-zinc-550 hover:text-zinc-300'}`}
              >
                {is2faVerified ? <Unlock size={10} className="text-emerald-400" /> : <Lock size={10} />}
                <span>ADVANCED</span>
              </button>
            </div>

            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-lg border border-white/5 hover:border-red-500/20 hover:bg-red-950/20 text-gray-400 hover:text-red-400 flex items-center justify-center transition-all cursor-pointer"
            >
              <X size={15} />
            </button>
          </div>
        </header>

        {/* Scrollable Container Body */}
        <div className="flex-1 overflow-y-auto relative z-10 p-6 md:p-8 scrollbar-thin">
          <AnimatePresence mode="wait">
            {activeTab === 'GENERAL' ? (
              /* TAB 1: GENERAL PREFERENCES & SETTINGS */
              <motion.div
                key="general-tab"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="max-w-3xl mx-auto space-y-8"
              >
                {/* Visual Intro Banner */}
                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-bold text-orange-500 tracking-widest uppercase">
                    SYS_ENVIRONMENT PREFERENCES
                  </h4>
                  <h3 className="text-xl font-extrabold uppercase font-display text-white">
                    Integrated Sync Settings
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed font-mono">
                    Fine-tune the neural spectrum feedback loops, local cache indexes, and environmental theme calibrations mapped across the Genesis grid.
                  </p>
                </div>

                {/* Controls Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  
                  {/* Hologram Intensity Calibration */}
                  <div className="p-4 bg-zinc-950/60 border border-white/5 rounded-xl space-y-3 font-mono text-[11px]">
                    <div className="flex justify-between items-center text-zinc-400 uppercase">
                      <span className="font-bold flex items-center gap-1.5"><Cpu size={12} className="text-orange-500" /> Scanner Intensity</span>
                      <span className="text-orange-400 font-bold">{hologramIntensity}%</span>
                    </div>
                    <input 
                      type="range"
                      min="20"
                      max="100"
                      value={hologramIntensity}
                      onChange={(e) => setHologramIntensity(parseInt(e.target.value))}
                      className="w-full h-1 bg-zinc-900 rounded-lg accent-orange-500 cursor-pointer"
                    />
                    <p className="text-[9px] text-zinc-550 uppercase">AMPLIFIES VEO-3 EMISSION FLUX LIMITERS.</p>
                  </div>

                  {/* Sound Toggle */}
                  <div className="p-4 bg-zinc-950/60 border border-white/5 rounded-xl flex items-center justify-between font-mono text-[11px] select-none">
                    <div className="space-y-1 pr-4">
                      <span className="font-bold text-zinc-400 flex items-center gap-1.5"><Volume2 size={12} /> Sound Synapse Feedback</span>
                      <p className="text-[9px] text-zinc-550 uppercase">EMIT SONIC SHIFT CHIRPS ON PORTAL EVENTS.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className={`w-12 h-6 rounded-full p-1 transition-all flex items-center cursor-pointer ${soundEnabled ? 'bg-orange-500 justify-end' : 'bg-zinc-900 justify-start'}`}
                    >
                      <motion.div layout className="w-4 h-4 bg-white rounded-full shadow-md" />
                    </button>
                  </div>

                  {/* Ambient Soundscape Toggle */}
                  <div className="p-4 bg-zinc-950/60 border border-white/5 rounded-xl flex items-center justify-between font-mono text-[11px] select-none">
                    <div className="space-y-1 pr-4">
                      <span className="font-bold text-zinc-400 flex items-center gap-1.5"><Music size={12} className={ambientSound ? "animate-pulse text-cyan-400" : ""} /> Ambient Soundscape</span>
                      <p className="text-[9px] text-zinc-550 uppercase">LOW-VOLUME SYNTHETIC FREQUENCY CHORD DRONE.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newVal = !ambientSound;
                        setAmbientSound(newVal);
                        localStorage.setItem('genesis-verse-ambient-sound', newVal ? 'true' : 'false');
                      }}
                      className={`w-12 h-6 rounded-full p-1 transition-all flex items-center cursor-pointer ${ambientSound ? 'bg-cyan-500 justify-end border border-cyan-500/20' : 'bg-zinc-900 justify-start'}`}
                    >
                      <motion.div layout className="w-4 h-4 bg-white rounded-full shadow-md" />
                    </button>
                  </div>

                  {/* Hologram Theme Options */}
                  <div className="p-4 bg-zinc-950/60 border border-white/5 rounded-xl space-y-2.5 font-mono text-[11px]">
                    <span className="font-bold text-zinc-400 uppercase">Ambient Color Spectrum Theme</span>
                    <div className="grid grid-cols-3 gap-2">
                      {['cosmic', 'slate', 'abyss'].map((thm) => (
                        <button
                          key={thm}
                          type="button"
                          onClick={() => setAmbientTheme(thm as any)}
                          className={`py-1.5 rounded-lg border text-[9px] font-bold uppercase transition-all cursor-pointer ${ambientTheme === thm ? 'bg-orange-500/10 border-orange-500/30 text-orange-400 font-black' : 'border-white/5 bg-black/40 text-zinc-500 hover:text-zinc-300'}`}
                        >
                          {thm}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Auto telemetry sync toggle */}
                  <div className="p-4 bg-zinc-950/60 border border-white/5 rounded-xl flex items-center justify-between font-mono text-[11px] select-none">
                    <div className="space-y-1 pr-4">
                      <span className="font-bold text-zinc-400 flex items-center gap-1.5"><ShieldCheck size={12} /> Automatic Security Sync</span>
                      <p className="text-[9px] text-zinc-550 uppercase">STREAM ERROR FEEDBACK SAFELY TO LOG_SATELLITE.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAutoSync(!autoSync)}
                      className={`w-12 h-6 rounded-full p-1 transition-all flex items-center cursor-pointer ${autoSync ? 'bg-orange-500/100 justify-end' : 'bg-zinc-900 justify-start'}`}
                    >
                      <motion.div layout className="w-4 h-4 bg-white rounded-full shadow-md" />
                    </button>
                  </div>

                  {/* Sound Diagnostics Feedback */}
                  <div className="p-4 bg-zinc-950/60 border border-white/5 rounded-xl flex flex-col gap-4 font-mono text-[11px] select-none col-span-1 md:col-span-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1 pr-4">
                        <span className="font-bold text-zinc-400 flex items-center gap-1.5">
                          <Volume2 size={12} className={soundDiagnostics ? "text-cyan-400 animate-pulse" : "text-zinc-500"} /> 
                          Sound Diagnostics & Audio Feedback
                        </span>
                        <p className="text-[9px] text-zinc-550 uppercase">
                          ENABLE REAL-TIME SYNTHETIC COGNITIVE SOUND FEEDBACK ON GRID INTERACTIONS.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const val = !soundDiagnostics;
                          setSoundDiagnostics(val);
                          localStorage.setItem('genesis-verse-sound-diagnostics', val ? 'true' : 'false');
                          if (val) {
                            // Play a nice success beep immediately to confirm audio configuration
                            playSyntheticDiagnosticSound('success', true);
                          }
                        }}
                        className={`w-12 h-6 rounded-full p-1 transition-all flex items-center cursor-pointer ${soundDiagnostics ? 'bg-cyan-500 justify-end border border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.3)]' : 'bg-zinc-900 justify-start'}`}
                      >
                        <motion.div layout className="w-4 h-4 bg-white rounded-full shadow-md" />
                      </button>
                    </div>

                    {soundDiagnostics && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-white/5 pt-3 space-y-3"
                      >
                        <div className="flex items-center justify-between text-[8px] text-cyan-400/70 font-bold uppercase tracking-widest leading-none">
                          <span>SYNTHESIZER CORE INTERACTIVE DIAGNOSTICS BOARD</span>
                          <span className="animate-pulse">ONLINE [WEB_AUDIO_CORE]</span>
                        </div>

                        {/* Interactive Soundboard buttons */}
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                          <button
                            type="button"
                            onClick={() => playSyntheticDiagnosticSound('click', true)}
                            className="bg-zinc-900 hover:bg-zinc-800 border border-white/5 hover:border-cyan-500/40 text-zinc-300 hover:text-cyan-400 font-bold tracking-wider py-2 font-mono text-[9px] uppercase rounded-lg transition-all cursor-pointer flex flex-col items-center justify-center gap-1"
                            title="Test basic button tap feedback"
                          >
                            <span className="text-[8px] opacity-45">01 // CLICK</span>
                            <span className="text-[9px]">TAP CHIRP</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => playSyntheticDiagnosticSound('success', true)}
                            className="bg-zinc-900 hover:bg-zinc-800 border border-white/5 hover:border-emerald-500/40 text-zinc-300 hover:text-emerald-400 font-bold tracking-wider py-2 font-mono text-[9px] uppercase rounded-lg transition-all cursor-pointer flex flex-col items-center justify-center gap-1"
                            title="Test core success feedback"
                          >
                            <span className="text-[8px] opacity-45">02 // SUCCESS</span>
                            <span className="text-[9px]">ARPEGGIO</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => playSyntheticDiagnosticSound('peak', true)}
                            className="bg-zinc-900 hover:bg-zinc-800 border border-white/5 hover:border-amber-500/40 text-zinc-300 hover:text-amber-400 font-bold tracking-wider py-2 font-mono text-[9px] uppercase rounded-lg transition-all cursor-pointer flex flex-col items-center justify-center gap-1"
                            title="Test micro-charge peak signal"
                          >
                            <span className="text-[8px] opacity-45">03 // PEAK</span>
                            <span className="text-[9px]">CHARGE RISE</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => playSyntheticDiagnosticSound('laser', true)}
                            className="bg-zinc-900 hover:bg-zinc-800 border border-white/5 hover:border-cyan-500/40 text-zinc-300 hover:text-cyan-400 font-bold tracking-wider py-2 font-mono text-[9px] uppercase rounded-lg transition-all cursor-pointer flex flex-col items-center justify-center gap-1"
                            title="Test blueprint vector scan sweep sound"
                          >
                            <span className="text-[8px] opacity-45">04 // LASER</span>
                            <span className="text-[9px]">SCAN SWEEP</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => playSyntheticDiagnosticSound('alert', true)}
                            className="bg-zinc-900 hover:bg-zinc-800 border-white/5 hover:border-red-500/40 text-zinc-300 hover:text-red-400 font-bold tracking-wider py-2 font-mono text-[9px] uppercase rounded-lg transition-all cursor-pointer col-span-2 sm:col-span-1 flex flex-col items-center justify-center gap-1"
                            title="Test critical state alert sirene sound"
                          >
                            <span className="text-[8px] opacity-45">05 // ALERT</span>
                            <span className="text-[9px]">ALARM HORN</span>
                          </button>
                        </div>

                        {/* Interactive oscillator controller display */}
                        <div className="flex justify-between items-center bg-[#050e20] p-2 rounded-lg border border-cyan-500/25 text-[8px] text-zinc-400 uppercase tracking-wide">
                          <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
                            CALIBRATOR STATE: ACTIVE TEST_SINE_MATRIX
                          </span>
                          <span>LATENCY: &lt;1.8MS // GAIN_CLAMP: 0.08X</span>
                        </div>
                      </motion.div>
                    )}
                  </div>

                </div>

                {/* Hard Core Storage reset */}
                <div className="p-5 border border-red-500/15 bg-red-950/10 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-[11px]">
                  <div className="space-y-1">
                    <span className="font-extrabold text-red-400 uppercase flex items-center gap-1.5">
                      <AlertCircle size={13} /> DANGER SECTOR: CACHE COGNITIVE RESET
                    </span>
                    <p className="text-[9.5px] text-zinc-500 uppercase leading-snug">
                      Wipes custom developer transmission logs, lore bookmarks, and 2FA credentials back to structural baseline.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handlePurgeAllStorage}
                    className="px-4 py-2 border border-red-500/20 bg-red-950/30 hover:bg-red-900/40 hover:border-red-400/40 text-red-400 hover:text-white font-bold uppercase text-[9.5px] tracking-wider rounded-xl transition-all cursor-pointer shrink-0"
                  >
                    WIPE GRID MEMORY
                  </button>
                </div>

              </motion.div>
            ) : (
              /* TAB 2: ADVANCED SETTINGS WITH 2FA VERIFICATION */
              <motion.div
                key="advanced-tab"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="w-full flex flex-col items-center"
              >
                {!is2faVerified ? (
                  /* 2FA LOCK CHALLENGE PAGE */
                  <div className="max-w-md w-full space-y-6 pt-4 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-12 h-12 rounded-full border border-red-500/20 bg-red-950/20 flex items-center justify-center text-red-500 animate-pulse">
                        <Lock size={20} />
                      </div>
                      <h4 className="text-[10px] font-mono font-bold text-red-500 tracking-widest uppercase">
                        CO-CORE ACCESS BLOCKERED
                      </h4>
                      <h3 className="text-2xl font-extrabold uppercase font-display text-white">
                        Advanced Settings Restricted
                      </h3>
                      <p className="text-xs text-zinc-500 font-mono uppercase leading-relaxed">
                        Authorized clearance and Genesis Dev Log Console requires Two-Factor Neural authentication below.
                      </p>
                    </div>

                    {/* 2FA Form Engine */}
                    <form onSubmit={handleVerify2FA} className="bg-zinc-950/80 border border-white/5 p-6 rounded-2xl space-y-5 text-left relative overflow-hidden font-mono">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">
                          Enter Neural Key Coordinate
                        </label>
                        <input 
                          type="text" 
                          value={inputCode}
                          onChange={(e) => setInputCode(e.target.value)}
                          placeholder="PASTE 6-DIGIT PASSCODE (E.G. 123-456)"
                          className="w-full bg-black border border-white/5 font-mono text-center text-sm tracking-widest text-white rounded-lg py-2.5 uppercase focus:outline-none focus:border-cyan-500/40"
                          maxLength={8}
                          required
                        />
                      </div>

                      {errorMsg && (
                        <p className="text-[8.5px] text-red-400 uppercase leading-snug text-center border-t border-red-500/10 pt-2 font-bold animate-pulse">
                          {errorMsg}
                        </p>
                      )}

                      <button
                        type="submit"
                        className="w-full py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-black font-extrabold text-[10px] tracking-wider rounded-xl transition-all cursor-pointer uppercase flex items-center justify-center gap-1.5"
                      >
                        <Fingerprint size={12} />
                        VERIFY CO-FACTOR CLEARANCE
                      </button>

                      {/* Code Generator Widget */}
                      <div className="border-t border-white/5 pt-4 space-y-2.5">
                        <div className="flex justify-between items-center text-[8.5px] text-zinc-650 font-bold uppercase">
                          <span>TEMPORARY PASSCODE FREQUENCY SYNC</span>
                          <span>OSU PORTAL CO-RESONANCE</span>
                        </div>
                        
                        {!generatedCode ? (
                          <button
                            type="button"
                            onClick={handleRequestToken}
                            disabled={isGenerating}
                            className="w-full py-2 bg-zinc-900 border border-white/5 hover:border-white/10 text-cyan-400 hover:text-white transition-all text-[9.5px] font-bold tracking-wider rounded-xl uppercase cursor-pointer text-center"
                          >
                            {isGenerating ? "SIGNING TOKEN KEY..." : "[ EMIT NEURAL TOKEN FROM OSU UNIT A ]"}
                          </button>
                        ) : (
                          <div className="p-3 bg-cyan-950/10 border border-cyan-500/20 text-center rounded-xl space-y-1">
                            <p className="text-[8px] text-zinc-500 uppercase font-bold tracking-widest">
                              ACTIVE TRANSFERRED TOKEN PAYLOAD
                            </p>
                            <p className="text-lg font-bold text-cyan-400 tracking-widest animate-pulse selection:bg-cyan-500/25">
                              {generatedCode}
                            </p>
                            <div className="flex justify-center items-center gap-1 text-[8px] text-zinc-500 uppercase font-bold pt-1">
                              <Clock size={10} className="animate-spin-slow text-amber-500" />
                              <span>Token expires in <span className="text-amber-500 font-black">{timeRemaining}s</span></span>
                            </div>
                          </div>
                        )}
                      </div>
                    </form>
                  </div>
                ) : (
                  /* NEURAL SECURITY UNLOCKED: EMBEDDED DEV LOG TERMINAL */
                  <motion.div
                    key="unlocked-dev-console"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full space-y-6"
                  >
                    {/* Header bar indicating 2FA verify lock state */}
                    <div className="p-3 rounded-2xl bg-emerald-950/20 border border-emerald-500/25 flex flex-col sm:flex-row items-center justify-between font-mono gap-2 text-[10px] w-full max-w-6xl mx-auto uppercase">
                      <div className="flex items-center gap-2 font-bold text-emerald-400">
                        <Unlock size={12} />
                        <span>CO-FACTOR NEURAL VERIFIED · ADMIN CLEARANCE STABLE</span>
                      </div>
                      
                      <button 
                        type="button"
                        onClick={handleReset2FA}
                        className="text-red-400 hover:text-white transition-colors cursor-pointer"
                      >
                        [ REVOKE AND LOCK TRANSITIONS ]
                      </button>
                    </div>

                    {/* Renders DevLogTerminal perfectly embedded */}
                    <div className="w-full flex justify-center pb-8 p-0">
                      <div className="w-full max-w-6xl rounded-2xl border border-white/5 bg-zinc-950/20 p-2 overflow-hidden shadow-2xl relative">
                        {/* Shimmer overlay */}
                        <div className="absolute top-0 left-0 w-2 h-2 bg-cyan-500 z-10" />
                        <DevLogTerminal />
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer info bar details */}
        <footer className="relative z-10 px-5 py-3 border-t border-white/5 bg-zinc-950/60 flex justify-between items-center font-mono text-[8.5px] text-zinc-650 uppercase tracking-widest shrink-0 select-none">
          <span>CO-CORE CONSOLE PARSER: HYDRATED</span>
          <span>SYSTEM INTEGRITY: 100% SECURE</span>
        </footer>

      </motion.div>
    </div>
  );
};
