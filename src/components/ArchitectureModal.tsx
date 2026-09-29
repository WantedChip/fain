import React from 'react';
import { 
  X, 
  Cpu, 
  Radio, 
  Zap, 
  Layers 
} from 'lucide-react';


interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0c1812] border-2 border-emerald-500/60 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-[#0c1812]/95 backdrop-blur-md px-6 py-4 border-b border-[#1e402b] flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-mono">
                FAIN — Technical Architecture & ECE Engineering Specifications
              </h3>
              <p className="text-xs text-slate-300 font-mono">
                ECE Major Project Progress Seminar II • Sanjay Gandhi National Park Deployment
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#08150e] border border-[#1e402b] text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 font-mono text-xs text-slate-200">
          {/* Section 1: End-to-End System Pipeline */}
          <div className="bg-[#08150e] p-4 rounded-xl border border-[#1e402b]">
            <h4 className="text-sm font-bold text-emerald-300 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              1. End-to-End Hardware & Software Topology
            </h4>
            <p className="text-slate-300 mb-3 leading-relaxed">
              The Forest Acoustic Intelligence Network (FAIN) is an autonomous, solar-powered edge-AI bioacoustic sensor network designed to counter illegal deforestation, poaching, and forest fires in remote wildlife reserves without cellular dependence.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 text-[11px]">
              <div className="p-2.5 rounded bg-[#0e2015] border border-[#1e402b]">
                <span className="text-emerald-300 font-bold block mb-1">01. EDGE SENSOR</span>
                <p className="text-slate-200 font-medium">ESP32-S3 Dual Xtensa LX7 (240MHz)</p>
                <p className="text-slate-400 mt-1">INMP441 I2S MEMS Mic, Waveshare Core1262 LoRa, CN3791 MPPT Solar</p>
              </div>
              <div className="p-2.5 rounded bg-[#0e2015] border border-[#1e402b]">
                <span className="text-cyan-300 font-bold block mb-1">02. LORAWAN GATEWAY</span>
                <p className="text-slate-200 font-medium">Raspberry Pi 4 Model B (4GB)</p>
                <p className="text-slate-400 mt-1">SX1276 LoRa HAT via SPI, Mosquitto MQTT broker, ChirpStack Bridge</p>
              </div>
              <div className="p-2.5 rounded bg-[#0e2015] border border-[#1e402b]">
                <span className="text-amber-300 font-bold block mb-1">03. CHIRPSTACK ENGINE</span>
                <p className="text-slate-200 font-medium">ChirpStack v4 + Node.js Ingest</p>
                <p className="text-slate-400 mt-1">Frame MIC verification, ADR rate control, Redis session cache</p>
              </div>
              <div className="p-2.5 rounded bg-[#0e2015] border border-[#1e402b]">
                <span className="text-red-400 font-bold block mb-1">04. RANGER DISPATCH</span>
                <p className="text-slate-200 font-medium">Fast2SMS DLT + WebSocket UI</p>
                <p className="text-slate-400 mt-1">Automated Priority-1 GSM SMS dispatch, GIS map, Forest Health Index</p>
              </div>
            </div>
          </div>

          {/* Section 2: RF Protocol & IN865 Frequency Plan */}
          <div className="bg-[#08150e] p-4 rounded-xl border border-[#1e402b]">
            <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400" />
              2. LoRa Physical Layer & India IN865 Regulatory Compliance
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between border-b border-[#173322] pb-1">
                  <span className="text-slate-300">Frequency Band:</span>
                  <span className="text-white font-bold">865.000 – 867.000 MHz (IN865 WPC)</span>
                </div>
                <div className="flex justify-between border-b border-[#173322] pb-1">
                  <span className="text-slate-300">Default Channel 0:</span>
                  <span className="text-emerald-300 font-bold">865.0625 MHz</span>
                </div>
                <div className="flex justify-between border-b border-[#173322] pb-1">
                  <span className="text-slate-300">Spreading Factor:</span>
                  <span className="text-white font-bold">SF9 (Chirp Spread Spectrum)</span>
                </div>
                <div className="flex justify-between border-b border-[#173322] pb-1">
                  <span className="text-slate-300">Bandwidth:</span>
                  <span className="text-white font-bold">125 kHz</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between border-b border-[#173322] pb-1">
                  <span className="text-slate-300">Coding Rate (CR):</span>
                  <span className="text-white font-bold">4/5 Forward Error Correction</span>
                </div>
                <div className="flex justify-between border-b border-[#173322] pb-1">
                  <span className="text-slate-300">TX Output Power:</span>
                  <span className="text-amber-300 font-bold">+22 dBm (158 mW EIRP compliant)</span>
                </div>
                <div className="flex justify-between border-b border-[#173322] pb-1">
                  <span className="text-slate-300">Receiver Sensitivity:</span>
                  <span className="text-teal-300 font-bold">-131 dBm @ SF9/125kHz</span>
                </div>
                <div className="flex justify-between border-b border-[#173322] pb-1">
                  <span className="text-slate-300">Calculated Airtime:</span>
                  <span className="text-cyan-300 font-bold">148.5 ms (16-byte ALERT payload)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Edge TinyML Quantized CNN */}
          <div className="bg-[#08150e] p-4 rounded-xl border border-[#1e402b]">
            <h4 className="text-sm font-bold text-teal-300 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-teal-400" />
              3. Edge Impulse Quantized INT8 Acoustic Neural Network
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px]">
              <div className="bg-[#0e2015] p-3 rounded-lg border border-[#1e402b]">
                <span className="text-slate-300 block mb-1">Audio Front-End</span>
                <p className="text-white font-bold">16 kHz, 16-bit Mono I2S</p>
                <p className="text-slate-400 mt-1">
                  1000ms rolling window, 64-band Log-Mel Spectrogram extraction, 32ms frame size.
                </p>
              </div>
              <div className="bg-[#0e2015] p-3 rounded-lg border border-[#1e402b]">
                <span className="text-slate-300 block mb-1">Model Architecture</span>
                <p className="text-white font-bold">MobileNetV1 (α=0.25, INT8)</p>
                <p className="text-slate-400 mt-1">
                  Depthwise separable convolutions, Flash footprint: 142 KB, Peak RAM: 49.2 KB.
                </p>
              </div>
              <div className="bg-[#0e2015] p-3 rounded-lg border border-[#1e402b]">
                <span className="text-slate-300 block mb-1">ESP32-S3 Vectorization</span>
                <p className="text-white font-bold">Inference: 42 ms</p>
                <p className="text-slate-400 mt-1">
                  Accelerated via ESP-NN Xtensa instruction set (PIE - Processor Instruction Extension).
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Power Budget & Solar MPPT Harvesting */}
          <div className="bg-[#08150e] p-4 rounded-xl border border-[#1e402b]">
            <h4 className="text-sm font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              4. Power Budget & Perpetual Solar Energy Harvesting
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <p className="text-slate-200 font-bold">Operational Current Profile:</p>
                <ul className="space-y-1 text-slate-300">
                  <li>• Deep Sleep State: <span className="text-emerald-300 font-bold">15 µA</span> (RTC timer wake)</li>
                  <li>• MEMS Mic & Audio DMA Buffer: <span className="text-cyan-300 font-bold">12.5 mA</span></li>
                  <li>• Edge CNN Active Inference (42ms): <span className="text-amber-300 font-bold">48 mA</span></li>
                  <li>• LoRa Packet TX (+22 dBm, 148ms): <span className="text-red-400 font-bold">110 mA</span></li>
                </ul>
              </div>
              <div className="space-y-1.5">
                <p className="text-slate-200 font-bold">Harvesting & Autonomy:</p>
                <ul className="space-y-1 text-slate-300">
                  <li>• Solar Panel: 5V 2W Monocrystalline (~140 mW canopy average)</li>
                  <li>• MPPT Charger IC: CN3791 / TP4056 with thermal foldback</li>
                  <li>• Storage: 3.7V 3000 mAh LiFePO4 (2000+ cycle life)</li>
                  <li>• Run Time Without Sunlight: <span className="text-emerald-300 font-bold">18.5 Days</span> continuous</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-[#0c1812]/95 backdrop-blur-md px-6 py-3 border-t border-[#1e402b] flex items-center justify-between z-10">
          <span className="text-slate-400 font-mono text-[11px]">
            Department of Electronics & Communication Engineering • Major Project
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs font-mono transition-colors shadow-lg shadow-emerald-950/60"
          >
            CLOSE SPEC SHEET
          </button>
        </div>
      </div>
    </div>
  );
};
