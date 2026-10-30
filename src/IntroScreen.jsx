import React, { useEffect, useRef, useState, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════════════════════
   ANSH — 3D CINEMATIC LIQUID SMOKE INTRO SCREEN
   Exact Alexandre Rochet style:
   - Deep obsidian black with smooth, silky, slow-swirling liquid waves
   - 3D normal-mapped specular lighting (no grainy / high-frequency noise)
   - "ANSH" 4 hero letters floating with volumetric cylindrical 3D extrusions
   ═══════════════════════════════════════════════════════════════════════════════ */

// The 4 hero letters: A · N · S · H arranged in dynamic 3D space
const LETTERS = [
  {
    char: "A",
    x: -0.42,
    y: -0.06,
    z: 0.38,
    size: 135,
    trailLength: 38,
    trailAlpha: 0.38,
    blur: 0.8,
    weight: "700",
    rotX: -0.08,
  },
  {
    char: "N",
    x: -0.14,
    y: 0.16,
    z: 0.28,
    size: 165,
    trailLength: 46,
    trailAlpha: 0.44,
    blur: 2.2, // Central hero glow (like the X in Alexandre Rochet)
    weight: "800",
    rotX: 0.05,
  },
  {
    char: "S",
    x: 0.16,
    y: -0.14,
    z: 0.34,
    size: 155,
    trailLength: 42,
    trailAlpha: 0.40,
    blur: 1.0,
    weight: "800",
    rotX: -0.06,
  },
  {
    char: "H",
    x: 0.46,
    y: 0.10,
    z: 0.40,
    size: 130,
    trailLength: 36,
    trailAlpha: 0.36,
    blur: 0.6,
    weight: "700",
    rotX: 0.08,
  },
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

// Pure-black, silky liquid smoke with normal-based 3D specular lighting
// Matches Image 2: large, smooth, undulating fluid folds without speckles or blue tint
const FRAG_SRC = `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2  uResolution;
  uniform vec2  uMouse;

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
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x  = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  // Smooth, low-frequency wave field (pure silky smoke/liquid, zero grain)
  float fluidHeight(vec2 p, float t) {
    vec2 q = vec2(
      snoise(p * 0.45 + vec2(0.0, t * 0.12)),
      snoise(p * 0.45 + vec2(4.3, 2.1 - t * 0.10))
    );

    vec2 r = vec2(
      snoise(p * 0.55 + 1.8 * q + vec2(1.7, 9.2) + vec2( t * 0.08, -t * 0.06)),
      snoise(p * 0.55 + 1.8 * q + vec2(8.3, 2.8) + vec2(-t * 0.06,  t * 0.08))
    );

    float f = snoise(p * 0.50 + 2.0 * r);
    f += 0.30 * snoise(p * 0.90 + 1.2 * q - vec2(t * 0.05, t * 0.07));
    return f;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    vec2 p = (gl_FragCoord.xy * 2.0 - uResolution.xy) / min(uResolution.x, uResolution.y);

    // Mouse influence - smooth displacement wave
    vec2 m = (uMouse * 2.0 - 1.0);
    m.y = -m.y;
    float mDist = length(p - m * 0.9);
    vec2 mOffset = normalize(p - m * 0.9 + 0.0001) * exp(-mDist * 2.2) * 0.12;

    float t = uTime * 0.16;
    vec2 pos = p * 0.85 + mOffset;

    // Normal calculation via finite differences for genuine 3D liquid lighting
    float eps = 0.02;
    float hC = fluidHeight(pos, t);
    float hR = fluidHeight(pos + vec2(eps, 0.0), t);
    float hU = fluidHeight(pos + vec2(0.0, eps), t);

    vec3 normal = normalize(vec3((hC - hR) / eps, (hC - hU) / eps, 0.32));

    // Directional lighting matching Alexandre Rochet
    vec3 light1 = normalize(vec3(-0.4, 0.6, 0.75));
    vec3 light2 = normalize(vec3(0.5, -0.3, 0.60));
    vec3 viewDir = vec3(0.0, 0.0, 1.0);

    // Diffuse
    float diff1 = max(dot(normal, light1), 0.0);
    float diff2 = max(dot(normal, light2), 0.0);

    // Specular (glossy wet fluid sheen)
    vec3 half1 = normalize(light1 + viewDir);
    float spec1 = pow(max(dot(normal, half1), 0.0), 16.0);

    vec3 half2 = normalize(light2 + viewDir);
    float spec2 = pow(max(dot(normal, half2), 0.0), 28.0);

    // Monochromatic deep black, silky charcoal, and soft silvery crests
    vec3 baseBlack  = vec3(0.012, 0.012, 0.015);
    vec3 smokeMid   = vec3(0.145, 0.150, 0.160);
    vec3 liquidGlint = vec3(0.58, 0.60, 0.64);

    float tone = clamp(diff1 * 0.65 + diff2 * 0.35 + (hC * 0.15), 0.0, 1.0);
    float darkTone = pow(tone, 2.4);

    vec3 col = mix(baseBlack, smokeMid, darkTone);
    col += liquidGlint * (spec1 * 0.38 + spec2 * 0.22);

    // Smooth soft vignette
    float vig = length((uv - 0.5) * 1.4);
    col *= clamp(1.0 - vig * 0.65, 0.0, 1.0);
    col *= clamp(1.3 - vig * vig * 0.7, 0.0, 1.0);

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function IntroScreen({ onDone }) {
  const glCanvasRef = useRef(null);
  const textCanvasRef = useRef(null);

  const [isExiting, setIsExiting] = useState(false);
  const mouseRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });
  const cameraRef = useRef({ x: 0, y: 0, z: 0, targetZ: 0 });
  const timeRef = useRef(0);
  const rafRef = useRef(null);

  /* ── Transition out ── */
  const handleEnter = useCallback(() => {
    if (isExiting) return;
    setIsExiting(true);
    cameraRef.current.targetZ = -1.4;
    setTimeout(() => onDone(), 1000);
  }, [isExiting, onDone]);

  /* ── Keyboard & scroll triggers ── */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") handleEnter();
    };
    let acc = 0,
      timer = null;
    const onWheel = (e) => {
      acc += Math.abs(e.deltaY);
      clearTimeout(timer);
      timer = setTimeout(() => {
        acc = 0;
      }, 300);
      if (acc > 70) handleEnter();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", onWheel);
    };
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
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
    };
  }, []);

  /* ── WebGL Background ── */
  useEffect(() => {
    const canvas = glCanvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return;

    const mkShader = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(s));
        return null;
      }
      return s;
    };
    const vert = mkShader(gl.VERTEX_SHADER, VERT_SRC);
    const frag = mkShader(gl.FRAGMENT_SHADER, FRAG_SRC);
    if (!vert || !frag) return;

    const prog = gl.createProgram();
    gl.attachShader(prog, vert);
    gl.attachShader(prog, frag);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    const posAttr = gl.getAttribLocation(prog, "position");
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "uTime");
    const uRes = gl.getUniformLocation(prog, "uResolution");
    const uMouse = gl.getUniformLocation(prog, "uMouse");

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    canvas._render = () => {
      gl.useProgram(prog);
      gl.uniform1f(uTime, timeRef.current);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uMouse, mouseRef.current.x, mouseRef.current.y);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  /* ── 3-D Letter Canvas ── */
  useEffect(() => {
    const tc = textCanvasRef.current;
    if (!tc) return;
    const ctx = tc.getContext("2d");
    let running = true;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      tc.width = window.innerWidth * dpr;
      tc.height = window.innerHeight * dpr;
      tc.style.width = `${window.innerWidth}px`;
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

      const cx = W * 0.5;
      const cy = H * 0.5;
      const fov = Math.min(W, H) * 0.95;

      // Sort back-to-front
      const instances = LETTERS.map((def, i) => {
        const floatX = Math.sin(t * 0.65 + i * 1.37) * 0.020;
        const floatY = Math.cos(t * 0.55 + i * 1.13) * 0.025;
        const floatRot = Math.sin(t * 0.38 + i * 0.91) * 0.045;
        return {
          ...def,
          wx: def.x + floatX,
          wy: def.y + floatY,
          wz: def.z + cam.z,
          rot: (def.rotX || 0) + floatRot,
        };
      })
        .filter((item) => item.wz > 0.05)
        .sort((a, b) => b.wz - a.wz);

      instances.forEach((item) => {
        const persp = fov / (item.wz * fov * 0.0016 + 1.0);
        const sx = cx + (item.wx - cam.x) * persp;
        const sy = cy + (item.wy - cam.y) * persp;
        const scale = persp * 0.0012;
        const fSize = Math.max(12, item.size * scale);

        // Volumetric tube extrusion vector
        const dx = sx - cx;
        const dy = sy - cy;
        const dLen = Math.hypot(dx, dy) || 1;
        const distNorm = dLen / Math.max(W, H);

        // Blend perspective center vector with a natural downward-right light angle
        const projX = (dx / dLen) * 0.55 + 0.35;
        const projY = (dy / dLen) * 0.55 + 0.60;
        const projLen = Math.hypot(projX, projY) || 1;

        const steps = Math.min(42, Math.max(12, Math.floor(item.trailLength * scale * 1.3)));
        const trailDist = item.trailLength * scale * 2.3 * (1.0 + distNorm * 0.85);

        ctx.save();
        ctx.font = `${item.weight || "700"} ${fSize}px 'Syne', 'Inter', -apple-system, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // ── Volumetric cylindrical extrusion shadow trail (back → front) ──
        for (let s = steps; s >= 1; s--) {
          const prog = s / steps;
          const offX = (projX / projLen) * (trailDist * prog);
          const offY = (projY / projLen) * (trailDist * prog);
          const alpha = (1.0 - prog) * (item.trailAlpha || 0.35) * (1.1 - item.wz * 0.4);

          // Subtle smoky body fill
          ctx.fillStyle = `rgba(215, 225, 238, ${Math.max(0, Math.min(0.60, alpha))})`;

          ctx.save();
          ctx.translate(sx + offX, sy + offY);
          ctx.rotate(item.rot * (1 - prog * 0.35));
          ctx.fillText(item.char, 0, 0);

          // Subtle stroke to give tubular structure like the "D" and "O" in reference
          ctx.strokeStyle = `rgba(255, 255, 255, ${Math.max(0, Math.min(0.25, alpha * 0.75))})`;
          ctx.lineWidth = Math.max(0.4, 0.8 * scale);
          ctx.strokeText(item.char, 0, 0);

          ctx.restore();
        }

        // ── Front face of letter ──
        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate(item.rot);

        // Glow for central hero letters
        if (item.blur > 0) {
          ctx.shadowColor = "rgba(255, 255, 255, 0.50)";
          ctx.shadowBlur = item.blur * 14 * scale;
        }

        // Metallic silver-white gradient face
        const grad = ctx.createLinearGradient(0, -fSize * 0.5, 0, fSize * 0.5);
        grad.addColorStop(0.0, "rgba(255, 255, 255, 1.0)");
        grad.addColorStop(0.35, "rgba(240, 245, 252, 0.95)");
        grad.addColorStop(1.0, "rgba(185, 195, 210, 0.75)");
        ctx.fillStyle = grad;
        ctx.fillText(item.char, 0, 0);

        // Crisp white rim outline
        ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
        ctx.lineWidth = Math.max(0.6, 1.3 * scale);
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
        position: "fixed",
        inset: 0,
        zIndex: 999999,
        background: "#050507",
        cursor: "pointer",
        overflow: "hidden",
        userSelect: "none",
        transition:
          "opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
        opacity: isExiting ? 0 : 1,
        transform: isExiting ? "scale(1.08)" : "scale(1)",
        pointerEvents: isExiting ? "none" : "auto",
      }}
    >
      {/* Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Inter:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      {/* WebGL silky black liquid smoke shader canvas */}
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

      {/* 3-D letter canvas */}
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

      {/* Deep cinematic perimeter vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 4,
          pointerEvents: "none",
          boxShadow: "inset 0 0 160px rgba(0,0,0,0.85), inset 0 0 70px rgba(0,0,0,0.95)",
        }}
      />

      {/* Top-left minimalist indicator */}
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
            backgroundColor: "rgba(220, 230, 245, 0.85)",
            boxShadow: "0 0 10px rgba(255, 255, 255, 0.8)",
            display: "inline-block",
          }}
        />
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.68rem",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "rgba(255, 255, 255, 0.45)",
            fontWeight: 500,
          }}
        >
          ANSH · PORTFOLIO
        </span>
      </div>

      {/* Bottom CTA */}
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
          className="intro-cta-btn"
        >
          <span
            style={{
              fontFamily: "'Inter', -apple-system, sans-serif",
              fontSize: "clamp(0.72rem, 1vw, 0.85rem)",
              letterSpacing: "0.36em",
              textTransform: "uppercase",
              color: "rgba(255, 255, 255, 0.88)",
              fontWeight: 500,
              textShadow: "0 0 14px rgba(255, 255, 255, 0.35)",
            }}
          >
            EXPLORE PORTFOLIO
          </span>
          <span
            style={{
              width: "36px",
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)",
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
            color: "rgba(255, 255, 255, 0.30)",
            fontWeight: 400,
          }}
        >
          Click anywhere or scroll to enter
        </span>
      </div>

      <style>{`
        @keyframes introPulse {
          0%, 100% { transform: scaleX(0.7); opacity: 0.35; }
          50%      { transform: scaleX(1.3); opacity: 0.90; }
        }
        .intro-cta-btn:hover span:first-child {
          color: #ffffff !important;
          letter-spacing: 0.42em !important;
          text-shadow: 0 0 20px rgba(255, 255, 255, 0.8) !important;
        }
      `}</style>
    </div>
  );
}
