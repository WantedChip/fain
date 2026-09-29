import React from 'react';
import { NodeHealthCards } from '../RangerDashboard/NodeHealthCards';
import { GatewayConsole } from '../GatewayConsole';
import type { FainNode, GatewayLog } from '../../types/fain';

interface GatewayTerminalViewProps {
  nodes: Record<'node_01' | 'node_02', FainNode>;
  selectedNodeId: 'node_01' | 'node_02';
  onSelectNode: (nodeId: 'node_01' | 'node_02') => void;
  logs: GatewayLog[];
  onClearLogs: () => void;
}

export const GatewayTerminalView: React.FC<GatewayTerminalViewProps> = ({
  nodes,
  selectedNodeId,
  onSelectNode,
  logs,
  onClearLogs,
}) => {
  return (
    <div className="space-y-4">
      {/* 1. Edge Node Hardware Health Status Cards */}
      <div>
        <div className="flex items-center justify-between pb-1.5 mb-2.5 border-b border-[#1e402b]">
          <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
            Edge Node Hardware & Power Harvesting Telemetry
          </h4>
          <span className="text-[10px] text-slate-400 font-mono font-medium">
            Waveshare Core1262 LoRa (SX1262) + CN3791 MPPT Solar
          </span>
        </div>
        <NodeHealthCards
          nodes={nodes}
          selectedNodeId={selectedNodeId}
          onSelectNode={onSelectNode}
        />
      </div>

      {/* 2. Full Gateway Hardware Capture & ChirpStack Console */}
      <GatewayConsole
        logs={logs}
        onClearLogs={onClearLogs}
      />
    </div>
  );
};
