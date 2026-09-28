$ErrorActionPreference = 'Stop'
$latticeExecutable = Join-Path $PSScriptRoot 'native\bin\publish\Lattice.exe'
if (-not (Test-Path -LiteralPath $latticeExecutable)) {
    throw 'Build Lattice first: node scripts/build-content.mjs, then pwsh -File scripts/build-windows.ps1'
}
Start-Process -FilePath $latticeExecutable -WorkingDirectory (Split-Path -Parent $latticeExecutable)
