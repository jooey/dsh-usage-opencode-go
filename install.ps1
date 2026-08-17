# Installs the dsh-usage-opencode-go plugin into the DSH web profile.
param(
  [string]$Profile = "web"
)
$ErrorActionPreference = "Stop"
$src = Join-Path $PSScriptRoot "dsh-usage-opencode-go"
$modulesDir = Join-Path $env:USERPROFILE ".dsh\profiles\node_modules"
$dest = Join-Path $modulesDir "dsh-usage-opencode-go"
$patchPath = Join-Path $env:USERPROFILE ".dsh\profiles\$Profile\cordis.patch.yml"

if (-not (Test-Path (Join-Path $src "lib\index.js"))) {
  throw "Plugin source not found at $src"
}

# 1. copy the package into the profile module fallback
if (Test-Path $dest) { Remove-Item $dest -Recurse -Force }
New-Item -ItemType Directory -Path (Join-Path $dest "lib") -Force | Out-Null
Copy-Item (Join-Path $src "package.json") (Join-Path $dest "package.json") -Force
Copy-Item (Join-Path $src "lib\index.js") (Join-Path $dest "lib\index.js") -Force
Copy-Item (Join-Path $src "lib\logic.js") (Join-Path $dest "lib\logic.js") -Force
Copy-Item (Join-Path $src "lib\client.js") (Join-Path $dest "lib\client.js") -Force
Copy-Item (Join-Path $src "lib\typert.host.js") (Join-Path $dest "lib\typert.host.js") -Force
Copy-Item (Join-Path $src "lib\typert.remote-client.js") (Join-Path $dest "lib\typert.remote-client.js") -Force
Copy-Item (Join-Path $src "lib\index.d.ts") (Join-Path $dest "lib\index.d.ts") -Force
Write-Host "Installed plugin => $dest"

# 2. register it in the profile patch layer (idempotent)
$insert = @"
# dsh-usage-opencode-go: /usage-opencode-go command + composer readout for the OpenCode Go quota.
- insert:
    - id: opencode-usage
      name: 'dsh-usage-opencode-go'
"@
$text = Get-Content $patchPath -Raw -ErrorAction SilentlyContinue
if ($null -eq $text) { $text = "" }
if ($text -notmatch "opencode-usage") {
  Add-Content -Path $patchPath -Value $insert
  Write-Host "Registered plugin in $patchPath"
} else {
  Write-Host "Plugin already registered in $patchPath"
}
Write-Host "Done. Restart the DSH web app. /usage-opencode-go prints the full report, and the composer shows the readout."
