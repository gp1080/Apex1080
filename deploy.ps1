# Apex 1080 — GitHub deploy helper
# Run this script in PowerShell:  .\deploy.ps1

$ErrorActionPreference = "Stop"

# Refresh PATH so gh is found
$env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
$gh = "C:\Program Files\GitHub CLI\gh.exe"

Set-Location $PSScriptRoot

Write-Host "`n=== Step 1: GitHub login ===" -ForegroundColor Cyan
Write-Host "A browser window will open. Paste the code when prompted."
Write-Host "IMPORTANT: Wait until you see 'Logged in as ...' — do NOT press Ctrl+C.`n"

if (Test-Path $gh) {
    & $gh auth login -h github.com -p https -w
    & $gh auth status
} else {
    Write-Host "GitHub CLI not found. Install from: https://cli.github.com/" -ForegroundColor Red
    exit 1
}

Write-Host "`n=== Step 2: Create repo and push ===" -ForegroundColor Cyan
& $gh repo create apex1080 --public --source=. --remote=origin --push --description "Apex 1080 - Project Heimdall marketing site"

Write-Host "`n=== Step 3: Enable GitHub Pages ===" -ForegroundColor Cyan
$user = (& $gh api user -q .login)
& $gh api -X POST "/repos/$user/apex1080/pages" -f "build_type=legacy" -f "source[branch]=main" -f "source[path]=/"

Write-Host "`n=== Done! ===" -ForegroundColor Green
Write-Host "Site URL: https://$user.github.io/apex1080/"
Write-Host "Custom domain (after DNS): https://apex1080.com"
Write-Host "`nConfigure DNS at your registrar — see GitHub repo Settings > Pages.`n"
