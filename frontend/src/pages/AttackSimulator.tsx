import React, { useState } from "react";
import { 
  Terminal, 
  Play, 
  ShieldAlert, 
  Sparkles, 
  Zap, 
  Globe, 
  CheckCircle, 
  Activity, 
  Ban, 
  Key, 
  Database,
  Radio,
  Cpu
} from "lucide-react";
import { api } from "../services/api";
import confetti from "canvas-confetti";

interface SimulatorProps {
  onAttackTriggered?: () => void;
}

export const AttackSimulator: React.FC<SimulatorProps> = ({ onAttackTriggered }) => {
  const [selectedScenario, setSelectedScenario] = useState("sqli_injection");
  const [customIp, setCustomIp] = useState("185.220.101.5");
  const [useVpn, setUseVpn] = useState(true);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<any>(null);

  const scenarios = [
    {
      id: "recon_scan",
      name: "Reconnaissance & Vulnerability Scan",
      icon: Radio,
      desc: "Nmap & Nikto probing paths, actuator endpoints, and headers.",
      defaultIp: "45.133.1.88",
      defaultVpn: false,
      color: "border-cyan-500/40 text-cyan-400"
    },
    {
      id: "ssh_bruteforce",
      name: "Automated SSH Credential Stuffing",
      icon: Key,
      desc: "Hydra dictionary password guessing targeting decoy SSH Port 2222.",
      defaultIp: "194.26.29.112",
      defaultVpn: true,
      color: "border-amber-500/40 text-amber-400"
    },
    {
      id: "sqli_injection",
      name: "SQL Injection & Database Probe",
      icon: Database,
      desc: "SQLMap UNION SELECT injection attempting to leak customer database.",
      defaultIp: "185.220.101.5",
      defaultVpn: true,
      color: "border-red-500/40 text-red-400"
    },
    {
      id: "canary_exfil",
      name: "Canary Token Tripwire Exfiltration",
      icon: Sparkles,
      desc: "Downloading .env and querying with leaked canary JWT tokens.",
      defaultIp: "198.51.100.42",
      defaultVpn: false,
      color: "border-purple-500/40 text-purple-400"
    },
    {
      id: "vpn_cloaked_probe",
      name: "VPN-Cloaked Multi-Vector Probe",
      icon: Globe,
      desc: "Attacker hidden behind VPN; tests WebRTC LAN IP leak & port tracking.",
      defaultIp: "185.220.102.19",
      defaultVpn: true,
      color: "border-blue-500/40 text-blue-400"
    },
    {
      id: "privilege_escalation",
      name: "Kernel Privilege Escalation",
      icon: Zap,
      desc: "LinPEAS SUID exploit attempt routed into kernel sandbox container.",
      defaultIp: "192.168.1.188",
      defaultVpn: false,
      color: "border-rose-500/40 text-rose-400"
    },
  ];

  const handleSelectScenario = (sc: any) => {
    setSelectedScenario(sc.id);
    setCustomIp(sc.defaultIp);
    setUseVpn(sc.defaultVpn);
  };

  const handleLaunchAttack = async () => {
    setIsExecuting(true);
    setExecutionResult(null);

    try {
      const res = await api.simulateAttack(selectedScenario, customIp, useVpn);
      setExecutionResult(res);

      if (res.summary.is_blocked) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ["#ef4444", "#3b82f6", "#06b6d4"]
        });
      }

      if (onAttackTriggered) onAttackTriggered();
    } catch (e) {
      console.error(e);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <Terminal className="w-5 h-5 text-amber-400" />
          <span>CYBER ATTACK SIMULATION LABORATORY</span>
        </h2>
        <p className="text-xs text-slate-400 font-mono">
          Launch realistic cyber attacks to validate the Predict → Deceive → Observe → Learn → Defend autonomous pipeline.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scenario Selector & Config */}
        <div className="cyber-glass rounded-2xl p-6 border border-cyber-border space-y-5">
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 pb-2 border-b border-slate-800">
            <Zap className="w-4 h-4" />
            <span>SELECT ATTACK VECTOR SCENARIO</span>
          </div>

          <div className="space-y-2.5">
            {scenarios.map((sc) => {
              const Icon = sc.icon;
              const isSelected = selectedScenario === sc.id;

              return (
                <div
                  key={sc.id}
                  onClick={() => handleSelectScenario(sc)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                    isSelected
                      ? "bg-blue-950/70 border-cyan-400 shadow-md shadow-cyan-500/10"
                      : "bg-[#090e1c] border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-black/40 border ${sc.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-200">{sc.name}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">{sc.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Config options */}
          <div className="pt-3 border-t border-slate-800 space-y-3 text-xs font-mono">
            <div>
              <label className="text-slate-400 block mb-1">Simulated Attacker Source IP</label>
              <input
                type="text"
                value={customIp}
                onChange={(e) => setCustomIp(e.target.value)}
                className="w-full bg-[#080d1a] border border-slate-700 rounded-lg p-2 text-slate-200 outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                id="vpnToggle"
                checked={useVpn}
                onChange={(e) => setUseVpn(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0 w-4 h-4 cursor-pointer"
              />
              <label htmlFor="vpnToggle" className="text-slate-300 cursor-pointer">
                Cloak through VPN / Proxy / Tor Gateway
              </label>
            </div>
          </div>

          <button
            onClick={handleLaunchAttack}
            disabled={isExecuting}
            className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-gradient-to-r from-red-600 via-amber-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-red-500/20 border border-red-400/40 transition disabled:opacity-50"
          >
            <Play className={`w-4 h-4 ${isExecuting ? "animate-spin" : ""}`} />
            <span>{isExecuting ? "Executing Attack & Deception..." : "LAUNCH CYBER ATTACK"}</span>
          </button>
        </div>

        {/* Live Execution Pipeline Console */}
        <div className="cyber-glass rounded-2xl p-6 border border-cyber-border lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono text-slate-400">
              <span className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>CYBERSHIELD DEFENSE TELEMETRY STREAM</span>
              </span>
              <span>Inference Engine: Online</span>
            </div>

            {executionResult ? (
              <div className="mt-5 space-y-4 font-mono text-xs">
                {/* 1. Step Summary Card */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-[#090d18] border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase">Classified Vector</span>
                    <div className="text-cyan-300 font-bold mt-1">{executionResult.summary.scenario}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#090d18] border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase">Risk Score</span>
                    <div className="text-red-400 font-bold mt-1">{executionResult.summary.risk_score} / 100</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#090d18] border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase">Defense Action</span>
                    <div className="text-emerald-300 font-bold mt-1">{executionResult.summary.defense_action}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#090d18] border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase">Firewall Status</span>
                    <div className={`font-bold mt-1 ${executionResult.summary.is_blocked ? "text-red-400" : "text-amber-400"}`}>
                      {executionResult.summary.is_blocked ? "🚨 AUTO-BLOCKED" : "ISOLATED"}
                    </div>
                  </div>
                </div>

                {/* 2. De-Anonymization Breakdown */}
                <div className="p-4 rounded-xl bg-[#080c16] border border-cyan-500/30 space-y-2">
                  <div className="flex items-center space-x-2 text-cyan-300 font-bold">
                    <Cpu className="w-4 h-4" />
                    <span>DE-ANONYMIZATION & NETWORK ATTRIBUTION</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-slate-300 pt-1">
                    <div>Real Source Ephemeral Port: <span className="text-amber-400 font-bold">{executionResult.summary.real_source_port}</span></div>
                    <div>Resolved Layer-2 MAC: <span className="text-emerald-400 font-bold">{executionResult.summary.resolved_mac}</span></div>
                    <div>Cloaking Status: <span className="text-purple-300 font-bold">{executionResult.summary.proxy_type}</span></div>
                    <div>Leaked Internal LAN IP: <span className="text-cyan-300 font-bold">{executionResult.summary.webrtc_local_ip || "Direct Subnet"}</span></div>
                  </div>
                </div>

                {/* 3. Adaptive Deception Response */}
                <div className="p-4 rounded-xl bg-[#080c16] border border-amber-500/30 space-y-2">
                  <div className="flex items-center space-x-2 text-amber-300 font-bold">
                    <Sparkles className="w-4 h-4" />
                    <span>ADAPTIVE DECEPTION PAYLOAD FED TO ATTACKER</span>
                  </div>
                  <pre className="p-2.5 rounded-lg bg-[#050811] text-[10px] text-emerald-400/90 overflow-x-auto border border-slate-900">
                    {JSON.stringify(executionResult.deception_response, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="text-center py-24 text-slate-500 font-mono text-xs space-y-2">
                <Terminal className="w-8 h-8 text-slate-600 mx-auto" />
                <p>Select an attack scenario from the left panel and click &ldquo;LAUNCH CYBER ATTACK&rdquo;.</p>
                <p className="text-slate-600 text-[10px]">The AI engine will predict moves, feed deception decoys, de-cloak hardware, and auto-block.</p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800 text-[10px] font-mono text-slate-500 flex justify-between">
            <span>CyberShield Sandbox Environment: Armed</span>
            <span>Zero impact on host OS</span>
          </div>
        </div>
      </div>
    </div>
  );
};
