# Start both backend and frontend for local development (PowerShell)
# Usage: .\scripts\start-all.ps1

$root = Split-Path -Parent $MyInvocation.MyCommand.Definition

Write-Host "Starting backend..."
Start-Process -FilePath 'C:\Program Files\nodejs\node.exe' -ArgumentList 'server.js' -WorkingDirectory (Join-Path $root '..\backend') -NoNewWindow -PassThru | Out-Null
Start-Sleep -Milliseconds 800

Write-Host "Starting frontend (CRA)..."
Start-Process -FilePath 'C:\Program Files\nodejs\node.exe' -ArgumentList '"C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js"','start' -WorkingDirectory (Join-Path $root '..\frontend') -NoNewWindow -PassThru | Out-Null

Write-Host "Started backend and frontend."
Write-Host "Backend: http://localhost:5000"
Write-Host "Frontend: http://localhost:3000"
Write-Host "To stop: find node processes and stop them, or close the shells."