import React, { useState } from "react";
import { Shield, ShieldAlert, Activity, Bell, Radio, Zap } from "lucide-react";
import { api } from "../services/api";

interface NavbarProps {
  onQuickSimulate?: () => void;
  activeTab: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onQuickSimulate }) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleQuickAttack = async () => {
    setIsSimulating(true);
    try {
      const scenarios = ["recon_scan", "ssh_bruteforce", "sqli_injection", "canary_exfil", "vpn_cloaked_probe"];
      const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
      await api.simulateAttack(randomScenario, undefined, true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <header className="h-16 border-b border-cyber-border bg-[#0b1329]/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 border border-blue-400/30">
            <Shield className="w-6 h-6 text-white animate-pulse-slow" />
          </div>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold tracking-wider bg-gradient-to-r from-blue-400 via-cyan-300 to-white bg-clip-text text-transparent">
              CYBERSHIELD
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-900/60 text-blue-300 border border-blue-500/30 uppercase font-mono">
              AI SOC v2.0
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Autonomous Attack Prediction & Adaptive Deception Mesh
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* System Health Status */}
        <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>DECEPTION MESH ARMED & ONLINE</span>
        </div>

        {/* Quick Simulated Attack Button */}
        <button
          onClick={handleQuickAttack}
          disabled={isSimulating}
          className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs font-semibold shadow-md shadow-red-900/20 transition-all border border-red-400/30 disabled:opacity-50"
          title="Inject random live cyber attack into the AI deception pipeline"
        >
          <Zap className={`w-3.5 h-3.5 ${isSimulating ? "animate-spin" : ""}`} />
          <span>{isSimulating ? "Injecting Attack..." : "Simulate Live Attack"}</span>
        </button>

        {/* Audio Alert Toggle */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`p-2 rounded-lg border transition-colors ${
            soundEnabled 
              ? "bg-blue-950/40 border-blue-500/30 text-cyan-400" 
              : "bg-slate-900 border-slate-700 text-slate-500"
          }`}
          title={soundEnabled ? "Audio Alerts Active" : "Audio Alerts Muted"}
        >
          <Bell className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
