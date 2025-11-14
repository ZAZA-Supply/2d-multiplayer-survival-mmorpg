# Fast production database deployment script
# Updates existing database without deleting data

Write-Host "[BUILD] Building and deploying to production database..." -ForegroundColor Yellow
Write-Host "[INFO] Updating database schema without clearing data..." -ForegroundColor Cyan
Write-Host "[WARN] If you need to clear corrupted data, use deploy-production-clean.ps1 instead" -ForegroundColor Yellow

Write-Host "[PUBLISH] Running spacetime publish (this may take a minute)..." -ForegroundColor Cyan
spacetime publish --server maincloud --project-path . broth-bullets
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Publish failed with exit code $LASTEXITCODE" -ForegroundColor Red
    Write-Host "[INFO] If you're seeing schema errors, try deploy-production-clean.ps1 to clear data" -ForegroundColor Yellow
    exit 1
}

Write-Host "[GEN] Regenerating client bindings..." -ForegroundColor Yellow
spacetime generate --lang typescript --out-dir ../client/src/generated --project-path .
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Failed to generate client bindings with exit code $LASTEXITCODE" -ForegroundColor Red
    exit 1
}

Write-Host "[GIT] Committing and pushing to trigger Vercel deployment..." -ForegroundColor Yellow
cd ..
git add .
git commit -m "Deploy: Database update with latest changes"
if ($LASTEXITCODE -ne 0) {
    Write-Host "[WARN] Git commit failed or no changes to commit" -ForegroundColor Yellow
} else {
    git push
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Git push failed" -ForegroundColor Red
        exit 1
    }
}

Write-Host "[SUCCESS] Production deployment complete!" -ForegroundColor Green
Write-Host "[URL] Vercel will rebuild: https://broth-and-bullets.vercel.app" -ForegroundColor Cyan
Write-Host "[DB] Database: broth-bullets on maincloud" -ForegroundColor Cyan
Write-Host "[INFO] Database was updated (not wiped) - all existing data preserved" -ForegroundColor Blue 

# Return to server directory
cd server 