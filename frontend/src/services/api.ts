import { AttackEvent, HoneypotAsset, FirewallRule, AttackPathGraph, DashboardStats, ThreatMapResponse } from "../types";

const API_BASE = "http://localhost:8000/api";
const WS_BASE = "ws://localhost:8000/ws/attacks";

export const api = {
  async getStats(): Promise<DashboardStats> {
    const res = await fetch(`${API_BASE}/dashboard/stats`);
    return res.json();
  },

  async getEvents(limit: number = 50): Promise<AttackEvent[]> {
    const res = await fetch(`${API_BASE}/events?limit=${limit}`);
    return res.json();
  },

  async getEventDetail(id: string): Promise<AttackEvent> {
    const res = await fetch(`${API_BASE}/events/${id}`);
    return res.json();
  },

  async getThreatMapLocations(): Promise<ThreatMapResponse> {
    const res = await fetch(`${API_BASE}/threat-map/locations`);
    return res.json();
  },

  async getHoneypots(): Promise<HoneypotAsset[]> {
    const res = await fetch(`${API_BASE}/honeypots`);
    return res.json();
  },

  async createHoneypot(data: { name: string; type: string; decoy_path: string; description: string; fake_data: any }): Promise<HoneypotAsset> {
    const res = await fetch(`${API_BASE}/honeypots`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async getFirewallRules(): Promise<FirewallRule[]> {
    const res = await fetch(`${API_BASE}/firewall/rules`);
    return res.json();
  },

  async unblockIp(ip: string): Promise<{ status: string; ip: string }> {
    const res = await fetch(`${API_BASE}/firewall/unblock/${ip}`, { method: "POST" });
    return res.json();
  },

  async quarantineIp(ip: string): Promise<{ status: string; ip: string }> {
    const res = await fetch(`${API_BASE}/firewall/quarantine/${ip}`, { method: "POST" });
    return res.json();
  },

  async manualBlockIp(ip: string, reason?: string): Promise<{ status: string; rule: FirewallRule }> {
    const res = await fetch(`${API_BASE}/firewall/block`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ip, reason }),
    });
    return res.json();
  },

  async getAttackPath(): Promise<AttackPathGraph> {
    const res = await fetch(`${API_BASE}/forensics/attack-path`);
    return res.json();
  },

  async getMitreData(): Promise<any> {
    const res = await fetch(`${API_BASE}/forensics/mitre`);
    return res.json();
  },

  async exportForensics(): Promise<any> {
    const res = await fetch(`${API_BASE}/forensics/export`);
    return res.json();
  },

  async simulateAttack(scenario: string, source_ip?: string, use_vpn_proxy: boolean = false): Promise<any> {
    const res = await fetch(`${API_BASE}/simulate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scenario, source_ip, use_vpn_proxy }),
    });
    return res.json();
  }
};

export class CyberWebSocket {
  private ws: WebSocket | null = null;
  private listeners: ((event: any) => void)[] = [];
  private reconnectInterval: number = 3000;
  private shouldReconnect: boolean = true;

  constructor() {
    this.connect();
  }

  private connect() {
    try {
      this.ws = new WebSocket(WS_BASE);

      this.ws.onopen = () => {
        console.log("[CyberShield WS] Connected to live threat stream.");
      };

      this.ws.onmessage = (msg) => {
        try {
          const parsed = JSON.parse(msg.data);
          this.listeners.forEach(cb => cb(parsed));
        } catch (err) {
          console.error("[CyberShield WS] Parse error", err);
        }
      };

      this.ws.onclose = () => {
        if (this.shouldReconnect) {
          setTimeout(() => this.connect(), this.reconnectInterval);
        }
      };

      this.ws.onerror = (err) => {
        console.error("[CyberShield WS] Error", err);
        this.ws?.close();
      };
    } catch (e) {
      console.error("[CyberShield WS] Connection init error", e);
    }
  }

  public subscribe(callback: (event: any) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  public close() {
    this.shouldReconnect = false;
    this.ws?.close();
  }
}

export const cyberSocket = new CyberWebSocket();
