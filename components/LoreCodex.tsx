/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Binary, 
  X, 
  ChevronRight, 
  ShieldAlert, 
  Sparkles, 
  Activity, 
  CheckCircle2, 
  Terminal, 
  Flame, 
  Skull, 
  Compass, 
  Cpu, 
  Coins, 
  Eye, 
  AlertTriangle,
  Bookmark
} from 'lucide-react';
import { formatLoreEntry } from '../services/geminiService';
import { RawLoreEntry, FormattedLoreResult, FormattedConcept } from '../types';
import rawLoreJSON from './loreData.json';

// Cast JSON to typed slice
const LORE_RAW_TEMPLATES = rawLoreJSON as RawLoreEntry[];

export const LoreCodex: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<RawLoreEntry | null>(LORE_RAW_TEMPLATES[0] || null);
  const [decoderType, setDecoderType] = useState<'forge' | 'chronicle' | 'echelon'>('forge');
  
  // Local cache for formatted results so we don't have to re-fetch when switching back and forth
  const [decryptedCache, setDecryptedCache] = useState<{ [key: string]: FormattedLoreResult }>({});
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptProgress, setDecryptProgress] = useState(0);
  const [activeConcept, setActiveConcept] = useState<string | null>(null);
  const [completedRules, setCompletedRules] = useState<{ [key: string]: boolean }>({});
  const [visualMode, setVisualMode] = useState<'schematic' | 'satellite'>('schematic');
  const [hoveredPoint, setHoveredPoint] = useState<{ label: string; x: number; y: number; detail: string } | null>(null);

  // Bookmark states synced with localStorage
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('lore-codex-bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [sidebarFilter, setSidebarFilter] = useState<'all' | 'bookmarks'>('all');

  const toggleBookmark = (id: string) => {
    const next = bookmarks.includes(id)
      ? bookmarks.filter(x => x !== id)
      : [...bookmarks, id];
    setBookmarks(next);
    localStorage.setItem('lore-codex-bookmarks', JSON.stringify(next));
    window.dispatchEvent(new CustomEvent('bookmarks-changed', { detail: next }));
  };

  // Sync bookmarks state across components
  useEffect(() => {
    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent<string[]>;
      if (customEvent.detail) {
        setBookmarks(customEvent.detail);
      }
    };
    window.addEventListener('bookmarks-changed', handleSync);
    return () => window.removeEventListener('bookmarks-changed', handleSync);
  }, []);

  // Sync opening specific lore entries from external components/main hub
  useEffect(() => {
    const handleOpenLore = (e: Event) => {
      const customEvent = e as CustomEvent<{ entryId: string; decoder?: 'forge' | 'chronicle' | 'echelon' }>;
      if (customEvent.detail) {
        const entry = LORE_RAW_TEMPLATES.find(x => x.id === customEvent.detail.entryId);
        if (entry) {
          setSelectedEntry(entry);
          if (customEvent.detail.decoder) {
            setDecoderType(customEvent.detail.decoder);
          }
          setIsOpen(true);
        }
      }
    };
    window.addEventListener('open-lore', handleOpenLore);
    return () => window.removeEventListener('open-lore', handleOpenLore);
  }, []);

  const handleToggleOpen = () => {
    setIsOpen(!isOpen);
    // Reset selection defaults when closing/opening
    if (!isOpen && !selectedEntry && LORE_RAW_TEMPLATES.length > 0) {
      setSelectedEntry(LORE_RAW_TEMPLATES[0]);
    }
  };

  const handleSelectEntry = (entry: RawLoreEntry) => {
    setSelectedEntry(entry);
    setActiveConcept(null);
  };

  const runDecryption = async () => {
    if (!selectedEntry) return;

    setIsDecrypting(true);
    setDecryptProgress(10);
    
    // Simulate complex quantum decryption ticks for visual feedback
    const interval = setInterval(() => {
      setDecryptProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 120);

    try {
      const result = await formatLoreEntry(selectedEntry, decoderType);
      
      // Complete progress smoothly
      setDecryptProgress(100);
      setTimeout(() => {
        setDecryptedCache((prev) => ({
          ...prev,
          [`${selectedEntry.id}-${decoderType}`]: result
        }));
        setIsDecrypting(false);
      }, 300);

    } catch (error) {
      console.error("Quantum Link Failure:", error);
      setIsDecrypting(false);
      // Give a backup result using fallback client generation or just report a warning
      alert("Decrypt Core Timeout. Make sure your API Key is set correctly in Settings.");
    } finally {
      clearInterval(interval);
    }
  };

  const toggleRuleCompleted = (ruleKey: string) => {
    setCompletedRules((prev) => ({
      ...prev,
      [ruleKey]: !prev[ruleKey]
    }));
  };

  const currentCacheKey = selectedEntry ? `${selectedEntry.id}-${decoderType}` : '';
  const currentDecrypted = selectedEntry ? decryptedCache[currentCacheKey] : null;

  // Visual helper to styled secure levels
  const getSecureBadge = (level: string) => {
    switch (level) {
      case 'CRITICAL':
      case 'TOP SECRET':
        return <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-red-950/80 text-red-400 border border-red-500/30 animate-pulse font-mono flex items-center gap-1"><ShieldAlert size={10} /> {level}</span>;
      case 'CLASSIFIED':
      case 'RESTRICTED':
        return <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-yellow-950/80 text-yellow-400 border border-yellow-500/30 font-mono">{level}</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-zinc-900 text-gray-400 border border-white/5 font-mono">{level}</span>;
    }
  };

  // Helper theme borders
  const getDecoderThemeColor = (type: 'forge' | 'chronicle' | 'echelon') => {
    switch (type) {
      case 'forge': return 'text-orange-500 shadow-orange-500/20';
      case 'chronicle': return 'text-yellow-500 shadow-yellow-500/20';
      case 'echelon': return 'text-cyan-400 shadow-cyan-400/20';
    }
  };

  return (
    <>
      {/* Floating Action Button (FAB) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        <motion.button
          id="lore-codex-fab"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleToggleOpen}
          className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-zinc-950 via-zinc-900 to-zinc-950 border-2 border-orange-500/40 flex items-center justify-center cursor-pointer shadow-[0_0_20px_rgba(249,115,22,0.25)] hover:border-orange-400 transition-all group overflow-hidden"
          title="Open Lore Codex Terminal"
        >
          {/* Animated glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 via-yellow-600/10 to-cyan-600/10 opacity-70 animate-spin-slow group-hover:scale-110 transition-transform duration-1000" />
          
          <Binary className="w-6 h-6 text-orange-400 group-hover:text-yellow-300 transform group-hover:rotate-12 transition-all duration-300" />
          
          {/* Channel counts badges */}
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 border border-black text-[9px] font-bold font-mono flex items-center justify-center text-white scale-90 shadow-sm animate-pulse">
            7
          </span>
        </motion.button>
        <span className="mt-1 text-[9px] font-mono tracking-widest text-orange-400/70 uppercase">LORE CODEX</span>
      </div>

      {/* Hologram Sliding Panel Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-end pointer-events-none">
            
            {/* Backdrop veil */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleToggleOpen}
              className="absolute inset-0 bg-black/60 pointer-events-auto backdrop-blur-[2px]"
            />

            {/* Custom Sliding Panel Container */}
            <motion.div
              initial={{ x: '100%', opacity: 0.8 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0.8 }}
              transition={{ type: 'spring', damping: 24, stiffness: 140 }}
              className="relative w-full max-w-[640px] h-full bg-[#030307]/95 border-l border-white/5 text-white flex flex-col pointer-events-auto shadow-2xl relative overflow-hidden"
            >
              
              {/* Scanline CRT overlay filter */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-10 pointer-events-none z-30" />
              <div className="absolute top-0 left-0 w-full h-1 bg-orange-500/35 z-30 animate-pulse" />

              {/* Panel Header */}
              <header className="p-4 border-b border-white/5 bg-zinc-950/80 flex items-center justify-between relative z-10 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-950/40 border border-orange-500/20 flex items-center justify-center font-bold text-orange-400 text-xs">
                    Ω
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold tracking-widest font-display uppercase text-white leading-none">
                      DECRYPTION LORE CODEX
                    </h3>
                    <p className="text-[9px] font-mono text-gray-500 leading-none mt-1 uppercase tracking-widest">
                      ANOMALY SYNTHESIZER MATRIX
                    </p>
                  </div>
                </div>

                <button 
                  onClick={handleToggleOpen}
                  className="w-8 h-8 rounded-lg border border-white/5 hover:border-red-500/20 hover:bg-red-950/20 text-gray-400 hover:text-red-400 flex items-center justify-center transition-all cursor-pointer"
                >
                  <X size={15} />
                </button>
              </header>

              {/* Central Panel Layout split into scrollable panel spaces */}
              <div className="flex-1 overflow-hidden flex flex-col md:flex-row relative z-10">
                                {/* Left Side: Signal Feed Scrollbar */}
                <div className="w-full md:w-[220px] shrink-0 border-r border-white/5 bg-zinc-950/30 flex flex-col overflow-y-auto">
                  <div className="p-3 border-b border-white/5 bg-zinc-900/30 flex justify-between items-center shrink-0">
                    <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider">
                      COGNITIVE DATA
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-[8px] font-mono text-zinc-400">
                      {LORE_RAW_TEMPLATES.length} NODES
                    </span>
                  </div>

                  {/* Sidebar Bookmarks/All Filter Switches */}
                  <div className="p-2 border-b border-white/5 grid grid-cols-2 gap-1 bg-zinc-950/40 shrink-0">
                    <button
                      type="button"
                      onClick={() => setSidebarFilter('all')}
                      className={`py-1.5 text-[9px] font-mono tracking-wider uppercase rounded-lg transition-all border cursor-pointer ${
                        sidebarFilter === 'all'
                          ? 'bg-zinc-900 border-orange-500/25 text-orange-400 font-bold'
                          : 'border-transparent text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      All ({LORE_RAW_TEMPLATES.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setSidebarFilter('bookmarks')}
                      className={`py-1.5 text-[9px] font-mono tracking-wider uppercase rounded-lg transition-all border cursor-pointer flex items-center justify-center gap-1 ${
                        sidebarFilter === 'bookmarks'
                          ? 'bg-zinc-900 border-orange-500/25 text-orange-400 font-bold'
                          : 'border-transparent text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      Classified ({bookmarks.length})
                    </button>
                  </div>

                  <nav className="p-2 space-y-1">
                    {LORE_RAW_TEMPLATES.filter(entry => sidebarFilter === 'all' || bookmarks.includes(entry.id)).length === 0 ? (
                      <div className="p-4 text-center text-zinc-600 font-mono text-[9px] uppercase leading-relaxed pt-8">
                        No Bookmarks Found
                      </div>
                    ) : (
                      LORE_RAW_TEMPLATES.filter(entry => sidebarFilter === 'all' || bookmarks.includes(entry.id)).map((entry) => {
                        const isSelected = selectedEntry?.id === entry.id;
                        const isCompleted = decryptedCache[`${entry.id}-forge`] || decryptedCache[`${entry.id}-chronicle`] || decryptedCache[`${entry.id}-echelon`];
                        
                        return (
                          <button
                            key={entry.id}
                            onClick={() => handleSelectEntry(entry)}
                            className={`w-full p-2.5 rounded-xl text-left border flex flex-col gap-1 transition-all relative group cursor-pointer ${
                              isSelected 
                                ? 'bg-zinc-900/90 border-orange-500/30 shadow-[inset_0_0_12px_rgba(249,115,22,0.15)] text-white' 
                                : 'bg-transparent border-transparent hover:bg-zinc-900/40 text-gray-400 hover:text-white'
                            }`}
                          >
                            <div className="flex items-center justify-between pointer-events-none">
                              <span className="text-[9px] font-mono text-zinc-500 group-hover:text-zinc-400">
                                {entry.date}
                              </span>
                              
                              {isCompleted ? (
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_#10b981]" />
                              ) : (
                                <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                              )}
                            </div>
                            
                            <span className={`text-xs font-bold leading-tight line-clamp-1`}>
                              {entry.title}
                            </span>

                            <span className="text-[8px] font-mono opacity-65 uppercase tracking-wider line-clamp-1">
                              {entry.category}
                            </span>
                          </button>
                        );
                      })
                    )}
                  </nav>
                </div>

                {/* Right Side: Log Explorer & Visual Synthesis Area */}
                <div className="flex-1 flex flex-col overflow-y-auto p-4 md:p-6 bg-zinc-950/20">
                  {selectedEntry ? (() => {
                    const isBookmarked = bookmarks.includes(selectedEntry.id);
                    return (
                      <div className="space-y-6">
                        
                        {/* Document Meta Node */}
                        <header className="border-b border-white/5 pb-4 space-y-3">
                          <div className="flex flex-wrap gap-2 items-center justify-between">
                            <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-orange-950/30 text-orange-400 border border-orange-500/10 uppercase tracking-widest">
                              {selectedEntry.category}
                            </span>
                            
                            {getSecureBadge(selectedEntry.secureLevel)}
                          </div>

                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h4 className="text-xl font-extrabold tracking-tight uppercase leading-snug font-display text-white">
                                {selectedEntry.title}
                              </h4>
                              
                              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-mono text-gray-500 mt-2">
                                <span>SOURCE: <span className="text-gray-300">{selectedEntry.source}</span></span>
                                <span>CYCLE: <span className="text-gray-300">{selectedEntry.date}</span></span>
                                <span>TARGET: <span className="text-gray-300 font-bold">{selectedEntry.targetCharacter}</span></span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => toggleBookmark(selectedEntry.id)}
                              className={`p-2 rounded-xl border flex items-center justify-center cursor-pointer transition-all shrink-0 ${
                                isBookmarked
                                  ? 'bg-orange-500/10 border-orange-500/40 text-orange-400 shadow-[0_0_8px_rgba(249,115,22,0.25)]'
                                  : 'border-white/5 bg-transparent hover:border-white/20 text-gray-400 hover:text-white'
                              }`}
                              title={isBookmarked ? "Remove Bookmark" : "Bookmark Transmission"}
                            >
                              <Bookmark size={15} className={isBookmarked ? "fill-orange-500 text-orange-455" : ""} />
                            </button>
                          </div>
                        </header>

                      {/* Display Screen Option Toggles */}
                      {!isDecrypting && !currentDecrypted && (
                        <div className="space-y-3 bg-zinc-900/30 p-3 rounded-xl border border-white/5">
                          <div className="flex items-center gap-1.5">
                            <Terminal size={12} className="text-orange-400" />
                            <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-400 uppercase">
                              CHOOSE DECRYPTION PROTOCOL
                            </span>
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { id: 'forge', label: 'Siren Forge', icon: <Flame size={12} />, desc: 'Abyssum Heavy Metal', activeColor: 'bg-orange-500/15 border-orange-500/40 text-orange-400' },
                              { id: 'chronicle', label: 'Chronicle', icon: <Skull size={12} />, desc: 'Gothic Occult Noir', activeColor: 'bg-yellow-500/15 border-yellow-500/40 text-yellow-500' },
                              { id: 'echelon', label: 'Sky Archival', icon: <Compass size={12} />, desc: 'Aether Chivalry', activeColor: 'bg-cyan-500/15 border-cyan-500/40 text-cyan-400' }
                            ].map((decoder) => {
                              const isActive = decoderType === decoder.id;
                              return (
                                <button
                                  key={decoder.id}
                                  onClick={() => setDecoderType(decoder.id as any)}
                                  className={`p-2 rounded-xl border text-center flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                                    isActive 
                                      ? decoder.activeColor
                                      : 'border-white/5 bg-transparent hover:border-white/20 text-gray-400 hover:text-white'
                                  }`}
                                >
                                  <span className="pointer-events-none">{decoder.icon}</span>
                                  <span className="text-[10px] font-bold pointer-events-none">{decoder.label}</span>
                                  <span className="text-[7px] opacity-60 font-mono pointer-events-none leading-none">{decoder.desc}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Decrypt Action / Raw text view */}
                      {!isDecrypting && !currentDecrypted ? (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <span className="text-[9px] font-mono text-zinc-500 tracking-wider">
                              [ TRANSFERRED CODES - ENCRYPTED BLOCK ]
                            </span>
                            <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950 font-mono text-xs text-zinc-400 leading-relaxed overflow-x-hidden whitespace-normal select-all break-words select-text">
                              {selectedEntry.rawText}
                            </div>
                          </div>

                          <button
                            onClick={runDecryption}
                            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold font-display uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-950/30 transition-all transform hover:scale-[1.01] cursor-pointer"
                          >
                            <Binary size={14} className="animate-pulse" />
                            DECRYPT WITH {decoderType.toUpperCase()} RESOLVER
                          </button>
                        </div>
                      ) : null}

                      {/* Loading/Decryption Terminal Progress */}
                      {isDecrypting && (
                        <div className="space-y-4 py-8 text-center bg-zinc-950/40 p-6 rounded-2xl border border-white/5">
                          <div className="w-12 h-12 rounded-xl bg-orange-950/20 border border-orange-500/20 mx-auto flex items-center justify-center text-orange-400">
                            <Activity className="w-6 h-6 animate-pulse" />
                          </div>
                          
                          <div className="space-y-1">
                            <h5 className="text-xs font-mono font-bold uppercase tracking-widest text-orange-400">
                              TRANSMULTING CODES
                            </h5>
                            <p className="text-[9px] font-mono text-zinc-500 uppercase">
                              SYNCHRONIZING GEMINI ORACLE LINK...
                            </p>
                          </div>

                          {/* Progress Line */}
                          <div className="max-w-xs mx-auto space-y-1">
                            <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-250 ease-out"
                                style={{ width: `${decryptProgress}%` }}
                              />
                            </div>
                            <div className="flex justify-between font-mono text-[8px] text-zinc-500">
                              <span>SECTOR_MOD_DECRYPT</span>
                              <span>{decryptProgress}%</span>
                            </div>
                          </div>

                          {/* ASCII/Terminal status text */}
                          <div className="h-8 flex flex-col justify-center text-[9px] font-mono text-zinc-500 leading-tight">
                            {decryptProgress < 40 && <span>&gt; scanning quantum frequency matrices</span>}
                            {decryptProgress >= 40 && decryptProgress < 70 && <span>&gt; resolving entropy indices ... mapping definitions</span>}
                            {decryptProgress >= 70 && <span>&gt; finalizing structured narrative outputs</span>}
                          </div>
                        </div>
                      )}

                      {/* Decrypted Render Area */}
                      {currentDecrypted && !isDecrypting && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-6"
                        >
                          
                          {/* Trans-coded Alert header */}
                          <div className="flex items-center justify-between bg-zinc-900/60 p-3 rounded-xl border border-white/5">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full animate-ping ${
                                decoderType === 'forge' ? 'bg-orange-500' : decoderType === 'chronicle' ? 'bg-yellow-500' : 'bg-cyan-500'
                              }`} />
                              <span className="text-[10px] font-mono font-bold tracking-wider text-zinc-400 uppercase">
                                DECRYPTION TRANS-CODER COMPLETED: {decoderType}
                              </span>
                            </div>
                            <button
                              onClick={() => {
                                // Force clearing cache entry to allow re-decryption or switching filters
                                const cacheCopy = { ...decryptedCache };
                                delete cacheCopy[currentCacheKey];
                                setDecryptedCache(cacheCopy);
                              }}
                              className="text-[9px] font-mono text-orange-400 hover:text-orange-300 uppercase py-0.5 px-2 rounded hover:bg-white/5 border border-orange-500/10 transition-all cursor-pointer"
                            >
                              Restart Log
                            </button>
                          </div>

                          {/* Polished Immersive Story */}
                          <div className="space-y-2 relative">
                            <div className="absolute top-1 left-0 text-3xl font-serif leading-none select-none text-zinc-800">“</div>
                            <blockquote className={`text-sm tracking-wide leading-relaxed pl-6 italic font-display ${
                              decoderType === 'forge' ? 'text-orange-100' : decoderType === 'chronicle' ? 'text-yellow-100' : 'text-cyan-100'
                            }`}>
                              {currentDecrypted.polishedStory}
                            </blockquote>
                          </div>

                          {/* Visual Reconstruction & Tactical Diagram Layer */}
                          <div className="space-y-3 bg-zinc-900/30 p-4 rounded-xl border border-white/5 overflow-hidden relative">
                            <style>{`
                              @keyframes scanning-shading {
                                0% { top: 0%; opacity: 0.1; }
                                50% { top: 100%; opacity: 0.8; }
                                100% { top: 0%; opacity: 0.1; }
                              }
                              .animate-scan-shading {
                                animation: scanning-shading 3s ease-in-out infinite;
                              }
                              @keyframes rotate-slow {
                                from { transform: rotate(0deg); }
                                to { transform: rotate(360deg); }
                              }
                              .animate-rotate-slow {
                                transform-origin: center;
                                animation: rotate-slow 15s linear infinite;
                              }
                            `}</style>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-white/5">
                              <div className="flex items-center gap-2">
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  decoderType === 'forge' ? 'bg-orange-500 animate-pulse' : decoderType === 'chronicle' ? 'bg-yellow-500 animate-pulse' : 'bg-cyan-400 animate-pulse'
                                }`} />
                                <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-300 uppercase">
                                  {currentDecrypted.diagramTitle || "ANOMALOUS CONTEXT DECODER"}
                                </span>
                              </div>
                              
                              {/* Visual Modes Selection Tab */}
                              <div className="flex rounded-lg bg-zinc-950 p-0.5 border border-white/5 select-none self-end">
                                <button
                                  type="button"
                                  onClick={() => setVisualMode('schematic')}
                                  className={`px-2 py-0.5 rounded text-[8px] font-mono font-semibold transition-all hover:text-white cursor-pointer ${
                                    visualMode === 'schematic' 
                                      ? (decoderType === 'forge' ? 'bg-orange-950/40 text-orange-400 border border-orange-500/10' : decoderType === 'chronicle' ? 'bg-yellow-950/40 text-yellow-500 border border-yellow-500/10' : 'bg-cyan-950/40 text-cyan-400 border border-cyan-500/10')
                                      : 'text-zinc-500'
                                  }`}
                                >
                                  SCHEMATIC
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setVisualMode('satellite')}
                                  className={`px-2 py-0.5 rounded text-[8px] font-mono font-semibold transition-all hover:text-white cursor-pointer ${
                                    visualMode === 'satellite' 
                                      ? (decoderType === 'forge' ? 'bg-orange-950/40 text-orange-400 border border-orange-500/10' : decoderType === 'chronicle' ? 'bg-yellow-950/40 text-yellow-500 border border-yellow-500/10' : 'bg-cyan-950/40 text-cyan-400 border border-cyan-500/10')
                                      : 'text-zinc-500'
                                  }`}
                                >
                                  IMAGE CAPTURE
                                </button>
                              </div>
                            </div>

                            {/* Render Mode Body */}
                            {visualMode === 'schematic' ? (
                              <div className="relative w-full h-[180px] bg-[#020205] border border-white/5 rounded-lg overflow-hidden flex items-center justify-center">
                                {/* Grid backing */}
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[length:14px_14px] pointer-events-none" />
                                
                                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                  {currentDecrypted.diagramType === 'blueprint' && (
                                    <g stroke="rgba(249,115,22,0.3)" strokeWidth="1" fill="none">
                                      <circle cx="50%" cy="50%" r="45" strokeDasharray="3 3" />
                                      <circle cx="50%" cy="50%" r="65" stroke="rgba(249,115,22,0.15)" className="animate-rotate-slow" strokeDasharray="40 20 10 20" />
                                      <line x1="10%" y1="50%" x2="90%" y2="50%" stroke="rgba(249,115,22,0.1)" />
                                      <line x1="50%" y1="10%" x2="50%" y2="90%" stroke="rgba(249,115,22,0.1)" />
                                      <rect x="25%" y="25%" width="50%" height="50%" strokeDasharray="2 2" stroke="rgba(249,115,22,0.15)" />
                                    </g>
                                  )}
                                  
                                  {currentDecrypted.diagramType === 'nodes' && (
                                    <g stroke="rgba(234,179,8,0.3)" strokeWidth="1" fill="none">
                                      <path d="M 50 120 Q 150 40 250 120 T 450 120" strokeDasharray="3 3" />
                                      <path d="M 50 60 Q 200 140 350 30 T 550 90" stroke="rgba(234,179,8,0.15)" />
                                      <rect x="5%" y="10%" width="90%" height="80%" rx="8" strokeDasharray="10 5" stroke="rgba(234,179,8,0.1)" />
                                    </g>
                                  )}

                                  {/* Default to orbit/rings if other or orbit */}
                                  {(currentDecrypted.diagramType === 'orbit' || (currentDecrypted.diagramType !== 'blueprint' && currentDecrypted.diagramType !== 'nodes')) && (
                                    <g stroke="rgba(34,211,238,0.3)" strokeWidth="1" fill="none">
                                      <ellipse cx="50%" cy="50%" rx="120" ry="40" transform="rotate(-15, 200, 90)" />
                                      <ellipse cx="50%" cy="50%" rx="160" ry="65" strokeDasharray="5 5" transform="rotate(10, 200, 90)" stroke="rgba(34,211,238,0.15)" />
                                      <circle cx="50%" cy="50%" r="20" strokeDasharray="2 2" />
                                      <line x1="50%" y1="5%" x2="50%" y2="95%" stroke="rgba(34,211,238,0.1)" />
                                    </g>
                                  )}
                                </svg>

                                {/* Radar scanning bar */}
                                <div className={`animate-scan-shading absolute left-0 w-full h-[1.5px] pointer-events-none opacity-40 ${
                                  decoderType === 'forge' ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]' : decoderType === 'chronicle' ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]' : 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]'
                                }`} />

                                {/* Interactive hot spots labels */}
                                {currentDecrypted.schematicPoints?.map((point, idx) => (
                                  <div
                                    key={idx}
                                    style={{ left: `${point.x}%`, top: `${point.y}%` }}
                                    className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
                                  >
                                    <button
                                      type="button"
                                      className={`w-4- h-4 w-4 h-4 rounded-full border-2 bg-black flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-125 focus:outline-none ${
                                        decoderType === 'forge' ? 'border-orange-500 shadow-[0_0_6px_rgba(249,115,22,0.5)]' : decoderType === 'chronicle' ? 'border-yellow-500 shadow-[0_0_6px_rgba(234,179,8,0.5)]' : 'border-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.5)]'
                                      }`}
                                      onClick={() => setHoveredPoint(hoveredPoint === point ? null : point)}
                                    >
                                      <span className={`w-1.5 h-1.5 rounded-full animate-ping ${
                                        decoderType === 'forge' ? 'bg-orange-500' : decoderType === 'chronicle' ? 'bg-yellow-500' : 'bg-cyan-400'
                                      }`} />
                                    </button>

                                    {/* Tooltip on Hover */}
                                    <div className="absolute left-1/2 bottom-6 transform -translate-x-1/2 bg-zinc-950/95 border border-white/10 rounded px-2.5 py-1.5 w-36 text-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-30 shadow-xl hidden md:block">
                                      <p className="text-[9px] font-bold text-white font-mono uppercase leading-tight">{point.label}</p>
                                    </div>
                                  </div>
                                ))}

                                {/* Static metadata markers */}
                                <div className="absolute top-2 left-2 text-[7px] font-mono text-zinc-600 space-y-0.5 uppercase tracking-wider select-none leading-none">
                                  <div>SECURE LINK: RESOLVED</div>
                                  <div>SYS: {currentDecrypted.diagramType?.toUpperCase() || "HOLO"}</div>
                                </div>
                                <div className="absolute bottom-2 right-2 text-[7px] font-mono text-zinc-650 uppercase tracking-widest select-none leading-none">
                                  GPS COORD: SYNC 100%
                                </div>

                                {/* Active Clicked Point Info Overlay Card */}
                                {hoveredPoint && (
                                  <div className="absolute inset-x-2 bottom-2 bg-black/95 p-2 rounded border border-white/10 flex items-start gap-2 backdrop-blur-md z-30 transition-all shadow-xl">
                                    <div className={`mt-0.5 text-xs font-mono font-bold ${
                                      decoderType === 'forge' ? 'text-orange-400' : decoderType === 'chronicle' ? 'text-yellow-400' : 'text-cyan-400'
                                    }`}>[!]</div>
                                    <div className="flex-1 min-w-0">
                                      <div className="text-[9px] font-bold font-mono uppercase text-gray-200 truncate leading-none">{hoveredPoint.label}</div>
                                      <div className="text-[8px] font-mono text-gray-400 mt-0.5 leading-tight">{hoveredPoint.detail}</div>
                                    </div>
                                    <button 
                                      type="button"
                                      onClick={() => setHoveredPoint(null)}
                                      className="text-gray-500 hover:text-white text-[8px] font-mono self-start cursor-pointer hover:bg-white/10 px-1 rounded transition-colors"
                                    >
                                      CLOSE
                                    </button>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="relative w-full h-[180px] bg-zinc-950 border border-white/5 rounded-lg overflow-hidden flex items-center justify-center">
                                <img
                                  src={`https://picsum.photos/seed/${encodeURIComponent(currentDecrypted.imagePrompt || currentDecrypted.title)}/600/400`}
                                  alt={currentDecrypted.diagramTitle}
                                  className="w-full h-full object-cover opacity-70 transition-all duration-700 hover:scale-105"
                                  referrerPolicy="no-referrer"
                                />
                                
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                                {/* Prompt transcription ticker */}
                                <div className="absolute bottom-0 inset-x-0 bg-black/85 p-2 border-t border-white/5 text-[8px] font-mono text-zinc-400 line-clamp-1 leading-snug">
                                  <span className={`font-bold ${
                                    decoderType === 'forge' ? 'text-orange-400' : decoderType === 'chronicle' ? 'text-yellow-400' : 'text-cyan-405'
                                  }`}>ORACLE PROMPT:</span> {currentDecrypted.imagePrompt || "No prompt sequence supplied."}
                                </div>
                              </div>
                            )}

                            {/* Diagram description */}
                            <p className="text-[9px] font-mono text-zinc-500 leading-relaxed uppercase">
                              <span className="font-bold text-zinc-400">ANALYSIS:</span> {currentDecrypted.visualDescription || "No diagnostic file descriptions are mapped to this database entity."}
                            </p>
                          </div>

                          {/* Threat Gauge & Intelligence Card Side-By-Side */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            
                            {/* Danger Rating bar */}
                            <div className="p-3.5 rounded-xl bg-zinc-950 border border-white/5 space-y-2">
                              <span className="text-[10px] font-mono font-bold text-zinc-500 tracking-widest uppercase block">
                                DANGER LEVEL ASSESSMENT
                              </span>
                              
                              <div className="flex items-center gap-2">
                                <div className="flex-1 flex gap-1 h-3">
                                  {Array.from({ length: 10 }).map((_, idx) => {
                                    const rating = currentDecrypted.dangerRating || 5;
                                    const isActive = idx < rating;
                                    let fillClass = 'bg-zinc-800';
                                    if (isActive) {
                                      fillClass = rating >= 8 
                                        ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' 
                                        : rating >= 5 
                                          ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]' 
                                          : 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]';
                                    }
                                    return (
                                      <div key={idx} className={`flex-1 rounded-sm transition-all duration-300 ${fillClass}`} />
                                    );
                                  })}
                                </div>
                                <span className="font-mono text-xs font-black text-gray-300 shrink-0">
                                  {currentDecrypted.dangerRating || 5}/10
                                </span>
                              </div>
                              <p className="text-[9px] font-mono text-zinc-500 leading-snug">
                                {currentDecrypted.dangerRating >= 8 
                                  ? 'RED ALERT: Kinetic containment failed. Purge protocols recommended immediately.' 
                                  : currentDecrypted.dangerRating >= 5 
                                    ? 'WARNING: Sub-critical anomalies detected. Proceed with extreme caution.' 
                                    : 'MONITORED: Minimal security deviation. Nominal pilot operation.'}
                              </p>
                            </div>

                            {/* Intellectual summary block */}
                            <div className="p-3.5 rounded-xl bg-zinc-950 border border-white/5 space-y-1.5">
                              <span className="text-[10px] font-mono font-bold text-zinc-500 tracking-widest uppercase block">
                                OVAL CLASSIFIED SUMMARY
                              </span>
                              <p className="text-[10px] text-zinc-400 font-mono leading-relaxed">
                                {currentDecrypted.intelSummary}
                              </p>
                            </div>
                          </div>

                          {/* Key Concepts badging pills */}
                          {currentDecrypted.keyConcepts && currentDecrypted.keyConcepts.length > 0 && (
                            <div className="space-y-3">
                              <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-500 uppercase block">
                                DETECTED CONCEPTS & ANOMALOUS TERMINOLOGIES
                              </span>
                              
                              <div className="flex flex-wrap gap-2">
                                {currentDecrypted.keyConcepts.map((concept, idx) => {
                                  const isActive = activeConcept === concept.term;
                                  
                                  // Category highlight colors
                                  let typeColor = 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700';
                                  if (isActive) {
                                    typeColor = decoderType === 'forge' 
                                      ? 'bg-orange-950/40 border-orange-500/40 text-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.15)]' 
                                      : decoderType === 'chronicle'
                                        ? 'bg-yellow-950/40 border-yellow-500/40 text-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.15)]'
                                        : 'bg-cyan-950/40 border-cyan-500/40 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.15)]';
                                  }

                                  return (
                                    <button
                                      key={idx}
                                      onClick={() => setActiveConcept(isActive ? null : concept.term)}
                                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${typeColor}`}
                                    >
                                      <span className="text-[9px] uppercase font-mono opacity-60">[{concept.type}]</span>
                                      <span>{concept.term}</span>
                                    </button>
                                  );
                                })}
                              </div>

                              {/* Expanded active concept description card */}
                              <AnimatePresence>
                                {activeConcept && (() => {
                                  const conceptObj = currentDecrypted.keyConcepts.find(c => c.term === activeConcept);
                                  if (!conceptObj) return null;
                                  return (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: 'auto' }}
                                      exit={{ opacity: 0, height: 0 }}
                                      className={`p-3 rounded-xl border bg-zinc-950 font-mono shadow-md overflow-hidden ${
                                        decoderType === 'forge' ? 'border-orange-500/20' : decoderType === 'chronicle' ? 'border-yellow-500/20' : 'border-cyan-500/20'
                                      }`}
                                    >
                                      <div className="flex justify-between items-center pb-1.5 border-b border-white/5 mb-1.5">
                                        <span className={`text-[10px] font-bold ${
                                          decoderType === 'forge' ? 'text-orange-400' : decoderType === 'chronicle' ? 'text-yellow-400' : 'text-cyan-400'
                                        }`}>
                                          RESOLVED CONCEPT DATA: {conceptObj.term}
                                        </span>
                                        <span className="text-[8px] px-1 py-0.2 rounded bg-white/5 text-gray-500 font-mono">
                                          CATEGORY: {conceptObj.type.toUpperCase()}
                                        </span>
                                      </div>
                                      <p className="text-xs text-zinc-400 leading-relaxed font-light">
                                        {conceptObj.definition}
                                      </p>
                                    </motion.div>
                                  );
                                })()}
                              </AnimatePresence>
                            </div>
                          )}

                          {/* Tactical Checklist and Operating Procedures */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            
                            {/* Investigative Leads checklist */}
                            {currentDecrypted.leads && currentDecrypted.leads.length > 0 && (
                              <div className="space-y-3 bg-zinc-900/10 p-3 rounded-xl border border-white/5">
                                <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-400 uppercase flex items-center gap-1">
                                  <Terminal size={11} className="text-cyan-400 animate-pulse" /> TACTICAL LEADS / TIPS
                                </span>

                                <div className="space-y-2">
                                  {currentDecrypted.leads.map((lead, idx) => {
                                    const key = `${selectedEntry.id}-lead-${idx}`;
                                    const completed = !!completedRules[key];
                                    return (
                                      <div 
                                        key={idx}
                                        onClick={() => toggleRuleCompleted(key)}
                                        className="flex items-start gap-2.5 p-2 rounded-lg bg-zinc-950/50 hover:bg-zinc-950 border border-white/5 transition-all cursor-pointer group"
                                      >
                                        <div className={`mt-0.5 w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 transition-all ${
                                          completed 
                                            ? 'bg-emerald-500 border-emerald-500 text-black' 
                                            : 'border-white/20 group-hover:border-white/40 text-transparent'
                                        }`}>
                                          <CheckCircle2 size={10} strokeWidth={3} className={completed ? 'block' : 'hidden'} />
                                        </div>
                                        <span className={`text-[10px] font-mono leading-relaxed transition-all ${
                                          completed ? 'line-through text-zinc-600' : 'text-zinc-300'
                                        }`}>
                                          {lead}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Recommended Operating Protocols */}
                            {currentDecrypted.recommendedProtocols && currentDecrypted.recommendedProtocols.length > 0 && (
                              <div className="space-y-3 bg-zinc-900/10 p-3 rounded-xl border border-white/5">
                                <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-400 uppercase flex items-center gap-1">
                                  <Cpu size={11} className="text-orange-400" /> RECOVERY ACTIONS
                                </span>

                                <div className="space-y-2">
                                  {currentDecrypted.recommendedProtocols.map((protocol, idx) => {
                                    const key = `${selectedEntry.id}-protocol-${idx}`;
                                    const completed = !!completedRules[key];
                                    return (
                                      <div 
                                        key={idx}
                                        onClick={() => toggleRuleCompleted(key)}
                                        className="flex items-start gap-2.5 p-2 rounded-lg bg-zinc-950/50 hover:bg-zinc-950 border border-white/5 transition-all cursor-pointer group"
                                      >
                                        <div className={`mt-0.5 w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 transition-all ${
                                          completed 
                                            ? 'bg-emerald-500 border-emerald-500 text-black' 
                                            : 'border-white/20 group-hover:border-white/40 text-transparent'
                                        }`}>
                                          <CheckCircle2 size={10} strokeWidth={3} className={completed ? 'block' : 'hidden'} />
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                          <span className="text-[9px] font-mono font-bold tracking-widest uppercase text-amber-500 leading-none">
                                            CODEX_RULE_{idx + 1}
                                          </span>
                                          <span className={`text-[10px] font-mono leading-relaxed mt-0.5 ${
                                            completed ? 'line-through text-zinc-600' : 'text-zinc-300'
                                          }`}>
                                            {protocol}
                                          </span>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>

                        </motion.div>
                      )}

                    </div>
                  );
                })() : (
                    <div className="flex-1 flex flex-col justify-center items-center py-20 text-center text-zinc-600">
                      <Binary size={36} className="text-zinc-800 mb-3 animate-pulse" />
                      <p className="text-xs font-mono tracking-widest uppercase">
                        Quantum Stream Stale
                      </p>
                      <p className="text-[10px] font-mono">
                        Select a signal node from the selector tray.
                      </p>
                    </div>
                  )}
                </div>

              </div>

              {/* Status Footer */}
              <footer className="p-3 bg-zinc-950/90 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[8px] font-mono text-zinc-500 uppercase tracking-widest shrink-0 gap-1">
                <span>ORACLE COMPILATION: gemini-3.5-flash @ 3000ms</span>
                <span>DECRYPTON_KEY: HYDRATED</span>
                <span>ABYSSUM CO-CORE HYBRID COGNITION</span>
              </footer>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
