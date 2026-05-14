#!/bin/bash
echo ""
echo "============================================"
echo "  RuralCare - Cloud Telemedicine Platform"
echo "============================================"
echo ""

echo "[1/2] Installing backend dependencies..."
cd backend && npm install && cd ..

echo ""
echo "[2/2] Installing frontend dependencies..."
cd frontend && npm install && cd ..

echo ""
echo "============================================"
echo "  HOW TO RUN:"
echo "============================================"
echo ""
echo "  Terminal 1 (Backend):"
echo "    cd backend && node server.js"
echo ""
echo "  Terminal 2 (Frontend):"
echo "    cd frontend && npm run dev"
echo ""
echo "  Then open: http://localhost:5173"
echo ""
echo "  IMPORTANT: Add your Anthropic API key"
echo "  Edit backend/.env:"
echo "  ANTHROPIC_API_KEY=sk-ant-your-key-here"
echo "  Get key: https://console.anthropic.com"
echo "============================================"
