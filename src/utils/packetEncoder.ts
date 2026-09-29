import { calculateCrc8, byteToHex, byteToBinary } from './crc8';
import type { FainPacket, ByteDefinition, SoundClassId, SoundClassMeta } from '../types/fain';

export const SOUND_CLASSES: Record<SoundClassId, SoundClassMeta> = {
  1: {
    id: 1,
    name: 'Chainsaw',
    category: 'threat',
    packetType: 0x01,
    severity: 'CRITICAL',
    color: '#ef4444',
    badgeBg: 'bg-red-500/20 text-red-400 border-red-500/40',
    defaultConfidenceRange: [89.2, 97.4],
    description: 'High-frequency 2-stroke combustion engine harmonics (350-450 Hz) & cutting chain noise',
    iconName: 'Axe',
  },
  2: {
    id: 2,
    name: 'Gunshot',
    category: 'threat',
    packetType: 0x01,
    severity: 'CRITICAL',
    color: '#f43f5e',
    badgeBg: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
    defaultConfidenceRange: [91.5, 98.8],
    description: 'High-amplitude acoustic shockwave followed by rapid explosive muzzle blast reverberation',
    iconName: 'Crosshair',
  },
  3: {
    id: 3,
    name: 'Heavy Machinery',
    category: 'threat',
    packetType: 0x01,
    severity: 'HIGH',
    color: '#f97316',
    badgeBg: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
    defaultConfidenceRange: [86.7, 95.2],
    description: 'Continuous low-frequency diesel engine rumble (60-180 Hz) & hydraulic actuator noise',
    iconName: 'Truck',
  },
  4: {
    id: 4,
    name: 'Mining Blast',
    category: 'threat',
    packetType: 0x01,
    severity: 'CRITICAL',
    color: '#e11d48',
    badgeBg: 'bg-red-600/20 text-red-300 border-red-600/50',
    defaultConfidenceRange: [92.0, 98.4],
    description: 'Sub-audible infrasound and ground-coupled seismic acoustic wave with rapid decay',
    iconName: 'Bomb',
  },
  5: {
    id: 5,
    name: 'Fire Crackle',
    category: 'threat',
    packetType: 0x01,
    severity: 'HIGH',
    color: '#ea580c',
    badgeBg: 'bg-amber-600/20 text-amber-300 border-amber-600/40',
    defaultConfidenceRange: [84.5, 93.6],
    description: 'Stochastic burst patterns of dry biomass snapping, moisture evaporation, and thermal rushing',
    iconName: 'Flame',
  },
  6: {
    id: 6,
    name: 'Bird Chorus',
    category: 'ecological',
    packetType: 0x02,
    color: '#10b981',
    badgeBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    defaultConfidenceRange: [81.0, 94.6],
    description: 'Rich biophony syllables in 2.5 kHz – 7.5 kHz frequency band across avian species',
    iconName: 'Bird',
  },
  7: {
    id: 7,
    name: 'Ambient',
    category: 'baseline',
    packetType: 0x02,
    color: '#06b6d4',
    badgeBg: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
    defaultConfidenceRange: [78.0, 91.0],
    description: 'Natural geophony: wind in dense canopy foliage, stream turbulence, gentle rain rustle',
    iconName: 'Wind',
  },
};

export function getRandomConfidence(range: [number, number]): number {
  const [min, max] = range;
  const val = min + Math.random() * (max - min);
  return Math.round(val * 10) / 10;
}

