import React, { useState } from "react";
import { 
  ShieldAlert, 
  Sparkles, 
  Ban, 
  Activity, 
  Flame, 
  ExternalLink, 
  Eye, 
  Terminal, 
  TrendingUp, 
  Compass, 
  AlertTriangle,
  Radio,
  Lock
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import { AttackEvent, DashboardStats } from "../types";

interface DashboardProps {
  stats: DashboardStats | null;
  events: AttackEvent[];
  onSelectEvent: (event: AttackEvent) => void;
  onNavigateTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ stats, events, onSelectEvent, onNavigateTab }) => {
  const [selectedEvent, setSelectedEvent] = useState<AttackEvent | null>(events[0] || null);

  const activeEvent = selectedEvent || events[0];

  const vectorColors: Record<string, string> = {
    RECONNAISSANCE: "#06b6d4",
    BRUTE_FORCE: "#f59e0b",
    WEB_INJECTION: "#ef4444",
    PRIVILEGE_ESCALATION: "#ec4899",
    DATA_EXFILTRATION: "#8b5cf6",
    DDOS_PROBE: "#3b82f6",
    SUSPICIOUS_ANOMALY: "#64748b"
  };

  const chartData = stats?.vectors_distribution 
    ? Object.entries(stats.vectors_distribution).map(([name, value]) => ({ name, value }))
    : [];

  const threatData = stats?.threat_levels_distribution
    ? Object.entries(stats.threat_levels_distribution).map(([name, value]) => ({ name, value }))
    : [];

  const THREAT_COLORS: Record<string, string> = {
    LOW: "#10b981",
    MEDIUM: "#f59e0b",
    HIGH: "#f97316",
    CRITICAL: "#ef4444"
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="cyber-glass rounded-2xl p-5 border border-blue-500/20 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-mono text-slate-400">TOTAL ATTACKS LOGGED</p>
              <h3 className="text-3xl font-bold text-white mt-1 font-mono tracking-tight">
                {stats?.total_attacks_logged ?? events.length}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-950/60 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-blue-400 font-mono">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-400 animate-ping mr-2"></span>
            Real-time neural stream active
          </div>
        </div>

        <div className="cyber-glass rounded-2xl p-5 border border-cyan-500/20 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-mono text-slate-400">ADAPTIVE HONEYPOT TRAPS</p>
              <h3 className="text-3xl font-bold text-cyan-300 mt-1 font-mono tracking-tight">
                {stats?.total_honeypot_hits ?? 160} <span className="text-sm font-normal text-cyan-500 font-sans">hits</span>
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 text-xs text-cyan-400/80 font-mono">
            {stats?.active_honeypots_count ?? 5} Decoys armed & routing attackers
          </div>
        </div>

        <div className="cyber-glass rounded-2xl p-5 border border-red-500/20 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-mono text-slate-400">AUTOMATICALLY BLOCKED IPs</p>
              <h3 className="text-3xl font-bold text-red-400 mt-1 font-mono tracking-tight">
                {stats?.blocked_ips_count ?? 2}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-950/60 border border-red-500/30 flex items-center justify-center text-red-400">
              <Ban className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 text-xs text-red-400/80 font-mono flex items-center">
            <Lock className="w-3.5 h-3.5 mr-1" />
            Layer-3/7 Automatic Drop Rules
          </div>
        </div>

        <div className="cyber-glass rounded-2xl p-5 border border-amber-500/20 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-mono text-slate-400">AVG THREAT RISK SCORE</p>
              <h3 className="text-3xl font-bold text-amber-400 mt-1 font-mono tracking-tight">
                {stats?.average_risk_score ?? 84.5} <span className="text-sm text-slate-400 font-sans">/ 100</span>
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Flame className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 text-xs text-amber-400/80 font-mono">
            Dynamic ML ensemble confidence &gt; 92%
          </div>
        </div>
      </div>

      {/* AI Next Move Prediction Showcase & Telemetry Radar */}
      {activeEvent && (
        <div className="cyber-glass-glow rounded-2xl p-6 border border-cyan-500/40 relative">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-slate-800 gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-blue-900/40 border border-blue-500/40 text-cyan-300">
                <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: "12s" }} />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-white">AI ATTACK BEHAVIOR & NEXT-STEP PREDICTION</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-cyan-400 border border-cyan-500/30">
                    Markov Sequence Engine
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Targeted Subject: <span className="font-mono text-cyan-300 font-bold">{activeEvent.source_ip}</span> | Current Vector: <span className="font-mono text-amber-400 font-bold">{activeEvent.classification}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                activeEvent.threat_level === "CRITICAL" ? "bg-red-950 text-red-400 border-red-500" :
                activeEvent.threat_level === "HIGH" ? "bg-orange-950 text-orange-400 border-orange-500" :
                "bg-amber-950 text-amber-400 border-amber-500"
              }`}>
                RISK: {activeEvent.risk_score} / 100 ({activeEvent.threat_level})
              </span>
              <button
                onClick={() => onNavigateTab("attack-path")}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 text-cyan-300 text-xs border border-blue-400/40 font-medium transition"
              >
                <span>View in Attack Path Graph</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 3 Probable Next Moves */}
          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeEvent.next_predicted_moves?.slice(0, 3).map((move, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#090e1c]/90 border border-cyber-border relative overflow-hidden group hover:border-cyan-500/40 transition">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono text-slate-400">PROBABLE MOVE #{idx + 1}</span>
                  <span className="font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                    {Math.round(move.probability * 100)}% Probability
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-slate-200 group-hover:text-cyan-300 transition">
                  {move.tactic_name}
                </h4>
                <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1.5 text-xs">
                  <div className="flex items-start space-x-1.5 text-amber-300/90 font-mono text-[11px]">
                    <span className="text-amber-400">🍯 Decoy:</span>
                    <span>{move.recommended_honeypot}</span>
                  </div>
                  <div className="flex items-start space-x-1.5 text-emerald-300/90 font-mono text-[11px]">
                    <span className="text-emerald-400">🛡️ Defense:</span>
                    <span>{move.preventative_countermeasure}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Visual Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attack Vector Distribution */}
        <div className="cyber-glass rounded-2xl p-5 border border-cyber-border lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">ATTACK VECTOR CLASSIFICATION</h3>
              <p className="text-xs text-slate-400 font-mono">Neural threat categorization telemetry</p>
            </div>
            <span className="text-xs font-mono text-slate-500">Live Telemetry</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", borderRadius: "8px", fontSize: "12px" }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={vectorColors[entry.name] || "#3b82f6"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Threat Level Breakdown */}
        <div className="cyber-glass rounded-2xl p-5 border border-cyber-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">THREAT SEVERITY INDEX</h3>
              <p className="text-xs text-slate-400 font-mono">Real-time risk scoring tiers</p>
            </div>
          </div>
          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={threatData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {threatData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={THREAT_COLORS[entry.name] || "#3b82f6"} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", borderRadius: "8px", fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-3 text-[11px] font-mono mt-2">
            <span className="flex items-center text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-1"></span>Low</span>
            <span className="flex items-center text-amber-400"><span className="w-2 h-2 rounded-full bg-amber-500 mr-1"></span>Med</span>
            <span className="flex items-center text-orange-400"><span className="w-2 h-2 rounded-full bg-orange-500 mr-1"></span>High</span>
            <span className="flex items-center text-red-400"><span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span>Crit</span>
          </div>
        </div>
      </div>

      {/* Live Attack Stream Table */}
      <div className="cyber-glass rounded-2xl p-5 border border-cyber-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 text-red-400 animate-pulse" />
            <h3 className="text-sm font-semibold text-white">LIVE ATTACK STREAM & DECEPTION INTERCEPTIONS</h3>
          </div>
          <span className="text-xs font-mono text-slate-500">Auto-refreshing via WebSocket</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="pb-3">TIMESTAMP</th>
                <th className="pb-3">SOURCE ATTACKER</th>
                <th className="pb-3">TARGET VECTOR</th>
                <th className="pb-3">RISK SCORE</th>
                <th className="pb-3">HONEYPOT DECEPTION</th>
                <th className="pb-3">ACTION TAKEN</th>
                <th className="pb-3 text-right">INSPECT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {events.map((ev) => {
                const isSelected = selectedEvent?.id === ev.id;
                return (
                  <tr 
                    key={ev.id} 
                    onClick={() => setSelectedEvent(ev)}
                    className={`hover:bg-blue-950/30 transition cursor-pointer ${
                      isSelected ? "bg-blue-950/40 border-l-2 border-cyan-400" : ""
                    }`}
                  >
                    <td className="py-3 text-slate-400 text-[11px]">
                      {new Date(ev.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-3">
                      <div className="font-bold text-slate-200">{ev.source_ip}</div>
                      <div className="text-[10px] text-slate-500">
                        Port: {ev.fingerprint?.real_source_port || 80}
                        {ev.fingerprint?.proxy_vpn_detected && (
                          <span className="ml-1.5 px-1 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-500/30">
                            VPN
                          </span>
                        )}
                        {ev.fingerprint?.local_ip_webrtc && (
                          <span className="ml-1 text-cyan-400 font-mono">
                            LAN:{ev.fingerprint.local_ip_webrtc}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold" style={{ 
                        backgroundColor: `${vectorColors[ev.classification]}20`,
                        color: vectorColors[ev.classification],
                        border: `1px solid ${vectorColors[ev.classification]}40`
                      }}>
                        {ev.classification}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-0.5">{ev.target_endpoint}</div>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ev.risk_score >= 88 ? "bg-red-950 text-red-400 border border-red-500/40" :
                        ev.risk_score >= 70 ? "bg-orange-950 text-orange-400 border border-orange-500/40" :
                        "bg-amber-950 text-amber-400 border border-amber-500/40"
                      }`}>
                        {ev.risk_score}
                      </span>
                    </td>
                    <td className="py-3">
                      {ev.honeypot_hit ? (
                        <div className="flex items-center text-amber-300 text-[11px]">
                          <span className="mr-1">🍯</span>
                          <span className="truncate max-w-[140px]">{ev.honeypot_hit}</span>
                        </div>
                      ) : (
                        <span className="text-slate-600 text-[10px]">No decoy hit</span>
                      )}
                      {ev.canary_token_tripped && (
                        <div className="text-[9px] text-red-400 flex items-center mt-0.5">
                          <AlertTriangle className="w-2.5 h-2.5 mr-0.5" /> Canary Tripped
                        </div>
                      )}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ev.defense_action === "IP_DROP_BLOCK" ? "bg-red-950 text-red-300 border border-red-500/50" :
                        ev.defense_action === "ISOLATE_SANDBOX" ? "bg-purple-950 text-purple-300 border border-purple-500/50" :
                        "bg-blue-950 text-blue-300 border border-blue-500/50"
                      }`}>
                        {ev.defense_action}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectEvent(ev);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                        title="View Full Forensic Payload & MITRE Mapping"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
