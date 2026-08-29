"""
CyberShield Core Unit Tests
"""
import pytest
from app.core.ml_engine import ml_engine
from app.core.honeypot_engine import honeypot_engine
from app.core.fingerprint_engine import fingerprint_engine
from app.core.defense_engine import defense_engine
from app.models.schemas import AttackVector, ThreatLevel, SimulationRequest
from app.core.simulator import simulator

def test_ml_prediction_sqli():
    vector, conf, risk, threat, next_moves, tactics, techniques = ml_engine.analyze_payload(
        target_endpoint="/api/v1/users",
        payload="1 UNION SELECT 1,username,password FROM users--",
        headers={"User-Agent": "sqlmap"}
    )
    assert vector == AttackVector.WEB_INJECTION
    assert risk >= 70.0
    assert len(next_moves) > 0
    assert "T1190" in techniques[0]

def test_honeypot_canary_detection():
    hp, canary = honeypot_engine.check_and_match_honeypot(
        path="/.env.production",
        payload="Exfiltrating CANARY_TOKEN_JWT_ADM_9812"
    )
    assert canary == "CANARY_TOKEN_JWT_ADM_9812"

def test_fingerprinting_vpn_and_mac():
    fp = fingerprint_engine.inspect_and_de_anonymize(
        client_ip="185.220.101.5",
        client_port=54219,
        headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"},
        client_telemetry={"force_vpn": True}
    )
    assert fp.proxy_vpn_detected is True
    assert fp.local_ip_webrtc is not None
    assert fp.real_source_port == 54219
    assert fp.mac_address_lan is not None

def test_auto_defense_blocking():
    fp = fingerprint_engine.inspect_and_de_anonymize("203.0.113.99", 59999)
    action, is_blocked, rule = defense_engine.evaluate_and_enforce(
        ip="203.0.113.99",
        risk_score=95.0,
        threat_level=ThreatLevel.CRITICAL,
        vector="PRIVILEGE_ESCALATION",
        canary_tripped=None,
        fingerprint=fp
    )
    assert is_blocked is True
    assert action.value == "IP_DROP_BLOCK"
    assert rule is not None
    assert rule.status == "BLOCKED"

def test_simulator_full_flow():
    res = simulator.simulate(SimulationRequest(scenario="canary_exfil"))
    assert res["status"] == "SIMULATION_PROCESSED"
    assert res["summary"]["risk_score"] >= 95.0
    assert res["summary"]["is_blocked"] is True
