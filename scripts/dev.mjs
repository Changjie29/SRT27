import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// 同时启动 vite 前端开发服务器和后端
const client = spawn('vite', [], {
  cwd: rootDir,
  stdio: 'inherit',
  env: { ...process.env, FORCE_COLOR: 'true' },
});

const server = spawn('tsx', ['watch', 'server/dev.ts'], {
  cwd: rootDir,
  stdio: 'inherit',
  env: { ...process.env, FORCE_COLOR: 'true' },
});

const cleanup = () => {
  client.kill();
  server.kill();
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);
