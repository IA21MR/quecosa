#!/usr/bin/env bash
# ============================================================
# manage.sh — Script de administración del servidor SOTEK
# ============================================================
#
# Uso:
#   ./manage.sh [comando]
#
# Comandos disponibles:
#   up        Levantar todos los servicios
#   down      Detener todos los servicios
#   restart   Reiniciar todos los servicios
#   rebuild   Reconstruir imágenes y levantar
#   logs      Ver logs de todos los servicios (tail -f)
#   status    Ver estado y uso de recursos
#   migrate   Correr migraciones de Prisma
#   seed      Correr seed de base de datos
#   shell-db  Abrir consola de PostgreSQL
#   shell-be  Abrir shell del backend
#   pull      Actualizar código del repositorio y rebuildar
#   backup    Crear backup de la base de datos
#
# ============================================================

set -euo pipefail

COMPOSE_FILE="docker-compose.server.yml"
ENV_FILE=".env"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKUP_DIR="$PROJECT_DIR/backups"

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # Sin color

log()    { echo -e "${GREEN}[$(date '+%H:%M:%S')]${NC} $*"; }
warn()   { echo -e "${YELLOW}[WARN]${NC} $*"; }
error()  { echo -e "${RED}[ERROR]${NC} $*" >&2; exit 1; }

cd "$PROJECT_DIR"

# Verificar que existe el .env
[ -f "$ENV_FILE" ] || error "No se encontró .env — copia .env.server.example a .env y configúralo"

COMPOSE="docker compose -f $COMPOSE_FILE --env-file $ENV_FILE"

case "${1:-help}" in

  up)
    log "Levantando servicios..."
    $COMPOSE up -d
    log "✓ Servicios levantados"
    $COMPOSE ps
    ;;

  down)
    log "Deteniendo servicios..."
    $COMPOSE down
    log "✓ Servicios detenidos"
    ;;

  restart)
    log "Reiniciando servicios..."
    $COMPOSE restart
    log "✓ Servicios reiniciados"
    ;;

  rebuild)
    log "Reconstruyendo imágenes (esto puede tomar varios minutos)..."
    $COMPOSE down
    $COMPOSE build --no-cache
    $COMPOSE up -d
    log "✓ Rebuild completo"
    ;;

  logs)
    SERVICE="${2:-}"
    if [ -n "$SERVICE" ]; then
      $COMPOSE logs -f --tail=100 "$SERVICE"
    else
      $COMPOSE logs -f --tail=50
    fi
    ;;

  status)
    log "Estado de los servicios:"
    $COMPOSE ps
    echo ""
    log "Uso de recursos del sistema:"
    docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}"
    echo ""
    log "Espacio en disco:"
    df -h /
    echo ""
    log "RAM total del sistema:"
    free -h
    ;;

  migrate)
    log "Ejecutando migraciones de Prisma..."
    $COMPOSE exec backend npx prisma migrate deploy
    log "✓ Migraciones aplicadas"
    ;;

  seed)
    warn "Esto insertará datos de prueba. ¿Continuar? (s/N)"
    read -r confirm
    [ "$confirm" = "s" ] || { log "Cancelado"; exit 0; }
    log "Ejecutando seed..."
    $COMPOSE exec backend node prisma/seed.mjs
    log "✓ Seed completado"
    ;;

  shell-db)
    log "Abriendo consola PostgreSQL..."
    DB_USER=$(grep POSTGRES_USER "$ENV_FILE" | cut -d= -f2 | tr -d '"')
    DB_NAME=$(grep POSTGRES_DB "$ENV_FILE" | cut -d= -f2 | tr -d '"')
    $COMPOSE exec postgres psql -U "${DB_USER:-SOTEK}" "${DB_NAME:-SOTEK}"
    ;;

  shell-be)
    log "Abriendo shell del backend..."
    $COMPOSE exec backend sh
    ;;

  pull)
    log "Actualizando código desde el repositorio..."
    git pull origin "$(git rev-parse --abbrev-ref HEAD)"
    log "Reconstruyendo servicios actualizados..."
    $COMPOSE build
    $COMPOSE up -d
    log "✓ Actualización completa"
    ;;

  backup)
    mkdir -p "$BACKUP_DIR"
    TIMESTAMP=$(date '+%Y%m%d_%H%M%S')
    BACKUP_FILE="$BACKUP_DIR/SOTEK_${TIMESTAMP}.sql.gz"
    log "Creando backup en $BACKUP_FILE ..."
    DB_USER=$(grep POSTGRES_USER "$ENV_FILE" | cut -d= -f2 | tr -d '"')
    DB_NAME=$(grep POSTGRES_DB "$ENV_FILE" | cut -d= -f2 | tr -d '"')
    $COMPOSE exec -T postgres pg_dump -U "${DB_USER:-SOTEK}" "${DB_NAME:-SOTEK}" | gzip > "$BACKUP_FILE"
    log "✓ Backup guardado: $BACKUP_FILE ($(du -sh "$BACKUP_FILE" | cut -f1))"
    # Mantener solo los últimos 7 backups
    ls -t "$BACKUP_DIR"/*.sql.gz 2>/dev/null | tail -n +8 | xargs -r rm
    ;;

  help|*)
    echo ""
    echo -e "${BLUE}SOTEK — Administración del servidor${NC}"
    echo ""
    echo "Uso: ./manage.sh [comando]"
    echo ""
    echo "Comandos:"
    echo "  up          Levantar servicios"
    echo "  down        Detener servicios"
    echo "  restart     Reiniciar servicios"
    echo "  rebuild     Reconstruir imágenes y levantar"
    echo "  logs [svc]  Ver logs (opcionalmente de un servicio)"
    echo "  status      Estado y uso de recursos"
    echo "  migrate     Aplicar migraciones de Prisma"
    echo "  seed        Insertar datos de prueba"
    echo "  shell-db    Consola PostgreSQL"
    echo "  shell-be    Shell del backend"
    echo "  pull        Git pull + rebuild"
    echo "  backup      Backup de la base de datos"
    echo ""
    ;;
esac
