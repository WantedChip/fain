import React, { useState } from 'react';
import { 
  Play, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Layers, 
  Maximize, 
  Minimize, 
  Radio, 
  Cpu, 
  ShieldAlert, 
  TreePine 
} from 'lucide-react';
import { soundEngine } from '../utils/audioSynthesizer';

interface HeaderProps {
  onRunDemo: () => void;
  onReset: () => void;
  isDemoRunning: boolean;
  onOpenArchitecture: () => void;
  activeThreatCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onRunDemo,
  onReset,
  isDemoRunning,
  onOpenArchitecture,
  activeThreatCount,
}) => {
  const [audioMuted, setAudioMuted] = useState(!soundEngine.enabled);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleAudio = () => {
    const newState = !audioMuted;
    setAudioMuted(newState);
    soundEngine.enabled = !newState;
    if (!newState) {
      soundEngine.playInferenceTick();
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <header className="border-b border-[#1e402b] bg-[#08150e]/95 backdrop-blur-xl sticky top-0 z-40 px-4 py-2.5 shadow-2xl">
      <div className="max-w-[1800px] mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Project Branding & Academic Label */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.25)]">
            <TreePine className="w-5 h-5 text-emerald-400" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-widest bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                FAIN
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 tracking-wide font-mono">
                SIMULATION / PROOF OF CONCEPT
              </span>
              <span className="hidden lg:inline-flex text-[11px] font-medium px-2 py-0.5 rounded border border-slate-800 bg-slate-900/60 text-slate-300">
                PROGRESS SEMINAR II (ECE MAJOR PROJECT)
              </span>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5 font-mono">
              <span className="text-slate-300">Forest Acoustic Intelligence Network</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400/90">IN865 LoRa + TinyML S3 Mesh</span>
              <span className="text-slate-600">•</span>
              <span className="text-cyan-400/90">Yeoor Hills Buffer (SGNP)</span>
            </p>
          </div>
        </div>

        {/* Center: System Status Badges */}
        <div className="hidden xl:flex items-center gap-2 bg-[#0c1812] px-3.5 py-1.5 rounded-lg border border-[#1e402b] text-xs font-mono shadow-inner">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400 font-medium">PHY:</span>
            <span className="text-emerald-300 font-semibold">865.0625 MHz (IN865)</span>
          </div>
          <span className="text-emerald-800">|</span>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400 font-medium">CNN:</span>
            <span className="text-cyan-300 font-semibold">INT8 42ms/Inf</span>
          </div>
          <span className="text-emerald-800">|</span>
          <div className="flex items-center gap-1.5 text-slate-300">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400 font-medium">Threats Active:</span>
            <span className={`font-semibold ${activeThreatCount > 0 ? 'text-amber-400' : 'text-emerald-300'}`}>
              {activeThreatCount}
            </span>
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-2">
          {/* RUN DEMO Button */}
          <button
            onClick={onRunDemo}
            disabled={isDemoRunning}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-semibold text-xs tracking-wide transition-all shadow-lg ${
              isDemoRunning
                ? 'bg-emerald-950 text-emerald-600 border border-emerald-800 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border border-emerald-400/40 shadow-emerald-950/60 hover:shadow-emerald-700/30'
            }`}
            title="Auto-demonstrate complete transmission hop sequence and ranger SMS dispatch"
          >
            <Play className={`w-3.5 h-3.5 ${isDemoRunning ? 'animate-spin' : 'fill-white'}`} />
            <span>{isDemoRunning ? 'RUNNING DEMO...' : 'RUN DEMO'}</span>
          </button>

          {/* RESET SIMULATION Button */}
          <button
            onClick={onReset}
            disabled={isDemoRunning}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-xs bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/70 transition-colors"
            title="Reset active alerts, telemetry counters and logs to resting baseline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">RESET</span>
          </button>

          {/* Architecture Spec Button */}
          <button
            onClick={onOpenArchitecture}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-xs bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/60 transition-colors"
            title="View IN865, Edge CNN & LoRa packet hardware architecture specification"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden md:inline">SPEC / ARCH</span>
          </button>

          {/* Audio Synthesizer Toggle */}
          <button
            onClick={toggleAudio}
            className={`p-2 rounded-lg border text-xs transition-colors ${
              audioMuted 
                ? 'bg-slate-900/70 border-slate-800 text-slate-500 hover:text-slate-300' 
                : 'bg-emerald-950/80 border-emerald-500/50 text-emerald-400 hover:bg-emerald-900/70 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
            }`}
            title={audioMuted ? 'Unmute Audio Cues (Synthesizer)' : 'Mute Audio Cues'}
          >
            {audioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-slate-900/70 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Toggle Seminar Fullscreen View"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
