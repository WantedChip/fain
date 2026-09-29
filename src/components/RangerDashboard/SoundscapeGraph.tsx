import React from 'react';
import { 
  BarChart3 
} from 'lucide-react';
import type { FainPacket } from '../../types/fain';

interface SoundscapeGraphProps {
  recentPackets: FainPacket[];
  activePacket: FainPacket | null;
}

export const SoundscapeGraph: React.FC<SoundscapeGraphProps> = ({
  recentPackets,
  activePacket,
}) => {
  // Simulated FFT Frequency Bins (16 bands from 63 Hz to 8 kHz)
  const freqBands = [
    '63', '125', '250', '350', '500', '750', '1k', '1.5k', 
    '2k', '2.5k', '3.5k', '4.5k', '5.5k', '6.5k', '7.5k', '8k'
  ];

  // Compute realistic FFT frequency amplitudes depending on active sound
  const getFftAmplitudes = (): number[] => {
    if (!activePacket) {
      // Resting natural soundscape baseline
      return [18, 24, 30, 22, 19, 25, 32, 28, 42, 48, 52, 45, 38, 28, 20, 15];
    }

    const { classId } = activePacket;
    switch (classId) {
      case 1: // Chainsaw: heavy energy at 250, 350, 500 Hz + upper harmonics
        return [25, 45, 88, 96, 78, 62, 58, 42, 35, 30, 25, 20, 18, 15, 12, 10];
      case 2: // Gunshot: broadband sudden shock impulse across all bands
        return [92, 95, 98, 94, 91, 88, 85, 82, 79, 75, 72, 68, 65, 60, 55, 50];
      case 3: // Heavy Machinery: deep low frequencies 63, 125, 250 Hz
        return [96, 94, 75, 52, 38, 28, 22, 18, 15, 12, 10, 8, 8, 7, 6, 5];
      case 4: // Mining Blast: infrasound + heavy low end
        return [99, 92, 80, 60, 42, 30, 24, 20, 16, 14, 12, 10, 8, 8, 6, 5];
      case 5: // Fire Crackle: stochastic mid-high pops
        return [22, 30, 42, 55, 68, 75, 82, 85, 78, 72, 65, 58, 48, 38, 28, 20];
      case 6: // Bird Chorus: high peak in 2.5k - 7.5k biophony
        return [10, 14, 18, 20, 22, 28, 45, 60, 82, 94, 96, 92, 88, 75, 60, 40];
      case 7: // Ambient: smooth low-mid canopy rustle
        return [25, 32, 38, 30, 25, 22, 28, 35, 40, 38, 32, 25, 20, 15, 12, 10];
      default:
        return [20, 25, 30, 35, 40, 45, 50, 55, 60, 55, 50, 45, 40, 35, 30, 25];
    }
  };

  const amplitudes = getFftAmplitudes();

  return (
    <div className="bg-[#0c1812] border border-[#1e402b] rounded-xl p-4 shadow-xl flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-[#1e402b]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
              Acoustic Spectrogram & Event Timeline
            </h4>
            <p className="text-[10px] text-slate-400 font-mono">
              Real-time FFT audio spectrum (50 Hz – 8 kHz)
            </p>
          </div>
        </div>

        {activePacket ? (
          <div className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/60 animate-pulse">
            SAMPLING: {activePacket.className}
          </div>
        ) : (
          <div className="text-[10px] font-mono text-slate-400 font-medium">
            CONTINUOUS 16kHz SAMPLING
          </div>
        )}
      </div>

      {/* Simulated FFT Spectrum Bar Visualizer */}
      <div className="bg-[#08150e] p-3 rounded-lg border border-[#1e402b] mb-3">
        <div className="flex items-end justify-between gap-1 h-20 px-1">
          {amplitudes.map((amp, idx) => {
            const isHighBand = idx >= 8;
            let barColor = 'from-emerald-600 to-teal-400';
            if (activePacket?.typeName === 'ALERT') {
              barColor = 'from-red-600 via-amber-500 to-red-400';
            } else if (isHighBand && activePacket?.classId === 6) {
              barColor = 'from-emerald-500 to-cyan-400';
            }

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="w-full bg-slate-900 rounded-t h-full flex items-end">
                  <div 
                    className={`w-full bg-gradient-to-t ${barColor} rounded-t transition-all duration-300 shadow-[0_0_8px_rgba(16,185,129,0.3)]`}
                    style={{ height: `${amp}%` }}
                  />
                </div>
                <span className="text-[8px] font-mono text-slate-600 group-hover:text-slate-400 truncate">
                  {freqBands[idx]}
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-[9px] font-mono text-slate-500 pt-1 mt-1 border-t border-slate-900">
          <span>Low Sub-Bass / Diesel (63-250 Hz)</span>
          <span>Engine Harmonics (350-1k)</span>
          <span>Avian Biophony (2.5k-8 kHz)</span>
        </div>
      </div>

      {/* Recent Packet Stream Timeline */}
      <div>
        <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
          <span>Recent Transmission Log:</span>
          <span className="text-slate-500">Last 5 Frames</span>
        </div>

        <div className="space-y-1.5 font-mono text-xs max-h-[140px] overflow-y-auto">
          {recentPackets.length === 0 ? (
            <div className="text-center py-4 text-[11px] text-slate-600">
              No recent packets recorded in current session.
            </div>
          ) : (
            recentPackets.slice(0, 5).map((pkt) => {
              const isAlert = pkt.typeName === 'ALERT';
              return (
                <div 
                  key={pkt.id}
                  className="flex items-center justify-between p-2 rounded bg-[#070d0a] border border-emerald-950/70 hover:border-emerald-800 transition-colors text-[11px]"
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isAlert ? 'bg-red-400' : 'bg-emerald-400'}`} />
                    <span className="font-bold text-slate-200">{pkt.className}</span>
                    <span className="text-[10px] text-slate-500">
                      ({pkt.nodeId === 'node_01' ? 'Node 01' : 'Node 02'})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${isAlert ? 'text-red-400' : 'text-emerald-400'}`}>
                      {pkt.confidence}%
                    </span>
                    <span className="text-slate-500 text-[10px]">
                      {new Date(pkt.timestamp * 1000).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
