# ============================================================
# Dockerfile - Nginx para SOTEK
# ============================================================
# 
# Imagen optimizada con:
#   - Configuración personalizada
#   - Directorios de cache pre-creados
#   - Permisos correctos
#
# Build:
#   docker build -t SOTEK-nginx ./nginx
#
# ============================================================

FROM nginx:1.25-alpine

# Metadata
LABEL maintainer="SOTEK Team"
LABEL description="Nginx reverse proxy with caching for SOTEK"

# Crear directorios de cache con permisos correctos
RUN mkdir -p /var/cache/nginx/images \
             /var/cache/nginx/static \
    && chown -R nginx:nginx /var/cache/nginx

# Copiar configuración personalizada
COPY nginx.conf /etc/nginx/nginx.conf

# Exponer puertos
EXPOSE 80 443

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

# Comando por defecto
CMD ["nginx", "-g", "daemon off;"]
