import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Backdrop, Environment, PerspectiveCamera, Sphere } from "@react-three/drei";
import { extend, useFrame, useThree } from "@react-three/fiber";
import { useControls } from "leva";
import { EffectComposer, RenderPass, ShaderPass, UnrealBloomPass } from 'three-stdlib';
import { Gradient, LayerMaterial } from "lamina";
import { easing } from "maath";

extend({ EffectComposer, ShaderPass, RenderPass, UnrealBloomPass });

const Experience = () => {
  const cameraRef = useRef();
  const mouse = useRef(new THREE.Vector2(0.0, 0.0));
  useMouse(mouse);
  
  useFrame((state, delta) => {
    if (cameraRef.current && mouse.current) {
      easing.damp(cameraRef.current.position, "x", mouse.current.x * 0.5, 0.5, delta);
      easing.damp(cameraRef.current.position, "y", -mouse.current.y * 0.5, 0.5, delta);
      cameraRef.current.lookAt(0, 0, 0);
    }
  });

  return (
    <>
      {/* <Background /> */}
      <group>

        <PerspectiveCamera
          ref={cameraRef}
          makeDefault
          position={[0, 0, 4]}
          fov={45}
          far={100}
        />

        <Particles />
        {/* <InstancedParticles /> */}
        {/* <ParticleSpritePoints /> */}

        <LightRays />
        {/* <LightRaysCone /> */}
        {/* <Lighting /> */}
        {/* <ComposerPass /> */}
      </group>
    </>
  )
}

export default Experience

