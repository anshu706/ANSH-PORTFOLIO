import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

/* ═══════════════════════════════ CONFIG ═══════════════════════════════ */
const LETTERS = ["A", "N", "S", "H"];
const INTRO_MS = 5000; // 5-second intro

/* ═══════════════════════════ FILM GRAIN OVERLAY ══════════════════════ */

function FilmGrain() {
  const ref = useRef(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("3d");
    let raf;
    let last = 0;

    const resize = () => {
      c.width = (window.innerWidth * 0.5) | 0;
      c.height = (window.innerHeight * 0.5) | 0;
    };

    const tick = (t) => {
      raf = requestAnimationFrame(tick);
      if (t - last < 80) return;
      last = t;
      const w = c.width;
      const h = c.height;
      const img = ctx.createImageData(w, h);
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = (Math.random() * 50) | 0;
        d[i] = v;
        d[i + 1] = v;
        d[i + 2] = v;
        d[i + 3] = 30;
      }
      ctx.putImageData(img, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 3,
        imageRendering: "pixelated",
        opacity: 0.6,
      }}
    />
  );
}

/* ═══════════════════════ PRELOADER ("CLICK TO ENTER") ════════════════ */

function PreloaderScreen({ onEnter }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      onClick={onEnter}
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 5,
        cursor: "pointer",
      }}
    >
      {/* Floating artwork elements directly on the dark screen (no bounding box) */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="intro-hero-group"
      >
        {/* Tiny label */}
        <p className="intro-card-label">PORTFOLIO</p>

        {/* Chrome "ANSHU" text */}
        <div className="intro-glow-wrap">
          <h1
            className="intro-chrome-text"
            style={{
              fontSize: "clamp(2.4rem, 7.5vw, 4.8rem)",
              letterSpacing: "0.14em",
            }}
          >
            ANSHU
          </h1>
        </div>

        {/* Portal doorway visual */}
        <div className="intro-doorway-wrap">
          <div className="intro-doorway">
            <div className="intro-doorway-glow" />
            {/* Silhouette figure */}
            <div className="intro-figure" />
          </div>
          <div className="intro-steps">
            <span />
            <span />
            <span />
          </div>
        </div>
      </motion.div>

      {/* "Click to enter" prompt */}
      <motion.p
        animate={{ opacity: [0.35, 0.85, 0.35] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{
          marginTop: "1.6rem",
          color: "rgba(255,255,255,0.6)",
          fontSize: "0.82rem",
          letterSpacing: "0.2em",
          fontFamily: "'Inter', system-ui, sans-serif",
          fontWeight: 400,
          fontStyle: "italic",
        }}
      >
        Click to enter
      </motion.p>
    </motion.div>
  );
}

/* ═══════════════════════ REVEAL ANIMATION SCREEN ═════════════════════ */

function RevealScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
      style={{ position: "absolute", inset: 0, zIndex: 5, overflow: "hidden" }}
    >
      {/* Growing light beam from bottom center */}
      <motion.div
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: 1, scaleY: 1 }}
        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
        className="intro-beam"
      />

      {/* Radial glow behind the text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.35, 0.2] }}
        transition={{ delay: 1.2, duration: 2.5, ease: "easeInOut" }}
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "90vw",
          height: "45vh",
          background:
            "radial-gradient(ellipse, rgba(120, 160, 255, 0.14), transparent 65%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Large ANSHU letters — letter-by-letter reveal */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
          perspective: "600px",
        }}
      >
        <div className="intro-glow-wrap-large">
          <div
            style={{
              display: "flex",
              gap: "clamp(0.1rem, 1vw, 0.7rem)",
            }}
          >
            {LETTERS.map((letter, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 60, rotateX: -80 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{
                  duration: 0.85,
                  delay: 0.15 + i * 0.13,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="intro-chrome-text"
                style={{
                  fontSize: "clamp(3.5rem, 15vw, 14rem)",
                  display: "inline-block",
                  letterSpacing: "0.06em",
                }}
              >
                {letter}
              </motion.span>
            ))}
          </div>
        </div>
      </div>

      {/* Subtitle area */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.9, ease: "easeOut" }}
        style={{
          position: "absolute",
          left: "50%",
          top: "calc(50% + clamp(3.5rem, 11vw, 10rem))",
          transform: "translateX(-50%)",
          textAlign: "center",
          zIndex: 4,
        }}
      >
        <p
          style={{
            color: "rgba(255,255,255,0.7)",
            fontSize: "clamp(0.6rem, 1.3vw, 0.95rem)",
            letterSpacing: "0.5em",
            fontFamily: "'Inter', system-ui, sans-serif",
            fontWeight: 500,
          }}
        >
          UPADHAYAY
        </p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.1, duration: 0.8 }}
          style={{
            marginTop: "0.9rem",
            color: "rgba(130, 165, 255, 0.6)",
            fontSize: "clamp(0.48rem, 0.85vw, 0.7rem)",
            letterSpacing: "0.35em",
            fontFamily: "'Inter', system-ui, sans-serif",
            fontWeight: 400,
          }}
        >
          CLOUD &bull; AUTOMATION &bull; DEVOPS
        </motion.p>
      </motion.div>

      {/* Bottom progress bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: "rgba(255,255,255,0.06)",
          zIndex: 10,
        }}
      >
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: INTRO_MS / 1000, ease: "linear" }}
          style={{
            height: "100%",
            background:
              "linear-gradient(90deg, #1e3a8a, #3b82f6, #93c5fd, #ffffff)",
          }}
        />
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════ MAIN COMPONENT ══════════════════════════ */

export default function IntroScreen({ onDone }) {
  const [phase, setPhase] = useState("enter"); // enter → playing → fading → done
  const timer = useRef(null);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  const play = useCallback(() => {
    setPhase("playing");
    timer.current = setTimeout(() => setPhase("fading"), INTRO_MS);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  if (phase === "done") return null;

  return (
    <>
      <style>{INTRO_CSS}</style>
      <motion.div
        initial={{ opacity: 1, scale: 1 }}
        animate={
          phase === "fading"
            ? { opacity: 0, scale: 1.05 }
            : { opacity: 1, scale: 1 }
        }
        transition={{ duration: 0.9, ease: "easeInOut" }}
        onAnimationComplete={() => {
          if (phaseRef.current === "fading") {
            setPhase("done");
            onDone();
          }
        }}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99999,
          background: "#000",
          overflow: "hidden",
        }}
      >
        <FilmGrain />

        {/* Blue-tinted vignette around edges */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            background:
              "radial-gradient(ellipse at center, transparent 30%, rgba(5, 10, 50, 0.6) 100%)",
            pointerEvents: "none",
          }}
        />

        {phase === "enter" && <PreloaderScreen onEnter={play} />}
        {phase === "playing" && <RevealScreen />}
      </motion.div>
    </>
  );
}

