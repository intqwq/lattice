param([string]$BuildDirectory, [string]$Version = '0.2.0')
$ErrorActionPreference = 'Stop'
$projectRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$buildRoot = if ([string]::IsNullOrWhiteSpace($BuildDirectory)) { Join-Path $projectRoot 'native\bin\publish-v0.2' } else { [IO.Path]::GetFullPath($BuildDirectory) }
if ($Version -notmatch '^\d+\.\d+\.\d+(?:-[A-Za-z0-9.-]+)?$') { throw 'Use a simple semantic version.' }
if (-not (Test-Path -LiteralPath (Join-Path $buildRoot 'Lattice.exe'))) { throw 'Build the Windows application before packaging.' }
$pack = Get-Content -LiteralPath (Join-Path $buildRoot 'web\data\catalogue.json') -Raw | ConvertFrom-Json
$distRoot = Join-Path $projectRoot 'dist'
[IO.Directory]::CreateDirectory($distRoot) | Out-Null
$archivePath = Join-Path $distRoot "Lattice-$Version-win-x64.zip"
if (Test-Path -LiteralPath $archivePath) { throw "Archive already exists: $archivePath. Choose a new version or preserve it before packaging again." }

Add-Type -AssemblyName System.IO.Compression
$archiveFile = [IO.File]::Open($archivePath, [IO.FileMode]::CreateNew)
try {
    $archive = [IO.Compression.ZipArchive]::new($archiveFile, [IO.Compression.ZipArchiveMode]::Create, $true)
    try {
        foreach ($file in Get-ChildItem -LiteralPath $buildRoot -File -Recurse) {
            $relative = [IO.Path]::GetRelativePath($buildRoot, $file.FullName).Replace('\', '/')
            if ($relative -match '(^|/)(smoke|smoke-profile|WebView2)(/|$)' -or $relative -eq 'smoke-test.json' -or $relative.EndsWith('.pdb')) { continue }
            $entry = $archive.CreateEntry("Lattice/$relative", [IO.Compression.CompressionLevel]::Optimal)
            $inputStream = [IO.File]::OpenRead($file.FullName)
            $outputStream = $entry.Open()
            try { $inputStream.CopyTo($outputStream) } finally { $inputStream.Dispose(); $outputStream.Dispose() }
        }
        foreach ($doc in @('README.md', 'THIRD-PARTY-NOTICES.md', 'content/coverage-map.md', 'content/COVERAGE.md', 'content/coverage.json', 'content/editorial-audit.json', 'tests/UI-REVIEW.md', 'BLUEPRINT.md')) {
            $entry = $archive.CreateEntry("Lattice/$doc", [IO.Compression.CompressionLevel]::Optimal)
            $writer = [IO.StreamWriter]::new($entry.Open(), [Text.UTF8Encoding]::new($false))
            try { $writer.Write([IO.File]::ReadAllText((Join-Path $projectRoot $doc))) } finally { $writer.Dispose() }
        }
        $entry = $archive.CreateEntry('Lattice/START-HERE.txt')
        $writer = [IO.StreamWriter]::new($entry.Open(), [Text.UTF8Encoding]::new($false))
        try {
            $writer.Write("Lattice / 知序 $Version`r`n`r`nExtract the entire archive, then open Lattice.exe. Keep all files together.`r`n解压整个压缩包后打开 Lattice.exe，保留所有同目录文件。`r`n`r`nWindows x64 with Microsoft Edge WebView2 Runtime is required.`r`n需要 Windows x64 和 Microsoft Edge WebView2 Runtime。`r`n`r`nClose any older Lattice window first. Learning records stay in your local Windows profile.`r`n请先关闭旧版 Lattice 窗口。学习记录保存在本机 Windows 用户目录中。`r`n`r`nStudy works offline. Optional source links use your external browser.`r`n学习功能离线可用；可选资料链接通过外部浏览器打开。`r`n`r`nSource and updates: https://github.com/intqwq/lattice`r`n")
        } finally { $writer.Dispose() }
        $entry = $archive.CreateEntry('Lattice/docs/screenshots/windows-studio.png', [IO.Compression.CompressionLevel]::Optimal)
        $imageStream = [IO.File]::OpenRead((Join-Path $projectRoot 'docs\screenshots\windows-studio.png'))
        $imageOutput = $entry.Open()
        try { $imageStream.CopyTo($imageOutput) } finally { $imageStream.Dispose(); $imageOutput.Dispose() }
    } finally { $archive.Dispose() }
} finally { $archiveFile.Dispose() }

$sha = (Get-FileHash -LiteralPath $archivePath -Algorithm SHA256).Hash.ToLowerInvariant()
"$sha  $([IO.Path]::GetFileName($archivePath))" | Set-Content -LiteralPath (Join-Path $distRoot 'SHA256SUMS.txt') -Encoding ascii
[pscustomobject]@{ archive = $archivePath; sha256 = $sha; bytes = (Get-Item -LiteralPath $archivePath).Length; lessons = $pack.totals.lessons; moduleChapters = $pack.totals.moduleChapters } | ConvertTo-Json
