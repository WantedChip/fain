import React, { useEffect, useRef } from 'react';

interface AcousticWaveformProps {
  isActive: boolean;
  threatDetected: boolean;
  className?: string;
  label?: string;
  soundName?: string;
}

export const AcousticWaveform: React.FC<AcousticWaveformProps> = ({
  isActive,
  threatDetected,
  className = '',
  label = 'LIVE INMP441 I2S MEMS AUDIO STREAM (16 kHz / 16-BIT PCM)',
  soundName,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let phase = 0;

    const barsCount = 54;
    // Spring physics states for each bar
    const heights = new Array(barsCount).fill(4);
    const targets = new Array(barsCount).fill(4);

    const render = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const spacing = 3;
      const barWidth = (width - (barsCount - 1) * spacing) / barsCount;

      // Update target heights based on acoustic mode
      for (let i = 0; i < barsCount; i++) {
        const normX = i / barsCount;

        if (!isActive) {
          // Gentle resting forest canopy ripple (ambient breeze)
          const wave = Math.sin(phase * 0.8 + normX * 6.28) * 0.5 + 0.5;
          const micro = Math.sin(phase * 1.4 + normX * 12.56) * 0.25;
          targets[i] = 4 + (wave + micro) * 8;
        } else if (threatDetected) {
          // Warm harmonic signature for mechanical/ballistic audio (Chainsaw / Gunshot)
          // Low-frequency combustion engine fundamental (normX 0.1 to 0.4) + upper blade harmonics
          const engineRumble = Math.exp(-Math.pow((normX - 0.25) / 0.18, 2)) * (height * 0.72);
          const harmonicChop = Math.sin(normX * 18 + phase * 1.5) * 6;
          const slowFluctuation = Math.sin(phase * 0.9) * 4;
          targets[i] = Math.max(5, engineRumble + harmonicChop + slowFluctuation);
        } else {
          // Avian bioacoustic chorus (peaks in higher frequency range 2.5 - 7.5 kHz, normX 0.45 to 0.85)
          const birdWhistle = Math.exp(-Math.pow((normX - 0.65) / 0.2, 2)) * (height * 0.65);
          const trill = Math.sin(normX * 24 + phase * 2.0) * 5;
          targets[i] = Math.max(4, birdWhistle + trill + Math.sin(phase) * 3);
        }

        // Smooth physics-based spring interpolation (inertia)
        const springFactor = threatDetected ? 0.18 : 0.12;
        heights[i] += (targets[i] - heights[i]) * springFactor;

        // Render rounded vertical bar
        const barHeight = Math.max(3, Math.min(height - 2, heights[i]));
        const x = i * (barWidth + spacing);
        const y = height - barHeight;

        // Eye-friendly, soothing gradients
        const gradient = ctx.createLinearGradient(0, y, 0, height);
        if (threatDetected) {
          // Muted warm amber / soft coral terracotta (ZERO eye strain)
          gradient.addColorStop(0, '#fbbf24'); // warm amber
          gradient.addColorStop(0.5, '#f59e0b'); // golden amber
          gradient.addColorStop(1, '#92400e'); // soft deep copper
        } else if (isActive) {
          // Vibrant bioacoustic teal / emerald
          gradient.addColorStop(0, '#38bdf8'); // sky cyan
          gradient.addColorStop(0.6, '#34d399'); // emerald mint
          gradient.addColorStop(1, '#064e3b'); // deep forest
        } else {
          // Resting calm canopy forest green
          gradient.addColorStop(0, '#10b981'); // emerald
          gradient.addColorStop(1, '#022c22'); // dark baseline
        }

        ctx.fillStyle = gradient;
        // Rounded bar cap for modern UI polish
        const radius = Math.min(barWidth / 2, 2);
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + barWidth - radius, y);
        ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + radius);
        ctx.lineTo(x + barWidth, height);
        ctx.lineTo(x, height);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();
      }

      // Calm, smooth oscillation (phase increment of 0.05 instead of rapid 0.28 strobe)
      phase += isActive ? (threatDetected ? 0.06 : 0.05) : 0.025;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [isActive, threatDetected]);

  return (
    <div className={`relative overflow-hidden rounded-xl bg-[#0c1812] p-3.5 border border-[#1e402b] backdrop-blur-md shadow-inner ${className}`}>
      <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-300 mb-2 gap-2">
        <div className="flex items-center gap-2">
          {/* Calm, smooth status indicator (no rapid ping/strobe) */}
          <span className="relative flex h-2 w-2">
            <span className={`relative inline-flex rounded-full h-2 w-2 ${
              threatDetected ? 'bg-amber-400' : isActive ? 'bg-emerald-400' : 'bg-slate-500'
            }`} />
          </span>
          <span className="text-white font-medium">{label}</span>
        </div>

        <div className="flex items-center gap-2">
          {soundName && (
            <span className="px-2 py-0.5 rounded bg-[#08150e] border border-[#1e402b] text-slate-300 text-[10px]">
              Signature: <strong className="text-white">{soundName}</strong>
            </span>
          )}
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
            threatDetected 
              ? 'text-amber-300 bg-amber-950/80 border border-amber-700/60' 
              : isActive 
                ? 'text-emerald-300 bg-emerald-950/80 border border-emerald-700/60' 
                : 'text-slate-300 bg-[#08150e] border border-[#1e402b]'
          }`}>
            {threatDetected 
              ? 'ACOUSTIC ANOMALY DETECTED' 
              : isActive 
                ? 'ACTIVE BIOACOUSTIC INFERENCE' 
                : 'RESTING CANOPY AMBIENT (16 kHz)'}
          </span>
        </div>
      </div>

      <canvas ref={canvasRef} width={680} height={42} className="w-full h-10 block" />
    </div>
  );
};
