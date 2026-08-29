import React, { useState, useEffect } from "react";
import { ShieldCheck, Ban, ShieldAlert, Plus, RefreshCw, CheckCircle, Unlock, AlertOctagon, Terminal } from "lucide-react";
import { api } from "../services/api";
import { FirewallRule } from "../types";

export const DefenseFirewall: React.FC = () => {
  const [rules, setRules] = useState<FirewallRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockIp, setBlockIp] = useState("");
  const [blockReason, setBlockReason] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const fetchRules = async () => {
    setLoading(true);
    try {
      const data = await api.getFirewallRules();
      setRules(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleUnblock = async (ip: string) => {
    try {
      await api.unblockIp(ip);
      setMessage(`Successfully lifted firewall block on ${ip}`);
      fetchRules();
      setTimeout(() => setMessage(null), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleQuarantine = async (ip: string) => {
    try {
      await api.quarantineIp(ip);
      setMessage(`Updated ${ip} status to QUARANTINED (Routed to Honeypot Sandbox)`);
      fetchRules();
      setTimeout(() => setMessage(null), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleManualBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.manualBlockIp(blockIp, blockReason || "Manual SOC Operator Defense Enforcement");
      setShowBlockModal(false);
      setBlockIp("");
      setBlockReason("");
      setMessage(`Enforced active firewall drop on ${blockIp}`);
      fetchRules();
      setTimeout(() => setMessage(null), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const activeBlockedCount = rules.filter(r => r.status === "BLOCKED").length;
  const quarantinedCount = rules.filter(r => r.status === "QUARANTINED").length;
  const totalDroppedPackets = rules.reduce((acc, r) => acc + (r.packets_dropped || 0), 0);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>AUTOMATED DEFENSE & FIREWALL QUARANTINE CONTROLLER</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Autonomous threat containment: dynamic IP blacklisting, sandbox isolation, Layer-2 MAC tracking, and real port blocking.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchRules}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setShowBlockModal(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white text-xs font-semibold shadow-lg shadow-red-500/20 border border-red-400/40 transition"
          >
            <Ban className="w-4 h-4" />
            <span>Manual IP Block</span>
          </button>
        </div>
      </div>

      {message && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{message}</span>
        </div>
      )}

      {/* Top 3 Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="cyber-glass rounded-2xl p-5 border border-red-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-mono text-slate-400">ACTIVE BLOCKED IPs</p>
              <h3 className="text-3xl font-bold text-red-400 mt-1 font-mono">{activeBlockedCount}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-950/60 border border-red-500/30 flex items-center justify-center text-red-400">
              <Ban className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 text-xs text-red-400/80 font-mono">
            Packets instantly dropped at kernel boundary
          </div>
        </div>

        <div className="cyber-glass rounded-2xl p-5 border border-purple-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-mono text-slate-400">SANDBOX QUARANTINED</p>
              <h3 className="text-3xl font-bold text-purple-300 mt-1 font-mono">{quarantinedCount}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <AlertOctagon className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 text-xs text-purple-400/80 font-mono">
            Sessions redirected to deceptive isolated honeypots
          </div>
        </div>

        <div className="cyber-glass rounded-2xl p-5 border border-blue-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-mono text-slate-400">TOTAL PACKETS INTERCEPTED</p>
              <h3 className="text-3xl font-bold text-cyan-300 mt-1 font-mono">{totalDroppedPackets}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-950/60 border border-blue-500/30 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 text-xs text-cyan-400/80 font-mono">
            Zero malicious payloads reached production core
          </div>
        </div>
      </div>

      {/* Rules Table */}
      <div className="cyber-glass rounded-2xl p-5 border border-cyber-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white font-mono">DEFENSE ENFORCEMENT & IP DROP RULES</h3>
          <span className="text-xs font-mono text-slate-500">Autonomous & Operator Policies</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="pb-3">OFFENDING IP</th>
                <th className="pb-3">DEFENSE TRIGGER REASON</th>
                <th className="pb-3">TRACKED PORTS & MAC</th>
                <th className="pb-3">RISK SCORE</th>
                <th className="pb-3">DROPPED REQUESTS</th>
                <th className="pb-3">STATUS</th>
                <th className="pb-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {rules.map((rule) => {
                const isBlocked = rule.status === "BLOCKED";
                const isQuarantined = rule.status === "QUARANTINED";

                return (
                  <tr key={rule.id} className="hover:bg-slate-900/40 transition">
                    <td className="py-3 font-bold text-slate-200">
                      <div className="flex items-center space-x-1.5">
                        <span className={`w-2 h-2 rounded-full ${isBlocked ? "bg-red-500 animate-pulse" : isQuarantined ? "bg-purple-500" : "bg-emerald-500"}`}></span>
                        <span>{rule.ip}</span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {new Date(rule.blocked_at).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="py-3 max-w-[280px]">
                      <div className="text-xs text-slate-300 truncate font-sans">{rule.reason}</div>
                    </td>
                    <td className="py-3 text-[10px] text-slate-400">
                      <div>Ports: <span className="text-amber-400">{rule.real_ports_tracked?.join(", ") || "8000"}</span></div>
                      {rule.local_lan_mac && (
                        <div className="text-emerald-400 truncate max-w-[160px]">MAC: {rule.local_lan_mac}</div>
                      )}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        rule.risk_score >= 80 ? "bg-red-950 text-red-400 border border-red-500/40" : "bg-amber-950 text-amber-400 border border-amber-500/40"
                      }`}>
                        {rule.risk_score}
                      </span>
                    </td>
                    <td className="py-3 font-bold text-cyan-300">
                      {rule.packets_dropped} dropped
                    </td>
                    <td className="py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        isBlocked ? "bg-red-950/80 text-red-300 border-red-500" :
                        isQuarantined ? "bg-purple-950/80 text-purple-300 border-purple-500" :
                        "bg-emerald-950/80 text-emerald-300 border-emerald-500"
                      }`}>
                        {rule.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {isBlocked && (
                          <button
                            onClick={() => handleQuarantine(rule.ip)}
                            className="px-2.5 py-1 rounded bg-purple-950 hover:bg-purple-900 text-purple-300 border border-purple-500/30 text-[10px] transition"
                            title="Switch to Sandbox Isolation"
                          >
                            Quarantine
                          </button>
                        )}
                        {rule.status !== "UNBLOCKED" ? (
                          <button
                            onClick={() => handleUnblock(rule.ip)}
                            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold transition"
                            title="Unblock and restore access"
                          >
                            <Unlock className="w-3 h-3" />
                            <span>Unblock</span>
                          </button>
                        ) : (
                          <span className="text-slate-600 text-[10px]">Restored</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Block Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="cyber-glass-glow max-w-md w-full rounded-2xl p-6 border border-red-500/50 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Ban className="w-4 h-4 text-red-400" />
                <span>Enforce Manual Firewall Drop Rule</span>
              </h3>
              <button
                onClick={() => setShowBlockModal(false)}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleManualBlock} className="space-y-3.5 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1">Target Attacker IP Address</label>
                <input
                  type="text"
                  value={blockIp}
                  onChange={(e) => setBlockIp(e.target.value)}
                  placeholder="e.g. 198.51.100.99"
                  className="w-full bg-[#080d1a] border border-slate-700 rounded-lg p-2 text-slate-200 focus:border-red-400 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Reason / Incident Ref</label>
                <input
                  type="text"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder="e.g. Manual SOC operator blacklisting"
                  className="w-full bg-[#080d1a] border border-slate-700 rounded-lg p-2 text-slate-200 focus:border-red-400 outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowBlockModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-rose-700 text-white font-semibold shadow-md shadow-red-500/20"
                >
                  Enforce Block
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
