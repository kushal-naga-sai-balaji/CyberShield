from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
import os

prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)

blank_slide_layout = prs.slide_layouts[6]

slides_data = [
    {
        "slide_num": 1,
        "bg_image": "presentation_assets/slide1.jpg",
        "badge": "AI & CYBER DEFENSE INNOVATION",
        "title": "CyberShield",
        "subtitle": "AI-Powered Digital Attack Prediction & Adaptive Deception System",
        "content_blocks": [
            ("Core Concept", "An autonomous cybersecurity platform that flips the advantage against cyber attackers by predicting their next moves, trapping them in realistic decoy environments, and neutralizing threats before data breaches occur."),
            ("Key Paradigm", "PREDICT  ->  DECEIVE  ->  OBSERVE  ->  LEARN  ->  DEFEND"),
            ("Design Philosophy", "Move beyond reactive 'detect-and-block' firewalls by combining AI threat prediction, adaptive honeypots, attacker de-anonymization, and automated defense.")
        ],
        "takeaway": "Deception-based defense gives defenders the upper hand by confusing and trapping adversaries instead of just blocking them."
    },
    {
        "slide_num": 2,
        "bg_image": "presentation_assets/slide2.jpg",
        "badge": "THE CYBERSECURITY PROBLEM",
        "title": "Why Traditional Firewalls Fail",
        "subtitle": "The fundamental flaw in reactive 'Detect & Block' security models",
        "content_blocks": [
            ("The Attacker Asymmetry", "Traditional firewalls only react after an attack hits. Attackers get unlimited free attempts to probe, scan, and find a single weakness."),
            ("Cloaked Infiltration", "Modern adversaries hide behind VPNs, Tor exit nodes, and residential proxies. When blocked, they immediately switch to a new IP address in seconds."),
            ("Zero-Day Blindspots", "Signature-based antivirus tools cannot stop unknown zero-day exploits. Once inside, hackers move laterally undetected for an average of 200+ days.")
        ],
        "takeaway": "Defenders must succeed 100% of the time, while attackers only need to find ONE flaw. CyberShield flips this asymmetry."
    },
    {
        "slide_num": 3,
        "bg_image": "presentation_assets/slide3.jpg",
        "badge": "THE NEW STRATEGY",
        "title": "The CyberShield Paradigm",
        "subtitle": "Shifting from reactive defense to proactive deception & behavioral analysis",
        "content_blocks": [
            ("1. Predict", "AI analyzes incoming traffic patterns, headers, and commands to forecast the attacker's next moves."),
            ("2. Deceive", "Instead of showing a 403 Forbidden error, the system feeds attackers realistic fake data, simulated portals, and dummy databases."),
            ("3. Observe & Defend", "Hackers spend hours exploiting useless decoy traps while CyberShield extracts threat intelligence and executes automated firewall drops.")
        ],
        "takeaway": "By feeding fake data instead of errors, you keep hackers busy attacking illusions while you collect their forensic fingerprints."
    },
    {
        "slide_num": 4,
        "bg_image": "presentation_assets/slide4.jpg",
        "badge": "ARTIFICIAL INTELLIGENCE CORE",
        "title": "AI Attack Prediction & Kill-Chain Foresight",
        "subtitle": "Anticipating the adversary's next 3 steps using Machine Learning & Markov Models",
        "content_blocks": [
            ("Random Forest Classifier", "Categorizes incoming payloads in sub-2ms into: Reconnaissance, Brute Force, Web Injection, Privilege Escalation, and Exfiltration."),
            ("Markov Kill-Chain Engine", "Maps MITRE ATT&CK progression: e.g., Recon scan triggers 48% probability of SQL Injection, preparing decoy database traps in advance."),
            ("Dynamic Risk Scoring", "Calculates payload entropy, signature confidence, and reputation score to assign Low, Medium, High, or Critical threat tiers (0 to 100).")
        ],
        "takeaway": "Markov Transition Chains model the hacker's kill-chain flow, allowing defenders to set traps BEFORE the hacker executes the exploit."
    },
    {
        "slide_num": 5,
        "bg_image": "presentation_assets/slide5.jpg",
        "badge": "ACTIVE DECEPTION LAYER",
        "title": "Adaptive Honeypots & Canary Tripwires",
        "subtitle": "Planting digital landmines and fake assets to mislead and trap hackers",
        "content_blocks": [
            ("Dynamic Decoy Services", "Automatically deploys fake Admin Portals (/admin/auth), dummy REST APIs, synthetic database dumps, and infinite SSH tarpits (Port 2222)."),
            ("What is a Canary Token?", "Planted fake AWS API keys and JWT tokens. The moment an attacker steals or queries with them, an instant high-priority alarm fires."),
            ("Cognitive Confusion for Hackers", "Attackers believe they have breached sensitive databases, wasting their time and resources on fabricated zero-value data.")
        ],
        "takeaway": "Canary Tokens act like radioactive dye: when an attacker steals them, any attempt to use them instantly triggers a critical alert."
    },
    {
        "slide_num": 6,
        "bg_image": "presentation_assets/slide6.jpg",
        "badge": "THREAT ATTRIBUTION",
        "title": "Attacker De-Anonymization & Physical GPS Mapping",
        "subtitle": "Unmasking adversaries hidden behind commercial VPNs, Proxies, and Tor gateways",
        "content_blocks": [
            ("VPN & Proxy Detection", "Identifies commercial VPN tunnels (Nord, Mullvad, M247) and Tor exit relays by analyzing TCP TTL, MTU sizes, and ASN databases."),
            ("WebRTC Internal LAN IP Leak", "Extracts the attacker's real private internal subnet IP (e.g. 192.168.1.54) leaked through browser STUN candidate reflex exchange."),
            ("Layer-2 MAC & Real Port Tracking", "Resolves hardware MAC addresses via ARP cache in lab setups, and tracks the exact source ephemeral socket port (e.g. 53500) and GPS location.")
        ],
        "takeaway": "Browser WebRTC STUN protocols and TCP packet timing can reveal a hacker's true private IP and physical location even behind VPNs."
    },
    {
        "slide_num": 7,
        "bg_image": "presentation_assets/slide7.jpg",
        "badge": "AUTONOMOUS RESPONSE",
        "title": "Automated Defense & Kernel Firewall",
        "subtitle": "Instant mitigation without requiring manual operator intervention",
        "content_blocks": [
            ("Auto-Firewall Blacklisting", "When risk score exceeds 72/100 or a Canary token is tripped, CyberShield instantly enforces a kernel-level IP_DROP_BLOCK rule."),
            ("Deception Sandbox Isolation", "Suspicious intermediate sessions (Score 50-70) are silently routed to an isolated container sandbox where malware can be safely studied."),
            ("Dropped Packet Telemetry", "Monitors dropped attack requests, maintains active quarantine logs, and allows one-click operator override (Block/Unblock).")
        ],
        "takeaway": "Automated response closes the critical time gap between threat detection and containment, preventing lateral movement."
    },
    {
        "slide_num": 8,
        "bg_image": "presentation_assets/slide8.jpg",
        "badge": "SITUATIONAL AWARENESS",
        "title": "Attack-Path Visualizer & SOC Operations",
        "subtitle": "Mapping real-time intrusion flow and enterprise MITRE ATT&CK coverage",
        "content_blocks": [
            ("Interactive Traversal Graph", "Renders animated visual paths: Attacker IP  ->  Probe Vector  ->  Honeypot Decoy  ->  Canary Token  ->  Quarantine."),
            ("MITRE ATT&CK Matrix Alignment", "Maps each attack event to standard industry techniques (T1595 Recon, T1110 Brute Force, T1190 Exploit, T1068 Priv-Esc, T1048 Exfiltration)."),
            ("Digital Forensics Vault", "Records raw HTTP headers, payload hex strings, timestamps, and generates 1-click exportable Forensic Incident JSON reports.")
        ],
        "takeaway": "Graph-based visualization transforms confusing log files into clear visual stories showing how the attacker was outsmarted step-by-step."
    },
    {
        "slide_num": 9,
        "bg_image": "presentation_assets/slide9.jpg",
        "badge": "EVALUATION & VERIFICATION",
        "title": "Interactive Cyber Attack Simulation Lab",
        "subtitle": "Testing the autonomous defense pipeline with realistic multi-vector cyber attacks",
        "content_blocks": [
            ("Multi-Vector Attack Suite", "1-Click simulation of Reconnaissance Scans, SSH Brute Force on port 2222, SQL Injection, and Canary Exfiltration."),
            ("VPN Cloaking Test", "Validates WebRTC LAN IP de-cloaking, real ephemeral port discovery, and physical GPS coordinate mapping."),
            ("Real-Time Verification", "Proves that predictive models, honeypot traps, and auto-drop firewall rules work in harmony under realistic cyber conditions.")
        ],
        "takeaway": "Simulation testing validates that AI classifiers, honeypots, and firewalls work in harmony under realistic cyber combat conditions."
    },
    {
        "slide_num": 10,
        "bg_image": "presentation_assets/slide10.jpg",
        "badge": "CONCLUSION & IMPACT",
        "title": "The Future of Proactive Cyber Defense",
        "subtitle": "Empowering both enterprise real-time security and next-generation cybersecurity training",
        "content_blocks": [
            ("Key Architectural Takeaway", "CyberShield turns the defender's dilemma upside down: defenders no longer need to be right 100% of the time, because attackers are trapped in illusions."),
            ("Dual Purpose Utility", "Serves as an autonomous perimeter defense mesh for enterprises, and as a safe digital forensic sandbox for cybersecurity education."),
            ("Full Technology Stack", "Python FastAPI, Scikit-Learn, PyTorch, React, Tailwind CSS, WebSockets, and GPS Geolocation Engine.")
        ],
        "takeaway": "Deception technology combined with AI prediction represents the next frontier in proactive cyber resilience."
    }
]

