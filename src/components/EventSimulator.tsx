import React, { useState } from 'react';
import { 
  Zap, 
  MapPin, 
  Flame, 
  Crosshair, 
  Truck, 
  Sparkles, 
  Bird, 
  Wind, 
  Sliders, 
  Radio, 
  ShieldAlert,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

import type { SoundClassId, FainNode } from '../types/fain';
import { SOUND_CLASSES, getRandomConfidence } from '../utils/packetEncoder';
import { SpotlightCard } from './ui/SpotlightCard';

interface EventSimulatorProps {
  selectedNodeId: 'node_01' | 'node_02';
  onSelectNode: (nodeId: 'node_01' | 'node_02') => void;
  nodes: Record<'node_01' | 'node_02', FainNode>;
  onTriggerEvent: (classId: SoundClassId, customConfidence?: number) => void;
  isTransmitting: boolean;
}

export const EventSimulator: React.FC<EventSimulatorProps> = ({
  selectedNodeId,
  onSelectNode,
  nodes,
  onTriggerEvent,
  isTransmitting,
}) => {
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [manualMode, setManualMode] = useState<boolean>(false);
  const [manualConfidence, setManualConfidence] = useState<number>(94.5);
  const [selectedChannel, setSelectedChannel] = useState<number>(0);
  const [selectedSf, setSelectedSf] = useState<string>('SF9');

  const selectedNode = nodes[selectedNodeId];

  const handleTrigger = (classId: SoundClassId) => {
    if (isTransmitting) return;

    if (manualMode) {
      onTriggerEvent(classId, manualConfidence);
    } else {
      const classMeta = SOUND_CLASSES[classId];
      const conf = getRandomConfidence(classMeta.defaultConfidenceRange);
      onTriggerEvent(classId, conf);
    }
  };

  // Primary presentation classes (Most important for demonstration)
  const primaryThreats: { id: SoundClassId; desc: string; icon: React.ElementType }[] = [
    { id: 1, desc: 'Illegal tree felling / Deforestation', icon: Flame },
    { id: 2, desc: 'Poaching / Ballistic impulse', icon: Crosshair },
    { id: 4, desc: 'Manual timber cutting', icon: Zap },
  ];

  const primaryEco: { id: SoundClassId; desc: string; icon: React.ElementType }[] = [
    { id: 6, desc: 'Canopy biodiversity chorus (2.5–7.5 kHz)', icon: Bird },
    { id: 7, desc: 'Natural teak canopy wind & geophony', icon: Wind },
  ];

  // Secondary classes in drawer
  const secondaryClasses: { id: SoundClassId; desc: string; icon: React.ElementType }[] = [
    { id: 3, desc: 'Vehicle / Patrol engine intrusion', icon: Truck },
    { id: 5, desc: 'Fireworks / Firecrackers disturbance', icon: Sparkles },
  ];

  return (
    <SpotlightCard className="p-4 shadow-2xl">
      {/* Panel Title & Node Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3.5 pb-3 border-b border-[#1e402b]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-wide text-white flex items-center gap-2 font-mono">
              <span>Acoustic Event Trigger Simulator</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700/60 font-mono font-bold">
                INT8 TinyML
              </span>
            </h3>
            <p className="text-[11px] text-slate-300 font-mono">
              Select an acoustic sound event below to trigger edge inference and LoRa broadcast
            </p>
          </div>
        </div>

        {/* Node Selector Tabs */}
        <div className="flex items-center gap-1.5 bg-[#08150e] p-1 rounded-xl border border-[#1e402b]">
          {(['node_01', 'node_02'] as const).map((nodeId) => {
            const node = nodes[nodeId];
            const isSelected = selectedNodeId === nodeId;
            return (
              <button
                key={nodeId}
                onClick={() => onSelectNode(nodeId)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-emerald-950/40'
                }`}
              >
                <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-emerald-400'}`} />
                <span>{nodeId === 'node_01' ? 'Node 01' : 'Node 02'}</span>
                <span className="text-[10px] opacity-85 hidden sm:inline tabular-nums">
                  ({node.sector})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Node Specs Ribbon */}
      <div className="bg-[#08150e] rounded-xl p-2.5 mb-3.5 border border-[#1e402b] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">Transmitting Node:</span>
          <span className="text-emerald-300 font-bold">{selectedNode.name}</span>
          <span className="text-emerald-800">•</span>
          <span className="text-slate-200">{selectedNode.sector}</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] tabular-nums">
          <span className="text-slate-300">
            Battery: <strong className="text-emerald-300 font-bold">{selectedNode.batteryVolts}V ({selectedNode.batteryPercent}%)</strong>
          </span>
          <span className="text-emerald-800">|</span>
          <span className="text-slate-300">
            Solar: <strong className="text-amber-300 font-bold">{selectedNode.solarMw} mW</strong>
          </span>
          <span className="text-emerald-800">|</span>
          <span className="text-slate-300">
            Link: <strong className="text-cyan-300 font-bold">{selectedSf} @ 865 MHz</strong>
          </span>
        </div>
      </div>

      {/* 1. Anthropogenic Threats (Warm Amber / Terracotta Accents - Eye Friendly) */}
      <div className="space-y-3 mb-3.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold font-mono tracking-wide text-amber-300 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            CRITICAL ACOUSTIC THREATS (16-BYTE ALERT PACKET)
          </span>
          <span className="text-[10px] text-slate-300 font-mono">Triggers Priority-1 SMS Dispatch</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {primaryThreats.map((item) => {
            const meta = SOUND_CLASSES[item.id];
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleTrigger(item.id)}
                disabled={isTransmitting}
                className={`group flex flex-col justify-between p-3 rounded-xl border text-left transition-all ${
                  isTransmitting
                    ? 'bg-slate-950/60 border-slate-900 opacity-60 cursor-not-allowed'
                    : 'bg-[#121c15] hover:bg-[#18261c] border-amber-800/40 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-950/40 active:scale-[0.98]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400 group-hover:bg-amber-500/25 border border-amber-500/30">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-700/60 font-bold">
                      {meta.severity || 'HIGH'}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors font-mono">
                    {meta.name}
                  </h4>
                  <p className="text-[11px] text-slate-300 font-mono mt-0.5 leading-tight">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#173322] text-[10px] font-mono text-slate-300">
                  <span>Confidence: ~{meta.defaultConfidenceRange[0]}–{meta.defaultConfidenceRange[1]}%</span>
                  <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-700/60 font-bold group-hover:bg-amber-400 group-hover:text-black transition-colors">
                    TRIGGER
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Ecological Biophony & Ambient Baseline */}
      <div className="space-y-3 mb-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold font-mono tracking-wide text-emerald-300 flex items-center gap-1.5">
            <Bird className="w-3.5 h-3.5 text-emerald-400" />
            ECOLOGICAL HEALTH & CANOPY BASELINE (10-BYTE ECO PACKET)
          </span>
          <span className="text-[10px] text-slate-300 font-mono">Increases Forest Health Index (FHI)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {primaryEco.map((item) => {
            const meta = SOUND_CLASSES[item.id];
            const Icon = item.icon;
            const isBird = item.id === 6;
            return (
              <button
                key={item.id}
                onClick={() => handleTrigger(item.id)}
                disabled={isTransmitting}
                className={`group flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                  isTransmitting
                    ? 'bg-slate-950/60 border-slate-900 opacity-60 cursor-not-allowed'
                    : isBird
                      ? 'bg-[#0c1c14] hover:bg-[#12281c] border-emerald-700/40 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-950/30 active:scale-[0.99]'
                      : 'bg-[#0a1c1d] hover:bg-[#102728] border-cyan-700/40 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-950/30 active:scale-[0.99]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${
                    isBird 
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 group-hover:bg-emerald-500/25' 
                      : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 group-hover:bg-cyan-500/25'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 font-mono">
                        {meta.name}
                      </h4>
                      <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                        isBird 
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60' 
                          : 'bg-cyan-950 text-cyan-300 border border-cyan-700/60'
                      }`}>
                        {isBird ? '+FHI BOOST' : 'BASELINE'}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-300 font-mono mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg border transition-colors ${
                  isBird
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-700/70 group-hover:bg-emerald-400 group-hover:text-black'
                    : 'bg-cyan-950 text-cyan-300 border-cyan-700/70 group-hover:bg-cyan-400 group-hover:text-black'
                }`}>
                  TRANSMIT
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Collapsible Advanced Radio Tuning & Secondary Sounds Drawer */}
      <div className="pt-2 border-t border-[#1e402b]">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between text-xs font-mono text-slate-300 hover:text-white py-1 transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>Advanced Radio Parameters & Additional Sounds</span>
          </span>
          {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showAdvanced && (
          <div className="mt-3 p-3 rounded-xl bg-[#08150e] border border-[#1e402b] space-y-3 font-mono text-xs">
            {/* Secondary Sounds */}
            <div>
              <span className="text-[11px] text-slate-300 mb-1.5 block">Additional Acoustic Classes:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {secondaryClasses.map((item) => {
                  const meta = SOUND_CLASSES[item.id];
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTrigger(item.id)}
                      disabled={isTransmitting}
                      className="flex items-center justify-between p-2 rounded-lg bg-[#0d1d14] border border-[#1e402b] hover:border-emerald-600/70 text-left transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5 text-amber-400" />
                        <div>
                          <p className="text-xs font-bold text-white">{meta.name}</p>
                          <p className="text-[10px] text-slate-300">{item.desc}</p>
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-700/60 font-bold">
                        TRIGGER
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Radio Frequency & SF Settings */}
            <div className="pt-2 border-t border-[#173322] flex flex-wrap items-center justify-between gap-3 text-[11px]">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setManualMode(!manualMode)}
                  className={`px-2 py-1 rounded border text-[10px] font-bold ${
                    manualMode ? 'bg-cyan-950 border-cyan-400 text-cyan-200' : 'bg-[#0d1d14] border-[#1e402b] text-slate-300'
                  }`}
                >
                  Manual Confidence: {manualMode ? `${manualConfidence}%` : 'AUTO'}
                </button>
                {manualMode && (
                  <input
                    type="range"
                    min="50"
                    max="99"
                    step="0.5"
                    value={manualConfidence}
                    onChange={(e) => setManualConfidence(parseFloat(e.target.value))}
                    className="w-24 accent-cyan-400 cursor-pointer"
                  />
                )}
              </div>

              <div className="flex items-center gap-2 text-slate-200">
                <div className="flex items-center gap-1">
                  <Radio className="w-3 h-3 text-emerald-400" />
                  <span>Channel:</span>
                  <select
                    value={selectedChannel}
                    onChange={(e) => setSelectedChannel(Number(e.target.value))}
                    className="bg-[#0a1810] border border-[#1e402b] rounded px-2 py-0.5 text-emerald-300 font-bold text-[10px]"
                  >
                    <option value={0}>CH0 (865.0625 MHz)</option>
                    <option value={1}>CH1 (865.4025 MHz)</option>
                    <option value={2}>CH2 (865.9850 MHz)</option>
                  </select>
                </div>

                <div className="flex items-center gap-1">
                  <span>SF:</span>
                  <select
                    value={selectedSf}
                    onChange={(e) => setSelectedSf(e.target.value)}
                    className="bg-[#0a1810] border border-[#1e402b] rounded px-2 py-0.5 text-cyan-300 font-bold text-[10px]"
                  >
                    <option value="SF7">SF7 (Fast / 2km)</option>
                    <option value="SF9">SF9 (Standard IN865)</option>
                    <option value="SF10">SF10 (High Sensitivity)</option>
                    <option value="SF12">SF12 (Max Range 5km)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </SpotlightCard>
  );
};
