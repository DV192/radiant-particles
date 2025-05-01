"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
// import { OrbitControls, Stats } from "@react-three/drei";

import Experience from "./Experience";
// import { Perf } from "r3f-perf";

const CanvasRenderer = () => {

  return (
    <div className="w-full h-full fixed inset-0">
      <Canvas>
        {/* <Perf />
        <Stats /> */}
        {/* <OrbitControls
          makeDefault
          enableZoom={true}
          enablePan={false}
        /> */}
        <color attach="background" args={["#12141F"]} />

        <Suspense fallback={null}>
          <Experience />
        </Suspense>
      </Canvas>
    </div >
  )
}

export default CanvasRenderer