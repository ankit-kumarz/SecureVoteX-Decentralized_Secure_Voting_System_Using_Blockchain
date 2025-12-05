# Face-API.js Models Downloader
# Run this script from: frontend/public/models/ directory

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Face-API.js Models Downloader" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if running from correct directory
if (-not (Test-Path "README.md")) {
    Write-Host "ERROR: Please run this script from frontend/public/models/ directory" -ForegroundColor Red
    Write-Host "Current directory: $(Get-Location)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Run these commands first:" -ForegroundColor Yellow
    Write-Host "  cd frontend/public/models" -ForegroundColor Green
    Write-Host "  .\download-models.ps1" -ForegroundColor Green
    exit 1
}

$baseUrl = "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights"

$files = @(
    "tiny_face_detector_model-weights_manifest.json",
    "tiny_face_detector_model-shard1",
    "face_landmark_68_model-weights_manifest.json",
    "face_landmark_68_model-shard1",
    "face_recognition_model-weights_manifest.json",
    "face_recognition_model-shard1",
    "face_recognition_model-shard2",
    "face_expression_model-weights_manifest.json",
    "face_expression_model-shard1"
)

Write-Host "Downloading $($files.Count) model files..." -ForegroundColor Yellow
Write-Host ""

$successCount = 0
$failCount = 0

foreach ($file in $files) {
    try {
        Write-Host "  [$($successCount + $failCount + 1)/$($files.Count)] Downloading $file..." -NoNewline
        
        $url = "$baseUrl/$file"
        $output = Join-Path (Get-Location) $file
        
        Invoke-WebRequest -Uri $url -OutFile $output -ErrorAction Stop
        
        $fileSize = (Get-Item $output).Length / 1KB
        Write-Host " OK ($([math]::Round($fileSize, 2)) KB)" -ForegroundColor Green
        $successCount++
    }
    catch {
        Write-Host " FAILED" -ForegroundColor Red
        Write-Host "    Error: $($_.Exception.Message)" -ForegroundColor Red
        $failCount++
    }
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Download Summary" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  Success: $successCount/$($files.Count)" -ForegroundColor Green
Write-Host "  Failed:  $failCount/$($files.Count)" -ForegroundColor $(if ($failCount -gt 0) { "Red" } else { "Gray" })
Write-Host ""

if ($successCount -eq $files.Count) {
    Write-Host "[OK] All models downloaded successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Yellow
    Write-Host "  1. Start backend:  cd backend; npm start" -ForegroundColor Cyan
    Write-Host "  2. Start frontend: cd frontend; npm start" -ForegroundColor Cyan
    Write-Host "  3. Test face verification at http://localhost:3000" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host "[WARNING] Some downloads failed. Please try again or download manually." -ForegroundColor Yellow
    Write-Host "Manual download: https://github.com/justadudewhohacks/face-api.js/tree/master/weights" -ForegroundColor Cyan
    Write-Host ""
}

# Verify all files exist
Write-Host "Verifying downloaded files..." -ForegroundColor Yellow
$existingFiles = Get-ChildItem -Filter "*.json", "*.shard*" | Select-Object -ExpandProperty Name
Write-Host "Files in directory:" -ForegroundColor Gray
$existingFiles | ForEach-Object { Write-Host "  - $_" -ForegroundColor Gray }
Write-Host ""

if ($existingFiles.Count -ge 9) {
    Write-Host "[OK] All model files present!" -ForegroundColor Green
} else {
    Write-Host "[WARNING] Expected 9 files, found $($existingFiles.Count)" -ForegroundColor Yellow
}
