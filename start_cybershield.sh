#!/bin/bash
echo "=========================================================="
echo "   CYBERSHIELD: AI Digital Attack Prediction & Deception"
echo "=========================================================="

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# 1. Start Backend
echo "[+] Starting CyberShield AI Backend (FastAPI + WebSocket)..."
PYTHONPATH=backend ./venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# 2. Start Frontend
echo "[+] Starting SOC Command Center Frontend (Vite + React)..."
cd frontend && npm run dev &
FRONTEND_PID=$!

echo ""
echo "[✓] CyberShield is active!"
echo "    -> SOC Dashboard: http://localhost:5173"
echo "    -> Backend API:   http://localhost:8000"
echo "    -> API Docs:      http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to terminate both servers."

trap "kill $BACKEND_PID $FRONTEND_PID; exit" SIGINT SIGTERM
wait
