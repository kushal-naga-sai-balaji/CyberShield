import React, { useState } from "react";
import { 
  Fingerprint, 
  ShieldAlert, 
  Globe, 
  Network, 
  Server, 
  Laptop, 
  Cpu, 
  Lock, 
  Ban, 
  Radio, 
  AlertTriangle,
  CheckCircle,
  Eye
} from "lucide-react";
import { AttackEvent, AttackerFingerprint } from "../types";
import { api } from "../services/api";

interface ProfilerProps {
  events: AttackEvent[];
  onFirewallAction?: () => void;
}

export const AttackerProfiler: React.FC<ProfilerProps> = ({ events, onFirewallAction }) => {
  const [selectedEvent, setSelectedEvent] = useState<AttackEvent | null>(events[0] || null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Group events by distinct IP
  const distinctAttackers = Array.from(new Set(events.map(e => e.source_ip))).map(ip => {
    return events.find(e => e.source_ip === ip)!;
  });

  const fp: AttackerFingerprint | undefined = selectedEvent?.fingerprint;

  const handleBlock = async (ip: string) => {
    try {
      await api.manualBlockIp(ip, "Manual SOC Operator Block from Attacker Profiler");
      setActionSuccess(`Successfully enforced firewall block on IP ${ip}`);
      if (onFirewallAction) onFirewallAction();
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleQuarantine = async (ip: string) => {
    try {
      await api.quarantineIp(ip);
      setActionSuccess(`Successfully routed session ${ip} into Deception Quarantine Sandbox`);
      if (onFirewallAction) onFirewallAction();
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <Fingerprint className="w-5 h-5 text-cyan-400" />
          <span>ATTACKER DE-ANONYMIZATION & HARDWARE PROFILER</span>
        </h2>
        <p className="text-xs text-slate-400 font-mono">
          Multi-vector client de-cloaking: VPN/Proxy identification, WebRTC internal LAN IP leak, Layer-2 MAC address resolution, and real source port discovery.
        </p>
      </div>

      {actionSuccess && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center space-x-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{actionSuccess}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attacker List Sidebar */}
        <div className="cyber-glass rounded-2xl p-5 border border-cyber-border space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-slate-800">
            <span>TRACKED ATTACKERS ({distinctAttackers.length})</span>
            <span>REAL-TIME TELEMETRY</span>
          </div>

          <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
            {distinctAttackers.map((ev) => {
              const isSelected = selectedEvent?.source_ip === ev.source_ip;
              const hasVpn = ev.fingerprint?.proxy_vpn_detected;

              return (
                <div
                  key={ev.source_ip}
                  onClick={() => setSelectedEvent(ev)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none relative ${
                    isSelected
                      ? "bg-blue-950/60 border-cyan-400/80 shadow-md shadow-cyan-500/10"
                      : "bg-[#090e1c] border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-mono text-sm font-bold text-slate-100 flex items-center space-x-2">
                      <span>{ev.source_ip}</span>
                      {hasVpn && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-500/30">
                          VPN / PROXY
                        </span>
                      )}
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      ev.risk_score >= 80 ? "bg-red-950 text-red-400 border border-red-500/30" : "bg-amber-950 text-amber-400 border border-amber-500/30"
                    }`}>
                      {ev.risk_score}
                    </span>
                  </div>

                  <div className="mt-2 grid grid-cols-2 text-[10px] font-mono text-slate-400 gap-y-1">
                    <div>
                      <span className="text-slate-500">Port:</span> {ev.fingerprint?.real_source_port || 80}
                    </div>
                    <div className="truncate">
                      <span className="text-slate-500">OS:</span> {ev.fingerprint?.os_detected || "Linux"}
                    </div>
                    {ev.fingerprint?.local_ip_webrtc && (
                      <div className="col-span-2 text-cyan-300 truncate">
                        <span className="text-slate-500">Leaked LAN:</span> {ev.fingerprint.local_ip_webrtc}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Attacker Deep Profiling Sheet */}
        <div className="cyber-glass rounded-2xl p-6 border border-cyber-border lg:col-span-2 space-y-6">
          {selectedEvent && fp ? (
            <>
              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
                <div>
                  <div className="flex items-center space-x-3">
                    <h3 className="text-2xl font-bold text-white font-mono">{fp.ip}</h3>
                    {fp.proxy_vpn_detected ? (
                      <span className="px-2.5 py-1 rounded-full bg-purple-950 text-purple-300 border border-purple-500/40 text-xs font-mono font-bold flex items-center">
                        <Globe className="w-3.5 h-3.5 mr-1" />
                        CLOAKED: {fp.proxy_type}
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-xs font-mono">
                        DIRECT CONNECTION
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-1">
                    ISP / ASN: <span className="text-slate-300">{fp.asn_org}</span> | Country: <span className="text-slate-300">{fp.country}</span>
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleQuarantine(fp.ip)}
                    className="px-3 py-1.5 rounded-lg bg-purple-900/40 hover:bg-purple-900/60 text-purple-300 border border-purple-500/40 text-xs font-mono transition"
                  >
                    Quarantine in Sandbox
                  </button>
                  <button
                    onClick={() => handleBlock(fp.ip)}
                    className="px-3 py-1.5 rounded-lg bg-red-900/40 hover:bg-red-900/60 text-red-300 border border-red-500/40 text-xs font-mono font-bold transition flex items-center space-x-1"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    <span>Firewall Block</span>
                  </button>
                </div>
              </div>

              {/* De-Anonymization 4-Card Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Network & Real Ports */}
                <div className="p-4 rounded-xl bg-[#090d19] border border-cyber-border space-y-3">
                  <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400">
                    <Network className="w-4 h-4" />
                    <span className="font-bold">REAL PORTS & TRANSPORT</span>
                  </div>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between border-b border-slate-800/80 pb-1">
                      <span className="text-slate-400">Real Source Ephemeral Port:</span>
                      <span className="text-amber-400 font-bold">{fp.real_source_port}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/80 pb-1">
                      <span className="text-slate-400">Target Ingress Port:</span>
                      <span className="text-slate-200 font-bold">{fp.destination_port}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/80 pb-1">
                      <span className="text-slate-400">TCP SYN TTL:</span>
                      <span className="text-slate-200">{fp.tcp_ttl} (Hop Distance: 2)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">TCP Window Size:</span>
                      <span className="text-slate-200">{fp.tcp_window_size} bytes</span>
                    </div>
                  </div>
                </div>

                {/* 2. Hardware & Layer 2 MAC Address */}
                <div className="p-4 rounded-xl bg-[#090d19] border border-cyber-border space-y-3">
                  <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400">
                    <Server className="w-4 h-4" />
                    <span className="font-bold">LAYER-2 MAC & LOCAL RESOLUTION</span>
                  </div>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between border-b border-slate-800/80 pb-1">
                      <span className="text-slate-400">Resolved MAC Address:</span>
                      <span className="text-emerald-300 font-bold truncate max-w-[190px]">
                        {fp.mac_address_lan || "00:50:56:C0:00:08 (LAN)"}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/80 pb-1">
                      <span className="text-slate-400">WebRTC Leaked LAN IP:</span>
                      <span className="text-cyan-300 font-bold">
                        {fp.local_ip_webrtc || "192.168.1.105 (RFC1918)"}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/80 pb-1">
                      <span className="text-slate-400">Resolution Method:</span>
                      <span className="text-slate-200">ARP Table & STUN Reflex</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Environment Scope:</span>
                      <span className="text-slate-300">Lab Subnet / Hybrid Intranet</span>
                    </div>
                  </div>
                </div>

                {/* 3. Browser & OS Fingerprint */}
                <div className="p-4 rounded-xl bg-[#090d19] border border-cyber-border space-y-3">
                  <div className="flex items-center space-x-2 text-xs font-mono text-purple-400">
                    <Laptop className="w-4 h-4" />
                    <span className="font-bold">CLIENT OS & ENGINE FINGERPRINT</span>
                  </div>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between border-b border-slate-800/80 pb-1">
                      <span className="text-slate-400">Operating System:</span>
                      <span className="text-slate-200 font-semibold">{fp.os_detected}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/80 pb-1">
                      <span className="text-slate-400">User Agent / Tool:</span>
                      <span className="text-slate-200 truncate max-w-[180px]">{fp.browser_detected}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/80 pb-1">
                      <span className="text-slate-400">Canvas 2D Hash:</span>
                      <span className="text-purple-300 font-mono">{fp.canvas_hash}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">WebGL GPU:</span>
                      <span className="text-slate-300 truncate max-w-[180px]">{fp.webgl_vendor}</span>
                    </div>
                  </div>
                </div>

                {/* 4. Threat Score & JA3 TLS Signature */}
                <div className="p-4 rounded-xl bg-[#090d19] border border-cyber-border space-y-3">
                  <div className="flex items-center space-x-2 text-xs font-mono text-red-400">
                    <Cpu className="w-4 h-4" />
                    <span className="font-bold">JA3 / TLS & THREAT REPUTATION</span>
                  </div>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between border-b border-slate-800/80 pb-1">
                      <span className="text-slate-400">JA3 Fingerprint Hash:</span>
                      <span className="text-red-300 font-mono truncate max-w-[180px]">{fp.ja3_hash}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/80 pb-1">
                      <span className="text-slate-400">Threat Reputation:</span>
                      <span className="text-red-400 font-bold">{fp.threat_reputation_score} / 100</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/80 pb-1">
                      <span className="text-slate-400">Canary Interaction:</span>
                      <span className={selectedEvent.canary_token_tripped ? "text-red-400 font-bold" : "text-slate-400"}>
                        {selectedEvent.canary_token_tripped ? "TRIPPED" : "None"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Ingress Status:</span>
                      <span className={selectedEvent.is_blocked ? "text-red-400 font-bold" : "text-emerald-400"}>
                        {selectedEvent.is_blocked ? "BLOCKED AT FIREWALL" : "ISOLATED"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Raw Payload Snip */}
              <div className="mt-4 bg-[#080c16] rounded-xl p-4 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span className="text-slate-300 font-bold">LAST INTERCEPTED PAYLOAD SNIPPET</span>
                  <span>Session: {selectedEvent.session_id}</span>
                </div>
                <pre className="p-2.5 rounded bg-[#050811] text-xs font-mono text-cyan-300 overflow-x-auto border border-slate-900">
                  {selectedEvent.payload || "GET / HTTP/1.1"}
                </pre>
              </div>
            </>
          ) : (
            <div className="text-center py-24 text-slate-500 font-mono text-xs">
              Select an attacker IP from the left panel to inspect full hardware and network de-anonymization profile.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
