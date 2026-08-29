import React, { useState, useEffect } from "react";
import { 
  Globe, 
  MapPin, 
  Navigation, 
  ShieldAlert, 
  Ban, 
  ExternalLink, 
  RefreshCw, 
  Radio, 
  Compass, 
  Activity,
  Crosshair,
  Wifi,
  Lock,
  Eye
} from "lucide-react";
import { api } from "../services/api";
import { ThreatMapLocation, ThreatMapResponse } from "../types";

export const GpsThreatMap: React.FC = () => {
  const [mapData, setMapData] = useState<ThreatMapResponse | null>(null);
  const [selectedLoc, setSelectedLoc] = useState<ThreatMapLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "BLOCKED" | "QUARANTINED">("ALL");

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const data = await api.getThreatMapLocations();
      setMapData(data);
      if (data.locations.length > 0 && !selectedLoc) {
        setSelectedLoc(data.locations[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const filteredLocations = mapData?.locations.filter(loc => {
    if (filter === "ALL") return true;
    return loc.status === filter;
  }) || [];

  // Project latitude/longitude onto a 2D equirectangular map plane (0% - 100%)
  const projectCoordinates = (lat: number, lon: number) => {
    const x = ((lon + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { x: Math.max(2, Math.min(98, x)), y: Math.max(5, Math.min(95, y)) };
  };

  // Calculate Great-Circle Distance (Haversine formula) in kilometers
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  const socBase = mapData?.soc_base_location || {
    latitude: 12.9716,
    longitude: 77.5946,
    city: "Bengaluru",
    country: "India"
  };

  const socPos = projectCoordinates(socBase.latitude, socBase.longitude);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Globe className="w-5 h-5 text-cyan-400" />
            <span>GLOBAL GPS THREAT MAP & GEOLOCATION RADAR</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Locate blocked attacker IPs, VPN exits, and proxy gateways with real-time physical GPS coordinates and satellite coordinates.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex bg-[#090e1c] rounded-xl p-1 border border-cyber-border text-xs font-mono">
            {(["ALL", "BLOCKED", "QUARANTINED"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-lg transition ${
                  filter === f
                    ? "bg-blue-600/40 text-cyan-300 border border-blue-500/40 font-bold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <button
            onClick={fetchLocations}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-950/60 hover:bg-blue-900/60 text-cyan-300 border border-blue-500/30 text-xs font-mono transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh GPS</span>
          </button>
        </div>
      </div>

      {/* Main Map & HUD Radar Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Tactical World Map Canvas */}
        <div className="cyber-glass rounded-2xl p-6 border border-cyber-border lg:col-span-2 flex flex-col justify-between relative overflow-hidden min-h-[500px]">
          {/* Header overlay */}
          <div className="flex items-center justify-between z-10 text-xs font-mono text-slate-400 border-b border-slate-800/80 pb-3">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="text-white font-bold">GEOSPATIAL INTRUSION RADAR</span>
            </div>
            <div className="flex space-x-4 text-[11px]">
              <span className="flex items-center text-red-400"><span className="w-2 h-2 rounded-full bg-red-500 mr-1 animate-ping"></span>Blocked Threat</span>
              <span className="flex items-center text-purple-400"><span className="w-2 h-2 rounded-full bg-purple-500 mr-1"></span>Quarantined</span>
              <span className="flex items-center text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-1"></span>SOC Base</span>
            </div>
          </div>

          {/* Tactical Grid World Map */}
          <div className="relative w-full h-[380px] my-4 rounded-xl bg-[#060913] border border-slate-800/80 overflow-hidden flex items-center justify-center">
            {/* World Map SVG Vector Silhouette */}
            <svg 
              className="absolute inset-0 w-full h-full opacity-30 text-blue-500/40 pointer-events-none"
              viewBox="0 0 1000 500" 
              fill="currentColor"
            >
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(59, 130, 246, 0.08)" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* World Continents Rough Geo Outline */}
              <path d="M150,120 Q180,90 240,110 Q280,150 250,220 Q190,260 160,200 Z" fill="rgba(30, 58, 138, 0.3)" /> {/* North America */}
              <path d="M260,260 Q300,280 290,380 Q250,440 230,360 Z" fill="rgba(30, 58, 138, 0.3)" /> {/* South America */}
              <path d="M480,100 Q560,80 580,140 Q530,170 470,140 Z" fill="rgba(30, 58, 138, 0.3)" /> {/* Europe */}
              <path d="M470,170 Q560,180 550,300 Q480,340 450,240 Z" fill="rgba(30, 58, 138, 0.3)" /> {/* Africa */}
              <path d="M580,100 Q780,80 820,180 Q720,280 620,220 Z" fill="rgba(30, 58, 138, 0.3)" /> {/* Asia */}
              <path d="M750,320 Q840,310 830,400 Q760,420 730,360 Z" fill="rgba(30, 58, 138, 0.3)" /> {/* Australia */}
            </svg>

            {/* Trajectory Arcs from Attackers to SOC Base */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
              {filteredLocations.map((loc) => {
                const pos = projectCoordinates(loc.latitude, loc.longitude);
                const isSelected = selectedLoc?.ip === loc.ip;
                const isBlocked = loc.status === "BLOCKED";

                return (
                  <g key={`arc-${loc.ip}`}>
                    <line
                      x1={`${pos.x}%`}
                      y1={`${pos.y}%`}
                      x2={`${socPos.x}%`}
                      y2={`${socPos.y}%`}
                      stroke={isSelected ? "#00f2fe" : isBlocked ? "rgba(239, 68, 68, 0.4)" : "rgba(168, 85, 247, 0.4)"}
                      strokeWidth={isSelected ? 2 : 1}
                      strokeDasharray={isSelected ? "4 2" : "2 2"}
                      className={isSelected ? "animate-pulse" : ""}
                    />
                  </g>
                );
              })}
            </svg>

            {/* SOC Defense Node Marker */}
            <div
              style={{ left: `${socPos.x}%`, top: `${socPos.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
              title="CyberShield SOC Command Base"
            >
              <span className="relative flex h-5 w-5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-5 w-5 bg-emerald-500 border-2 border-white items-center justify-center text-[8px] font-bold text-black">
                  🛡️
                </span>
              </span>
              <div className="absolute top-6 left-1/2 -translate-x-1/2 hidden group-hover:block bg-black/90 border border-emerald-500/60 px-2 py-1 rounded text-[10px] font-mono text-emerald-300 whitespace-nowrap shadow-xl">
                CyberShield Base (SOC)
              </div>
            </div>

            {/* Attacker GPS Pin Markers */}
            {filteredLocations.map((loc) => {
              const pos = projectCoordinates(loc.latitude, loc.longitude);
              const isSelected = selectedLoc?.ip === loc.ip;
              const isBlocked = loc.status === "BLOCKED";

              return (
                <div
                  key={loc.ip}
                  onClick={() => setSelectedLoc(loc)}
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer transition-transform ${
                    isSelected ? "scale-125 z-30" : "hover:scale-110"
                  }`}
                >
                  <div className="relative flex items-center justify-center">
                    {isBlocked && (
                      <span className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-red-500 opacity-60"></span>
                    )}
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold border-2 shadow-lg ${
                      isSelected
                        ? "bg-cyan-400 border-white text-black ring-4 ring-cyan-500/40"
                        : isBlocked
                        ? "bg-red-600 border-red-300 text-white"
                        : "bg-purple-600 border-purple-300 text-white"
                    }`}>
                      {isBlocked ? "!" : "•"}
                    </div>
                  </div>

                  <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-black/85 backdrop-blur-sm border border-slate-700 px-1.5 py-0.5 rounded text-[9px] font-mono text-slate-200 whitespace-nowrap shadow-lg">
                    {loc.flag_emoji} {loc.city}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map Footer Metadata */}
          <div className="flex items-center justify-between z-10 text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-800">
            <span>Projection: Equirectangular WGS84 GPS</span>
            <span>Located Threat Points: {filteredLocations.length}</span>
          </div>
        </div>

        {/* Selected Attacker GPS Forensics Card */}
        <div className="cyber-glass rounded-2xl p-6 border border-cyber-border flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-4 pb-3 border-b border-slate-800">
              <Crosshair className="w-4 h-4" />
              <span>GEOLOCATION & SATELLITE GPS HUD</span>
            </div>

            {selectedLoc ? (
              <div className="space-y-4 font-mono text-xs">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{selectedLoc.flag_emoji}</span>
                    <div>
                      <h4 className="text-base font-bold text-white">{selectedLoc.ip}</h4>
                      <p className="text-[11px] text-slate-400">{selectedLoc.city}, {selectedLoc.country}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    selectedLoc.status === "BLOCKED" ? "bg-red-950 text-red-400 border-red-500" :
                    selectedLoc.status === "QUARANTINED" ? "bg-purple-950 text-purple-300 border-purple-500" :
                    "bg-blue-950 text-cyan-300 border-blue-500"
                  }`}>
                    {selectedLoc.status}
                  </span>
                </div>

                {/* Exact GPS Coordinates Box */}
                <div className="p-3.5 rounded-xl bg-[#070b16] border border-cyan-500/30 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-cyan-300 font-bold border-b border-slate-800/80 pb-1">
                    <span className="flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-cyan-400" />
                      PHYSICAL GPS COORDINATES
                    </span>
                    <span className="text-emerald-400">Fixed</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div>
                      <span className="text-[10px] text-slate-500 block">LATITUDE:</span>
                      <span className="text-white font-bold">{selectedLoc.latitude.toFixed(4)}°</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">LONGITUDE:</span>
                      <span className="text-white font-bold">{selectedLoc.longitude.toFixed(4)}°</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
                    <span>Distance to SOC Base:</span>
                    <span className="text-amber-400 font-bold">
                      {calculateDistance(socBase.latitude, socBase.longitude, selectedLoc.latitude, selectedLoc.longitude)} km
                    </span>
                  </div>
                </div>

                {/* Telemetry Details */}
                <div className="p-3.5 rounded-xl bg-[#070b16] border border-slate-800 space-y-2 text-[11px]">
                  <div className="flex justify-between border-b border-slate-800/60 pb-1">
                    <span className="text-slate-500">ISP / Routing Org:</span>
                    <span className="text-slate-300 truncate max-w-[170px]">{selectedLoc.isp}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/60 pb-1">
                    <span className="text-slate-500">Timezone:</span>
                    <span className="text-slate-300">{selectedLoc.timezone}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/60 pb-1">
                    <span className="text-slate-500">Tracked Ports:</span>
                    <span className="text-amber-400">{selectedLoc.ports_tracked?.join(", ") || "8000"}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/60 pb-1">
                    <span className="text-slate-500">Resolved MAC:</span>
                    <span className="text-emerald-400 truncate max-w-[150px]">{selectedLoc.resolved_mac}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Risk Severity:</span>
                    <span className="text-red-400 font-bold">{selectedLoc.risk_score} / 100 ({selectedLoc.threat_level})</span>
                  </div>
                </div>

                {/* External Satellite Map Links */}
                <div className="pt-2 space-y-2">
                  <a
                    href={`https://www.google.com/maps?q=${selectedLoc.latitude},${selectedLoc.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center space-x-2 py-2 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 text-cyan-300 border border-blue-500/40 text-xs font-semibold transition"
                  >
                    <span>Open in Google Satellite Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={`https://www.openstreetmap.org/?mlat=${selectedLoc.latitude}&mlon=${selectedLoc.longitude}#map=12/${selectedLoc.latitude}/${selectedLoc.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center space-x-2 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold transition"
                  >
                    <span>Open in OpenStreetMap</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-center py-24 text-slate-500 font-mono text-xs">
                Select any threat node on the world map to inspect exact GPS coordinates and satellite locations.
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800 text-[10px] font-mono text-slate-500 flex justify-between">
            <span>CyberShield Geolocation Engine: Active</span>
            <span>Real-time GPS Tracking</span>
          </div>
        </div>
      </div>

      {/* Geolocation Table */}
      <div className="cyber-glass rounded-2xl p-5 border border-cyber-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white font-mono">TRACKED & BLOCKED ATTACKER LOCATIONS</h3>
          <span className="text-xs font-mono text-slate-500">Live GeoIP & GPS Coordinate Registry</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="pb-3">COUNTRY / CITY</th>
                <th className="pb-3">ATTACKER IP</th>
                <th className="pb-3">GPS (LAT, LON)</th>
                <th className="pb-3">ISP & ROUTING</th>
                <th className="pb-3">STATUS</th>
                <th className="pb-3">DISTANCE</th>
                <th className="pb-3 text-right">MAPS ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredLocations.map((loc) => {
                const isSelected = selectedLoc?.ip === loc.ip;
                const dist = calculateDistance(socBase.latitude, socBase.longitude, loc.latitude, loc.longitude);

                return (
                  <tr
                    key={loc.ip}
                    onClick={() => setSelectedLoc(loc)}
                    className={`hover:bg-blue-950/30 transition cursor-pointer ${
                      isSelected ? "bg-blue-950/40 border-l-2 border-cyan-400" : ""
                    }`}
                  >
                    <td className="py-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-base">{loc.flag_emoji}</span>
                        <div>
                          <div className="font-bold text-slate-200">{loc.city}</div>
                          <div className="text-[10px] text-slate-500">{loc.country}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 font-bold text-slate-300">
                      {loc.ip}
                    </td>
                    <td className="py-3 text-cyan-300">
                      {loc.latitude.toFixed(4)}°, {loc.longitude.toFixed(4)}°
                    </td>
                    <td className="py-3 max-w-[200px] truncate text-slate-400 text-[11px]">
                      {loc.isp}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        loc.status === "BLOCKED" ? "bg-red-950 text-red-400 border-red-500/50" :
                        loc.status === "QUARANTINED" ? "bg-purple-950 text-purple-300 border-purple-500/50" :
                        "bg-blue-950 text-blue-300 border-blue-500/50"
                      }`}>
                        {loc.status}
                      </span>
                    </td>
                    <td className="py-3 text-amber-400 font-bold">
                      {dist} km
                    </td>
                    <td className="py-3 text-right">
                      <a
                        href={`https://www.google.com/maps?q=${loc.latitude},${loc.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-blue-950 hover:bg-blue-900 text-cyan-300 border border-blue-500/30 text-[10px] font-medium transition"
                      >
                        <MapPin className="w-3 h-3" />
                        <span>View Map</span>
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
