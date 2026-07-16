#!/usr/bin/env bash
# Espera a que backend y/o frontend estén respondiendo y notifica.
# Uso:
#   ./wait-ready.sh            → espera backend + frontend
#   ./wait-ready.sh --backend  → espera solo el backend

BACKEND="http://localhost:3000"
FRONTEND="http://localhost:3001"
TIMEOUT=180   # segundos máximos de espera
INTERVAL=3

GREEN=$'\033[0;32m'
YELLOW=$'\033[1;33m'
NC=$'\033[0m'

tick=0

wait_for() {
  local name="$1" url="$2"
  printf "${YELLOW}⏳ Esperando %s...${NC}" "$name"
  while ! curl -s --max-time 2 "$url" > /dev/null 2>&1; do
    sleep $INTERVAL
    tick=$((tick + INTERVAL))
    printf "."
    if [ $tick -ge $TIMEOUT ]; then
      echo ""
      echo "❌ Timeout esperando $name ($url)"
      exit 1
    fi
  done
  printf " ${GREEN}✓${NC}\n"
}

echo ""
echo "=== SOTEK — Esperando servicios ==="
echo ""

if [[ "${1:-}" == "--backend" ]]; then
  wait_for "backend  (3000)" "$BACKEND"
  echo ""
  echo -e "${GREEN}✅ Backend listo — http://localhost:3000${NC}"
  echo ""
  if command -v notify-send &> /dev/null; then
    notify-send "SOTEK backend listo" "Backend respondiendo ✅" --icon=dialog-information
  fi
  printf '\a'
  exit 0
fi

wait_for "backend  (3000)" "$BACKEND"
wait_for "frontend (3001)" "$FRONTEND"

echo ""
echo -e "${GREEN}✅ Todo listo — http://localhost:3001${NC}"
echo ""

# Notificación de escritorio (si está disponible)
if command -v notify-send &> /dev/null; then
  notify-send "SOTEK listo" "Backend y frontend respondiendo ✅" --icon=dialog-information
fi

# Beep de terminal
printf '\a'