export function buildAlertPacket(
  nodeId: 'node_01' | 'node_02',
  classId: SoundClassId,
  lat: number,
  lng: number,
  confidencePercent: number,
  customTimestamp?: number
): FainPacket {
  const timestamp = customTimestamp || Math.floor(Date.now() / 1000);
  const nodeNum = nodeId === 'node_01' ? 0x01 : 0x02;
  const confByte = Math.min(100, Math.max(0, Math.round(confidencePercent)));
  const classMeta = SOUND_CLASSES[classId];

  const buffer = new ArrayBuffer(16);
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);

  bytes[0] = 0x01; // Type 0x01 = ALERT
  bytes[1] = nodeNum; // Node ID
  view.setFloat32(2, lat, false); // Float32 Lat
  view.setFloat32(6, lng, false); // Float32 Lng
  bytes[10] = classId; // Class ID
  bytes[11] = confByte; // Confidence uint8
  
  // Compact 24-bit Timestamp
  const ts24 = timestamp & 0xffffff;
  bytes[12] = (ts24 >> 16) & 0xff;
  bytes[13] = (ts24 >> 8) & 0xff;
  bytes[14] = ts24 & 0xff;

  // CRC-8
  const payloadForCrc = Array.from(bytes.slice(0, 15));
  const crc = calculateCrc8(payloadForCrc, 0x07);
  bytes[15] = crc;

  const rawBytes = Array.from(bytes);
  const rawHex = rawBytes.map(b => byteToHex(b)).join(' ');
  const readLat = view.getFloat32(2, false);
  const readLng = view.getFloat32(6, false);

  const byteBreakdown: ByteDefinition[] = [
    {
      offset: 0,
      length: 1,
      field: 'Packet Type',
      hex: byteToHex(bytes[0]),
      binary: byteToBinary(bytes[0]),
      decoded: '0x01 (ALERT / THREAT)',
      description: 'Defines protocol frame structure for immediate high-priority routing',
      color: '#ef4444',
    },
    {
      offset: 1,
      length: 1,
      field: 'Node ID',
      hex: byteToHex(bytes[1]),
      binary: byteToBinary(bytes[1]),
      decoded: `0x${byteToHex(bytes[1])} (${nodeId === 'node_01' ? 'Node 01' : 'Node 02'})`,
      description: `Originating edge sensor unit (${nodeId === 'node_01' ? 'ESP32-S3 Sector A' : 'ESP32-S3 Sector B'})`,
      color: '#3b82f6',
    },
    {
      offset: 2,
      length: 4,
      field: 'Latitude (Float32)',
      hex: `${byteToHex(bytes[2])} ${byteToHex(bytes[3])} ${byteToHex(bytes[4])} ${byteToHex(bytes[5])}`,
      binary: `${byteToBinary(bytes[2])} ${byteToBinary(bytes[3])}...`,
      decoded: `${readLat.toFixed(5)}° N`,
      description: 'IEEE 754 32-bit single-precision float for GPS coordinate anchoring',
      color: '#10b981',
    },
    {
      offset: 6,
      length: 4,
      field: 'Longitude (Float32)',
      hex: `${byteToHex(bytes[6])} ${byteToHex(bytes[7])} ${byteToHex(bytes[8])} ${byteToHex(bytes[9])}`,
      binary: `${byteToBinary(bytes[6])} ${byteToBinary(bytes[7])}...`,
      decoded: `${readLng.toFixed(5)}° E`,
      description: 'IEEE 754 32-bit single-precision float for GPS coordinate anchoring',
      color: '#10b981',
    },
    {
      offset: 10,
      length: 1,
      field: 'Class ID',
      hex: byteToHex(bytes[10]),
      binary: byteToBinary(bytes[10]),
      decoded: `0x${byteToHex(bytes[10])} (${classMeta.name})`,
      description: `Edge Impulse quantized CNN output class (${classMeta.description.split('.')[0]})`,
      color: classMeta.color,
    },
    {
      offset: 11,
      length: 1,
      field: 'Confidence',
      hex: byteToHex(bytes[11]),
      binary: byteToBinary(bytes[11]),
      decoded: `${confByte}% (Scaled uint8)`,
      description: 'Sigmoid / Softmax probability peak quantized to 8-bit unsigned integer',
      color: '#f59e0b',
    },
    {
      offset: 12,
      length: 3,
      field: 'Timestamp (24-bit)',
      hex: `${byteToHex(bytes[12])} ${byteToHex(bytes[13])} ${byteToHex(bytes[14])}`,
      binary: `${byteToBinary(bytes[12])} ${byteToBinary(bytes[13])}...`,
      decoded: `${new Date(timestamp * 1000).toLocaleTimeString()} (Offset ${ts24})`,
      description: 'Compact 24-bit Unix timestamp offset preserving low LoRa airtime payload footprint',
      color: '#8b5cf6',
    },
    {
      offset: 15,
      length: 1,
      field: 'CRC-8 Checksum',
      hex: byteToHex(bytes[15]),
      binary: byteToBinary(bytes[15]),
      decoded: `0x${byteToHex(bytes[15])} (VALID)`,
      description: 'Dallas/Maxim polynomial 0x07 over bytes 0-14 for RF transmission error detection',
      color: '#06b6d4',
    },
  ];

  const rssi = -102 - Math.floor(Math.random() * 13);
  const snr = +(6.5 + Math.random() * 2.7).toFixed(1);

  return {
    id: `pkt_alert_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    type: 0x01,
    typeName: 'ALERT',
    nodeId,
    classId,
    className: classMeta.name,
    category: classMeta.category,
    confidence: confidencePercent,
    timestamp,
    timestampFormatted: new Date(timestamp * 1000).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
    rawHex,
    rawBytes,
    byteBreakdown,
    lengthBytes: 16,
    crc8: crc,
    crcValid: true,
    rssi,
    snr,
    frequencyMhz: 865.0625,
    channel: 0,
    spreadingFactor: 'SF9',
    bandwidthKhz: 125,
    lat,
    lng,
  };
}

export function buildEcoPacket(
  nodeId: 'node_01' | 'node_02',
  classId: SoundClassId,
  birdPercent: number,
  ambientPercent: number,
  windowNumber: number = 42,
  customTimestamp?: number
): FainPacket {
  const timestamp = customTimestamp || Math.floor(Date.now() / 1000);
  const nodeNum = nodeId === 'node_01' ? 0x01 : 0x02;
  const birdByte = Math.min(100, Math.max(0, Math.round(birdPercent)));
  const ambientByte = Math.min(100, Math.max(0, Math.round(ambientPercent)));
  const windowByte = windowNumber & 0xff;
  const classMeta = SOUND_CLASSES[classId];

  const buffer = new ArrayBuffer(10);
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);

  bytes[0] = 0x02;
  bytes[1] = nodeNum;
  bytes[2] = birdByte;
  bytes[3] = ambientByte;
  view.setUint32(4, timestamp, false);
  bytes[8] = windowByte;

  const payloadForCrc = Array.from(bytes.slice(0, 9));
  const crc = calculateCrc8(payloadForCrc, 0x07);
  bytes[9] = crc;

  const rawBytes = Array.from(bytes);
  const rawHex = rawBytes.map(b => byteToHex(b)).join(' ');

  const byteBreakdown: ByteDefinition[] = [
    {
      offset: 0,
      length: 1,
      field: 'Packet Type',
      hex: byteToHex(bytes[0]),
      binary: byteToBinary(bytes[0]),
      decoded: '0x02 (ECO / BIOPHONY)',
      description: 'Periodic aggregated bioacoustic & geophony telemetry frame',
      color: '#10b981',
    },
    {
      offset: 1,
      length: 1,
      field: 'Node ID',
      hex: byteToHex(bytes[1]),
      binary: byteToBinary(bytes[1]),
      decoded: `0x${byteToHex(bytes[1])} (${nodeId === 'node_01' ? 'Node 01' : 'Node 02'})`,
      description: `Originating edge sensor unit (${nodeId === 'node_01' ? 'ESP32-S3 Sector A' : 'ESP32-S3 Sector B'})`,
      color: '#3b82f6',
    },
    {
      offset: 2,
      length: 1,
      field: 'Bird Presence (P%)',
      hex: byteToHex(bytes[2]),
      binary: byteToBinary(bytes[2]),
      decoded: `${birdByte}% Biophony`,
      description: 'Aggregated percentage of audio windows containing confirmed avian vocalizations',
      color: '#10b981',
    },
    {
      offset: 3,
      length: 1,
      field: 'Ambient Presence (P%)',
      hex: byteToHex(bytes[3]),
      binary: byteToBinary(bytes[3]),
      decoded: `${ambientByte}% Geophony`,
      description: 'Aggregated percentage of audio windows classified as natural baseline soundscape',
      color: '#06b6d4',
    },
    {
      offset: 4,
      length: 4,
      field: 'Unix Timestamp (uint32)',
      hex: `${byteToHex(bytes[4])} ${byteToHex(bytes[5])} ${byteToHex(bytes[6])} ${byteToHex(bytes[7])}`,
      binary: `${byteToBinary(bytes[4])} ${byteToBinary(bytes[5])}...`,
      decoded: `${new Date(timestamp * 1000).toLocaleTimeString()} (${timestamp})`,
      description: 'Standard 32-bit POSIX epoch timestamp for time-series aggregation',
      color: '#8b5cf6',
    },
    {
      offset: 8,
      length: 1,
      field: '60s Window N',
      hex: byteToHex(bytes[8]),
      binary: byteToBinary(bytes[8]),
      decoded: `Window #${windowByte}`,
      description: 'Rolling 60-second observation window sequence index (0-255 rollover)',
      color: '#f59e0b',
    },
    {
      offset: 9,
      length: 1,
      field: 'CRC-8 Checksum',
      hex: byteToHex(bytes[9]),
      binary: byteToBinary(bytes[9]),
      decoded: `0x${byteToHex(bytes[9])} (VALID)`,
      description: 'Dallas/Maxim polynomial 0x07 over bytes 0-8 for payload verification',
      color: '#06b6d4',
    },
  ];

  const rssi = -104 - Math.floor(Math.random() * 11);
  const snr = +(7.0 + Math.random() * 2.2).toFixed(1);

  return {
    id: `pkt_eco_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    type: 0x02,
    typeName: 'ECO',
    nodeId,
    classId,
    className: classMeta.name,
    category: classMeta.category,
    confidence: classId === 6 ? birdPercent : ambientPercent,
    timestamp,
    timestampFormatted: new Date(timestamp * 1000).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
    rawHex,
    rawBytes,
    byteBreakdown,
    lengthBytes: 10,
    crc8: crc,
    crcValid: true,
    rssi,
    snr,
    frequencyMhz: 865.0625,
    channel: 0,
    spreadingFactor: 'SF9',
    bandwidthKhz: 125,
    birdPercent: birdByte,
    ambientPercent: ambientByte,
    windowNumber: windowByte,
  };
}
