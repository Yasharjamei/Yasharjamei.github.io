# Builds the Netlify drag-and-drop bundle from out/.
#
# Why not Compress-Archive: Windows PowerShell writes zip entries with backslash
# separators (_next\static\...). Netlify unpacks on Linux, where those are literal
# filenames rather than folders — the tree flattens and every asset 404s.
# ZipArchive is used directly so entry names keep forward slashes.
#
#   npm run build
#   powershell -File scripts/make-zip.ps1

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$proj = Split-Path -Parent $PSScriptRoot
$root = Join-Path $proj 'out'
$zipPath = Join-Path $proj 'website-design-netlify.zip'

if (-not [System.IO.Directory]::Exists($root)) {
  Write-Error "out/ not found. Run 'npm run build' first."
  exit 1
}

if ([System.IO.File]::Exists($zipPath)) { [System.IO.File]::Delete($zipPath) }

$fs = [System.IO.File]::Open($zipPath, [System.IO.FileMode]::CreateNew)
$archive = New-Object System.IO.Compression.ZipArchive($fs, [System.IO.Compression.ZipArchiveMode]::Create)

$prefixLen = $root.Length + 1
foreach ($f in (Get-ChildItem -Recurse -File $root)) {
  $rel = $f.FullName.Substring($prefixLen).Replace('\', '/')
  [void][System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
    $archive, $f.FullName, $rel, [System.IO.Compression.CompressionLevel]::Optimal)
}

$archive.Dispose()
$fs.Dispose()

# Verify: no backslash entries, and an index.html at the root.
$z = [System.IO.Compression.ZipFile]::OpenRead($zipPath)
$names = @($z.Entries | ForEach-Object { $_.FullName })
$bad = @($names | Where-Object { $_ -like '*\*' }).Count
$hasIndex = @($names | Where-Object { $_ -eq 'index.html' }).Count -gt 0
$z.Dispose()

if ($bad -gt 0) { Write-Error "$bad entries contain backslashes; Netlify would flatten these."; exit 1 }
if (-not $hasIndex) { Write-Error 'No index.html at the archive root.'; exit 1 }

$mb = [math]::Round((Get-Item $zipPath).Length / 1MB, 2)
Write-Output "OK  $($names.Count) entries, ${mb} MB -> $zipPath"