/* ═══════════════════════════════ STYLES ══════════════════════════════ */

const INTRO_CSS = `
/* ── Chrome metallic text ── */
.intro-chrome-text {
  font-family: 'Cinzel', 'Georgia', serif;
  font-weight: 900;
  background: linear-gradient(
    180deg,
    #d0d0d0 0%,
    #ffffff 10%,
    #b8b8b8 25%,
    #ffffff 40%,
    #e8e8e8 50%,
    #909090 65%,
    #c8c8c8 78%,
    #ffffff 88%,
    #d8d8d8 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.05;
  user-select: none;
}

/* ── Glow wrappers ── */
.intro-glow-wrap {
  filter: drop-shadow(0 0 14px rgba(175, 200, 255, 0.3))
          drop-shadow(0 0 40px rgba(80, 120, 255, 0.12));
}

.intro-glow-wrap-large {
  filter: drop-shadow(0 0 30px rgba(195, 212, 255, 0.38))
          drop-shadow(0 0 80px rgba(100, 150, 255, 0.18))
          drop-shadow(0 3px 8px rgba(0, 0, 0, 0.9));
}

/* ── Hero group (preloader, without bounding box) ── */
.intro-hero-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.1rem;
  position: relative;
  z-index: 1;
}

.intro-card-label {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.5rem;
  letter-spacing: 0.4em;
  color: rgba(255, 255, 255, 0.3);
  text-transform: uppercase;
  margin: 0;
  position: relative;
  z-index: 1;
}

/* ── Doorway / portal visual ── */
.intro-doorway-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
}

.intro-doorway {
  width: clamp(36px, 5vw, 50px);
  height: clamp(55px, 8vw, 75px);
  border-radius: clamp(18px, 2.5vw, 25px) clamp(18px, 2.5vw, 25px) 0 0;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.92) 0%,
    rgba(190, 210, 255, 0.65) 50%,
    rgba(140, 175, 255, 0.25) 100%
  );
  position: relative;
  overflow: hidden;
  box-shadow:
    0 0 25px rgba(190, 215, 255, 0.5),
    0 0 55px rgba(140, 175, 255, 0.2),
    0 0 90px rgba(100, 140, 255, 0.08);
}

.intro-doorway-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at 50% 30%,
    rgba(255, 255, 255, 1),
    rgba(190, 215, 255, 0.4) 55%,
    transparent 100%
  );
  animation: doorwayPulse 3.5s ease-in-out infinite;
}

/* Tiny silhouette figure */
.intro-figure {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 18px;
  background: rgba(0, 0, 0, 0.55);
  border-radius: 4px 4px 0 0;
}

/* Stair steps */
.intro-steps {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  margin-top: 1px;
}

.intro-steps span {
  display: block;
  height: 3px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 1px;
}

.intro-steps span:nth-child(1) { width: clamp(46px, 6.5vw, 64px); }
.intro-steps span:nth-child(2) { width: clamp(54px, 7.5vw, 74px); }
.intro-steps span:nth-child(3) { width: clamp(62px, 8.5vw, 84px); }

/* ── Light beam (reveal screen) ── */
.intro-beam {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: clamp(55px, 9vw, 130px);
  height: 62%;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(170, 195, 255, 0.015) 20%,
    rgba(190, 210, 255, 0.04) 40%,
    rgba(210, 225, 255, 0.1) 60%,
    rgba(235, 240, 255, 0.28) 80%,
    rgba(255, 255, 255, 0.55) 93%,
    rgba(255, 255, 255, 0.9) 100%
  );
  clip-path: polygon(22% 0%, 78% 0%, 100% 100%, 0% 100%);
  transform-origin: bottom center;
  z-index: 0;
}



@keyframes doorwayPulse {
  0%, 100% { opacity: 0.75; }
  50% { opacity: 1; }
}
`;
