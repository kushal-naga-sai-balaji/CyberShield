import React, { useState, useEffect } from "react";
import { Sparkles, Plus, Key, Database, Terminal, ShieldAlert, CheckCircle, Copy, AlertTriangle } from "lucide-react";
import { api } from "../services/api";
import { HoneypotAsset } from "../types";

export const HoneypotManager: React.FC = () => {
  const [honeypots, setHoneypots] = useState<HoneypotAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // New honeypot form state
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("fake_api");
  const [newPath, setNewPath] = useState("/api/v1/internal/payment_keys");
  const [newDesc, setNewDesc] = useState("");
  const [newFakeJson, setNewFakeJson] = useState('{"stripe_key": "sk_test_canary_9921", "db_pass": "decoy_secret"}');

  const fetchHoneypots = async () => {
    setLoading(true);
    try {
      const data = await api.getHoneypots();
      setHoneypots(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHoneypots();
  }, []);

  const handleCopy = (token: string) => {
    navigator.clipboard.writeText(token);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let parsedData = {};
      try {
        parsedData = JSON.parse(newFakeJson);
      } catch {
        parsedData = { raw: newFakeJson };
      }

      await api.createHoneypot({
        name: newName || "Custom Decoy Asset",
        type: newType,
        decoy_path: newPath,
        description: newDesc || "Operator deployed deception trap with embedded canary tripwire.",
        fake_data: parsedData
      });

      setShowCreateModal(false);
      setNewName("");
      setNewDesc("");
      fetchHoneypots();
    } catch (err) {
      console.error(err);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "fake_admin":
        return <Key className="w-5 h-5 text-amber-400" />;
      case "canary_db":
        return <Database className="w-5 h-5 text-purple-400" />;
      case "fake_ssh":
        return <Terminal className="w-5 h-5 text-emerald-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span>ADAPTIVE HONEYPOTS & CANARY TRIPWIRE DECEPTION MESH</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Deploy believable fake endpoints, synthetic database dumps, and canary tokens to study and trap attackers.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 border border-blue-400/40 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Deploy New Decoy Trap</span>
        </button>
      </div>

      {/* Honeypot Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {honeypots.map((hp) => (
          <div
            key={hp.id}
            className="cyber-glass rounded-2xl p-5 border border-cyber-border hover:border-cyan-500/40 transition flex flex-col justify-between group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition"></div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-[#0a1020] border border-slate-800">
                    {getTypeIcon(hp.type)}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition">
                      {hp.name}
                    </h3>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-blue-950 text-cyan-400 border border-blue-500/30">
                      {hp.type}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-amber-400 font-mono bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                    {hp.hits_count} Hits
                  </span>
                </div>
              </div>

              <div className="mt-2 text-xs text-slate-400 leading-relaxed">
                {hp.description}
              </div>

              {/* Decoy Path */}
              <div className="mt-3 bg-[#080d1a] rounded-lg p-2 border border-slate-800 font-mono text-[11px] text-cyan-300 truncate">
                <span className="text-slate-500">Route: </span>{hp.decoy_path}
              </div>

              {/* Canary Token */}
              {hp.canary_token && (
                <div className="mt-2.5 bg-purple-950/30 rounded-lg p-2 border border-purple-500/30 flex items-center justify-between text-[11px] font-mono">
                  <div className="truncate text-purple-300">
                    <span className="text-purple-400 font-bold">Canary: </span>
                    {hp.canary_token}
                  </div>
                  <button
                    onClick={() => handleCopy(hp.canary_token!)}
                    className="text-purple-400 hover:text-purple-200 transition ml-2 p-1"
                    title="Copy Canary Token"
                  >
                    {copiedToken === hp.canary_token ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}

              {/* Deceptive Payload Preview */}
              <div className="mt-3">
                <span className="text-[10px] text-slate-500 font-mono uppercase">Synthetic Payload Fed:</span>
                <pre className="mt-1 p-2 rounded-lg bg-[#060912] border border-slate-800 text-[10px] font-mono text-emerald-400/90 overflow-x-auto max-h-24">
                  {JSON.stringify(hp.fake_data_preview, null, 2)}
                </pre>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span className="flex items-center text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
                Active Tripwire
              </span>
              <span>ID: {hp.id}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Honeypot Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="cyber-glass-glow max-w-lg w-full rounded-2xl p-6 border border-cyan-500/50 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Deploy New Adaptive Honeypot Decoy</span>
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1">Decoy Honeypot Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Fake Payment Gateway API"
                  className="w-full bg-[#080d1a] border border-slate-700 rounded-lg p-2 text-slate-200 focus:border-cyan-400 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Trap Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full bg-[#080d1a] border border-slate-700 rounded-lg p-2 text-slate-200 focus:border-cyan-400 outline-none"
                  >
                    <option value="fake_api">Fake REST API</option>
                    <option value="fake_admin">Fake Admin Portal</option>
                    <option value="fake_file">Fake Sensitive File</option>
                    <option value="canary_db">Canary Database</option>
                    <option value="fake_ssh">Fake SSH Tarpit</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Decoy Target Path</label>
                  <input
                    type="text"
                    value={newPath}
                    onChange={(e) => setNewPath(e.target.value)}
                    placeholder="e.g. /api/v1/auth/keys"
                    className="w-full bg-[#080d1a] border border-slate-700 rounded-lg p-2 text-slate-200 focus:border-cyan-400 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Deceptive Description</label>
                <input
                  type="text"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Purpose of this deception trap..."
                  className="w-full bg-[#080d1a] border border-slate-700 rounded-lg p-2 text-slate-200 focus:border-cyan-400 outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Synthetic Data JSON (Canary Payload)</label>
                <textarea
                  value={newFakeJson}
                  onChange={(e) => setNewFakeJson(e.target.value)}
                  rows={3}
                  className="w-full bg-[#080d1a] border border-slate-700 rounded-lg p-2 text-emerald-400 font-mono focus:border-cyan-400 outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold shadow-md shadow-blue-500/20"
                >
                  Deploy Decoy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
