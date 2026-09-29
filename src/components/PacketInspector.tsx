import React, { useState } from 'react';
import { 
  Binary, 
  Code2, 
  Copy, 
  Check, 
  ShieldCheck, 
  Flame,
  Bird,
  HelpCircle
} from 'lucide-react';
import type { FainPacket, ByteDefinition } from '../types/fain';
import { SpotlightCard } from './ui/SpotlightCard';
import { BorderBeam } from './ui/BorderBeam';

interface PacketInspectorProps {
  packet: FainPacket | null;
}

export const PacketInspector: React.FC<PacketInspectorProps> = ({ packet }) => {
  const [activeTab, setActiveTab] = useState<'hex' | 'json'>('hex');
  const [selectedByteIdx, setSelectedByteIdx] = useState<number | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  if (!packet) {
    return (
      <SpotlightCard className="p-6 shadow-2xl flex flex-col items-center justify-center min-h-[340px] text-center">
        <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-900/60 text-emerald-400 mb-3 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
          <Binary className="w-6 h-6 animate-pulse" />
        </div>
        <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">
          Packet Construction & Physical Layer Inspector
        </h4>
        <p className="text-xs text-slate-400 max-w-md mt-1 font-mono leading-relaxed">
          PHY buffer awaiting transmission. Trigger any sound event above (Threat, Bird Chorus, or Ambient) to construct and inspect the raw binary byte stream.
        </p>
      </SpotlightCard>
    );
  }

  const jsonPayload = packet.typeName === 'ALERT' ? {
    packet_type: "0x01_ALERT",
    device_id: packet.nodeId,
    coordinates: {
      latitude: packet.lat,
      longitude: packet.lng,
      altitude_m: packet.nodeId === 'node_01' ? 142.5 : 188.0,
      zone: packet.nodeId === 'node_01' ? "Yeoor Ridge Sector A" : "Kanheri Canopy Sector B",
    },
    inference: {
      class_id: `0x0${packet.classId}`,
      class_name: packet.className,
      confidence_score: `${packet.confidence}%`,
      model: "EdgeImpulse_MobileNetV1_INT8_Quantized",
      inference_time_ms: 42,
    },
    rf_telemetry: {
      frequency_mhz: packet.frequencyMhz,
      channel: packet.channel,
      spreading_factor: packet.spreadingFactor,
      bandwidth_khz: packet.bandwidthKhz,
      rssi_dbm: packet.rssi,
      snr_db: packet.snr,
      airtime_ms: 148.5,
      crc8_valid: packet.crcValid,
    },
    unix_timestamp: packet.timestamp,
    timestamp_ist: packet.timestampFormatted,
  } : {
    packet_type: "0x02_ECO",
    device_id: packet.nodeId,
    ecological_metrics: {
      bird_presence_pct: packet.birdPercent,
      ambient_presence_pct: packet.ambientPercent,
      window_sequence_num: packet.windowNumber,
      window_duration_sec: 60,
      soundscape_index_ndsi: ((packet.birdPercent || 80) - (packet.ambientPercent || 20)) / 100,
    },
    rf_telemetry: {
      frequency_mhz: packet.frequencyMhz,
      channel: packet.channel,
      spreading_factor: packet.spreadingFactor,
      bandwidth_khz: packet.bandwidthKhz,
      rssi_dbm: packet.rssi,
      snr_db: packet.snr,
      airtime_ms: 104.2,
      crc8_valid: packet.crcValid,
    },
    unix_timestamp: packet.timestamp,
    timestamp_ist: packet.timestampFormatted,
  };

  const jsonString = JSON.stringify(jsonPayload, null, 2);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  let selectedByteDef: ByteDefinition | undefined = undefined;
  if (selectedByteIdx !== null) {
    selectedByteDef = packet.byteBreakdown.find(
      (b) => selectedByteIdx >= b.offset && selectedByteIdx < b.offset + b.length
    );
  }

  return (
    <SpotlightCard className="p-4 shadow-2xl relative">
      <BorderBeam 
        active={true}
        colorFrom={packet.typeName === 'ALERT' ? '#f59e0b' : '#10b981'}
        colorTo={packet.typeName === 'ALERT' ? '#d97706' : '#06b6d4'}
        duration={12}
      />

      {/* Header with Packet Type Banner & Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-[#1e402b]">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl ${
            packet.typeName === 'ALERT' 
              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' 
              : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
          }`}>
            {packet.typeName === 'ALERT' ? <Flame className="w-4 h-4" /> : <Bird className="w-4 h-4" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold tracking-wide text-white font-mono">
                {packet.typeName} PACKET ({packet.lengthBytes} BYTES)
              </h3>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                packet.typeName === 'ALERT' 
                  ? 'bg-amber-950 text-amber-300 border border-amber-700/60' 
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
              }`}>
                {packet.className} ({packet.confidence}%)
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-mono">
              From: <span className="text-cyan-300 font-semibold">{packet.nodeId === 'node_01' ? 'Node 01 (Yeoor Ridge)' : 'Node 02 (Kanheri Canopy)'}</span> • IN865 CH0 @ 865.0625 MHz
            </p>
          </div>
        </div>

        {/* View Toggle Tabs & Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#08150e] p-1 rounded-xl border border-[#1e402b] text-xs font-mono">
            <button
              onClick={() => setActiveTab('hex')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                activeTab === 'hex'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Binary className="w-3.5 h-3.5" />
              <span>RAW HEX ({packet.lengthBytes}B)</span>
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                activeTab === 'json'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>DECODED JSON</span>
            </button>
          </div>

          <button
            onClick={() => copyToClipboard(activeTab === 'hex' ? packet.rawHex : jsonString, activeTab)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0d1d14] border border-[#1e402b] text-slate-200 hover:text-white text-xs font-mono transition-colors"
            title="Copy payload to clipboard"
          >
            {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedText ? 'COPIED!' : 'COPY'}</span>
          </button>
        </div>
      </div>

      {/* RF Physical Layer Telemetry Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 mb-3.5 bg-[#08150e] p-2.5 rounded-xl border border-[#1e402b] text-xs font-mono tabular-nums">
        <div>
          <span className="text-slate-400 text-[10px] block font-medium">PAYLOAD LEN</span>
          <span className="text-white font-bold">{packet.lengthBytes} Bytes</span>
        </div>
        <div>
          <span className="text-slate-400 text-[10px] block font-medium">IN865 FREQUENCY</span>
          <span className="text-emerald-300 font-bold">{packet.frequencyMhz} MHz</span>
        </div>
        <div>
          <span className="text-slate-400 text-[10px] block font-medium">SPREADING FACTOR</span>
          <span className="text-cyan-300 font-bold">{packet.spreadingFactor} / BW 125k</span>
        </div>
        <div>
          <span className="text-slate-400 text-[10px] block font-medium">RSSI (POWER)</span>
          <span className="text-amber-300 font-bold">{packet.rssi} dBm</span>
        </div>
        <div>
          <span className="text-slate-400 text-[10px] block font-medium">SNR (RATIO)</span>
          <span className="text-teal-300 font-bold">+{packet.snr} dB</span>
        </div>
        <div>
          <span className="text-slate-400 text-[10px] block font-medium">INTEGRITY (CRC8)</span>
          <span className="text-emerald-300 font-bold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            0x{packet.crc8.toString(16).padStart(2, '0').toUpperCase()} OK
          </span>
        </div>
      </div>

      {/* Tab 1: Hex View with Byte-by-Byte Inspector */}
      {activeTab === 'hex' ? (
        <div className="space-y-3.5">
          <div>
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
              <span>PHYSICAL BYTE STREAM (HOVER / CLICK ANY BYTE TO INSPECT):</span>
              <span className="text-slate-500">Bytes 00 to {packet.lengthBytes - 1}</span>
            </div>

            {/* Interactive Byte Chips */}
            <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-[#08150e] border border-[#1e402b] font-mono">
              {packet.rawBytes.map((byte, idx) => {
                const hexVal = byte.toString(16).padStart(2, '0').toUpperCase();
                const byteDef = packet.byteBreakdown.find(
                  (b) => idx >= b.offset && idx < b.offset + b.length
                );
                const isSelected = selectedByteIdx === idx;
                const isPartOfSelected = selectedByteDef && 
                  idx >= selectedByteDef.offset && 
                  idx < selectedByteDef.offset + selectedByteDef.length;

                return (
                  <button
                    key={idx}
                    onMouseEnter={() => setSelectedByteIdx(idx)}
                    onClick={() => setSelectedByteIdx(idx)}
                    className={`relative px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                      isSelected
                        ? 'ring-2 ring-emerald-400 scale-105 z-10'
                        : isPartOfSelected
                          ? 'border-emerald-500/80 bg-emerald-950/60'
                          : 'border-slate-700 bg-[#0d1f15] hover:border-slate-600'
                    }`}
                    style={{
                      borderColor: isSelected || isPartOfSelected ? byteDef?.color || '#10b981' : undefined,
                      color: isSelected ? '#ffffff' : byteDef?.color || '#cbd5e1',
                      backgroundColor: isSelected ? `${byteDef?.color || '#10b981'}44` : undefined,
                    }}
                  >
                    <span className="block text-[9px] text-slate-400 font-normal">
                      B{idx.toString().padStart(2, '0')}
                    </span>
                    <span>0x{hexVal}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Inspection Detail Card */}
          <div className="p-3.5 rounded-xl bg-[#08150e] border border-[#1e402b]">
            {selectedByteDef ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedByteDef.color }} />
                    <span className="text-slate-300">Field Name:</span>
                    <strong className="text-white">{selectedByteDef.field}</strong>
                  </div>
                  <div className="text-slate-300">
                    Byte Range: <span className="text-white font-medium">Byte {selectedByteDef.offset} ({selectedByteDef.length} Byte{selectedByteDef.length > 1 ? 's' : ''})</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-slate-300">
                    Raw Hex / Binary: <span className="text-emerald-300 font-bold">{selectedByteDef.hex}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    Binary: {selectedByteDef.binary}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-slate-300">
                    Interpreted Decoded Value:
                  </div>
                  <div className="text-cyan-300 font-bold text-sm">
                    {selectedByteDef.decoded}
                  </div>
                  <p className="text-[11px] text-slate-300 leading-tight">
                    {selectedByteDef.description}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
                <HelpCircle className="w-4 h-4 text-emerald-400" />
                <span>Hover or click any byte chip above to inspect IEEE 754 float decoding, quantized confidence, or CRC8 polynomial calculation.</span>
              </div>
            )}
          </div>

          {/* Byte Breakdown Legend Table */}
          <div className="border border-[#1e402b] rounded-xl overflow-x-auto max-h-[160px]">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#08150e] text-slate-300 text-[10px] uppercase border-b border-[#1e402b] sticky top-0">
                <tr>
                  <th className="py-2 px-3">Offset</th>
                  <th className="py-2 px-3">Length</th>
                  <th className="py-2 px-3">Field</th>
                  <th className="py-2 px-3">Raw Hex</th>
                  <th className="py-2 px-3">Decoded Representation</th>
                  <th className="py-2 px-3">Specification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#173322]">
                {packet.byteBreakdown.map((row, idx) => (
                  <tr 
                    key={idx}
                    onMouseEnter={() => setSelectedByteIdx(row.offset)}
                    className="hover:bg-emerald-950/40 transition-colors cursor-pointer"
                  >
                    <td className="py-1.5 px-3 text-slate-400 font-medium">Byte {row.offset}</td>
                    <td className="py-1.5 px-3 text-slate-300">{row.length}B</td>
                    <td className="py-1.5 px-3 font-semibold" style={{ color: row.color }}>
                      {row.field}
                    </td>
                    <td className="py-1.5 px-3 text-white font-bold">{row.hex}</td>
                    <td className="py-1.5 px-3 text-cyan-300 font-medium">{row.decoded}</td>
                    <td className="py-1.5 px-3 text-slate-300 text-[11px]">{row.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Tab 2: Decoded JSON View */
        <div className="relative">
          <pre className="p-4 rounded-xl bg-[#08150e] border border-[#1e402b] font-mono text-xs text-emerald-300 overflow-x-auto max-h-[340px] leading-relaxed">
            {jsonString}
          </pre>
        </div>
      )}
    </SpotlightCard>
  );
};
