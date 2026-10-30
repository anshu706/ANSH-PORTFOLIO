import React, { useEffect, useRef, useState, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════════════════════
   ANSH — 3D CINEMATIC INTRO SCREEN (Alexandre Rochet Aesthetic)
   - Background: Deep obsidian black with silky, visible smoke/silk swirls
   - Letters: "ANSH" only, distributed in a 3D galaxy of architectural sculptures
   - Cylindrical extruded perspective trails (matching 'D' & 'O' in reference)
   - Center hero letter with photographic camera depth-of-field lens blur (matching 'X')
   ═══════════════════════════════════════════════════════════════════════════════ */

// 15 letter positions mirroring Alexandre Rochet's composition, using "A · N · S · H"
const LETTERS = [
  // ── Central Hero (matching the large blurred 'X' in reference) ──
  {
    char: "N",
    x: -0.02,
    y: 0.02,
    z: 0.25,
    size: 155,
    trailLength: 32,
    trailAlpha: 0.38,
    blur: 3.5,
    weight: "600",
    heroCenter: true,
  },

  // ── Foreground Hero Sculptures with deep 3D cylindrical extrusions ──
  // Top-Right: matching the extruded hollow cylinder 'D' in reference
  {
    char: "S",
    x: 0.40,
    y: -0.28,
    z: 0.36,
    size: 125,
    trailLength: 52,
    trailAlpha: 0.46,
    blur: 0.6,
    weight: "600",
    cylinder: true,
  },
  // Left-Mid: matching the standing 3D 'L' in reference
  {
    char: "A",
    x: -0.32,
    y: 0.06,
    z: 0.42,
    size: 115,
    trailLength: 38,
    trailAlpha: 0.40,
    blur: 0.5,
    weight: "600",
  },
  // Bottom-Left: matching the hollow cylinder 'O' in reference
  {
    char: "H",
    x: -0.26,
    y: 0.44,
    z: 0.38,
    size: 105,
    trailLength: 50,
    trailAlpha: 0.45,
    blur: 0.6,
    weight: "600",
    cylinder: true,
  },

  // ── Midground Sculptures ──
  // Top Center-Left (matching the high 'A' in reference)
  {
    char: "A",
    x: 0.03,
    y: -0.46,
    z: 0.65,
    size: 75,
    trailLength: 26,
    trailAlpha: 0.32,
    blur: 0.3,
    weight: "500",
  },
  // Far Left (matching 'A' & 'R' on far-left in reference)
  {
    char: "N",
    x: -0.56,
    y: -0.12,
    z: 0.72,
    size: 72,
    trailLength: 24,
    trailAlpha: 0.30,
    blur: 0.3,
    weight: "500",
  },
  {
    char: "S",
    x: -0.58,
    y: 0.25,
    z: 0.76,
    size: 70,
    trailLength: 26,
    trailAlpha: 0.30,
    blur: 0.3,
    weight: "500",
  },
  // Mid-Right cluster (matching 'N', 'R', 'T' in reference)
  {
    char: "A",
    x: 0.34,
    y: -0.04,
    z: 0.68,
    size: 70,
    trailLength: 24,
    trailAlpha: 0.28,
    blur: 0.2,
    weight: "500",
  },
  {
    char: "H",
    x: 0.68,
    y: 0.10,
    z: 0.52,
    size: 85,
    trailLength: 32,
    trailAlpha: 0.34,
    blur: 0.4,
    weight: "600",
  },
  {
    char: "N",
    x: 0.82,
    y: 0.28,
    z: 0.62,
    size: 78,
    trailLength: 28,
    trailAlpha: 0.32,
    blur: 0.3,
    weight: "600",
  },
  // Bottom Center-Right (matching 'C' & 'H' in reference)
  {
    char: "S",
    x: 0.00,
    y: 0.48,
    z: 0.66,
    size: 68,
    trailLength: 22,
    trailAlpha: 0.28,
    blur: 0.2,
    weight: "500",
  },
  {
    char: "A",
    x: 0.36,
    y: 0.46,
    z: 0.56,
    size: 84,
    trailLength: 30,
    trailAlpha: 0.32,
    blur: 0.3,
    weight: "500",
  },

  // ── Deep Background Mist Letters (atmospheric depth) ──
  // Upper-left high (matching 'E' in reference)
  {
    char: "H",
    x: -0.34,
    y: -0.32,
    z: 0.95,
    size: 52,
    trailLength: 16,
    trailAlpha: 0.20,
    blur: 0.8,
    weight: "500",
  },
  // Far upper-right (matching 'E' on top-right in reference)
  {
    char: "N",
    x: 0.78,
    y: -0.30,
    z: 1.10,
    size: 48,
    trailLength: 14,
    trailAlpha: 0.18,
    blur: 1.0,
    weight: "500",
  },
  // Mid-right small (matching 'E' in reference)
  {
    char: "S",
    x: 0.44,
    y: 0.18,
    z: 0.90,
    size: 50,
    trailLength: 15,
    trailAlpha: 0.20,
    blur: 0.7,
    weight: "500",
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

// Fluid smoke / silky marbling shader matching Image 2
// Rich, visible ribbons of charcoal smoke & silvery wave crests swirling against deep obsidian
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

  // Smooth, low-frequency 3-octave FBM for broad silky smoke folds (no grain)
  float smokeFbm(vec2 p) {
    float v = 0.0;
    float a = 0.50;
    mat2 rot = mat2(0.877, 0.479, -0.479, 0.877);
    for (int i = 0; i < 4; i++) {
      v += a * snoise(p);
      p = rot * p * 1.82 + vec2(1.4, 0.9);
      a *= 0.48;
    }
    return v;
  }

  // Two-stage domain warping for organic liquid marbling
  float smokeField(vec2 p, float t, out vec2 q, out vec2 r) {
    q = vec2(
      smokeFbm(p * 0.65 + vec2(0.0, t * 0.14)),
      smokeFbm(p * 0.65 + vec2(5.2, 1.3 - t * 0.12))
    );

    r = vec2(
      smokeFbm(p * 0.75 + 2.0 * q + vec2(1.7, 9.2) + vec2( t * 0.08, -t * 0.06)),
      smokeFbm(p * 0.75 + 2.0 * q + vec2(8.3, 2.8) + vec2(-t * 0.06,  t * 0.08))
    );

    return smokeFbm(p * 0.70 + 2.2 * r);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    vec2 p  = (gl_FragCoord.xy * 2.0 - uResolution.xy) / min(uResolution.x, uResolution.y);

    // Mouse influence
    vec2 m = (uMouse * 2.0 - 1.0);
    m.y = -m.y;
    float mDist = length(p - m * 0.9);
    vec2 mOffset = normalize(p - m * 0.9 + 0.0001) * exp(-mDist * 2.2) * 0.12;

    float t = uTime * 0.14;
    vec2 pos = p * 0.75 + mOffset;

    vec2 q, r;
    float f = smokeField(pos, t, q, r);
    float n = clamp(f * 0.5 + 0.5, 0.0, 1.0);

    // Compute surface normal for specular lighting
    float eps = 0.025;
    vec2 dQ, dR;
    float fR = smokeField(pos + vec2(eps, 0.0), t, dQ, dR);
    float fU = smokeField(pos + vec2(0.0, eps), t, dQ, dR);
    vec3 normal = normalize(vec3((f - fR) / eps, (f - fU) / eps, 0.42));

    // Directional lighting
    vec3 light1 = normalize(vec3(-0.4, 0.6, 0.75));
    vec3 light2 = normalize(vec3(0.5, -0.3, 0.60));
    vec3 viewDir = vec3(0.0, 0.0, 1.0);

    float diff1 = max(dot(normal, light1), 0.0);
    float diff2 = max(dot(normal, light2), 0.0);

    vec3 half1 = normalize(light1 + viewDir);
    float spec1 = pow(max(dot(normal, half1), 0.0), 16.0);

    vec3 half2 = normalize(light2 + viewDir);
    float spec2 = pow(max(dot(normal, half2), 0.0), 28.0);

    // ── Color Grading exactly matching Image 2 ──
    // Deep obsidian black base
    vec3 baseBlack = vec3(0.022, 0.024, 0.028);

    // Smoky grey marbling (visible ribbons!)
    vec3 smokeGray = vec3(0.18, 0.19, 0.22);
    float smokeRibbons = smoothstep(0.20, 0.72, n);
    vec3 col = mix(baseBlack, smokeGray, smokeRibbons * 0.88);

    // Silky bright swirls & highlights
    vec3 silkHighlight = vec3(0.38, 0.40, 0.45);
    float silkCurl = smoothstep(0.48, 0.86, n);
    col = mix(col, silkHighlight, silkCurl * 0.65);

    // Liquid specular glints along the wave ridges
    vec3 glint = vec3(0.58, 0.60, 0.66);
    col += glint * (spec1 * 0.42 + spec2 * 0.25);

    // Subtle edge vignette
    float vig = length((uv - 0.5) * 1.35);
    col *= clamp(1.25 - vig * 0.55, 0.0, 1.0);

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

      // Sort back-to-front for accurate painter's algorithm
      const instances = LETTERS.map((def, i) => {
        const floatX = Math.sin(t * 0.65 + i * 1.37) * 0.018;
        const floatY = Math.cos(t * 0.55 + i * 1.13) * 0.022;
        const floatRot = Math.sin(t * 0.38 + i * 0.91) * 0.04;
        return {
          ...def,
          wx: def.x + floatX,
          wy: def.y + floatY,
          wz: def.z + cam.z,
          rot: floatRot,
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

        // Cylindrical extrusion vector pointing downward-right into space (matching 'D' & 'O' in reference)
        const projX = (dx / dLen) * 0.45 + 0.45;
        const projY = (dy / dLen) * 0.45 + 0.65;
        const projLen = Math.hypot(projX, projY) || 1;

        const steps = Math.min(45, Math.max(12, Math.floor(item.trailLength * scale * 1.35)));
        const trailDist = item.trailLength * scale * 2.3 * (1.0 + distNorm * 0.8);

        ctx.save();
        ctx.font = `${item.weight || "500"} ${fSize}px 'Syne', 'Inter', -apple-system, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // ── Volumetric cylindrical 3D extrusion trail (back → front) ──
        for (let s = steps; s >= 1; s--) {
          const prog = s / steps;
          const offX = (projX / projLen) * (trailDist * prog);
          const offY = (projY / projLen) * (trailDist * prog);

          // Alpha falls off towards the end of the trail
          const alpha = (1.0 - prog) * (item.trailAlpha || 0.35) * (1.1 - item.wz * 0.4);

          ctx.save();
          ctx.translate(sx + offX, sy + offY);
          ctx.rotate(item.rot * (1 - prog * 0.35));

          // Soft volumetric smoky body fill
          ctx.fillStyle = `rgba(180, 195, 218, ${Math.max(0, Math.min(0.55, alpha * 0.85))})`;
          ctx.fillText(item.char, 0, 0);

          // Clean stroke contour on extrusion layers to create solid cylindrical walls
          ctx.strokeStyle = `rgba(230, 240, 255, ${Math.max(0, Math.min(0.35, alpha * 0.70))})`;
          ctx.lineWidth = Math.max(0.6, 1.1 * scale);
          ctx.strokeText(item.char, 0, 0);

          ctx.restore();
        }

        // ── Front face of letter ──
        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate(item.rot);

        // Photographic depth-of-field blur on center hero letter (matching 'X' in reference)
        if (item.heroCenter) {
          ctx.shadowColor = "rgba(255, 255, 255, 0.75)";
          ctx.shadowBlur = 18 * scale;

          // Double pass for optical camera glow
          ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
          ctx.fillText(item.char, -1.5, -1.0);
          ctx.fillText(item.char, 1.5, 1.0);
        } else if (item.blur && item.blur > 0) {
          ctx.shadowColor = "rgba(255, 255, 255, 0.45)";
          ctx.shadowBlur = item.blur * 10 * scale;
        }

        // Metallic silver-white gradient face
        const grad = ctx.createLinearGradient(0, -fSize * 0.5, 0, fSize * 0.5);
        grad.addColorStop(0.0, "rgba(255, 255, 255, 1.0)");
        grad.addColorStop(0.4, "rgba(238, 242, 250, 0.95)");
        grad.addColorStop(1.0, "rgba(185, 195, 210, 0.80)");
        ctx.fillStyle = grad;
        ctx.fillText(item.char, 0, 0);

        // Luminous crisp white outline on the front rim
        ctx.strokeStyle = "rgba(255, 255, 255, 0.90)";
        ctx.lineWidth = Math.max(0.8, 1.6 * scale);
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
        background: "#030305",
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
        href="https://fonts.googleapis.com/css2?family=Syne:wght@500;600;700;800&family=Inter:wght@300;400;500;600&display=swap"
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
