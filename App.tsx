/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PortalSelector } from './components/PortalSelector';
import { CharacterDashboard } from './components/CharacterDashboard';
import { LoreCodex } from './components/LoreCodex';
import { PreparingGridEntry } from './components/PreparingGridEntry';
import { AugmentedImageConsole } from './components/AugmentedImageConsole';
import { SettingsPanel } from './components/SettingsPanel';
import { SystemToasts, Toast } from './components/SystemToasts';
import { TacticalBlueprint } from './components/TacticalBlueprint';
import { playSyntheticDiagnosticSound } from './lib/ambientMusic';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Sparkles, Terminal, Settings, Layers } from 'lucide-react';

type HubView = 'portal' | 'war-witch' | 'jane-district' | 'arenas-echelon';

function App() {
  const [view, setView] = useState<HubView>('portal');
  const [isBooted, setIsBooted] = useState(false);
  const [isAicOpen, setIsAicOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isBlueprintOpen, setIsBlueprintOpen] = useState(false);

  // System Power / Interactive Battery Reactor loops
  const [powerLevel, setPowerLevel] = useState(72);
  const [activityFlash, setActivityFlash] = useState(false);
  const [activityText, setActivityText] = useState('BALANCED');

  // Toast notifications states
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [lastAlertState, setLastAlertState] = useState<'LOW' | 'OVERCHARGE' | 'NORMAL'>('NORMAL');

  const addToast = (title: string, message: string, type: 'critical' | 'overcharge' | 'info') => {
    const newToast: Toast = {
      id: Math.random().toString(36).substring(2, 9) + Date.now().toString(),
      title,
      message,
      type,
      duration: 6000,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Trigger thematic alert toasts on critical power status shifts
  useEffect(() => {
    if (powerLevel === 100) {
      if (lastAlertState !== 'OVERCHARGE') {
        addToast(
          'GRID OVERCHARGE DETECTED',
          'Primary core power has peaked at 100%. Quantum storage modules are saturated. System performance running at hyperclock levels.',
          'overcharge'
        );
        playSyntheticDiagnosticSound('success');
        setLastAlertState('OVERCHARGE');
      }
    } else if (powerLevel <= 35) {
      if (lastAlertState !== 'LOW') {
        addToast(
          'CRITICAL POWER RESERVES',
          'System energy depleted below critical threshold (35%). Deploying localized kinetic absorption. Clicks or keys will recharge core batteries.',
          'critical'
        );
        playSyntheticDiagnosticSound('alert');
        setLastAlertState('LOW');
      }
    } else {
      if (lastAlertState !== 'NORMAL') {
        setLastAlertState('NORMAL');
      }
    }
  }, [powerLevel, lastAlertState]);

  useEffect(() => {
    // 1. Idle power decay over time
    const interval = setInterval(() => {
      setPowerLevel((prev) => {
        if (prev > 16) {
          const nextVal = prev - 1;
          updateStatusText(nextVal);
          return nextVal;
        }
        return prev;
      });
    }, 4500);

    const updateStatusText = (val: number) => {
      if (val === 100) setActivityText('OVERCHARGE');
      else if (val > 75) setActivityText('OPTIMAL');
      else if (val > 35) setActivityText('BALANCED');
      else setActivityText('LOW RESERVES');
    };

    // 2. Click or Keystroke activity kinetic absorbsion
    const handleActivity = (e: MouseEvent | KeyboardEvent) => {
      setActivityFlash(true);
      setTimeout(() => setActivityFlash(false), 250);

      // Play soft tap audio feedback for every core interaction if sound diagnostics is checked
      playSyntheticDiagnosticSound('click');

      setPowerLevel((prev) => {
        const rechargeAmt = e.type === 'click' ? 4 : 2;
        const nextVal = Math.min(prev + rechargeAmt, 100);
        updateStatusText(nextVal);
        return nextVal;
      });
    };

    window.addEventListener('click', handleActivity);
    window.addEventListener('keydown', handleActivity);

    return () => {
      clearInterval(interval);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    };
  }, []);

  // Simple, bulletproof hash-router sync
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#/war-witch') {
        setView('war-witch');
      } else if (hash === '#/jane-district') {
        setView('jane-district');
      } else if (hash === '#/arenas-echelon') {
        setView('arenas-echelon');
      } else {
        setView('portal');
        // Clean up empty hashes nicely
        if (hash !== '' && hash !== '#/') {
          window.location.hash = '#/';
        }
      }
    };

    // Listen to changes
    window.addEventListener('hashchange', handleHashChange);
    // Execute on initial mounting
    handleHashChange();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleSelectCharacter = (id: string) => {
    window.location.hash = `#/${id}`;
  };

  const handleBackToPortal = () => {
    window.location.hash = '#/';
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {!isBooted && (
          <PreparingGridEntry onBootComplete={() => setIsBooted(true)} />
        )}
      </AnimatePresence>

      <div className="min-h-screen w-screen bg-[#050509] text-white selection:bg-orange-500/30 selection:text-orange-200 overflow-x-hidden flex flex-col relative">
        
        {/* Dynamic Ambient Background Elements */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Soft, pulsing orange halo representing the Forge/Abyssum depth */}
          <div className="absolute top-[-20%] left-[-15%] w-[60%] h-[60%] bg-orange-900/10 rounded-full blur-[140px] ambient-glow-orange" />
          
          {/* Soft, pulsing deep blue representing the Echelon clouds */}
          <div className="absolute bottom-[-20%] right-[-15%] w-[60%] h-[60%] bg-blue-900/10 rounded-full blur-[140px] ambient-glow-blue" />
          
          {/* Subtle scanline CRT background layer */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_4px] opacity-15" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto flex-1 flex flex-col p-4 md:p-6 min-h-screen">
          
          {/* Top Hub Navbar */}
          <header className="flex-none flex justify-between items-center pb-4 border-b border-white/5 mb-4 relative z-20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-cyan-500 flex items-center justify-center font-display font-black text-black text-sm shadow-md">
                Ω
              </div>
              <div>
                <h2 className="text-sm font-extrabold tracking-widest uppercase text-white font-display">
                  Genesis Verse
                </h2>
                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest leading-none">
                  ENIGMATIC HUB CLIENT
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 items-center">
              {/* Specialized System Power / Interactive Battery Reactor */}
              <div 
                className={`hidden md:flex items-center gap-3 border px-3 py-1.5 rounded-lg transition-all font-mono text-[9px] select-none ${
                  activityFlash 
                    ? 'border-cyan-500 bg-cyan-950/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
                    : 'border-white/5 bg-zinc-950/40'
                }`}
                title="Interactive Kinetic Battery. Boosts on keys / clicks!"
              >
                <div className="flex flex-col text-right">
                  <span className="text-[7.5px] text-zinc-550 leading-none uppercase">CORE POWER</span>
                  <span className={`font-black tracking-widest leading-none mt-1 uppercase ${
                    powerLevel > 75 
                      ? 'text-emerald-400' 
                      : powerLevel > 35 
                        ? 'text-amber-400' 
                        : 'text-red-500'
                  }`}>
                    {powerLevel}% {activityText}
                  </span>
                </div>

                {/* Battery physical representation */}
                <div className="flex items-center gap-0.5 border border-zinc-700 p-0.5 rounded w-9 h-4.5 relative">
                  <div 
                    className={`h-full rounded-sm transition-all duration-300 ${
                      powerLevel > 75 
                        ? 'bg-emerald-500' 
                        : powerLevel > 35 
                          ? 'bg-amber-500' 
                          : 'bg-red-500'
                    }`} 
                    style={{ width: `${powerLevel}%` }} 
                  />
                  <div className="w-[1.5px] h-1.5 bg-zinc-700 absolute -right-[2.5px] rounded-r-xs top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Settings / Gear Icon Trigger */}
              <button
                type="button"
                onClick={() => setIsSettingsOpen(true)}
                className="text-xs font-mono text-orange-400 hover:text-white flex items-center gap-1.5 transition-all uppercase border border-orange-500/25 py-1.5 px-3 rounded-lg bg-orange-950/20 hover:bg-orange-950/40 hover:shadow-[0_0_15px_rgba(249,115,22,0.15)] cursor-pointer"
                title="System Settings / Advanced Core Controls"
              >
                <Settings size={11} className="text-orange-400" />
                <span>[ Control Panel ]</span>
              </button>

              {/* Tactical Blueprint Toggle Trigger */}
              <button
                type="button"
                onClick={() => {
                  const transitionTo = !isBlueprintOpen;
                  setIsBlueprintOpen(transitionTo);
                  addToast(
                    transitionTo ? 'BLUEPRINT INTERFACE ROUTED' : 'STANDARD COMM-CHANNELS ACTIVE',
                    transitionTo 
                      ? 'Tactical blueprint telemetry overlay has been deployed. Tracking modular real-time coordinate sensors.' 
                      : 'Decommissioned high-immersion wireframe grid matrix. Returned viewport streams to root console.',
                    'info'
                  );
                  playSyntheticDiagnosticSound(transitionTo ? 'laser' : 'click');
                }}
                className={`text-xs font-mono flex items-center gap-1.5 transition-all uppercase border py-1.5 px-3 rounded-lg cursor-pointer ${
                  isBlueprintOpen
                    ? 'border-cyan-400 bg-cyan-400 text-black font-black shadow-[0_0_15px_rgba(34,211,238,0.45)]'
                    : 'border-cyan-500/25 text-cyan-400 hover:text-white bg-cyan-950/20 hover:bg-cyan-950/40 hover:shadow-[0_0_15px_rgba(34,211,238,0.15)]'
                }`}
                title="Toggle High-Immersion Architectural Blueprint Grid Overlay"
              >
                <Layers size={11} className={isBlueprintOpen ? 'rotate-90 text-black' : 'animate-pulse text-cyan-400'} />
                <span>[ Blueprint ]</span>
              </button>

              {/* Augmented Image Console Trigger */}
              <button
                type="button"
                onClick={() => setIsAicOpen(true)}
                className="text-xs font-mono text-cyan-400 hover:text-white flex items-center gap-1.5 transition-all uppercase border border-cyan-500/25 py-1.5 px-3 rounded-lg bg-cyan-950/20 hover:bg-cyan-950/40 hover:shadow-[0_0_15px_rgba(34,211,238,0.15)] cursor-pointer"
              >
                <Sparkles size={11} className="text-cyan-400 animate-pulse" />
                <span>[ AIC Scanner ]</span>
              </button>

              {/* Reset calibrator / Return to boot state */}
              <button
                type="button"
                onClick={() => setIsBooted(false)}
                className="text-xs font-mono text-orange-400 hover:text-white flex items-center gap-1.5 transition-all uppercase border border-orange-500/20 py-1.5 px-3 rounded-lg bg-orange-950/10 hover:bg-orange-950/20 cursor-pointer"
                title="Recalibrate OSU Brain Matrix"
              >
                <Terminal size={11} />
                <span className="hidden sm:inline">[ Calibrate ]</span>
              </button>

              {view !== 'portal' && (
                <button 
                  onClick={handleBackToPortal} 
                  className="text-xs font-mono text-gray-500 hover:text-orange-400 flex items-center gap-1.5 transition-colors uppercase border border-white/5 py-1.5 px-3 rounded-lg bg-white/5 cursor-pointer"
                >
                  <RefreshCw size={11} className="animate-spin-slow" /> [ Reset Core ]
                </button>
              )}
            </div>
          </header>

          {/* Primary Content View with Router animations */}
          <main className={`flex-1 flex flex-col justify-center w-full relative ${powerLevel < 20 ? 'power-critical-flicker' : ''}`}>
            <AnimatePresence mode="wait">
              {view === 'portal' ? (
                <motion.div
                  key="portal-selector"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98, y: -10 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                >
                  <PortalSelector onSelectCharacter={handleSelectCharacter} />
                </motion.div>
              ) : (
                <motion.div
                  key={`dashboard-${view}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="w-full flex-1 flex flex-col"
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                >
                  <CharacterDashboard characterId={view} onBackToPortals={handleBackToPortal} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tactical Blueprint Immersive Overlay Layer */}
            <AnimatePresence>
              {isBlueprintOpen && (
                <TacticalBlueprint 
                  isVisible={isBlueprintOpen} 
                  onClose={() => {
                    setIsBlueprintOpen(false);
                    addToast(
                      'STANDARD COMM-CHANNELS ACTIVE',
                      'Deactivated tactical blueprint. Reverted core views to standard console stream.',
                      'info'
                    );
                    playSyntheticDiagnosticSound('click');
                  }} 
                />
              )}
            </AnimatePresence>
          </main>
        </div>

        {/* Floating Tactical Lore Codex Node */}
        <LoreCodex />

        {/* System Holographic Alert Toasts container */}
        <SystemToasts toasts={toasts} onDismiss={removeToast} />

        {/* Augmented Image Console Modal */}
        <AnimatePresence>
          {isAicOpen && (
            <AugmentedImageConsole onClose={() => setIsAicOpen(false)} />
          )}
        </AnimatePresence>

        {/* Settings Panel Control Modal */}
        <AnimatePresence>
          {isSettingsOpen && (
            <SettingsPanel onClose={() => setIsSettingsOpen(false)} />
          )}
        </AnimatePresence>

      </div>
    </>
  );
}

export default App;
