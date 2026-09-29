import React from 'react';
import { 
  Smartphone, 
  X, 
  CheckCircle2, 
  MapPin, 
  ShieldCheck, 
  Flame,
  ExternalLink
} from 'lucide-react';
import type { Fast2SmsNotification } from '../types/fain';

interface Fast2SmsModalProps {
  notification: Fast2SmsNotification | null;
  onClose: () => void;
  onAcknowledge: (alertId: string) => void;
}

export const Fast2SmsModal: React.FC<Fast2SmsModalProps> = ({
  notification,
  onClose,
  onAcknowledge,
}) => {
  if (!notification || !notification.visible) return null;

  const googleMapsUrl = `https://www.google.com/maps?q=${notification.lat},${notification.lng}`;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md w-full animate-bounce-in shadow-2xl">
      <div className="bg-[#0c1812] border-2 border-emerald-500/60 rounded-xl overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
        {/* Top Header Strip - Sleek Dark Forest Carbon Bar with Amber Badge */}
        <div className="bg-[#08150e] border-b border-[#1e402b] px-4 py-2.5 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Smartphone className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-xs tracking-wider font-mono text-white">
              FAST2SMS DLT GSM DISPATCH
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-700/60 font-bold">
              PRIORITY-1 SMS
            </span>
            <button
              onClick={onClose}
              className="p-1 text-slate-300 hover:text-white hover:bg-[#12281a] rounded transition-colors"
              title="Dismiss Notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* SMS Card Content */}
        <div className="p-4 space-y-3 font-mono text-xs text-slate-200">
          {/* Metadata Row */}
          <div className="flex items-center justify-between text-[11px] text-slate-300 pb-2 border-b border-[#1e402b]">
            <div>
              <span className="text-slate-400">Sender ID:</span>{' '}
              <strong className="text-emerald-300 font-bold">TX-FAST2S (VK-FAININ)</strong>
            </div>
            <div>
              <span className="text-slate-400">Msg ID:</span>{' '}
              <strong className="text-slate-200">{notification.messageId}</strong>
            </div>
          </div>

          {/* SMS Body Bubble */}
          <div className="bg-[#08150e] p-3 rounded-lg border border-amber-700/50 relative">
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 rounded bg-amber-500/20 text-amber-400 mt-0.5 border border-amber-500/40">
                <Flame className="w-4 h-4" />
              </div>
              <div className="space-y-1 text-slate-200 leading-relaxed text-xs">
                <p className="font-bold text-amber-300">
                  ⚠️ [FAIN EMERGENCY ALERT DISPATCH]
                </p>
                <p>
                  Acoustic threat <span className="font-bold text-white underline decoration-amber-400">{notification.threatName}</span> detected by <span className="text-cyan-300 font-bold">{notification.nodeId === 'node_01' ? 'Node 01' : 'Node 02'}</span> with <strong className="text-amber-300">{notification.confidence}% confidence</strong>.
                </p>
                <p className="text-slate-300">
                  Sector: Yeoor Hills Ridge (Sanjay Gandhi National Park Buffer).
                </p>
                <p className="text-emerald-300 text-[11px] font-semibold">
                  GPS Anchor: {notification.lat.toFixed(4)}°N, {notification.lng.toFixed(4)}°E.
                </p>
              </div>
            </div>
          </div>

          {/* Recipient & Gateway Delivery Status */}
          <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-300 bg-[#08150e] p-2.5 rounded-lg border border-[#1e402b]">
            <div>
              <span className="text-slate-400 block mb-0.5">Recipient:</span>
              <p className="text-white font-bold">RFO Thane & Patrol 04</p>
              <p className="text-slate-400">{notification.phone}</p>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Delivery Status:</span>
              <p className="text-emerald-300 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                HTTP 200 Delivered
              </p>
              <p className="text-slate-400">Latency: 480ms via GSM</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => {
                onAcknowledge(notification.alertId);
                onClose();
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>ACKNOWLEDGE & DISPATCH</span>
            </button>

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 py-2 px-3 rounded-lg bg-[#0e2015] hover:bg-[#142e1f] text-slate-200 hover:text-white text-xs border border-[#1e402b] transition-colors"
              title="Open Coordinates in Google Maps"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>MAP</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
