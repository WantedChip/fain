export type PacketType = 0x01 | 0x02; // 0x01 = ALERT, 0x02 = ECO

export type ThreatClassId = 1 | 2 | 3 | 4 | 5;
export type EcoClassId = 6 | 7;
export type SoundClassId = ThreatClassId | EcoClassId;

export interface SoundClassMeta {
  id: SoundClassId;
  name: string;
  category: 'threat' | 'ecological' | 'baseline';
  packetType: PacketType;
  severity?: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  color: string;
  badgeBg: string;
  defaultConfidenceRange: [number, number];
  description: string;
  iconName: string;
}

export interface FainNode {
  id: 'node_01' | 'node_02';
  name: string;
  sector: string;
  hardware: string;
  coreRadio: string;
  lat: number;
  lng: number;
  batteryVolts: number;
  batteryPercent: number;
  solarMw: number;
  solarMa: number;
  solarVolts: number;
  tempC: number;
  status: 'ONLINE' | 'TRANSMITTING' | 'STANDBY';
  lastSeen: Date;
  packetsSent: number;
  per: number; // packet error rate %
  rssiAvg: number;
  snrAvg: number;
}

export interface ByteDefinition {
  offset: number;
  length: number;
  field: string;
  hex: string;
  binary: string;
  decoded: string;
  description: string;
  color: string;
}

export interface FainPacket {
  id: string;
  type: PacketType;
  typeName: 'ALERT' | 'ECO';
  nodeId: 'node_01' | 'node_02';
  classId: SoundClassId;
  className: string;
  category: 'threat' | 'ecological' | 'baseline';
  confidence: number; // e.g. 94.8%
  timestamp: number;
  timestampFormatted: string;
  rawHex: string;
  rawBytes: number[];
  byteBreakdown: ByteDefinition[];
  lengthBytes: number;
  crc8: number;
  crcValid: boolean;
  // RF Telemetry
  rssi: number; // -102 to -114 dBm
  snr: number; // +6.5 to +9.2 dB
  frequencyMhz: number; // 865.0625
  channel: number;
  spreadingFactor: string; // SF9
  bandwidthKhz: number; // 125
  // Extra fields
  lat?: number;
  lng?: number;
  birdPercent?: number;
  ambientPercent?: number;
  windowNumber?: number;
}

export type PipelineStage = 
  | 'idle'
  | 'inference'
  | 'lora_tx'
  | 'gateway_rx'
  | 'chirpstack_decode'
  | 'backend_ingest'
  | 'alert_dispatch'
  | 'complete';

export interface StageInfo {
  id: PipelineStage;
  label: string;
  nodeName: string;
  hardware: string;
  protocol: string;
  latencyMs: number;
  details: string;
}

export interface ThreatAlert {
  id: string;
  packetId: string;
  nodeId: 'node_01' | 'node_02';
  className: string;
  category: 'threat';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  confidence: number;
  lat: number;
  lng: number;
  timestamp: Date;
  timestampFormatted: string;
  status: 'PENDING' | 'DISPATCHED' | 'ACKNOWLEDGED';
  fast2smsId?: string;
  distanceEstM: number;
}

export interface GatewayLog {
  id: string;
  timestamp: string;
  level: 'INFO' | 'LORA' | 'MQTT' | 'WARN' | 'ALERT';
  source: 'SX1276' | 'CHIRPSTACK' | 'NODE_BACKEND' | 'FAST2SMS';
  message: string;
  hexDump?: string;
  topic?: string;
  jsonPayload?: string;
}

export interface Fast2SmsNotification {
  visible: boolean;
  alertId: string;
  threatName: string;
  nodeId: string;
  lat: number;
  lng: number;
  confidence: number;
  messageId: string;
  phone: string;
  sentAt: string;
  status: string;
}

export interface ForestHealthMetrics {
  fhi: number; // 0 - 100
  trend: number; // delta
  ndsi: number; // Normalized Difference Soundscape Index -1.0 to +1.0
  bioticAcousticLevel: number; // dB
  anthroAcousticLevel: number; // dB
  lastUpdated: string;
}
