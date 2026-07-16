# SOTEK Platform

Plataforma interna de SOTEK DIGITAL para generar proyectos white-label.

## Smoke tests del scaffold

### Modo rapido

```bash
npm install
npm run smoke:scaffold
```

Este modo valida estructura y configuracion del output generado para:

- `public_website` estatico
- `public_website` con backend minimo
- `private_software`

Verifica archivos esperados, archivos que no deben existir y contenido clave en:

- `package.json`
- `docker-compose.yml`
- `.env.example`
- `.github/workflows/deploy.yml`

### Modo completo

```bash
npm run smoke:scaffold -- --with-install
```

Este modo ademas intenta instalar dependencias y ejecutar builds en los proyectos generados.

## CI

El workflow [scaffold-smoke.yml](./.github/workflows/scaffold-smoke.yml) ejecuta:

- smoke estructural en cada push y pull request
- smoke con install y build en ejecucion manual y semanal

## Mas detalle

Documentacion interna: [docs/architecture/scaffold-smoke-tests.md](./docs/architecture/scaffold-smoke-tests.md)

## Validacion manual real

Para la etapa actual de pruebas reales con Docker, usar este runbook:

[docs/testing/manual-real-validation.md](./docs/testing/manual-real-validation.md)
