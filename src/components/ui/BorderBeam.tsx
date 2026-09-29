import React from 'react';

interface BorderBeamProps {
  duration?: number;
  size?: number;
  colorFrom?: string;
  colorTo?: string;
  active?: boolean;
}

export const BorderBeam: React.FC<BorderBeamProps> = ({
  duration = 5,
  size = 180,
  colorFrom = '#10b981',
  colorTo = '#06b6d4',
  active = true,
}) => {
  if (!active) return null;

  return (
    <div
      style={
        {
          '--size': `${size}px`,
          '--duration': `${duration}s`,
          '--color-from': colorFrom,
          '--color-to': colorTo,
        } as React.CSSProperties
      }
      className="pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]"
    >
      <div
        className="absolute aspect-square w-[var(--size)] [animation:border-beam_var(--duration)_linear_infinite] [background:radial-gradient(ellipse_at_center,var(--color-from),var(--color-to),transparent_70%)] [offset-anchor:calc(var(--size)/2)_calc(var(--size)/2)] [offset-path:rect(0_auto_auto_0_round_calc(var(--size)/2))]"
      />
    </div>
  );
};
