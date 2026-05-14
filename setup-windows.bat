@echo off
echo.
echo ============================================
echo   RuralCare - Cloud Telemedicine Platform
echo ============================================
echo.

echo [1/4] Installing backend dependencies...
cd backend
call npm install
cd ..

echo.
echo [2/4] Installing frontend dependencies...
cd frontend
call npm install
cd ..

echo.
echo [3/4] Setup complete!
echo.
echo ============================================
echo   HOW TO RUN:
echo ============================================
echo.
echo   Terminal 1 (Backend):
echo     cd backend
echo     node server.js
echo.
echo   Terminal 2 (Frontend):
echo     cd frontend
echo     npm run dev
echo.
echo   Then open: http://localhost:5173
echo ============================================
echo.
echo   IMPORTANT: Add your Anthropic API key
echo   Open backend/.env and set:
echo   ANTHROPIC_API_KEY=sk-ant-your-key-here
echo   Get key: https://console.anthropic.com
echo ============================================
pause
