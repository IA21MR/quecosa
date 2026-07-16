#!/usr/bin/env node

import { spawn, spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';

const WEB_DIR = fileURLToPath(new URL('../web/', import.meta.url));
const WEB_ORIGIN = 'http://127.0.0.1:3001';
const SERVER_START_TIMEOUT_MS = 120_000;
const SERVER_POLL_INTERVAL_MS = 1_000;

function getCommand(base) {
  return process.platform === 'win32' ? `${base}.cmd` : base;
}

const NEXT_COMMAND = join(WEB_DIR, 'node_modules', '.bin', getCommand('next'));
const PLAYWRIGHT_COMMAND = join(WEB_DIR, 'node_modules', '.bin', getCommand('playwright'));

function quoteArg(arg) {
  if (!/[ \t"]/u.test(arg)) return arg;
  return `"${arg.replace(/"/g, '\\"')}"`;
}

function spawnCommand(command, args, options) {
  if (process.platform !== 'win32') {
    return spawn(command, args, options);
  }

  const commandLine = [quoteArg(command), ...args.map(quoteArg)].join(' ');
  return spawn(process.env.ComSpec ?? 'cmd.exe', ['/d', '/s', '/c', commandLine], options);
}

function runCommandSync(command, args, options) {
  if (process.platform !== 'win32') {
    return spawnSync(command, args, options);
  }

  const commandLine = [quoteArg(command), ...args.map(quoteArg)].join(' ');
  return spawnSync(process.env.ComSpec ?? 'cmd.exe', ['/d', '/s', '/c', commandLine], options);
}

async function isServerReady() {
  try {
    const response = await fetch(`${WEB_ORIGIN}/login`, { redirect: 'manual' });
    return response.status < 500;
  } catch {
    return false;
  }
}

async function waitForServer() {
  const startedAt = Date.now();
  while (Date.now() - startedAt < SERVER_START_TIMEOUT_MS) {
    if (await isServerReady()) return;
    await delay(SERVER_POLL_INTERVAL_MS);
  }
  throw new Error(`Next dev server did not become ready within ${SERVER_START_TIMEOUT_MS / 1000}s.`);
}

async function stopServer(child) {
  if (!child || child.exitCode !== null) return;

  if (process.platform === 'win32') {
    spawnSync('taskkill', ['/pid', String(child.pid), '/t', '/f'], {
      stdio: 'ignore',
    });
    return;
  }

  child.kill('SIGTERM');
  await Promise.race([
    new Promise((resolve) => child.once('exit', resolve)),
    delay(5_000).then(() => child.kill('SIGKILL')),
  ]);
}

let spawnedServer = null;
let exitCode = 0;

try {
  const serverAlreadyRunning = await isServerReady();

  if (!serverAlreadyRunning) {
    spawnedServer = spawnCommand(NEXT_COMMAND, ['dev', '-H', '0.0.0.0', '-p', '3001'], {
      cwd: WEB_DIR,
      stdio: ['ignore', 'inherit', 'inherit'],
      env: {
        ...process.env,
        PLAYWRIGHT_GENERATOR_MOCKED: '1',
      },
    });

    await waitForServer();
  }

  const result = runCommandSync(PLAYWRIGHT_COMMAND, ['test', '--project=generator-mocked'], {
    cwd: WEB_DIR,
    stdio: 'inherit',
    env: {
      ...process.env,
      PLAYWRIGHT_EXTERNAL_WEB_SERVER: '1',
      PLAYWRIGHT_GENERATOR_MOCKED: '1',
    },
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    exitCode = result.status ?? 1;
  }
} finally {
  await stopServer(spawnedServer);
  process.exit(exitCode);
}
