$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$aiDir = Join-Path $root "ai-service"
$backendDir = Join-Path $root "backend"
$frontendDir = Join-Path $root "frontend"
$venvPython = Join-Path $aiDir ".venv\Scripts\python.exe"

function Test-PortInUse {
  param([int]$Port)
  $matches = netstat -ano | Select-String ":$Port\s"
  return $null -ne $matches
}

if (-not (Test-Path $aiDir)) {
  throw "Missing ai-service directory."
}
if (-not (Test-Path $backendDir)) {
  throw "Missing backend directory."
}
if (-not (Test-Path $frontendDir)) {
  throw "Missing frontend directory."
}

if (-not (Test-Path $venvPython)) {
  throw "AI service venv Python not found at $venvPython. Run setup first."
}

if (-not (Test-PortInUse -Port 8000)) {
  Write-Host "Starting AI service on port 8000..."
  Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "cd '$aiDir'; & '$venvPython' -m uvicorn main:app --host 127.0.0.1 --port 8000"
  )
} else {
  Write-Host "AI service already running on port 8000. Skipping."
}

if (-not (Test-PortInUse -Port 5000)) {
  Write-Host "Starting backend on port 5000..."
  Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "cd '$backendDir'; npm run dev"
  )
} else {
  Write-Host "Backend already running on port 5000. Skipping."
}

if (-not (Test-PortInUse -Port 3000)) {
  Write-Host "Starting frontend on port 3000..."
  Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "cd '$frontendDir'; npm start"
  )
} else {
  Write-Host "Frontend already running on port 3000. Skipping."
}

Write-Host "Startup check complete."
