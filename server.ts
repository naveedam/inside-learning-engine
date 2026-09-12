/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import app from "./api/index";

// Load environment variables
dotenv.config();

const PORT = 3000;
const HOST = "0.0.0.0";

async function startServer() {
  // ============================================================================
  // VITE DEV / PRODUCTION MIDDLEWARE HANDLERS
  // ============================================================================

  if (process.env.NODE_ENV !== "production") {
    // Development mode with Vite middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware integrated.");
  } else {
    // Production mode static bundling
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static production assets from dist/.");
  }

  // Bind and listen on local dev / container ingress port
  app.listen(PORT, HOST, () => {
    console.log(`Inside Learning Engine running at http://${HOST}:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Critical server-side boot error:", err);
});
