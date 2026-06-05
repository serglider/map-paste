$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir

$packageJsonPath = Join-Path $projectRoot "package.json"
$pluginJsonPath = Join-Path $projectRoot "plugin.json"

if (-not (Test-Path $packageJsonPath)) {
    throw "package.json was not found."
}

if (-not (Test-Path $pluginJsonPath)) {
    throw "plugin.json was not found."
}

$packageJson = Get-Content $packageJsonPath -Raw | ConvertFrom-Json
$pluginJson = Get-Content $pluginJsonPath -Raw | ConvertFrom-Json

$version = $packageJson.version
$pluginVersion = $pluginJson.Version

if ($version -ne $pluginVersion) {
    throw "Version mismatch: package.json has $version but plugin.json has $pluginVersion"
}

$releaseRoot = Join-Path $projectRoot "release"
$stagingRoot = Join-Path $releaseRoot "staging"
$zipPath = Join-Path $releaseRoot "map-paste-v$version.zip"

if (Test-Path $releaseRoot) {
    Remove-Item $releaseRoot -Recurse -Force
}

New-Item -ItemType Directory -Force -Path $stagingRoot | Out-Null

$includeItems = @(
    "plugin.json",
    "main.js",
    "src",
    "Images",
    "SettingsTemplate.yaml",
    "README.md",
    "LICENSE",
    "package.json",
    "package-lock.json"
)

foreach ($item in $includeItems) {
    $sourcePath = Join-Path $projectRoot $item

    if (Test-Path $sourcePath) {
        Copy-Item $sourcePath $stagingRoot -Recurse -Force
    }
    else {
        Write-Host "Skipping missing optional item: $item"
    }
}

Compress-Archive -Path (Join-Path $stagingRoot "*") -DestinationPath $zipPath -Force

Write-Host "Created release package:"
Write-Host $zipPath
