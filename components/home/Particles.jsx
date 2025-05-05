import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import particlesFragment from '../../shaders/particles/particlesFragment.glsl';
import particlesVertex from '../../shaders/particles/particlesVertex.glsl';

import useEnterState from "@/hooks/useEnterState";

gsap.registerPlugin(useGSAP);

const Particles = () => {
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
    uTime: new THREE.Uniform(0.0),
    uPixelRatio: new THREE.Uniform(Math.min(window.devicePixelRatio, 2)),
    uResolution: new THREE.Uniform(new THREE.Vector2(window.innerWidth, window.innerHeight)),
    uSize: new THREE.Uniform(50.0),
    uProgress: new THREE.Uniform(0.0),
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

export default Particles