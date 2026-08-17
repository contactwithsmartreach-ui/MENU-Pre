"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface AuralisProps extends React.HTMLAttributes<HTMLDivElement> {
  height?: string;
  className?: string;
  speed?: number;
  intensity?: number;
}

export default function Auralis({
  height = "100%",
  className,
  speed = 1.0,
  intensity = 1.0,
  ...props
}: AuralisProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });

    if (!gl) return;

    let animationFrameId: number;

    const vertexShaderSource = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      void main() {
        v_uv = (a_position + 1.0) * 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fragmentShaderSource = `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform float u_intensity;
      varying vec2 v_uv;

      // Pseudo-random & Noise functions
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                            0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                           -0.577350269189626,  // -1.0 + 2.0 * C.x
                            0.024390243902439); // 1.0 / 41.0
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
              + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      float fbm(vec2 p) {
        float total = 0.0;
        float amp = 0.5;
        for (int i = 0; i < 4; i++) {
          total += snoise(p) * amp;
          p = p * 2.1 + vec2(100.0);
          amp *= 0.5;
        }
        return total;
      }

      // Subtle Film Grain
      float grain(vec2 uv, float t) {
        return fract(sin(dot(uv + t * 0.01, vec2(12.9898, 78.233))) * 43758.5453) * 0.055;
      }

      void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        float aspect = u_resolution.x / u_resolution.y;
        st.x *= aspect;

        float t = u_time * 0.22;

        // Flowing coordinate warps
        vec2 q = vec2(fbm(st + vec2(0.0, t * 0.3)), fbm(st + vec2(5.2, 1.3 - t * 0.2)));
        vec2 r = vec2(fbm(st + 4.0 * q + vec2(1.7 - t * 0.15, 9.2)), fbm(st + 4.0 * q + vec2(8.3, 2.8 + t * 0.2)));

        float f = fbm(st + 3.0 * r);

        // Sahara Luxury Glow Color Palette: Deep Red, Radiant Orange, Warm Gold, Velvet Shadow
        vec3 colorDeep = vec3(0.04, 0.018, 0.015);
        vec3 colorCrimson = vec3(0.68, 0.14, 0.08);
        vec3 colorOrange = vec3(0.96, 0.42, 0.09);
        vec3 colorAmberGold = vec3(0.98, 0.72, 0.22);
        vec3 colorHighlight = vec3(1.0, 0.88, 0.65);

        // Multi-layered blending
        vec3 col = mix(colorDeep, colorCrimson, clamp(f * 2.2, 0.0, 1.0));
        col = mix(col, colorOrange, clamp(length(q) * 0.9, 0.0, 1.0));
        col = mix(col, colorAmberGold, clamp(length(r.x) * 1.1, 0.0, 1.0));
        col += colorHighlight * pow(clamp(f * 1.15, 0.0, 1.0), 3.5) * 0.55;

        // Radial Center Falloff vignette
        vec2 centerUV = gl_FragCoord.xy / u_resolution.xy - 0.5;
        float dist = length(centerUV);
        col *= (1.0 - smoothstep(0.2, 0.95, dist) * 0.65);

        // Add fine cinema grain & intensity
        float gr = grain(gl_FragCoord.xy, u_time);
        col += vec3(gr);
        col *= u_intensity;

        gl_FragColor = vec4(col, 0.95);
      }
    `;

    function createShader(gl: WebGLRenderingContext, type: number, source: string) {
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

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      return;
    }

    gl.useProgram(program);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const intensityLocation = gl.getUniformLocation(program, "u_intensity");

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1,
         1, -1,
        -1,  1,
        -1,  1,
         1, -1,
         1,  1,
      ]),
      gl.STATIC_DRAW
    );

    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const displayWidth = Math.floor(canvas.clientWidth * dpr);
      const displayHeight = Math.floor(canvas.clientHeight * dpr);

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    };

    window.addEventListener("resize", resize);
    resize();

    const startTime = performance.now();

    const render = (now: number) => {
      const elapsed = ((now - startTime) / 1000) * speed;

      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, elapsed);
      gl.uniform1f(intensityLocation, intensity);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
      if (program) gl.deleteProgram(program);
    };
  }, [speed, intensity]);

  return (
    <div
      className={cn("relative w-full overflow-hidden pointer-events-none", className)}
      style={{ height }}
      {...props}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block object-cover opacity-90"
      />
    </div>
  );
}