# Compress images for GitHub Pages using .NET GDI+
Add-Type -AssemblyName System.Drawing

function Compress-Image {
    param(
        [string]$SourcePath,
        [string]$OutputPath,
        [int]$MaxWidth,
        [int]$Quality = 85
    )

    $img = [System.Drawing.Image]::FromFile($SourcePath)
    $ratio = $img.Height / $img.Width
    $newWidth = [Math]::Min($MaxWidth, $img.Width)
    $newHeight = [int]($newWidth * $ratio)

    $bitmap = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.DrawImage($img, 0, 0, $newWidth, $newHeight)

    $encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
    $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, $Quality)

    $bitmap.Save($OutputPath, $encoder, $encoderParams)

    $graphics.Dispose()
    $bitmap.Dispose()
    $img.Dispose()

    $sizeKB = (Get-Item $OutputPath).Length / 1KB
    Write-Host "  ✓ $(Split-Path $OutputPath -Leaf) — $([Math]::Round($sizeKB))KB"
}

$expDir = "assets/experiences"
@("DolomitiFriulane", "MonteAdamello", "MonteReDiCastello", "veronaResia") | ForEach-Object {
    New-Item -ItemType Directory -Path "$expDir/$_" -Force | Out-Null
    New-Item -ItemType Directory -Path "$expDir/$_/thumb" -Force | Out-Null
}

$allImages = @(Get-ChildItem -Path "assets" -Include "*.jpg" -Exclude "profile.jpg" -Recurse)
Write-Host "Processing $($allImages.Count) images..."

foreach ($image in $allImages) {
    $folder = $image.Directory.Name
    $name = $image.BaseName

    Write-Host ""
    Write-Host "📷 $folder/$($image.Name)"

    Compress-Image -SourcePath $image.FullName -OutputPath "$expDir/$folder/thumb/${name}.jpg" -MaxWidth 400 -Quality 80
    Compress-Image -SourcePath $image.FullName -OutputPath "$expDir/$folder/${name}.jpg" -MaxWidth 1200 -Quality 85
}

Write-Host ""
Write-Host "✓ Done! Images in $expDir"
