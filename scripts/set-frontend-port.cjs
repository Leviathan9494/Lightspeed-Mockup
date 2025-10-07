#!/usr/bin/env node
// Force PORT=3000 for Next.js regardless of shell/platform.
// If 3000 is busy, attempt to detect and advise.

const { spawnSync } = require('node:child_process');
const net = require('node:net');

const TARGET_PORT = 3000;

function checkPort(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close(() => resolve(true));
    });
    server.listen(port, '127.0.0.1');
  });
}

(async () => {
  const free = await checkPort(TARGET_PORT);
  if (!free) {
    console.warn(`Port ${TARGET_PORT} appears in use. Next.js may auto-shift. Consider freeing it or choosing another port.`);
    // We still set PORT to prefer it; Next will move if truly unavailable.
  }
  process.env.PORT = String(TARGET_PORT);
  // Export for subsequent script in same process tree (concurrently launches separate shells, so we just print an instruction).
  console.log(`Ensuring frontend attempts to start on PORT=${TARGET_PORT}`);
})();
