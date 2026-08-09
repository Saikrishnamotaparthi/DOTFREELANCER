import { defineConfig, type Plugin, type Connect } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Dev-only: Vite's dev server has no concept of the /api/*.ts
 * serverless functions Vercel provides in production, so
 * `npm run dev` alone would 404 on POST /api/contact. This
 * middleware loads api/contact.ts through Vite's SSR pipeline and
 * calls it directly, so the contact form works end-to-end locally
 * without needing `vercel dev`. It never runs in the production
 * build — Vercel serves api/contact.ts itself once deployed.
 */
function contactApiDevMiddleware(): Plugin {
  return {
    name: 'contact-api-dev-middleware',
    configureServer(server) {
      const handler: Connect.NextHandleFunction = async (req, res) => {
        if (req.url !== '/api/contact') return;

        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let raw = '';
        req.on('data', (chunk) => (raw += chunk));
        req.on('end', async () => {
          try {
            const mod = await server.ssrLoadModule('/api/contact.ts');
            const mockRes = {
              status(code: number) {
                res.statusCode = code;
                return mockRes;
              },
              json(payload: unknown) {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(payload));
              },
            };
            await mod.default({ method: req.method, headers: req.headers, body: raw }, mockRes);
          } catch (err) {
            console.error('[contact-api-dev-middleware]', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Dev API middleware crashed — check the terminal.' }));
          }
        });
      };

      server.middlewares.use(handler);
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), contactApiDevMiddleware()],
})
