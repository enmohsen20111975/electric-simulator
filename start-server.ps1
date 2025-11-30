# Circuit Simulator - Development Server Startup Script
# Run this script to start the backend server

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  🚀 Circuit Simulator - Development Server" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""

# Check if Python is installed
# Removed try-catch block for Python version check due to parsing issues.
# Assuming Python is installed for now.
# You may need to manually verify Python installation if issues persist.

# Navigate to backend directory
$backendPath = Join-Path $PSScriptRoot "2-backend"
if (Test-Path $backendPath) {
    Set-Location $backendPath
    Write-Host "✓ Backend directory: $backendPath" -ForegroundColor Green
} else {
    Write-Host "✗ Backend directory not found!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  📦 Checking Dependencies" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

# Check if virtual environment exists
if (Test-Path "venv") {
    Write-Host "✓ Virtual environment found" -ForegroundColor Green
    Write-Host "  Activating virtual environment..." -ForegroundColor Cyan
    .\venv\Scripts\Activate.ps1
} else {
    Write-Host "⚠ Virtual environment not found. Creating and activating..." -ForegroundColor Yellow
    python -m venv venv
    .\venv\Scripts\Activate.ps1
    Write-Host "✓ Virtual environment created and activated" -ForegroundColor Green
    Write-Host "  Installing dependencies..." -ForegroundColor Cyan
    pip install -r requirements.txt
    Write-Host "✓ Dependencies installed" -ForegroundColor Green
}

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  🌐 Server Information" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  📍 API Server:     http://localhost:8081" -ForegroundColor White
Write-Host "  📍 Frontend:       http://localhost:8081/" -ForegroundColor White
Write-Host "  📚 API Docs:       http://localhost:8081/docs" -ForegroundColor White
Write-Host "  📖 ReDoc:          http://localhost:8081/redoc" -ForegroundColor White
Write-Host ""
Write-Host "  🔐 Demo Account:" -ForegroundColor Yellow
Write-Host "     Username: demo" -ForegroundColor White
Write-Host "     Password: demo123" -ForegroundColor White
Write-Host ""
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  ⚙️  Available Features" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  ✓ PySpice Simulation (DC/AC/Transient)" -ForegroundColor Green
Write-Host "  ✓ Digital Logic Simulation" -ForegroundColor Green
Write-Host "  ✓ Component Pricing (Octopart API)" -ForegroundColor Green
Write-Host "  ✓ BOM Management" -ForegroundColor Green
Write-Host "  ✓ Cost Estimation" -ForegroundColor Green
Write-Host "  ✓ Electrical Calculators" -ForegroundColor Green
Write-Host ""
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Starting server..." -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Start the server
python run_dev.py
