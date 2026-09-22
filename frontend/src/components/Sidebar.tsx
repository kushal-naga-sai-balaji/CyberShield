import React from "react";
import { 
  LayoutDashboard, 
  Globe,
  GitFork, 
  Sparkles, 
  Fingerprint, 
  ShieldCheck, 
  FileText, 
  Terminal,
  Presentation,
  Cpu
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  blockedCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, blockedCount }) => {
  const menuItems = [
    { id: "dashboard", label: "SOC Live Dashboard", icon: LayoutDashboard },
    { id: "presentation", label: "Presentation Slides", icon: Presentation, badge: "10 Slides" },
    { id: "threat-map", label: "GPS Threat Map", icon: Globe, badge: "Live GPS" },
    { id: "attack-path", label: "Attack Path Graph", icon: GitFork, badge: "AI Visualizer" },
    { id: "honeypots", label: "Adaptive Honeypots", icon: Sparkles },
    { id: "profiler", label: "Attacker De-Anonymizer", icon: Fingerprint },
    { id: "firewall", label: "Automated Defense", icon: ShieldCheck, count: blockedCount },
    { id: "forensics", label: "Forensics & MITRE", icon: FileText },
    { id: "simulator", label: "Cyber Attack Lab", icon: Terminal, highlight: true },
  ];

  return (
    <aside className="w-64 bg-[#090e1c] border-r border-cyber-border min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4 select-none">
      <div className="space-y-1.5">
        <div className="px-3 py-2 text-[11px] font-mono font-semibold tracking-wider text-slate-500 uppercase">
          Tactical Operations
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-gradient-to-r from-blue-600/30 to-cyan-500/20 text-cyan-300 border border-blue-500/40 shadow-sm shadow-blue-500/10"
                  : item.highlight
                  ? "text-amber-300 hover:bg-amber-950/30 hover:text-amber-200 border border-amber-500/20"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? "text-cyan-400" : item.highlight ? "text-amber-400" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30 font-mono font-bold">
                  {item.badge}
                </span>
              )}
              {item.count !== undefined && item.count > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-950 text-red-400 border border-red-500/40 font-mono font-bold">
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="p-3.5 rounded-xl bg-[#0e162c]/80 border border-cyber-border space-y-2">
        <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400">
          <Cpu className="w-3.5 h-3.5" />
          <span>AI Threat Model</span>
        </div>
        <div className="text-[11px] text-slate-400 leading-relaxed font-sans">
          Markov Sequence Predictor & GPS Geolocation Active.
        </div>
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800">
          <span>GPS Resolution:</span>
          <span className="text-emerald-400">Exact Coordinates</span>
        </div>
      </div>
    </aside>
  );
};
