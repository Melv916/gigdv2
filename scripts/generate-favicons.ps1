$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

$publicDir = Join-Path $PSScriptRoot "..\public"

function New-GigdBitmap {
  param(
    [int]$Size
  )

  $bitmap = New-Object System.Drawing.Bitmap $Size, $Size
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $graphics.Clear([System.Drawing.Color]::FromArgb(16, 16, 18))

  $white = [System.Drawing.Color]::FromArgb(245, 245, 245)
  $cyan = [System.Drawing.Color]::FromArgb(84, 198, 224)

  $frameWidth = [Math]::Max(2, [int][Math]::Round($Size * 0.085))
  $left = [Math]::Round($Size * 0.23)
  $top = [Math]::Round($Size * 0.21)
  $right = [Math]::Round($Size * 0.72)
  $bottom = [Math]::Round($Size * 0.74)
  $radius = [Math]::Round($Size * 0.14)

  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $path.AddArc($left, $top, $radius * 2, $radius * 2, 180, 90)
  $path.AddLine($left + $radius, $top, $right, $top)
  $path.AddLine($left, $top + $radius, $left, $bottom - $radius)
  $path.AddArc($left, $bottom - ($radius * 2), $radius * 2, $radius * 2, 90, 90)
  $path.AddLine($left + $radius, $bottom, $right, $bottom)
  $path.AddLine($right, $bottom, $right, [Math]::Round($Size * 0.34))
  $path.AddLine($right, [Math]::Round($Size * 0.34), [Math]::Round($Size * 0.62), [Math]::Round($Size * 0.34))

  $framePen = New-Object System.Drawing.Pen $white, $frameWidth
  $framePen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $framePen.EndCap = [System.Drawing.Drawing2D.LineCap]::Square
  $framePen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
  $graphics.DrawPath($framePen, $path)

  $cutout = New-Object System.Drawing.Drawing2D.GraphicsPath
  $cutout.AddPolygon(@(
      [System.Drawing.Point]::new([Math]::Round($Size * 0.61), [Math]::Round($Size * 0.62)),
      [System.Drawing.Point]::new([Math]::Round($Size * 0.72), [Math]::Round($Size * 0.62)),
      [System.Drawing.Point]::new([Math]::Round($Size * 0.72), [Math]::Round($Size * 0.75))
    ))
  $graphics.FillPath([System.Drawing.Brushes]::Black, $cutout)

  $barBase = [Math]::Round($Size * 0.56)
  $barBottom = [Math]::Round($Size * 0.63)
  $barWidth = [Math]::Max(2, [int][Math]::Round($Size * 0.06))
  $barGap = [Math]::Max(1, [int][Math]::Round($Size * 0.02))
  $barHeights = @(
    [Math]::Round($Size * 0.10),
    [Math]::Round($Size * 0.18),
    [Math]::Round($Size * 0.28)
  )
  $barColors = @($white, $white, $cyan)

  for ($index = 0; $index -lt 3; $index++) {
    $x = $barBase + ($index * ($barWidth + $barGap))
    $height = $barHeights[$index]
    $y = $barBottom - $height
    $rect = New-Object System.Drawing.Rectangle $x, $y, $barWidth, $height
    $graphics.FillRectangle((New-Object System.Drawing.SolidBrush $barColors[$index]), $rect)
  }

  $graphics.Dispose()
  $framePen.Dispose()
  $path.Dispose()
  $cutout.Dispose()

  return $bitmap
}

function Save-Png {
  param(
    [System.Drawing.Bitmap]$Bitmap,
    [string]$Path
  )

  $Bitmap.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
}

function Get-PngBytes {
  param(
    [System.Drawing.Bitmap]$Bitmap
  )

  $stream = New-Object System.IO.MemoryStream
  $Bitmap.Save($stream, [System.Drawing.Imaging.ImageFormat]::Png)
  $bytes = $stream.ToArray()
  $stream.Dispose()
  return $bytes
}

function Save-Ico {
  param(
    [hashtable]$PngPayloads,
    [string]$Path
  )

  $sizes = $PngPayloads.Keys | Sort-Object
  $stream = New-Object System.IO.MemoryStream
  $writer = New-Object System.IO.BinaryWriter $stream

  $writer.Write([UInt16]0)
  $writer.Write([UInt16]1)
  $writer.Write([UInt16]$sizes.Count)

  $offset = 6 + (16 * $sizes.Count)

  foreach ($size in $sizes) {
    $payload = $PngPayloads[$size]
    $writer.Write([byte]$size)
    $writer.Write([byte]$size)
    $writer.Write([byte]0)
    $writer.Write([byte]0)
    $writer.Write([UInt16]1)
    $writer.Write([UInt16]32)
    $writer.Write([UInt32]$payload.Length)
    $writer.Write([UInt32]$offset)
    $offset += $payload.Length
  }

  foreach ($size in $sizes) {
    $payload = [byte[]]$PngPayloads[$size]
    $stream.Write($payload, 0, $payload.Length)
  }

  [System.IO.File]::WriteAllBytes($Path, $stream.ToArray())
  $writer.Dispose()
  $stream.Dispose()
}

$sizes = @(16, 32, 48, 180)
$bitmaps = @{}

foreach ($size in $sizes) {
  $bitmaps[$size] = New-GigdBitmap -Size $size
}

Save-Png -Bitmap $bitmaps[16] -Path (Join-Path $publicDir "favicon-16x16.png")
Save-Png -Bitmap $bitmaps[32] -Path (Join-Path $publicDir "favicon-32x32.png")
Save-Png -Bitmap $bitmaps[48] -Path (Join-Path $publicDir "favicon-48x48.png")
Save-Png -Bitmap $bitmaps[180] -Path (Join-Path $publicDir "apple-touch-icon.png")

$icoPayloads = @{
  16 = Get-PngBytes -Bitmap $bitmaps[16]
  32 = Get-PngBytes -Bitmap $bitmaps[32]
  48 = Get-PngBytes -Bitmap $bitmaps[48]
}

Save-Ico -PngPayloads $icoPayloads -Path (Join-Path $publicDir "favicon.ico")

foreach ($bitmap in $bitmaps.Values) {
  $bitmap.Dispose()
}

Write-Output "Favicons generated in $publicDir"
