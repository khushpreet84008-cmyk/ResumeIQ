@echo off
title ResumeIQ - AI Resume Analyzer
cd /d "%~dp0"
echo.
echo ===== ResumeIQ - AI Resume Analyzer =====
echo.
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed. Install Node.js 18 or newer from https://nodejs.org
  pause
  exit /b 1
)
if not exist node_modules (
  echo Installing required packages for the first run...
  call npm install
  if errorlevel 1 (
    echo Package installation failed. Check your internet connection and try again.
    pause
    exit /b 1
  )
)
echo Starting ResumeIQ. Keep this window open while using the website.
start "" cmd /c "timeout /t 3 /nobreak >nul & start http://localhost:3000"
call npm start
pause
