/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Settings, 
  Activity, 
  Zap, 
  Grid, 
  Compass, 
  SlidersHorizontal,
  Target,
  Sparkles,
  Info 
} from 'lucide-react';
import { analyzeImageRegions } from '../services/geminiService';
import { AnalysisResult, Segment } from '../types';

interface AugmentedImageConsoleProps {
  onClose: () => void;
}

const LOCAL_FALLBACK_ANALYSIS: AnalysisResult = {
  segments: [
    {
      label: "Visual Core Vector",
      format: "compact",
      description: "Structural scan indicates high density values at visual coordinates. Ambient frequency remains aligned with the Genesis engine calibration guidelines.",
      category: "structure",
      icon: "🎯",
      bounds: { x: 15, y: 15, width: 25, height: 25 }
    },
    {
      label: "Neural Spectrum Node",
      format: "stats",
      description: "Atmospheric and volumetric gradients match typical sector emissions. Sensor alignment confirms perfect focus and grounding constraints.",
      category: "data",
      icon: "⚡",
      stats: [
        { label: "Emission Index", value: "88.6%" },
        { label: "Sync Node", value: "0.95" }
      ],
      bounds: { x: 55, y: 20, width: 30, height: 25 }
    },
    {
      label: "Abex Anchor Point",
      format: "detailed",
      description: "Primary gravity anchorage localized. Transmissions match direct signals emitted from the lower sub-levels of Section 12-b.",
      category: "concept",
      icon: "⚙️",
      bounds: { x: 35, y: 55, width: 35, height: 30 }
    }
  ]
};

