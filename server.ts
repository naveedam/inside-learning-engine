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

// Highly robust offline backup Socratic response generators for resilient client connectivity
const offlineSocraticReplies: Record<string, Array<{ keywords: string[]; replies: string[] }>> = {
  GALILEO: [
    {
      keywords: ["mass", "weight", "heavy", "light", "iron", "wood"],
      replies: [
        "Ah! You speak of mass and weight. Observe closely: does a heavy iron ball truly outrun a lighter wooden sphere in their descent? Or do they glide in perfect unison when gravity alone governs them?",
        "Think of the dual-mass simulation: both the great safe and the small crate move as one. If gravity acts proportionally to mass, but acceleration is force divided by mass, how does mass affect the final rate of fall?"
      ]
    },
    {
      keywords: ["angle", "degree", "elevation", "theta", "slant"],
      replies: [
        "The angle of elevation governs how we divide our horizontal glide and our vertical ascent. At what specific slant do you believe the horizontal glide and the vertical climb reach a perfect, golden balance?",
        "If you tilt the elevation too high, the canister ascends grandly but travels little distance. If too flat, it strikes the ground too soon. Where lies the perfect symmetry?"
      ]
    },
    {
      keywords: ["velocity", "speed", "fast", "slow", "v0", "thrust"],
      replies: [
        "Velocity is the very breath of motion! Remember, horizontal speed remains eternal and unchanging, while vertical speed is constantly reshaped by gravity. How does increasing this starting impulse affect both paths?",
        "If we double the initial velocity, the horizontal distance does not merely double—it scales quadratically! Reflect on how speed couples with the time of flight."
      ]
    },
    {
      keywords: ["gravity", "g", "mars", "earth", "fall", "accelerat"],
      replies: [
        "Gravity is the constant pull of the world beneath us, a steady acceleration of fall. On Mars, this pull is but a fraction of Earth's. How does a weaker gravity affect the time our canister spends suspended in the air?",
        "When gravity pulls more gently, the vertical climb lasts longer, allowing the horizontal glide to carry the canister much further. Observe this beautiful balance!"
      ]
    },
    {
      keywords: ["formula", "equation", "math", "derive", "x", "y"],
      replies: [
        "The great book of nature is written in the language of mathematics, and its characters are triangles, circles, and geometric figures. Look at the trajectory equation: y depends on x, and x-squared. What geometric curve does this describe?",
        "Do not let the symbols cloud your sight. The equation merely tracks where the canister stands vertically (y) for every pace it takes horizontally (x). Can you see the parabola emerging?"
      ]
    }
  ],
  NEWTON: [
    {
      keywords: ["mass", "weight", "heavy", "light", "iron", "wood"],
      replies: [
        "Let us examine this methodically: mass represents the quantity of matter, which directly resists acceleration (inertia). Yet, gravity exerts a force directly proportional to this same mass. Do these twin proportions not perfectly cancel one another?",
        "An unbalanced force produces acceleration. For a falling body, this force is gravity (F = m*g). By my second law, acceleration is F/m. Thus, the mass term cancels entirely. Is this demonstration not absolute?"
      ]
    },
    {
      keywords: ["angle", "degree", "elevation", "theta", "slant"],
      replies: [
        "The angle of projection splits the initial impressed force into orthogonal vector components. Which component sustains the flight, and which component resists the gravitational pull?",
        "At forty-five degrees, the horizontal and vertical vectors of initial momentum are of equal proportion. Why does this equality maximize the overall range?"
      ]
    },
    {
      keywords: ["velocity", "speed", "fast", "slow", "v0", "thrust"],
      replies: [
        "By my first law, the horizontal velocity persists in a state of uniform motion unless compelled to change by an impressed force. Since there is no air resistance, this lateral speed is perfectly preserved throughout.",
        "The initial velocity determines the magnitude of the momentum vector. If you increase this quantity, you increase both the horizontal glide and the vertical duration of flight."
      ]
    },
    {
      keywords: ["gravity", "g", "mars", "earth", "fall", "accelerat"],
      replies: [
        "Gravity is a mutual force of attraction pulling the body toward the center of the planet. On Mars, the mass of the planet is lesser, and thus its gravitational pull is smaller. How does this alter the vertical acceleration?",
        "With a smaller gravitational constant, the rate of change of vertical momentum is diminished. The body remains aloft for a greater duration of time."
      ]
    },
    {
      keywords: ["formula", "equation", "math", "derive", "x", "y"],
      replies: [
        "Mathematics is the tool of absolute truth. The parabolic path is derived by eliminating the parameter of time (t) between the horizontal position equation and the vertical position equation. Observe how the quadratic x-squared term arises.",
        "The trajectory is a continuous fluxion. The vertical displacement is a function of the horizontal distance. Solve for y when x equals the distance of the volcanic peak."
      ]
    }
  ],
  FEYNMAN: [
    {
      keywords: ["mass", "weight", "heavy", "light", "iron", "wood"],
      replies: [
        "Hey! This is one of the coolest secrets of the universe! Gravity pulls harder on heavy things, but heavy things are also harder to push! They cancel out perfectly, so everything falls at the exact same rate! Isn't that neat?",
        "Imagine you glue two identical crates together. Do they fall twice as fast? Of course not! If they fell at the same speed separately, they fall at the same speed together. Mass just doesn't change the trajectory!"
      ]
    },
    {
      keywords: ["angle", "degree", "elevation", "theta", "slant"],
      replies: [
        "Think of the angle as a dial that splits your energy. Put too much energy into going up, and you don't go forward. Put too much into going forward, and you hit the ground too fast. We need a balance!",
        "If you launch at 45 degrees, you get the absolute best of both worlds—equal parts horizontal glide and vertical climb. Try it out and watch how far it goes!"
      ]
    },
    {
      keywords: ["velocity", "speed", "fast", "slow", "v0", "thrust"],
      replies: [
        "Speed is your push! Since Mars doesn't have air to slow things down in our test, that horizontal push stays with the crate forever! The only thing changing is the vertical speed, which gravity eats away at.",
        "Give it a bigger initial speed and you get more time in the air AND more distance per second. It's a win-win for getting across that mountain range!"
      ]
    },
    {
      keywords: ["gravity", "g", "mars", "earth", "fall", "accelerat"],
      replies: [
        "Gravity is just nature pulling things down! On Mars, gravity is super weak compared to Earth. It's like jumping on a trampoline—everything stays in the air much longer!",
        "When gravity is weak, the crate takes a long, lazy loop before it lands. That gives the horizontal speed plenty of time to carry it a long, long way!"
      ]
    },
    {
      keywords: ["formula", "equation", "math", "derive", "x", "y"],
      replies: [
        "Don't let the math scare you! All that equation is saying is: 'Hey, if I walk x meters forward, how high in the air (y) am I?' It's just a map of the path, showing how gravity bends a straight line into a beautiful curve!",
        "Imagine a straight line shooting up at an angle. Now subtract the falling distance caused by gravity (g*t^2 / 2). That subtraction is what curves the line downward into a parabola!"
      ]
    }
  ]
};

