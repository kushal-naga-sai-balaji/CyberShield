# 🛡️ CyberShield – AI-Powered Digital Attack Prediction & Deception System

**CyberShield** is an autonomous cybersecurity platform built around the **Predict → Deceive → Observe → Learn → Defend** paradigm. Instead of merely reacting to and blocking attacks, CyberShield anticipates attacker moves using machine learning, routes adversaries into dynamic adaptive honeypots, fingerprints & de-anonymizes them (detecting VPNs, WebRTC internal LAN IPs, real ephemeral ports, and layer-2 MAC addresses), maps their traversal on an interactive graph, and enforces automated defense policies.

---

## 🚀 Key Features

1. **🤖 AI-Based Threat Prediction & Sequence Anticipation**
   - **Ensemble Classifier (Scikit-Learn Random Forest + TF-IDF)** categorizes traffic into *Reconnaissance, Brute Force, Web Injection (SQLi/XSS), Privilege Escalation, Data Exfiltration, DDoS Probing, and Anomalies*.
   - **Markov Sequence Engine** predicts the attacker's next 3 likely moves across the MITRE ATT&CK kill-chain and recommends specific honeypot decoys.
   - **Dynamic Risk Scoring (0–100)** with real-time classification into *Low, Medium, High, and Critical*.

2. **🍯 Adaptive Honeypots & Canary Tripwires**
   - Automatically generates realistic fake administrative logins, simulated REST APIs, synthetic database dumps (`customer_financials_2026.sql`), and SSH tarpits (Port 2222).
   - Seeds **Canary Tokens** (`CANARY_TOKEN_JWT_ADM_9812`, `AKIA_CANARY_AWS_991823749`) that immediately trigger critical alerts and trace exfiltration attempts when accessed.

3. **🕵️ Multi-Vector De-Anonymization & Attacker Profiling**
   - **VPN / Proxy / Tor Exit Detection**: Matches known VPN ASNs, Tor relays, and proxy headers (`X-Forwarded-For`, `Via`).
   - **WebRTC Internal LAN IP Discovery**: Extracts real internal RFC1918 private IP addresses (e.g. `192.168.1.105`) leaked via browser STUN candidate reflex behind NAT/VPNs.
   - **Layer-2 MAC Address Resolution**: Resolves hardware MAC addresses via ARP cache for local subnet and lab network environments.
   - **Real Port Identification**: Correlates client source ephemeral ports (`54219`) and targeted ingress ports (`8000`, `2222`).
   - **Hardware & TLS Fingerprinting**: Computes Canvas 2D render hash, WebGL GPU string, OS detection, and JA3 TLS signatures.

4. **🧠 Interactive Attack-Path Graph Visualizer**
   - Visualizes live node pathways: `Attacker IP -> Probe Vector -> Deceptive Honeypot -> Canary Token -> Defensive Quarantine`.

5. **🛡️ Automated Defense & Firewall Quarantine**
   - Automatically blocks IPs exceeding critical risk thresholds or accessing canary tokens.
   - Real-time packet drop counters and sandbox session isolation toggles.

6. **📁 Digital Forensics & MITRE ATT&CK Matrix**
   - Replays intercepted sessions with full HTTP headers and raw request payloads.
   - Generates 1-click exportable **Forensic Incident Bundles (.JSON)**.

7. **🧪 Built-in Cyber Attack Simulation Laboratory**
   - 1-Click execution of 6 attack scenarios (Recon Scan, SSH Brute Force, SQL Injection, Canary Exfiltration, VPN-Cloaked Infiltration, Kernel Privilege Escalation) for live demonstrations.

---

## 🛠️ Tech Stack

- **Backend**: Python 3.9+, FastAPI, Uvicorn, Scikit-learn, NumPy, Pydantic, WebSockets
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Recharts, Canvas Confetti
- **Testing**: Pytest

---

## ⚡ Quick Start Instructions

### 1. Start Both Backend & Frontend
```bash
./start_cybershield.sh
```

Or run manually:

#### Backend:
```bash
cd /Users/sangineedikushal/.gemini/antigravity/scratch/cybershield
PYTHONPATH=backend ./venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

#### Frontend:
```bash
cd /Users/sangineedikushal/.gemini/antigravity/scratch/cybershield/frontend
npm run dev
```

### 2. Access the Platform
- **SOC Command Center UI**: [http://localhost:5173](http://localhost:5173)
- **FastAPI Backend Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
