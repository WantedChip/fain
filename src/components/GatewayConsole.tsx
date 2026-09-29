import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Radio, 
  Database, 
  Trash2, 
  Copy, 
  Check 
} from 'lucide-react';
import type { GatewayLog } from '../types/fain';

interface GatewayConsoleProps {
  logs: GatewayLog[];
  onClearLogs: () => void;
}

export const GatewayConsole: React.FC<GatewayConsoleProps> = ({ logs, onClearLogs }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'sx1276' | 'mqtt'>('all');
  const [copiedLogId, setCopiedLogId] = useState<string | null>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const filteredLogs = logs.filter((log) => {
    if (activeTab === 'sx1276') return log.source === 'SX1276';
    if (activeTab === 'mqtt') return log.source === 'CHIRPSTACK' || log.source === 'NODE_BACKEND';
    return true;
  });

  const copyLogText = (log: GatewayLog) => {
    const text = `${log.timestamp} [${log.source}] ${log.message}${log.hexDump ? `\nHEX: ${log.hexDump}` : ''}${log.jsonPayload ? `\nJSON: ${log.jsonPayload}` : ''}`;
    navigator.clipboard.writeText(text);
    setCopiedLogId(log.id);
    setTimeout(() => setCopiedLogId(null), 1500);
  };

  return (
    <div className="bg-[#0c1812] border border-[#1e402b] rounded-xl p-4 shadow-xl flex flex-col h-full">
      {/* Console Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-[#1e402b]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-wide text-white font-mono flex items-center gap-2">
              <span>Gateway & ChirpStack Live Telemetry Console</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </h3>
            <p className="text-[11px] text-slate-300 font-mono">
              SX1276 SPI demodulation ↔ Mosquitto MQTT & ChirpStack v4 stream
            </p>
          </div>
        </div>

        {/* Tab Filters & Clear Button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#08150e] p-1 rounded-lg border border-[#1e402b] text-xs font-mono">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeTab === 'all'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              ALL ({logs.length})
            </button>
            <button
              onClick={() => setActiveTab('sx1276')}
              className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 ${
                activeTab === 'sx1276'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Radio className="w-3 h-3" />
              <span>SX1276 PHY</span>
            </button>
            <button
              onClick={() => setActiveTab('mqtt')}
              className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 ${
                activeTab === 'mqtt'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Database className="w-3 h-3" />
              <span>MQTT TOPICS</span>
            </button>
          </div>

          <button
            onClick={onClearLogs}
            className="p-1.5 rounded-lg bg-[#0d1d14] border border-[#1e402b] text-slate-300 hover:text-red-400 transition-colors"
            title="Clear Console Logs"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Terminal Output Area */}
      <div 
        ref={logContainerRef}
        className="flex-1 bg-[#07140e] rounded-lg p-3 border border-[#1e402b] font-mono text-xs overflow-y-auto max-h-[380px] min-h-[260px] space-y-2 select-text shadow-inner"
      >
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12 text-slate-600">
            [No logs matching filter criteria]
          </div>
        ) : (
          filteredLogs.map((log) => {
            let levelBadge = 'bg-slate-800 text-slate-300';
            if (log.level === 'LORA') levelBadge = 'bg-emerald-950 text-emerald-400 border border-emerald-800';
            if (log.level === 'MQTT') levelBadge = 'bg-cyan-950 text-cyan-400 border border-cyan-800';
            if (log.level === 'ALERT') levelBadge = 'bg-red-950 text-red-400 border border-red-800 animate-pulse';
            if (log.level === 'WARN') levelBadge = 'bg-amber-950 text-amber-400 border border-amber-800';

            return (
              <div 
                key={log.id} 
                className="group p-2 rounded bg-[#09120c]/80 hover:bg-[#0c1a11] border border-emerald-950/40 transition-colors relative"
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-bold">{log.timestamp}</span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${levelBadge}`}>
                      {log.level}
                    </span>
                    <span className="text-slate-400 font-bold">[{log.source}]</span>
                    {log.topic && (
                      <span className="text-cyan-400 text-[10px] bg-cyan-950/50 px-1.5 py-0.2 rounded border border-cyan-900/50">
                        {log.topic}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => copyLogText(log)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-slate-300 transition-opacity"
                    title="Copy Log"
                  >
                    {copiedLogId === log.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>

                <div className="text-slate-300 leading-snug">
                  {log.message}
                </div>

                {log.hexDump && (
                  <div className="mt-1.5 p-2 rounded bg-black/50 border border-emerald-950/80 text-emerald-400 text-[11px]">
                    <span className="text-slate-500 block text-[9px]">RAW PHY RX BUFFER:</span>
                    <span className="tracking-wider font-semibold">{log.hexDump}</span>
                  </div>
                )}

                {log.jsonPayload && (
                  <div className="mt-1.5 p-2 rounded bg-black/60 border border-cyan-950/80 text-cyan-300 text-[11px] overflow-x-auto">
                    <span className="text-slate-500 block text-[9px]">MQTT DISPATCH PAYLOAD:</span>
                    <pre className="text-[10px] whitespace-pre-wrap">{log.jsonPayload}</pre>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Console Status Footer */}
      <div className="mt-2 pt-2 border-t border-emerald-950 flex items-center justify-between text-[11px] font-mono text-slate-500">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>MQTT Broker: tcp://localhost:1883 (ONLINE)</span>
        </div>
        <div>
          <span>Baud: 115200 • SPI Clock: 8 MHz • IN865 Sub-Band 0</span>
        </div>
      </div>
    </div>
  );
};
