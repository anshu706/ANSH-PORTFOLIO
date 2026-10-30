import React, { useEffect, useRef, useState, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════════════════════
   ANSH UPADHAYAY — 3D CINEMATIC INTRO SCREEN
   Letters: A · N · S · H  scattered in 3-D space (Alexandre Rochet style)
   ═══════════════════════════════════════════════════════════════════════════════ */

/*
  Each letter definition controls its 3-D placement and visual weight.
  ─ x / y  : normalised world-space position  (-1 … 1)
  ─ z      : depth from camera  (lower = closer/larger/brighter)
  ─ size   : base font-size in px before perspective scaling
  ─ trailLength / trailAlpha : volumetric extrusion shadow
  ─ blur   : CSS-shadow blur multiplier for foreground glow
  ─ rotX   : static tilt (radians) on the letter for 3-D feel
*/
const LETTERS = [
  // ── Hero centre – the dominant "A" like the big X in the reference ──
  { char: "A", x:  0.00, y:  0.00, z: 0.28, size: 160, trailLength: 40, trailAlpha: 0.40, blur: 2.0, weight: "800", rotX:  0.00 },

  // ── Foreground satellites ──
  { char: "N", x: -0.36, y:  0.38, z: 0.45, size: 110, trailLength: 30, trailAlpha: 0.32, blur: 0.8, weight: "700", rotX:  0.12 },
  { char: "S", x:  0.42, y: -0.30, z: 0.48, size: 118, trailLength: 34, trailAlpha: 0.35, blur: 1.0, weight: "700", rotX: -0.10 },

  // ── Mid-ground ──
  { char: "H", x:  0.38,  y:  0.50, z: 0.70, size:  80, trailLength: 22, trailAlpha: 0.26, blur: 0.0, weight: "600", rotX:  0.08 },

  // ── Slightly distant echoes (same letters, different positions) ──
  { char: "A", x: -0.60, y: -0.28, z: 0.82, size:  65, trailLength: 18, trailAlpha: 0.20, blur: 0.5, weight: "600", rotX: -0.15 },
  { char: "N", x:  0.60,  y:  0.30, z: 0.90, size:  58, trailLength: 14, trailAlpha: 0.18, blur: 0.0, weight: "600", rotX:  0.20 },
  { char: "S", x: -0.10,  y: -0.55, z: 0.95, size:  55, trailLength: 14, trailAlpha: 0.18, blur: 0.0, weight: "600", rotX: -0.05 },

  // ── Deep-background mist ──
  { char: "H", x: -0.68,  y:  0.42, z: 1.20, size:  44, trailLength: 10, trailAlpha: 0.14, blur: 0.8, weight: "500", rotX:  0.25 },
  { char: "A", x:  0.70,  y: -0.44, z: 1.30, size:  40, trailLength:  8, trailAlpha: 0.12, blur: 1.0, weight: "500", rotX: -0.20 },
  { char: "N", x: -0.25,  y:  0.65, z: 1.40, size:  38, trailLength:  8, trailAlpha: 0.11, blur: 1.2, weight: "500", rotX:  0.18 },
  { char: "S", x:  0.18,  y: -0.70, z: 1.55, size:  34, trailLength:  6, trailAlpha: 0.09, blur: 1.5, weight: "500", rotX:  0.10 },
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

// Procedural domain-warping fluid noise — deep obsidian marble with silver silk highlights
const FRAG_SRC = `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;

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
    m = m * m; m = m * m;
    vec3 x  = 2.0 * fract(p * C.www) - vec3(1.0);
    vec3 h  = abs(x) - vec3(0.5);
    vec3 ox = floor(x + vec3(0.5));
    vec3 a0 = x - ox;
    m *= vec3(1.79284291400159) - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float fbm(vec2 p) {
    float total = 0.0, amp = 0.52;
    for (int i = 0; i < 5; i++) {
      total += amp * snoise(p);
      p = p * 2.08 + vec2(13.4, 1.2);
      amp *= 0.48;
    }
    return total;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    vec2 p  = (gl_FragCoord.xy * 2.0 - uResolution.xy) / min(uResolution.x, uResolution.y);

    vec2 m     = (uMouse * 2.0 - vec2(1.0)); m.y = -m.y;
    float mDist = length(p - m * 1.2);
    vec2 mOff  = normalize(p - m * 1.2 + vec2(0.001)) * exp(-mDist * 2.5) * 0.18;

    float t = uTime * 0.18;
    vec2 q  = vec2(fbm(p * 1.1 + vec2(0.0, t * 0.4) + mOff), fbm(p * 1.1 + vec2(5.2, 1.3 - t * 0.3)));
    vec2 r  = vec2(fbm(p * 1.4 + 2.5 * q + vec2(1.7, 9.2) + vec2( t * 0.25, -t * 0.2)),
                   fbm(p * 1.4 + 2.5 * q + vec2(8.3, 2.8) + vec2(-t * 0.2,   t * 0.35)));
    float f = fbm(p * 1.2 + 3.0 * r);

    float tone = clamp((f * f * 2.8 + 0.65 * f + 0.05), 0.0, 1.0);
    vec3 col   = mix(vec3(0.02, 0.025, 0.035), vec3(0.22, 0.25, 0.30), clamp(tone * 1.15, 0.0, 1.0));

    float edge = smoothstep(0.48, 0.72, tone);
    col += vec3(0.45, 0.48, 0.56) * edge * 0.9;

    float vignette = length((uv - vec2(0.5)) * 1.35);
    col += vec3(0.06, 0.15, 0.32) * smoothstep(0.42, 1.1, vignette) * 0.8;
    col *= clamp(1.4 - vignette * 0.85, 0.0, 1.0);

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function IntroScreen({ onDone }) {
  const glCanvasRef  = useRef(null);
  const textCanvasRef = useRef(null);

  const [isExiting, setIsExiting] = useState(false);
  const mouseRef  = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });
  const cameraRef = useRef({ x: 0, y: 0, z: 0, targetZ: 0 });
  const timeRef   = useRef(0);
  const rafRef    = useRef(null);

  /* ── Transition out ── */
  const handleEnter = useCallback(() => {
    if (isExiting) return;
    setIsExiting(true);
    cameraRef.current.targetZ = -1.4;
    setTimeout(() => onDone(), 1100);
  }, [isExiting, onDone]);

  /* ── Keyboard / scroll triggers ── */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") handleEnter();
    };
    let acc = 0, t = null;
    const onWheel = (e) => {
      acc += Math.abs(e.deltaY);
      clearTimeout(t); t = setTimeout(() => { acc = 0; }, 300);
      if (acc > 80) handleEnter();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => { clearTimeout(t); window.removeEventListener("keydown", onKey); window.removeEventListener("wheel", onWheel); };
  }, [handleEnter]);

  /* ── Mouse / touch tracking ── */
  useEffect(() => {
    const onMove = (e) => {
      mouseRef.current.targetX = e.clientX / window.innerWidth;
      mouseRef.current.targetY = e.clientY / window.innerHeight;
    };
    const onTouch = (e) => {
      if (e.touches?.[0]) {
        mouseRef.current.targetX = e.touches[0].clientX / window.innerWidth;
        mouseRef.current.targetY = e.touches[0].clientY / window.innerHeight;
      }
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onTouch, { passive: true });
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("touchmove", onTouch); };
  }, []);

  /* ── WebGL Background ── */
  useEffect(() => {
    const canvas = glCanvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return;

    const mkShader = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.error(gl.getShaderInfoLog(s)); return null; }
      return s;
    };
    const vert = mkShader(gl.VERTEX_SHADER, VERT_SRC);
    const frag = mkShader(gl.FRAGMENT_SHADER, FRAG_SRC);
    if (!vert || !frag) return;

    const prog = gl.createProgram();
    gl.attachShader(prog, vert); gl.attachShader(prog, frag); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { console.error(gl.getProgramInfoLog(prog)); return; }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
    const posAttr = gl.getAttribLocation(prog, "position");
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

    const uTime  = gl.getUniformLocation(prog, "uTime");
    const uRes   = gl.getUniformLocation(prog, "uResolution");
    const uMouse = gl.getUniformLocation(prog, "uMouse");

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width  = Math.floor(window.innerWidth  * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    canvas._render = () => {
      gl.useProgram(prog);
      gl.uniform1f(uTime,  timeRef.current);
      gl.uniform2f(uRes,   canvas.width, canvas.height);
      gl.uniform2f(uMouse, mouseRef.current.x, mouseRef.current.y);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };
    return () => { window.removeEventListener("resize", resize); };
  }, []);

  /* ── 3-D Letter Canvas ── */
  useEffect(() => {
    const tc  = textCanvasRef.current;
    if (!tc) return;
    const ctx = tc.getContext("2d");
    let running = true;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      tc.width  = window.innerWidth  * dpr;
      tc.height = window.innerHeight * dpr;
      tc.style.width  = `${window.innerWidth}px`;
      tc.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      if (!running) return;
      rafRef.current = requestAnimationFrame(animate);
      timeRef.current += 0.016;
      const t = timeRef.current;

      // Smooth mouse lerp
      const m = mouseRef.current;
      m.x += (m.targetX - m.x) * 0.06;
      m.y += (m.targetY - m.y) * 0.06;

      // Camera parallax + zoom on exit
      const cam = cameraRef.current;
      cam.x += ((m.x - 0.5) * 0.35 - cam.x) * 0.05;
      cam.y += ((m.y - 0.5) * 0.28 - cam.y) * 0.05;
      cam.z += (cam.targetZ - cam.z) * 0.06;

      // Render WebGL background
      glCanvasRef.current?._render?.();

      // ── 3-D Letter render ──
      const W = window.innerWidth;
      const H = window.innerHeight;
      ctx.clearRect(0, 0, W, H);

      const cx  = W * 0.5;
      const cy  = H * 0.5;
      const fov = Math.min(W, H) * 0.95;

      // Build + sort instances back-to-front (painter's algorithm)
      const instances = LETTERS
        .map((def, i) => {
          const floatX   = Math.sin(t * 0.65 + i * 1.37) * 0.020;
          const floatY   = Math.cos(t * 0.55 + i * 1.13) * 0.025;
          const floatRot = Math.sin(t * 0.38 + i * 0.91) * 0.045;
          return {
            ...def,
            wx: def.x + floatX,
            wy: def.y + floatY,
            wz: def.z + cam.z,
            rot: (def.rotX || 0) + floatRot,
          };
        })
        .filter(item => item.wz > 0.05)
        .sort((a, b) => b.wz - a.wz);

      instances.forEach(item => {
        const persp   = fov / (item.wz * fov * 0.0016 + 1.0);
        const sx      = cx + (item.wx - cam.x) * persp;
        const sy      = cy + (item.wy - cam.y) * persp;
        const scale   = persp * 0.0012;
        const fSize   = Math.max(10, item.size * scale);

        const dx = sx - cx;
        const dy = sy - cy;
        const distNorm = Math.hypot(dx, dy) / Math.max(W, H);

        const steps     = Math.min(38, Math.max(8, Math.floor(item.trailLength * scale * 1.3)));
        const trailDist = (item.trailLength * scale * 2.4) * (1.0 + distNorm * 0.9);
        const dLen      = Math.hypot(dx, dy) || 1;

        ctx.save();
        ctx.font = `${item.weight || "600"} ${fSize}px 'Syne', 'Inter', -apple-system, sans-serif`;
        ctx.textAlign    = "center";
        ctx.textBaseline = "middle";

        // ── Volumetric extrusion trail (back → front) ──
        for (let s = steps; s >= 1; s--) {
          const prog  = s / steps;
          const offX  = (dx / dLen) * (trailDist * prog);
          const offY  = (dy / dLen) * (trailDist * prog);
          const alpha = (1.0 - prog) * (item.trailAlpha || 0.28) * (1.1 - item.wz * 0.4);
          ctx.fillStyle = `rgba(210, 220, 235, ${Math.max(0, Math.min(0.65, alpha))})`;
          ctx.save();
          ctx.translate(sx + offX, sy + offY);
          ctx.rotate(item.rot * (1 - prog * 0.4));
          ctx.fillText(item.char, 0, 0);
          ctx.restore();
        }

        // ── Front face ──
        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate(item.rot);

        if (item.blur > 0) {
          ctx.shadowColor = "rgba(255, 255, 255, 0.48)";
          ctx.shadowBlur  = item.blur * 12 * scale;
        }

        const grad = ctx.createLinearGradient(0, -fSize * 0.5, 0, fSize * 0.5);
        grad.addColorStop(0.0, "rgba(255, 255, 255, 0.98)");
        grad.addColorStop(0.4, "rgba(235, 240, 248, 0.92)");
        grad.addColorStop(1.0, "rgba(175, 192, 215, 0.74)");
        ctx.fillStyle = grad;
        ctx.fillText(item.char, 0, 0);

        ctx.strokeStyle = "rgba(255, 255, 255, 0.32)";
        ctx.lineWidth   = Math.max(0.5, 1.1 * scale);
        ctx.strokeText(item.char, 0, 0);

        ctx.restore();
        ctx.restore();
      });
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div
      onClick={handleEnter}
      style={{
        position: "fixed", inset: 0, zIndex: 999999,
        background: "#030407",
        cursor: "pointer", overflow: "hidden", userSelect: "none",
        transition: "opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)",
        opacity: isExiting ? 0 : 1,
        transform: isExiting ? "scale(1.08)" : "scale(1)",
        pointerEvents: isExiting ? "none" : "auto",
      }}
    >
      {/* Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />

      {/* WebGL marble background */}
      <canvas ref={glCanvasRef} style={{ position:"absolute", inset:0, width:"100%", height:"100%", display:"block", zIndex:1 }} />

      {/* 3-D letter canvas */}
      <canvas ref={textCanvasRef} style={{ position:"absolute", inset:0, width:"100%", height:"100%", display:"block", zIndex:2 }} />

      {/* Film-grain noise overlay */}
      <div style={{
        position:"absolute", inset:0, zIndex:3, pointerEvents:"none", opacity:0.16,
        backgroundImage:"radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1px)",
        backgroundSize:"3px 3px",
      }} />

      {/* Deep cinematic vignette */}
      <div style={{
        position:"absolute", inset:0, zIndex:4, pointerEvents:"none",
        boxShadow:"inset 0 0 120px rgba(5,20,60,0.60), inset 0 0 40px rgba(2,6,16,0.85)",
      }} />

      {/* Top-left label */}
      <div style={{
        position:"absolute", top:"2.4rem", left:"2.8rem", zIndex:10,
        display:"flex", alignItems:"center", gap:"0.8rem", pointerEvents:"none",
      }}>
        <span style={{
          width:"6px", height:"6px", borderRadius:"50%",
          backgroundColor:"rgba(100,180,255,0.85)",
          boxShadow:"0 0 10px rgba(100,180,255,0.8)", display:"inline-block",
        }} />
        <span style={{
          fontFamily:"'Inter', sans-serif", fontSize:"0.68rem",
          letterSpacing:"0.28em", textTransform:"uppercase",
          color:"rgba(255,255,255,0.50)", fontWeight:500,
        }}>
          ANSH · PORTFOLIO
        </span>
      </div>

      {/* Bottom CTA */}
      <div
        style={{
          position:"absolute", bottom:"3.2rem", left:"50%",
          transform:"translateX(-50%)", zIndex:10,
          display:"flex", flexDirection:"column", alignItems:"center", gap:"0.75rem",
          cursor:"pointer",
        }}
        onClick={(e) => { e.stopPropagation(); handleEnter(); }}
      >
        <button style={{
          background:"none", border:"none", outline:"none", cursor:"pointer",
          padding:"0.6rem 1.6rem", display:"flex", flexDirection:"column",
          alignItems:"center", gap:"0.6rem", transition:"all 0.3s ease",
        }}
          className="intro-cta-btn"
        >
          <span style={{
            fontFamily:"'Inter', -apple-system, sans-serif",
            fontSize:"clamp(0.72rem, 1vw, 0.85rem)",
            letterSpacing:"0.36em", textTransform:"uppercase",
            color:"rgba(255,255,255,0.90)", fontWeight:500,
            textShadow:"0 0 14px rgba(255,255,255,0.38)",
          }}>
            EXPLORE PORTFOLIO
          </span>
          <span style={{
            width:"36px", height:"1px",
            background:"linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)",
            display:"block", animation:"introPulse 2.4s ease-in-out infinite",
          }} />
        </button>
        <span style={{
          fontFamily:"'Inter', sans-serif", fontSize:"0.58rem",
          letterSpacing:"0.22em", textTransform:"uppercase",
          color:"rgba(255,255,255,0.32)", fontWeight:400,
        }}>
          Click anywhere or scroll to enter
        </span>
      </div>

      <style>{`
        @keyframes introPulse {
          0%,100% { transform: scaleX(0.7); opacity: 0.4; }
          50%      { transform: scaleX(1.3); opacity: 0.95; }
        }
        .intro-cta-btn:hover span:first-child {
          color: #ffffff !important;
          letter-spacing: 0.42em !important;
          text-shadow: 0 0 22px rgba(180,220,255,0.85) !important;
        }
      `}</style>
    </div>
  );
}
