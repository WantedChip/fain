import React from 'react';

export const AuroraBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full bg-[#040806] overflow-x-hidden text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Canopy Ambient Lighting Atmosphere */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-35">
        <div className="absolute -top-[25%] left-[15%] h-[600px] w-[600px] rounded-full bg-emerald-600/12 blur-[140px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[30%] -right-[10%] h-[650px] w-[650px] rounded-full bg-cyan-600/10 blur-[150px] animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute -bottom-[20%] left-[25%] h-[550px] w-[550px] rounded-full bg-teal-600/10 blur-[130px]" />
        
        {/* Subtle Engineering Grid Mesh */}
        <div 
          className="absolute inset-0 opacity-[0.02]" 
          style={{
            backgroundImage: 'linear-gradient(to right, #10b981 1px, transparent 1px), linear-gradient(to bottom, #10b981 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>
      <div className="relative z-10 flex flex-col min-h-screen">{children}</div>
    </div>
  );
};
