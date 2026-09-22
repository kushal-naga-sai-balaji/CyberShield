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
        ]
    },
    {
        "slide_num": 2,
        "bg_image": "presentation_assets/slide2.jpg",
        "badge": "THE CYBERSECURITY PROBLEM",
        "title": "Why Traditional Firewalls Fail",
        "subtitle": "The fundamental flaw in reactive 'Detect & Block' security models",
        "content_blocks": [
            ("The Attacker Asymmetry", "Traditional firewalls only react after an attack hits. Attackers get unlimited free attempts to probe, scan, and find a single weakness."),
            ("Cloaked Infiltration", "Modern adversaries hide behind VPNs, Tor exit nodes, and residential proxies. When blocked, they immediately switch to a new IP address."),
            ("Zero-Day Blindspots", "Signature-based antivirus tools cannot stop unknown zero-day exploits. Once inside, hackers move laterally undetected for an average of 200+ days.")
        ]
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
            ("3. Observe & Learn", "Adversaries spend hours hacking useless decoy traps while CyberShield records their tools, fingerprints, and techniques."),
            ("4. Defend", "The system automatically unmasks real IP/MAC addresses, extracts threat intelligence, and executes automated firewall drop rules.")
        ]
    },
    {
        "slide_num": 4,
        "bg_image": "presentation_assets/slide4.jpg",
        "badge": "ARTIFICIAL INTELLIGENCE CORE",
        "title": "AI Attack Prediction & Kill-Chain Foresight",
        "subtitle": "Anticipating the adversary's next 3 steps using Machine Learning & Markov Models",
        "content_blocks": [
            ("Random Forest Classifier", "Categorizes incoming payloads in sub-2ms into: Reconnaissance, Brute Force, Web Injection (SQLi/XSS), Privilege Escalation, and Data Exfiltration."),
            ("Markov Kill-Chain Sequence Engine", "Maps the MITRE ATT&CK progression. Example: If an attacker runs a Recon scan, CyberShield calculates a 48% probability of SQL Injection and automatically prepares decoy database traps in advance."),
            ("Dynamic Risk Scoring (0 to 100)", "Calculates payload entropy, signature confidence, and reputation score to assign Low, Medium, High, or Critical threat tiers.")
        ]
    },
    {
        "slide_num": 5,
        "bg_image": "presentation_assets/slide5.jpg",
        "badge": "ACTIVE DECEPTION LAYER",
        "title": "Adaptive Honeypots & Canary Tripwires",
        "subtitle": "Planting digital landmines and fake assets to mislead and trap hackers",
        "content_blocks": [
            ("Dynamic Decoy Services", "Automatically deploys fake Admin Portals (/admin/auth), dummy REST APIs, synthetic database dumps (customer_financials.sql), and infinite SSH tarpits (Port 2222)."),
            ("What is a Canary Token?", "A digital tripwire! CyberShield plants watermarked fake AWS API keys and JWT tokens. The moment an attacker steals or uses them, an instant high-priority alarm fires."),
            ("Cognitive Confusion for Hackers", "Attackers believe they have breached sensitive databases, wasting their time and resources on fabricated zero-value data.")
        ]
    },
    {
        "slide_num": 6,
        "bg_image": "presentation_assets/slide6.jpg",
        "badge": "THREAT ATTRIBUTION",
        "title": "Attacker De-Anonymization & Physical GPS Mapping",
        "subtitle": "Unmasking adversaries hidden behind commercial VPNs, Proxies, and Tor gateways",
        "content_blocks": [
            ("VPN & Proxy Detection", "Identifies commercial VPN tunnels (Nord, Mullvad, M247) and Tor exit relays by analyzing TCP TTL, MTU packet sizes, and ASN reputation databases."),
            ("WebRTC Internal LAN IP Leak", "Extracts the attacker's real private internal subnet IP (e.g. 192.168.1.54) leaked through browser STUN candidate reflex exchange."),
            ("Layer-2 MAC & Real Port Tracking", "Resolves hardware MAC addresses via ARP cache in lab/intranet setups, and tracks the exact source ephemeral socket port (e.g. 53500)."),
            ("Global GPS Threat Radar", "Resolves physical Latitude/Longitude coordinates, City, Country, and displays interactive distance calculations and satellite map links.")
        ]
    },
    {
        "slide_num": 7,
        "bg_image": "presentation_assets/slide7.jpg",
        "badge": "AUTONOMOUS RESPONSE",
        "title": "Automated Defense & Kernel Firewall",
        "subtitle": "Instant mitigation without requiring manual operator intervention",
        "content_blocks": [
            ("Auto-Firewall Blacklisting", "When risk score exceeds 72/100 or a Canary token is tripped, CyberShield instantly enforces a kernel-level IP_DROP_BLOCK rule."),
            ("Deception Sandbox Isolation", "Suspicious intermediate sessions (Score 50-70) are silently routed to an isolated container sandbox where malware can be safely studied in real-time."),
            ("Dropped Packet Telemetry", "Monitors dropped attack requests, maintains active quarantine logs, and allows one-click operator override (Block/Unblock).")
        ]
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
        ]
    },
    {
        "slide_num": 9,
        "bg_image": "presentation_assets/slide9.jpg",
        "badge": "EVALUATION & VERIFICATION",
        "title": "Interactive Cyber Attack Simulation Lab",
        "subtitle": "Testing the autonomous defense pipeline with realistic multi-vector cyber attacks",
        "content_blocks": [
            ("1. Reconnaissance Scan", "Simulates Nmap/Nikto vulnerability probing on actuator and health endpoints."),
            ("2. SSH Brute Force", "Launches dictionary password guessing on decoy port 2222 with infinite delay tarpits."),
            ("3. SQL Database Injection", "Executes UNION SELECT exploits; CyberShield serves watermarked synthetic records."),
            ("4. Canary Token Exfiltration", "Adversary steals fake .env keys; CyberShield traces the token query and instantly triggers automated IP drop."),
            ("5. VPN-Cloaked Infiltration", "Tests WebRTC de-anonymization, real port discovery, and physical GPS coordinate lookup.")
        ]
    },
    {
        "slide_num": 10,
        "bg_image": "presentation_assets/slide10.jpg",
        "badge": "CONCLUSION & IMPACT",
        "title": "The Future of Proactive Cyber Defense",
        "subtitle": "Empowering both enterprise real-time security and next-generation cybersecurity training",
        "content_blocks": [
            ("Key Architectural Takeaway", "CyberShield turns the traditional defender's dilemma upside down: defenders no longer need to be right 100% of the time, because attackers are trapped in believable illusions."),
            ("Dual Utility", "Serves as an autonomous perimeter defense mesh for enterprises, and as a safe digital forensic sandbox for training cybersecurity professionals."),
            ("Full Open-Source Stack", "Python FastAPI, Scikit-Learn, PyTorch, React, Tailwind CSS, WebSockets, and GPS Geolocation Engine.")
        ]
    }
]

