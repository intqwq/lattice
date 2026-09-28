param([switch]$SmokeTest, [string]$OutputDirectory)
$ErrorActionPreference = 'Stop'
$projectRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$projectFile = Join-Path $projectRoot 'native\Lattice.csproj'
$publishDirectory = if ([string]::IsNullOrWhiteSpace($OutputDirectory)) { Join-Path $projectRoot 'native\bin\publish-v0.2' } elseif ([IO.Path]::IsPathRooted($OutputDirectory)) { [IO.Path]::GetFullPath($OutputDirectory) } else { [IO.Path]::GetFullPath((Join-Path $projectRoot $OutputDirectory)) }
if (-not (Test-Path -LiteralPath (Join-Path $projectRoot 'web\index.html'))) { throw 'Build the web assets first: web/index.html is required.' }
& dotnet publish $projectFile -c Release -r win-x64 --self-contained true -o $publishDirectory
if ($LASTEXITCODE -ne 0) { throw "Windows build failed (exit $LASTEXITCODE)." }
$executable = Join-Path $publishDirectory 'Lattice.exe'
Write-Output "Windows application: $executable"
if ($SmokeTest) {
    $smokeStartedAt = [DateTime]::UtcNow
    $smokeDirectory = Join-Path $projectRoot 'native\smoke'
    $process = Start-Process -FilePath $executable -ArgumentList @('--smoke-test', '--smoke-output', ('"' + $smokeDirectory + '"')) -WorkingDirectory $publishDirectory -WindowStyle Hidden -PassThru
    if (-not $process.WaitForExit(45000)) { Stop-Process -Id $process.Id -Force; throw 'Desktop smoke test exceeded 45 seconds.' }
    if ($process.ExitCode -ne 0) { throw "Desktop smoke test exited with $($process.ExitCode)." }
    $reportPath = Join-Path $publishDirectory 'smoke-test.json'
    if (-not (Test-Path -LiteralPath $reportPath)) { throw "Desktop smoke test produced no report (exit $($process.ExitCode))." }
    if ((Get-Item -LiteralPath $reportPath).LastWriteTimeUtc -lt $smokeStartedAt) { throw 'Desktop smoke test did not refresh its report.' }
    $report = Get-Content -LiteralPath $reportPath -Raw | ConvertFrom-Json
    if (-not $report.ok) { throw "Desktop smoke test failed: $($report | ConvertTo-Json -Depth 8 -Compress)" }
    $report | ConvertTo-Json -Depth 8
}
