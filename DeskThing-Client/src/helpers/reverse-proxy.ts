import LogStore from "../stores/logStore";
import http, { IncomingMessage, ServerResponse } from 'http';
import httpProxy from 'http-proxy';

const proxy = httpProxy.createProxyServer({});
const LISTENING_PORT = 8891; // Port to listen on the client device
const TARGET_HOST = 'localhost'; // The server's IP or hostname
const TARGET_PORT = 8891; // The server's port number

// Create an HTTP server to listen for incoming requests
const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
  LogStore.sendMessage('Proxy', `Proxying request: ${req.url} to ${TARGET_HOST}:${TARGET_PORT}`);

  // Proxy the request to the target server
  proxy.web(req, res, { target: `http://${TARGET_HOST}:${TARGET_PORT}` }, (error) => {
    if (error) {
      LogStore.sendError('Proxy', `Proxy error: ${error.message}`);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Proxy error: ' + error.message);
    }
  });
});

server.listen(LISTENING_PORT, () => {
  LogStore.sendMessage('Proxy', `Reverse proxy server is running on http://localhost:${LISTENING_PORT}`);
});

// Handle proxy errors
proxy.on('error', (err: Error, _req: IncomingMessage, res: ServerResponse) => {
  LogStore.sendError('Proxy', `Proxy error: ${err.message}`);
  res.writeHead(500, { 'Content-Type': 'text/plain' });
  res.end('Proxy error: ' + err.message);
});