for s_idx, data in enumerate(slides_data):
    slide = prs.slides.add_slide(blank_slide_layout)
    
    # 1. Background Image (Full Bleed)
    if os.path.exists(data["bg_image"]):
        slide.shapes.add_picture(data["bg_image"], 0, 0, width=prs.slide_width, height=prs.slide_height)

    # 2. Add Dark Semi-Transparent Gradient Card Overlay
    if data["slide_num"] == 1:
        overlay = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.5), Inches(1.0), Inches(10.333), Inches(5.5))
        overlay.fill.solid()
        overlay.fill.fore_color.rgb = RGBColor(7, 11, 20)
        overlay.fill.transparency = 0.20
        overlay.line.color.rgb = RGBColor(6, 182, 212)
        overlay.line.width = Pt(1.5)

        tb = slide.shapes.add_textbox(Inches(2.0), Inches(1.3), Inches(9.333), Inches(4.8))
        tf = tb.text_frame
        tf.word_wrap = True

        p0 = tf.paragraphs[0]
        badge_text = data["badge"]
        p0.text = f"[ {badge_text} ]"
        p0.font.size = Pt(13)
        p0.font.bold = True
        p0.font.color.rgb = RGBColor(6, 182, 212)
        p0.alignment = PP_ALIGN.CENTER

        p1 = tf.add_paragraph()
        p1.text = data["title"]
        p1.font.size = Pt(44)
        p1.font.bold = True
        p1.font.color.rgb = RGBColor(255, 255, 255)
        p1.alignment = PP_ALIGN.CENTER

        p2 = tf.add_paragraph()
        p2.text = data["subtitle"]
        p2.font.size = Pt(18)
        p2.font.color.rgb = RGBColor(147, 197, 253)
        p2.alignment = PP_ALIGN.CENTER
        p2.space_after = Pt(20)

        for heading, body in data["content_blocks"]:
            p_head = tf.add_paragraph()
            p_head.text = f"• {heading}: {body}"
            p_head.font.size = Pt(13)
            p_head.font.color.rgb = RGBColor(226, 232, 240)
            p_head.space_after = Pt(8)

    else:
        overlay = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.6), Inches(11.733), Inches(6.3))
        overlay.fill.solid()
        overlay.fill.fore_color.rgb = RGBColor(7, 11, 20)
        overlay.fill.transparency = 0.22
        overlay.line.color.rgb = RGBColor(59, 130, 246)
        overlay.line.width = Pt(1.2)

        tb = slide.shapes.add_textbox(Inches(1.2), Inches(0.8), Inches(10.933), Inches(5.8))
        tf = tb.text_frame
        tf.word_wrap = True

        p0 = tf.paragraphs[0]
        s_num = data["slide_num"]
        badge_text = data["badge"]
        p0.text = f"SLIDE {s_num} OF 10  |  {badge_text}"
        p0.font.size = Pt(11)
        p0.font.bold = True
        p0.font.color.rgb = RGBColor(6, 182, 212)

        p1 = tf.add_paragraph()
        p1.text = data["title"]
        p1.font.size = Pt(28)
        p1.font.bold = True
        p1.font.color.rgb = RGBColor(255, 255, 255)

        p2 = tf.add_paragraph()
        p2.text = data["subtitle"]
        p2.font.size = Pt(14)
        p2.font.color.rgb = RGBColor(147, 197, 253)
        p2.space_after = Pt(16)

        for heading, body in data["content_blocks"]:
            p_item = tf.add_paragraph()
            p_item.text = f"▶ {heading}"
            p_item.font.size = Pt(15)
            p_item.font.bold = True
            p_item.font.color.rgb = RGBColor(56, 189, 248)

            p_desc = tf.add_paragraph()
            p_desc.text = body
            p_desc.font.size = Pt(12)
            p_desc.font.color.rgb = RGBColor(226, 232, 240)
            p_desc.space_after = Pt(10)

output_path = "CyberShield_Presentation.pptx"
prs.save(output_path)
print(f"[✓] PowerPoint presentation successfully generated at: {output_path}")
