"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface AuralisProps {
  className?: string;
  height?: string;
  speed?: number;
  intensity?: number;
  palette?: "sahara" | "default" | "aurora";
}

export default function Auralis({
  className,
  height,
  speed = 1.0,
  intensity = 1.0,
  palette = "sahara",
}: AuralisProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      canvas.getContext("webgl", { alpha: true, antialias: false, powerPreference: "high-performance" }) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);

    if (!gl) {
      return;
    }

    const vsSource = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      void main() {
        v_uv = (a_position + 1.0) * 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform float u_intensity;
      varying vec2 v_uv;

      // Simplex-inspired hash and smooth noise
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                           -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
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

      // Layered Fractional Brownian Motion
      float fbm(vec2 p) {
        float total = 0.0;
        float amp = 0.55;
        float freq = 1.0;
        for (int i = 0; i < 4; i++) {
          total += snoise(p * freq) * amp;
          freq *= 2.1;
          amp *= 0.48;
        }
        return total;
      }

      // Random generator for film grain
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        float aspect = u_resolution.x / u_resolution.y;
        vec2 p = st * vec2(aspect, 1.0);

        float t = u_time * 0.18;

        // Flowing coordinate domain warp
        vec2 q = vec2(
          fbm(p + vec2(0.0, t * 0.6)),
          fbm(p + vec2(5.2, 1.3 - t * 0.4))
        );

        vec2 r = vec2(
          fbm(p + 3.0 * q + vec2(1.7 - t * 0.3, 9.2 + t * 0.5)),
          fbm(p + 3.0 * q + vec2(8.3 + t * 0.4, 2.8 - t * 0.2))
        );

        float f = fbm(p + 3.5 * r + t * 0.2);

        // Sahara & Ember Aurora Palette
        vec3 darkBase = vec3(0.039, 0.02, 0.015);
        vec3 crimsonDeep = vec3(0.55, 0.08, 0.06);
        vec3 vibrantOrange = vec3(0.95, 0.38, 0.08);
        vec3 glowingGold = vec3(1.0, 0.72, 0.22);
        vec3 softRose = vec3(0.85, 0.18, 0.35);

        // Color blending layers based on fluid warp
        vec3 color = darkBase;
        color = mix(color, crimsonDeep, clamp((f * f) * 2.8, 0.0, 1.0));
        color = mix(color, vibrantOrange, clamp(pow(r.x, 2.0) * 1.6, 0.0, 1.0));
        color = mix(color, softRose, clamp(pow(q.y, 2.2) * 1.2, 0.0, 1.0));
        color = mix(color, glowingGold, clamp(pow(f, 3.2) * 2.2, 0.0, 1.0));

        // Radial center glow and ambient vignette
        vec2 uvCenter = st - vec2(0.5, 0.45);
        float radial = 1.0 - smoothstep(0.0, 0.85, length(uvCenter));
        color *= (0.45 + 0.85 * radial * u_intensity);

        // Ambient Film Grain
        float grain = (hash(st * 450.0 + fract(u_time * 12.0)) - 0.5) * 0.055;
        color += grain;

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    function createShader(glCtx: WebGLRenderingContext, type: number, source: string) {
      const shader = glCtx.createShader(type);
      if (!shader) return null;
      glCtx.shaderSource(shader, source);
      glCtx.compileShader(shader);
      if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
        glCtx.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);

    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      return;
    }

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

    const posAttr = gl.getAttribLocation(program, "a_position");
    const uRes = gl.getUniformLocation(program, "u_resolution");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uIntensity = gl.getUniformLocation(program, "u_intensity");

    let animationFrameId: number;
    let startTime = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    };

    const render = (time: number) => {
      resize();

      const elapsed = (time - startTime) * 0.001 * speed;

      gl.useProgram(program);

      gl.enableVertexAttribArray(posAttr);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, elapsed);
      gl.uniform1f(uIntensity, intensity);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener("resize", resize);
    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
      if (program) gl.deleteProgram(program);
    };
  }, [speed, intensity, palette]);

  return (
    <div
      className={cn("relative w-full overflow-hidden pointer-events-none", className)}
      style={{ height: height || "100%" }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block object-cover transform-gpu"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}