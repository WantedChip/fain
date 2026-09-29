import React from 'react';
import { FhiGauge } from '../RangerDashboard/FhiGauge';
import { SoundscapeGraph } from '../RangerDashboard/SoundscapeGraph';
import { SpotlightCard } from '../ui/SpotlightCard';
import type { ForestHealthMetrics, FainPacket } from '../../types/fain';
import { TreePine, Flame, Bird } from 'lucide-react';


interface AcousticIntelligenceViewProps {
  fhiMetrics: ForestHealthMetrics;
  recentPackets: FainPacket[];
  activePacket: FainPacket | null;
}

export const AcousticIntelligenceView: React.FC<AcousticIntelligenceViewProps> = ({
  fhiMetrics,
  recentPackets,
  activePacket,
}) => {
  return (
    <div className="space-y-4">
      {/* Top Section: FHI Gauge + Spectrogram Waterfall */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-5">
          <FhiGauge metrics={fhiMetrics} />
        </div>
        <div className="md:col-span-7">
          <SoundscapeGraph recentPackets={recentPackets} activePacket={activePacket} />
        </div>
      </div>

      {/* Bottom Section: Bioacoustic Reference & NDSI Algorithm Specs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: NDSI Mathematical Formulation */}
        <SpotlightCard className="p-4">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#1e402b]">
            <TreePine className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
              NDSI Soundscape Metric
            </h4>
          </div>
          <div className="space-y-2 text-xs font-mono text-slate-200">
            <p className="text-[11px] text-slate-300">
              Normalized Difference Soundscape Index (Kasten et al.):
            </p>
            <div className="bg-[#08150e] p-2.5 rounded-lg border border-[#1e402b] text-center text-cyan-300 font-bold shadow-inner">
              NDSI = (Biophony − Anthrophony) / (Biophony + Anthrophony)
            </div>
            <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
              <li>Biophony band: <span className="text-emerald-300 font-bold">2.0 – 8.0 kHz</span></li>
              <li>Anthrophony band: <span className="text-amber-300 font-bold">100 – 1500 Hz</span></li>
              <li>Current NDSI: <strong className="text-cyan-300 font-bold">{fhiMetrics.ndsi >= 0 ? `+${fhiMetrics.ndsi.toFixed(2)}` : fhiMetrics.ndsi.toFixed(2)}</strong></li>
            </ul>
          </div>
        </SpotlightCard>

        {/* Card 2: Anthropogenic Threat Signatures */}
        <SpotlightCard className="p-4" spotlightColor="rgba(239, 68, 68, 0.12)">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-red-800/40">
            <Flame className="w-4 h-4 text-red-400" />
            <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
              Threat Acoustic Signatures
            </h4>
          </div>
          <div className="space-y-2 text-xs font-mono text-slate-200 text-[11px]">
            <div>
              <span className="text-red-400 font-bold">Chainsaw (0x01):</span>
              <p className="text-slate-300">Dominant 2-stroke combustion harmonics (350-450 Hz) and chain cutter blade noise.</p>
            </div>
            <div>
              <span className="text-rose-400 font-bold">Gunshot (0x02):</span>
              <p className="text-slate-300">Broadband Mach wave with rapid ballistic muzzle impulse (&lt;50ms rise time).</p>
            </div>
            <div>
              <span className="text-amber-400 font-bold">Heavy Machinery (0x03):</span>
              <p className="text-slate-300">Continuous sub-audible low frequency diesel vibrations (60-180 Hz).</p>
            </div>
          </div>
        </SpotlightCard>

        {/* Card 3: Avian Biophony Signatures */}
        <SpotlightCard className="p-4" spotlightColor="rgba(16, 185, 129, 0.12)">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#1e402b]">
            <Bird className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
              Avian Biophony Ecosystem
            </h4>
          </div>
          <div className="space-y-2 text-xs font-mono text-slate-200 text-[11px]">
            <div>
              <span className="text-emerald-300 font-bold">Bird Chorus (0x06):</span>
              <p className="text-slate-300">Frequent multi-syllable whistling and harmonic chirps across 2.5–7.5 kHz.</p>
            </div>
            <div>
              <span className="text-cyan-300 font-bold">Ambient Canopy (0x07):</span>
              <p className="text-slate-300">Natural wind friction through teak and bamboo canopy with gentle geophony.</p>
            </div>
            <div>
              <span className="text-teal-300 font-bold">Sampling Window:</span>
              <p className="text-slate-300">Rolling 60-second aggregated observation window transmitted via 10B ECO packet.</p>
            </div>
          </div>
        </SpotlightCard>
      </div>
    </div>
  );
};
