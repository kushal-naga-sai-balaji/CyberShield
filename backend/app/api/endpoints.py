"""
CyberShield REST API Endpoints & WebSocket Controller (with GPS & Threat Map)
"""
import uuid
import datetime
import random
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Request, BackgroundTasks
from pydantic import BaseModel

from app.models.schemas import (
    AttackEvent, HoneypotAsset, FirewallRule, AttackPathGraph, 
    SimulationRequest, AttackVector, ThreatLevel, DefenseActionType, GeoLocation
)
from app.core.ml_engine import ml_engine
from app.core.honeypot_engine import honeypot_engine
from app.core.fingerprint_engine import fingerprint_engine
from app.core.defense_engine import defense_engine
from app.core.forensics_engine import forensics_engine
from app.core.simulator import simulator

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: Dict[str, Any]):
        for connection in list(self.active_connections):
            try:
                await connection.send_json(message)
            except Exception:
                self.disconnect(connection)

ws_manager = ConnectionManager()

class InspectPayloadRequest(BaseModel):
    endpoint: str
    method: str = "GET"
    payload: str = ""
    client_ip: Optional[str] = None
    headers: Dict[str, str] = {}
    client_telemetry: Optional[Dict[str, Any]] = None

class CreateHoneypotRequest(BaseModel):
    name: str
    type: str
    decoy_path: str
    description: str
    fake_data: Dict[str, Any]

class ManualBlockRequest(BaseModel):
    ip: str
    reason: Optional[str] = "Manual SOC Operator Action"

@router.get("/dashboard/stats")
def get_dashboard_stats():
    events = forensics_engine.get_events(100)
    honeypots = honeypot_engine.get_all_honeypots()
    firewall_rules = defense_engine.get_all_rules()
    
    blocked_count = sum(1 for r in firewall_rules if r.status == "BLOCKED")
    quarantined_count = sum(1 for r in firewall_rules if r.status == "QUARANTINED")
    total_honeypot_hits = sum(h.hits_count for h in honeypots)
    
    vectors_count = {}
    threat_levels_count = {"LOW": 0, "MEDIUM": 0, "HIGH": 0, "CRITICAL": 0}
    for e in events:
        v = e.classification.value
        vectors_count[v] = vectors_count.get(v, 0) + 1
        t = e.threat_level.value
        threat_levels_count[t] = threat_levels_count.get(t, 0) + 1

    avg_risk = round(sum(e.risk_score for e in events) / max(len(events), 1), 1)

    return {
        "total_attacks_logged": len(events),
        "active_honeypots_count": len(honeypots),
        "total_honeypot_hits": total_honeypot_hits,
        "blocked_ips_count": blocked_count,
        "quarantined_ips_count": quarantined_count,
        "average_risk_score": avg_risk,
        "vectors_distribution": vectors_count,
        "threat_levels_distribution": threat_levels_count,
        "system_status": "ONLINE - DECEPTION MESH ARMED",
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z"
    }

@router.get("/events", response_model=List[AttackEvent])
def get_recent_events(limit: int = 50):
    return forensics_engine.get_events(limit)

@router.get("/events/{event_id}")
def get_event_detail(event_id: str):
    event = forensics_engine.get_event_by_id(event_id)
    if not event:
        return {"error": "Event not found"}
    return event

