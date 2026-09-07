const http = require('http');
const url = require('url');

const PORT = 5000;

const requestHandler = (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  console.log(`[${new Date().toISOString()}] ${method} ${path}`);

  if (path === '/' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('✅ Backend is running!');
    return;
  }

  if (path === '/api/status' && method === 'GET') {
    const response = {
      status: 'success',
      message: 'Backend server is running',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      nodeVersion: process.version
    };
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(response, null, 2));
    return;
  }

  if (path === '/api/users' && method === 'GET') {
    const response = {
      status: 'success',
      message: 'Users endpoint (coming soon)',
      users: []
    };
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(response, null, 2));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'error', message: 'Endpoint not found', path: path }));
};

const server = http.createServer(requestHandler);

server.listen(PORT, () => {
  console.log('========================================');
  console.log('🚀 User Management Backend');
  console.log('========================================');
  console.log(`📡 Server running on: http://localhost:${PORT}`);
  console.log('📋 Test endpoints:');
  console.log('   GET  /          - Check if server is running');
  console.log('   GET  /api/status - Get server status');
  console.log('   GET  /api/users  - Get users (coming soon)');
  console.log('========================================');
  console.log(`🔧 Node version: ${process.version}`);
  console.log('========================================');
  console.log('Press Ctrl+C to stop the server');
  console.log('========================================');
});