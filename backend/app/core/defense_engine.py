"""
CyberShield Automated Defense & Firewall Quarantine Engine (with GPS Support)
"""
import datetime
import uuid
from typing import Dict, List, Optional, Tuple
from app.models.schemas import FirewallRule, ThreatLevel, DefenseActionType, AttackerFingerprint, GeoLocation

class DefenseEngine:
    def __init__(self):
        self.firewall_rules: Dict[str, FirewallRule] = {}
        self.auto_block_threshold: float = 72.0
        self._seed_default_rules()

    def _seed_default_rules(self):
        rules = [
            FirewallRule(
                id="fw_seed_01",
                ip="194.26.29.112",
                reason="Automatic Block: Credential Stuffing & Canary Token Trip on SSH Tarpit",
                threat_level=ThreatLevel.CRITICAL,
                risk_score=94.5,
                blocked_at=datetime.datetime.utcnow().isoformat() + "Z",
                status="BLOCKED",
                packets_dropped=412,
                local_lan_mac="C4:7D:4F:92:11:AB (Lab Network Resolved)",
                real_ports_tracked=[51294, 51295, 51301],
                geo=GeoLocation(
                    latitude=44.4268,
                    longitude=26.1025,
                    city="Bucharest",
                    region="Ilfov",
                    country="Romania",
                    country_code="RO",
                    timezone="Europe/Bucharest",
                    isp="Clouvider Bulletproof Host",
                    flag_emoji="🇷🇴"
                )
            ),
            FirewallRule(
                id="fw_seed_02",
                ip="185.220.101.5",
                reason="Automatic Isolation: Tor Exit Node SQL Injection Attack",
                threat_level=ThreatLevel.HIGH,
                risk_score=87.2,
                blocked_at=datetime.datetime.utcnow().isoformat() + "Z",
                status="QUARANTINED",
                packets_dropped=189,
                local_lan_mac="08:00:27:EA:9B:41 (Lab Network Resolved)",
                real_ports_tracked=[49152, 49153],
                geo=GeoLocation(
                    latitude=52.3676,
                    longitude=4.9041,
                    city="Amsterdam",
                    region="North Holland",
                    country="Netherlands",
                    country_code="NL",
                    timezone="Europe/Amsterdam",
                    isp="Tor Exit Relay / M247 Ltd",
                    flag_emoji="🇳🇱"
                )
            )
        ]
        for r in rules:
            self.firewall_rules[r.ip] = r

    def evaluate_and_enforce(
        self,
        ip: str,
        risk_score: float,
        threat_level: ThreatLevel,
        vector: str,
        canary_tripped: Optional[str],
        fingerprint: AttackerFingerprint
    ) -> Tuple[DefenseActionType, bool, Optional[FirewallRule]]:
        if ip in self.firewall_rules and self.firewall_rules[ip].status == "BLOCKED":
            rule = self.firewall_rules[ip]
            rule.packets_dropped += 1
            if fingerprint.real_source_port not in rule.real_ports_tracked:
                rule.real_ports_tracked.append(fingerprint.real_source_port)
            if not rule.geo and fingerprint.geo:
                rule.geo = fingerprint.geo
            return DefenseActionType.IP_DROP_BLOCK, True, rule

        should_block = (risk_score >= self.auto_block_threshold) or (canary_tripped is not None) or (threat_level == ThreatLevel.CRITICAL)
        
        if should_block:
            reason = f"Automated AI Defense: High Risk {vector} (Score: {risk_score})"
            if canary_tripped:
                reason = f"CRITICAL TRIPWIRE: Canary Token Access ({canary_tripped})"
                
            rule = FirewallRule(
                id=f"fw_{uuid.uuid4().hex[:8]}",
                ip=ip,
                reason=reason,
                threat_level=threat_level,
                risk_score=risk_score,
                blocked_at=datetime.datetime.utcnow().isoformat() + "Z",
                status="BLOCKED",
                packets_dropped=1,
                local_lan_mac=fingerprint.mac_address_lan,
                real_ports_tracked=[fingerprint.real_source_port],
                geo=fingerprint.geo
            )
            self.firewall_rules[ip] = rule
            return DefenseActionType.IP_DROP_BLOCK, True, rule

        elif risk_score >= 50.0:
            return DefenseActionType.ISOLATE_SANDBOX, False, None
        elif risk_score >= 30.0:
            return DefenseActionType.DECEIVE_ROUTE, False, None
        else:
            return DefenseActionType.ALLOW, False, None

    def get_all_rules(self) -> List[FirewallRule]:
        return list(self.firewall_rules.values())

    def unblock_ip(self, ip: str) -> bool:
        if ip in self.firewall_rules:
            self.firewall_rules[ip].status = "UNBLOCKED"
            return True
        return False

    def quarantine_ip(self, ip: str) -> bool:
        if ip in self.firewall_rules:
            self.firewall_rules[ip].status = "QUARANTINED"
            return True
        return False

    def manual_block_ip(self, ip: str, reason: str = "Manual SOC Operator Block", geo: Optional[GeoLocation] = None) -> FirewallRule:
        rule = FirewallRule(
            id=f"fw_manual_{uuid.uuid4().hex[:6]}",
            ip=ip,
            reason=reason,
            threat_level=ThreatLevel.HIGH,
            risk_score=85.0,
            blocked_at=datetime.datetime.utcnow().isoformat() + "Z",
            status="BLOCKED",
            packets_dropped=0,
            local_lan_mac="Resolved via Manual Operator",
            real_ports_tracked=[8000],
            geo=geo
        )
        self.firewall_rules[ip] = rule
        return rule

defense_engine = DefenseEngine()
