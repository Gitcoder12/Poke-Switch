@echo off
setlocal
cd /d "%~dp0"

where python >nul 2>nul
if errorlevel 1 (
    echo Python was not found. Install Python 3 and try again.
    pause
    exit /b 1
)

echo Starting Poke-Switch at http://localhost:8000
echo Keep this window open while using the website.
start "Poke-Switch local server" cmd /k "python -m http.server 8000"
timeout /t 2 /nobreak >nul
start "" "http://localhost:8000"
