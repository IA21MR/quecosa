#!/usr/bin/env node

import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
import {
  getCoreModulesForProjectType,
  projectTypeRequiresBackend,
  projectTypeRequiresDatabase,
} from '../cli/utils/generator-catalog.mjs';

const repoRoot = dirname(fileURLToPath(new URL('../package.json', import.meta.url)));
const cliPath = fileURLToPath(new URL('../cli/create-erp.mjs', import.meta.url));
const withInstall = process.argv.includes('--with-install') || process.env.SMOKE_SCAFFOLD_INSTALL === '1';
const SCAFFOLD_TIMEOUT_MS = 90_000;
const INSTALL_TIMEOUT_MS = 10 * 60_000;

function getNodeExecutable() {
  return process.execPath;
}

function getNpmExecutable() {
  return process.platform === 'win32' ? 'npm.cmd' : 'npm';
}

function getNpmCommand(args) {
  if (process.platform === 'win32') {
    return {
      file: process.env.ComSpec || 'cmd.exe',
      args: ['/d', '/s', '/c', 'npm', ...args],
    };
  }

  return {
    file: getNpmExecutable(),
    args,
  };
}

function runNodeScript(args, options = {}) {
  return execFileSync(getNodeExecutable(), args, {
    timeout: SCAFFOLD_TIMEOUT_MS,
    ...options,
  });
}

function runNpmCommand(args, options = {}) {
  const command = getNpmCommand(args);

  return execFileSync(command.file, command.args, {
    timeout: INSTALL_TIMEOUT_MS,
    ...options,
  });
}

function writeJson(path, value) {
  writeFileSync(path, JSON.stringify(value, null, 2) + '\n', 'utf8');
}

function read(path) {
  return readFileSync(path, 'utf8');
}

function logPublicWebBuildInputs(outputDir) {
  const nextConfig = read(join(outputDir, 'web', 'next.config.ts'));
  const packageJson = read(join(outputDir, 'web', 'package.json'));

  console.log(`[smoke] public next.config.ts has reactCompiler: ${nextConfig.includes('reactCompiler')}`);
  console.log(`[smoke] public package.json has babel-plugin-react-compiler: ${packageJson.includes('babel-plugin-react-compiler')}`);
}

function runScaffold(config, name) {
  const baseDir = mkdtempSync(join(tmpdir(), `${name}-`));
  const configPath = join(baseDir, `${name}.json`);
  const outputDir = join(baseDir, 'output');
  writeJson(configPath, config);

  console.log(`\n[smoke] scaffold:start ${name}`);
  runNodeScript([cliPath, 'scaffold', configPath, outputDir], {
    cwd: repoRoot,
    stdio: 'inherit',
  });
  console.log(`[smoke] scaffold:done  ${name}`);

  return { baseDir, outputDir };
}

function assertIncludes(path, snippet) {
  assert.ok(read(path).includes(snippet), `${path} debería incluir "${snippet}"`);
}

function assertNotIncludes(path, snippet) {
  assert.ok(!read(path).includes(snippet), `${path} no debería incluir "${snippet}"`);
}

function assertExists(path) {
  assert.ok(existsSync(path), `Debe existir: ${path}`);
}

function assertNotExists(path) {
  assert.ok(!existsSync(path), `No debe existir: ${path}`);
}

function installAndBuildWeb(outputDir) {
  runNpmCommand(['install'], {
    cwd: join(outputDir, 'web'),
    stdio: 'inherit',
  });
  runNpmCommand(['run', 'build'], {
    cwd: join(outputDir, 'web'),
    stdio: 'inherit',
  });
}

function installAndBuildApp(outputDir) {
  runNpmCommand(['install'], {
    cwd: join(outputDir, 'app'),
    stdio: 'inherit',
  });
  runNpmCommand(['run', 'build'], {
    cwd: join(outputDir, 'app'),
    stdio: 'inherit',
  });
}

