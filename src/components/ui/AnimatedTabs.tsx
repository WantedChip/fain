import React from 'react';
import type { LucideIcon } from 'lucide-react';

export interface TabItem {
  id: string;
  label: string;
  badge?: string | number;
  icon: LucideIcon;
}

interface AnimatedTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onSelectTab: (id: string) => void;
}

export const AnimatedTabs: React.FC<AnimatedTabsProps> = ({
  tabs,
  activeTab,
  onSelectTab,
}) => {
  return (
    <div className="relative inline-flex items-center p-1 rounded-xl bg-[#0c1812] border border-[#1e402b] backdrop-blur-xl shadow-lg">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`relative z-10 flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 select-none ${
              isActive
                ? 'text-emerald-300 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-emerald-950/40'
            }`}
          >
            {/* Sliding Pill Highlight */}
            {isActive && (
              <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-emerald-900/70 to-emerald-950/90 border border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.3)] -z-10" />
            )}
            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  typeof tab.badge === 'number' && tab.badge > 0
                    ? 'bg-amber-950 text-amber-300 border border-amber-700/60'
                    : 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
