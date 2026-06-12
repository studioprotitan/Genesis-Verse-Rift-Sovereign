/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LORE_DATABASE, LoreItem } from './narrative';
import { generateInfographic, analyzeImageRegions } from '../services/geminiService';
import { GeneratedImage, AnalysisResult } from '../types';
import { AugmentedCanvas } from './AugmentedCanvas';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, HardDrive, Cpu, CheckCircle2, RefreshCw } from 'lucide-react';

interface CharacterDashboardProps {
  characterId: string;
  onBackToPortals: () => void;
}

const SECTION_PHRASES = [
  "Opening quantum database link...",
  "Calibrating neural-retinal sync...",
  "Initializing aesthetic color matrix...",
  "Running semantic node extraction...",
  "Synthesizing volumetric canvas elements...",
  "Validating factual grounding URLs..."
];

export const CharacterDashboard: React.FC<CharacterDashboardProps> = ({ characterId, onBackToPortals }) => {
  const character = LORE_DATABASE[characterId];
  if (!character) {
    return (
      <div className="p-8 text-center text-red-400">
        Fatal Error: Portal node not loaded correctly.
      </div>
    );
  }

  const sections = Object.keys(character.sections);
  const [activeSectionId, setActiveSectionId] = useState<string>(sections[0]);
  const activeSection: LoreItem = character.sections[activeSectionId];

  // AI Visualizer States per section to persist while on the page
  const [visualizations, setVisualizations] = useState<{
    [sectionId: string]: {
      status: 'idle' | 'generating' | 'analyzing' | 'complete' | 'error';
      data: { image: GeneratedImage; analysis: AnalysisResult | null } | null;
      errorMsg: string | null;
      isFallback: boolean;
    };
  }>({});

  // Cycle load phrases during generation
  const [loadPhrase, setLoadPhrase] = useState(SECTION_PHRASES[0]);
  const currentVisual = visualizations[activeSectionId] || { status: 'idle', data: null, errorMsg: null, isFallback: false };

  useEffect(() => {
    if (currentVisual.status !== 'generating' && currentVisual.status !== 'analyzing') return;

    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % SECTION_PHRASES.length;
      setLoadPhrase(SECTION_PHRASES[index]);
    }, 1800);

    return () => clearInterval(interval);
  }, [currentVisual.status]);

  // Helper to pick section emojis
  const getSectionEmoji = (id: string): string => {
    const emojis: { [key: string]: string } = {
      'WORLD': '🌋',
      'FACTIONS': '🛡️',
      'STORY': '📜',
      'ARENAS': '🏟️',
      'ARMORY': '⚡',
      'CASE FILES': '📂',
      'EVIDENCE': '🔍',
      'THREATS': '👾',
      'ARCHIVE': '📁',
      'FEATURED MODE': '🎮',
      'RANKED TOURNAMENTS': '🏆',
      'CUSTOM CHAMPIONS': '👤',
      'FACTION REWARDS': '🎁',
      'LIVE EVENTS': '⏱️'
    };
    return emojis[id] || '📑';
  };

  // Generate Fallback Analysis if keys are missing/rate-limited
  const getFallbackAnalysis = (sectId: string, sectData: LoreItem): { image: GeneratedImage; analysis: AnalysisResult } => {
    // Collect specific default images matching sections
    const defaultSecImages: { [key: string]: string } = {
      'world': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800',
      'factions': 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800',
      'story': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
      'arenas': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800',
      'armory': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
      'case-files': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
      'evidence': 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=800',
      'threats': 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=800',
      'archive': 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800',
      'featured-mode': 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&q=80&w=800',
      'ranked-tournaments': 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=800',
      'custom-champions': 'https://images.unsplash.com/photo-1580234810907-b40315b76418?auto=format&fit=crop&q=80&w=800',
      'faction-rewards': 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=800',
      'live-events': 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=800'
    };

    const imageUrl = defaultSecImages[sectData.id] || character.defaultImage;

    const segments = [
      {
        label: sectData.title,
        format: 'detailed' as const,
        description: sectData.description,
        category: 'concept' as const,
        icon: getSectionEmoji(sectId),
        stats: sectData.stats || [],
        bounds: { x: 8, y: 12, width: 34, height: 44 }
      },
      {
        label: `${sectData.title} Key Metrics`,
        format: 'stats' as const,
        description: `Autonomous calibration scanner reading real-time static levels inside: "${sectData.tagline}". Everything is locked to the Genesis design canon.`,
        category: 'data' as const,
        icon: '📈',
        stats: sectData.stats || [
          { label: 'Energy Load', value: '88.5%' },
          { label: 'Sync Node', value: '0.98' },
          { label: 'Lore Weight', value: 'CANON' }
        ],
        bounds: { x: 58, y: 18, width: 34, height: 40 }
      },
      {
        label: 'Tactical Directives',
        format: 'compact' as const,
        description: sectData.details ? sectData.details.join(' ') : 'No archived tactical directions mapped for this gateway.',
        category: 'context' as const,
        icon: '⚡',
        bounds: { x: 25, y: 64, width: 50, height: 24 }
      }
    ];

    return {
      image: {
        base64: imageUrl,
        mimeType: 'image/jpeg',
        groundingUrls: [
          { title: 'Genesis Verse Wiki', uri: '#' },
          { title: 'Enigmatic Foundations', uri: '#' }
        ]
      },
      analysis: {
        segments
      }
    };
  };

  const handleTriggerAI = async () => {
    // Set localized loader status
    setVisualizations(prev => ({
      ...prev,
      [activeSectionId]: { status: 'generating', data: null, errorMsg: null, isFallback: false }
    }));

    try {
      // Step 1: Call Gemini generate content
      const queryPrompt = `${character.name} (${character.subtitle}) - Category ${activeSectionId}: ${activeSection.title}. Layout prompt: ${activeSection.imagePrompt}`;
      const imagePayload = await generateInfographic(queryPrompt);

      // Transition to scanning status
      setVisualizations(prev => ({
        ...prev,
        [activeSectionId]: { status: 'analyzing', data: { image: imagePayload, analysis: null }, errorMsg: null, isFallback: false }
      }));

      // Step 2: Analyze regions with Gemini
      const analysisPayload = await analyzeImageRegions(queryPrompt, imagePayload.base64);

      setVisualizations(prev => ({
        ...prev,
        [activeSectionId]: {
          status: 'complete',
          data: { image: imagePayload, analysis: analysisPayload },
          errorMsg: null,
          isFallback: false
        }
      }));

    } catch (err: any) {
      console.warn("Gemini Live Node Error, initiating premium local fallback matrix:", err);
      // Fallback is immediate, bulletproof, and provides awesome data bounds directly!
      const fallbackResult = getFallbackAnalysis(activeSectionId, activeSection);
      
      setVisualizations(prev => ({
        ...prev,
        [activeSectionId]: {
          status: 'complete',
          data: fallbackResult,
          errorMsg: null,
          isFallback: true
        }
      }));
    }
  };

  const isWW = character.id === 'war-witch';
  const isJD = character.id === 'jane-district';
  const colorGradients = isWW 
    ? 'text-orange-400 border-orange-500/20 bg-orange-950/20' 
    : isJD 
    ? 'text-yellow-400 border-yellow-500/20 bg-yellow-950/20' 
    : 'text-cyan-400 border-cyan-500/20 bg-cyan-950/20';

  return (
    <div className="w-full flex flex-col justify-between min-h-[calc(100vh-64px)] py-4 blueprint-grid relative text-white">
      
      {/* Upper Navigation Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/5 pb-4 mb-6 gap-4 px-4 md:px-0">
        <button
          onClick={onBackToPortals}
          className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-gray-400 hover:text-white transition-colors py-2 px-3 bg-white/5 hover:bg-white/10 rounded-lg border border-white/5"
        >
          <ArrowLeft className="w-4 h-4" /> [ BACK TO GATEWAYS LINK ]
        </button>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="font-mono text-[10px] tracking-widest text-gray-500 uppercase block">ACTIVE SUB-SYSTEM</span>
            <div className="font-display font-extrabold uppercase tracking-tight text-xl">
              {character.name} <span className="text-gray-400 font-light font-mono text-sm">/ {character.subtitle}</span>
            </div>
          </div>
          <span className={`w-3.5 h-3.5 rounded-full ${isWW ? 'bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.85)]' : isJD ? 'bg-yellow-500 shadow-[0_0_12px_rgba(234,179,8,0.85)]' : 'bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.85)]'} animate-pulse`} />
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="w-full flex overflow-x-auto pb-3 mb-6 scrollbar-thin scrollbar-thumb-white/10 gap-2 px-4 md:px-0 select-none">
        {sections.map((sect) => {
          const isActive = sect === activeSectionId;
          const matchCol = isWW ? 'bg-orange-500 text-white' : isJD ? 'bg-yellow-500 text-black' : 'bg-cyan-500 text-black';
          
          return (
            <button
              key={sect}
              onClick={() => setActiveSectionId(sect)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-xl font-display font-bold text-xs uppercase tracking-wider border transition-all duration-300 flex items-center gap-2.5 ${isActive ? `${matchCol} border-transparent shadow animate-glow` : 'bg-black/40 border-white/5 text-gray-400 hover:bg-black/60 hover:text-white hover:border-white/10'}`}
            >
              <span className="text-sm">{getSectionEmoji(sect)}</span>
              <span>{sect}</span>
            </button>
          );
        })}
      </div>

      {/* Primary Layout Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 items-stretch min-h-0 px-4 md:px-0">
        
        {/* Left Side: Lore readout and specs */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-zinc-950/60 border border-white/5 rounded-2xl p-6 relative overflow-hidden h-fit md:h-[520px]">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          
          <div className="blueprint-grid-fine absolute inset-0 opacity-15 pointer-events-none" />

          {/* Top diagnostic metadata */}
          <div className="relative z-10 flex justify-between items-center text-[10px] font-mono text-gray-500 uppercase pb-4 border-b border-white/5 mb-4">
            <span className="flex items-center gap-1.5">
              <Cpu className={`w-3.5 h-3.5 ${isWW ? 'text-orange-500' : isJD ? 'text-yellow-500' : 'text-cyan-400'}`} />
              CORE CODEX v10.4
            </span>
            <span>INDEX_NODE_{activeSectionId.replace(' ', '_')}</span>
          </div>

          {/* Header block */}
          <div className="relative z-10 flex-1 overflow-y-auto pr-1 scrollbar-thin">
            <span className={`inline-block px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest mb-3 border ${colorGradients}`}>
              {activeSectionId}
            </span>
            
            <h2 className="text-3xl font-extrabold uppercase tracking-tight font-display text-white mb-2 leading-tight">
              {activeSection.title}
            </h2>
            
            <p className="text-gray-400 text-sm font-sans font-light leading-relaxed mb-6 italic border-l-2 border-white/10 pl-3">
              {activeSection.tagline}
            </p>

            {/* Description */}
            <p className="text-sm text-gray-300 leading-relaxed mb-6 font-light">
              {activeSection.description}
            </p>

            {/* Bullets details scroll */}
            <div className="space-y-3 font-mono text-xs text-gray-400">
              <div className="uppercase text-[10px] tracking-widest text-gray-500 font-bold mb-2">TELEMETRY PARAGRAPHS</div>
              {activeSection.details.map((detail, idx) => (
                <div key={idx} className="flex items-start gap-2.5 leading-relaxed">
                  <span className={`w-1.5 h-1.5 rounded-full ${isWW ? 'bg-orange-500' : isJD ? 'bg-yellow-500' : 'bg-cyan-400'} mt-1.5 shrink-0`} />
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Core Stats footer readout */}
          {activeSection.stats && activeSection.stats.length > 0 && (
            <div className="relative z-10 pt-4 mt-6 border-t border-white/5 grid grid-cols-3 gap-3">
              {activeSection.stats.map((stat, i) => (
                <div key={i} className="bg-white/5 rounded-xl px-3 py-2 border border-white/5">
                  <div className="text-[9px] text-gray-500 uppercase tracking-wide truncate">{stat.label}</div>
                  <div className={`font-mono font-medium text-sm md:text-base ${isWW ? 'text-orange-400' : isJD ? 'text-yellow-400' : 'text-cyan-400'} truncate`}>
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Gemini Interactive Visualizer terminal */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center bg-black/60 border border-white/5 rounded-2xl relative overflow-hidden h-[520px]">
          
          <AnimatePresence mode="wait">
            
            {/* 1. IDLE STATE: Trigger Prompt */}
            {currentVisual.status === 'idle' && (
              <motion.div
                key="idle-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full flex flex-col justify-center items-center p-6 text-center blueprint-grid relative"
              >
                <div className={`absolute top-0 right-0 w-40 h-40 rounded-full blur-[100px] pointer-events-none ${isWW ? 'bg-orange-500/10' : isJD ? 'bg-yellow-500/10' : 'bg-cyan-500/10'}`} />
                
                <Cpu className={`w-12 h-12 text-gray-600 mb-4 ${isWW ? 'group-hover:text-orange-400' : isJD ? 'group-hover:text-yellow-500' : 'group-hover:text-cyan-400'} transition-colors`} />

                <h3 className="font-display font-extrabold text-xl uppercase tracking-wider text-white mb-2">
                  Oracle Visualizer Terminal
                </h3>
                
                <p className="text-gray-400 text-xs md:text-sm max-w-sm font-light leading-relaxed mb-6">
                  Initialize the Gemini cognitive engine to synthesize a fully interactive, annotated infographic of our lore nodes.
                </p>

                {/* Prompt display panel */}
                <div className="w-full max-w-md bg-zinc-950 border border-white/10 rounded-xl p-4.5 text-left font-mono text-[10px] md:text-xs text-gray-400 mb-6 relative">
                  <div className="absolute top-2 right-3 text-[9px] uppercase font-bold text-gray-600">RENDER_PROMPT</div>
                  <div className="text-cyan-400/80 mb-1">&gt; MODEL: GEMINI_FLASH_IMAGE</div>
                  <div className="line-clamp-2 leading-relaxed">
                    "{activeSection.imagePrompt}"
                  </div>
                </div>

                <button
                  onClick={handleTriggerAI}
                  className={`px-6 py-3 rounded-xl font-display font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all duration-300 transform active:scale-95 shadow-md ${isWW ? 'bg-orange-600 hover:bg-orange-500 text-white shadow-orange-950/25' : isJD ? 'bg-yellow-500 hover:bg-yellow-400 text-black shadow-yellow-950/25' : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-cyan-950/25'}`}
                >
                  <Sparkles className="w-4 h-4" /> [ INITIATE ORACLE RENDER ]
                </button>
              </motion.div>
            )}

            {/* 2. LOADING STATES: Generating or Analyzing */}
            {(currentVisual.status === 'generating' || currentVisual.status === 'analyzing') && (
              <motion.div
                key="loading-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full flex flex-col items-center justify-center p-6 bg-black/80 w-full text-center relative crt-overlay"
              >
                {/* Horizontal Scanning Laser laser effect */}
                <motion.div 
                  initial={{ y: '0%' }}
                  animate={{ y: '520px' }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                  className={`absolute top-0 left-0 w-full h-[2px] z-10 opacity-70 ${isWW ? 'bg-orange-400 shadow-[0_0_8px_#ea580c]' : isJD ? 'bg-yellow-400 shadow-[0_0_8px_#ca8a04]' : 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]'}`}
                />

                {/* Micro spinning circles */}
                <div className="relative mb-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className={`w-16 h-16 rounded-full border-2 border-t-transparent ${isWW ? 'border-orange-500' : isJD ? 'border-yellow-500' : 'border-cyan-400'}`}
                  />
                  <div className="absolute inset-0 flex items-center justify-center font-mono text-[10px] text-gray-400">
                    {currentVisual.status === 'generating' ? 'GEN' : 'ANLS'}
                  </div>
                </div>

                <h3 className="font-display font-extrabold text-lg uppercase tracking-wider text-white mb-2">
                  {currentVisual.status === 'generating' ? 'IMAGE SYNTHESIS ACTIVE' : 'REGION MODEL SCANNING'}
                </h3>

                {/* Load quote */}
                <div className="h-6 flex justify-center items-center w-full overflow-hidden relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={loadPhrase}
                      initial={{ y: 15, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -15, opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="text-gray-500 font-mono text-xs uppercase tracking-[0.15em] absolute text-center"
                    >
                      {loadPhrase}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {/* 3. COMPLETE RESULT WITH AUGMENTED CANVAS */}
            {currentVisual.status === 'complete' && currentVisual.data && (
              <motion.div
                key="result-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full h-full flex flex-col p-2 bg-zinc-950"
              >
                {/* Visualizer header metrics */}
                <div className="flex justify-between items-center px-4 py-1.5 border-b border-white/5 font-mono text-[9px] text-gray-500 uppercase">
                  <div className="flex items-center gap-1.5">
                    {currentVisual.isFallback ? (
                      <>
                        <HardDrive className="w-3.5 h-3.5 text-yellow-500" />
                        <span>LOCAL CO-CORE EMULATION STANDBY</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>GEMINI ONLINE CLOUD NODE RESPONSEED</span>
                      </>
                    )}
                  </div>
                  <button
                    onClick={handleTriggerAI}
                    className="flex items-center gap-1 hover:text-white transition-colors animate-pulse"
                  >
                    <RefreshCw className="w-3 h-3" />
                    RE-RENDER GRID
                  </button>
                </div>

                {/* Map Display area */}
                <div className="flex-1 min-h-0 relative">
                  {currentVisual.data.image && (
                    <AugmentedCanvas 
                      image={currentVisual.data.image}
                      analysis={currentVisual.data.analysis}
                      isScanning={false}
                    />
                  )}
                </div>

                {/* Hotspot guidance subtitle */}
                <div className="text-center pb-2 pt-1 uppercase font-mono text-[10px] text-gray-500 tracking-wider">
                  &lt; Hover over glowing points on the diagram to inspect system nodes &gt;
                </div>
              </motion.div>
            )}

          </AnimatePresence>

        </div>

      </div>

      {/* Footer Diagnostic Readout */}
      <div className="z-10 mt-6 border-t border-white/5 pt-4 flex items-center justify-between text-[10px] font-mono text-gray-500 uppercase px-4 max-w-full">
        <span>GATEWAY ROUTER: VERIFIED</span>
        <span>ENTROPY DENSITY SPEC: {character.glowClass.includes('orange') ? 'ABYSSUM SEC-7' : character.glowClass.includes('yellow') ? 'GOTHIC SEC-9' : 'CLOUD SEC-15'}</span>
      </div>

    </div>
  );
};
