# Fast production database deployment script - CLEAN VERSION
# Deletes database first for completely fresh start

Write-Host "[DELETE] Attempting to delete production database first..." -ForegroundColor Red
$deleteResult = spacetime delete --server maincloud broth-bullets 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "[WARN] Delete failed (likely permission issue - this is OK): $deleteResult" -ForegroundColor Yellow
    Write-Host "[INFO] Will use --delete-data flag to clear all data instead..." -ForegroundColor Cyan
} else {
    Write-Host "[SUCCESS] Database deleted successfully" -ForegroundColor Green
}

Write-Host "[BUILD] Building and deploying to production database..." -ForegroundColor Yellow
Write-Host "[CRITICAL] Using --delete-data flag to clear corrupted data and fix deserialization errors" -ForegroundColor Red
spacetime publish --server maincloud --project-path . --delete-data broth-bullets

Write-Host "[GEN] Regenerating client bindings..." -ForegroundColor Yellow
spacetime generate --lang typescript --out-dir ../client/src/generated --project-path .

Write-Host "[GIT] Committing and pushing to trigger Vercel deployment..." -ForegroundColor Yellow
cd ..
git add .
git commit -m "Deploy: Clean database rebuild with new schema"
git push

Write-Host "[SUCCESS] Clean production deployment complete!" -ForegroundColor Green
Write-Host "[URL] Vercel will rebuild: https://broth-and-bullets.vercel.app" -ForegroundColor Cyan
Write-Host "[DB] Database: broth-bullets on maincloud" -ForegroundColor Cyan
Write-Host "[CLEAN] Production database was completely wiped and recreated" -ForegroundColor Magenta 

# Return to server directory
cd server 