function validateStaticWebsite(outputDir) {
  assertExists(join(outputDir, 'web', 'src', 'app', 'page.tsx'));
  assertNotExists(join(outputDir, 'app'));
  assertNotExists(join(outputDir, 'package-lock.json'));
  assertNotExists(join(outputDir, 'web', 'package-lock.json'));
  assertIncludes(join(outputDir, 'docker-compose.yml'), 'frontend:');
  assertNotIncludes(join(outputDir, 'docker-compose.yml'), 'backend:');
  assertNotIncludes(join(outputDir, 'docker-compose.yml'), 'postgres:');
  assertNotIncludes(join(outputDir, '.env.example'), 'JWT_SECRET');
  assertNotIncludes(join(outputDir, '.env.example'), 'DATABASE_URL=');
  assertNotIncludes(join(outputDir, '.env.example'), 'POSTGRES_USER');
  assertNotIncludes(join(outputDir, 'web', 'package.json'), '@tanstack/react-query');
  assertNotIncludes(join(outputDir, '.github', 'workflows', 'deploy.yml'), '-backend:latest');
  assertNotIncludes(join(outputDir, '.github', 'workflows', 'deploy.yml'), 'docker compose');
  assertNotIncludes(join(outputDir, '.github', 'workflows', 'deploy.yml'), 'postgres');
  assertIncludes(join(outputDir, '.github', 'workflows', 'deploy.yml'), '-frontend:latest');
  assertNotIncludes(join(outputDir, 'web', 'next.config.ts'), 'reactCompiler');
  assertNotIncludes(join(outputDir, 'web', 'package.json'), 'babel-plugin-react-compiler');
}

function validatePublicWebsiteWithBackend(outputDir) {
  assertExists(join(outputDir, 'app', 'src', 'app.module.ts'));
  assertExists(join(outputDir, 'app', 'prisma', 'schema.prisma'));
  assertNotExists(join(outputDir, 'app', 'src', 'modules', 'auth'));
  assertNotExists(join(outputDir, 'app', 'src', 'modules'));
  assertNotExists(join(outputDir, 'web', 'src', 'modules'));
  assertNotExists(join(outputDir, 'web', 'src', 'app', 'login'));
  assertNotExists(join(outputDir, 'web', 'src', 'app', '(dashboard)'));
  assertIncludes(join(outputDir, 'docker-compose.yml'), 'backend:');
  assertIncludes(join(outputDir, 'docker-compose.yml'), 'postgres:');
  assertNotIncludes(join(outputDir, '.env.example'), 'JWT_SECRET');
  assertNotIncludes(join(outputDir, '.env.example'), 'JWT_REFRESH_SECRET');
  assertIncludes(join(outputDir, '.env.example'), 'DATABASE_URL=');
  assertIncludes(join(outputDir, 'app', 'prisma', 'schema.prisma'), 'model ContactMessage');
  assertIncludes(join(outputDir, 'app', 'prisma', 'schema.prisma'), 'model CatalogItem');
  assertIncludes(join(outputDir, 'app', 'prisma', 'schema.prisma'), 'model ReservationRequest');
  assertNotIncludes(join(outputDir, 'app', 'package.json'), '@nestjs/jwt');
  assertNotIncludes(join(outputDir, 'app', 'package.json'), 'passport-jwt');
  assertNotIncludes(join(outputDir, 'web', 'next.config.ts'), 'reactCompiler');
  assertNotIncludes(join(outputDir, 'web', 'package.json'), 'babel-plugin-react-compiler');
}

function validatePrivateSoftware(outputDir) {
  assertExists(join(outputDir, 'app'));
  assertExists(join(outputDir, 'web', 'src', 'app', 'login', 'page.tsx'));
  assertExists(join(outputDir, 'web', 'src', 'app', '(dashboard)', 'dashboard', 'page.tsx'));
  assertExists(join(outputDir, 'web', 'src', 'app', '(dashboard)', 'users', 'page.tsx'));
  assertExists(join(outputDir, 'web', 'src', 'app', '(dashboard)', 'roles', 'page.tsx'));
  assertExists(join(outputDir, '.github', 'workflows', 'deploy.yml'));
  assertExists(join(outputDir, 'app', 'src', 'modules', 'auth'));
  assertExists(join(outputDir, 'app', 'src', 'modules', 'users'));
  assertIncludes(join(outputDir, '.env.example'), 'JWT_SECRET');
  assertIncludes(join(outputDir, 'docker-compose.yml'), 'backend:');
  assertIncludes(join(outputDir, 'docker-compose.yml'), 'postgres:');
  assertIncludes(join(outputDir, '.github', 'workflows', 'deploy.yml'), '-backend:latest');
  assertIncludes(join(outputDir, '.github', 'workflows', 'deploy.yml'), 'docker compose -f docker-compose.server.yml');
  assertNotIncludes(join(outputDir, '.github', 'workflows', 'deploy.yml'), '--network-alias frontend');
  assertIncludes(join(outputDir, 'web', 'next.config.ts'), 'reactCompiler');
  assertIncludes(join(outputDir, 'web', 'package.json'), 'babel-plugin-react-compiler');
}

