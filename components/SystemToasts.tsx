/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Zap, AlertTriangle, Eye, X } from 'lucide-react';

export interface Toast {
  id: string;
  type: 'critical' | 'overcharge' | 'info';
  title: string;
  message: string;
  duration?: number;
}

interface SystemToastsProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

export const SystemToasts: React.FC<SystemToastsProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed top-24 right-4 md:right-8 z-[120] flex flex-col gap-3 max-w-sm w-full pointer-events-none select-none font-mono">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
};

interface ToastCardProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

const ToastCard: React.FC<ToastCardProps> = ({ toast, onDismiss }) => {
  const duration = toast.duration || 4500;

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, duration);
    return () => clearTimeout(timer);
  }, [toast.id, duration, onDismiss]);

  const isCritical = toast.type === 'critical';
  const isOvercharge = toast.type === 'overcharge';

  // Aesthetic colors and properties
  const borderColor = isCritical 
    ? 'border-red-500/40 hover:border-red-500/60 shadow-[0_0_20px_rgba(239,68,68,0.15)] bg-red-950/20' 
    : isOvercharge 
      ? 'border-cyan-500/40 hover:border-cyan-500/60 shadow-[0_0_20px_rgba(6,182,212,0.15)] bg-cyan-950/20' 
      : 'border-amber-500/40 hover:border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.15)] bg-amber-950/20';

  const badgeBg = isCritical 
    ? 'bg-red-500/10 text-red-400 border-red-500/30' 
    : isOvercharge 
      ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' 
      : 'bg-amber-500/10 text-amber-400 border-amber-500/30';

  const progressBg = isCritical 
    ? 'bg-red-500' 
    : isOvercharge 
      ? 'bg-cyan-500' 
      : 'bg-amber-500';

  const glowDotColor = isCritical 
    ? 'bg-red-500' 
    : isOvercharge 
      ? 'bg-cyan-500' 
      : 'bg-amber-500';

  const renderIcon = () => {
    if (isCritical) {
      return <ShieldAlert className="w-5 h-5 text-red-500 animate-pulse" />;
    }
    if (isOvercharge) {
      return <Zap className="w-5 h-5 text-cyan-400 animate-bounce" />;
    }
    return <AlertTriangle className="w-5 h-5 text-amber-500" />;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.95, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className={`pointer-events-auto relative w-full border rounded-xl overflow-hidden backdrop-blur-md p-4 transition-all duration-300 ${borderColor}`}
    >
      {/* Sound indicator / tech visual flair */}
      <div className="absolute top-0 left-0 w-1.5 h-full bg-current opacity-30" />

      {/* Top micro tech metrics */}
      <div className="flex justify-between items-center text-[8px] text-zinc-550 mb-2 border-b border-white/5 pb-1.5 uppercase tracking-widest font-black">
        <span className="flex items-center gap-1">
          <span className={`w-1 h-1 rounded-full ${glowDotColor} animate-ping`} />
          SECURE HUB TELEMETRY
        </span>
        <span>ID_SYSALERT_X{toast.id.slice(-4)}</span>
      </div>

      <div className="flex gap-3">
        {/* Icon container */}
        <div className="flex-none pt-0.5">
          {renderIcon()}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <h4 className={`text-[11px] font-black tracking-widest uppercase ${
              isCritical ? 'text-red-400' : isOvercharge ? 'text-cyan-400' : 'text-amber-400'
            }`}>
              {toast.title}
            </h4>
            <span className={`text-[7px] border px-1 py-0.5 rounded-sm uppercase tracking-wide leading-none ${badgeBg}`}>
              {isCritical ? 'ALERT' : isOvercharge ? 'PEAK' : 'WARN'}
            </span>
          </div>
          <p className="text-[9px] text-zinc-400 leading-normal font-sans uppercase">
            {toast.message}
          </p>
        </div>

        {/* Manual Dismiss button */}
        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          className="flex-none self-start text-zinc-500 hover:text-white transition-colors p-0.5 rounded cursor-pointer"
        >
          <X size={11} />
        </button>
      </div>

      {/* Tech diagnostics subtext */}
      <div className="mt-3 text-[7.5px] text-zinc-550 flex justify-between uppercase">
        <span>REACTOR STATE: {isCritical ? 'STRESS_RESERVES' : isOvercharge ? 'MAX_DENSITY_CAP' : 'MODERATE'}</span>
        <span>[ 100Hz CALIBRATION ]</span>
      </div>

      {/* Futuristic Progress decay bar */}
      <div className="absolute bottom-0 left-0 h-[2px] w-full bg-white/5">
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
          className={`h-full ${progressBg}`}
        />
      </div>
    </motion.div>
  );
};
