$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = Join-Path $PSScriptRoot "src"
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true

$debounce = 5
$timer = $null

$action = {
  if ($timer) { $timer.Dispose() }
  $timer = New-Object Timers.Timer
  $timer.Interval = $debounce * 1000
  $timer.AutoReset = $false
  Register-ObjectEvent $timer Elapsed -Action {
    Write-Host "`n[$(Get-Date -Format 'HH:mm:ss')] Change detected. Deploying..." -ForegroundColor Cyan
    Set-Location $using:PSScriptRoot
    vercel --prod
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Watching for changes..." -ForegroundColor Cyan
  } | Out-Null
  $timer.Start()
}

Register-ObjectEvent $watcher Changed -Action $action | Out-Null
Register-ObjectEvent $watcher Created -Action $action | Out-Null
Register-ObjectEvent $watcher Deleted -Action $action | Out-Null
Register-ObjectEvent $watcher Renamed -Action $action | Out-Null

Write-Host "Watching for changes in src/..." -ForegroundColor Green
Write-Host "Will deploy to Vercel after $debounce seconds of inactivity." -ForegroundColor Green
Write-Host "Press Ctrl+C to stop." -ForegroundColor Gray

while ($true) { Start-Sleep 10 }
