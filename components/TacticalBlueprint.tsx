/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Compass, Crosshair, Grid, Ruler, Shield, Cpu, Activity, Info } from 'lucide-react';

interface TacticalBlueprintProps {
  isVisible: boolean;
  onClose: () => void;
}

export const TacticalBlueprint: React.FC<TacticalBlueprintProps> = ({ isVisible, onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, percentX: 50, percentY: 50 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Update layout dimensions dynamically
  useEffect(() => {
    if (!containerRef.current) return;

    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    const observer = new ResizeObserver(() => updateSize());
    observer.observe(containerRef.current);
    updateSize();

    return () => observer.disconnect();
  }, []);

  // Track cursor position to display interactive blueprint drafting lines
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({
      x,
      y,
      percentX: Math.round((x / rect.width) * 100),
      percentY: Math.round((y / rect.height) * 100),
    });
  };

  if (!isVisible) return null;

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.99 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="absolute inset-0 z-[5] rounded-2xl md:rounded-3xl border border-cyan-500/30 bg-[#020713]/85 backdrop-blur-[2px] overflow-hidden pointer-events-auto cursor-crosshair flex flex-col select-none font-mono text-[10px]"
    >
      {/* Blueprint Grid Layer */}
      <div 
        className="absolute inset-0 opacity-25" 
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(6, 182, 212, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(6, 182, 212, 0.15) 1px, transparent 1px),
            linear-gradient(to right, rgba(6, 182, 212, 0.05) 50px, transparent 50px),
            linear-gradient(to bottom, rgba(6, 182, 212, 0.05) 50px, transparent 50px)
          `,
          backgroundSize: '10px 10px, 10px 10px, 50px 50px, 50px 50px',
        }}
      />

      {/* Blueprint Drawing Blueprint Annotations (Corners & Borders) */}
      <div className="absolute inset-4 border border-cyan-500/10 pointer-events-none rounded-lg">
        {/* T-Square Grid Marks */}
        <div className="absolute top-0 left-1/4 w-[1px] h-3 bg-cyan-400/40" />
        <div className="absolute top-0 left-1/2 w-[1px] h-4 bg-cyan-400/60" />
        <div className="absolute top-0 left-3/4 w-[1px] h-3 bg-cyan-400/40" />
        <div className="absolute bottom-0 left-1/2 w-[1px] h-4 bg-cyan-400/60" />

        <div className="absolute left-0 top-1/4 w-3 h-[1px] bg-cyan-400/40" />
        <div className="absolute left-0 top-1/2 w-4 h-[1px] bg-cyan-400/60" />
        <div className="absolute left-0 top-3/4 w-3 h-[1px] bg-cyan-400/40" />
        <div className="absolute right-0 top-1/2 w-4 h-[1px] bg-cyan-400/60" />
      </div>

      {/* Floating Blueprint Widgets / Diagnostics Sidebars */}
      <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none z-10">
        
        {/* Header telemetry blocks */}
        <div className="flex justify-between items-start">
          <div className="space-y-1 bg-cyan-950/40 p-2.5 rounded border border-cyan-500/20 backdrop-blur-sm">
            <div className="flex items-center gap-1.5 text-cyan-400 font-bold tracking-widest text-[10px]">
              <Grid size={12} className="animate-spin-slow text-cyan-400" />
              <span>TACTICAL SCHEMATIC GRID v12.0</span>
            </div>
            <p className="text-[8.5px] text-cyan-500/70 uppercase">
              GRID RES_FACTOR: X-216 // BOUNDING_BOX: {dimensions.width}px x {dimensions.height}px
            </p>
          </div>

          <div className="text-right space-y-1 bg-cyan-950/40 p-2.5 rounded border border-cyan-500/20 backdrop-blur-sm hidden sm:block">
            <span className="text-cyan-400 font-bold flex items-center justify-end gap-1 text-[9px]">
              <Compass size={12} className="animate-pulse" /> COMPASS VECTOR
            </span>
            <span className="text-[8.5px] text-cyan-500/70 block uppercase">
              RADIAN DIAGNOSTIC: {(mousePos.percentX * 0.0628).toFixed(4)} RAD
            </span>
          </div>
        </div>

        {/* Central Complex Wireframe Circle Overlay (Non-interactive visual anchor) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center opacity-40">
          <div className="relative w-72 h-72 border border-dashed border-cyan-500/30 rounded-full flex items-center justify-center">
            {/* Spinning outward rings */}
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
              className="absolute w-52 h-52 border border-cyan-500/20 border-r-cyan-400/60 rounded-full"
            />
            <motion.div 
              animate={{ rotate: -360 }} 
              transition={{ repeat: Infinity, duration: 15, ease: 'linear' }}
              className="absolute w-44 h-44 border border-dashed border-cyan-400/10 border-t-cyan-400/50 rounded-full"
            />
            {/* Compass dials */}
            <div className="absolute inset-0 flex items-center justify-center font-mono text-[7px] text-cyan-500/50">
              <span className="absolute top-1 font-bold">000° [N]</span>
              <span className="absolute right-1 font-bold">090° [E]</span>
              <span className="absolute bottom-1 font-bold">180° [S]</span>
              <span className="absolute left-1 font-bold">270° [W]</span>
            </div>
            <Crosshair size={26} className="text-cyan-400/40 animate-pulse" />
          </div>
        </div>

        {/* Dynamic coordinate follower */}
        {mousePos.x > 0 && mousePos.y > 0 && (
          <div 
            className="absolute bg-[#020c22]/95 border border-cyan-400/40 p-2 rounded text-[8.5px] text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)] flex flex-col gap-0.5"
            style={{ 
              left: `${Math.min(mousePos.x + 15, dimensions.width - 150)}px`, 
              top: `${Math.min(mousePos.y + 15, dimensions.height - 80)}px` 
            }}
          >
            <div className="font-bold flex items-center gap-1 border-b border-cyan-500/20 pb-1">
              <Ruler size={10} /> DRAFTING VECTOR
            </div>
            <span>LOC_X: {Math.round(mousePos.x)}px ({mousePos.percentX}%)</span>
            <span>LOC_Y: {Math.round(mousePos.y)}px ({mousePos.percentY}%)</span>
            <span>Z_INDEX: OVERLAY_FLTR</span>
          </div>
        )}

        {/* Interactive drafting line follower */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Vertical axis line follower */}
          <div 
            className="absolute top-0 bottom-0 w-[0.5px] border-l border-dashed border-cyan-400/20"
            style={{ left: `${mousePos.x}px` }}
          />
          {/* Horizontal axis line follower */}
          <div 
            className="absolute left-0 right-0 h-[0.5px] border-t border-dashed border-cyan-400/20"
            style={{ top: `${mousePos.y}px` }}
          />

          {/* Micro dots on axes */}
          <div 
            className="absolute w-1.5 h-1.5 bg-cyan-400 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_8px_cyan]"
            style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
          />
        </div>

        {/* Bottom Technical diagnostics parameters panels */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-end gap-3 pt-4">
          
          {/* Schematic modules checklist */}
          <div className="bg-cyan-950/40 border border-cyan-500/20 p-2.5 rounded backdrop-blur-sm max-w-sm space-y-1.5">
            <span className="text-cyan-400 font-bold block text-[9px] border-b border-cyan-500/20 pb-1 flex items-center gap-1.5">
              <Cpu size={12} className="text-cyan-400" /> SYSTEM ARCHITECTURE CHANNELS
            </span>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[8px] uppercase">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-sm bg-cyan-400/80" />
                <span className="text-cyan-300">WAVEFORM_GEN: ACTIVATED</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-sm bg-cyan-400/80" />
                <span className="text-cyan-300">CALIBRATOR: SYNCD</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-sm bg-cyan-400/80" />
                <span className="text-cyan-300">GRID_LOCK: ENHANCED</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-sm bg-cyan-400/80" />
                <span className="text-cyan-300">HOLOINTENSITY: OK (85%)</span>
              </div>
            </div>
          </div>

          <div className="bg-cyan-950/40 border border-cyan-500/20 p-2.5 rounded backdrop-blur-sm text-[8px] uppercase max-w-xs space-y-1">
            <span className="text-cyan-400 font-bold block text-[9.5px] border-b border-cyan-500/20 pb-0.5 flex items-center gap-1.5">
              <Activity size={11} className="animate-pulse" /> LIVE TRACE RATIO
            </span>
            <div className="flex items-center gap-2">
              <span className="text-cyan-500">RESISTIVITY:</span>
              <span className="text-cyan-300 font-bold">14.8M OHMS / SEC</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-cyan-500">ATTENUATION:</span>
              <span className="text-cyan-300 font-bold">3.22 DB / KM_MATRIX</span>
            </div>
          </div>
        </div>

      </div>

      {/* Real-time sweeping neon laser drafting scanner line */}
      <motion.div
        animate={{ 
          top: ['0%', '100%', '0%'] 
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 6, 
          ease: 'linear' 
        }}
        className="absolute left-0 right-0 h-[2px] bg-cyan-400 shadow-[0_0_12px_#22d3ee] pointer-events-none z-10"
      />

      {/* Floating Blueprint Instructions / Dismiss trigger */}
      <div className="absolute right-4 bottom-4 z-20 pointer-events-auto">
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1.5 bg-cyan-950/90 border border-cyan-400 text-cyan-400 px-3 py-1.5 rounded-md hover:bg-cyan-400 hover:text-black transition-all shadow-lg cursor-pointer uppercase font-bold tracking-widest text-[8.5px]"
          title="Deactivate Tactical Overlay"
        >
          <Info size={11} />
          <span>[ DISMISS BLUEPRINT ]</span>
        </button>
      </div>
    </motion.div>
  );
};
