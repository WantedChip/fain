import React, { useState } from 'react';
import { 
  Radio, 
  Server, 
  Compass, 
  Navigation
} from 'lucide-react';
import type { FainNode, ThreatAlert } from '../../types/fain';

interface ForestMapProps {
  nodes: Record<'node_01' | 'node_02', FainNode>;
  selectedNodeId: 'node_01' | 'node_02';
  onSelectNode: (nodeId: 'node_01' | 'node_02') => void;
  activeAlert: ThreatAlert | null;
}

export const ForestMap: React.FC<ForestMapProps> = ({
  nodes,
  selectedNodeId,
  onSelectNode,
  activeAlert,
}) => {
  const [mapMode, setMapMode] = useState<'tactical' | 'satellite'>('tactical');
  const [hoveredTarget, setHoveredTarget] = useState<string | null>(null);

  const gatewayPos = { x: 50, y: 52 };
  const node1Pos = { x: 32, y: 64 };
  const node2Pos = { x: 68, y: 36 };
  const rangerPos = { x: 78, y: 76 };

  return (
    <div className="bg-[#0c1812] border border-[#1e402b] rounded-xl p-4 shadow-xl flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2.5 border-b border-[#1e402b]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <span>Tactical GIS Coverage Map</span>
              <span className="text-[10px] text-cyan-300 font-mono font-bold">
                Yeoor Hills (SGNP Buffer)
              </span>
            </h4>
            <p className="text-[10px] text-slate-400 font-mono">
              19.2183°N, 72.9781°E • IN865 LoRa RF Propagation Radius: 2.4 km
            </p>
          </div>
        </div>

        {/* Tactical overlay selector */}
        <div className="flex items-center gap-1.5 bg-[#08150e] p-1 rounded-lg border border-[#1e402b] text-[10px] font-mono">
          <button
            onClick={() => setMapMode('tactical')}
            className={`px-2 py-0.5 rounded transition-colors ${
              mapMode === 'tactical' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            TACTICAL GRID
          </button>
          <button
            onClick={() => setMapMode('satellite')}
            className={`px-2 py-0.5 rounded transition-colors ${
              mapMode === 'satellite' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            CANOPY CONTOUR
          </button>
        </div>
      </div>

      {/* Map Canvas Visualizer */}
      <div className="relative w-full h-[260px] rounded-lg bg-[#07140e] border border-[#1e402b] overflow-hidden select-none">
        {/* SVG Topography & Tactical Grid */}
        <svg className="w-full h-full absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="tacticalGrid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#12251a" strokeWidth="0.3" />
            </pattern>
            <radialGradient id="gatewayLoRaField" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.18" />
              <stop offset="60%" stopColor="#06b6d4" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="threatRipple" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width="100" height="100" fill="url(#tacticalGrid)" />

          <path
            d="M 5,20 Q 25,10 50,25 T 95,20 M 10,45 Q 35,35 60,50 T 90,40 M 15,75 Q 45,65 75,80 T 95,70"
            fill="none"
            stroke="#133020"
            strokeWidth="0.4"
            strokeDasharray="2 2"
          />
          <path
            d="M 20,30 C 35,15 65,15 80,35 C 70,60 40,65 20,30 Z"
            fill="#091b12"
            fillOpacity="0.4"
            stroke="#1c4730"
            strokeWidth="0.3"
          />

          <circle
            cx={gatewayPos.x}
            cy={gatewayPos.y}
            r="42"
            fill="url(#gatewayLoRaField)"
            stroke="#10b981"
            strokeWidth="0.4"
            strokeDasharray="1.5 1.5"
            strokeOpacity="0.6"
          />

          <line
            x1={node1Pos.x}
            y1={node1Pos.y}
            x2={gatewayPos.x}
            y2={gatewayPos.y}
            stroke="#10b981"
            strokeWidth="0.6"
            strokeDasharray="1.5 1"
            strokeOpacity="0.7"
          />
          <line
            x1={node2Pos.x}
            y1={node2Pos.y}
            x2={gatewayPos.x}
            y2={gatewayPos.y}
            stroke="#06b6d4"
            strokeWidth="0.6"
            strokeDasharray="1.5 1"
            strokeOpacity="0.7"
          />

          {activeAlert && (
            <g
              transform={`translate(${activeAlert.nodeId === 'node_01' ? node1Pos.x : node2Pos.x}, ${
                activeAlert.nodeId === 'node_01' ? node1Pos.y : node2Pos.y
              })`}
            >
              <circle r="14" fill="url(#threatRipple)" opacity="0.8" />
              <circle r="8" fill="none" stroke="#f59e0b" strokeWidth="0.8" opacity="0.8" />
              <line x1="-10" y1="0" x2="10" y2="0" stroke="#f59e0b" strokeWidth="0.4" opacity="0.8" />
              <line x1="0" y1="-10" x2="0" y2="10" stroke="#f59e0b" strokeWidth="0.4" opacity="0.8" />
            </g>
          )}
        </svg>

        {/* 1. Gateway Marker */}
        <div
          style={{ left: `${gatewayPos.x}%`, top: `${gatewayPos.y}%` }}
          className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer"
          onMouseEnter={() => setHoveredTarget('Gateway: RPi 4 + SX1276 Base Station (Yeoor Center Tower)')}
          onMouseLeave={() => setHoveredTarget(null)}
        >
          <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-cyan-950/90 border border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.6)]">
            <Server className="w-3.5 h-3.5" />
          </div>
          <span className="absolute top-8 left-1/2 -translate-x-1/2 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-black/80 text-cyan-300 border border-cyan-900 whitespace-nowrap">
            GATEWAY 01
          </span>
        </div>

        {/* 2. Node 01 Marker */}
        <div
          style={{ left: `${node1Pos.x}%`, top: `${node1Pos.y}%` }}
          onClick={() => onSelectNode('node_01')}
          className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer"
          onMouseEnter={() => setHoveredTarget(`Node 01: ${nodes.node_01.name} • Battery ${nodes.node_01.batteryPercent}% • Lat ${nodes.node_01.lat.toFixed(4)}°N`)}
          onMouseLeave={() => setHoveredTarget(null)}
        >
          <div className={`relative flex items-center justify-center w-7 h-7 rounded-full transition-all ${
            selectedNodeId === 'node_01'
              ? 'bg-emerald-500 text-black border-2 border-white scale-110 shadow-[0_0_15px_rgba(16,185,129,0.8)]'
              : 'bg-emerald-950/90 border border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.4)]'
          }`}>
            <Radio className="w-3.5 h-3.5" />
          </div>
          <span className="absolute top-8 left-1/2 -translate-x-1/2 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-black/80 text-emerald-300 border border-emerald-900 whitespace-nowrap">
            NODE 01
          </span>
        </div>

        {/* 3. Node 02 Marker */}
        <div
          style={{ left: `${node2Pos.x}%`, top: `${node2Pos.y}%` }}
          onClick={() => onSelectNode('node_02')}
          className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer"
          onMouseEnter={() => setHoveredTarget(`Node 02: ${nodes.node_02.name} • Battery ${nodes.node_02.batteryPercent}% • Lat ${nodes.node_02.lat.toFixed(4)}°N`)}
          onMouseLeave={() => setHoveredTarget(null)}
        >
          <div className={`relative flex items-center justify-center w-7 h-7 rounded-full transition-all ${
            selectedNodeId === 'node_02'
              ? 'bg-emerald-500 text-black border-2 border-white scale-110 shadow-[0_0_15px_rgba(16,185,129,0.8)]'
              : 'bg-emerald-950/90 border border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.4)]'
          }`}>
            <Radio className="w-3.5 h-3.5" />
          </div>
          <span className="absolute top-8 left-1/2 -translate-x-1/2 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-black/80 text-emerald-300 border border-emerald-900 whitespace-nowrap">
            NODE 02
          </span>
        </div>

        {/* 4. Ranger Outpost & Patrol Unit 4 */}
        <div
          style={{ left: `${rangerPos.x}%`, top: `${rangerPos.y}%` }}
          className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer"
          onMouseEnter={() => setHoveredTarget('Forest Ranger Post & Mobile Patrol Unit 04')}
          onMouseLeave={() => setHoveredTarget(null)}
        >
          <div className="flex items-center justify-center w-6 h-6 rounded-md bg-amber-950/90 border border-amber-400 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.5)]">
            <Navigation className="w-3 h-3" />
          </div>
          <span className="absolute top-7 left-1/2 -translate-x-1/2 text-[8px] font-mono px-1 rounded bg-black/80 text-amber-400 border border-amber-900 whitespace-nowrap">
            PATROL 04
          </span>
        </div>

        {hoveredTarget && (
          <div className="absolute top-2 left-2 z-30 px-2 py-1 rounded bg-black/90 border border-emerald-800 text-[10px] font-mono text-emerald-300 shadow-md">
            {hoveredTarget}
          </div>
        )}

        <div className="absolute bottom-2 right-2 z-20 px-2 py-1 rounded bg-black/80 border border-emerald-950 text-[9px] font-mono text-slate-400">
          <div>SCALE: 1 cm : 450 m</div>
          <div>DATUM: WGS84 / SGNP ZONE 43N</div>
        </div>
      </div>

      {/* Map Legend Footer */}
      <div className="mt-3 pt-2 border-t border-emerald-950 flex flex-wrap items-center justify-between text-[10px] font-mono text-slate-400 gap-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>LoRa Sensor Nodes (ESP32-S3)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span>Gateway SX1276 Base Station</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span>Ranger Fast2SMS Dispatch Outpost</span>
        </div>
      </div>
    </div>
  );
};
