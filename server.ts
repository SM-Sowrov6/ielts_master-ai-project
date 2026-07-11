import http from "http";
import app from "./api/index.ts";
import { createServer as createViteServer } from "vite";

async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }
}

// Only start the server if this file is run directly (not as a module)
if (process.env.NODE_ENV !== "production" || process.env.VERCEL !== "1") {
  setupVite().then(() => {
    const PORT = 3000;
    const server = http.createServer(app);

    server.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  });
}

export default app;
