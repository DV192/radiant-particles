"use client";

import { Suspense, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Loader, OrbitControls, Stats } from "@react-three/drei";

import Experience from "./Experience";
import { Perf } from "r3f-perf";
// import { DepthOfField, EffectComposer, GodRays } from "@react-three/postprocessing";
// import { BlendFunction, Resizer, KernelSize } from "postprocessing";

const CanvasRenderer = () => {
  // const sunRef = useRef(null);
  // const [sunRef, setSunRef] = useState();

  return (
    <div className="w-full h-full fixed inset-0">
      <Canvas>
        <Perf />
        <Stats />
        <OrbitControls
          makeDefault
          enableZoom={true}
          enablePan={false}
        />
        <color attach="background" args={["#12141F"]} />

        {/* <ambientLight intensity={0.5} /> */}
        {/* <ambientLight intensity={4} /> */}
        {/* <directionalLight position={[-4, 4, 4]} intensity={1} color="#AE9F9D" /> */}

        <Suspense fallback={null}>
          <Experience />
        </Suspense>
      </Canvas>
      {/* <Loader /> */}
    </div >
  )
}

export default CanvasRenderer