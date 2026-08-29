import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./pages/Dashboard";
import { GpsThreatMap } from "./pages/GpsThreatMap";
import { AttackPathVisualizer } from "./pages/AttackPathVisualizer";
import { HoneypotManager } from "./pages/HoneypotManager";
import { AttackerProfiler } from "./pages/AttackerProfiler";
import { DefenseFirewall } from "./pages/DefenseFirewall";
import { ForensicsEvidence } from "./pages/ForensicsEvidence";
import { AttackSimulator } from "./pages/AttackSimulator";
import { api, cyberSocket } from "./services/api";
import { AttackEvent, DashboardStats } from "./types";

export function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [events, setEvents] = useState<AttackEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<AttackEvent | null>(null);
  const [newAttackAlert, setNewAttackAlert] = useState<AttackEvent | null>(null);

  const loadData = async () => {
    try {
      const [statsData, eventsData] = await Promise.all([
        api.getStats(),
        api.getEvents(50)
      ]);
      setStats(statsData);
      setEvents(eventsData);
      if (eventsData.length > 0 && !selectedEvent) {
        setSelectedEvent(eventsData[0]);
      }
    } catch (e) {
      console.error("[CyberShield] Failed to load data", e);
    }
  };

  useEffect(() => {
    loadData();

    const unsubscribe = cyberSocket.subscribe((msg) => {
      if (msg.type === "NEW_ATTACK_EVENT" && msg.data) {
        const newEv: AttackEvent = msg.data;
        setEvents((prev) => [newEv, ...prev.slice(0, 49)]);
        setSelectedEvent(newEv);
        setNewAttackAlert(newEv);
        setTimeout(() => setNewAttackAlert(null), 4000);

        api.getStats().then(setStats).catch(console.error);
      } else if (msg.type === "FIREWALL_UPDATED") {
        api.getStats().then(setStats).catch(console.error);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSelectEvent = (event: AttackEvent) => {
    setSelectedEvent(event);
    setActiveTab("forensics");
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col">
      <Navbar activeTab={activeTab} />

      {newAttackAlert && (
        <div className="fixed bottom-5 right-5 z-50 p-4 rounded-xl cyber-glass-glow border border-red-500/60 shadow-2xl flex items-center space-x-3 text-xs font-mono animate-bounce">
          <span className="w-3 h-3 rounded-full bg-red-500 animate-ping"></span>
          <div>
            <div className="text-red-400 font-bold">
              INTRUSION INTERCEPTED: {newAttackAlert.source_ip}
            </div>
            <div className="text-slate-300 text-[11px]">
              Vector: {newAttackAlert.classification} | Action: {newAttackAlert.defense_action}
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          blockedCount={stats?.blocked_ips_count || 0}
        />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-h-[calc(100vh-4rem)]">
          {activeTab === "dashboard" && (
            <Dashboard
              stats={stats}
              events={events}
              onSelectEvent={handleSelectEvent}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === "threat-map" && <GpsThreatMap />}

          {activeTab === "attack-path" && <AttackPathVisualizer />}

          {activeTab === "honeypots" && <HoneypotManager />}

          {activeTab === "profiler" && (
            <AttackerProfiler
              events={events}
              onFirewallAction={loadData}
            />
          )}

          {activeTab === "firewall" && <DefenseFirewall />}

          {activeTab === "forensics" && (
            <ForensicsEvidence
              events={events}
              selectedEvent={selectedEvent}
              onSelectEvent={setSelectedEvent}
            />
          )}

          {activeTab === "simulator" && (
            <AttackSimulator onAttackTriggered={loadData} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
