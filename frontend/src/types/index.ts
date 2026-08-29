export type AttackVector = 
  | "RECONNAISSANCE"
  | "BRUTE_FORCE"
  | "WEB_INJECTION"
  | "PRIVILEGE_ESCALATION"
  | "DATA_EXFILTRATION"
  | "DDOS_PROBE"
  | "SUSPICIOUS_ANOMALY";

export type ThreatLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type DefenseActionType = 
  | "ALLOW"
  | "DECEIVE_ROUTE"
  | "RATE_LIMIT"
  | "ISOLATE_SANDBOX"
  | "IP_DROP_BLOCK";

export interface GeoLocation {
  latitude: number;
  longitude: number;
  city: string;
  region: string;
  country: string;
  country_code: string;
  timezone: string;
  isp: string;
  flag_emoji: string;
}

export interface AttackerFingerprint {
  ip: string;
  real_source_port: number;
  destination_port: number;
  proxy_vpn_detected: boolean;
  proxy_type: string;
  local_ip_webrtc?: string;
  mac_address_lan?: string;
  canvas_hash?: string;
  webgl_vendor?: string;
  os_detected: string;
  browser_detected: string;
  ja3_hash?: string;
  tcp_ttl: number;
  tcp_window_size: number;
  country: string;
  asn_org: string;
  threat_reputation_score: number;
  geo?: GeoLocation;
}

export interface NextMovePrediction {
  vector: AttackVector;
  tactic_name: string;
  probability: number;
  recommended_honeypot: string;
  preventative_countermeasure: string;
}

export interface AttackEvent {
  id: string;
  timestamp: string;
  source_ip: string;
  target_endpoint: string;
  http_method: string;
  payload: string;
  headers: Record<string, string>;
  classification: AttackVector;
  confidence: number;
  risk_score: number;
  threat_level: ThreatLevel;
  next_predicted_moves: NextMovePrediction[];
  honeypot_hit?: string;
  canary_token_tripped?: string;
  mitre_tactics: string[];
  mitre_techniques: string[];
  defense_action: DefenseActionType;
  fingerprint?: AttackerFingerprint;
  is_blocked: boolean;
  session_id: string;
  geo?: GeoLocation;
}

export interface HoneypotAsset {
  id: string;
  name: string;
  type: string;
  decoy_path: string;
  description: string;
  hits_count: number;
  canary_token?: string;
  fake_data_preview: Record<string, any>;
  active: boolean;
  created_at: string;
}

export interface FirewallRule {
  id: string;
  ip: string;
  reason: string;
  threat_level: ThreatLevel;
  risk_score: number;
  blocked_at: string;
  expires_at?: string;
  status: "BLOCKED" | "QUARANTINED" | "UNBLOCKED";
  packets_dropped: number;
  local_lan_mac?: string;
  real_ports_tracked: number[];
  geo?: GeoLocation;
}

export interface AttackPathNode {
  id: string;
  label: string;
  type: "attacker" | "vector" | "honeypot" | "canary" | "defense" | "quarantine";
  threat_level?: ThreatLevel;
  timestamp: string;
  details: Record<string, any>;
}

export interface AttackPathEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  animated?: boolean;
}

export interface AttackPathGraph {
  nodes: AttackPathNode[];
  edges: AttackPathEdge[];
}

export interface ThreatMapLocation {
  ip: string;
  latitude: number;
  longitude: number;
  city: string;
  region: string;
  country: string;
  country_code: string;
  flag_emoji: string;
  isp: string;
  timezone: string;
  status: string;
  threat_level: string;
  risk_score: number;
  reason: string;
  ports_tracked: number[];
  resolved_mac: string;
  packets_dropped: number;
  blocked_at: string;
}

export interface ThreatMapResponse {
  soc_base_location: {
    name: string;
    latitude: number;
    longitude: number;
    city: string;
    country: string;
    status: string;
  };
  locations: ThreatMapLocation[];
  total_located_threats: number;
}

export interface DashboardStats {
  total_attacks_logged: number;
  active_honeypots_count: number;
  total_honeypot_hits: number;
  blocked_ips_count: number;
  quarantined_ips_count: number;
  average_risk_score: number;
  vectors_distribution: Record<string, number>;
  threat_levels_distribution: Record<string, number>;
  system_status: string;
  timestamp: string;
}