function cleanup(paths) {
  for (const path of paths) {
    try {
      rmSync(path, { recursive: true, force: true });
    } catch (error) {
      console.warn(`[smoke] cleanup:skip ${path} (${error.code ?? error.message})`);
    }
  }
}

function assertCatalogExpectations() {
  assert.equal(projectTypeRequiresBackend('public_website', ['landing', 'services', 'gallery']), false);
  assert.equal(projectTypeRequiresDatabase('public_website', ['landing', 'services', 'gallery']), false);
  assert.equal(projectTypeRequiresBackend('public_website', ['landing', 'contact', 'catalog', 'reservations']), true);
  assert.equal(projectTypeRequiresDatabase('public_website', ['landing', 'contact', 'catalog', 'reservations']), true);
  for (const moduleId of ['auth', 'users', 'roles', 'permissions']) {
    assert.ok(
      getCoreModulesForProjectType('private_software').some((module) => module.id === moduleId),
      `El catálogo debe conservar el core privado: ${moduleId}`,
    );
  }
}

const generatedDirs = [];

try {
  assertCatalogExpectations();

  const staticProject = runScaffold({
    projectName: 'smoke-static-website',
    description: 'Smoke test static website',
    projectType: 'public_website',
    site: {
      modules: [
        { name: 'landing', isCore: false },
        { name: 'services', isCore: false },
        { name: 'gallery', isCore: false },
      ],
    },
  }, 'smoke-static');
  generatedDirs.push(staticProject.baseDir);
  validateStaticWebsite(staticProject.outputDir);
  if (withInstall) {
    logPublicWebBuildInputs(staticProject.outputDir);
    installAndBuildWeb(staticProject.outputDir);
  }

  const publicBackendProject = runScaffold({
    projectName: 'smoke-public-backend',
    description: 'Smoke test public website with backend',
    projectType: 'public_website',
    site: {
      modules: [
        { name: 'landing', isCore: false },
        { name: 'contact', isCore: false },
        { name: 'catalog', isCore: false },
        { name: 'reservations', isCore: false },
      ],
    },
  }, 'smoke-public-backend');
  generatedDirs.push(publicBackendProject.baseDir);
  validatePublicWebsiteWithBackend(publicBackendProject.outputDir);
  if (withInstall) {
    logPublicWebBuildInputs(publicBackendProject.outputDir);
    installAndBuildWeb(publicBackendProject.outputDir);
    installAndBuildApp(publicBackendProject.outputDir);
  }

  const privateProject = runScaffold({
    projectName: 'smoke-private-software',
    description: 'Smoke test private software',
    projectType: 'private_software',
    software: {
      modules: [
        { name: 'auth', isCore: true },
        { name: 'users', isCore: true },
        { name: 'roles', isCore: true },
        { name: 'permissions', isCore: true },
        { name: 'organizations', isCore: false },
      ],
      permissions: [],
      prismaFragments: [],
      seedScripts: [],
    },
  }, 'smoke-private');
  generatedDirs.push(privateProject.baseDir);
  validatePrivateSoftware(privateProject.outputDir);
  if (withInstall) {
    installAndBuildWeb(privateProject.outputDir);
    installAndBuildApp(privateProject.outputDir);
  }

  console.log('\n✓ smoke:scaffold OK');
  if (!withInstall) {
    console.log('  Validación ejecutada: estructura y configuración.');
    console.log('  Para instalar y compilar: npm run smoke:scaffold -- --with-install');
  }
} finally {
  cleanup(generatedDirs);
}
