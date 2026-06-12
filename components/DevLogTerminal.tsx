/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, 
  Trash2, 
  Plus, 
  Search, 
  Filter, 
  Cpu, 
  Check, 
  Share2, 
  ShieldAlert, 
  RefreshCw,
  BookOpen,
  Eye,
  Settings
} from 'lucide-react';
import { DevLogEntry } from '../types';

const INITIAL_LOGS: DevLogEntry[] = [
  {
    id: 'dev-1',
    timestamp: '2026-06-02 21:26:00',
    category: 'SYSTEM',
    title: 'Core System Initialization',
    message: 'Omni-gate cluster initialized. Registered primary character portals (War Witch, Jane District, Arenas Echelon) under robust type-safe state routing.',
    author: 'AGNT_DEEPMIND',
    version: 'v1.0.0',
    severity: 'info'
  },
  {
    id: 'dev-2',
    timestamp: '2026-06-02 21:28:45',
    category: 'AI_INTEL',
    title: 'Gemini Struct Schema Decoupling',
    message: 'Synchronized @google/genai structured outputs for Forge, Chronicle, and Echelon decoders. Successfully configured schematicPoints coordinate percentage generation.',
    author: 'AGNT_DEEPMIND',
    version: 'v1.1.2',
    severity: 'normal'
  },
  {
    id: 'dev-3',
    timestamp: '2026-06-02 21:30:10',
    category: 'COGNITION',
    title: 'Schematic Visual Overlay System',
    message: 'Engineered SVG radar scanline overlay with holographic scanning vector grids. Integrated seedless visual-capture fallback mapping through dynamic oracle image prompts.',
    author: 'AGNT_DEEPMIND',
    version: 'v1.2.4',
    severity: 'normal'
  },
  {
    id: 'dev-4',
    timestamp: '2026-06-02 21:33:15',
    category: 'SECURITY',
    title: 'Tactical Local Storage Bookmarks',
    message: 'Created localStorage sync mechanism. Broadcasts bookmarks-changed event to reactive state handlers across split render-nodes, avoiding UI component drifts.',
    author: 'AGNT_DEEPMIND',
    version: 'v1.3.1',
    severity: 'info'
  },
  {
    id: 'dev-5',
    timestamp: '2026-06-02 21:35:50',
    category: 'CHRONICLE',
    title: 'Aesthetic Motion Shifters Integrated',
    message: 'Injected framer-motion entrance and exit vectors to tactical archive grid. Leveraged layoutId parameters to achieve seamless morphs from raw signal triggers.',
    author: 'AGNT_DEEPMIND',
    version: 'v1.4.0',
    severity: 'info'
  }
];

