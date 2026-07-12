/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const PORT = 3000;
const HOST = "0.0.0.0";

// Socratic Prompts dictionary (isolated on backend for strict security and customization)
const socraticSystemPrompts: Record<string, string> = {
  GALILEO: `You are Galileo Galilei, the legendary Renaissance astronomer.
Your tone is deeply conversational, polite, intellectual, and grounded in geometrical thought experiments.
You speak with elegant terms like "uniform inertia", "accelerated fall", and "the book of nature written in mathematics".

CRITICAL INSTRUCTIONS:
1. NEVER reveal numerical answers or equations directly (e.g. do not write "The answer is v = 54.5" or "Use the range formula").
2. Guide the user through leading questions. Encourage them to consider how a projectile splits into a horizontal uniform glide and a vertical falling acceleration.
3. Keep answers concise (under 3 sentences) to maintain immersion inside a cockpit HUD. Focus purely on physical intuition.`,

  NEWTON: `You are Sir Isaac Newton, the master architect of classical physics.
Your tone is incredibly precise, formal, slightly austere, and deeply methodical. 
You speak of "impressed forces", "unbalanced inertia", "gravitational proportions", and "absolute fluxions".

CRITICAL INSTRUCTIONS:
1. NEVER write down full mathematical solutions or directly solve the task.
2. Ask the user about the forces acting on the cargo crate. Ask: "What force acts vertically to pull it down? Does any equivalent force push it sideways?"
3. Be brief, formal, and direct (max 3 sentences) to suit the compact sidebar layout.`,

  FEYNMAN: `You are Dr. Richard Feynman, the Nobel Laureate known for simple, intuitive explanations.
Your tone is extremely enthusiastic, casual, friendly, and visual.
You say "Hey!", "Imagine this...", "Look at that!", and focus heavily on physical imagery rather than abstract formulas.

CRITICAL INSTRUCTIONS:
1. NEVER give the numerical solution.
2. Ask the user to imagine what happens at the very peak of the curve. Ask: "Is it still flying forward? Is it moving up? What is gravity doing at that exact split second?"
3. Keep it light, visual, conversational, and very short (max 3 sentences).`
};

async function startServer() {
  const app = express();
  app.use(express.json());

  // Initialize Gemini SDK with telemetry header
  const aiApiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;

  if (aiApiKey) {
    ai = new GoogleGenAI({
      apiKey: aiApiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
      }
    });
    console.log("Gemini AI Engine successfully initialized.");
  } else {
    console.warn("WARNING: GEMINI_API_KEY environment variable is not set. AI mentors will run in simulation fallback mode.");
  }

  // ============================================================================
  // BACKEND API ENDPOINTS
  // ============================================================================

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "active", engine: "Inside Learning Engine", version: "1.0.0" });
  });

  // Secure Socratic AI Mentor API proxy
  app.post("/api/mentor", async (req, res) => {
    const { query, mentorId, simulationState } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    const mentor = mentorId || "GALILEO";
    const systemPrompt = socraticSystemPrompts[mentor] || socraticSystemPrompts.GALILEO;

    // Compile dynamic cockpit context based on the user's active flight parameters
    const flightContext = simulationState 
      ? `[ACTIVE MISSION HUDS: Canister currently at Horizontal Pos = ${Math.round(simulationState.x || 0)}m, Alt = ${Math.round(simulationState.y || 0)}m, Horizontal Velocity vx = ${Math.round(simulationState.vx || 0)}m/s, Vertical Velocity vy = ${Math.round(simulationState.vy || 0)}m/s. Launch Velocity calibrated to ${simulationState.velocity}m/s at ${simulationState.angle} deg angle inside gravity of ${simulationState.gravity}m/s².]`
      : "[SANDBOX CALIBRATION PENDING]";

    const fullPrompt = `${flightContext}\n\nStudent asks: "${query}"`;

    // Safe fallback if Gemini API is not configured
    if (!ai) {
      // Simulate Galileo/Newton/Feynman responses
      let mockReply = "";
      if (mentor === "NEWTON") {
        mockReply = "Consider, scholar: What impressed force acts vertically upon the canister? Since no force resists horizontally, its lateral speed must remain eternal. What does this reveal about your angle?";
      } else if (mentor === "FEYNMAN") {
        mockReply = "Hey! Think about the peak of that mountain. If you launch it too fast, it flies right past. If too slow, smash! Try finding that sweet spot where gravity curls the curve right over the peak!";
      } else {
        mockReply = "Ah, young traveler. Recall that uniform inertia pulls the crate forward, while gravity pulls it down. Try adjusting the launch speed to balance these twin paths.";
      }

      // Add a small delay for realistic pacing
      await new Promise((resolve) => setTimeout(resolve, 800));
      return res.json({ response: mockReply });
    }

    try {
      // Call Gemini 3.5 Flash server-side securely
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: fullPrompt,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.8
        }
      });

      const extractedText = response.text || "My sensors are experiencing minor cosmic interference. Let us ponder the vectors again.";
      return res.json({ response: extractedText });
    } catch (err: any) {
      console.error("Gemini API server-side failure:", err);
      return res.status(500).json({ error: "Cosmic uplink failed", details: err.message });
    }
  });

  // ============================================================================
  // VITE DEV / PRODUCTION MIDDLEWARE HANDLERS
  // ============================================================================

  if (process.env.NODE_ENV !== "production") {
    // Development mode
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

  app.listen(PORT, HOST, () => {
    console.log(`Inside Learning Engine running at http://${HOST}:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Critical server-side boot error:", err);
});
