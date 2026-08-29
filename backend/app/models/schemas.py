"""
CyberShield Data Models & Schemas (with GPS & Geolocation Support)
"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum
import datetime

class AttackVector(str, Enum):
    RECONNAISSANCE = "RECONNAISSANCE"
    BRUTE_FORCE = "BRUTE_FORCE"
    WEB_INJECTION = "WEB_INJECTION"
    PRIVILEGE_ESCALATION = "PRIVILEGE_ESCALATION"
    DATA_EXFILTRATION = "DATA_EXFILTRATION"
    DDOS_PROBE = "DDOS_PROBE"
    SUSPICIOUS_ANOMALY = "SUSPICIOUS_ANOMALY"

class ThreatLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class DefenseActionType(str, Enum):
    ALLOW = "ALLOW"
    DECEIVE_ROUTE = "DECEIVE_ROUTE"
    RATE_LIMIT = "RATE_LIMIT"
    ISOLATE_SANDBOX = "ISOLATE_SANDBOX"
    IP_DROP_BLOCK = "IP_DROP_BLOCK"

class GeoLocation(BaseModel):
    latitude: float
    longitude: float
    city: str = "Unknown"
    region: str = "Unknown"
    country: str = "Unknown"
    country_code: str = "UN"
    timezone: str = "UTC"
    isp: str = "Unknown ISP"
    flag_emoji: str = "🌐"

class AttackerFingerprint(BaseModel):
    ip: str
    real_source_port: int
    destination_port: int
    proxy_vpn_detected: bool = False
    proxy_type: Optional[str] = "None"
    local_ip_webrtc: Optional[str] = None
    mac_address_lan: Optional[str] = None
    canvas_hash: Optional[str] = None
    webgl_vendor: Optional[str] = None
    os_detected: str = "Unknown"
    browser_detected: str = "Unknown"
    ja3_hash: Optional[str] = None
    tcp_ttl: int = 64
    tcp_window_size: int = 65535
    country: str = "Unknown"
    asn_org: str = "Unknown ISP"
    threat_reputation_score: float = 0.0
    geo: Optional[GeoLocation] = None

class NextMovePrediction(BaseModel):
    vector: AttackVector
    tactic_name: str
    probability: float
    recommended_honeypot: str
    preventative_countermeasure: str

class AttackEvent(BaseModel):
    id: str
    timestamp: str = Field(default_factory=lambda: datetime.datetime.utcnow().isoformat() + "Z")
    source_ip: str
    target_endpoint: str
    http_method: str = "GET"
    payload: str = ""
    headers: Dict[str, str] = {}
    classification: AttackVector
    confidence: float
    risk_score: float
    threat_level: ThreatLevel
    next_predicted_moves: List[NextMovePrediction] = []
    honeypot_hit: Optional[str] = None
    canary_token_tripped: Optional[str] = None
    mitre_tactics: List[str] = []
    mitre_techniques: List[str] = []
    defense_action: DefenseActionType
    fingerprint: Optional[AttackerFingerprint] = None
    is_blocked: bool = False
    session_id: str
    geo: Optional[GeoLocation] = None

class HoneypotAsset(BaseModel):
    id: str
    name: str
    type: str
    decoy_path: str
    description: str
    hits_count: int = 0
    canary_token: Optional[str] = None
    fake_data_preview: Dict[str, Any] = {}
    active: bool = True
    created_at: str

class FirewallRule(BaseModel):
    id: str
    ip: str
    reason: str
    threat_level: ThreatLevel
    risk_score: float
    blocked_at: str
    expires_at: Optional[str] = None
    status: str = "BLOCKED"
    packets_dropped: int = 0
    local_lan_mac: Optional[str] = None
    real_ports_tracked: List[int] = []
    geo: Optional[GeoLocation] = None

class AttackPathNode(BaseModel):
    id: str
    label: str
    type: str
    threat_level: Optional[ThreatLevel] = None
    timestamp: str
    details: Dict[str, Any] = {}

class AttackPathEdge(BaseModel):
    id: str
    source: str
    target: str
    label: str
    animated: bool = True

class AttackPathGraph(BaseModel):
    nodes: List[AttackPathNode]
    edges: List[AttackPathEdge]

class SimulationRequest(BaseModel):
    scenario: str
    source_ip: Optional[str] = None
    intensity: str = "medium"
    use_vpn_proxy: bool = False
