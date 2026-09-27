import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

type GhostCursorProps = {
  className?: string;
  style?: React.CSSProperties;
  inertia?: number;
  brightness?: number;
  color?: string;
  mixBlendMode?: React.CSSProperties['mixBlendMode'];
  zIndex?: number;
};

/**
 * Ultra-Performance Optimized GhostCursor component.
 * - Disabled on touch/mobile devices to save battery & prevent lag.
 * - Hardware-accelerated 60FPS Desktop GLSL rendering.
 */
export const GhostCursor: React.FC<GhostCursorProps> = ({
  className,
  style,
  inertia = 0.45,
  brightness = 0.8,
  color = '#A0A5B5',
  mixBlendMode = 'screen',
  zIndex = 5
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  
  // Trail circular buffer
  const trailBufRef = useRef<THREE.Vector2[]>([]);
  const headRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const currentMouseRef = useRef(new THREE.Vector2(0.5, 0.5));
  const velocityRef = useRef(new THREE.Vector2(0, 0));
  const fadeOpacityRef = useRef(1.0);
  const lastMoveTimeRef = useRef(typeof performance !== 'undefined' ? performance.now() : Date.now());
  const pointerActiveRef = useRef(false);
  const runningRef = useRef(false);

  const isTouch = useMemo(
    () => typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0),
    []
  );

  // If mobile touch device, return null (Mobile has no mouse cursor)
  if (isTouch) {
    return null;
  }

  const baseVertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float iTime;
    uniform vec3  iResolution;
    uniform vec2  iMouse;
    uniform vec2  iPrevMouse[18];
    uniform float iOpacity;
    uniform float iScale;
    uniform vec3  iBaseColor;
    uniform float iBrightness;

    varying vec2  vUv;

    float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7))) * 43758.5453123); }

    float noise(vec2 p){
      vec2 i = floor(p), f = fract(p);
      f = f * f * (3. - 2. * f);
      return mix(mix(hash(i + vec2(0.,0.)), hash(i + vec2(1.,0.)), f.x),
                 mix(hash(i + vec2(0.,1.)), hash(i + vec2(1.,1.)), f.x), f.y);
    }

    // Ultra fast 3-octave FBM for 60FPS fluid smoke
    float fbm(vec2 p){
      float v = 0.0;
      float a = 0.5;
      mat2 m = mat2(0.8, 0.6, -0.6, 0.8);
      for(int i=0; i<3; i++){
        v += a * noise(p);
        p = m * p * 2.1;
        a *= 0.5;
      }
      return v;
    }

    vec4 smokeBlob(vec2 p, vec2 mousePos, float intensity, float activity, float timeOffset) {
      vec2 st = p * iScale * 2.0;
      float n1 = fbm(st + vec2(iTime * 0.15 + timeOffset, -iTime * 0.1));
      float smoke = fbm(st * 1.1 + vec2(n1 * 1.4, n1 * 1.2));
      
      float radius = 0.35 + 0.2 * (1.0 / iScale);
      float dist = length(p - mousePos);
      float distFactor = 1.0 - smoothstep(0.0, radius * activity, dist);
      
      float density = pow(smoke, 2.0) * distFactor * 0.6;
      vec3 smokeColor = mix(vec3(0.6, 0.65, 0.7), vec3(0.85, 0.9, 0.95), smoke);

      return vec4(smokeColor * density * intensity, density * intensity * 0.5);
    }

    void main() {
      vec2 uv = (gl_FragCoord.xy / iResolution.xy * 2.0 - 1.0) * vec2(iResolution.x / iResolution.y, 1.0);
      vec2 mouse = (iMouse * 2.0 - 1.0) * vec2(iResolution.x / iResolution.y, 1.0);
      
      vec3 colorAcc = vec3(0.0);
      float alphaAcc = 0.0;
      
      vec4 b = smokeBlob(uv, mouse, 1.0, iOpacity, 0.0);
      colorAcc += b.rgb;
      alphaAcc += b.a;

      for (int i = 0; i < 18; i++) {
        vec2 pm = (iPrevMouse[i] * 2.0 - 1.0) * vec2(iResolution.x / iResolution.y, 1.0);
        float progress = float(i) / 18.0;
        float weight = pow(1.0 - progress, 1.5);
        
        if (weight > 0.05) {
          vec4 bt = smokeBlob(uv, pm, weight * 0.6, iOpacity, progress * 1.5);
          colorAcc += bt.rgb;
          alphaAcc += bt.a;
        }
      }

      colorAcc = clamp(colorAcc * iBrightness * iBaseColor, 0.0, 0.6);
      float outAlpha = clamp(alphaAcc * iOpacity, 0.0, 0.5);
      gl_FragColor = vec4(colorAcc, outAlpha);
    }
  `;

  useEffect(() => {
    const host = containerRef.current;
    const parent = host?.parentElement;
    if (!host || !parent) return;

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance',
      premultipliedAlpha: false,
      preserveDrawingBuffer: false
    });

    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;

    renderer.domElement.style.pointerEvents = 'none';
    if (mixBlendMode) {
      renderer.domElement.style.mixBlendMode = String(mixBlendMode);
    }
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.background = 'transparent';

    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geom = new THREE.PlaneGeometry(2, 2);

    const maxTrail = 18;
    trailBufRef.current = Array.from({ length: maxTrail }, () => new THREE.Vector2(0.5, 0.5));
    headRef.current = 0;

    const baseColor = new THREE.Color(color);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector3(1, 1, 1) },
        iMouse: { value: new THREE.Vector2(0.5, 0.5) },
        iPrevMouse: { value: trailBufRef.current.map(v => v.clone()) },
        iOpacity: { value: 1.0 },
        iScale: { value: 1.0 },
        iBaseColor: { value: new THREE.Vector3(baseColor.r, baseColor.g, baseColor.b) },
        iBrightness: { value: brightness }
      },
      vertexShader: baseVertexShader,
      fragmentShader,
      transparent: true,
      depthTest: false,
      depthWrite: false
    });
    materialRef.current = material;

    const mesh = new THREE.Mesh(geom, material);
    scene.add(mesh);

    const resize = () => {
      const rect = host.getBoundingClientRect();
      const cssW = Math.max(1, Math.floor(rect.width));
      const cssH = Math.max(1, Math.floor(rect.height));

      // Cap DPR to 0.5 for 60FPS performance on 4K / High DPI screens
      const pixelRatio = 0.5;
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(cssW, cssH, false);

      const wpx = Math.max(1, Math.floor(cssW * pixelRatio));
      const hpx = Math.max(1, Math.floor(cssH * pixelRatio));
      
      material.uniforms.iResolution.value.set(wpx, hpx, 1);
      material.uniforms.iScale.value = Math.max(0.5, Math.min(1.5, Math.min(cssW, cssH) / 600));
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    const start = typeof performance !== 'undefined' ? performance.now() : Date.now();

    const animate = () => {
      const now = performance.now();
      const t = (now - start) / 1000;
      
      const mat = materialRef.current!;

      if (pointerActiveRef.current) {
        velocityRef.current.set(
          currentMouseRef.current.x - mat.uniforms.iMouse.value.x,
          currentMouseRef.current.y - mat.uniforms.iMouse.value.y
        );
        mat.uniforms.iMouse.value.copy(currentMouseRef.current);
        fadeOpacityRef.current = 1.0;
      } else {
        velocityRef.current.multiplyScalar(inertia);
        if (velocityRef.current.lengthSq() > 1e-6) {
          mat.uniforms.iMouse.value.add(velocityRef.current);
        }
        
        const dt = now - lastMoveTimeRef.current;
        if (dt > 1000) {
          const k = Math.min(1, (dt - 1000) / 1200);
          fadeOpacityRef.current = Math.max(0, 1 - k);
        }
      }

      const N = 18;
      headRef.current = (headRef.current + 1) % N;
      trailBufRef.current[headRef.current].copy(mat.uniforms.iMouse.value);
      
      const arr = mat.uniforms.iPrevMouse.value as THREE.Vector2[];
      for (let i = 0; i < N; i++) {
        const srcIdx = (headRef.current - i + N) % N;
        arr[i].copy(trailBufRef.current[srcIdx]);
      }

      mat.uniforms.iOpacity.value = fadeOpacityRef.current;
      mat.uniforms.iTime.value = t;

      renderer.render(scene, camera);

      if (!pointerActiveRef.current && fadeOpacityRef.current <= 0.001) {
        runningRef.current = false;
        rafRef.current = null;
        return;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    const ensureLoop = () => {
      if (!runningRef.current) {
        runningRef.current = true;
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = parent.getBoundingClientRect();
      const x = THREE.MathUtils.clamp((e.clientX - rect.left) / Math.max(1, rect.width), 0, 1);
      const y = THREE.MathUtils.clamp(1 - (e.clientY - rect.top) / Math.max(1, rect.height), 0, 1);
      
      currentMouseRef.current.set(x, y);
      pointerActiveRef.current = true;
      lastMoveTimeRef.current = performance.now();
      ensureLoop();
    };

    const onPointerEnter = () => {
      pointerActiveRef.current = true;
      ensureLoop();
    };

    const onPointerLeave = () => {
      pointerActiveRef.current = false;
      lastMoveTimeRef.current = performance.now();
      ensureLoop();
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    parent.addEventListener('pointerenter', onPointerEnter, { passive: true });
    parent.addEventListener('pointerleave', onPointerLeave, { passive: true });
    
    ensureLoop();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      runningRef.current = false;
      rafRef.current = null;
      
      window.removeEventListener('pointermove', onPointerMove);
      parent.removeEventListener('pointerenter', onPointerEnter);
      parent.removeEventListener('pointerleave', onPointerLeave);
      
      ro.disconnect();
      
      scene.clear();
      geom.dispose();
      material.dispose();
      renderer.dispose();
      
      if (renderer.domElement && renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, [
    inertia,
    color,
    brightness,
    mixBlendMode
  ]);

  const mergedStyle = useMemo<React.CSSProperties>(() => ({ zIndex, ...style }), [zIndex, style]);

  return (
    <div ref={containerRef} className={`pointer-events-none absolute inset-0 ${className ?? ''}`} style={mergedStyle} />
  );
};

export default GhostCursor;
