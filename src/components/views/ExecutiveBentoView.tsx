import React, { useState } from 'react';
import { PipelineVisualizer } from '../PipelineVisualizer';
import { EventSimulator } from '../EventSimulator';
import { PacketInspector } from '../PacketInspector';
import { FhiGauge } from '../RangerDashboard/FhiGauge';
import { ForestMap } from '../RangerDashboard/ForestMap';
import { ThreatAlertTable } from '../RangerDashboard/ThreatAlertTable';
import { AcousticWaveform } from '../ui/AcousticWaveform';
import { SpotlightCard } from '../ui/SpotlightCard';

import { 
  CheckCircle2, 
  Radio, 
  Smartphone, 
  ArrowRight,
  Bird,
  Flame,
  Clock
} from 'lucide-react';

import type { 
  PipelineStage, 
  FainPacket, 
  FainNode, 
  SoundClassId, 
  ForestHealthMetrics, 
  ThreatAlert 
} from '../../types/fain';

interface ExecutiveBentoViewProps {
  currentStage: PipelineStage;
  activePacket: FainPacket | null;
  stageProgress: number;
  selectedNodeId: 'node_01' | 'node_02';
  onSelectNode: (nodeId: 'node_01' | 'node_02') => void;
  nodes: Record<'node_01' | 'node_02', FainNode>;
  onTriggerEvent: (classId: SoundClassId, customConfidence?: number) => void;
  isTransmitting: boolean;
  fhiMetrics: ForestHealthMetrics;
  threatAlerts: ThreatAlert[];
  onAcknowledgeAlert: (alertId: string) => void;
  viewMode?: 'story' | 'engineering';
  onToggleViewMode?: (mode: 'story' | 'engineering') => void;
}

