import React, { useState, useEffect } from "react";
import { FileText, Download, ShieldAlert, CheckCircle, Search, Terminal, Eye, ExternalLink, Code } from "lucide-react";
import { api } from "../services/api";
import { AttackEvent } from "../types";

interface ForensicsProps {
  events: AttackEvent[];
  selectedEvent: AttackEvent | null;
  onSelectEvent: (event: AttackEvent) => void;
}

export const ForensicsEvidence: React.FC<ForensicsProps> = ({ events, selectedEvent, onSelectEvent }) => {
  const [mitreData, setMitreData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    api.getMitreData().then(setMitreData).catch(console.error);
  }, [events]);

  const activeEvent = selectedEvent || events[0];

  const handleExport = async () => {
    try {
      const data = await api.exportForensics();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `CyberShield-Forensics-Bundle-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const filteredEvents = events.filter(e => 
    e.source_ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.classification.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.target_endpoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (e.payload && e.payload.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const mitreTacticsList = [
    { id: "TA0043", name: "Reconnaissance", code: "RECON" },
    { id: "TA0001", name: "Initial Access", code: "ACCESS" },
    { id: "TA0002", name: "Execution", code: "EXEC" },
    { id: "TA0004", name: "Privilege Escalation", code: "PRIV_ESC" },
    { id: "TA0006", name: "Credential Access", code: "CRED_ACCESS" },
    { id: "TA0010", name: "Exfiltration", code: "EXFIL" },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <span>DIGITAL FORENSICS & MITRE ATT&CK MATRIX SUITE</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Session replay, raw payload artifacts, MITRE ATT&CK technique mapping, and cryptographic forensic exports.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 border border-blue-400/40 transition"
        >
          <Download className="w-4 h-4" />
          <span>{downloadSuccess ? "Export Generated!" : "Export Forensic Incident Bundle (.JSON)"}</span>
        </button>
      </div>

      {/* MITRE ATT&CK Matrix Interactive Overview */}
      <div className="cyber-glass rounded-2xl p-5 border border-cyber-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Code className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white font-mono">MITRE ATT&CK ENTERPRISE TACTIC COVERAGE</h3>
          </div>
          <span className="text-xs font-mono text-slate-500">Framework v14 Aligned</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {mitreTacticsList.map((tactic) => {
            const hitCount = events.filter(e => e.mitre_tactics?.some(t => t.includes(tactic.id) || t.includes(tactic.name))).length;
            const hasHits = hitCount > 0;

            return (
              <div
                key={tactic.id}
                className={`p-3 rounded-xl border text-center transition ${
                  hasHits
                    ? "bg-blue-950/40 border-cyan-500/40 text-cyan-300 shadow-sm shadow-cyan-500/10"
                    : "bg-[#090d19] border-slate-800 text-slate-500"
                }`}
              >
                <div className="text-[10px] font-mono font-bold text-slate-400">{tactic.id}</div>
                <div className="text-xs font-semibold mt-1 text-slate-200">{tactic.name}</div>
                <div className="mt-2 text-xs font-mono font-bold text-cyan-400">
                  {hitCount} Events
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Session Replay & Payload Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Events Search & Select List */}
        <div className="cyber-glass rounded-2xl p-5 border border-cyber-border space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search IP, endpoint, payload..."
              className="w-full bg-[#080d1a] border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 outline-none focus:border-cyan-400 font-mono"
            />
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredEvents.map((ev) => {
              const isSelected = activeEvent?.id === ev.id;
              return (
                <div
                  key={ev.id}
                  onClick={() => onSelectEvent(ev)}
                  className={`p-3 rounded-xl border transition cursor-pointer font-mono ${
                    isSelected
                      ? "bg-blue-950/60 border-cyan-400/80 shadow-sm"
                      : "bg-[#090e1c] border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">{ev.source_ip}</span>
                    <span className="text-[10px] text-slate-500">{new Date(ev.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="text-[11px] text-cyan-300 mt-1 truncate">
                    {ev.http_method} {ev.target_endpoint}
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[10px]">
                    <span className="text-amber-400">{ev.classification}</span>
                    <span className="text-red-400 font-bold">Score: {ev.risk_score}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Event Forensic Evidence Viewer */}
        <div className="cyber-glass rounded-2xl p-6 border border-cyber-border lg:col-span-2 space-y-5">
          {activeEvent ? (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
                <div>
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-bold text-white font-mono">INCIDENT: {activeEvent.id}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      activeEvent.threat_level === "CRITICAL" ? "bg-red-950 text-red-400 border border-red-500/40" : "bg-amber-950 text-amber-400 border border-amber-500/40"
                    }`}>
                      {activeEvent.threat_level}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Session ID: <span className="text-slate-300">{activeEvent.session_id}</span> | Timestamp: <span className="text-slate-300">{activeEvent.timestamp}</span>
                  </p>
                </div>

                <div className="text-right text-xs font-mono">
                  <span className="text-slate-500">Defense: </span>
                  <span className="text-emerald-400 font-bold">{activeEvent.defense_action}</span>
                </div>
              </div>

              {/* MITRE Tactics & Techniques */}
              <div className="p-4 rounded-xl bg-[#090d1a] border border-slate-800 space-y-2">
                <span className="text-[11px] text-slate-400 font-mono font-bold uppercase">Mapped MITRE ATT&CK Vectors</span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {activeEvent.mitre_techniques?.map((tech, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-blue-950/60 border border-blue-500/30 text-cyan-300 text-xs font-mono">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Raw Payload Inspection */}
              <div className="space-y-2">
                <span className="text-[11px] text-slate-400 font-mono font-bold uppercase">Intercepted Request Payload</span>
                <pre className="p-3 rounded-xl bg-[#050812] border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed max-h-36">
                  {activeEvent.payload || "[Empty Payload Body]"}
                </pre>
              </div>

              {/* HTTP Headers */}
              <div className="space-y-2">
                <span className="text-[11px] text-slate-400 font-mono font-bold uppercase">Raw Ingress HTTP Headers</span>
                <div className="p-3 rounded-xl bg-[#050812] border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto space-y-1 max-h-32">
                  {Object.entries(activeEvent.headers || {}).map(([k, v]) => (
                    <div key={k}>
                      <span className="text-slate-500">{k}:</span> <span className="text-slate-300">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-24 text-slate-500 font-mono text-xs">
              Select an incident from the search list to inspect digital forensic evidence.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
