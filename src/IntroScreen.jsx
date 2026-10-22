import React, { useEffect, useRef, useState, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════════════════════
   ANSH UPADHAYAY - 3D LIQUID INTRO SCREEN
   Inspired by Alexandre Rochet Portfolio Intro (No Music, Custom Constraints)
   ═══════════════════════════════════════════════════════════════════════════════ */

// Scattered letters matching "ANSH UPADHAYAY"
// Each letter has normalized 3D base coordinates (x: -1..1, y: -1..1, z: 0.2..1.8)
// where z is depth (lower z = closer to camera, larger, longer extrusion trail).
const LETTER_DEFINITIONS = [
  // ── Foreground Hero Sculptures ──
  { char: "S", x: 0.02, y: 0.04, z: 0.32, size: 130, trailLength: 32, trailAlpha: 0.35, blur: 1.5, weight: "700" },
  { char: "U", x: -0.32, y: 0.42, z: 0.42, size: 105, trailLength: 42, trailAlpha: 0.38, blur: 0.8, weight: "700" },
  { char: "D", x: 0.42, y: -0.28, z: 0.45, size: 110, trailLength: 38, trailAlpha: 0.32, blur: 0.8, weight: "700" },
  { char: "A", x: -0.44, y: 0.06, z: 0.50, size: 95, trailLength: 34, trailAlpha: 0.30, blur: 0.5, weight: "700" },

  // ── Midground Letters ──
  { char: "N", x: 0.26, y: -0.10, z: 0.72, size: 68, trailLength: 22, trailAlpha: 0.26, blur: 0, weight: "600" },
  { char: "H", x: 0.38, y: 0.52, z: 0.75, size: 76, trailLength: 24, trailAlpha: 0.25, blur: 0, weight: "600" },
  { char: "P", x: 0.56, y: 0.12, z: 0.78, size: 72, trailLength: 22, trailAlpha: 0.24, blur: 0, weight: "600" },
  { char: "A", x: -0.01, y: -0.56, z: 0.82, size: 66, trailLength: 20, trailAlpha: 0.22, blur: 0, weight: "600" },
  { char: "Y", x: 0.72, y: 0.38, z: 0.85, size: 64, trailLength: 18, trailAlpha: 0.22, blur: 0, weight: "600" },
  { char: "A", x: -0.06, y: 0.62, z: 0.88, size: 62, trailLength: 18, trailAlpha: 0.20, blur: 0, weight: "600" },

  // ── Deep Background Mist Letters ──
  { char: "H", x: -0.68, y: 0.32, z: 1.15, size: 50, trailLength: 14, trailAlpha: 0.16, blur: 0.5, weight: "500" },
  { char: "A", x: -0.64, y: -0.32, z: 1.25, size: 48, trailLength: 12, trailAlpha: 0.14, blur: 0.8, weight: "500" },
  { char: "Y", x: 0.68, y: -0.42, z: 1.35, size: 44, trailLength: 10, trailAlpha: 0.12, blur: 1.0, weight: "500" },
  { char: "N", x: -0.28, y: -0.44, z: 1.45, size: 42, trailLength: 10, trailAlpha: 0.12, blur: 1.2, weight: "500" },
];

/* ═════════════════════════ WEBGL LIQUID SHADER ═════════════════════════ */
const VERT_SRC = `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = (position + vec2(1.0)) * 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

// Procedural domain-warping fluid noise in monochrome with subtle blue edge glow
const FRAG_SRC = `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;

  // Simplex-style pseudo noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(vec3(i.y) + vec3(0.0, i1.y, 1.0)) + vec3(i.x) + vec3(0.0, i1.x, 1.0));
    vec3 m = max(vec3(0.5) - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), vec3(0.0));
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - vec3(1.0);
    vec3 h = abs(x) - vec3(0.5);
    vec3 ox = floor(x + vec3(0.5));
    vec3 a0 = x - ox;
    m *= vec3(1.79284291400159) - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x  = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  // Fractional Brownian Motion (fBm)
  float fbm(vec2 p) {
    float total = 0.0;
    float amp = 0.52;
    for (int i = 0; i < 5; i++) {
      total += amp * snoise(p);
      p = p * 2.08 + vec2(13.4, 1.2);
      amp *= 0.48;
    }
    return total;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    vec2 p = (gl_FragCoord.xy * 2.0 - uResolution.xy) / min(uResolution.x, uResolution.y);

    // Mouse influence with smooth falloff
    vec2 m = (uMouse * 2.0 - vec2(1.0));
    m.y = -m.y;
    float mDist = length(p - m * 1.2);
    vec2 mOffset = normalize(p - m * 1.2 + vec2(0.001)) * exp(-mDist * 2.5) * 0.18;

    float t = uTime * 0.18;

    // Domain warping: distortion feeding into distortion (silky liquid marble look)
    vec2 q = vec2(fbm(p * 1.1 + vec2(0.0, t * 0.4) + mOffset),
                  fbm(p * 1.1 + vec2(5.2, 1.3 - t * 0.3)));

    vec2 r = vec2(fbm(p * 1.4 + 2.5 * q + vec2(1.7, 9.2) + vec2(t * 0.25, -t * 0.2)),
                  fbm(p * 1.4 + 2.5 * q + vec2(8.3, 2.8) + vec2(-t * 0.2, t * 0.35)));

    float f = fbm(p * 1.2 + 3.0 * r);

    // Color grading: rich deep black marble with silvery liquid smoke highlights
    float tone = clamp((f * f * 2.8 + 0.65 * f + 0.05), 0.0, 1.0);

    vec3 col = mix(
      vec3(0.02, 0.025, 0.035), // deep obsidian black
      vec3(0.22, 0.25, 0.30),    // mid smoke grey
      clamp(tone * 1.15, 0.0, 1.0)
    );

    // Silver silk wave crests
    float edge = smoothstep(0.48, 0.72, tone);
    col += vec3(0.45, 0.48, 0.56) * edge * 0.9;

    // Subtle dark blue glow around the screen edges
    float vignette = length((uv - vec2(0.5)) * 1.35);
    vec3 edgeGlow = vec3(0.06, 0.15, 0.32) * smoothstep(0.42, 1.1, vignette) * 0.8;
    col += edgeGlow;

    // Darken vignette at the very outer borders
    col *= clamp(1.4 - vignette * 0.85, 0.0, 1.0);

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function IntroScreen({ onDone }) {
  const containerRef = useRef(null);
  const glCanvasRef = useRef(null);
  const textCanvasRef = useRef(null);

  const [isExiting, setIsExiting] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Mouse / Parallax state
  const mouseRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });
  const cameraRef = useRef({ x: 0, y: 0, z: 0, targetZ: 0 });
  const timeRef = useRef(0);
  const animFrameRef = useRef(null);

  // Trigger transition out
  const handleEnter = useCallback(() => {
    if (isExiting) return;
    setIsExiting(true);
    cameraRef.current.targetZ = -1.2; // camera accelerates forward through letters
    setTimeout(() => {
      onDone();
    }, 1100);
  }, [isExiting, onDone]);

  // Handle keyboard (Enter or Space) and wheel scroll
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        handleEnter();
      }
    };

    let wheelAccum = 0;
    let wheelTimer = null;
    const handleWheel = (e) => {
      wheelAccum += Math.abs(e.deltaY);
      if (wheelTimer) clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => { wheelAccum = 0; }, 300);
      if (wheelAccum > 80) {
        handleEnter();
      }
    };

    window.addEventListener("keydown", handleKey);
    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => {
      if (wheelTimer) clearTimeout(wheelTimer);
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [handleEnter]);

  // Mouse movement
  useEffect(() => {
    setMounted(true);
    const onMouseMove = (e) => {
      const nx = e.clientX / window.innerWidth;
      const ny = e.clientY / window.innerHeight;
      mouseRef.current.targetX = nx;
      mouseRef.current.targetY = ny;
    };

    const onTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        const nx = e.touches[0].clientX / window.innerWidth;
        const ny = e.touches[0].clientY / window.innerHeight;
        mouseRef.current.targetX = nx;
        mouseRef.current.targetY = ny;
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  // WebGL Background Shader setup
  useEffect(() => {
    const canvas = glCanvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return;

    // Create shader helper
    const createShader = (type, source) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, source);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    };

    const vert = createShader(gl.VERTEX_SHADER, VERT_SRC);
    const frag = createShader(gl.FRAGMENT_SHADER, FRAG_SRC);
    if (!vert || !frag) return;

    const program = gl.createProgram();
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Quad geometry
    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posAttr = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

    const uTimeLoc = gl.getUniformLocation(program, "uTime");
    const uResLoc = gl.getUniformLocation(program, "uResolution");
    const uMouseLoc = gl.getUniformLocation(program, "uMouse");

    const resizeGL = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.floor(window.innerWidth * dpr);
      const h = Math.floor(window.innerHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };
    resizeGL();
    window.addEventListener("resize", resizeGL);

    let webglRunning = true;
    const renderGL = () => {
      if (!webglRunning) return;
      gl.useProgram(program);
      gl.uniform1f(uTimeLoc, timeRef.current);
      gl.uniform2f(uResLoc, canvas.width, canvas.height);
      gl.uniform2f(uMouseLoc, mouseRef.current.x, mouseRef.current.y);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    // Store render function for main animation loop
    canvas._render = renderGL;

    return () => {
      webglRunning = false;
      window.removeEventListener("resize", resizeGL);
    };
  }, []);

  // 3D Canvas Letter Renderer
  useEffect(() => {
    const textCanvas = textCanvasRef.current;
    if (!textCanvas) return;
    const ctx = textCanvas.getContext("2d");
    if (!ctx) return;

    let running = true;

    const resizeText = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      textCanvas.width = w * dpr;
      textCanvas.height = h * dpr;
      textCanvas.style.width = `${w}px`;
      textCanvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resizeText();
    window.addEventListener("resize", resizeText);

    // Animation loop
    const animate = () => {
      if (!running) return;
      animFrameRef.current = requestAnimationFrame(animate);

      timeRef.current += 0.016;
      const t = timeRef.current;

      // Smooth mouse interpolation (lerp)
      const m = mouseRef.current;
      m.x += (m.targetX - m.x) * 0.06;
      m.y += (m.targetY - m.y) * 0.06;

      // Camera parallax
      const cam = cameraRef.current;
      const targetCamX = (m.x - 0.5) * 0.35;
      const targetCamY = (m.y - 0.5) * 0.28;
      cam.x += (targetCamX - cam.x) * 0.05;
      cam.y += (targetCamY - cam.y) * 0.05;
      cam.z += (cam.targetZ - cam.z) * 0.06;

      // Render WebGL background
      if (glCanvasRef.current && glCanvasRef.current._render) {
        glCanvasRef.current._render();
      }

      // Render 3D Letters
      const width = window.innerWidth;
      const height = window.innerHeight;
      ctx.clearRect(0, 0, width, height);

      // Vanishing point / perspective center
      const centerX = width * 0.5;
      const centerY = height * 0.5;
      const fov = Math.min(width, height) * 0.95;

      // Sort letters by depth (back to front) for accurate 3D painter's algorithm
      const letterInstances = LETTER_DEFINITIONS.map((def, idx) => {
        // Subtle organic bobbing/floating
        const floatOffsetX = Math.sin(t * 0.7 + idx * 1.3) * 0.018;
        const floatOffsetY = Math.cos(t * 0.6 + idx * 1.1) * 0.022;
        const floatRot = Math.sin(t * 0.4 + idx * 0.9) * 0.04;

        const worldX = def.x + floatOffsetX;
        const worldY = def.y + floatOffsetY;
        const worldZ = def.z + cam.z;

        return {
          ...def,
          worldX,
          worldY,
          worldZ,
          rotation: floatRot,
        };
      });

      // Filter out letters behind the camera and sort deep -> near
      const visibleLetters = letterInstances
        .filter((item) => item.worldZ > 0.05)
        .sort((a, b) => b.worldZ - a.worldZ);

      // Render each letter with volumetric extruded perspective shadows
      visibleLetters.forEach((item) => {
        const perspective = fov / (item.worldZ * fov * 0.0016 + 1.0);
        const screenX = centerX + (item.worldX - cam.x) * perspective;
        const screenY = centerY + (item.worldY - cam.y) * perspective;
        const scale = perspective * 0.0012;
        const fontSize = Math.max(12, item.size * scale);

        // Vector from center to letter (used to cast extruded perspective shadow towards center/light source)
        const dx = screenX - centerX;
        const dy = screenY - centerY;
        const distFromCenter = Math.hypot(dx, dy) / Math.max(width, height);

        // Number of trail layers for extrusion
        const steps = Math.min(35, Math.max(10, Math.floor(item.trailLength * scale * 1.2)));
        const trailDist = (item.trailLength * scale * 2.2) * (1.0 + distFromCenter * 0.8);

        ctx.save();
        ctx.font = `${item.weight || "600"} ${fontSize}px 'Syne', 'Inter', -apple-system, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Draw 3D Volumetric Extrusion (from back to front)
        // Shadows project diagonally outward from perspective center, matching Alexandre Rochet
        for (let s = steps; s >= 1; s--) {
          const progress = s / steps; // 1 at far tip of shadow, ~0 near the front
          const offX = (dx / (Math.hypot(dx, dy) || 1)) * (trailDist * progress);
          const offY = (dy / (Math.hypot(dy, dy) || 1)) * (trailDist * progress);

          // Alpha falls off towards the end of the trail
          const alpha = (1.0 - progress) * (item.trailAlpha || 0.28) * (1.1 - item.worldZ * 0.4);
          ctx.fillStyle = `rgba(210, 220, 235, ${Math.max(0, Math.min(0.65, alpha))})`;

          ctx.save();
          ctx.translate(screenX + offX, screenY + offY);
          ctx.rotate(item.rotation * (1 - progress * 0.4));
          ctx.fillText(item.char, 0, 0);
          ctx.restore();
        }

        // Draw Front Face of Letter
        ctx.save();
        ctx.translate(screenX, screenY);
        ctx.rotate(item.rotation);

        // Soft glow for foreground letters
        if (item.blur && item.blur > 0) {
          ctx.shadowColor = "rgba(255, 255, 255, 0.45)";
          ctx.shadowBlur = item.blur * 10 * scale;
        }

        // Metallic white-silver gradient fill on front face
        const grad = ctx.createLinearGradient(0, -fontSize * 0.5, 0, fontSize * 0.5);
        grad.addColorStop(0, "rgba(255, 255, 255, 0.98)");
        grad.addColorStop(0.4, "rgba(235, 240, 248, 0.92)");
        grad.addColorStop(1, "rgba(180, 195, 215, 0.75)");

        ctx.fillStyle = grad;
        ctx.fillText(item.char, 0, 0);

        // Subtle crisp outline
        ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
        ctx.lineWidth = Math.max(0.6, 1.2 * scale);
        ctx.strokeText(item.char, 0, 0);

        ctx.restore();
        ctx.restore();
      });
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      running = false;
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resizeText);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onClick={handleEnter}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999999,
        background: "#030407",
        cursor: "pointer",
        overflow: "hidden",
        userSelect: "none",
        transition: "opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
        opacity: isExiting ? 0 : 1,
        transform: isExiting ? "scale(1.08)" : "scale(1)",
        pointerEvents: isExiting ? "none" : "auto",
      }}
    >
      {/* Google Fonts Preconnect & Syne / Inter Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Inter:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      {/* WebGL Fluid Marble Shader Canvas */}
      <canvas
        ref={glCanvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
          zIndex: 1,
        }}
      />

      {/* 3D Letter Canvas */}
      <canvas
        ref={textCanvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
          zIndex: 2,
        }}
      />

      {/* Subtle Cinematic Film Grain Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 3,
          pointerEvents: "none",
          opacity: 0.18,
          backgroundImage: `radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1px)`,
          backgroundSize: "3px 3px",
        }}
      />

      {/* Blue Vignette Border Frame (like Alexandre Rochet's site) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 4,
          pointerEvents: "none",
          boxShadow: "inset 0 0 100px rgba(5, 20, 60, 0.55), inset 0 0 30px rgba(2, 6, 16, 0.8)",
        }}
      />

      {/* Top Left Minimalist Label */}
      <div
        style={{
          position: "absolute",
          top: "2.4rem",
          left: "2.8rem",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: "0.8rem",
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            backgroundColor: "rgba(100, 180, 255, 0.85)",
            boxShadow: "0 0 10px rgba(100, 180, 255, 0.8)",
            display: "inline-block",
          }}
        />
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.68rem",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "rgba(255, 255, 255, 0.55)",
            fontWeight: 500,
          }}
        >
          ANSHU &bull; PORTFOLIO
        </span>
      </div>

      {/* Bottom Center CTA: "EXPLORE PORTFOLIO" */}
      <div
        style={{
          position: "absolute",
          bottom: "3.2rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.75rem",
          cursor: "pointer",
        }}
        onClick={(e) => {
          e.stopPropagation();
          handleEnter();
        }}
      >
        <button
          className="intro-cta-button"
          style={{
            background: "none",
            border: "none",
            outline: "none",
            cursor: "pointer",
            padding: "0.6rem 1.6rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.6rem",
            transition: "all 0.3s ease",
          }}
        >
          <span
            style={{
              fontFamily: "'Inter', -apple-system, sans-serif",
              fontSize: "clamp(0.72rem, 1vw, 0.85rem)",
              letterSpacing: "0.36em",
              textTransform: "uppercase",
              color: "rgba(255, 255, 255, 0.9)",
              fontWeight: 500,
              textShadow: "0 0 12px rgba(255, 255, 255, 0.4)",
            }}
          >
            EXPLORE PORTFOLIO
          </span>

          {/* Minimalist animated arrow / indicator */}
          <span
            style={{
              width: "36px",
              height: "1px",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)",
              display: "block",
              animation: "introPulse 2.4s ease-in-out infinite",
            }}
          />
        </button>

        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.58rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(255, 255, 255, 0.35)",
            fontWeight: 400,
          }}
        >
          Click anywhere or scroll to enter
        </span>
      </div>

      {/* Inline Keyframes & Hover styling */}
      <style>{`
        @keyframes introPulse {
          0%, 100% { transform: scaleX(0.7); opacity: 0.4; }
          50% { transform: scaleX(1.3); opacity: 0.95; }
        }
        .intro-cta-button:hover span:first-child {
          color: #ffffff !important;
          letter-spacing: 0.42em !important;
          text-shadow: 0 0 20px rgba(180, 220, 255, 0.8) !important;
        }
      `}</style>
    </div>
  );
}
