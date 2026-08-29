"""
CyberShield Adaptive Honeypot & AI Deception Core
"""
import uuid
import datetime
import random
from typing import Dict, List, Optional, Any, Tuple
from app.models.schemas import HoneypotAsset

class HoneypotDeceptionEngine:
    def __init__(self):
        self.honeypots: Dict[str, HoneypotAsset] = {}
        self.canary_tokens: Dict[str, Dict[str, Any]] = {}
        self._seed_default_honeypots()

    def _seed_default_honeypots(self):
        default_decoys = [
            HoneypotAsset(
                id="hp_admin_portal",
                name="Fake Executive Admin Portal",
                type="fake_admin",
                decoy_path="/admin/v2/master_auth",
                description="Simulated executive management login with deceptive slow-response tarpit and canary JWT seeds.",
                hits_count=14,
                canary_token="CANARY_TOKEN_JWT_ADM_9812",
                fake_data_preview={
                    "status": "Authentication required",
                    "server_signature": "CyberShield-Deception-v2.4",
                    "admin_hint": "Decoy root credentials stored in /etc/shadow_backup"
                },
                active=True,
                created_at=datetime.datetime.utcnow().isoformat() + "Z"
            ),
            HoneypotAsset(
                id="hp_env_secrets",
                name="Synthetic Cloud .env Credentials",
                type="fake_file",
                decoy_path="/.env.production",
                description="Planted configuration file with high-value canary AWS and Stripe API keys.",
                hits_count=29,
                canary_token="AKIA_CANARY_AWS_991823749",
                fake_data_preview={
                    "AWS_ACCESS_KEY_ID": "AKIA_CANARY_AWS_991823749",
                    "AWS_SECRET_KEY": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY_CANARY",
                    "STRIPE_API_KEY": "sk_live_canary_51Nz849204810238491",
                    "DB_PASSWORD": "P@ssw0rdDecoy_Secret_2026!"
                },
                active=True,
                created_at=datetime.datetime.utcnow().isoformat() + "Z"
            ),
            HoneypotAsset(
                id="hp_db_backup",
                name="Canary Customer Database SQL Dump",
                type="canary_db",
                decoy_path="/backup/customer_financials_2026.sql",
                description="Decoy database export containing watermarked fake credit card numbers and canary email triggers.",
                hits_count=8,
                canary_token="CANARY_SQL_TRIPWIRE_USER_4920",
                fake_data_preview={
                    "table": "customers_encrypted",
                    "rows_count": 5000,
                    "watermark": "CANARY_SIG_ALPHA_8891",
                    "sample_record": "(10492, Honey-User-VIP, 4111-XXXX-XXXX-9912, canary_trap@decoycorp.internal)"
                },
                active=True,
                created_at=datetime.datetime.utcnow().isoformat() + "Z"
            ),
            HoneypotAsset(
                id="hp_fake_api",
                name="Shadow Microservice REST API",
                type="fake_api",
                decoy_path="/api/internal/v1/debug_token_exchange",
                description="Vulnerable-looking REST API endpoint that accepts SQL injection and provides synthetic leak telemetry.",
                hits_count=42,
                canary_token="CANARY_API_BEARER_TOKEN_7721",
                fake_data_preview={
                    "service": "Internal-Wallet-Orchestrator",
                    "debug_mode": True,
                    "canary_token": "CANARY_API_BEARER_TOKEN_7721",
                    "memory_dump": "0x7FFF9A8B: [DECOY_BUFFER_OVERFLOW_TARGET]"
                },
                active=True,
                created_at=datetime.datetime.utcnow().isoformat() + "Z"
            ),
            HoneypotAsset(
                id="hp_ssh_tarpit",
                name="Simulated SSH Tarpit (Port 2222)",
                type="fake_ssh",
                decoy_path="/simulated_ssh/port_2222",
                description="Interactive pseudo-terminal sandbox that traps automated brute-force scripts into an infinite loop.",
                hits_count=67,
                canary_token="CANARY_SSH_KEY_RSA_4096_HONEY",
                fake_data_preview={
                    "ssh_banner": "OpenSSH_8.9p1 Ubuntu-3ubuntu0.1",
                    "auth_method": "password,publickey",
                    "session_timeout": "Infinite Tarpit (Deception Sandbox)"
                },
                active=True,
                created_at=datetime.datetime.utcnow().isoformat() + "Z"
            )
        ]
        
        for hp in default_decoys:
            self.honeypots[hp.id] = hp
            if hp.canary_token:
                self.canary_tokens[hp.canary_token] = {
                    "honeypot_id": hp.id,
                    "honeypot_name": hp.name,
                    "created_at": hp.created_at,
                    "tripped_count": 0,
                    "last_tripped": None
                }

    def check_and_match_honeypot(self, path: str, payload: str) -> Tuple[Optional[HoneypotAsset], Optional[str]]:
        tripped_canary = None
        matched_hp = None
        
        # Check canary tokens in payload
        for token, metadata in self.canary_tokens.items():
            if token in payload:
                tripped_canary = token
                metadata["tripped_count"] += 1
                metadata["last_tripped"] = datetime.datetime.utcnow().isoformat() + "Z"
                matched_hp = self.honeypots.get(metadata["honeypot_id"])
                break
                
        # Check path matching
        if not matched_hp:
            for hp in self.honeypots.values():
                if hp.decoy_path.lower() in path.lower() or path.lower() in hp.decoy_path.lower():
                    matched_hp = hp
                    hp.hits_count += 1
                    break
                    
        return matched_hp, tripped_canary

    def generate_adaptive_deception_response(self, honeypot: Optional[HoneypotAsset], vector: str, payload: str) -> Dict[str, Any]:
        if honeypot:
            return {
                "deception_status": "ENGAGED",
                "honeypot_name": honeypot.name,
                "decoy_type": honeypot.type,
                "deceptive_payload": honeypot.fake_data_preview,
                "canary_token_embedded": honeypot.canary_token,
                "http_status_simulated": 200 if honeypot.type in ["fake_file", "fake_api"] else 401
            }
            
        if "sql" in payload.lower() or "union" in payload.lower() or vector == "WEB_INJECTION":
            canary = f"CANARY_SQL_AUTOGEN_{random.randint(1000, 9999)}"
            return {
                "deception_status": "DYNAMIC_SYNTHESIS",
                "honeypot_name": "Dynamic SQL Injection Tarpit",
                "decoy_type": "canary_db",
                "deceptive_payload": {
                    "sql_error": "Syntax warning in query near UNION SELECT 1...",
                    "leaked_record": {
                        "id": random.randint(100, 999),
                        "username": "decoy_db_admin",
                        "password_hash": "$2y$12$e8YkYCanaryDecoyHashToAnalyzeAttackerBehavior",
                        "canary_token": canary
                    }
                },
                "canary_token_embedded": canary,
                "http_status_simulated": 200
            }
        elif vector == "BRUTE_FORCE":
            return {
                "deception_status": "DYNAMIC_SYNTHESIS",
                "honeypot_name": "Dynamic Auth Tarpit Delay",
                "decoy_type": "fake_admin",
                "deceptive_payload": {
                    "error": "Invalid credential attempt 4 of 5. IP telemetry logged.",
                    "challenge_nonce": uuid.uuid4().hex,
                    "synthetic_delay_ms": 1250
                },
                "canary_token_embedded": None,
                "http_status_simulated": 401
            }
        else:
            return {
                "deception_status": "PASSIVE_OBSERVATION",
                "honeypot_name": "Decoy Generic Sinkhole",
                "decoy_type": "generic_decoy",
                "deceptive_payload": {
                    "status": "Decoy node operational",
                    "server_id": "SRV-TRAP-092"
                },
                "canary_token_embedded": None,
                "http_status_simulated": 200
            }

    def get_all_honeypots(self) -> List[HoneypotAsset]:
        return list(self.honeypots.values())

    def create_custom_honeypot(self, name: str, decoy_type: str, decoy_path: str, description: str, fake_data: Dict[str, Any]) -> HoneypotAsset:
        hp_id = f"hp_{uuid.uuid4().hex[:8]}"
        canary = f"CANARY_{uuid.uuid4().hex[:12].upper()}"
        hp = HoneypotAsset(
            id=hp_id,
            name=name,
            type=decoy_type,
            decoy_path=decoy_path,
            description=description,
            hits_count=0,
            canary_token=canary,
            fake_data_preview=fake_data,
            active=True,
            created_at=datetime.datetime.utcnow().isoformat() + "Z"
        )
        self.honeypots[hp_id] = hp
        self.canary_tokens[canary] = {
            "honeypot_id": hp_id,
            "honeypot_name": hp.name,
            "created_at": hp.created_at,
            "tripped_count": 0,
            "last_tripped": None
        }
        return hp

honeypot_engine = HoneypotDeceptionEngine()