export const AugmentedImageConsole: React.FC<AugmentedImageConsoleProps> = ({ onClose }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [contrastVal, setContrastVal] = useState(100);
  const [frequencyVal, setFrequencyVal] = useState(8.4);
  const [energyMax, setEnergyMax] = useState(72);
  const [activeSegmentId, setActiveSegmentId] = useState<number | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'CONSOLE' | 'CALIBRATION' | 'MATRIX'>('CONSOLE');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageIntake = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg("INVALID SIGNAL FORMAT. CHOOSE A SUPPORTED GRAPHIC PAYLOAD.");
      return;
    }
    setErrorMsg(null);
    setAnalysis(null);
    setActiveSegmentId(null);

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      triggerVeo3Pulse(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const triggerVeo3Pulse = async (base64String: string) => {
    setIsScanning(true);
    
    // Play sweet visual calibrator sweeps
    const scanDelay = new Promise(resolve => setTimeout(resolve, 3200));

    try {
      // Stripping data URIs header if passed directly to API
      const rawBase64 = base64String.split(',')[1] || base64String;
      
      // Step 2: Trigger Gemini Image Analysis
      const res = await analyzeImageRegions("Uploaded Holographic Visual Scanner Intake", rawBase64);
      
      await scanDelay; // Wait for full visual scan animation sweep
      setAnalysis(res);
    } catch (err) {
      console.warn("Gemini Engine Offline, falling back to local cognitive matrix:", err);
      await scanDelay;
      setAnalysis(LOCAL_FALLBACK_ANALYSIS);
    } finally {
      setIsScanning(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageIntake(e.dataTransfer.files[0]);
    }
  };

  const clearConsole = () => {
    setImageSrc(null);
    setAnalysis(null);
    setActiveSegmentId(null);
    setErrorMsg(null);
  };

  const getFormatEmoji = (format: string) => {
    switch (format) {
      case 'stats': return '📊';
      case 'detailed': return '📜';
      default: return '🛡️';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
      />

      {/* Holographic Cognitive Engine Window Panels */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 15 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-5xl h-[85vh] bg-[#030307]/95 border border-white/10 rounded-2xl flex flex-col pointer-events-auto overflow-hidden shadow-2xl blueprint-grid"
      >
        {/* CRT Scanline */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.12)_50%)] bg-[length:100%_4px] opacity-10 pointer-events-none z-30" />

        {/* Panel Header */}
        <header className="px-5 py-4 border-b border-white/5 bg-zinc-950/80 flex items-center justify-between relative z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center font-bold text-cyan-400 text-sm animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.2)]">
              Ξ
            </div>
            <div>
              <h3 className="text-xs font-extrabold tracking-widest font-display uppercase text-white leading-none">
                AUGMENTED IMAGE CONSOLE
              </h3>
              <p className="text-[9px] font-mono text-cyan-400 leading-none mt-1 uppercase tracking-widest">
                Holographic Cognitive Engine UI v3.2 · Veo-3 Pulsar Link
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Tab Links */}
            <div className="hidden md:flex rounded-lg bg-zinc-950 p-0.5 border border-white/5 font-mono text-[9px] font-bold">
              {['CONSOLE', 'CALIBRATION', 'MATRIX'].map(tab => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-3 py-1 rounded-md transition-all uppercase cursor-pointer ${activeTab === tab ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/15' : 'text-zinc-500'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-lg border border-white/5 hover:border-red-500/20 hover:bg-red-950/20 text-gray-400 hover:text-red-400 flex items-center justify-center transition-all cursor-pointer"
            >
              <X size={15} />
            </button>
          </div>
        </header>

        {/* Main Work Area split into viewports */}
        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row relative z-10">
          
          {/* LEFT PANEL: Scope/Interactive Canvas Viewer */}
          <div className="flex-1 flex flex-col bg-black/40 min-h-0 border-b lg:border-b-0 lg:border-r border-white/5">
            
            <div className="flex-1 min-h-0 relative flex items-center justify-center p-6">
              
              {!imageSrc ? (
                /* Drag & Drop Intake Box */
                <div 
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full max-w-lg aspect-[16/10] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-all ${isDragActive ? 'border-cyan-400 bg-cyan-950/10' : 'border-zinc-800 bg-zinc-950/20 hover:border-zinc-700 hover:bg-zinc-950/40'}`}
                >
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => e.target.files?.[0] && handleImageIntake(e.target.files[0])}
                    className="hidden" 
                  />
                  <div className="w-12 h-12 rounded-xl bg-cyan-950/40 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 animate-pulse">
                    <Upload className="w-6 h-6" />
                  </div>
                  
                  <h4 className="text-sm font-bold uppercase text-white font-mono tracking-wider">
                    RECON IMAGE INTAKE
                  </h4>
                  <p className="text-[10px] text-zinc-500 font-mono uppercase mt-1 max-w-sm leading-relaxed">
                    Drag and drop file signals or click here to import neural spectrum logs.
                  </p>
                  <span className="text-[9px] px-2 py-0.5 mt-4 rounded bg-zinc-900 text-zinc-600 border border-white/5 font-mono">
                    CHANNELS: JPEG / PNG / WEBP
                  </span>
                </div>
              ) : (
                /* Dynamic Preview Window with Scanning scope overlays and Veo-3 wave lines */
                <div className="relative w-full max-w-2xl h-full flex items-center justify-center">
                  
                  {/* Holographic scanner grid backdrop lines */}
                  <div className="absolute inset-0 border border-white/5 flex pointer-events-none rounded-xl">
                    <div className="flex-1 border-r border-dashed border-white/5" />
                    <div className="flex-1 border-r border-dashed border-white/5" />
                    <div className="flex-1 border-r border-dashed border-white/5" />
                  </div>

                  <div 
                    className="relative max-h-full max-w-full rounded-xl border border-white/10 bg-zinc-950/40 p-2.5 shadow-2xl relative overflow-hidden flex items-center justify-center"
                    style={{ aspectRatio: '16/10' }}
                  >
                    {/* Visual target crosses */}
                    <div className="absolute top-2 left-2 text-[8px] font-mono text-cyan-500 leading-none">[+] SEC_SCANNER_CONNECTED</div>
                    <div className="absolute bottom-2 right-2 text-[8px] font-mono text-cyan-500 leading-none">GRID: SYNC_{energyMax}%</div>

                    {/* Pre-render filter adjustments */}
                    <img 
                      src={imageSrc} 
                      alt="Uploaded Scan Intake"
                      style={{ 
                        filter: `contrast(${contrastVal}%) brightness(${95}%)`,
                        mixBlendMode: 'screen'
                      }}
                      className="max-w-full max-h-full object-contain rounded-lg transition-transform"
                    />

                    {/* Laser Overlay Scan Line (Sweeps back and forth) */}
                    <AnimatePresence>
                      {isScanning && (
                        <motion.div 
                          initial={{ left: '0%' }}
                          animate={{ left: '100%' }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
                          className="absolute top-0 bottom-0 w-[3px] bg-gradient-to-b from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#22d3ee] z-20 pointer-events-none"
                        />
                      )}
                    </AnimatePresence>

                    {/* Veo-3 Pulse Wave Animation: Giant expanding and fading ripples */}
                    <AnimatePresence>
                      {isScanning && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 overflow-hidden">
                          {/* Inner pulse waves */}
                          <motion.div 
                            initial={{ scale: 0.1, opacity: 0.8 }}
                            animate={{ scale: 1.8, opacity: 0 }}
                            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                            className="absolute w-44 h-44 rounded-full border-2 border-cyan-400/60 blur-[3px]"
                          />
                          <motion.div 
                            initial={{ scale: 0.1, opacity: 0.6 }}
                            animate={{ scale: 2.4, opacity: 0 }}
                            transition={{ duration: 2.2, repeat: Infinity, delay: 0.4, ease: "easeOut" }}
                            className="absolute w-44 h-44 rounded-full border border-teal-400/40 blur-[5px]"
                          />
                          <motion.div 
                            initial={{ scale: 0.1, opacity: 0.4 }}
                            animate={{ scale: 3.0, opacity: 0 }}
                            transition={{ duration: 2.6, repeat: Infinity, delay: 0.8, ease: "easeOut" }}
                            className="absolute w-44 h-44 rounded-full border border-blue-400/20 blur-[8px]"
                          />
                        </div>
                      )}
                    </AnimatePresence>

                    {/* Plot Interactive scan dots once compiled response hydrates! */}
                    {!isScanning && analysis?.segments && (
                      <div className="absolute inset-2 z-20 pointer-events-auto">
                        {analysis.segments.map((node, i) => {
                          const isActive = activeSegmentId === i;
                          return (
                            <div
                              key={i}
                              style={{ 
                                left: `${node.bounds.x}%`, 
                                top: `${node.bounds.y}%`,
                                transform: 'translate(-50%, -50%)'
                              }}
                              className="absolute"
                            >
                              <button
                                type="button"
                                onClick={() => setActiveSegmentId(isActive ? null : i)}
                                className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all bg-black cursor-pointer shadow-[0_0_12px_rgba(34,211,238,0.5)] ${isActive ? 'border-cyan-400 scale-125' : 'border-zinc-500 hover:border-cyan-400 hover:scale-110'}`}
                              >
                                <Target size={12} className={`text-cyan-400 ${isActive ? 'animate-spin' : ''}`} />
                              </button>
                              
                              {/* Hover tooltip label */}
                              <div className="absolute left-1/2 bottom-7 transform -translate-x-1/2 bg-zinc-950 border border-white/10 px-2 py-0.5 rounded text-[8px] font-mono uppercase font-bold text-white tracking-widest leading-none shadow-xl pointer-events-none whitespace-nowrap">
                                {node.label}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Dark filter when inspect is selected */}
                    <div className={`absolute inset-0 bg-black/60 rounded-xl transition-all duration-300 pointer-events-none ${activeSegmentId !== null ? 'opacity-100' : 'opacity-0'}`} />

                  </div>

                </div>
              )}

            </div>

            {/* Visualizer adjustment bar */}
            {imageSrc && (
              <div className="bg-zinc-950/70 border-t border-white/5 px-6 py-3 flex items-center justify-between font-mono text-[9px] text-zinc-500 uppercase select-none shrink-0">
                <div className="flex gap-4">
                  <span>SPECTRUM: RECON_INTAKE</span>
                  <span>SIZE: SYNTHESIZED_VEO3</span>
                </div>
                <button 
                  onClick={clearConsole}
                  className="text-orange-400 hover:text-white transition-colors"
                >
                  [ CANCEL SIGNAL ]
                </button>
              </div>
            )}

          </div>

          {/* RIGHT PANEL: Hotspot Information & Analysis Controls */}
          <div className="w-full lg:w-[350px] bg-zinc-950/40 flex flex-col justify-between overflow-y-auto shrink-0 border-t lg:border-t-0 p-5 md:p-6">
            
            <div className="space-y-6">

              {/* Console Section Options */}
              {activeTab === 'CONSOLE' && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono font-bold text-zinc-500 tracking-widest uppercase block">
                      SYSTEM SCAN READOUT
                    </span>
                    <h3 className="text-[15px] font-extrabold uppercase font-display text-white">
                      Holographic Engine Link
                    </h3>
                    <p className="text-[11px] text-zinc-400 leading-relaxed font-light font-mono">
                      Feed biometric images to scan the environment. Calibrate system resonance vectors to unlock deep-wave context patterns.
                    </p>
                  </div>

                  {errorMsg && (
                    <div className="p-3 bg-red-950/40 border border-red-500/20 text-red-500 rounded-lg text-[10px] font-mono uppercase tracking-wide leading-relaxed">
                      {errorMsg}
                    </div>
                  )}

                  <AnimatePresence mode="wait">
                    {/* 1. SCANNIN SYSTEM LOGS */}
                    {isScanning && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-3 bg-zinc-950/60 p-4 border border-cyan-500/10 rounded-xl"
                      >
                        <div className="flex items-center gap-2">
                          <Activity size={12} className="text-cyan-400 animate-pulse" />
                          <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest animate-pulse">
                            VEO-3 PULSAR ACTIVE
                          </span>
                        </div>
                        <p className="text-[10px] font-mono text-zinc-500 leading-normal uppercase">
                          &gt; extracting matrix vectors...<br />
                          &gt; analyzing pixel regions...<br />
                          &gt; performing google search grounding...<br />
                          &gt; writing context segments...
                        </p>
                        
                        {/* Interactive scanning animation box */}
                        <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 3.0, ease: 'easeOut' }}
                            className="h-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* 2. INSPECTING ACTIVE SEGMENT EXPANSION */}
                    {!isScanning && analysis && activeSegmentId !== null && (
                      (() => {
                        const segment = analysis.segments[activeSegmentId];
                        return (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4 bg-zinc-900/40 border border-cyan-500/35 p-4 rounded-xl relative overflow-hidden"
                          >
                            <div className="flex justify-between items-start border-b border-white/5 pb-2">
                              <div>
                                <span className="inline-block px-2 py-0.5 rounded text-[8px] font-mono bg-cyan-950/40 text-cyan-400 border border-cyan-500/20 uppercase font-bold">
                                  {segment.category}
                                </span>
                                <h4 className="text-xs font-bold font-mono text-white mt-1 uppercase">
                                  {segment.label}
                                </h4>
                              </div>
                              <span className="text-2xl shrink-0">{segment.icon || getFormatEmoji(segment.format)}</span>
                            </div>

                            <p className="text-[10px] font-mono text-zinc-300 leading-relaxed uppercase">
                              {segment.description}
                            </p>

                            {/* Stats listings if available */}
                            {segment.stats && segment.stats.length > 0 && (
                              <div className="grid grid-cols-2 gap-2 pt-1">
                                {segment.stats.map((st, i) => (
                                  <div key={i} className="bg-black/60 p-2 rounded border border-white/5">
                                    <div className="text-cyan-400 font-mono text-[10px] font-bold truncate">{st.value}</div>
                                    <div className="text-[7px] text-zinc-500 uppercase mt-0.5 truncate">{st.label}</div>
                                  </div>
                                ))}
                              </div>
                            )}

                            <button 
                              type="button"
                              onClick={() => setActiveSegmentId(null)}
                              className="w-full py-1.5 border border-white/10 hover:border-white/20 bg-zinc-950 rounded-lg text-[9px] font-mono text-zinc-400 hover:text-white transition-all uppercase"
                            >
                              [ Return to Scope ]
                            </button>
                          </motion.div>
                        );
                      })()
                    )}

                    {/* 3. CORE NODE CHANNELS */}
                    {!isScanning && analysis && activeSegmentId === null && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-3"
                      >
                        <span className="text-[9px] font-mono text-zinc-500 tracking-widest uppercase font-bold block">
                          INDEXED RECON SENSORS ({analysis.segments.length})
                        </span>

                        <div className="space-y-2">
                          {analysis.segments.map((node, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setActiveSegmentId(i)}
                              className="w-full text-left p-3 rounded-lg border border-white/5 bg-zinc-950/40 hover:border-cyan-500/25 transition-all text-[10px] font-mono group cursor-pointer flex justify-between items-center"
                            >
                              <div className="min-w-0">
                                <p className="text-zinc-500 text-[8px] uppercase">{node.category}</p>
                                <p className="text-zinc-300 font-bold mt-0.5 truncate uppercase">{node.label}</p>
                              </div>
                              <span className="text-zinc-600 group-hover:text-cyan-400 transition-colors">&gt; SCAN</span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* 4. DRAG FILE NOTICE */}
                    {!isScanning && !analysis && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="rounded-xl border border-dashed border-zinc-800 bg-zinc-950/30 p-5 text-center flex flex-col items-center"
                      >
                        <ImageIcon className="w-8 h-8 text-zinc-700 mb-2 animate-pulse" />
                        <h4 className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">
                          Awaiting Signal Input
                        </h4>
                        <p className="text-[9px] font-mono text-zinc-500 uppercase mt-1 leading-relaxed max-w-xs">
                          Provide a screenshot or environment frame to activate the Holographic Cognitive Engine.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              )}

              {/* Calibration Tab options */}
              {activeTab === 'CALIBRATION' && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <h4 className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">
                      Calibration Controls
                    </h4>
                    <p className="text-[9px] text-zinc-550 leading-relaxed font-mono">
                      Adjust image filters manually to lock context resolution.
                    </p>
                  </div>

                  {/* Contrast Adjustment */}
                  <div className="space-y-1.5 bg-black/40 p-3 rounded-xl border border-white/5">
                    <div className="flex justify-between font-mono text-[9px] text-zinc-400 uppercase">
                      <span>Image Contrast</span>
                      <span className="text-cyan-400">{contrastVal}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="50" 
                      max="180" 
                      value={contrastVal} 
                      onChange={(e) => setContrastVal(parseInt(e.target.value))}
                      className="w-full accent-cyan-400 bg-zinc-900 rounded-full h-1 cursor-pointer"
                    />
                  </div>

                  {/* Low frequency resonance calibration */}
                  <div className="space-y-1.5 bg-black/40 p-3 rounded-xl border border-white/5">
                    <div className="flex justify-between font-mono text-[9px] text-zinc-400 uppercase">
                      <span>Pulsar Frequency</span>
                      <span className="text-amber-500">{frequencyVal} Hz</span>
                    </div>
                    <input 
                      type="range" 
                      min="4.0" 
                      max="20.0" 
                      step="0.1" 
                      value={frequencyVal} 
                      onChange={(e) => setFrequencyVal(parseFloat(e.target.value))}
                      className="w-full accent-amber-500 bg-zinc-900 rounded-full h-1 cursor-pointer"
                    />
                  </div>

                  {/* Energy calibration */}
                  <div className="space-y-1.5 bg-black/40 p-3 rounded-xl border border-white/5">
                    <div className="flex justify-between font-mono text-[9px] text-zinc-400 uppercase">
                      <span>Sync Energy Lock</span>
                      <span className="text-teal-400">{energyMax}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="20" 
                      max="100" 
                      value={energyMax} 
                      onChange={(e) => setEnergyMax(parseInt(e.target.value))}
                      className="w-full accent-teal-400 bg-zinc-900 rounded-full h-1 cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {/* Cognitive Matrices information blocks */}
              {activeTab === 'MATRIX' && (
                <div className="space-y-4 font-mono text-[10px] text-zinc-500 uppercase leading-relaxed">
                  <div className="flex items-center gap-1.5 text-zinc-300 font-bold mb-1">
                    <Target className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
                    COG_ENGINE METRIC SPEC
                  </div>
                  <p>Model mapping layers utilize a sub-critical grid overlay running through gemini-2.5-flash with automated search citations hydration.</p>
                  <p>In case of timeout or server-link resets, the co-core offline emulator activates immediately under localized guidelines, safeguarding operations.</p>
                </div>
              )}

            </div>

            {/* Static panel diagnostics info */}
            <div className="border-t border-white/5 pt-4 flex justify-between items-center font-mono text-[8px] text-zinc-650 uppercase">
              <span>AIC CORE LOGS</span>
              <span>NOMINAL_SEC_CYCLES</span>
            </div>

          </div>

        </div>

      </motion.div>
    </div>
  );
};
