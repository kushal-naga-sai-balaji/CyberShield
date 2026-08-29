import React, { useState, useEffect } from "react";
import { GitFork, Shield, AlertCircle, Info, RefreshCw, ZoomIn, ZoomOut, Zap, Lock } from "lucide-react";
import { api } from "../services/api";
import { AttackPathGraph, AttackPathNode } from "../types";

export const AttackPathVisualizer: React.FC = () => {
  const [graphData, setGraphData] = useState<AttackPathGraph | null>(null);
  const [selectedNode, setSelectedNode] = useState<AttackPathNode | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchGraph = async () => {
    setLoading(true);
    try {
      const data = await api.getAttackPath();
      setGraphData(data);
      if (data.nodes.length > 0 && !selectedNode) {
        setSelectedNode(data.nodes[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGraph();
  }, []);

  const getNodeColor = (type: string, threat?: string) => {
    switch (type) {
      case "attacker":
        return "from-red-600/40 to-rose-900/40 border-red-500 text-red-300";
      case "vector":
        return "from-amber-600/40 to-yellow-900/40 border-amber-500 text-amber-300";
      case "honeypot":
        return "from-cyan-600/40 to-blue-900/40 border-cyan-400 text-cyan-300";
      case "canary":
        return "from-purple-600/40 to-pink-900/40 border-purple-400 text-purple-300";
      case "defense":
      case "quarantine":
        return "from-emerald-600/40 to-teal-900/40 border-emerald-400 text-emerald-300";
      default:
        return "from-slate-700 to-slate-900 border-slate-600 text-slate-300";
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <GitFork className="w-5 h-5 text-cyan-400" />
            <span>AI ATTACK PATH & DECEPTION TRAVERSAL GRAPH</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Interactive visualization of attacker movement across deceptive decoys, canary tokens, and quarantine containment.
          </p>
        </div>
        <button
          onClick={fetchGraph}
          disabled={loading}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-950/60 hover:bg-blue-900/60 text-cyan-300 border border-blue-500/30 text-xs font-mono transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Traversal</span>
        </button>
      </div>

      {/* Main Visualizer Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Node Flow Canvas */}
        <div className="cyber-glass rounded-2xl p-6 border border-cyber-border lg:col-span-2 min-h-[520px] flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-4 border-b border-slate-800 pb-3">
            <span className="flex items-center space-x-2">
              <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>DYNAMIC DECEPTION GRAPH ENGINE</span>
            </span>
            <div className="flex space-x-3 text-[11px]">
              <span className="flex items-center text-red-400"><span className="w-2 h-2 rounded bg-red-500 mr-1"></span>Attacker</span>
              <span className="flex items-center text-amber-400"><span className="w-2 h-2 rounded bg-amber-500 mr-1"></span>Vector</span>
              <span className="flex items-center text-cyan-400"><span className="w-2 h-2 rounded bg-cyan-500 mr-1"></span>Honeypot</span>
              <span className="flex items-center text-purple-400"><span className="w-2 h-2 rounded bg-purple-500 mr-1"></span>Canary</span>
              <span className="flex items-center text-emerald-400"><span className="w-2 h-2 rounded bg-emerald-500 mr-1"></span>Quarantine</span>
            </div>
          </div>

          {/* Node Grid Layout */}
          <div className="flex-1 flex flex-col justify-around py-4 space-y-6">
            {graphData && graphData.nodes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {graphData.nodes.map((node) => {
                  const isSelected = selectedNode?.id === node.id;
                  const colorClass = getNodeColor(node.type, node.threat_level);

                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      className={`p-4 rounded-xl border bg-gradient-to-br transition-all cursor-pointer select-none relative ${colorClass} ${
                        isSelected ? "ring-2 ring-cyan-400 scale-[1.02] shadow-lg shadow-cyan-500/20" : "hover:scale-[1.01]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] uppercase font-mono tracking-wider font-bold">
                          {node.type}
                        </span>
                        {node.threat_level && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/40 border border-current">
                            {node.threat_level}
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-semibold truncate text-slate-100">
                        {node.label}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-2 font-mono flex items-center justify-between">
                        <span>{new Date(node.timestamp).toLocaleTimeString()}</span>
                        <span className="text-cyan-300 font-sans">Inspect →</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-slate-500 text-sm font-mono">
                <Info className="w-8 h-8 mb-2 text-slate-600" />
                <span>No attack path nodes active yet. Simulate an attack to generate graph.</span>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-500 flex justify-between">
            <span>Total Nodes: {graphData?.nodes.length || 0}</span>
            <span>Total Pathways Tracked: {graphData?.edges.length || 0}</span>
          </div>
        </div>

        {/* Selected Node Forensics Inspector Pane */}
        <div className="cyber-glass rounded-2xl p-6 border border-cyber-border flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-4 pb-3 border-b border-slate-800">
              <Shield className="w-4 h-4" />
              <span>NODE DEEP INSPECTION TELEMETRY</span>
            </div>

            {selectedNode ? (
              <div className="space-y-4">
                <div>
                  <span className="text-[11px] text-slate-500 font-mono uppercase">Node Identifier</span>
                  <div className="text-sm font-bold text-white font-mono">{selectedNode.id}</div>
                </div>

                <div>
                  <span className="text-[11px] text-slate-500 font-mono uppercase">Label / Description</span>
                  <div className="text-xs text-slate-200 mt-0.5 leading-relaxed bg-[#0b1222] p-2.5 rounded-lg border border-slate-800">
                    {selectedNode.label}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-slate-500 font-mono uppercase">Type & Threat Rating</span>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="px-2 py-0.5 rounded bg-blue-950 text-cyan-300 text-xs font-mono border border-blue-500/30 uppercase">
                      {selectedNode.type}
                    </span>
                    {selectedNode.threat_level && (
                      <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 text-xs font-mono border border-red-500/30">
                        {selectedNode.threat_level}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-slate-500 font-mono uppercase">Node Telemetry Payload</span>
                  <div className="mt-1 bg-[#090d18] rounded-xl p-3 border border-slate-800 text-[11px] font-mono text-slate-300 space-y-1.5">
                    {Object.entries(selectedNode.details).map(([key, val]) => (
                      <div key={key} className="flex justify-between border-b border-slate-800/50 pb-1">
                        <span className="text-slate-500">{key}:</span>
                        <span className="text-cyan-300 font-semibold truncate max-w-[170px]">{String(val)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-500 font-mono text-center py-12">
                Select any graph node to inspect forensic metadata.
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800/80 mt-6">
            <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs text-cyan-300 font-mono flex items-start space-x-2">
              <Zap className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
              <span>CyberShield dynamically routes probed paths away from production assets into isolated deception nodes.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
