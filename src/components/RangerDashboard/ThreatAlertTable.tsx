import React from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  MapPin, 
  ExternalLink, 
  AlertTriangle,
  Flame,
  Crosshair,
  Truck,
  Bomb,
  Sparkles
} from 'lucide-react';
import type { ThreatAlert } from '../../types/fain';

interface ThreatAlertTableProps {
  alerts: ThreatAlert[];
  onAcknowledge: (alertId: string) => void;
  onSelectCoordinates?: (lat: number, lng: number) => void;
}

export const ThreatAlertTable: React.FC<ThreatAlertTableProps> = ({
  alerts,
  onAcknowledge,
  onSelectCoordinates,
}) => {
  const getThreatIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'chainsaw': return Flame;
      case 'gunshot': return Crosshair;
      case 'heavy machinery': return Truck;
      case 'mining blast': return Bomb;
      default: return Sparkles;
    }
  };

  return (
    <div className="bg-[#0c1812] border border-[#1e402b] rounded-xl p-4 shadow-xl">
      {/* Table Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-[#1e402b]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-red-500/20 text-red-400 border border-red-500/40">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-wide text-white font-mono flex items-center gap-2">
              <span>Ranger Threat Alert Dispatch Console</span>
              {alerts.some(a => a.status === 'PENDING') && (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              )}
            </h3>
            <p className="text-[11px] text-slate-300 font-mono">
              Real-time high-priority edge detections requiring forest ranger verification
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-slate-300">Total Alerts:</span>
          <span className="text-white font-bold px-2 py-0.5 rounded bg-[#08150e] border border-[#1e402b]">
            {alerts.length}
          </span>
          <span className="text-emerald-800">|</span>
          <span className="text-red-400 font-bold">
            {alerts.filter(a => a.status === 'PENDING').length} Unacknowledged
          </span>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        {alerts.length === 0 ? (
          <div className="text-center py-10 text-slate-400 font-mono text-xs">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
            <p className="text-white font-bold">ALL CLEAR: NO ACTIVE ACOUSTIC THREATS</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Forest buffer zone is currently in resting bioacoustic equilibrium.
            </p>
          </div>
        ) : (
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-[#08150e] text-slate-300 text-[10px] uppercase border-b border-[#1e402b]">
              <tr>
                <th className="py-2.5 px-3">Severity / Threat</th>
                <th className="py-2.5 px-3">Sensor Node</th>
                <th className="py-2.5 px-3">Confidence</th>
                <th className="py-2.5 px-3">Coordinates / Sector</th>
                <th className="py-2.5 px-3">Timestamp (IST)</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#173322]">
              {alerts.map((alert) => {
                const Icon = getThreatIcon(alert.className);
                const googleMapsUrl = `https://www.google.com/maps?q=${alert.lat},${alert.lng}`;

                return (
                  <tr 
                    key={alert.id}
                    className={`hover:bg-slate-900/40 transition-colors ${
                      alert.status === 'PENDING' ? 'bg-red-950/15' : ''
                    }`}
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-100 flex items-center gap-1.5">
                            <span>{alert.className}</span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-red-950 text-red-300 border border-red-800/60 font-bold">
                              {alert.severity}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500">
                            Est. Range: ~{alert.distanceEstM}m
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="text-cyan-300 font-bold block">
                        {alert.nodeId === 'node_01' ? 'Node 01' : 'Node 02'}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {alert.nodeId === 'node_01' ? 'Yeoor Ridge A' : 'Kanheri Canopy B'}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <div className="w-24">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="font-bold text-amber-400">{alert.confidence}%</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-amber-500 to-red-500 h-full rounded-full"
                            style={{ width: `${alert.confidence}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onSelectCoordinates?.(alert.lat, alert.lng)}
                          className="text-emerald-400 hover:text-emerald-300 underline font-semibold flex items-center gap-1"
                          title="Center on GIS Map"
                        >
                          <MapPin className="w-3 h-3 text-red-400" />
                          <span>{alert.lat.toFixed(4)}°, {alert.lng.toFixed(4)}°</span>
                        </button>
                        <a
                          href={googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-500 hover:text-slate-300"
                          title="Open in Google Maps"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <span className="text-[10px] text-slate-500 block">
                        Thane Forest Buffer Zone
                      </span>
                    </td>

                    <td className="py-3 px-3 text-slate-300 text-[11px]">
                      {alert.timestampFormatted}
                    </td>

                    <td className="py-3 px-3">
                      {alert.status === 'PENDING' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-950 text-red-300 border border-red-700 animate-pulse">
                          <AlertTriangle className="w-3 h-3" />
                          PENDING
                        </span>
                      ) : alert.status === 'DISPATCHED' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-700">
                          DISPATCHED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
                          <CheckCircle2 className="w-3 h-3" />
                          ACKNOWLEDGED
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-right">
                      {alert.status !== 'ACKNOWLEDGED' ? (
                        <button
                          onClick={() => onAcknowledge(alert.id)}
                          className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow-sm transition-colors"
                        >
                          Acknowledge
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-500">Resolved</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
