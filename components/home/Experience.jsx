import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { easing } from "maath";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import particlesFragment from '../../shaders/particles/particlesFragment.glsl';
import particlesVertex from '../../shaders/particles/particlesVertex.glsl';
import lightRaysFragment from '../../shaders/lightRays/lightRaysFragment.glsl';
import lightRaysVertex from '../../shaders/lightRays/lightRaysVertex.glsl';

import useMouse from "@/hooks/useMouse";
import useEnterState from "@/hooks/useEnterState";

const Experience = () => {
  const cameraRef = useRef();
  const mouse = useRef(new THREE.Vector2(0.0, 0.0));
  useMouse(mouse);

  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

  useFrame((state, delta) => {
    if (cameraRef.current && mouse.current) {
      const targetX = clamp(mouse.current.x * 0.5, -1, 1);
      const targetY = clamp(-mouse.current.y * 0.5, -1, 1);
      easing.damp(cameraRef.current.position, "x", targetX, 0.5, delta);
      easing.damp(cameraRef.current.position, "y", targetY, 0.5, delta);
      cameraRef.current.lookAt(0, 0, 0);
    }
  });

  return (
    <>
      <group>
        <PerspectiveCamera
          ref={cameraRef}
          makeDefault
          position={[0, 0, 4]}
          fov={110}
          far={100}
        />

        <Particles />

        <LightRays />
      </group>
    </>
  )
}

export default Experience

export const Particles = () => {
  const pointsRef = useRef();
  const hasEntered = useEnterState(state => state.hasEntered);

  const count = Math.pow(56, 2);
  const waveLength = Math.PI * 2 * 2;
  const xMin = -waveLength / 2;
  const xMax = waveLength / 2;

  const aColors = useMemo(() => {
    const COLOUR_COUNT = 100
    const palette = []

    for (let i = 0; i < COLOUR_COUNT * 0.4; i++) {
      const h = 30 + Math.random() * 10
      const s = 60 + Math.random() * 10
      const l = 50 + Math.random() * 10
      // palette.push(hslToHex(h, s, l))
      palette.push(new THREE.Color().setHSL(h / 360, s / 100, l / 100))
    }

    for (let i = 0; i < COLOUR_COUNT * 0.25; i++) {
      const h = 10 + Math.random() * 10
      const s = 60 + Math.random() * 10
      const l = 65 + Math.random() * 10
      // palette.push(hslToHex(h, s, l))
      palette.push(new THREE.Color().setHSL(h / 360, s / 100, l / 100))
    }

    for (let i = 0; i < COLOUR_COUNT * 0.35; i++) {
      const h = 40 + Math.random() * 8
      const s = 10 + Math.random() * 10
      const l = 65 + Math.random() * 5
      // palette.push(hslToHex(h, s, l))
      palette.push(new THREE.Color().setHSL(h / 360, s / 100, l / 100))
    }

    const colorObjects = palette.map(hex => new THREE.Color(hex))

    const colorAttributeArray = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const color = colorObjects[Math.floor(Math.random() * COLOUR_COUNT)]
      colorAttributeArray.set([color.r, color.g, color.b], i * 3)
    }

    return colorAttributeArray;
  }, [count]);

  const positions = useMemo(() => {
    const pos = [];
    const frequency = 1.8;
    for (let i = 0; i < count; i++) {
      const x = (xMin + (i / count) * (xMax - xMin));
      const y = Math.sin(x * frequency);
      const z = (Math.random() - 0.5) * 15;
      pos.push(x, y, z);
    }
    return new Float32Array(pos);
  }, [count]);

  const seeds = useMemo(() => {
    const s = [];
    for (let i = 0; i < count; i++) {
      s.push(Math.random() * 2.0 - 1.0);
    }
    return new Float32Array(s);
  }, [count]);

  const particlesUniforms = useMemo(() => ({
    uTime: new THREE.Uniform(0),
    uSize: new THREE.Uniform(50.0),
    uProgress: new THREE.Uniform(0.0),
    uPixelRatio: new THREE.Uniform(Math.min(window.devicePixelRatio, 2)),
    uResolution: new THREE.Uniform(new THREE.Vector2(window.innerWidth, window.innerHeight)),
  }), []);

  useGSAP(() => {
    if (!hasEntered) return;

    gsap.to(particlesUniforms.uProgress, {
      value: 1.0,
      duration: 2.0,
      ease: "power3.inOut",
      delay: 0.0,
    });
  }, { dependencies: [hasEntered] });

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.material.uniforms.uTime.value = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <group rotation-z={(Math.PI / 180) * 15} position-y={-0.95}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-aSeed"
            count={seeds.length}
            array={seeds}
            itemSize={1}
          />
          <bufferAttribute
            attach="attributes-aColor"
            count={aColors.length / 3}
            array={aColors}
            itemSize={3}
          />
        </bufferGeometry>
        <shaderMaterial
          uniforms={particlesUniforms}
          vertexShader={particlesVertex}
          fragmentShader={particlesFragment}
          transparent={true}
          depthWrite={false}
          depthTest={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}

export function LightRays() {
  const materialRef = useRef();
  const hasEntered = useEnterState(state => state.hasEntered);

  const rayUniforms = useMemo(() => ({
    uColor: new THREE.Uniform(new THREE.Color(1, 1, 1)),
    uIntensity: new THREE.Uniform(0.4),
    uOpacity: new THREE.Uniform(1.0),
    uTime: new THREE.Uniform(0.0),
    uProgress: new THREE.Uniform(0.0),
  }), []);

  useGSAP(() => {
    if (!hasEntered) return;

    gsap.to(rayUniforms.uProgress, {
      value: 1.0,
      duration: 2.0,
      ease: "power3.inOut",
      delay: 2.0,
    });
  }, { dependencies: [hasEntered] });

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = time;
      materialRef.current.uniforms.uOpacity.value = 0.85 + Math.sin(time * 0.5) * 0.1;
    }
  });

  return (
    <mesh position={[0, 0, -1]} scale={[8, 8, 1]}>
      <planeGeometry args={[2.2, 2.2]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={rayUniforms}
        vertexShader={lightRaysVertex}
        fragmentShader={lightRaysFragment}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  )
}