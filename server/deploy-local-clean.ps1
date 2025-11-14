# Fast local database deployment script - CLEAN VERSION
# Deletes specific database first for completely fresh start

Write-Host "[DELETE] Attempting to delete local database first..." -ForegroundColor Red
$deleteResult = spacetime delete broth-bullets-local 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "[WARN] Delete failed (database may not exist - this is OK): $deleteResult" -ForegroundColor Yellow
    Write-Host "[INFO] Will use --delete-data flag to clear all data instead..." -ForegroundColor Cyan
} else {
    Write-Host "[SUCCESS] Database deleted successfully" -ForegroundColor Green
}

Write-Host "[BUILD] Building and deploying to fresh local database..." -ForegroundColor Yellow
Write-Host "[CRITICAL] Using --delete-data flag to ensure clean database" -ForegroundColor Red
spacetime publish --project-path . --delete-data broth-bullets-local

Write-Host "[GEN] Regenerating client bindings..." -ForegroundColor Yellow
spacetime generate --lang typescript --out-dir ../client/src/generated --project-path .

Write-Host "[SUCCESS] Clean local deployment complete! Database: broth-bullets-local" -ForegroundColor Green
Write-Host "[INFO] Run 'npm run dev' in client folder to test" -ForegroundColor Cyan
Write-Host "[CLEAN] Database was completely wiped and recreated" -ForegroundColor Magenta 