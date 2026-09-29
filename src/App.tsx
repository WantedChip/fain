import { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Fast2SmsModal } from './components/Fast2SmsModal';
import { ArchitectureModal } from './components/ArchitectureModal';

import { AuroraBackground } from './components/ui/AuroraBackground';
import { AnimatedTabs, type TabItem } from './components/ui/AnimatedTabs';

import { LivePipelineView } from './components/views/LivePipelineView';
import { AcousticIntelligenceView } from './components/views/AcousticIntelligenceView';
import { TacticalGisView } from './components/views/TacticalGisView';
import { GatewayTerminalView } from './components/views/GatewayTerminalView';
import { ExecutiveBentoView } from './components/views/ExecutiveBentoView';

import { 
  Activity, 
  Radio, 
  MapPin, 
  Terminal, 
  LayoutGrid,
  BookOpen,
  Binary
} from 'lucide-react';

import type { 
  FainNode, 
  FainPacket, 
  PipelineStage, 
  ThreatAlert, 
  GatewayLog, 
  Fast2SmsNotification, 
  ForestHealthMetrics,
  SoundClassId 
} from './types/fain';

import { 
  INITIAL_NODES, 
  INITIAL_FHI, 
  INITIAL_GATEWAY_LOGS 
} from './utils/sampleData';

import { 
  SOUND_CLASSES, 
  buildAlertPacket, 
  buildEcoPacket, 
  getRandomConfidence 
} from './utils/packetEncoder';

import { soundEngine } from './utils/audioSynthesizer';

const NAVIGATION_TABS: TabItem[] = [
  { id: 'bento', label: 'Executive Bento', icon: LayoutGrid },
  { id: 'pipeline', label: 'Live Pipeline', icon: Activity },
  { id: 'acoustic', label: 'Acoustic Intel', icon: Radio },
  { id: 'gis', label: 'Tactical GIS', icon: MapPin },
  { id: 'terminal', label: 'Gateway & HW', icon: Terminal },
];

