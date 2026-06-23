// Tiny static file server for the Layerform marketing site.
// Used by Railway in production. Local development uses `npx serve` via .claude/launch.json.

import http from 'node:http';
import handler from 'serve-handler';

const port = parseInt(process.env.PORT, 10) || 3000;
const host = '0.0.0.0';

const server = http.createServer((req, res) =>
  handler(req, res, {
    public: '.',
    cleanUrls: true,
    trailingSlash: false,
    etag: true,
    headers: [
      {
        source: '**/*.@(html)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=300, must-revalidate' }]
      },
      {
        source: '**/*.@(svg|png|jpg|jpeg|ico|woff2)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }]
      }
    ]
  })
);

server.listen(port, host, () => {
  console.log(`Layerform site listening on http://${host}:${port}`);
});

// Graceful shutdown on Railway container stop.
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    console.log(`Received ${signal}, shutting down.`);
    server.close(() => process.exit(0));
  });
}