for s_idx, data in enumerate(slides_data):
    slide = prs.slides.add_slide(blank_slide_layout)
    
    # 1. Background Image (Full Bleed across entire slide)
    if os.path.exists(data["bg_image"]):
        slide.shapes.add_picture(data["bg_image"], 0, 0, width=prs.slide_width, height=prs.slide_height)

    # 2. Add Center Semi-Transparent Frosted Glassmorphism Card Overlay
    card_width = Inches(10.6)
    card_height = Inches(6.1)
    card_left = (prs.slide_width - card_width) / 2
    card_top = (prs.slide_height - card_height) / 2

    overlay = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, card_left, card_top, card_width, card_height)
    overlay.fill.solid()
    overlay.fill.fore_color.rgb = RGBColor(6, 10, 19)
    overlay.fill.transparency = 0.18
    overlay.line.color.rgb = RGBColor(6, 182, 212)
    overlay.line.width = Pt(1.5)

    # 3. Centered Content Text Frame
    tb = slide.shapes.add_textbox(card_left + Inches(0.5), card_top + Inches(0.35), card_width - Inches(1.0), card_height - Inches(0.7))
    tf = tb.text_frame
    tf.word_wrap = True

    # Badge (Centered)
    p0 = tf.paragraphs[0]
    p0.text = f"SLIDE {data['slide_num']} OF 10  •  [ {data['badge']} ]"
    p0.font.size = Pt(11)
    p0.font.bold = True
    p0.font.color.rgb = RGBColor(6, 182, 212)
    p0.alignment = PP_ALIGN.CENTER

    # Title (Centered)
    p1 = tf.add_paragraph()
    p1.text = data["title"]
    p1.font.size = Pt(30 if data["slide_num"] > 1 else 36)
    p1.font.bold = True
    p1.font.color.rgb = RGBColor(255, 255, 255)
    p1.alignment = PP_ALIGN.CENTER
    p1.space_before = Pt(4)

    # Subtitle (Centered)
    p2 = tf.add_paragraph()
    p2.text = data["subtitle"]
    p2.font.size = Pt(13)
    p2.font.color.rgb = RGBColor(147, 197, 253)
    p2.alignment = PP_ALIGN.CENTER
    p2.space_after = Pt(14)

    # 3 Content Blocks (Centered layout)
    for heading, body in data["content_blocks"]:
        p_item = tf.add_paragraph()
        p_item.text = f"▶ {heading}"
        p_item.font.size = Pt(14)
        p_item.font.bold = True
        p_item.font.color.rgb = RGBColor(56, 189, 248)
        p_item.alignment = PP_ALIGN.CENTER

        p_desc = tf.add_paragraph()
        p_desc.text = body
        p_desc.font.size = Pt(11.5)
        p_desc.font.color.rgb = RGBColor(226, 232, 240)
        p_desc.alignment = PP_ALIGN.CENTER
        p_desc.space_after = Pt(6)

    # Key Takeaway Footer (Centered)
    p_takeaway = tf.add_paragraph()
    p_takeaway.text = f"💡 Key Cybersecurity Takeaway: {data['takeaway']}"
    p_takeaway.font.size = Pt(10.5)
    p_takeaway.font.bold = True
    p_takeaway.font.color.rgb = RGBColor(253, 224, 71)
    p_takeaway.alignment = PP_ALIGN.CENTER
    p_takeaway.space_before = Pt(6)

output_path = "CyberShield_Presentation.pptx"
prs.save(output_path)
print(f"[✓] Centered PowerPoint presentation generated at: {output_path}")