const defaultOfflineReplies: Record<string, string[]> = {
  GALILEO: [
    "Ah, young scholar. Observe the vectors of our projectile. Uniform inertia carries it forward, while gravity pulls it to the ground. How can we balance these twin paths?",
    "Let us ponder the system. If we adjust our elevation, we change how much speed is directed upward versus forward. What do your instruments suggest?",
    "Every motion in nature follows perfect mathematical geometry. Let us inspect the trajectory curve and see where the peak height stands."
  ],
  NEWTON: [
    "We must proceed with utmost precision. Observe the orthogonal components of the projectile's velocity. What is the horizontal speed, and what force acts vertically?",
    "The trajectory is governed by immutable laws. Let us calculate the force balance. What is the launch velocity currently calibrated to?",
    "To clear the volcanic peak, the vertical displacement at four hundred meters must exceed one hundred and forty meters. Examine your parameters."
  ],
  FEYNMAN: [
    "Hey! Don't worry if it seems tricky. Just think of the crate gliding forward while gravity pulls it down. Try turning up the speed and see what happens!",
    "Look at the shape of that path! It's a perfect curve because gravity is steadily pulling it down while it flies forward. Let's find the sweet spot!",
    "Imagine throwing a ball on the moon versus on Earth. In weak gravity, it flies super far! Mars has weak gravity too, so we've got an advantage!"
  ]
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
    const params = simulationState?.params || {};
    const activeMisconceptions = simulationState?.activeMisconceptions || [];
    const isDualMassActive = activeMisconceptions.includes("MISCONCEPTION_MASS_DEPENDENT_GRAVITY");
    const isNewtonLaws = simulationState?.codename === "inertia-bounds" || simulationState?.subject?.toLowerCase().includes("newton");
    let flightContext = "";

    if (isNewtonLaws) {
      const mass = params.mass ?? 200;
      const tAcc = params.forwardDuration ?? 2.0;
      const tGlide = params.glideDuration ?? 4.0;
      const tDec = params.reverseDuration ?? 2.0;
      const hasMisconceptionMotionNeedsForce = activeMisconceptions.includes("MISCONCEPTION_MOTION_NEEDS_FORCE");

      flightContext = `[ACTIVE MISSION HUDS: Europa Inertia Lands. Rover mass = ${mass} kg, Forward Thrust = ${tAcc}s, Glide/Coast = ${tGlide}s, Brake/Reverse = ${tDec}s.]\n` +
                      `You are instructing the student on Newton's First Law (Inertia) on a friction-free ice field. Net force is zero during the coasting phase, yet the rover glides at a constant velocity.\n` +
                      `The target zone is 60m.`;
      
      if (hasMisconceptionMotionNeedsForce) {
        flightContext += `\n[COGNITIVE ALERT: The student is testing a critical misconception: they believe that constant speed requires a constant force (F = v, rather than F = m*a). Socratic-style direct them to notice how the engine goes completely DARK (F = 0) and net force is zero, yet the emerald velocity vector remains perfectly uniform and unchanging during the glide phase, dropping a uniform ribbon of beacons at identical intervals. Let them discover that objects do NOT need a force to stay in motion!]`;
      }
    } else {
      const velocity = params.velocity ?? 55;
      const angle = params.angle ?? 45;
      const gravity = params.gravity ?? 3.72;

      flightContext = simulationState 
        ? `[ACTIVE MISSION HUDS: Projectile launch calibrated to velocity v0 = ${velocity} m/s, elevation angle = ${angle} degrees, under gravity g = ${gravity} m/s².]`
        : "[SANDBOX CALIBRATION PENDING]";

      if (isDualMassActive) {
        flightContext += `\n[COGNITIVE ALERT: The student is testing a critical misconception: they predicted that mass affects projectile trajectories under gravity (believing a lighter wood crate drifts/floats further, or a heavy iron safe crashes sooner). The system has just executed a DUAL-MASS COMPARATIVE LAUNCH showing both a 500kg Iron Safe and a 10kg Wood Crate flying in perfect, synchronized lockstep and landing together at the exact same spot! Gently ask leading Socratic questions to help them reflect on why mass canceled out in the equations of motion (force is proportional to mass, but acceleration is force divided by mass, so mass cancels). Make them feel like a true discoverer!]`;
      }
    }

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
        if (isDualMassActive) {
          mockReply = "Ah, young observer! Did you see how the great 500kg Iron Safe and the humble 10kg Wood Crate sailed side-by-side without a single hair's breadth of separation? Think deeply: why does the heavy drag of mass not outrun the light crate?";
        } else {
          mockReply = "Ah, young traveler. Recall that uniform inertia pulls the crate forward, while gravity pulls it down. Try adjusting the launch speed to balance these twin paths.";
        }
      }

      // Add a small delay for realistic pacing
      await new Promise((resolve) => setTimeout(resolve, 800));
      return res.json({ response: mockReply, text: mockReply });
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
      return res.json({ response: extractedText, text: extractedText });
    } catch (err: any) {
      console.error("Gemini API server-side failure, activating offline Socratic backup engine:", err);

      // Match keywords in user query for highly context-aware offline Socratic responses
      const lowercaseQuery = query.toLowerCase();
      let matchedReply = "";

      const mentorReplies = offlineSocraticReplies[mentor] || offlineSocraticReplies.GALILEO;
      for (const group of mentorReplies) {
        if (group.keywords.some(keyword => lowercaseQuery.includes(keyword))) {
          const randomIndex = Math.floor(Math.random() * group.replies.length);
          matchedReply = group.replies[randomIndex];
          break;
        }
      }

      if (!matchedReply) {
        const defaults = defaultOfflineReplies[mentor] || defaultOfflineReplies.GALILEO;
        const randomIndex = Math.floor(Math.random() * defaults.length);
        matchedReply = defaults[randomIndex];
      }

      // Append a highly immersive, sci-fi local telemetry backup tag to indicate offline mode gracefully
      const finalReply = `${matchedReply}\n\n*[Telemetry note: Primary cognitive uplink offline. Socratic backup core active.]*`;

      return res.json({ response: finalReply, text: finalReply, isFallback: true });
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
