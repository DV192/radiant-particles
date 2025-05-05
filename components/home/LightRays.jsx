import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import lightRaysFragment from '../../shaders/lightRays/lightRaysFragment.glsl';
import lightRaysVertex from '../../shaders/lightRays/lightRaysVertex.glsl';

import useEnterState from "@/hooks/useEnterState";

gsap.registerPlugin(useGSAP);

const LightRays = () => {
  const materialRef = useRef();
  const hasEntered = useEnterState(state => state.hasEntered);

  const rayUniforms = useMemo(() => ({
    uTime: new THREE.Uniform(0.0),
    uProgress: new THREE.Uniform(0.0),
    uColor: new THREE.Uniform(new THREE.Color(1, 1, 1)),
    uIntensity: new THREE.Uniform(0.4),
    uOpacity: new THREE.Uniform(1.0),
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

export default LightRays