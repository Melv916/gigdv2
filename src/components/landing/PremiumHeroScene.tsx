import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, BarChart3, Building2, Waves } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return prefersReducedMotion;
}

const VERTEX_SHADER = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_mobile;

mat2 rotate2d(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(c, -s, s, c);
}

float ring(vec2 p, float radius, float width) {
  return smoothstep(width, 0.0, abs(length(p) - radius));
}

float box(vec2 p, vec2 size) {
  vec2 d = abs(p) - size;
  return 1.0 - smoothstep(0.0, 0.012, max(d.x, d.y));
}

float beam(vec2 p, float x, float softness) {
  return exp(-softness * abs(p.x - x));
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
  p.x *= u_resolution.x / u_resolution.y;
  float time = u_time * 0.14;
  vec2 q = p;
  q.x += 0.025 * sin(time * 1.3 + q.y * 1.8);

  float vignette = smoothstep(1.42, 0.08, length(vec2(p.x * 0.84, p.y * 1.08)));
  float horizon = smoothstep(0.78, -0.22, p.y);
  float floorFade = smoothstep(0.48, -0.62, p.y);
  float gridX = abs(fract((uv.x + 0.18) * 18.0) - 0.5);
  float gridY = abs(fract((uv.y + 0.12) * 12.0) - 0.5);
  float grid = smoothstep(0.48, 0.08, 0.5 - min(gridX, gridY));

  float skyline = 0.0;
  for (int index = 0; index < 9; index += 1) {
    float fi = float(index);
    float x = -1.18 + fi * 0.31;
    float height = 0.18 + 0.05 * fi + 0.08 * sin(fi * 1.42 + 1.1);
    vec2 local = q - vec2(x, -0.68 + height);
    skyline += box(local, vec2(0.038 + fi * 0.002, height));
    skyline += 0.55 * box(q - vec2(x + 0.055, -0.72 + height * 0.7), vec2(0.022, height * 0.7));
  }

  vec2 orbitA = q * rotate2d(0.54);
  vec2 orbitB = q * rotate2d(-0.86);
  float orbit1 = ring(orbitA + vec2(0.28, -0.04), 0.92, 0.008);
  float orbit2 = ring(orbitB + vec2(0.22, 0.05), 0.58 + 0.015 * sin(time), 0.010);
  float orbit3 = ring(orbitA + vec2(0.20, 0.02), 0.34, 0.012);

  float traceA = beam(q, 0.44 + 0.05 * sin(time * 0.8), 26.0) * smoothstep(0.72, -0.14, q.y);
  float traceB = beam(q, 0.08 + 0.03 * cos(time * 0.66), 34.0) * smoothstep(0.44, -0.48, q.y) * 0.65;
  float haze = smoothstep(1.18, 0.0, length(q - vec2(0.34, -0.08)));
  float pulse = smoothstep(0.30, 0.0, length(q - vec2(0.54 + 0.04 * sin(time), -0.18 + 0.02 * cos(time * 1.2))));
  float reflection = exp(-18.0 * abs(p.y + 0.54)) * smoothstep(-1.2, 0.8, p.x);

  vec3 color = vec3(0.012, 0.02, 0.038);
  color += vec3(0.03, 0.05, 0.08) * grid * 0.18 * horizon;
  color += vec3(0.02, 0.04, 0.07) * horizon * 0.28;
  color += vec3(0.07, 0.12, 0.22) * skyline * (0.16 + 0.12 * u_mobile);
  color += vec3(0.09, 0.18, 0.34) * skyline * 0.14 * floorFade;
  color += vec3(0.10, 0.22, 0.42) * orbit1;
  color += vec3(0.06, 0.18, 0.30) * orbit2;
  color += vec3(0.04, 0.10, 0.18) * orbit3;
  color += vec3(0.10, 0.34, 0.48) * traceA * 0.4;
  color += vec3(0.06, 0.18, 0.30) * traceB * 0.3;
  color += vec3(0.08, 0.14, 0.25) * haze * 0.36;
  color += vec3(0.08, 0.38, 0.56) * pulse * 0.24;
  color += vec3(0.04, 0.08, 0.16) * reflection * 0.22;
  color *= vignette;

  gl_FragColor = vec4(color, 0.94);
}
`;

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function PremiumHeroScene() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useIsMobile();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isWebGlReady, setIsWebGlReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return undefined;
    if (typeof window !== "undefined" && /jsdom/i.test(window.navigator.userAgent)) {
      setIsWebGlReady(false);
      return undefined;
    }

    let gl: WebGLRenderingContext | null = null;
    try {
      gl = canvas.getContext("webgl", {
        alpha: true,
        antialias: !isMobile,
        powerPreference: "high-performance",
      });
    } catch {
      gl = null;
    }

    if (!gl) {
      setIsWebGlReady(false);
      return undefined;
    }

    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) {
      setIsWebGlReady(false);
      return undefined;
    }

    const program = gl.createProgram();
    if (!program) {
      setIsWebGlReady(false);
      return undefined;
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      setIsWebGlReady(false);
      return undefined;
    }

    setIsWebGlReady(true);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1,
        1, -1,
        -1, 1,
        -1, 1,
        1, -1,
        1, 1,
      ]),
      gl.STATIC_DRAW,
    );

    const positionLocation = gl.getAttribLocation(program, "a_position");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const mobileLocation = gl.getUniformLocation(program, "u_mobile");

    let animationFrame = 0;
    let inView = true;
    let documentVisible = !document.hidden;
    let startTime = performance.now();

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.2 : 1.75);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const draw = (timestamp: number) => {
      if (!documentVisible || !inView) {
        animationFrame = window.requestAnimationFrame(draw);
        return;
      }

      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, prefersReducedMotion ? 0 : (timestamp - startTime) / 1000);
      gl.uniform1f(mobileLocation, isMobile ? 1 : 0);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      if (!prefersReducedMotion) {
        animationFrame = window.requestAnimationFrame(draw);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
      },
      { threshold: 0.12 },
    );
    observer.observe(container);

    const onVisibilityChange = () => {
      documentVisible = !document.hidden;
      if (documentVisible && !prefersReducedMotion) {
        startTime = performance.now();
      }
    };

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibilityChange);

    resize();
    draw(performance.now());

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.cancelAnimationFrame(animationFrame);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, [isMobile, prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      className={`gigd-hero-visual ${isWebGlReady ? "gigd-hero-visual-ready" : ""}`}
      aria-hidden="true"
    >
      <div className="gigd-hero-ambient-ring gigd-hero-ambient-ring-a" />
      <div className="gigd-hero-ambient-ring gigd-hero-ambient-ring-b" />
      <div className="gigd-hero-webgl-fallback" />
      <canvas ref={canvasRef} className="gigd-hero-webgl" />

      <div className="gigd-hero-monument signature-float">
        <div className="gigd-hero-monument-base gigd-hero-monument-base-a" />
        <div className="gigd-hero-monument-base gigd-hero-monument-base-b" />
        <div className="gigd-hero-monument-base gigd-hero-monument-base-c" />

        <div className="gigd-hero-monument-core">
          <span className="gigd-hero-spire gigd-hero-spire-a" />
          <span className="gigd-hero-spire gigd-hero-spire-b" />
          <span className="gigd-hero-spire gigd-hero-spire-c" />
          <span className="gigd-hero-spire gigd-hero-spire-d" />
          <span className="gigd-hero-spire gigd-hero-spire-e" />
          <span className="gigd-hero-bar gigd-hero-bar-a" />
          <span className="gigd-hero-bar gigd-hero-bar-b" />
          <span className="gigd-hero-bar gigd-hero-bar-c" />
          <span className="gigd-hero-bar gigd-hero-bar-d" />
        </div>

        <div className="gigd-hero-orbit gigd-hero-orbit-a" />
        <div className="gigd-hero-orbit gigd-hero-orbit-b" />
        <div className="gigd-hero-orbit gigd-hero-orbit-c" />
        <div className="gigd-hero-axis-glow" />
      </div>

      <div className="gigd-hero-float gigd-hero-float-left">
        <BarChart3 size={16} strokeWidth={1.4} />
        <div>
          <span>Signal de marché</span>
          <strong>Lecture instantanée</strong>
        </div>
      </div>

      <div className="gigd-hero-float gigd-hero-float-top">
        <Building2 size={16} strokeWidth={1.4} />
        <div>
          <span>Architecture</span>
          <strong>Actif + scénario</strong>
        </div>
      </div>

      <div className="gigd-hero-float gigd-hero-float-right">
        <Waves size={16} strokeWidth={1.4} />
        <div>
          <span>Flux</span>
          <strong>Cash-flow et tension</strong>
        </div>
      </div>

      <div className="gigd-hero-float gigd-hero-float-bottom">
        <ArrowUpRight size={16} strokeWidth={1.4} />
        <div>
          <span>Décision</span>
          <strong>Cockpit investisseur</strong>
        </div>
      </div>
    </div>
  );
}