@router.get("/threat-map/locations")
def get_threat_map_locations():
    """Returns real-time GPS locations for all tracked and blocked attackers."""
    events = forensics_engine.get_events(100)
    firewall_rules = defense_engine.get_all_rules()
    
    seen_ips = set()
    locations = []

    # First add all active firewall rules (Blocked & Quarantined IPs)
    for rule in firewall_rules:
        if rule.ip not in seen_ips:
            geo = rule.geo or fingerprint_engine.resolve_gps_location(rule.ip)
            locations.append({
                "ip": rule.ip,
                "latitude": geo.latitude,
                "longitude": geo.longitude,
                "city": geo.city,
                "region": geo.region,
                "country": geo.country,
                "country_code": geo.country_code,
                "flag_emoji": geo.flag_emoji,
                "isp": geo.isp,
                "timezone": geo.timezone,
                "status": rule.status, # BLOCKED, QUARANTINED, UNBLOCKED
                "threat_level": rule.threat_level.value,
                "risk_score": rule.risk_score,
                "reason": rule.reason,
                "ports_tracked": rule.real_ports_tracked or [8000],
                "resolved_mac": rule.local_lan_mac or "N/A",
                "packets_dropped": rule.packets_dropped,
                "blocked_at": rule.blocked_at
            })
            seen_ips.add(rule.ip)

    # Add remaining active threat events
    for e in events:
        if e.source_ip not in seen_ips and e.fingerprint:
            geo = e.geo or e.fingerprint.geo or fingerprint_engine.resolve_gps_location(e.source_ip)
            locations.append({
                "ip": e.source_ip,
                "latitude": geo.latitude,
                "longitude": geo.longitude,
                "city": geo.city,
                "region": geo.region,
                "country": geo.country,
                "country_code": geo.country_code,
                "flag_emoji": geo.flag_emoji,
                "isp": geo.isp,
                "timezone": geo.timezone,
                "status": "TRACKED_ACTIVE" if not e.is_blocked else "BLOCKED",
                "threat_level": e.threat_level.value,
                "risk_score": e.risk_score,
                "reason": f"Active {e.classification.value} Intrusion Probe",
                "ports_tracked": [e.fingerprint.real_source_port],
                "resolved_mac": e.fingerprint.mac_address_lan or "N/A",
                "packets_dropped": 1 if e.is_blocked else 0,
                "blocked_at": e.timestamp
            })
            seen_ips.add(e.source_ip)

    return {
        "soc_base_location": {
            "name": "CyberShield SOC Command Center",
            "latitude": 12.9716,
            "longitude": 77.5946,
            "city": "Bengaluru",
            "country": "India",
            "status": "OPERATIONAL_DEFENDING"
        },
        "locations": locations,
        "total_located_threats": len(locations)
    }

@router.post("/inspect")
async def inspect_traffic(req: InspectPayloadRequest, raw_req: Request):
    client_ip = req.client_ip or raw_req.client.host if raw_req.client else "127.0.0.1"
    client_port = raw_req.client.port if raw_req.client else random.randint(49152, 65535)
    
    fingerprint = fingerprint_engine.inspect_and_de_anonymize(
        client_ip=client_ip,
        client_port=client_port,
        dest_port=8000,
        headers=req.headers,
        client_telemetry=req.client_telemetry
    )

    matched_hp, tripped_canary = honeypot_engine.check_and_match_honeypot(req.endpoint, req.payload)

    vector, confidence, risk_score, threat_level, next_moves, mitre_tactics, mitre_techniques = ml_engine.analyze_payload(
        target_endpoint=req.endpoint,
        payload=req.payload,
        headers=req.headers,
        method=req.method
    )

    if tripped_canary:
        risk_score = 99.9
        threat_level = ThreatLevel.CRITICAL

    defense_action, is_blocked, fw_rule = defense_engine.evaluate_and_enforce(
        ip=client_ip,
        risk_score=risk_score,
        threat_level=threat_level,
        vector=vector.value,
        canary_tripped=tripped_canary,
        fingerprint=fingerprint
    )

    deception_response = honeypot_engine.generate_adaptive_deception_response(
        honeypot=matched_hp,
        vector=vector.value,
        payload=req.payload
    )

    event = AttackEvent(
        id=f"evt_{uuid.uuid4().hex[:8]}",
        timestamp=datetime.datetime.utcnow().isoformat() + "Z",
        source_ip=client_ip,
        target_endpoint=req.endpoint,
        http_method=req.method,
        payload=req.payload,
        headers=req.headers,
        classification=vector,
        confidence=confidence,
        risk_score=risk_score,
        threat_level=threat_level,
        next_predicted_moves=next_moves,
        honeypot_hit=matched_hp.name if matched_hp else None,
        canary_token_tripped=tripped_canary,
        mitre_tactics=mitre_tactics,
        mitre_techniques=mitre_techniques,
        defense_action=defense_action,
        fingerprint=fingerprint,
        is_blocked=is_blocked,
        session_id=f"sess_{uuid.uuid4().hex[:6]}",
        geo=fingerprint.geo
    )
    forensics_engine.record_event(event)

    await ws_manager.broadcast({
        "type": "NEW_ATTACK_EVENT",
        "data": event.model_dump()
    })

    return {
        "analysis": {
            "classification": vector.value,
            "confidence": confidence,
            "risk_score": risk_score,
            "threat_level": threat_level.value,
            "defense_action": defense_action.value,
            "is_blocked": is_blocked
        },
        "fingerprint": fingerprint.model_dump(),
        "next_predicted_moves": [m.model_dump() for m in next_moves],
        "deception_response": deception_response
    }