export const Particles = () => {
  const pointsRef = useRef()

  const count = Math.pow(56, 2)
  const waveLength = Math.PI * 2 * 2
  const xMin = -waveLength / 2
  const xMax = waveLength / 2

  function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }

  const colors = useMemo(() => {
    const COLOUR_COUNT = 100
    // 1. Generate base palette (from earlier)
    const palette = []

    for (let i = 0; i < COLOUR_COUNT * 0.25; i++) {
      const h = 20 + Math.random() * 10
      const s = 60 + Math.random() * 10
      const l = 40 + Math.random() * 10
      // palette.push(hslToHex(h, s, l))
      palette.push(new THREE.Color().setHSL(h / 360, s / 100, l / 100))
    }

    for (let i = 0; i < COLOUR_COUNT * 0.75; i++) {
      const h = 30 + Math.random() * 8
      const s = 30 + Math.random() * 10
      const l = 65 + Math.random() * 5
      // palette.push(hslToHex(h, s, l))
      palette.push(new THREE.Color().setHSL(h / 360, s / 100, l / 100))
    }

    // 2. Convert to THREE.Color instances
    const colorObjects = palette.map(hex => new THREE.Color(hex))

    // 3. Fill a Float32Array of PARTICLE_COUNT * 3
    const colorAttributeArray = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      // Option 1: Random mapping
      const color = colorObjects[Math.floor(Math.random() * COLOUR_COUNT)]

      // Option 2: Evenly distributed
      // const color = colorObjects[i % COLOUR_COUNT]

      colorAttributeArray.set([color.r, color.g, color.b], i * 3)
    }

    return colorAttributeArray;
  }, [count])


  const positions = useMemo(() => {
    const pos = []
    for (let i = 0; i < count; i++) {
      const x = xMin + (i / count) * (xMax - xMin)
      const y = 0
      const z = (Math.random() - 0.5) * 12
      pos.push(x, y, z)
    }
    return new Float32Array(pos)
  }, [count])

  const seeds = useMemo(() => {
    const s = []
    for (let i = 0; i < count; i++) {
      s.push(Math.random() * 2.0 - 1.0)
    }
    return new Float32Array(s)
  }, [count])

  const particlesUniforms = useMemo(() => {
    return {
      uTime: { value: 0 },
      uSize: { value: 60.0 },
      // uColors: { value: fireflyColors },
    }
  }, [])

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.material.uniforms.uTime.value = state.clock.elapsedTime * 0.5
    }
  })

  return (
    <group rotation-z={(Math.PI / 180) * 25}>
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
            attach="attributes-color"
            count={colors.length / 3}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <shaderMaterial
          uniforms={particlesUniforms}
          vertexShader={/* glsl */ `
            uniform float uTime;
            uniform float uSize;
            // uniform vec3 uColors[10];

            attribute vec3 color;
            attribute float aSeed;
            
            varying vec3 vColor;
            varying float vSeed;
            varying float vOpacity;
            varying float vZ;

            // vec3 hashColor(float index) {
            //   float i = mod(sin(index) * 43758.5453, 1.0);
            //   float colorIndex = floor(i * 10.0); // 👈 also updated
            //   return uColors[int(colorIndex)];
            // }

            void main() {
              vec3 pos = position;

              float frequency = 2.0;
              pos.y += sin(pos.x * frequency) * 0.5;
              pos.y += aSeed * 0.9;
              pos.z += aSeed * 0.9;

              // Slight float animation
              pos.x += sin(uTime + pos.y + pos.z) * 0.05;
              pos.y += sin(uTime + aSeed * 10.0) * 0.1;
              pos.z += cos(uTime + aSeed * 10.0) * 0.05;
              
              // Flicker logic
              float offset = fract(sin(dot(vec2(aSeed, aSeed * 13.37), vec2(12.9898,78.233))) * 43758.5453);
              float period = mix(1.0, 10.0, abs(aSeed));
              float tCycle = mod(uTime + offset * period, period);
              float flickerDuration = period * .3;
              float flickerIn = smoothstep(0.0, flickerDuration, tCycle);
              float flickerOut = 1.0 - smoothstep(period - flickerDuration, period, tCycle);
              vOpacity = flickerIn * flickerOut;

              vSeed = aSeed;
              vColor = color;

              // // Rare soft white override (like TSL's seed > 0.99)
              // if (aSeed > 0.99) {
              //   vColor = vec3(0.843, 0.835, 0.820); // #D7D5D1
              // } else {
              //   vColor = hashColor(float(aSeed));
              // }

              vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
              vec4 viewPosition = viewMatrix * modelPosition;
              vec4 projectedPosition = projectionMatrix * viewPosition;
              gl_Position = projectedPosition;

              float size = aSeed > 0.98 ? 2.0 : aSeed < 0.05 ? 1.0 : mix(1.0, 2.0, abs(aSeed));
              gl_PointSize = uSize * size * (1.0 / -viewPosition.z);

              vZ = viewPosition.z; // Pass z position to fragment shader for depth-based color
            }
          `}
          fragmentShader={/* glsl */ `
            varying vec3 vColor;
            varying float vSeed;
            varying float vOpacity;
            varying float vZ;

            float exponentialEasing(float x, float a) {
              float epsilon = 0.00001;
              float min_param_a = 0.0 + epsilon;
              float max_param_a = 1.0 - epsilon;
              a = max(min_param_a, min(max_param_a, a));
            
              if(a < 0.5) {
                // emphasis
                a = 2.0 * (a);
                float y = pow(x, a);
                return y;
              } else {
                // de-emphasis
                a = 2.0 * (a - 0.5);
                float y = pow(x, 1.0 / (1.0 - a));
                return y;
              }
            }

            void main() {
              // Circular mask
              vec2 uv = gl_PointCoord - vec2(0.5);
              float dist = length(uv); // 0 at center, 0.5 at edge of point

              float sharpCircle = step(0.5, dist);
              float softCircle = smoothstep(0.0, 0.5, dist);

              // Depth-based softness curve
              float softness = 0.0;
              if (vZ > -7.0) {
                softness = smoothstep(-7.0, -2.5, vZ); // Near = blurry
              } else if(vZ < -8.0) {
                softness = 1.0 - smoothstep(-9.0, -8.0, vZ); // Near = blurry
              }

              // if(vZ > -0.25) discard;

              // Only blend if softness > 0
              float circle = mix(1.0 - sharpCircle, 1.0 - softCircle, softness);

              // Final alpha
              float alpha = circle * vOpacity;

              gl_FragColor = vec4(vColor, alpha);
            }
          `}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}