export const DevLogTerminal: React.FC = () => {
  const [logs, setLogs] = useState<DevLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem('genesis-verse-dev-logs');
      return saved ? JSON.parse(saved) : INITIAL_LOGS;
    } catch (e) {
      return INITIAL_LOGS;
    }
  });

  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [activeSeverity, setActiveSeverity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingLog, setIsAddingLog] = useState(false);
  const [formError, setFormError] = useState('');

  // Custom log state
  const [newTitle, setNewTitle] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [newCategory, setNewCategory] = useState<'SYSTEM' | 'SECURITY' | 'CHRONICLE' | 'COGNITION' | 'AI_INTEL'>('SYSTEM');
  const [newSeverity, setNewSeverity] = useState<'normal' | 'warn' | 'critical' | 'info'>('info');
  const [newAuthor, setNewAuthor] = useState('OPERATOR');

  useEffect(() => {
    localStorage.setItem('genesis-verse-dev-logs', JSON.stringify(logs));
  }, [logs]);

  const handleResetLogs = () => {
    if (window.confirm('Restore system developer logs back to factory defaults?')) {
      setLogs(INITIAL_LOGS);
    }
  };

  const handleClearLogs = () => {
    if (window.confirm('Wipe all console developer logs clean? This actions cannot be undone.')) {
      setLogs([]);
    }
  };

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newMessage.trim()) {
      setFormError('All transmission fields are mandatory for sync authorization.');
      return;
    }

    const entry: DevLogEntry = {
      id: `custom-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      category: newCategory,
      title: newTitle.trim(),
      message: newMessage.trim(),
      author: newAuthor.trim() || 'OPERATOR',
      version: `v1.4.${logs.filter(l => l.id.startsWith('custom')).length + 1}`,
      severity: newSeverity
    };

    setLogs([entry, ...logs]);
    setNewTitle('');
    setNewMessage('');
    setIsAddingLog(false);
    setFormError('');
  };

  const categories = ['ALL', 'SYSTEM', 'SECURITY', 'CHRONICLE', 'COGNITION', 'AI_INTEL'];
  const severities = ['ALL', 'info', 'normal', 'warn', 'critical'];

  const filteredLogs = logs.filter(log => {
    const matchesCategory = activeCategory === 'ALL' || log.category === activeCategory;
    const matchesSeverity = activeSeverity === 'ALL' || log.severity === activeSeverity;
    const matchesKeyword = searchQuery === '' || 
      log.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.version.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSeverity && matchesKeyword;
  });

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-red-950/50 border border-red-500/30 text-red-400">CRIT</span>;
      case 'warn':
        return <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-yellow-950/50 border border-yellow-500/30 text-yellow-400">WARN</span>;
      case 'normal':
        return <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-green-950/50 border border-green-500/30 text-green-400">NORM</span>;
      case 'info':
      default:
        return <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-cyan-950/50 border border-cyan-500/30 text-cyan-400">INFO</span>;
    }
  };

  const getCategoryTheme = (category: string) => {
    switch (category) {
      case 'SYSTEM':
        return 'text-orange-400 border-orange-500/20 bg-orange-950/10';
      case 'SECURITY':
        return 'text-red-400 border-red-500/20 bg-red-950/10';
      case 'CHRONICLE':
        return 'text-yellow-400 border-yellow-500/20 bg-yellow-950/10';
      case 'COGNITION':
        return 'text-green-400 border-green-500/20 bg-green-950/10';
      case 'AI_INTEL':
        return 'text-pink-400 border-pink-500/20 bg-pink-950/10';
      default:
        return 'text-zinc-400 border-zinc-700 bg-zinc-900';
    }
  };

  return (
    <div id="dev-log" className="w-full max-w-6xl px-4 md:px-8 mt-16 pb-12 border-t border-white/5 pt-12 relative z-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-950/40 border border-cyan-500/25 flex items-center justify-center text-cyan-400 animate-pulse">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold tracking-widest uppercase text-white font-display">
              Genesis Tech Dev Console
            </h2>
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
              Live developer changelogs and system telemetry compilation
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setIsAddingLog(!isAddingLog)}
            className={`px-3 py-1.5 rounded-lg border text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all ${
              isAddingLog 
                ? 'bg-red-500/10 border-red-500/30 text-red-400' 
                : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20'
            }`}
          >
            {isAddingLog ? 'Abort Add Signal' : <><Plus className="w-3 h-3" /> Transmit Dev Log</>}
          </button>
          
          <button
            type="button"
            onClick={handleResetLogs}
            className="px-3 py-1.5 rounded-lg border border-white/5 bg-zinc-950 text-zinc-400 hover:text-white text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
            title="Restore Defaults"
          >
            <RefreshCw className="w-3 h-3" /> Restore
          </button>

          <button
            type="button"
            onClick={handleClearLogs}
            className="px-3 py-1.5 rounded-lg border border-red-500/10 bg-zinc-950 text-zinc-500 hover:text-red-400 text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
            title="Clear Console"
          >
            <Trash2 className="w-3.5 h-3.5" /> Wipe Console
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Filtering & Submission Side Menu */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-white/5 bg-zinc-950/50 p-5 space-y-4 backdrop-blur-md">
            <div>
              <h3 className="text-xs font-bold text-gray-200 font-mono uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-cyan-400" /> Filter Node Channels
              </h3>
              
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-600" />
                <input
                  type="text"
                  placeholder="SEARCH CODEBASE LOGS..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-950 font-mono text-[10px] text-zinc-300 placeholder-zinc-700 px-3 py-2.5 pl-8 rounded-lg border border-white/5 focus:border-cyan-500/40 focus:outline-none transition-all uppercase"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest font-bold">Category Sector</span>
              <div className="flex flex-wrap gap-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-2 py-1 text-[9px] font-mono rounded tracking-wider transition-all uppercase cursor-pointer border ${
                      activeCategory === cat 
                        ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' 
                        : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest font-bold">Severity Matrix</span>
              <div className="flex flex-wrap gap-1">
                {severities.map((sev) => (
                  <button
                    key={sev}
                    onClick={() => setActiveSeverity(sev)}
                    className={`px-2 py-1 text-[9px] font-mono rounded tracking-wider transition-all uppercase cursor-pointer border ${
                      activeSeverity === sev 
                        ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' 
                        : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-white/5 pt-4 flex items-center justify-between font-mono text-[9px] text-zinc-500 uppercase">
              <span>Transmitted Logs:</span>
              <span className="font-bold text-cyan-400">{filteredLogs.length} / {logs.length}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-zinc-950/20 p-4 font-mono text-[9px] text-zinc-600 space-y-1.5 uppercase leading-relaxed">
            <div className="flex items-center gap-1.5 text-zinc-400 font-bold mb-1">
              <Cpu className="w-3 h-3 text-orange-500 animate-spin-slow" /> SYSTEM DIAGNOSTICS ARCHIVE
            </div>
            <p>Every commit in Genesis Verse is compiled and parsed directly via structural parameters. If you find anomalies, write your own dev entry using the submit console above.</p>
          </div>
        </div>

        {/* Logs Feed / Adding Mode */}
        <div className="lg:col-span-8 space-y-4">
          <AnimatePresence mode="wait">
            {isAddingLog ? (
              <motion.div
                key="add-log-panel"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl border border-cyan-500/10 bg-zinc-950/80 p-6 relative overflow-hidden backdrop-blur-md"
              >
                <div className="absolute top-0 right-0 w-2 h-2 bg-cyan-500" />
                <div className="absolute top-0 right-0 w-12 h-[1px] bg-cyan-500/50" />
                
                <h3 className="text-sm font-extrabold tracking-widest text-white uppercase font-display mb-4">
                  [+] Authorized Log Submission Console
                </h3>

                <form onSubmit={handleAddLog} className="space-y-4 font-mono text-[11px]">
                  {formError && (
                    <div className="p-3 bg-red-950/40 border border-red-500/20 text-red-400 rounded-lg uppercase flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4" /> {formError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-zinc-500 uppercase tracking-wider font-bold">Transmission Title</label>
                      <input
                        type="text"
                        required
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="E.G., LOCAL STORAGE CACHING RESOLVED"
                        className="w-full bg-black border border-white/5 px-3 py-2 rounded-lg text-white focus:border-cyan-500/50 focus:outline-none uppercase"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-zinc-500 uppercase tracking-wider font-bold">Operator Signature</label>
                      <input
                        type="text"
                        value={newAuthor}
                        onChange={(e) => setNewAuthor(e.target.value)}
                        placeholder="OPERATOR_X"
                        className="w-full bg-black border border-white/5 px-3 py-2 rounded-lg text-white focus:border-cyan-500/50 focus:outline-none uppercase"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-zinc-500 uppercase tracking-wider font-bold">Sector Channel</label>
                      <select
                        value={newCategory}
                        onChange={(e: any) => setNewCategory(e.target.value)}
                        className="w-full bg-black border border-white/5 px-3 py-2 rounded-lg text-white focus:border-cyan-500/50 focus:outline-none uppercase"
                      >
                        <option value="SYSTEM">SYSTEM CHANNELS</option>
                        <option value="SECURITY">SECURITY FIREWALLS</option>
                        <option value="CHRONICLE">NARRATIVE CHRONICLES</option>
                        <option value="COGNITION">COGNITIVE SATELLITE</option>
                        <option value="AI_INTEL">AI INTELLIGENCE ORACLE</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-zinc-500 uppercase tracking-wider font-bold">Severity Matrix Priority</label>
                      <select
                        value={newSeverity}
                        onChange={(e: any) => setNewSeverity(e.target.value)}
                        className="w-full bg-black border border-white/5 px-3 py-2 rounded-lg text-white focus:border-cyan-500/50 focus:outline-none uppercase"
                      >
                        <option value="info">INFO TRANSFORMS</option>
                        <option value="normal">NORMAL SYNCS</option>
                        <option value="warn">WARNING REPROCESSED</option>
                        <option value="critical">CRITICAL ALERTS</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-500 uppercase tracking-wider font-bold">Transmission Feed Message Payload</label>
                    <textarea
                      required
                      rows={3}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="ENTER THE RAW LOG TELEMETRY AND BUILD ACHIEVEMENTS..."
                      className="w-full bg-black border border-white/5 px-3 py-2.5 rounded-lg text-white focus:border-cyan-500/50 focus:outline-none uppercase resize-none font-mono"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingLog(false)}
                      className="px-4 py-2 border border-white/5 bg-transparent hover:bg-white/5 text-zinc-400 font-bold rounded-lg cursor-pointer"
                    >
                      ABORT
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold rounded-lg flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-4 h-4 stroke-[3px]" /> AUTHORIZE & SYNC LOG
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="logs-list-panel"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {filteredLogs.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/20 p-12 text-center flex flex-col items-center justify-center">
                    <ShieldAlert className="w-8 h-8 text-zinc-700 mb-3 animate-bounce" />
                    <h3 className="text-xs font-bold text-gray-400 font-mono uppercase tracking-widest">
                      Zero Telemetry Matches
                    </h3>
                    <p className="text-[10px] text-zinc-600 font-mono mt-1 uppercase max-w-sm">
                      Check your lookup queries. Clear filters or tap 'Restore' to reload developer historical files.
                    </p>
                  </div>
                ) : (
                  filteredLogs.map((log) => {
                    const theme = getCategoryTheme(log.category);
                    return (
                      <motion.div
                        key={log.id}
                        layout
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.25 }}
                        className="rounded-xl border border-white/5 bg-zinc-950/40 p-4 hover:border-white/10 transition-all flex flex-col md:flex-row md:items-start md:justify-between gap-4 font-mono relative group overflow-hidden"
                      >
                        {/* Shimmer backing */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.015] to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />

                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            {getSeverityBadge(log.severity)}
                            
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold border uppercase tracking-wider ${theme}`}>
                              {log.category}
                            </span>

                            <span className="text-[9px] text-zinc-600">
                              {log.timestamp}
                            </span>

                            <span className="text-[9px] text-zinc-600 font-bold">
                              {log.version}
                            </span>
                          </div>

                          <h4 className="text-xs font-bold text-gray-100 uppercase tracking-tight">
                            {log.title}
                          </h4>

                          <p className="text-[10px] text-gray-400 leading-relaxed uppercase">
                            {log.message}
                          </p>
                        </div>

                        <div className="shrink-0 flex md:flex-col md:items-end justify-between items-center border-t md:border-t-0 border-white/5 pt-2.5 md:pt-0 mt-1.5 md:mt-0 text-[8px] text-zinc-500 uppercase tracking-wide">
                          <div className="font-bold flex items-center gap-1 text-zinc-400">
                            SIGNED: <span className="text-cyan-400">{log.author}</span>
                          </div>
                          <div className="text-zinc-600">
                            NODE: {log.id.toUpperCase()}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
