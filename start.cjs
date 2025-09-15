#!/usr/bin/env node

const { spawn } = require('child_process');
const port = process.env.PORT || 8080;

const child = spawn('npx', ['vite', 'preview', '--host', '0.0.0.0', '--port', port], {
  stdio: 'inherit',
  shell: true
});

child.on('error', (error) => {
  console.error('Error starting server:', error);
  process.exit(1);
});

child.on('exit', (code) => {
  process.exit(code);
});