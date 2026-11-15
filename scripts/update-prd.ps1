$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$prdPath = Join-Path $PSScriptRoot '../PRD_Migrasi_UAS_Daya_Pertanian.docx'
$archive = [System.IO.Compression.ZipFile]::Open($prdPath, [System.IO.Compression.ZipArchiveMode]::Update)
try {
  $entry = $archive.GetEntry('word/document.xml')
  $reader = New-Object System.IO.StreamReader($entry.Open())
  $text = $reader.ReadToEnd()
  $reader.Dispose()
  if ($text.Contains('Addendum PRD 0.2')) { Write-Output 'Addendum sudah ada.'; return }
  [xml]$xml = $text
  $wordNs = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
  $ns = New-Object System.Xml.XmlNamespaceManager($xml.NameTable)
  $ns.AddNamespace('w', $wordNs)
  $body = $xml.SelectSingleNode('//w:body', $ns)
  $section = $body.SelectSingleNode('w:sectPr', $ns)
  $lines = Get-Content -LiteralPath (Join-Path $PSScriptRoot '../docs/PRD-Addendum-Lokal.md') -Encoding UTF8
  foreach ($line in $lines) {
    $paragraph = $xml.CreateElement('w', 'p', $wordNs)
    $run = $xml.CreateElement('w', 'r', $wordNs)
    $txt = $xml.CreateElement('w', 't', $wordNs)
    $txt.InnerText = $line
    [void]$run.AppendChild($txt)
    [void]$paragraph.AppendChild($run)
    if ($section) { [void]$body.InsertBefore($paragraph, $section) }
    else { [void]$body.AppendChild($paragraph) }
  }
  # Serialisasi sebelum mengganti entry agar dokumen tetap utuh bila XML tidak valid.
  $buffer = New-Object System.IO.MemoryStream
  $settings = New-Object System.Xml.XmlWriterSettings
  $settings.Encoding = New-Object System.Text.UTF8Encoding($false)
  $writer = [System.Xml.XmlWriter]::Create($buffer, $settings)
  $xml.Save($writer)
  $writer.Flush()
  $bytes = $buffer.ToArray()
  $writer.Dispose()
  $buffer.Dispose()
  $entry.Delete()
  $newEntry = $archive.CreateEntry('word/document.xml')
  $stream = $newEntry.Open()
  $stream.Write($bytes, 0, $bytes.Length)
  $stream.Dispose()
  Write-Output 'Addendum aturan V4 dan keputusan terbuka ditambahkan ke PRD DOCX.'
} finally { $archive.Dispose() }
