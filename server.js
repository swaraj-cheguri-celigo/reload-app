const WebSocket = require('ws');

const readline = require('readline');
const wss = new WebSocket.Server({ port: 8080 });

console.log('WebSocket server running on ws://localhost:8080');

// Simulate new build notification every 60 seconds
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', () => {
  console.log('Sending new build notification...');
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send('NEW_BUILD_AVAILABLE');
    }
  });
});