/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LORE_DATABASE } from './narrative';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Newspaper, Skull, Swords, Bookmark, Trash2, Compass } from 'lucide-react';
import rawLoreJSON from './loreData.json';
import { RawLoreEntry } from '../types';

const LORE_RAW_TEMPLATES = rawLoreJSON as RawLoreEntry[];

interface PortalSelectorProps {
  onSelectCharacter: (id: string) => void;
}

export const PortalSelector: React.FC<PortalSelectorProps> = ({ onSelectCharacter }) => {
  const characters = Object.values(LORE_DATABASE);

  // Synchronized state for bookmarked archives
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('lore-codex-bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

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

  const handleRemoveBookmark = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const next = bookmarks.filter(x => x !== id);
    setBookmarks(next);
    localStorage.setItem('lore-codex-bookmarks', JSON.stringify(next));
    window.dispatchEvent(new CustomEvent('bookmarks-changed', { detail: next }));
  };

  const handleOpenEntry = (id: string) => {
    window.dispatchEvent(new CustomEvent('open-lore', { detail: { entryId: id } }));
  };

  // Filter bookmarked entries from raw codex data
  const bookmarkedEntries = LORE_RAW_TEMPLATES.filter(entry => bookmarks.includes(entry.id));

  // Helper to get matching icons for standard display
  const getCharIcon = (id: string) => {
    switch (id) {
      case 'war-witch':
        return <Skull className="w-5 h-5 text-orange-500" />;
      case 'jane-district':
        return <Newspaper className="w-5 h-5 text-yellow-500" />;
      case 'arenas-echelon':
        default:
        return <Swords className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <div className="w-full flex flex-col justify-between min-h-[calc(100vh-64px)] py-4 md:py-8 blueprint-grid-fine relative">
      <div className="flex-1 flex flex-col justify-center items-center py-6">
        
        {/* Title Block */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-10 max-w-xl px-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-950/40 border border-orange-500/20 rounded-full text-xs text-orange-400 font-mono tracking-widest uppercase mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 animate-spin text-orange-500" />
            GENESIS VERSE · NETWORK HUB
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter uppercase mb-4 font-display">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-yellow-400 to-cyan-400 drop-shadow-sm">
              Hero Portals
            </span>
          </h1>
          
          <div className="text-gray-400 font-mono text-xs md:text-sm tracking-wide leading-relaxed border-t border-b border-white/5 py-3 mt-4">
            Entropy Engine Online <span className="text-orange-500/50">·</span> CORS Hydrated <span className="text-yellow-500/50">·</span> Select Your Gateway
          </div>
        </motion.div>

        {/* Portal Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full max-w-6xl px-4 md:px-8 mt-4">
          {characters.map((char, index) => {
            const isWW = char.id === 'war-witch';
            const isJD = char.id === 'jane-district';
            
            return (
              <motion.div
                key={char.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
                whileHover={{ scale: 1.02 }}
                onClick={() => onSelectCharacter(char.id)}
                className={`relative rounded-2xl overflow-hidden border border-white/10 bg-zinc-950/90 text-white cursor-pointer group transition-all duration-300 ${char.glowClass} flex flex-col justify-between aspect-[10/12] h-[460px] md:h-[480px]`}
              >
                {/* Visual Accent Hover Header */}
                <div className={`absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r ${isWW ? 'from-orange-500 to-amber-600' : isJD ? 'from-yellow-500 to-yellow-600' : 'from-cyan-500 to-blue-600'} opacity-80`} />

                {/* Cover Image Background */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
                  <img 
                    src={char.defaultImage} 
                    alt={char.name}
                    className={`w-full h-full object-cover opacity-35 mix-blend-screen scale-100 group-hover:scale-105 group-hover:opacity-50 transition-all duration-700`}
                  />
                  
                  {/* Subtle color overlay */}
                  <div className={`absolute inset-0 ${isWW ? 'bg-orange-950/20' : isJD ? 'bg-yellow-950/10' : 'bg-cyan-950/20'} mix-blend-color`} />
                </div>

                {/* Tech Badging Node */}
                <div className="relative z-10 p-5 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
                  <div className="flex items-center gap-2">
                    {getCharIcon(char.id)}
                    <span className="font-mono text-[10px] tracking-widest text-gray-400 uppercase">
                      PORTAL CARD {index + 1}
                    </span>
                  </div>
                  <span className={`w-2 h-2 rounded-full ${isWW ? 'bg-orange-500 shadow-[0_0_8px_#ea580c]' : isJD ? 'bg-yellow-500 shadow-[0_0_8px_#ca8a04]' : 'bg-cyan-400 shadow-[0_0_8px_#06b6d4]'} animate-pulse`} />
                </div>

                {/* Info Area Bottom */}
                <div className="relative z-10 p-6 bg-gradient-to-t from-black via-black/90 to-transparent pt-12 flex flex-col justify-end">
                  <div className={`text-[11px] uppercase font-mono font-bold tracking-[0.2em] ${isWW ? 'text-orange-400' : isJD ? 'text-yellow-400' : 'text-cyan-400'} mb-1`}>
                    {char.subtitle}
                  </div>
                  
                  <h3 className="text-3xl font-extrabold uppercase font-display tracking-tight leading-tight mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all">
                    {char.name}
                  </h3>
                  
                  <p className="text-sm text-gray-400 font-light mb-5 line-clamp-2 h-10 leading-snug">
                    {char.tagline}
                  </p>

                  <div className={`w-full py-3 px-4 rounded-xl font-bold uppercase tracking-wider text-xs font-display flex items-center justify-between transition-all duration-300 ${isWW ? 'bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-900/10' : isJD ? 'bg-yellow-500 hover:bg-yellow-400 text-black shadow-lg shadow-yellow-904/10' : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-900/10'}`}>
                    <span>Enter Gateway</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Dedicated Tactical Archives / Bookmarks section */}
        <div id="archives" className="w-full max-w-6xl px-4 md:px-8 mt-16 pb-8 border-t border-white/5 pt-12 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-950/40 border border-orange-500/25 flex items-center justify-center text-orange-400">
                <Bookmark className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold tracking-widest uppercase text-white font-display">
                  Bookmarked Lore Archives
                </h2>
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                  Classified signals saved for deep tactical reference
                </p>
              </div>
            </div>
            
            <div className="px-2 py-1 rounded bg-zinc-900 border border-white/5 font-mono text-[9px] text-zinc-400 uppercase tracking-wider">
              SECURE SIGNALS: {bookmarks.length} RECORDED
            </div>
          </div>

          {bookmarkedEntries.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-800/60 bg-zinc-950/20 p-8 text-center max-w-2xl mx-auto flex flex-col items-center justify-center">
              <Compass className="w-8 h-8 text-zinc-700 mb-3 animate-pulse" />
              <h3 className="text-xs font-bold text-gray-400 font-mono uppercase tracking-wider">
                Archives Database Offline
              </h3>
              <p className="text-[11px] text-zinc-500 font-light mt-1.5 max-w-md leading-relaxed font-mono">
                No active bookmarks registered. Process, decrypt, and bookmark critical transmissions in the <span className="text-orange-500">Lore Codex Terminal</span> (located in the bottom right corner of the hub).
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookmarkedEntries.map((entry) => {
                const isForge = entry.category.includes('Combat') || entry.category.includes('Corporate') || entry.targetCharacter === 'War Witch';
                const isChronicle = entry.category.includes('Occult') || entry.category.includes('Hostile') || entry.targetCharacter === 'Jane District';
                
                let borderTheme = 'hover:border-cyan-500/30';
                let accentTheme = 'text-cyan-400';
                if (isForge) {
                  borderTheme = 'hover:border-orange-500/30';
                  accentTheme = 'text-orange-400';
                } else if (isChronicle) {
                  borderTheme = 'hover:border-yellow-500/30';
                  accentTheme = 'text-yellow-505';
                }

                return (
                  <motion.div
                    key={entry.id}
                    layoutId={`archive-${entry.id}`}
                    whileHover={{ scale: 1.01, y: -2 }}
                    onClick={() => handleOpenEntry(entry.id)}
                    className={`rounded-xl border border-white/5 bg-zinc-950/75 p-5 flex flex-col justify-between hover:bg-zinc-950 transition-all group ${borderTheme} h-[180px] relative overflow-hidden cursor-pointer`}
                  >
                    {/* Decorative cyber corner ticks */}
                    <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-white/10 group-hover:border-orange-500/40 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-white/10 group-hover:border-orange-500/40 pointer-events-none" />

                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[9px] font-mono opacity-60 uppercase tracking-widest leading-none">
                          {entry.category}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-500 leading-none">
                          {entry.date}
                        </span>
                      </div>
                      
                      <h4 className="text-xs font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-1 leading-tight pt-1 uppercase font-mono">
                        {entry.title}
                      </h4>

                      <p className="text-[10px] text-zinc-500 line-clamp-3 leading-relaxed pt-2 font-mono">
                        {entry.rawText}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-2">
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-orange-400 group-hover:text-orange-300 flex items-center gap-1 transition-colors">
                        Launch Decoder <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
                      </span>

                      <button
                        type="button"
                        onClick={(e) => handleRemoveBookmark(e, entry.id)}
                        className="text-zinc-600 hover:text-red-400 p-1 rounded hover:bg-white/5 transition-all cursor-pointer relative z-20"
                        title="Remove Bookmark"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Footer Strip */}
      <div className="z-10 mt-12 border-t border-white/5 pt-4 flex flex-col md:flex-row items-center justify-between text-[11px] font-mono text-gray-500 uppercase px-4 max-w-6xl mx-auto w-full gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Genesis Verse Core Engine started</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden md:inline">SYSTEM STATUS: NOMINAL</span>
          <span className="text-orange-500">ORACLE LINK: ACTIVE</span>
          <span>ABYSSUM CO-CORE CONSTRUCT</span>
        </div>
      </div>
    </div>
  );
};
