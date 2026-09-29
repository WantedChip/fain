import React from 'react';
import { 
  BatteryCharging, 
  Sun, 
  Radio, 
  Thermometer, 
  MapPin, 
  Cpu 
} from 'lucide-react';
import type { FainNode } from '../../types/fain';
import { SpotlightCard } from '../ui/SpotlightCard';
import { TiltedCard } from '../ui/TiltedCard';

interface NodeHealthCardsProps {
  nodes: Record<'node_01' | 'node_02', FainNode>;
  selectedNodeId: 'node_01' | 'node_02';
  onSelectNode: (nodeId: 'node_01' | 'node_02') => void;
}

export const NodeHealthCards: React.FC<NodeHealthCardsProps> = ({
  nodes,
  selectedNodeId,
  onSelectNode,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {(['node_01', 'node_02'] as const).map((nodeId) => {
        const node = nodes[nodeId];
        const isSelected = selectedNodeId === nodeId;

        let batteryColor = 'text-emerald-400';
        let batteryBg = 'bg-emerald-500';
        if (node.batteryPercent < 40) {
          batteryColor = 'text-red-400';
          batteryBg = 'bg-red-500';
        } else if (node.batteryPercent < 70) {
          batteryColor = 'text-amber-400';
          batteryBg = 'bg-amber-500';
        }

        return (
          <TiltedCard key={nodeId} maxTilt={4}>
            <SpotlightCard
              onClick={() => onSelectNode(nodeId)}
              className={`cursor-pointer p-4 transition-all relative ${
                isSelected
                  ? 'border-emerald-500/80 shadow-xl shadow-emerald-950/40 ring-1 ring-emerald-500/40'
                  : 'hover:border-emerald-800'
              }`}
            >
              {/* Top Node Identity Header */}
              <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-[#1e402b]">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-950/90 text-emerald-400 border border-emerald-800/60 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white font-mono">
                        {node.name.split(' (')[0]}
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.2 rounded-full font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/60">
                        {node.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono">
                      {node.sector}
                    </p>
                  </div>
                </div>

                {/* Ping LED */}
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span>ONLINE</span>
                </div>
              </div>

              {/* Vital Telemetry 2x2 Grid */}
              <div className="grid grid-cols-2 gap-2.5 mb-3 font-mono text-xs tabular-nums">
                {/* Battery Block */}
                <div className="bg-[#08150e] p-2.5 rounded-xl border border-[#1e402b]">
                  <div className="flex items-center justify-between text-slate-300 mb-1 text-[11px]">
                    <span className="flex items-center gap-1">
                      <BatteryCharging className={`w-3.5 h-3.5 ${batteryColor}`} />
                      LiFePO4 Power
                    </span>
                    <span className={`font-bold ${batteryColor}`}>
                      {node.batteryPercent}%
                    </span>
                  </div>
                  <div className="text-white font-bold text-sm mb-1">
                    {node.batteryVolts.toFixed(2)} V
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`${batteryBg} h-full rounded-full`}
                      style={{ width: `${node.batteryPercent}%` }}
                    />
                  </div>
                </div>

                {/* Solar Harvesting Block */}
                <div className="bg-[#08150e] p-2.5 rounded-xl border border-[#1e402b]">
                  <div className="flex items-center justify-between text-slate-300 mb-1 text-[11px]">
                    <span className="flex items-center gap-1">
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      Solar MPPT
                    </span>
                    <span className="text-amber-300 font-bold text-[9px] bg-amber-950 px-1 rounded border border-amber-700/60">
                      HARVEST
                    </span>
                  </div>
                  <div className="text-amber-300 font-bold text-sm">
                    {node.solarMw} mW
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                    {node.solarMa} mA @ {node.solarVolts.toFixed(2)}V
                  </div>
                </div>

                {/* RF Link Quality */}
                <div className="bg-[#08150e] p-2.5 rounded-xl border border-[#1e402b]">
                  <div className="flex items-center justify-between text-slate-300 mb-1 text-[11px]">
                    <span className="flex items-center gap-1">
                      <Radio className="w-3.5 h-3.5 text-cyan-400" />
                      LoRa Link
                    </span>
                    <span className="text-cyan-300 font-bold text-[10px]">
                      IN865
                    </span>
                  </div>
                  <div className="text-cyan-300 font-bold text-sm">
                    {node.rssiAvg} dBm
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                    SNR: +{node.snrAvg} dB • PER: {node.per}%
                  </div>
                </div>

                {/* Thermal Core */}
                <div className="bg-[#08150e] p-2.5 rounded-xl border border-[#1e402b]">
                  <div className="flex items-center justify-between text-slate-300 mb-1 text-[11px]">
                    <span className="flex items-center gap-1">
                      <Thermometer className="w-3.5 h-3.5 text-teal-400" />
                      Core Temp
                    </span>
                    <span className="text-teal-300 font-bold text-[10px]">
                      NOMINAL
                    </span>
                  </div>
                  <div className="text-teal-300 font-bold text-sm">
                    {node.tempC.toFixed(1)} °C
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                    Packets Sent: {node.packetsSent}
                  </div>
                </div>
              </div>

              {/* Footer Hardware & GPS Coordinates */}
              <div className="pt-2 border-t border-[#1e402b] flex items-center justify-between text-[11px] font-mono text-slate-300">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-red-400" />
                  <span className="text-white font-medium">{node.lat.toFixed(4)}°N, {node.lng.toFixed(4)}°E</span>
                </div>
                <div className="text-slate-400 font-medium truncate max-w-[210px]">
                  {node.coreRadio.split(' (')[0]}
                </div>
              </div>
            </SpotlightCard>
          </TiltedCard>
        );
      })}
    </div>
  );
};
