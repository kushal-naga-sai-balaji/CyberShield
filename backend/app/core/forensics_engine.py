"""
CyberShield Digital Forensics & Attack Path Visualizer Engine
"""
import datetime
from typing import List, Dict, Any, Optional
from app.models.schemas import AttackEvent, AttackPathGraph, AttackPathNode, AttackPathEdge, ThreatLevel

class ForensicsEngine:
    def __init__(self):
        self.events_history: List[AttackEvent] = []
        self.max_events = 200

    def record_event(self, event: AttackEvent):
        self.events_history.insert(0, event)
        if len(self.events_history) > self.max_events:
            self.events_history.pop()

    def get_events(self, limit: int = 50) -> List[AttackEvent]:
        return self.events_history[:limit]

    def get_event_by_id(self, event_id: str) -> Optional[AttackEvent]:
        for e in self.events_history:
            if e.id == event_id:
                return e
        return None

    def generate_attack_path_graph(self) -> AttackPathGraph:
        """
        Constructs real-time interactive attack path visualizer nodes and edges.
        Shows: Attacker IP -> Vector -> Honeypot Decoy -> Canary Token -> Defense Action
        """
        nodes: List[AttackPathNode] = []
        edges: List[AttackPathEdge] = []
        node_ids = set()

        def add_node(n: AttackPathNode):
            if n.id not in node_ids:
                nodes.append(n)
                node_ids.add(n.id)

        # Process the most recent 15 events to generate active attack path graph
        sample_events = self.events_history[:15]
        
        for ev in sample_events:
            # 1. Attacker Node
            attacker_node_id = f"attacker_{ev.source_ip}"
            vpn_tag = f" [VPN: {ev.fingerprint.proxy_type}]" if (ev.fingerprint and ev.fingerprint.proxy_vpn_detected) else ""
            lan_tag = f" (LAN: {ev.fingerprint.local_ip_webrtc})" if (ev.fingerprint and ev.fingerprint.local_ip_webrtc) else ""
            
            add_node(AttackPathNode(
                id=attacker_node_id,
                label=f"Attacker: {ev.source_ip}{vpn_tag}{lan_tag}",
                type="attacker",
                threat_level=ev.threat_level,
                timestamp=ev.timestamp,
                details={
                    "ip": ev.source_ip,
                    "mac": ev.fingerprint.mac_address_lan if ev.fingerprint else "N/A",
                    "port": ev.fingerprint.real_source_port if ev.fingerprint else 80,
                    "os": ev.fingerprint.os_detected if ev.fingerprint else "Linux",
                    "proxy": ev.fingerprint.proxy_type if ev.fingerprint else "None"
                }
            ))

            # 2. Vector / Probe Node
            vector_node_id = f"vector_{ev.id}"
            add_node(AttackPathNode(
                id=vector_node_id,
                label=f"{ev.classification.value} Probe ({ev.target_endpoint})",
                type="vector",
                threat_level=ev.threat_level,
                timestamp=ev.timestamp,
                details={
                    "confidence": ev.confidence,
                    "risk_score": ev.risk_score,
                    "payload_snippet": ev.payload[:60] if ev.payload else "N/A"
                }
            ))
            
            edges.append(AttackPathEdge(
                id=f"edge_att_vec_{ev.id}",
                source=attacker_node_id,
                target=vector_node_id,
                label=f"Port {ev.fingerprint.real_source_port if ev.fingerprint else 80} -> {ev.target_endpoint}"
            ))

            # 3. Honeypot Decoy Trapped Node
            if ev.honeypot_hit:
                hp_node_id = f"hp_{ev.id}"
                add_node(AttackPathNode(
                    id=hp_node_id,
                    label=f"🍯 Honeypot Trap: {ev.honeypot_hit}",
                    type="honeypot",
                    threat_level=ev.threat_level,
                    timestamp=ev.timestamp,
                    details={"decoy_name": ev.honeypot_hit}
                ))
                edges.append(AttackPathEdge(
                    id=f"edge_vec_hp_{ev.id}",
                    source=vector_node_id,
                    target=hp_node_id,
                    label="Routed to Deception Env"
                ))

                # 4. Canary Token Node (if tripped)
                if ev.canary_token_tripped:
                    canary_node_id = f"canary_{ev.id}"
                    add_node(AttackPathNode(
                        id=canary_node_id,
                        label=f"🚨 Canary Tripped: {ev.canary_token_tripped}",
                        type="canary",
                        threat_level=ThreatLevel.CRITICAL,
                        timestamp=ev.timestamp,
                        details={"token": ev.canary_token_tripped}
                    ))
                    edges.append(AttackPathEdge(
                        id=f"edge_hp_canary_{ev.id}",
                        source=hp_node_id,
                        target=canary_node_id,
                        label="Canary Key Exfiltrated"
                    ))

            # 5. Defense Action Node
            defense_node_id = f"def_{ev.id}"
            is_blocked = ev.defense_action.value == "IP_DROP_BLOCK"
            add_node(AttackPathNode(
                id=defense_node_id,
                label=f"🛡️ Action: {ev.defense_action.value}",
                type="defense" if not is_blocked else "quarantine",
                threat_level=ThreatLevel.CRITICAL if is_blocked else ThreatLevel.MEDIUM,
                timestamp=ev.timestamp,
                details={"action": ev.defense_action.value, "is_blocked": ev.is_blocked}
            ))
            
            src_for_defense = f"canary_{ev.id}" if ev.canary_token_tripped else (f"hp_{ev.id}" if ev.honeypot_hit else vector_node_id)
            edges.append(AttackPathEdge(
                id=f"edge_to_def_{ev.id}",
                source=src_for_defense,
                target=defense_node_id,
                label="Automated Defense Execution"
            ))

        return AttackPathGraph(nodes=nodes, edges=edges)

    def get_mitre_coverage(self) -> Dict[str, Any]:
        tactics_count = {}
        techniques_count = {}
        for ev in self.events_history:
            for t in ev.mitre_tactics:
                tactics_count[t] = tactics_count.get(t, 0) + 1
            for tech in ev.mitre_techniques:
                techniques_count[tech] = techniques_count.get(tech, 0) + 1
                
        return {
            "tactics": tactics_count,
            "techniques": techniques_count,
            "total_incidents": len(self.events_history)
        }

forensics_engine = ForensicsEngine()