const InstancedParticles = () => {
  const meshRef = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const count = Math.pow(56, 2)

  const seeds = useMemo(() => {
    return new Float32Array(count).map(() => Math.random() * 2.0 - 1.0)
  }, [count])

  const colorPalette = useMemo(() => {
    const colors = []
    const COLOUR_COUNT = 100

    for (let i = 0; i < COLOUR_COUNT * 0.25; i++) {
      const h = 20 + Math.random() * 10
      const s = 60 + Math.random() * 10
      const l = 40 + Math.random() * 10
      colors.push(new THREE.Color().setHSL(h / 360, s / 100, l / 100))
    }

    for (let i = 0; i < COLOUR_COUNT * 0.75; i++) {
      const h = 30 + Math.random() * 8
      const s = 30 + Math.random() * 10
      const l = 65 + Math.random() * 5
      colors.push(new THREE.Color().setHSL(h / 360, s / 100, l / 100))
    }

    return colors
  }, [])

  const colorArray = useMemo(() => {
    const arr = []
    for (let i = 0; i < count; i++) {
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)]
      arr.push(color)
    }
    return arr
  }, [count, colorPalette])

  const positions = useMemo(() => {
    const arr = []
    const waveLength = Math.PI * 2 * 2
    const xMin = -waveLength / 2
    const xMax = waveLength / 2
    for (let i = 0; i < count; i++) {
      const x = xMin + (i / count) * (xMax - xMin)
      const y = Math.sin(x + 2.0) * 0.5
      const z = (Math.random() - 0.5) * 5
      arr.push([x, y, z])
    }
    return arr
  }, [count])

  useFrame((state) => {
    const time = state.clock.elapsedTime

    for (let i = 0; i < count; i++) {
      const seed = seeds[i]
      const basePos = positions[i]

      const velX = Math.sin(time + basePos[1] + basePos[2]) * 0.05
      const velY = Math.sin(time + seed * 10.0) * 0.05
      const velZ = Math.cos(time + seed * 10.0) * 0.05

      dummy.position.set(
        basePos[0] + velX,
        basePos[1] + velY + seed * 0.3,
        basePos[2] + velZ + seed * 0.3
      )

      dummy.scale.setScalar(0.2 + Math.abs(seed * 0.05))
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)

      const color = colorArray[i]
      meshRef.current.setColorAt(i, color)
    }

    meshRef.current.instanceMatrix.needsUpdate = true
    meshRef.current.instanceColor.needsUpdate = true
  })

  return (
    <>
      {/* <ambientLight intensity={0.6} />
      <directionalLight
        position={[5, 10, 3]}
        intensity={1}
        color="#fff"
        castShadow
      /> */}

      <group rotation-z={(Math.PI / 180) * 25} position-y={-0.5}>
        <instancedMesh ref={meshRef} args={[null, null, count]}>
          <sphereGeometry args={[0.05, 6, 6]} />
          <meshStandardMaterial
            roughness={0.4}
            metalness={0.1}
            transparent
            opacity={0.85}
            toneMapped={false}
          />
        </instancedMesh>
      </group>
    </>
  )
}

