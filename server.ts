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
      keywords: ["inertia", "friction", "drift", "beacon", "glide", "rover", "stop"],
      replies: [
        "Ah! You observe the Arion rover. Notice how its speed remains eternal once the engine goes dark on the frictionless ice of Europa. This is the pure geometry of inertia! The beacons are spaced with flawless mathematical precision.",
        "Consider this: if no earthly friction resides on this ice to rob the rover of its speed, why should it ever slow down? The emerald velocity vector stays constant. Does this not show that force is only needed to change motion, not to maintain it?"
      ]
    },
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
      keywords: ["inertia", "friction", "drift", "beacon", "glide", "rover", "stop"],
      replies: [
        "Indeed, Cadet! My first law states that a body continues in its state of rest or uniform motion unless compelled to change by an impressed force. On Europa's frictionless ice, net force is zero during the glide. Thus, the velocity remains perfectly constant.",
        "Observe the telemetry: when the thrusters are dark, the net force is zero. Yet, the velocity vector does not shrink, and the beacons are dropped at exact, equal spatial intervals. This proves that uniform velocity requires zero force to sustain itself!"
      ]
    },
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
      keywords: ["inertia", "friction", "drift", "beacon", "glide", "rover", "stop"],
      replies: [
        "Hey! This is super cool. Notice how the rover doesn't slow down a bit when the engine cuts out? That's because the ice has zero friction! The emerald velocity vector stays totally locked in, and those beacons are spaced perfectly evenly. Newton's First Law in action!",
        "A lot of people think things need a constant force to keep moving because on Earth, friction is always sneaking in to steal our energy. But out here, there's no friction to stop it, so it just glides forever at constant speed! Isn't that wild?"
      ]
    },
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
    const isEnergyDepths = simulationState?.codename === "energy-depths" || simulationState?.subject?.toLowerCase().includes("work") || params.springConstant !== undefined;
    const isParameterSandbox = simulationState?.coreInteraction === "PARAMETER_SANDBOX" || !!simulationState?.parameterSandboxConfig;
    let flightContext = "";

    if (isParameterSandbox) {
      const cfg = simulationState?.parameterSandboxConfig;
      const primaryKey = cfg?.primaryParamKey || Object.keys(params)[0] || "parameter";
      const curParamVal = params[primaryKey] ?? 0;
      const relType = cfg?.relationshipType || "parametric";
      const outLabel = cfg?.outputLabel || "Output";
      const outUnit = cfg?.outputUnit || "";
      const predictionPresetId = simulationState?.predictionPresetId;

      flightContext = `[ACTIVE MISSION HUDS: Dynamic Parameter Sandbox. Calibrated Input ${primaryKey} = ${curParamVal}, Relationship = ${relType}, Target Output = ${outLabel} (${outUnit})]\n` +
                      `You are instructing the student on exploring mathematical modeling and empirical curve fitting.\n` +
                      `The relationship between input and output obeys a ${relType} law.`;

      if (predictionPresetId) {
        flightContext += `\n[STUDENT PREDICTION HYPOTHESIS: The student selected prediction preset: '${predictionPresetId}'.
COGNITIVE ALERT: Compare their chosen hypothesis with the calibrated empirical curve. Guide them to observe how varying ${primaryKey} transforms ${outLabel}, and prompt them to articulate the geometric or algebraic reasons for the observed response.]`;
      }
    } else if (isEnergyDepths) {
      const dropHeight = params.dropHeight ?? 50;
      const capsuleMass = params.capsuleMass ?? 2000;
      const springConstant = params.springConstant ?? 20000;
      const predictionPresetId = simulationState?.predictionPresetId;

      flightContext = `[ACTIVE MISSION HUDS: Mariana Trench Abyssal Elevator. Capsule mass = ${capsuleMass} kg, Drop Height = ${dropHeight}m, Spring Constant k = ${springConstant} N/m.]\n` +
                      `You are instructing the student on the Work-Energy Theorem and Conservation of Mechanical Energy. Gravitational PE converts to Kinetic Energy, then to Elastic Spring PE.\n` +
                      `The safe arrest zone requires spring compression between 10.0m and 12.0m without exceeding 12.0 G of deceleration.`;

      if (predictionPresetId === "energy-linear") {
        flightContext += `\n[STUDENT PREDICTION HYPOTHESIS: The student predicted 'energy-linear' — that doubling drop height doubles spring compression in direct linear proportion.
COGNITIVE ALERT: The actual telemetry showed that doubling height did NOT double compression (it increased by approximately the square root because U_e = 1/2 k x²). Explicitly reference their hypothesis. Help them resolve this tension by asking why compressing a spring gets harder and harder the deeper you push, requiring a quadratic energy input rather than a linear one.]`;
      } else if (predictionPresetId === "energy-impact-max") {
        flightContext += `\n[STUDENT PREDICTION HYPOTHESIS: The student predicted 'energy-impact-max' — that maximum speed occurs at the very moment of initial impact with the spring (x = 0).
COGNITIVE ALERT: The telemetry showed the capsule kept accelerating downwards even after touching the spring, reaching maximum velocity at the equilibrium point where kx = mg! Explicitly reference their hypothesis. Help them understand why downward acceleration persists as long as gravity (mg) is greater than the upward spring force (kx).]`;
      } else if (predictionPresetId === "energy-conserved") {
        flightContext += `\n[STUDENT PREDICTION HYPOTHESIS: The student predicted 'energy-conserved' — that total mechanical energy is conserved and peak velocity occurs at equilibrium (kx = mg).
COGNITIVE ALERT: Praise their mastery! Explicitly reference their prediction. Guide them to articulate how the sum of gravitational, kinetic, and elastic potential remains invariant throughout the fall and arrest.]`;
      }
    } else if (isNewtonLaws) {
      const mass = params.mass ?? 200;
      const tAcc = params.forwardDuration ?? 2.0;
      const tGlide = params.glideDuration ?? 4.0;
      const tDec = params.reverseDuration ?? 2.0;
      const predictionPresetId = simulationState?.predictionPresetId;
      const hasMisconceptionMotionNeedsForce = activeMisconceptions.includes("MISCONCEPTION_MOTION_NEEDS_FORCE");

      flightContext = `[ACTIVE MISSION HUDS: Europa Inertia Lands. Rover mass = ${mass} kg, Forward Thrust = ${tAcc}s, Glide/Coast = ${tGlide}s, Brake/Reverse = ${tDec}s.]\n` +
                      `You are instructing the student on Newton's First Law (Inertia) on a friction-free ice field. Net force is zero during the coasting phase, yet the rover glides at a constant velocity.\n` +
                      `The target zone is 60m.`;

      if (predictionPresetId === "inertia-slow") {
        flightContext += `\n[STUDENT PREDICTION HYPOTHESIS: The student predicted 'inertia-slow' — that the rover will slowly decelerate and stop as soon as thrust becomes zero. They hold a core misconception that force is required to maintain motion (F proportional to v).
COGNITIVE ALERT: Note that the actual experiment showed the rover drifted at constant velocity with zero net force. Explicitly reference their chosen hypothesis. Guide them to resolve this tension by asking them to compare their prediction with the telemetry logs, the uniform ribbon of beacons, and the persistent emerald velocity vector. Make them reflect on how the frictionless Jovian ice proves force is NOT needed to keep an object moving!]`;
      } else if (predictionPresetId === "inertia-instant") {
        flightContext += `\n[STUDENT PREDICTION HYPOTHESIS: The student predicted 'inertia-instant' — that the rover will instantly drop to zero velocity as soon as the thruster is dark. They believe in instantaneous velocity change without an opposing force.
COGNITIVE ALERT: Note that the actual experiment showed the rover drifted smoothly at a constant speed when the engine went dark. Explicitly reference their chosen hypothesis. Guide them to observe that the rover continued gliding and dropping evenly-spaced beacons. Help them understand why an instantaneous stop is physically impossible (requires infinite force) and how inertia keeps the rover moving smoothly!]`;
      } else if (predictionPresetId === "inertia-constant") {
        flightContext += `\n[STUDENT PREDICTION HYPOTHESIS: The student predicted 'inertia-constant' — that the rover will drift at constant velocity because there is no friction. They have successfully predicted Newton's First Law!
COGNITIVE ALERT: Praise their insight. Explicitly reference their hypothesis. Ask them to explain how their prediction matches the telemetry logs, the uniform beacon spacing, and the persistent emerald velocity vector during the glide phase, reinforcing their understanding of inertia.]`;
      }
      
      if (hasMisconceptionMotionNeedsForce) {
        flightContext += `\n[COGNITIVE ALERT: The student is testing a critical misconception: they believe that constant speed requires a constant force (F = v, rather than F = m*a). Socratic-style direct them to notice how the engine goes completely DARK (F = 0) and net force is zero, yet the emerald velocity vector remains perfectly uniform and unchanging during the glide phase, dropping a uniform ribbon of beacons at identical intervals. Let them discover that objects do NOT need a force to stay in motion!]`;
      }
    } else {
      const velocity = params.velocity ?? 55;
      const angle = params.angle ?? 45;
      const gravity = params.gravity ?? 3.72;
      const predictionPresetId = simulationState?.predictionPresetId;

      flightContext = simulationState 
        ? `[ACTIVE MISSION HUDS: Projectile launch calibrated to velocity v0 = ${velocity} m/s, elevation angle = ${angle} degrees, under gravity g = ${gravity} m/s².]\n` +
          `You are instructing the student on kinematics, gravity, and projectile trajectories on Mars.`
        : "[SANDBOX CALIBRATION PENDING]";

      if (predictionPresetId === "mass-float") {
        flightContext += `\n[STUDENT PREDICTION HYPOTHESIS: The student predicted 'mass-float' — that the lighter wood/lithium crate is buoyant or floats further under gravity. 
COGNITIVE ALERT: The actual experiment showed the 10kg Wood Crate and 500kg Iron Safe flying in perfect, synchronized lockstep, landing together at the exact same moment. Explicitly reference their hypothesis. Ask leading Socratic questions to help them reflect on why mass is completely independent of the gravitational trajectory (and why buoyancy has no effect in this thin Martian atmosphere).]`;
      } else if (predictionPresetId === "mass-heavy") {
        flightContext += `\n[STUDENT PREDICTION HYPOTHESIS: The student predicted 'mass-heavy' — that the heavier 500kg Iron Safe falls much faster under gravity.
COGNITIVE ALERT: The actual experiment showed the 10kg Wood Crate and 500kg Iron Safe flying in perfect, synchronized lockstep, landing together at the exact same moment. Explicitly reference their hypothesis. Ask leading Socratic questions to help them reflect on why the 50x greater force of gravity on the safe is exactly balanced by its 50x greater resistance to acceleration (its inertia), causing them to fall with identical acceleration.]`;
      } else if (predictionPresetId === "mass-equal") {
        flightContext += `\n[STUDENT PREDICTION HYPOTHESIS: The student predicted 'mass-equal' — that gravity acts completely independently of mass, so both crates trace the exact same parabola.
COGNITIVE ALERT: Praise their brilliant insight! Explicitly reference their hypothesis. Encourage them to explain why gravity pulls harder on a heavier safe, yet it falls at the exact same rate as the light crate, reinforcing the equivalence of gravitational and inertial mass.]`;
      } else if (predictionPresetId === "angle-45") {
        flightContext += `\n[STUDENT PREDICTION HYPOTHESIS: The student predicted 'angle-45' — that a 45° launch angle splits velocity components equally to yield the maximum horizontal range.
COGNITIVE ALERT: Praise their mathematical accuracy! Explicitly reference their hypothesis. Ask them to reflect on why any angle higher or lower than 45° reduces the horizontal range under Mars gravity, helping them understand vector decomposition.]`;
      }

      if (isDualMassActive && !predictionPresetId) {
        flightContext += `\n[COGNITIVE ALERT: The student is testing a critical misconception: they predicted that mass affects projectile trajectories under gravity (believing a lighter wood crate drifts/floats further, or a heavy iron safe crashes sooner). The system has just executed a DUAL-MASS COMPARATIVE LAUNCH showing both a 500kg Iron Safe and a 10kg Wood Crate flying in perfect, synchronized lockstep and landing together at the exact same spot! Gently ask leading Socratic questions to help them reflect on why mass canceled out in the equations of motion (force is proportional to mass, but acceleration is force divided by mass, so mass cancels). Make them feel like a true discoverer!]`;
      }
    }

    const fullPrompt = `${flightContext}\n\nStudent asks: "${query}"`;

    // Safe fallback if Gemini API is not configured
    if (!ai) {
      // Simulate Galileo/Newton/Feynman responses
      let mockReply = "";
      if (isParameterSandbox) {
        const cfg = simulationState?.parameterSandboxConfig;
        const relType = cfg?.relationshipType || "parametric";
        const outLabel = cfg?.outputLabel || "output";
        const outUnit = cfg?.outputUnit || "";

        if (mentor === "NEWTON") {
          mockReply = `Observe how the data points trace the ${relType.toLowerCase()} locus. As the primary parameter is varied, the resultant ${outLabel} (${outUnit}) obeys an exact mathematical law. How does this proportion explain the system's equilibrium?`;
        } else if (mentor === "FEYNMAN") {
          mockReply = `Check out how that curve bends! When you slide the input, the ${outLabel} changes following a ${relType.toLowerCase()} relationship! Think of what's physically happening under the hood that makes it curve that way instead of a straight line!`;
        } else { // Galileo or default
          mockReply = `Consider the geometric symmetry displayed upon the grid. Nature speaks in the language of mathematics, and here it manifests as a ${relType.toLowerCase()} proportion. What does the rate of ascent or descent reveal to you?`;
        }
      } else if (isEnergyDepths) {
        const predictionPresetId = simulationState?.predictionPresetId;
        if (mentor === "NEWTON") {
          if (predictionPresetId === "energy-linear") {
            mockReply = "Cadet, observe the recorded spring compression. Doubling the drop height did not yield double the displacement. Why? Because the work required to compress an elastic spring is proportional to the square of its compression (W = 1/2 k x²). Does this not overturn your linear hypothesis?";
          } else if (predictionPresetId === "energy-impact-max") {
            mockReply = "Look closely at the acceleration vectors: at initial impact, the spring compression is zero, so the upward spring force is zero. Gravity continues to accelerate the capsule downwards until the spring force matches the weight (kx = mg). Why must maximum speed occur at this equilibrium point?";
          } else if (predictionPresetId === "energy-conserved") {
            mockReply = "A flawless deduction! The sum of gravitational potential, kinetic energy, and spring potential remained invariant at every point of the descent. How does this demonstrate the Work-Energy Theorem?";
          } else {
            mockReply = "By the Work-Energy Theorem, the net work performed by gravity and the spring buffer exactly equals the change in kinetic energy: W_net = ΔK. Observe how energy transfers between potential and kinetic states.";
          }
        } else if (mentor === "FEYNMAN") {
          if (predictionPresetId === "energy-linear") {
            mockReply = "Hey! Look at that squish distance! You thought twice the height would mean twice the compression, but springs don't work like that! The more you push 'em, the harder they fight back (1/2 k x²)! How does that change the way you see spring energy?";
          } else if (predictionPresetId === "energy-impact-max") {
            mockReply = "Check out the speed gauge right after it hit the spring! It was still accelerating downwards! The spring hasn't pushed back hard enough yet at the start. It only hits top speed when the upward spring push equals the downward pull of gravity!";
          } else if (predictionPresetId === "energy-conserved") {
            mockReply = "Boom! You nailed it! Energy is 100% conserved—like water pouring between three buckets (height, speed, and spring coils). And top speed was right at that equilibrium line! Pretty neat, right?";
          } else {
            mockReply = "Energy can't be created or destroyed, it just changes costumes! Watch that gravitational potential energy turn into kinetic speed, and then into spring squish!";
          }
        } else { // GALILEO or default
          if (predictionPresetId === "energy-linear") {
            mockReply = "Nature's proportions are rarely so plain. The resistance of the coiled metal increases with each measure of depth. Doubling the height does not double the yield of the spring. Reflect on the quadratic law governing elastic bodies.";
          } else if (predictionPresetId === "energy-impact-max") {
            mockReply = "Observe the velocity vector as the capsule touches the buffer. Downward motion continues to accelerate until the coils exert an opposing force equal to the carriage's weight. Why does speed reach its peak at this balance of forces?";
          } else if (predictionPresetId === "energy-conserved") {
            mockReply = "Magnificent! You foresaw the eternal constancy of mechanical power. The descent of the weight is converted wholly into the tension of the coiled spring. Formulate your reflection on this divine harmony.";
          } else {
            mockReply = "Consider the balance of nature: the height fallen represents stored impetus, which yields its force unto the spring until motion ceases.";
          }
        }
      } else if (isNewtonLaws) {
        const predictionPresetId = simulationState?.predictionPresetId;
        if (mentor === "NEWTON") {
          if (predictionPresetId === "inertia-slow") {
            mockReply = "Observe, Cadet: although the engine went dark, Arion did not decay in velocity. This directly opposes your prediction of slow deceleration. What external force, then, is acting on the ice fields of Europa to slow it?";
          } else if (predictionPresetId === "inertia-instant") {
            mockReply = "An instantaneous halt requires an infinite opposing impulse, yet we have zero net external force. Observe that the rover continued in uniform motion. Why did its momentum persist?";
          } else if (predictionPresetId === "inertia-constant") {
            mockReply = "Precisely as you predicted, Cadet. Since net force is zero, velocity persists in a state of uniform motion. How does this confirm my First Law of Motion?";
          } else {
            mockReply = "Newton's First Law is absolute: when the net force is zero, the body preserves its state of uniform motion. Observe the uniform beacon intervals.";
          }
        } else if (mentor === "FEYNMAN") {
          if (predictionPresetId === "inertia-slow") {
            mockReply = "Hey! Notice how Arion kept cruising along at the same speed even when the engine was completely off? That means friction is zero! Your prediction of slowing down doesn't hold up when there's no friction!";
          } else if (predictionPresetId === "inertia-instant") {
            mockReply = "Whoa, it didn't freeze at all when the engine cut out! It just kept sliding across the ice. Things have inertia, they want to keep on doing what they're already doing! Why do you think that is?";
          } else if (predictionPresetId === "inertia-constant") {
            mockReply = "You nailed it! Since there's absolutely zero friction, nothing can slow it down once the thruster cuts out. It just glides at a constant speed forever. Neat, right?";
          } else {
            mockReply = "Friction is zero, so every push is eternal! The rover glides without slowing down. What happens when you apply the same push backwards?";
          }
        } else { // GALILEO or default
          if (predictionPresetId === "inertia-slow") {
            mockReply = "Ah, young scholar. Earthly senses deceive us into expecting everything to slow down, but here on Europa, uniform inertia persists. Why do the beacons remain perfectly evenly spaced?";
          } else if (predictionPresetId === "inertia-instant") {
            mockReply = "Nature does not move in sudden, discrete jumps. The rover continues its celestial sweep at an unchanging rate. Consider how this reveals the deep geometry of motion.";
          } else if (predictionPresetId === "inertia-constant") {
            mockReply = "Magnificent! You foresaw that without friction, speed is eternal. Observe the perfect, geometric, equal spacing of the beacon drops!";
          } else {
            mockReply = "The icy plains of Europa show us the pure geometric laws of motion. Observe how speed does not decay when thrust becomes zero.";
          }
        }
      } else {
        const predictionPresetId = simulationState?.predictionPresetId;
        if (mentor === "NEWTON") {
          if (predictionPresetId === "mass-float") {
            mockReply = "Observe, scholar, you predicted that the lighter wood crate would float further due to some buoyant force. Yet in this thin Martian atmosphere, both crates trace the identical parabolic course. If the gravitational force on the safe is fiftyfold, why does its acceleration remain perfectly equal? Think of the mass term in my Second Law.";
          } else if (predictionPresetId === "mass-heavy") {
            mockReply = "You hypothesized that the heavy Iron Safe would fall faster under gravity. But look closely at the telemetry: the 500kg safe and 10kg crate sail as twins. The force of gravity is indeed greater on the safe, but its resistance to acceleration—its inertia—is also fiftyfold! Do they not perfectly cancel?";
          } else if (predictionPresetId === "mass-equal") {
            mockReply = "An excellent hypothesis! You predicted gravity acts independent of mass. The telemetry confirms both crates landed at identical coordinates. How does this demonstrate that gravitational force and inertial mass are in exact proportion?";
          } else if (predictionPresetId === "angle-45") {
            mockReply = "Precisely. At forty-five degrees, the horizontal and vertical components of initial velocity are split symmetrically, yielding the mathematically optimal trajectory for horizontal range. How do the telemetry coordinates support this proportion?";
          } else {
            mockReply = "Consider, scholar: What impressed force acts vertically upon the canister? Since no force resists horizontally, its lateral speed must remain eternal. What does this reveal about your angle?";
          }
        } else if (mentor === "FEYNMAN") {
          if (predictionPresetId === "mass-float") {
            mockReply = "Hey! You thought the lighter wood crate would stay airborne longer like a balloon! But look at the screen—both crates flew side-by-side like synchronized swimmers! Gravity doesn't care about buoyancy in a vacuum or thin air. Why do you think a heavier object doesn't crash down any faster?";
          } else if (predictionPresetId === "mass-heavy") {
            mockReply = "Whoa! You predicted the heavy safe would drop like a rock while the wood crate lagged behind. But they landed at the exact same millisecond! Gravity pulls the safe harder, but it also takes fifty times more effort to speed up that heavy iron. It cancels out perfectly! Crazy, right?";
          } else if (predictionPresetId === "mass-equal") {
            mockReply = "Spot on! You predicted they'd land together, and they did! Mass has zero effect on the flight path when gravity is the only thing pulling them down. How does it feel to see nature behave exactly as you calculated?";
          } else if (predictionPresetId === "angle-45") {
            mockReply = "Boom! You nailed the sweet spot! 45 degrees is the magic angle that balances getting high enough to stay in the air with moving fast enough horizontally to cover ground. How does the actual telemetry match your math?";
          } else {
            mockReply = "Hey! Think about the peak of that mountain. If you launch it too fast, it flies right past. If too slow, smash! Try finding that sweet spot where gravity curls the curve right over the peak!";
          }
        } else {
          if (predictionPresetId === "mass-float") {
            mockReply = "Ah, young observer. You suspected buoyancy would lift the lighter wood crate further. Yet, Mars has no thick atmosphere to cradle it. See how they fly together, landing in perfect lockstep? Why does the lighter weight not carry it further?";
          } else if (predictionPresetId === "mass-heavy") {
            mockReply = "You predicted the heavy Iron Safe would drop sooner. But look at the telemetry: the 10kg Wood Crate and 500kg Iron Safe glide side-by-side, landing together at the exact same instant! Why does the earth or Mars pull them with equal acceleration, regardless of weight?";
          } else if (predictionPresetId === "mass-equal") {
            mockReply = "Magnificent! You foresaw my own experiment at Pisa. Both masses, heavy and light, fall with equal swiftness. They trace the same parabola. Explain what this tells us about the nature of gravity.";
          } else if (predictionPresetId === "angle-45") {
            mockReply = "Superb! You predicted that a 45-degree angle divides the horizontal and vertical vectors of speed in perfect symmetry to achieve maximum distance. The parabolic telemetry logs speak for themselves!";
          } else {
            if (isDualMassActive) {
              mockReply = "Ah, young observer! Did you see how the great 500kg Iron Safe and the humble 10kg Wood Crate sailed side-by-side without a single hair's breadth of separation? Think deeply: why does the heavy drag of mass not outrun the light crate?";
            } else {
              mockReply = "Ah, young traveler. Recall that uniform inertia pulls the crate forward, while gravity pulls it down. Try adjusting the launch speed to balance these twin paths.";
            }
          }
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