@router.get("/honeypots", response_model=List[HoneypotAsset])
def get_honeypots():
    return honeypot_engine.get_all_honeypots()

@router.post("/honeypots", response_model=HoneypotAsset)
def create_honeypot(req: CreateHoneypotRequest):
    return honeypot_engine.create_custom_honeypot(
        name=req.name,
        decoy_type=req.type,
        decoy_path=req.decoy_path,
        description=req.description,
        fake_data=req.fake_data
    )

@router.get("/firewall/rules", response_model=List[FirewallRule])
def get_firewall_rules():
    return defense_engine.get_all_rules()

@router.post("/firewall/unblock/{ip}")
async def unblock_ip(ip: str):
    success = defense_engine.unblock_ip(ip)
    await ws_manager.broadcast({"type": "FIREWALL_UPDATED", "ip": ip, "status": "UNBLOCKED"})
    return {"status": "success" if success else "not_found", "ip": ip}

@router.post("/firewall/quarantine/{ip}")
async def quarantine_ip(ip: str):
    success = defense_engine.quarantine_ip(ip)
    await ws_manager.broadcast({"type": "FIREWALL_UPDATED", "ip": ip, "status": "QUARANTINED"})
    return {"status": "success" if success else "not_found", "ip": ip}

@router.post("/firewall/block")
async def manual_block(req: ManualBlockRequest):
    geo = fingerprint_engine.resolve_gps_location(req.ip)
    rule = defense_engine.manual_block_ip(req.ip, req.reason or "Manual Operator Block", geo)
    await ws_manager.broadcast({"type": "FIREWALL_UPDATED", "ip": req.ip, "status": "BLOCKED"})
    return {"status": "success", "rule": rule.model_dump()}

@router.get("/forensics/attack-path", response_model=AttackPathGraph)
def get_attack_path():
    return forensics_engine.generate_attack_path_graph()

@router.get("/forensics/mitre")
def get_mitre_data():
    return forensics_engine.get_mitre_coverage()

@router.get("/forensics/export")
def export_forensic_evidence():
    events = forensics_engine.get_events(200)
    rules = defense_engine.get_all_rules()
    return {
        "report_id": f"REP-CYBERSHIELD-{uuid.uuid4().hex[:6].upper()}",
        "generated_at": datetime.datetime.utcnow().isoformat() + "Z",
        "total_incidents": len(events),
        "blocked_entities": len([r for r in rules if r.status == "BLOCKED"]),
        "events": [e.model_dump() for e in events],
        "active_firewall_rules": [r.model_dump() for r in rules]
    }

@router.post("/simulate")
async def run_simulation(req: SimulationRequest):
    result = simulator.simulate(req)
    await ws_manager.broadcast({
        "type": "NEW_ATTACK_EVENT",
        "data": result["event"]
    })
    return result
