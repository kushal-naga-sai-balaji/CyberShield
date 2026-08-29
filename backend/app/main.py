"""
CyberShield - AI-Powered Digital Attack Prediction & Deception System
Main FastAPI Application
"""
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import asyncio
import random

from app.api.endpoints import router as api_router, ws_manager
from app.core.simulator import simulator
from app.models.schemas import SimulationRequest

app = FastAPI(
    title="CyberShield Core AI & Deception Engine",
    description="Predictive Cyber Defense, Adaptive Honeypots, Attacker De-Anonymization, and Automated Defense Mesh",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

@app.websocket("/ws/attacks")
async def websocket_attacks(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        while True:
            # Keep socket alive and accept ping messages
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
    except Exception:
        ws_manager.disconnect(websocket)

@app.on_event("startup")
async def startup_event():
    # Seed initial representative attack telemetry
    scenarios = ["recon_scan", "ssh_bruteforce", "sqli_injection", "canary_exfil", "vpn_cloaked_probe"]
    for s in scenarios:
        simulator.simulate(SimulationRequest(scenario=s))

@app.get("/")
def root():
    return {
        "system": "CyberShield AI Deception Platform",
        "status": "OPERATIONAL",
        "mode": "PREDICT_DECEIVE_OBSERVE_DEFEND",
        "docs": "/docs",
        "version": "2.0.0"
    }

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
