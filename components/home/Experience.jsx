import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { easing } from "maath";

import useMouse from "@/hooks/useMouse";
import Particles from "./Particles";
import LightRays from "./LightRays";

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