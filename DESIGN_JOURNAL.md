# Inside Learning Engine — Design Journal

This journal chronicles the key engineering and curriculum design decisions made during **Phase 2: The Physics Expedition Campaign**, with a deep focus on **Expedition 01: Vector Horizons**.

---

## Decision 01: Martian Horizon Parallax & Twinkling Stellar Atmosphere
- **Strategic Lens Supported**: **Pillar 1: World Building** (Environment communicates physics before words).
- **The Problem**: A flat, simple gradient on the canvas made the simulation look like a generic flash tool. It failed to convey the massive geographic scale of Mars and the thinness of its atmosphere.
- **The Solution**: 
  1. We procedurally initialized **40 faint, twinkling stars** in the upper third of the sky (since Mars' thin atmosphere makes stars visible even during twilight).
  2. We drew **two distinct volcanic mountain ranges** using smooth quadratic curves to represent the giant shield profiles of the Tharsis Montes (like Olympus Mons).
- **Alternatives Considered**: Using a background photo texture. We rejected this because a pre-rendered image stretches on dynamic resizing, whereas vector curves are perfectly crisp and load instantaneously.
- **Outcome**: The student immediately senses the cold, hostile, high-altitude Martian atmosphere, making the railgun base feel like an authentic forward colonization command deck.

---

## Decision 02: Dual-Mass Comparative Track (The Galileo Paradox)
- **Strategic Lens Supported**: **Pillar 3: Memorable Cognitive Moments** & **Pillar 5: Emotional Rhythm** (Debunking common gravity misconceptions).
- **The Problem**: Standard textbooks write: *"Mass cancels out in $a = F/m$ under gravity, so all objects fall at the same rate in vacuo."* A sixteen-year-old reads this but maintains the deep-seated intuitive misconception that heavy steel objects plunge faster than light wood planks. A passive note in a sidebar does not break this intuition.
- **The Solution**: 
  - When the student selects a mass-dependent prediction preset (e.g., believing the heavy Iron Safe crashes sooner), the canvas dynamically reconfigures.
  - Rather than just launching a single cyan block, the system spawns **two distinct projectiles**—a detailed, cross-braced **10kg Wood Crate** and a heavy metal **500kg Iron Safe** with rivets and combination lock—flying side-by-side in perfect parallel lockstep.
  - When they land, they settle resting side-by-side, visually illustrating that their trajectories are identical.
- **Alternatives Considered**: Running two separate, consecutive trials. We rejected this because consecutive trials require the student to memorize the timing. Simultaneous, parallel flight creates an immediate, visual "Aha!" moment.
- **Outcome**: A deeply dramatic, unforgettable visual debunking of a historic misconception.

---

## Decision 03: Spontaneous, Context-Aware Socratic Commentary
- **Strategic Lens Supported**: **Pillar 4: Socratic Mentorship** (React to behavior, don't wait for prompts).
- **The Problem**: Chat stations in typical AI educational apps are passive. They sit blank until the user types something, meaning most students never interact with them or only ask "what is the answer?".
- **The Solution**: We hooked into the simulation outcome engine (`evaluateExperimentOutcome`) to make Galileo, Newton, and Feynman react **spontaneously** to student actions:
  - **Crash**: Explains that the apex height was too low and prompts them to consider vertical velocity.
  - **Undershot**: Points out horizontal inertia was spent too soon and prompts adjustments.
  - **Overshot**: Highlights excess momentum and suggests dampening speed.
  - **Secured (Mass Misconception Active)**: Galileo jumps in to celebrate the Leaning Tower experiment on Tharsis Peak.
- **Alternatives Considered**: Showing standard pop-up alert dialogs. We rejected this because alert dialogs break immersion and feel like software errors rather than mentorship.
- **Outcome**: The mentor becomes an active participant in the student's investigation loop, observing their trials and gently guiding their intuition.

---

## Decision 04: Visceral Haptic Screen-Shake
- **Strategic Lens Supported**: **Pillar 2: Direct Physical Interaction** (Make physics feel tactile, physical, and heavy).
- **The Problem**: Firing a massive electromagnetic railgun to launch supplies across miles of Martian valleys can feel like clicking a mouse. It lacks physical heft.
- **The Solution**: We integrated a **dynamic screen-shake matrix** into the canvas rendering loop:
  - **At Launch**: The entire cockpit frame shudders for 15 frames at a moderate intensity.
  - **At Collision/Crash**: The screen shakes violently for 25 frames, giving a visceral feeling of impact.
  - **At Landing**: A subtle landing thump of 20 frames confirms successful cargo securing.
- **Alternatives Considered**: CSS transitions or shaking the HTML container. We chose internal canvas coordinate translation because it keeps the browser frame stable while conveying cockpit vibration, preserving high performance.
- **Outcome**: Firing the railgun feels incredibly satisfying and powerful. It transforms a simple canvas into an interactive scientific playground.

---

## Decision 05: Constant Time-Interval Vector Deconstruction
- **Strategic Lens Supported**: **Pillar 3: Memorable Cognitive Moments** (Visually revealing hidden physics invariants).
- **The Problem**: A trajectory curve looks like a simple line. It does not intuitively reveal *why* the path is a parabola, nor does it make the independence of horizontal and vertical velocities clear to a student seeing it for the first time.
- **The Solution**: 
  - When the simulation is paused or scrubbed, the canvas renders **glowing telemetry tick marks along the path at perfect 0.5-second time intervals**.
  - From each tick mark, a thin dashed projection line drops vertically down to the ground plane, complete with a horizontal coordinate label showing the exact forward distance traveled (e.g. `+20m`).
  - Because horizontal velocity ($v_x$) is constant under gravity in vacuo, these vertical projection drop lines are spaced **perfectly equidistantly** on the ground, regardless of whether the supply crate is climbing, peaking, or plunging.
- **Outcome**: The student immediately realizes that the forward motion of the projectile is uniform and constant, while its vertical height follows a deceleration/acceleration curve. The geometric origin of the parabolic flight path is instantly and wordlessly understood.

---

## Decision 06: Tactile Hypothesis Flag Dragging
- **Strategic Lens Supported**: **Pillar 2: Direct Physical Interaction** (Prediction is an active, physical claim).
- **The Problem**: In typical educational simulations, making a prediction is done by typing a number or clicking a static multiple-choice button. This feels abstract and detached from the physical space of the experiment.
- **The Solution**: 
  - We updated the prediction interface to make the orange hypothesis flag fully draggable via mouse or touch events.
  - The student can hover over, click, and slide the flag left and right across the Martian recovery basin coordinates directly on the simulation canvas.
  - Doing so updates their prediction state in real-time, complete with responsive audio cues.
- **Outcome**: Making a prediction is transformed into a tactile, spatial gesture. The student literally plants their flag in the ground where they believe the cargo will land, heightening their emotional stake in the outcome of the experiment.
