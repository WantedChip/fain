import React from 'react';
import { ForestMap } from '../RangerDashboard/ForestMap';
import { ThreatAlertTable } from '../RangerDashboard/ThreatAlertTable';
import type { FainNode, ThreatAlert } from '../../types/fain';
import { ShieldCheck, Navigation } from 'lucide-react';


interface TacticalGisViewProps {
  nodes: Record<'node_01' | 'node_02', FainNode>;
  selectedNodeId: 'node_01' | 'node_02';
  onSelectNode: (nodeId: 'node_01' | 'node_02') => void;
  threatAlerts: ThreatAlert[];
  onAcknowledgeAlert: (alertId: string) => void;
}

export const TacticalGisView: React.FC<TacticalGisViewProps> = ({
  nodes,
  selectedNodeId,
  onSelectNode,
  threatAlerts,
  onAcknowledgeAlert,
}) => {
  const activePendingAlert = threatAlerts.find(a => a.status === 'PENDING') || null;

  return (
    <div className="space-y-4">
      {/* Top Map + Sector Details (7 cols map, 5 cols alerts/summary) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: GIS Map */}
        <div className="lg:col-span-7">
          <ForestMap
            nodes={nodes}
            selectedNodeId={selectedNodeId}
            onSelectNode={onSelectNode}
            activeAlert={activePendingAlert}
          />
        </div>

        {/* Right: Ranger Patrol HUD & Quick Stats */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#0c1812] border border-[#1e402b] rounded-xl p-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#1e402b]">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                  Mobile Ranger Patrol 04 Status
                </h4>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold bg-amber-950 text-amber-300 border border-amber-700/60">
                ACTIVE PATROL
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono text-slate-200">
              <div className="flex justify-between border-b border-[#173322] pb-1">
                <span className="text-slate-300 font-medium">Unit Station:</span>
                <span className="text-white">Yeoor Outpost (Thane Division)</span>
              </div>
              <div className="flex justify-between border-b border-[#173322] pb-1">
                <span className="text-slate-300 font-medium">Response Protocol:</span>
                <span className="text-cyan-300 font-bold">Fast2SMS DLT Priority-1</span>
              </div>
              <div className="flex justify-between border-b border-[#173322] pb-1">
                <span className="text-slate-300 font-medium">Node 01 Distance:</span>
                <span className="text-white">~1.2 km (4x4 Trail Accessible)</span>
              </div>
              <div className="flex justify-between border-b border-[#173322] pb-1">
                <span className="text-slate-300 font-medium">Node 02 Distance:</span>
                <span className="text-white">~1.8 km (Canopy Ridge Walk)</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-300 font-medium">Unacknowledged Incidents:</span>
                <span className={`font-bold ${threatAlerts.filter(a => a.status === 'PENDING').length > 0 ? 'text-red-400 animate-pulse' : 'text-emerald-300'}`}>
                  {threatAlerts.filter(a => a.status === 'PENDING').length}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#0c1812] border border-[#1e402b] rounded-xl p-4 shadow-xl text-xs font-mono">
            <div className="flex items-center gap-2 mb-2 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <h5 className="font-bold text-white">Automated Dispatch Protocol</h5>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              When edge inference confidence exceeds 85% for Chainsaw, Gunshot, or Mining Blast, the gateway triggers an immediate Fast2SMS message to mobile patrol units with precise GPS coordinates.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Section: Threat Alert Table */}
      <ThreatAlertTable
        alerts={threatAlerts}
        onAcknowledge={onAcknowledgeAlert}
        onSelectCoordinates={(lat, lng) => {
          if (lat === nodes.node_01.lat || lng === nodes.node_01.lng) {
            onSelectNode('node_01');
          } else if (lat === nodes.node_02.lat || lng === nodes.node_02.lng) {
            onSelectNode('node_02');
          }
        }}
      />
    </div>
  );
};
