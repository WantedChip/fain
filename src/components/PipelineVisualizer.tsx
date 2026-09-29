import React, { useState } from 'react';
import { 
  Cpu, 
  Radio, 
  Server, 
  Database, 
  LayoutDashboard, 
  Send, 
  CheckCircle2, 
  Clock, 
  Flame,
  Bird,
  SlidersHorizontal,
  Zap
} from 'lucide-react';
import type { PipelineStage, FainPacket } from '../types/fain';

interface PipelineVisualizerProps {
  currentStage: PipelineStage;
  activePacket: FainPacket | null;
  stageProgress: number; // 0 to 100%
  compactMode?: boolean;
}

interface StageStep {
  stage: PipelineStage;
  stepNumber: number;
  label: string;
  sublabel: string;
  storyText: string;
  icon: React.ElementType;
  hardware: string;
  protocol: string;
  latencyText: string;
}

const STAGES: StageStep[] = [
  {
    stage: 'inference',
    stepNumber: 1,
    label: 'Edge TinyML',
    sublabel: 'ESP32-S3 INT8 CNN',
    storyText: 'INMP441 MEMS microphone captured 16kHz audio. ESP32-S3 runs 8-bit quantized CNN to classify sound in 42ms.',
    icon: Cpu,
    hardware: 'ESP32-S3 (240MHz)',
    protocol: 'Edge Impulse Quantized',
    latencyText: '42 ms',
  },
  {
    stage: 'lora_tx',
    stepNumber: 2,
    label: 'LoRa RF TX',
    sublabel: '865.0625 MHz SF9',
    storyText: 'WaveShare Core1262 LoRa module transmits compact binary payload across forest canopy on IN865 band.',
    icon: Radio,
    hardware: 'Core1262 (SX1262)',
    protocol: 'LoRa IN865 Band',
    latencyText: '148 ms Airtime',
  },
  {
    stage: 'gateway_rx',
    stepNumber: 3,
    label: 'Gateway RX',
    sublabel: 'Raspberry Pi 4 HAT',
    storyText: 'Base station tower with SX1276 receiver demodulates radio signal. Hardware CRC-8 checksum verified.',
    icon: Server,
    hardware: 'RPi 4 + SX1276 HAT',
    protocol: 'SPI Demodulation',
    latencyText: '3 ms Capture',
  },
  {
    stage: 'chirpstack_decode',
    stepNumber: 4,
    label: 'ChirpStack LoRaWAN',
    sublabel: 'Frame & CRC8 Unpack',
    storyText: 'ChirpStack v4 Gateway Bridge decodes raw binary bytes into structured JSON telemetry & publishes via MQTT.',
    icon: Database,
    hardware: 'ChirpStack v4 Engine',
    protocol: 'MQTT / Mosquitto',
    latencyText: '12 ms Decode',
  },
  {
    stage: 'backend_ingest',
    stepNumber: 5,
    label: 'Node.js Backend',
    sublabel: 'Geo-Indexing & Rule Engine',
    storyText: 'Backend rule engine matches GPS coordinates to Yeoor Hills sector and evaluates threat severity thresholds.',
    icon: Send,
    hardware: 'FAIN Core Server',
    protocol: 'WebSocket JSON',
    latencyText: '8 ms Ingest',
  },
  {
    stage: 'alert_dispatch',
    stepNumber: 6,
    label: 'Ranger Alert / SMS',
    sublabel: 'Fast2SMS & Telemetry',
    storyText: 'Fast2SMS DLT gateway dispatches priority emergency SMS to Forest Guard patrol with exact GPS coordinates.',
    icon: LayoutDashboard,
    hardware: 'Operations Console',
    protocol: 'HTTPS REST / WSS',
    latencyText: '< 15 ms Render',
  },
];

