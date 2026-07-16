# ============================================================
#  SOTEK - Deploy a produccion
#  Uso: doble click o ejecutar en PowerShell
# ============================================================

$SERVER = "deploy@159.65.250.51"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   SOTEK - Deploy a produccion" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# --- Paso 1: Deploy en el servidor ---
Write-Host "[1] Ejecutando deploy en el servidor..." -ForegroundColor Green
Write-Host ""

ssh $SERVER "bash /srv/SOTEK/deploy.sh"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "   Deploy completado exitosamente!" -ForegroundColor Green
    Write-Host "   https://159.65.250.51" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "   ERROR en el deploy. Revisa los logs." -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
}

Write-Host ""
Write-Host "Presiona Enter para cerrar..." -NoNewline
Read-Host
