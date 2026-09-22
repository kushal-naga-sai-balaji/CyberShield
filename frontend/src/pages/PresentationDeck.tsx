import React, { useState, useEffect } from "react";
import { 
  Presentation, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Maximize2, 
  Lightbulb,
  ShieldCheck,
  CheckCircle,
  ArrowRight
} from "lucide-react";

interface SlideContent {
  num: number;
  badge: string;
  title: string;
  subtitle: string;
  bgImage: string;
  learningTakeaway: string;
  points: { title: string; desc: string }[];
}

export const PresentationDeck: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  const slides: SlideContent[] = [
    {
      num: 1,
      badge: "AI & CYBER DEFENSE INNOVATION",
      title: "CyberShield",
      subtitle: "AI-Powered Digital Attack Prediction & Adaptive Deception System",
      bgImage: "/slides/slide1.jpg",
      learningTakeaway: "Deception-based defense gives defenders the upper hand by confusing and trapping adversaries instead of just blocking them.",
      points: [
        { title: "Core Concept", desc: "An autonomous platform that predicts attacker moves, generates realistic decoy environments, and neutralizes intrusions before data theft occurs." },
        { title: "The 5-Stage Paradigm", desc: "PREDICT → DECEIVE → OBSERVE → LEARN → DEFEND" },
        { title: "Design Philosophy", desc: "Move beyond reactive 'detect-and-block' firewalls by combining AI threat prediction, adaptive honeypots, and automated defense." }
      ]
    },
    {
      num: 2,
      badge: "THE CYBERSECURITY PROBLEM",
      title: "Why Traditional Firewalls Fail",
      subtitle: "The fundamental flaw in reactive 'Detect & Block' security models",
      bgImage: "/slides/slide2.jpg",
      learningTakeaway: "Defenders must succeed 100% of the time, while attackers only need to find ONE flaw. CyberShield flips this asymmetry.",
      points: [
        { title: "The Attacker Asymmetry", desc: "Traditional firewalls wait for an attack to strike. Attackers get infinite free reconnaissance attempts to find a single exploit." },
        { title: "Cloaked Infiltration", desc: "Adversaries hide behind VPNs, Tor exit nodes, and proxies. Blocking an IP causes them to switch to another IP in seconds." },
        { title: "Zero-Day Blindspots", desc: "Signature-based tools miss unknown exploits. Hackers dwell inside corporate networks for an average of 200+ days undetected." }
      ]
    },
    {
      num: 3,
      badge: "THE NEW STRATEGY",
      title: "The CyberShield Paradigm",
      subtitle: "Shifting from reactive defense to proactive deception & behavioral analysis",
      bgImage: "/slides/slide3.jpg",
      learningTakeaway: "By feeding fake data instead of errors, you keep hackers busy attacking illusions while you collect their forensic fingerprints.",
      points: [
        { title: "1. Predict", desc: "Machine learning analyzes incoming traffic, headers, and commands to forecast the attacker's next 3 likely moves." },
        { title: "2. Deceive", desc: "Instead of a 403 error, the system feeds attackers realistic fake customer databases, dummy APIs, and simulated logins." },
        { title: "3. Observe & Defend", desc: "Hackers spend hours exploiting decoy traps while CyberShield extracts threat intelligence and executes automated kernel-level drops." }
      ]
    },
    {
      num: 4,
      badge: "ARTIFICIAL INTELLIGENCE CORE",
      title: "AI Attack Prediction & Kill-Chain Foresight",
      subtitle: "Anticipating the adversary's next 3 steps using Machine Learning & Markov Models",
      bgImage: "/slides/slide4.jpg",
      learningTakeaway: "Markov Transition Chains model the hacker's kill-chain flow, allowing defenders to set traps BEFORE the hacker executes the exploit.",
      points: [
        { title: "Random Forest Classifier", desc: "Categorizes payloads in sub-2ms into: Reconnaissance, Brute Force, Web Injection, Privilege Escalation, and Exfiltration." },
        { title: "Markov Kill-Chain Engine", desc: "Maps MITRE ATT&CK progression: e.g., Recon scan triggers 48% probability of SQL Injection, pre-loading decoy DB traps." },
        { title: "Dynamic Risk Scoring (0–100)", desc: "Evaluates payload entropy, signature confidence, and reputation score to assign Low, Medium, High, or Critical threat tiers." }
      ]
    },
    {
      num: 5,
      badge: "ACTIVE DECEPTION LAYER",
      title: "Adaptive Honeypots & Canary Tripwires",
      subtitle: "Planting digital landmines and fake assets to mislead and trap hackers",
      bgImage: "/slides/slide5.jpg",
      learningTakeaway: "Canary Tokens act like radioactive dye: when an attacker steals them, any attempt to use them instantly triggers a critical alert.",
      points: [
        { title: "Dynamic Decoy Services", desc: "Automatically synthesizes fake Admin Portals (/admin/auth), dummy REST APIs, synthetic database dumps, and SSH tarpits (Port 2222)." },
        { title: "What is a Canary Token?", desc: "Planted fake AWS API keys and JWT tokens. The instant an adversary steals or queries with them, an emergency alarm fires." },
        { title: "Cognitive Hacker Confusion", desc: "Attackers believe they have breached high-value credentials, wasting valuable time while defenders lock them out." }
      ]
    },
    {
      num: 6,
      badge: "THREAT ATTRIBUTION",
      title: "Attacker De-Anonymization & Physical GPS Mapping",
      subtitle: "Unmasking adversaries hidden behind commercial VPNs, Proxies, and Tor gateways",
      bgImage: "/slides/slide6.jpg",
      learningTakeaway: "Browser WebRTC STUN protocols and TCP TTL packet timing can reveal a hacker's true private IP and physical location even behind VPNs.",
      points: [
        { title: "VPN & Proxy Detection", desc: "Identifies commercial VPN tunnels (Nord, Mullvad, M247) and Tor relays by analyzing TCP TTL, MTU sizes, and ASN databases." },
        { title: "WebRTC LAN IP Leak", desc: "Extracts the attacker's real internal private subnet IP (e.g. 192.168.1.54) leaked through browser STUN candidate reflex exchange." },
        { title: "Layer-2 MAC & Real Port Tracking", desc: "Resolves hardware MAC addresses via ARP cache in lab setups, and tracks the exact source ephemeral socket port (e.g. 53500) and GPS location." }
      ]
    },
    {
      num: 7,
      badge: "AUTONOMOUS RESPONSE",
      title: "Automated Defense & Kernel Firewall",
      subtitle: "Instant mitigation without requiring manual operator intervention",
      bgImage: "/slides/slide7.jpg",
      learningTakeaway: "Automated response closes the critical time gap between threat detection and containment, preventing lateral movement.",
      points: [
        { title: "Auto-Firewall Blacklisting", desc: "When risk score exceeds 72/100 or a Canary token is tripped, CyberShield instantly enforces a kernel-level IP_DROP_BLOCK rule." },
        { title: "Deception Sandbox Isolation", desc: "Suspicious sessions (Score 50-70) are silently routed to an isolated container sandbox where malware can be safely studied." },
        { title: "Dropped Packet Telemetry", desc: "Tracks intercepted attack requests, maintains active quarantine logs, and allows instant operator override (Block/Unblock)." }
      ]
    },
    {
      num: 8,
      badge: "SITUATIONAL AWARENESS",
      title: "Attack-Path Visualizer & SOC Operations",
      subtitle: "Mapping real-time intrusion flow and enterprise MITRE ATT&CK coverage",
      bgImage: "/slides/slide8.jpg",
      learningTakeaway: "Graph-based visualization transforms confusing log files into clear visual stories showing how the attacker was outsmarted step-by-step.",
      points: [
        { title: "Interactive Traversal Graph", desc: "Renders animated visual paths: Attacker IP → Probe Vector → Honeypot Decoy → Canary Token → Quarantine." },
        { title: "MITRE ATT&CK Alignment", desc: "Maps events to industry techniques (T1595 Recon, T1110 Brute Force, T1190 Exploit, T1068 Priv-Esc, T1048 Exfiltration)." },
        { title: "Digital Forensics Vault", desc: "Records raw HTTP headers, payload hex strings, timestamps, and generates 1-click exportable Forensic Incident JSON reports." }
      ]
    },
    {
      num: 9,
      badge: "EVALUATION & VERIFICATION",
      title: "Interactive Cyber Attack Simulation Lab",
      subtitle: "Testing the autonomous defense pipeline with realistic multi-vector cyber attacks",
      bgImage: "/slides/slide9.jpg",
      learningTakeaway: "Simulation testing validates that AI classifiers, honeypots, and firewalls work in harmony under realistic cyber combat conditions.",
      points: [
        { title: "Multi-Vector Attack Suite", desc: "1-Click simulation of Reconnaissance Scans, SSH Brute Force on port 2222, SQL Injection, and Canary Exfiltration." },
        { title: "VPN Cloaking Test", desc: "Validates WebRTC LAN IP de-cloaking, real ephemeral port discovery, and physical GPS coordinate mapping." },
        { title: "Real-Time Verification", desc: "Proves that predictive models, honeypot traps, and auto-drop firewall rules work in harmony under realistic cyber conditions." }
      ]
    },
    {
      num: 10,
      badge: "CONCLUSION & IMPACT",
      title: "The Future of Proactive Cyber Defense",
      subtitle: "Empowering both enterprise real-time security and next-generation cybersecurity training",
      bgImage: "/slides/slide10.jpg",
      learningTakeaway: "Deception technology combined with AI prediction represents the next frontier in proactive cyber resilience.",
      points: [
        { title: "Key Architectural Takeaway", desc: "CyberShield turns the defender's dilemma upside down: defenders no longer need to be right 100% of the time, because attackers are trapped in illusions." },
        { title: "Dual Purpose Utility", desc: "Serves as an autonomous perimeter defense mesh for enterprises, and as a safe digital forensic sandbox for cybersecurity education." },
        { title: "Full Technology Stack", desc: "Python FastAPI, Scikit-Learn, PyTorch, React, Tailwind CSS, WebSockets, and GPS Geolocation Engine." }
      ]
    }
  ];

  const slide = slides[currentSlide];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
      } else if (e.key === "ArrowLeft") {
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "f" || e.key === "F") {
        setFullscreen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [slides.length]);

  return (
    <div className={`space-y-4 ${fullscreen ? "fixed inset-0 z-50 bg-black p-6 flex flex-col justify-between" : "pb-12"}`}>
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-blue-950/80 border border-blue-500/30 text-cyan-400">
            <Presentation className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <span>CYBERSHIELD PRESENTATION SLIDES</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30 font-mono">
                10 SLIDES • CENTER ALIGNED • 16:9 HD
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Use Left / Right arrow keys to navigate. Press &apos;F&apos; for Fullscreen.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <a
            href="/CyberShield_Presentation.pptx"
            download="CyberShield_Presentation.pptx"
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-md shadow-emerald-500/20 border border-emerald-400/30 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Centered .PPTX File</span>
          </a>

          <button
            onClick={() => setFullscreen(!fullscreen)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="Toggle Fullscreen Mode"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Centered Slide Viewer Canvas */}
      <div className="relative w-full aspect-video max-h-[720px] rounded-2xl overflow-hidden border border-cyber-border shadow-2xl group select-none flex items-center justify-center">
        {/* Full-Bleed Background Image */}
        <img
          src={slide.bgImage}
          alt={slide.title}
          className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-700"
        />

        {/* Dark Vignette Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070b14]/90 via-[#070b14]/65 to-[#070b14]/50 backdrop-blur-[2px]"></div>

        {/* Centered Frosted Glass Content Box */}
        <div className="relative z-10 w-[92%] max-w-5xl p-6 md:p-10 rounded-2xl bg-[#060a13]/85 backdrop-blur-md border border-cyan-500/40 shadow-2xl text-center flex flex-col justify-between space-y-4 my-auto">
          {/* Centered Badge & Counter */}
          <div className="flex items-center justify-center space-x-3">
            <span className="text-[11px] font-mono font-bold tracking-wider px-3 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 uppercase">
              {slide.badge}
            </span>
            <span className="text-[11px] font-mono text-slate-400 font-bold bg-black/60 px-2.5 py-0.5 rounded-full border border-slate-800">
              SLIDE {slide.num} OF {slides.length}
            </span>
          </div>

          {/* Centered Title & Subtitle */}
          <div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
              {slide.title}
            </h1>
            <p className="text-xs md:text-sm text-blue-200/90 font-medium mt-1 drop-shadow max-w-2xl mx-auto">
              {slide.subtitle}
            </p>
          </div>

          {/* Centered 3 Points Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-left">
            {slide.points.map((pt, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[#0a0f1e]/90 border border-slate-700/60 hover:border-cyan-400/60 transition shadow-lg text-center flex flex-col justify-center"
              >
                <div className="text-cyan-300 font-bold text-xs mb-1 flex items-center justify-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{pt.title}</span>
                </div>
                <p className="text-[11px] text-slate-200 leading-relaxed font-sans">
                  {pt.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Centered Key Takeaway Banner */}
          <div className="p-2.5 rounded-xl bg-gradient-to-r from-blue-950/90 via-indigo-950/90 to-cyan-950/90 border border-cyan-500/40 text-xs text-cyan-200 flex items-center justify-center space-x-2 text-center">
            <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 animate-pulse" />
            <span className="text-slate-200 text-[11px]">
              <strong className="text-yellow-300 mr-1">Key Takeaway:</strong>
              {slide.learningTakeaway}
            </span>
          </div>
        </div>

        {/* Previous / Next Arrow Overlays */}
        <button
          onClick={() => setCurrentSlide((prev) => Math.max(prev - 1, 0))}
          disabled={currentSlide === 0}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white border border-slate-700 disabled:opacity-30 transition z-20"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={() => setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1))}
          disabled={currentSlide === slides.length - 1}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white border border-slate-700 disabled:opacity-30 transition z-20"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Slide Thumbnails Strip */}
      <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
        {slides.map((s, idx) => (
          <button
            key={s.num}
            onClick={() => setCurrentSlide(idx)}
            className={`relative rounded-lg overflow-hidden border transition-all text-left group ${
              currentSlide === idx
                ? "ring-2 ring-cyan-400 border-cyan-400 scale-105 shadow-md shadow-cyan-500/20"
                : "border-slate-800 opacity-60 hover:opacity-100"
            }`}
          >
            <img src={s.bgImage} alt={s.title} className="w-full h-12 object-cover" />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center font-mono text-xs font-bold text-white">
              #{s.num}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
