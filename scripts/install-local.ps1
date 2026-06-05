$ErrorActionPreference = "Stop"

$flowPluginFolderName = "map-paste"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir

$source = $projectRoot
$targetRoot = Join-Path $env:APPDATA "FlowLauncher\Plugins"
$target = Join-Path $targetRoot $flowPluginFolderName

Write-Host "Installing MapPaste"
Write-Host "Source: $source"
Write-Host "Target: $target"

if (-not (Test-Path (Join-Path $source "plugin.json"))) {
    throw "plugin.json was not found in project root: $source"
}

if (-not (Test-Path (Join-Path $source "main.js"))) {
    throw "main.js was not found in project root: $source"
}

New-Item -ItemType Directory -Force -Path $targetRoot | Out-Null

if (Test-Path $target) {
    Write-Host "Removing existing plugin folder..."
    Remove-Item $target -Recurse -Force
}

Write-Host "Copying plugin files..."

$excludeDirs = @(
    ".git",
    ".idea",
    ".vscode",
    "coverage",
    "node_modules"
)

$excludeFiles = @(
    "npm-debug.log"
)

New-Item -ItemType Directory -Force -Path $target | Out-Null

Get-ChildItem -Path $source -Force | ForEach-Object {
    $name = $_.Name

    if ($_.PSIsContainer -and $excludeDirs -contains $name) {
        return
    }

    if (-not $_.PSIsContainer -and $excludeFiles -contains $name) {
        return
    }

    Copy-Item -Path $_.FullName -Destination $target -Recurse -Force
}

Write-Host ""
Write-Host "Installed successfully."
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Restart Flow Launcher if plugin.json changed."
Write-Host "2. Type: mp coffee near Barcelona"
Write-Host ""
Write-Host "Installed files:"
Get-ChildItem $target | Select-Object Name