const ParticleSpritePoints = () => {
  const pointsRef = useRef()
  const count = Math.pow(56, 2)

  const seeds = useMemo(() => {
    return new Float32Array(count).map(() => Math.random() * 2.0 - 1.0)
  }, [count])

  const colorPalette = useMemo(() => {
    const colors = []
    const COLOUR_COUNT = 100

    for (let i = 0; i < COLOUR_COUNT * 0.25; i++) {
      const h = 20 + Math.random() * 10
      const s = 60 + Math.random() * 10
      const l = 40 + Math.random() * 10
      colors.push(new THREE.Color().setHSL(h / 360, s / 100, l / 100))
    }

    for (let i = 0; i < COLOUR_COUNT * 0.75; i++) {
      const h = 30 + Math.random() * 8
      const s = 30 + Math.random() * 10
      const l = 65 + Math.random() * 5
      colors.push(new THREE.Color().setHSL(h / 360, s / 100, l / 100))
    }

    return colors
  }, [])

  const positions = useMemo(() => {
    const arr = []
    const waveLength = Math.PI * 2 * 2
    const xMin = -waveLength / 2
    const xMax = waveLength / 2
    for (let i = 0; i < count; i++) {
      const x = xMin + (i / count) * (xMax - xMin)
      const y = Math.sin(x + 2.0) * 0.5
      const z = (Math.random() - 0.5) * 5
      arr.push(x, y, z)
    }
    return new Float32Array(arr)
  }, [count])

  const colors = useMemo(() => {
    const arr = []
    for (let i = 0; i < count; i++) {
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)]
      arr.push(color.r, color.g, color.b)
    }
    return new Float32Array(arr)
  }, [count, colorPalette])

  const velocities = useMemo(() => {
    return new Float32Array(count).map(() => Math.random() * 2.0 - 1.0)
  }, [count])

  // useFrame((state) => {
  //   const time = state.clock.elapsedTime
  //   const pos = pointsRef.current.geometry.attributes.position.array

  //   for (let i = 0; i < count; i++) {
  //     const seed = seeds[i]
  //     const i3 = i * 3

  //     const velX = Math.sin(time + pos[i3 + 1] + pos[i3 + 2]) * 0.05
  //     const velY = Math.sin(time + seed * 10.0) * 0.05
  //     const velZ = Math.cos(time + seed * 10.0) * 0.05

  //     pos[i3] += velX
  //     pos[i3 + 1] += velY + seed * 0.01
  //     pos[i3 + 2] += velZ + seed * 0.01
  //   }

  //   pointsRef.current.geometry.attributes.position.needsUpdate = true
  // })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          array={colors}
          count={colors.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

function ComposerPass() {
  const { scene, camera, gl, size } = useThree();
  const composer = useRef();
  const shaderPassRef = useRef();

  const shaderPassVertex = /* glsl */`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;
  const shaderPassFragment = /* glsl */`
    uniform sampler2D tDiffuse;
    uniform vec2 uResolution;
    uniform float blurRadius;
    varying vec2 vUv;

    void main() {
      vec2 sampleOffset = vec2(1.0 / uResolution.x, 1.0 / uResolution.y);
      vec4 color = vec4(0.0);
      for (int i = -int(blurRadius); i <= int(blurRadius); i++) {
          float weight = 1.0 - abs(float(i) / blurRadius);
          color += texture2D(tDiffuse, vUv + sampleOffset * float(i)) * weight;
      }
      gl_FragColor = color;
    }
  `;

  useEffect(() => {
    const composerInstance = new EffectComposer(gl);
    composer.current = composerInstance;

    const renderPass = new RenderPass(scene, camera);
    composer.current.addPass(renderPass);

    // Custom Shader Pass
    const myEffect = {
      transparent: true,
      depthTest: false,
      uniforms: {
        tDiffuse: new THREE.Uniform(null),
        uResolution: new THREE.Uniform(new THREE.Vector2(1.0, window.innerHeight / window.innerWidth)),
        uGlitchIntensity: new THREE.Uniform(0.009),
        blurRadius: { value: 5.0 },
      },
      vertexShader: shaderPassVertex,
      fragmentShader: shaderPassFragment,
    };

    // const shaderPass = new ShaderPass(myEffect);
    // shaderPassRef.current = shaderPass;

    const unrealBloomPass = new UnrealBloomPass(
      new THREE.Vector2(size.width, size.height),
      0.5,  // intensity
      0.9,     // radius
      0.1   // threshold
    );
    composerInstance.addPass(unrealBloomPass);

    composer.current.renderToScreen = true;
    // composer.current.addPass(shaderPass);

    // Resize event
    const handleResize = () => {
      composer.current.setSize(size.width, size.height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [scene, camera, gl, size]);

  // Render the scene through the composer in each frame
  useFrame(() => {
    if (composer.current) {
      composer.current.render();
    }
  }, 1.0);  // Run after the default render pass

  return null;
}

const Background = () => {
  const start = 0.2;
  const end = -0.5;

  const backgroundColors = useRef({
    colorA: "#000",
    colorB: "#6c6c6c",
  });

  const gradientRef = useRef();
  const gradientEnvRef = useRef();

  useFrame(() => {
    gradientRef.current.colorA = new THREE.Color(
      backgroundColors.current.colorA
    );
    gradientRef.current.colorB = new THREE.Color(
      backgroundColors.current.colorB
    );
    gradientEnvRef.current.colorA = new THREE.Color(
      backgroundColors.current.colorA
    );
    gradientEnvRef.current.colorB = new THREE.Color(
      backgroundColors.current.colorB
    );
  });

  return (
    <>
      <Sphere scale={[500, 500, 500]} rotation-y={Math.PI / 2}>
        <LayerMaterial color={"#ffffff"} side={THREE.BackSide}>
          <Gradient ref={gradientRef} axes={"y"} start={start} end={end} />
        </LayerMaterial>
      </Sphere>
      <Environment resolution={256} frames={Infinity}>
        <Sphere
          scale={[100, 100, 100]}
          rotation-y={Math.PI / 2}
          rotation-x={Math.PI}
        >
          <LayerMaterial color={"#ffffff"} side={THREE.BackSide}>
            <Gradient ref={gradientEnvRef} axes={"y"} start={start} end={end} />
          </LayerMaterial>
        </Sphere>
      </Environment>
    </>
  );
};

export const Lighting = () => {
  const scene = useThree((s) => s.scene)
  const light = useRef(null)

  const lightIntensity = useRef({ value: 0 })

  useEffect(() => {
    const setupLightTarget = () => {
      if (!scene || !light.current) return
      const targetObject = new THREE.Object3D()
      targetObject.position.set(24, -4, 2)
      scene.add(targetObject)
      light.current.target = targetObject
    }
    setupLightTarget()
  }, [scene])

  return (
    <>
      <ambientLight intensity={4} />
      <directionalLight ref={light} position={[-4, 4, 4]} intensity={5} color="#AE9F9D" />
    </>
  )
}

export function LightRays() {
  const materialRef = useRef();

  const rayUniforms = useMemo(() => {
    return {
      uColor: { value: new THREE.Color(1, 1, 1) },
      uIntensity: { value: 0.4 },
      uOpacity: { value: 1.0 },
      uTime: { value: 0 },
    };
  }, []);

  const vertexShader = /* glsl */`
    uniform float uTime;
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
    
      // Optional: slight distortion to simulate wave (you can also keep it simple)
      vec3 pos = position;
      pos.x += 0.01 * sin(uv.y * 10.0 + uTime * 0.5);
      pos.y += 0.01 * sin(uv.x * 12.0 + uTime);
    
      gl_Position = vec4(pos, 1.0);
    }
  `;

  // Fragment Shader
  const fragmentShader = /* glsl */`
    uniform vec3 uColor;
    uniform float uIntensity;
    uniform float uOpacity;
    uniform float uTime;
    varying vec2 vUv;
    
    float lineRay(vec2 dir, float angle, float width) {
      float a = atan(dir.y, dir.x);
      float d = abs(mod(a - angle + 3.14159, 6.28318) - 3.14159);
      return smoothstep(width, 0.0, d);
    }
    
    float rand(float x) {
      return fract(sin(x * 12.9898) * 43758.5453);
    }
    
    void main() {
      vec2 origin = vec2(0.2, 1.2); // Off-screen top-left
      vec2 dir = normalize(vUv - origin);
      float dist = distance(vUv, origin) * 0.85;
    
      float rays = 0.0;
      const int NUM_RAYS = 5;
    
      for (int i = 0; i < NUM_RAYS; i++) {
        float idx = float(i);
        float offset = sin(uTime * 0.4 + idx * 3.14) * 0.1; // animation
        float angle = -1.75 + idx / float(NUM_RAYS - 1) * 0.5 + offset;
    
        float width = mix(0.1, 0.5, rand(idx)); // varying thickness
        float intensity = mix(0.3, 1.0, rand(idx + 1.0)); // varying brightness
        rays += lineRay(dir, angle, width) * intensity;
      }
    
      float falloff = smoothstep(1.0, 0.0, dist); // fade away from origin
      float alpha = rays * falloff * uIntensity * uOpacity;
    
      gl_FragColor = vec4(uColor, alpha);
    }
  `;

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = time;
      materialRef.current.uniforms.uOpacity.value = 0.85 + Math.sin(time * 0.5) * 0.1;
    }
  })

  return (
    <mesh position={[0, 0, -1]} scale={[8, 8, 1]}>
      <planeGeometry args={[2.2, 2.2]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={rayUniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  )
}

export function LightRaysCone() {
  const materialRef = useRef();

  const rayUniforms = useMemo(() => {
    return {
      uColor: { value: new THREE.Color(1, 1, 1) },
      uIntensity: { value: 0.4 },
      uOpacity: { value: 1.0 },
      uTime: { value: 0 },
    };
  }, []);

  const vertexShader = /* glsl */`
    uniform float uTime;
    varying vec3 vPosition;
    varying vec2 vUv;

    void main() {
      vUv = uv;
      vPosition = position;

      vec3 pos = position;
      pos.x += 0.02 * sin(uv.y * 10.0 + uTime * 0.5);
      pos.y += 0.01 * sin(uv.x * 12.0 + uTime);

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  const fragmentShader = /* glsl */`
    uniform vec3 uColor;
    uniform float uIntensity;
    uniform float uOpacity;
    uniform float uTime;

    varying vec3 vPosition;
    varying vec2 vUv;

    float rand(float x) {
      return fract(sin(x * 12.9898) * 43758.5453);
    }

    void main() {
      float rays = 0.0;
      const int NUM_RAYS = 5;

      float angleBase = atan(vPosition.x, vPosition.z);
      float dist = length(vPosition.xy);

      for (int i = 0; i < NUM_RAYS; i++) {
        float idx = float(i);
        float offset = sin(uTime * 0.4 + idx * 3.14) * 0.2;
        float angle = -1.0 + idx / float(NUM_RAYS - 1) * 2.0 + offset;

        float d = abs(mod(angleBase - angle + 3.14159, 6.28318) - 3.14159);
        float width = mix(0.1, 0.9, rand(idx));
        float strength = smoothstep(width, 0.0, d);

        rays += strength * mix(0.3, 1.0, rand(idx + 1.0));
      }

      float falloff = smoothstep(1.5, 0.0, dist);
      float alpha = rays * falloff * uIntensity * uOpacity;
      float edgeFade = smoothstep(1.0, 0.0, length(vUv - 0.5));
      alpha *= edgeFade;
      float depthFade = smoothstep(10.0, 5.0, abs(vPosition.z));
      alpha *= depthFade;
      
      gl_FragColor = vec4(uColor, alpha);
    }
  `;

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = time;
      materialRef.current.uniforms.uOpacity.value = 0.85 + Math.sin(time * 0.5) * 0.1;
    }
  });

  return (
    <mesh rotation={[0, 0, (Math.PI / 180) * 15]} position={[-2, 0.5, -1]}>
      {/* height = 3, radius = 2, segments = 64 */}
      <coneGeometry args={[2, 10, 128, 1, true]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={rayUniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

const useMouse = (ref) => {
  useEffect(() => {
    const handleMouseMove = (e) => {
      const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      const mouseY = -(e.clientY / window.innerHeight) * 2 + 1;

      if (ref.current) {
        ref.current.x = mouseX;
        ref.current.y = -mouseY;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    // clear-up function
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return ref;
}

