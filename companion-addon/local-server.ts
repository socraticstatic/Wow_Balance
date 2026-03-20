// companion-addon/local-server.ts
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { readFileSync, existsSync } from 'fs';

const PORT = 3847;
const CORS_ORIGIN = '*';

let dataPath = '';

function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', CORS_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === '/live-session.json' && req.method === 'GET') {
    if (!existsSync(dataPath)) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'No data yet' }));
      return;
    }
    try {
      const data = readFileSync(dataPath, 'utf8');
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      });
      res.end(data);
    } catch {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Read failed' }));
    }
    return;
  }

  if (req.url === '/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', dataPath }));
    return;
  }

  res.writeHead(404);
  res.end();
}

export function startLocalServer(jsonPath: string): void {
  dataPath = jsonPath;
  const server = createServer(handler);
  server.listen(PORT, '127.0.0.1', () => {
    console.log(`[local-server] Serving live-session.json on http://127.0.0.1:${PORT}`);
  });
  server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`[local-server] Port ${PORT} in use - another watcher is running`);
    } else {
      console.error('[local-server]', err.message);
    }
  });
}