export const ExecutiveBentoView: React.FC<ExecutiveBentoViewProps> = ({
  currentStage,
  activePacket,
  stageProgress,
  selectedNodeId,
  onSelectNode,
  nodes,
  onTriggerEvent,
  isTransmitting,
  fhiMetrics,
  threatAlerts,
  onAcknowledgeAlert,
  viewMode,
  onToggleViewMode,
}) => {
  // Use passed viewMode or default to Simple Mode ('story')
  const [internalViewMode, setInternalViewMode] = useState<'story' | 'engineering'>('story');
  const effectiveViewMode = viewMode ?? internalViewMode;

  const handleToggleViewMode = (mode: 'story' | 'engineering') => {
    if (onToggleViewMode) {
      onToggleViewMode(mode);
    } else {
      setInternalViewMode(mode);
    }
  };

  const selectedNode = nodes[selectedNodeId];

  return (
    <div className="space-y-4">
      {/* 1. Multi-Stage Pipeline Hop Progression Ribbon */}
      <PipelineVisualizer
        currentStage={currentStage}
        activePacket={activePacket}
        stageProgress={stageProgress}
        compactMode={effectiveViewMode === 'story'}
      />

      {/* 2. Real-time Audio Waveform Canvas */}
      <AcousticWaveform
        isActive={isTransmitting || activePacket !== null}
        threatDetected={activePacket?.typeName === 'ALERT'}
        soundName={activePacket?.className}
        label={`INMP441 I2S MEMS AUDIO STREAM (${selectedNode.name} • ${selectedNode.sector} • 16 kHz)`}
      />

      {/* 3. Bento Grid Section 1: Acoustic Event Trigger Simulator + Outcome Story / Hex Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Event Simulator (7 cols) */}
        <div className="lg:col-span-7">
          <EventSimulator
            selectedNodeId={selectedNodeId}
            onSelectNode={onSelectNode}
            nodes={nodes}
            onTriggerEvent={onTriggerEvent}
            isTransmitting={isTransmitting}
          />
        </div>

        {/* Right: Story Outcome (Default) OR Deep Packet Inspector */}
        <div className="lg:col-span-5">
          {effectiveViewMode === 'story' ? (
            <SpotlightCard className="p-5 shadow-2xl h-full flex flex-col justify-between">
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1e402b]">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold font-mono text-white uppercase tracking-wider">
                        Transmission Outcome Story
                      </h4>
                      <p className="text-[11px] text-slate-300 font-mono">
                        Plain-English translation of edge telemetry
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleViewMode('engineering')}
                    className="flex items-center gap-1 text-[11px] font-mono text-cyan-300 hover:text-cyan-200 font-medium transition-colors"
                  >
                    <span>Inspect Raw Bytes</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {activePacket ? (
                  <div className="space-y-3 font-mono text-xs">
                    {/* Story Step 1: Acoustic Sound Detected */}
                    <div className="p-3 rounded-xl bg-[#0a1610] border border-[#1e402b]">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full bg-cyan-400" />
                        <span className="text-[10px] text-slate-300 uppercase font-bold">1. Acoustic Sound Identified</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {activePacket.typeName === 'ALERT' ? (
                            <Flame className="w-4 h-4 text-amber-400" />
                          ) : (
                            <Bird className="w-4 h-4 text-emerald-400" />
                          )}
                          <strong className="text-sm text-white font-bold">{activePacket.className}</strong>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700/60 font-bold text-[11px]">
                          {activePacket.confidence}% AI Confidence
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-1">
                        Classified in 42ms by INT8 Neural Network on ESP32-S3 microcontroller.
                      </p>
                    </div>

                    {/* Story Step 2: Wireless LoRa Hop */}
                    <div className="p-3 rounded-xl bg-[#0a1610] border border-[#1e402b]">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="text-[10px] text-slate-300 uppercase font-bold">2. LoRa Long-Range Wireless Hop</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-100">
                          <Radio className="w-4 h-4 text-emerald-400" />
                          <span>{activePacket.lengthBytes} Bytes transmitted over IN865</span>
                        </div>
                        <span className="text-cyan-300 font-bold">213 ms total</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-[#173322] text-[10px] text-slate-300">
                        <div>Frequency: <strong className="text-white">{activePacket.frequencyMhz} MHz</strong></div>
                        <div>Link Quality: <strong className="text-emerald-300 font-semibold">RSSI {activePacket.rssi} dBm</strong></div>
                      </div>
                    </div>

                    {/* Story Step 3: Forest Ranger Action */}
                    <div className="p-3 rounded-xl bg-[#0a1610] border border-[#1e402b]">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        <span className="text-[10px] text-slate-300 uppercase font-bold">3. Base Station Action</span>
                      </div>
                      <div className="flex items-start gap-2">
                        {activePacket.typeName === 'ALERT' ? (
                          <Smartphone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="text-white font-bold">
                            {activePacket.typeName === 'ALERT'
                              ? 'Priority-1 Emergency SMS Delivered'
                              : 'Canopy Ecological Telemetry Logged'}
                          </p>
                          <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                            {activePacket.typeName === 'ALERT'
                              ? `Dispatched via Fast2SMS DLT gateway to Range Forest Officer with GPS anchor (${activePacket.lat?.toFixed(4)}°N, ${activePacket.lng?.toFixed(4)}°E).`
                              : 'Rolling 60-second biophony index updated in Forest Health Dashboard.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10 space-y-3 font-mono">
                    <div className="w-10 h-10 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 mx-auto flex items-center justify-center">
                      <Clock className="w-5 h-5 text-emerald-400" />
                    </div>
                    <p className="text-xs text-white font-bold">
                      Awaiting Acoustic Sound Trigger
                    </p>
                    <p className="text-[11px] text-slate-300 max-w-xs mx-auto leading-relaxed">
                      Select any sound card on the left (Chainsaw, Gunshot, Axe, Bird, or Wind) to simulate how edge AI and LoRa protect the forest in real time.
                    </p>
                  </div>
                )}
              </div>

              {/* Bottom Quick Action */}
              <div className="pt-3 border-t border-[#1e402b] flex items-center justify-between font-mono text-[11px]">
                <span className="text-slate-300">Need low-level byte specs?</span>
                <button
                  onClick={() => handleToggleViewMode('engineering')}
                  className="px-3 py-1.5 rounded-lg bg-[#0e2417] hover:bg-[#143220] border border-emerald-600/70 text-emerald-200 font-bold transition-colors"
                >
                  View 16-Byte Hex Inspector →
                </button>
              </div>
            </SpotlightCard>
          ) : (
            <PacketInspector packet={activePacket} />
          )}
        </div>
      </div>

      {/* 4. Bento Grid Section 2: GIS Map & FHI Gauge */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-7">
          <ForestMap
            nodes={nodes}
            selectedNodeId={selectedNodeId}
            onSelectNode={onSelectNode}
            activeAlert={threatAlerts.find(a => a.status === 'PENDING') || null}
          />
        </div>
        <div className="md:col-span-5">
          <FhiGauge metrics={fhiMetrics} />
        </div>
      </div>

      {/* 5. Threat Alert Table */}
      {threatAlerts.length > 0 && (
        <ThreatAlertTable
          alerts={threatAlerts}
          onAcknowledge={onAcknowledgeAlert}
        />
      )}
    </div>
  );
};