export const PipelineVisualizer: React.FC<PipelineVisualizerProps> = ({
  currentStage,
  activePacket,
  stageProgress,
  compactMode = false,
}) => {
  const [showTechnicalSpecs, setShowTechnicalSpecs] = useState(!compactMode);

  const getStageIndex = (stage: PipelineStage): number => {
    switch (stage) {
      case 'inference': return 0;
      case 'lora_tx': return 1;
      case 'gateway_rx': return 2;
      case 'chirpstack_decode': return 3;
      case 'backend_ingest': return 4;
      case 'alert_dispatch': return 5;
      case 'complete': return 6;
      default: return -1;
    }
  };

  const currentIndex = getStageIndex(currentStage);
  const currentStepData = currentIndex >= 0 && currentIndex < STAGES.length ? STAGES[currentIndex] : null;

  // Percentage along the track for the physics packet orb (0% to 100%)
  const packetTrackPct = currentIndex < 0 
    ? 0 
    : currentIndex >= 6 
      ? 100 
      : (currentIndex / 5) * 100 + (stageProgress / 100) * (100 / 6);

  return (
    <div className="bg-[#0c1812] border border-[#1e402b] rounded-2xl p-4 shadow-2xl relative overflow-hidden">
      {/* Background Subtle Starfield / Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.025] pointer-events-none" 
        style={{
          backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      {/* Unified Single High-Contrast Hero Header (No duplicate stacked boxes) */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3.5 pb-3 border-b border-[#1b3d28]">
        {/* Left: Active Hop / Live Story Narrative */}
        <div className="flex items-center gap-3 min-w-0 max-w-2xl">
          <div className={`p-2 rounded-xl shrink-0 ${
            activePacket?.typeName === 'ALERT'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : activePacket
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
          }`}>
            {currentStepData ? (
              <currentStepData.icon className="w-5 h-5" />
            ) : (
              <Zap className="w-5 h-5 text-emerald-400" />
            )}
          </div>

          <div className="min-w-0 font-mono">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                {currentStepData 
                  ? `HOP 0${currentStepData.stepNumber}: ${currentStepData.label.toUpperCase()}`
                  : 'SYSTEM ACTIVE: MONITORING YEOOR HILLS'}
              </span>
              {currentStepData && (
                <span className="text-[10px] text-amber-300 font-bold px-2 py-0.5 rounded bg-amber-950 border border-amber-700/60">
                  {currentStepData.latencyText}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-200 leading-snug truncate md:whitespace-normal font-medium">
              {currentStepData 
                ? currentStepData.storyText
                : 'Edge acoustic network deployed across Yeoor Hills (SGNP Buffer) sampling canopy soundscapes at 16 kHz. Select any acoustic signature below to trigger simulation.'}
            </p>
          </div>
        </div>

        {/* Right: Active Payload Summary & Specs Toggle */}
        <div className="flex items-center gap-2.5 font-mono text-xs">
          <button
            onClick={() => setShowTechnicalSpecs(!showTechnicalSpecs)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-colors shadow-sm ${
              showTechnicalSpecs
                ? 'bg-emerald-950 border-emerald-500/70 text-emerald-200 font-bold'
                : 'bg-[#08140e] border-[#1b3d28] text-slate-300 hover:text-white'
            }`}
            title="Toggle between simplified presentation view and deep hardware specifications"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{showTechnicalSpecs ? 'Specs: ON' : 'Specs: OFF'}</span>
          </button>

          {activePacket ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#07130b] border border-emerald-700/70 shadow-inner">
              <span className="text-slate-300 font-medium">Active:</span>
              <span className="font-bold text-white flex items-center gap-1.5">
                {activePacket.typeName === 'ALERT' ? (
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <Bird className="w-3.5 h-3.5 text-emerald-400" />
                )}
                {activePacket.className} ({activePacket.confidence}%)
              </span>
              <span className="text-emerald-800">|</span>
              <span className="text-cyan-300 font-semibold">{activePacket.nodeId === 'node_01' ? 'Node 01' : 'Node 02'}</span>
              <span className="text-emerald-800">|</span>
              <span className="text-amber-300 font-bold">
                {currentStage === 'complete' ? 'DELIVERED (213ms)' : `HOP 0${currentIndex + 1}/06`}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#07130b] border border-[#1b3d28] text-slate-300">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Awaiting Sound Event Trigger</span>
            </div>
          )}
        </div>
      </div>

      {/* Multi-Stage Hop Flow Diagram with Physics Packet Orb */}
      <div className="relative pt-2 pb-1">
        {/* Base Track Wire */}
        <div className="absolute top-[38px] left-8 right-8 h-1 bg-[#05180f] rounded-full hidden md:block -z-0" />

        {/* Animated Progress Wire Fill */}
        {currentIndex >= 0 && (
          <div 
            className="absolute top-[38px] left-8 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full transition-all duration-300 hidden md:block -z-0"
            style={{
              width: `${Math.min(100, Math.max(0, packetTrackPct))}%`,
              boxShadow: '0 0 12px rgba(16, 185, 129, 0.7)',
            }}
          />
        )}

        {/* Glowing Physics Packet Orb that travels along the wire */}
        {currentIndex >= 0 && currentIndex < 6 && (
          <div
            className="absolute top-[34px] -ml-2.5 w-5 h-5 rounded-full bg-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.9)] transition-all duration-300 hidden md:flex items-center justify-center z-20 pointer-events-none"
            style={{
              left: `calc(32px + ${Math.min(94, Math.max(0, packetTrackPct))}% * 0.94)`,
            }}
          >
            <div className="w-2 h-2 rounded-full bg-white animate-ping opacity-80" />
          </div>
        )}

        {/* Stages Grid (6 Hops) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 relative z-10">
          {STAGES.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = currentIndex > idx || currentStage === 'complete';
            const isCurrent = currentIndex === idx;

            let cardBorder = 'border-[#1e402b]';
            let cardBg = 'bg-[#091810]';
            let ringGlow = '';

            if (isCurrent) {
              // Calm amber/gold for alert, soft emerald for eco/normal
              cardBorder = activePacket?.typeName === 'ALERT' ? 'border-amber-400' : 'border-emerald-400';
              cardBg = activePacket?.typeName === 'ALERT' ? 'bg-[#1e1708]' : 'bg-[#0d2618]';
              ringGlow = 'ring-2 ring-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.3)]';
            } else if (isCompleted) {
              cardBorder = 'border-emerald-600/80';
              cardBg = 'bg-[#0d2015]';
            }

            return (
              <div 
                key={step.stage}
                className={`relative rounded-xl p-3 border transition-all duration-300 ${cardBg} ${cardBorder} ${ringGlow}`}
              >
                {/* Stage Number & Status Pip */}
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    isCurrent 
                      ? 'bg-emerald-500 text-[#070d0a]' 
                      : isCompleted 
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/70' 
                        : 'bg-[#06120b] text-slate-300 border border-[#1e402b]'
                  }`}>
                    HOP 0{step.stepNumber}
                  </span>

                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : isCurrent ? (
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
                    </span>
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                  )}
                </div>

                {/* Subsystem Icon & Labels */}
                <div className="flex items-center gap-2 mb-1.5">
                  <div className={`p-1.5 rounded-lg ${
                    isCurrent 
                      ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-400/60' 
                      : isCompleted 
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                        : 'bg-[#06120b] text-slate-400 border border-[#1b3d28]'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <p className={`text-xs font-bold truncate ${isCurrent ? 'text-white' : isCompleted ? 'text-slate-100' : 'text-slate-300'}`}>
                      {step.label}
                    </p>
                    <p className="text-[10px] text-slate-300 truncate font-mono">
                      {step.sublabel}
                    </p>
                  </div>
                </div>

                {/* Optional Detailed Hardware & Protocol Specs (shown in technical mode) */}
                {showTechnicalSpecs && (
                  <div className="space-y-0.5 pt-1.5 border-t border-[#1b3d28] text-[10px] font-mono">
                    <div className="flex justify-between text-slate-300">
                      <span className="text-slate-400 font-medium">HW:</span>
                      <span className="truncate ml-1 text-slate-100 font-semibold">{step.hardware}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span className="text-slate-400 font-medium">Link:</span>
                      <span className="truncate ml-1 text-cyan-300 font-semibold">{step.protocol}</span>
                    </div>
                  </div>
                )}

                {/* Latency Tag */}
                <div className="flex justify-between items-center text-[10px] font-mono pt-1 text-slate-300">
                  <span className="text-slate-400 font-medium">Latency:</span>
                  <span className={`font-bold ${isCurrent ? 'text-amber-300' : 'text-slate-200'}`}>
                    {step.latencyText}
                  </span>
                </div>

                {/* Smooth Progress Micro-Bar on Active Hop */}
                {isCurrent && (
                  <div className="mt-2 w-full bg-slate-900 rounded-full h-1 overflow-hidden">
                    <div 
                      className="bg-emerald-400 h-full transition-all duration-100"
                      style={{ width: `${stageProgress}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