export function App() {
  const [activeTab, setActiveTab] = useState<string>('bento');
  const [viewMode, setViewMode] = useState<'story' | 'engineering'>('story');

  // Nodes state
  const [nodes, setNodes] = useState<Record<'node_01' | 'node_02', FainNode>>(INITIAL_NODES);
  const [selectedNodeId, setSelectedNodeId] = useState<'node_01' | 'node_02'>('node_01');

  // Active packet & pipeline stages
  const [activePacket, setActivePacket] = useState<FainPacket | null>(null);
  const [currentStage, setCurrentStage] = useState<PipelineStage>('idle');
  const [stageProgress, setStageProgress] = useState<number>(0);
  const [isTransmitting, setIsTransmitting] = useState<boolean>(false);
  const [isDemoRunning, setIsDemoRunning] = useState<boolean>(false);

  // Packet history & Threat Alerts
  const [recentPackets, setRecentPackets] = useState<FainPacket[]>([]);
  const [threatAlerts, setThreatAlerts] = useState<ThreatAlert[]>([]);
  
  // Fast2SMS banner modal state
  const [fast2sms, setFast2Sms] = useState<Fast2SmsNotification | null>(null);

  // Console Logs
  const [logs, setLogs] = useState<GatewayLog[]>(INITIAL_GATEWAY_LOGS);

  // Forest Health Index (FHI) Metrics
  const [fhiMetrics, setFhiMetrics] = useState<ForestHealthMetrics>(INITIAL_FHI);

  // Architecture Spec Modal
  const [isArchOpen, setIsArchOpen] = useState<boolean>(false);

  const timerRefs = useRef<number[]>([]);

  const addTimer = (cb: () => void, delay: number) => {
    const id = window.setTimeout(cb, delay);
    timerRefs.current.push(id);
    return id;
  };

  const clearAllTimers = () => {
    timerRefs.current.forEach((id) => clearTimeout(id));
    timerRefs.current = [];
  };

  useEffect(() => {
    return () => clearAllTimers();
  }, []);

  // Central Packet Transmission & Multi-Stage Hop Animation Engine
  const transmitPacket = (packet: FainPacket, onComplete?: () => void) => {
    setIsTransmitting(true);
    setActivePacket(packet);
    setRecentPackets((prev) => [packet, ...prev.slice(0, 9)]);

    setNodes((prev) => {
      const targetNode = prev[packet.nodeId];
      return {
        ...prev,
        [packet.nodeId]: {
          ...targetNode,
          status: 'TRANSMITTING',
          packetsSent: targetNode.packetsSent + 1,
          lastSeen: new Date(),
          batteryPercent: Math.max(10, targetNode.batteryPercent - 0.05),
          batteryVolts: +(targetNode.batteryVolts - 0.001).toFixed(3),
        },
      };
    });

    const timeStr = new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST';

    // Stage 1: Edge Inference
    setCurrentStage('inference');
    setStageProgress(20);
    soundEngine.playInferenceTick();

    setLogs((prev) => [
      ...prev,
      {
        id: `log_inf_${Date.now()}`,
        timestamp: timeStr,
        level: packet.typeName === 'ALERT' ? 'ALERT' : 'INFO',
        source: 'SX1276',
        message: `[Edge S3 INT8] Acoustic classification: ${packet.className} (${packet.confidence}% conf) in 42ms. Packaging ${packet.typeName} frame (${packet.lengthBytes}B).`,
      },
    ]);

    // Stage 2: LoRa TX (Airtime ~148ms)
    addTimer(() => {
      setCurrentStage('lora_tx');
      setStageProgress(45);
      soundEngine.playLoraChirp();

      setLogs((prev) => [
        ...prev,
        {
          id: `log_tx_${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
          level: 'LORA',
          source: 'SX1276',
          message: `[Core1262 LoRa TX] Preamble 8 symb sent on 865.0625 MHz (CH0 IN865). Spreading Factor SF9, BW 125kHz, +22dBm. Airtime: 148.5ms.`,
          hexDump: packet.rawHex,
        },
      ]);
    }, 450);

    // Stage 3: Gateway RX (SX1276 Demodulation)
    addTimer(() => {
      setCurrentStage('gateway_rx');
      setStageProgress(65);
      soundEngine.playGatewayAck();

      setLogs((prev) => [
        ...prev,
        {
          id: `log_rx_${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
          level: 'LORA',
          source: 'SX1276',
          message: `[SX1276 SPI Capture] Received valid frame (${packet.lengthBytes} bytes) from ${packet.nodeId}. RSSI: ${packet.rssi} dBm, SNR: +${packet.snr} dB. CRC-8 Verified (0x${packet.crc8.toString(16).padStart(2, '0').toUpperCase()}).`,
        },
      ]);
    }, 950);

    // Stage 4: ChirpStack LoRaWAN Decode
    addTimer(() => {
      setCurrentStage('chirpstack_decode');
      setStageProgress(80);

      const mqttTopic = `application/fain/device/${packet.nodeId}/event/up`;
      const compactJson = JSON.stringify({
        packet_type: packet.typeName,
        node: packet.nodeId,
        class: packet.className,
        confidence: packet.confidence,
        rssi: packet.rssi,
        snr: packet.snr,
        crc_ok: true,
      });

      setLogs((prev) => [
        ...prev,
        {
          id: `log_chirp_${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
          level: 'MQTT',
          source: 'CHIRPSTACK',
          topic: mqttTopic,
          message: `[ChirpStack v4 Gateway Bridge] Unpacked binary payload. Published JSON event to Mosquitto broker on topic "${mqttTopic}".`,
          jsonPayload: compactJson,
        },
      ]);
    }, 1450);

    // Stage 5: Backend Ingest & Rule Processing
    addTimer(() => {
      setCurrentStage('backend_ingest');
      setStageProgress(95);

      setLogs((prev) => [
        ...prev,
        {
          id: `log_ingest_${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
          level: 'INFO',
          source: 'NODE_BACKEND',
          message: `[FAIN Node.js Engine] Geo-indexed event to Yeoor Hills sector. Rule matched: ${
            packet.typeName === 'ALERT' ? 'CRITICAL_THREAT_TRIGGERED' : 'ECOLOGICAL_METRICS_LOGGED'
          }. Broadcasting via WebSocket to Ranger Operations Console.`,
        },
      ]);
    }, 1900);

    // Stage 6: Alert / Eco Action & Finalization
    addTimer(() => {
      setCurrentStage('alert_dispatch');
      setStageProgress(100);

      setNodes((prev) => ({
        ...prev,
        [packet.nodeId]: {
          ...prev[packet.nodeId],
          status: 'ONLINE',
        },
      }));

      if (packet.typeName === 'ALERT') {
        soundEngine.playThreatAlarm();

        const alertId = `alt_${Date.now()}`;
        const newAlert: ThreatAlert = {
          id: alertId,
          packetId: packet.id,
          nodeId: packet.nodeId,
          className: packet.className,
          category: 'threat',
          severity: SOUND_CLASSES[packet.classId]?.severity || 'HIGH',
          confidence: packet.confidence,
          lat: packet.lat || 19.2183,
          lng: packet.lng || 72.9781,
          timestamp: new Date(),
          timestampFormatted: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
          status: 'PENDING',
          fast2smsId: `F2S-${Math.floor(10000000 + Math.random() * 90000000)}`,
          distanceEstM: 110 + Math.floor(Math.random() * 80),
        };

        setThreatAlerts((prev) => [newAlert, ...prev]);

        // Pop up Fast2SMS banner
        setFast2Sms({
          visible: true,
          alertId,
          threatName: packet.className,
          nodeId: packet.nodeId,
          lat: newAlert.lat,
          lng: newAlert.lng,
          confidence: packet.confidence,
          messageId: newAlert.fast2smsId!,
          phone: '+91 98200 48219 (RFO Thane)',
          sentAt: newAlert.timestampFormatted,
          status: 'Delivered',
        });

        setLogs((prev) => [
          ...prev,
          {
            id: `log_sms_${Date.now()}`,
            timestamp: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
            level: 'ALERT',
            source: 'FAST2SMS',
            message: `[Fast2SMS DLT Gateway] Emergency Priority-1 SMS dispatched to Range Forest Officer (+91 98200 XXXXX). Message ID: ${newAlert.fast2smsId}. Status: HTTP 200 OK.`,
          },
        ]);

        // Recalculate FHI
        setFhiMetrics((prev) => {
          const drop = packet.className === 'Chainsaw' ? 14.2 : 11.5;
          const newFhi = Math.max(12, +(prev.fhi - drop).toFixed(1));
          return {
            fhi: newFhi,
            trend: -drop,
            ndsi: +(prev.ndsi - 0.28).toFixed(2),
            bioticAcousticLevel: +(prev.bioticAcousticLevel - 2.1).toFixed(1),
            anthroAcousticLevel: +(prev.anthroAcousticLevel + 22.4).toFixed(1),
            lastUpdated: 'Just now',
          };
        });
      } else {
        // ECO / Biophony packet
        soundEngine.playEcoChime();

        setFhiMetrics((prev) => {
          const boost = packet.classId === 6 ? 4.8 : 1.2;
          const newFhi = Math.min(96.5, +(prev.fhi + boost).toFixed(1));
          return {
            fhi: newFhi,
            trend: +boost,
            ndsi: Math.min(0.85, +(prev.ndsi + 0.12).toFixed(2)),
            bioticAcousticLevel: +(prev.bioticAcousticLevel + 3.2).toFixed(1),
            anthroAcousticLevel: Math.max(8.0, +(prev.anthroAcousticLevel - 4.5).toFixed(1)),
            lastUpdated: 'Just now',
          };
        });
      }

      addTimer(() => {
        setCurrentStage('complete');
        setIsTransmitting(false);
        if (onComplete) onComplete();
      }, 350);
    }, 2350);
  };

  const handleTriggerEvent = (classId: SoundClassId, customConfidence?: number) => {
    if (isTransmitting) return;

    const classMeta = SOUND_CLASSES[classId];
    const node = nodes[selectedNodeId];
    const conf = customConfidence !== undefined 
      ? customConfidence 
      : getRandomConfidence(classMeta.defaultConfidenceRange);

    let packet: FainPacket;

    if (classMeta.packetType === 0x01) {
      packet = buildAlertPacket(
        selectedNodeId,
        classId,
        node.lat,
        node.lng,
        conf
      );
    } else {
      const birdPct = classId === 6 ? conf : Math.floor(conf * 0.35);
      const ambientPct = classId === 7 ? conf : 100 - birdPct;
      packet = buildEcoPacket(
        selectedNodeId,
        classId,
        birdPct,
        ambientPct,
        Math.floor(Math.random() * 255)
      );
    }

    transmitPacket(packet);
  };

  const handleRunDemo = () => {
    if (isDemoRunning || isTransmitting) return;
    setIsDemoRunning(true);
    setSelectedNodeId('node_01');

    const chainsawPacket = buildAlertPacket(
      'node_01',
      1,
      nodes.node_01.lat,
      nodes.node_01.lng,
      94.8
    );

    transmitPacket(chainsawPacket, () => {
      addTimer(() => {
        setSelectedNodeId('node_02');

        const birdPacket = buildEcoPacket(
          'node_02',
          6,
          88.0,
          12.0,
          43
        );

        transmitPacket(birdPacket, () => {
          setIsDemoRunning(false);
        });
      }, 3000);
    });
  };

  const handleResetSimulation = () => {
    clearAllTimers();
    setNodes(INITIAL_NODES);
    setSelectedNodeId('node_01');
    setActivePacket(null);
    setCurrentStage('idle');
    setStageProgress(0);
    setIsTransmitting(false);
    setIsDemoRunning(false);
    setThreatAlerts([]);
    setFast2Sms(null);
    setLogs(INITIAL_GATEWAY_LOGS);
    setFhiMetrics(INITIAL_FHI);
    soundEngine.playInferenceTick();
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    setThreatAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'ACKNOWLEDGED' } : a))
    );
    if (fast2sms?.alertId === alertId) {
      setFast2Sms((prev) => prev ? { ...prev, visible: false } : null);
    }
  };

  const activeThreatCount = threatAlerts.filter((a) => a.status === 'PENDING').length;

  return (
    <AuroraBackground>
      {/* 1. Header & Quick Controls */}
      <Header
        onRunDemo={handleRunDemo}
        onReset={handleResetSimulation}
        isDemoRunning={isDemoRunning}
        onOpenArchitecture={() => setIsArchOpen(true)}
        activeThreatCount={activeThreatCount}
      />

      {/* 2. Tactical Navigation Bar (Sliding Frosted Tabs + High-Contrast Mode Switcher) */}
      <div className="max-w-[1800px] w-full mx-auto px-4 pt-3 flex flex-wrap items-center justify-between gap-3">
        <AnimatedTabs
          tabs={NAVIGATION_TABS.map((tab) =>
            tab.id === 'gis' ? { ...tab, badge: activeThreatCount } : tab
          )}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
        />

        <div className="flex items-center gap-3">
          {/* Global Mode Switcher: High-contrast pill toggle */}
          <div className="flex items-center bg-[#0d1c14] p-1 rounded-xl border border-emerald-700/60 shadow-lg font-mono text-xs">
            <button
              onClick={() => setViewMode('story')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'story'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Simple Mode</span>
            </button>
            <button
              onClick={() => setViewMode('engineering')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'engineering'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Binary className="w-3.5 h-3.5" />
              <span>Deep Specs</span>
            </button>
          </div>

          <div className="text-[11px] font-mono text-emerald-300 hidden xl:flex items-center gap-2 bg-[#0d1c14] px-3.5 py-2 rounded-xl border border-emerald-700/60 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-semibold">GW-SGNP-THANE-01 • MESH ACTIVE</span>
          </div>
        </div>
      </div>

      {/* 3. Main Dedicated Viewport */}
      <main className="max-w-[1800px] w-full mx-auto p-4 flex-1">
        {activeTab === 'bento' && (
          <ExecutiveBentoView
            currentStage={currentStage}
            activePacket={activePacket}
            stageProgress={stageProgress}
            selectedNodeId={selectedNodeId}
            onSelectNode={setSelectedNodeId}
            nodes={nodes}
            onTriggerEvent={handleTriggerEvent}
            isTransmitting={isTransmitting}
            fhiMetrics={fhiMetrics}
            threatAlerts={threatAlerts}
            onAcknowledgeAlert={handleAcknowledgeAlert}
            viewMode={viewMode}
            onToggleViewMode={setViewMode}
          />
        )}

        {activeTab === 'pipeline' && (
          <LivePipelineView
            currentStage={currentStage}
            activePacket={activePacket}
            stageProgress={stageProgress}
            selectedNodeId={selectedNodeId}
            onSelectNode={setSelectedNodeId}
            nodes={nodes}
            onTriggerEvent={handleTriggerEvent}
            isTransmitting={isTransmitting}
            viewMode={viewMode}
            onToggleViewMode={setViewMode}
          />
        )}

        {activeTab === 'acoustic' && (
          <AcousticIntelligenceView
            fhiMetrics={fhiMetrics}
            recentPackets={recentPackets}
            activePacket={activePacket}
          />
        )}

        {activeTab === 'gis' && (
          <TacticalGisView
            nodes={nodes}
            selectedNodeId={selectedNodeId}
            onSelectNode={setSelectedNodeId}
            threatAlerts={threatAlerts}
            onAcknowledgeAlert={handleAcknowledgeAlert}
          />
        )}

        {activeTab === 'terminal' && (
          <GatewayTerminalView
            nodes={nodes}
            selectedNodeId={selectedNodeId}
            onSelectNode={setSelectedNodeId}
            logs={logs}
            onClearLogs={() => setLogs([])}
          />
        )}
      </main>

      {/* Fast2SMS Indian DLT Emergency Alert Popup */}
      <Fast2SmsModal
        notification={fast2sms}
        onClose={() => setFast2Sms((prev) => prev ? { ...prev, visible: false } : null)}
        onAcknowledge={handleAcknowledgeAlert}
      />

      {/* Technical Architecture Modal */}
      <ArchitectureModal
        isOpen={isArchOpen}
        onClose={() => setIsArchOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-emerald-950/80 bg-[#040806] px-5 py-3 text-center text-xs font-mono text-slate-500 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-emerald-400 font-bold">FAIN Digital Twin</span>
          <span>•</span>
          <span>ECE Major Project Progress Seminar II</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <span>ESP32-S3 TinyML (INT8 CNN)</span>
          <span>•</span>
          <span>Waveshare Core1262 LoRa IN865</span>
          <span>•</span>
          <span>ChirpStack v4</span>
          <span>•</span>
          <span>Fast2SMS DLT Gateway</span>
        </div>
      </footer>
    </AuroraBackground>
  );
}
export default App;
