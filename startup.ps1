# Terminal 1 - Start Payload CMS on port 3001
Write-Host "Starting Payload CMS..." -ForegroundColor Cyan
cd "c:\laragon\www\qrs-app\frontend"
npx tsx cms/server.ts

# This will start a custom Payload server on port 3001
