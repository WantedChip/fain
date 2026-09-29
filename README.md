# FAIN — Forest Acoustic Intelligence Network Simulation
### ECE Major Project — Progress Seminar II Demo


A client-side digital twin and simulation web application for the **Forest Acoustic Intelligence Network (FAIN)**, an autonomous edge-AI bioacoustic sensor network designed to counter illegal deforestation, poaching, and wildfire threats in remote wildlife reserves (deployed buffer: Sanjay Gandhi National Park / Yeoor Hills).

Everything runs **100% client-side** in React state with zero external hardware, LoRa gateways, or MQTT brokers required.

---

## 🚀 Quick Start

From the `fain-digital-twin` directory:

```bash
# 1. Install dependencies
npm install

# 2. Run the Vite development server
npm run dev

# 3. Open in your browser (default port: 5173)
http://localhost:5173/
```

To create an optimized production build:
```bash
npm run build
npm run preview
```

---

## 🌲 Design & Theme System
- **Deep Forest Slates**: `#070d0a` / `#0b130f`
- **Data Accents**: Emerald (`#10b981`), Cyan (`#06b6d4`)
- **Warning & Threat**: Amber (`#f59e0b`), Crimson (`#ef4444`)
- **Typography**: `JetBrains Mono` for binary hex bytes & telemetry, `Inter` for clean engineering UI
- **Projector Optimization**: High-contrast, dense telemetry layout designed for 1080p and 4K seminar projectors

---

## 🛰️ Architecture & Packet Specification

### 1. Multi-Stage Pipeline Hop Progression
```
[Sensor Nodes: ESP32-S3 + Core1262]
        │  (LoRa IN865 @ 865.0625 MHz, SF9, BW 125kHz, +22 dBm)
        ▼
[Gateway: Raspberry Pi 4 + SX1276 HAT]
        │  (SPI Packet Capture, CRC-8 Verification, RSSI/SNR Demodulation)
        ▼
[ChirpStack v4 & Node.js Engine]
        │  (MQTT Broker tcp://localhost:1883, Topic: application/fain/device/node_0X/event/up)
        ▼
[Ranger Dashboard & Fast2SMS DLT Gateway]
        │  (WebSocket Live Stream, Priority-1 SMS Dispatch to RFO Thane Patrol)
```

### 2. Physical Layer Packet Framing
#### Type `0x01` — ALERT Packet (16 Bytes Fixed Frame)
| Offset | Field | Format | Decoded Representation |
|:---|:---|:---|:---|
| Byte 0 | Packet Type | `uint8` | `0x01` (ALERT / Threat) |
| Byte 1 | Node ID | `uint8` | `0x01` (Node 01) or `0x02` (Node 02) |
| Bytes 2–5 | Latitude | `Float32` (IEEE 754) | GPS Latitude (e.g., `19.21830° N`) |
| Bytes 6–9 | Longitude | `Float32` (IEEE 754) | GPS Longitude (e.g., `72.97810° E`) |
| Byte 10 | Class ID | `uint8` | `0x01` Chainsaw, `0x02` Gunshot, `0x03` Heavy Machinery, `0x04` Mining Blast, `0x05` Fire Crackle |
| Byte 11 | Confidence | `uint8` | Softmax probability (0–100%) |
| Bytes 12–14 | Timestamp | `uint24` | Compact Epoch offset |
| Byte 15 | Checksum | `CRC-8` | Dallas/Maxim polynomial `0x07` |

#### Type `0x02` — ECO Packet (10 Bytes Fixed Frame)
| Offset | Field | Format | Decoded Representation |
|:---|:---|:---|:---|
| Byte 0 | Packet Type | `uint8` | `0x02` (ECO / Biophony) |
| Byte 1 | Node ID | `uint8` | `0x01` or `0x02` |
| Byte 2 | Bird Presence | `uint8` | Bird vocalization percentage (0–100%) |
| Byte 3 | Ambient Presence | `uint8` | Baseline soundscape percentage (0–100%) |
| Bytes 4–7 | Timestamp | `uint32` | Standard 32-bit POSIX timestamp |
| Byte 8 | Window N | `uint8` | Rolling 60-second observation index |
| Byte 9 | Checksum | `CRC-8` | Dallas/Maxim polynomial `0x07` |

---

## 🎮 Interactive Simulation Features

1. **"RUN DEMO" (Automated Presentation Mode)**:
   - Node 01 triggers a **Chainsaw Threat (94.8% confidence)**.
   - Signal hops through the 6 stages in real-time.
   - **Fast2SMS Emergency Dispatch Banner** pops up (`TX-FAST2S` / `VK-FAININ`).
   - 3-second presentation pause.
   - Node 02 transmits a **Bird Chorus ECO packet (88% biophony)**.
   - FHI gauge recovers and logs live MQTT telemetry.

2. **Event Simulator**:
   - Node Selector: **Node 01** (19.2183°, 72.9781°) & **Node 02** (19.2241°, 72.9835°).
   - 7 Class Triggers: Chainsaw, Gunshot, Heavy Machinery, Mining Blast, Fire Crackle, Bird Chorus, Ambient.
   - Realistic bounded confidence vs manual slider mode.
   - Frequency Channel & Spreading Factor selector.

3. **Packet Inspector**:
   - Interactive byte chips with **hover/click byte-by-byte inspection** (IEEE 754 float decoding, bit binary view, field semantics).
   - **Decoded JSON View** with one-click clipboard copy.

4. **Ranger Field Dashboard**:
   - **Node Health Cards**: Battery voltage (LiFePO4), solar MPPT harvesting (mW/mA), internal temperature, and packet error rate (PER).
   - **Forest Health Index (FHI) Gauge**: Radial SVG meter (0–100 scale) computing Normalized Difference Soundscape Index (NDSI) from biophony vs anthrophony dB SPL.
   - **Acoustic Spectrogram**: Real-time 16-band FFT frequency visualizer (50 Hz – 8 kHz) and transmission timeline.
   - **Tactical GIS Coverage Map**: Vector map of Sanjay Gandhi National Park / Yeoor Hills with base station gateway, coverage radii, and threat ripples.

5. **Audio Feedback Synthesizer**:
   - Web Audio API real-time synthesis: edge inference tick, LoRa CSS upchirp sweep, gateway ACK, threat siren chime, and eco chord (with Mute toggle).

6. **Architecture & ECE Specification Sheet**:
   - Click **"SPEC / ARCH"** in the top navigation bar to access the full technical reference covering IN865 compliance, MobileNetV1 INT8 quantization, power budget, and MPPT solar harvesting.
