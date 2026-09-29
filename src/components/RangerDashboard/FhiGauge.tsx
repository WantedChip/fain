import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  TreePine 
} from 'lucide-react';
import type { ForestHealthMetrics } from '../../types/fain';

interface FhiGaugeProps {
  metrics: ForestHealthMetrics;
}

export const FhiGauge: React.FC<FhiGaugeProps> = ({ metrics }) => {
  const fhi = Math.min(100, Math.max(0, metrics.fhi));

  let statusText = 'PRISTINE BIOACOUSTIC BALANCE';
  let statusColor = 'text-emerald-400';
  let badgeBorder = 'border-emerald-500/40 bg-emerald-950/60';
  let needleColor = '#10b981';

  if (fhi < 35) {
    statusText = 'SEVERE ANTHROPOGENIC STRESS';
    statusColor = 'text-red-400';
    badgeBorder = 'border-red-500/40 bg-red-950/60';
    needleColor = '#ef4444';
  } else if (fhi < 65) {
    statusText = 'MODERATE SOUNDSCAPE DISTURBANCE';
    statusColor = 'text-amber-400';
    badgeBorder = 'border-amber-500/40 bg-amber-950/60';
    needleColor = '#f59e0b';
  }

  const radius = 80;
  const strokeWidth = 14;
  const center = 100;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (fhi / 100) * circumference;

  const needleAngle = -90 + (fhi / 100) * 180;

  return (
    <div className="bg-[#0c1812] border border-[#1e402b] rounded-xl p-4 shadow-xl flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#1e402b]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <TreePine className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
              Forest Health Index (FHI)
            </h4>
            <p className="text-[10px] text-slate-400 font-mono">
              Biotic-to-Anthropogenic Acoustic Ratio
            </p>
          </div>
        </div>

        <div className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1 ${
          metrics.trend >= 0 ? 'text-emerald-300 bg-emerald-950/80 border border-emerald-700/60' : 'text-red-300 bg-red-950/80 border border-red-700/60'
        }`}>
          {metrics.trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span>{metrics.trend >= 0 ? `+${metrics.trend.toFixed(1)}%` : `${metrics.trend.toFixed(1)}%`}</span>
        </div>
      </div>

      {/* SVG Radial Gauge */}
      <div className="flex flex-col items-center justify-center my-1 relative">
        <svg viewBox="0 0 200 120" className="w-48 h-28 overflow-visible">
          {/* Red Zone (0-35) */}
          <path
            d="M 20 100 A 80 80 0 0 1 54.4 43.6"
            fill="none"
            stroke="#ef4444"
            strokeWidth={strokeWidth}
            strokeOpacity="0.25"
            strokeLinecap="round"
          />
          {/* Amber Zone (35-65) */}
          <path
            d="M 54.4 43.6 A 80 80 0 0 1 145.6 43.6"
            fill="none"
            stroke="#f59e0b"
            strokeWidth={strokeWidth}
            strokeOpacity="0.25"
          />
          {/* Emerald Zone (65-100) */}
          <path
            d="M 145.6 43.6 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#10b981"
            strokeWidth={strokeWidth}
            strokeOpacity="0.25"
            strokeLinecap="round"
          />

          {/* Active Value Progress Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={needleColor}
            strokeWidth={strokeWidth - 2}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
            style={{
              filter: `drop-shadow(0 0 8px ${needleColor}88)`,
            }}
          />

          {/* Center Pivot & Needle */}
          <g transform={`translate(${center}, 100) rotate(${needleAngle})`} className="transition-transform duration-700 ease-out">
            <line x1="0" y1="0" x2="0" y2="-68" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="0" cy="-68" r="3" fill={needleColor} />
            <circle cx="0" cy="0" r="5" fill="#ffffff" />
          </g>

          {/* Scale Labels */}
          <text x="18" y="116" fill="#94a3b8" fontSize="9" fontFamily="monospace" fontWeight="bold">0</text>
          <text x="96" y="24" fill="#94a3b8" fontSize="9" fontFamily="monospace" fontWeight="bold">50</text>
          <text x="172" y="116" fill="#94a3b8" fontSize="9" fontFamily="monospace" fontWeight="bold">100</text>
        </svg>

        {/* Big Numeric Value Display */}
        <div className="text-center -mt-4">
          <div className="text-3xl font-extrabold font-mono tracking-tight text-white flex items-center justify-center">
            <span>{fhi.toFixed(1)}</span>
            <span className="text-xs text-slate-400 font-normal ml-1">/100</span>
          </div>
          <div className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border inline-block mt-1 ${badgeBorder} ${statusColor}`}>
            {statusText}
          </div>
        </div>
      </div>

      {/* Acoustic Component Readouts (NDSI & Soundscape Energy) */}
      <div className="mt-3 pt-2.5 border-t border-[#1e402b] font-mono text-[11px] space-y-1.5 bg-[#08150e] p-2.5 rounded-lg border border-[#1e402b]">
        <div className="flex items-center justify-between text-slate-300">
          <span>NDSI (Soundscape Index):</span>
          <strong className="text-cyan-300 font-bold">
            {metrics.ndsi >= 0 ? `+${metrics.ndsi.toFixed(2)}` : metrics.ndsi.toFixed(2)}
          </strong>
        </div>
        <div className="flex items-center justify-between text-slate-300">
          <span>Biophony Energy (2-8 kHz):</span>
          <strong className="text-emerald-300 font-bold">{metrics.bioticAcousticLevel.toFixed(1)} dB SPL</strong>
        </div>
        <div className="flex items-center justify-between text-slate-300">
          <span>Anthrophony Noise (100-1500 Hz):</span>
          <strong className={metrics.anthroAcousticLevel > 30 ? 'text-red-400 font-bold' : 'text-slate-200 font-semibold'}>
            {metrics.anthroAcousticLevel.toFixed(1)} dB SPL
          </strong>
        </div>
      </div>
    </div>
  );
};
