const particlesVertex = `
uniform float uTime;
uniform float uSize;
uniform float uProgress;
uniform float uPixelRatio;
uniform vec2 uResolution;

attribute vec3 aColor;
attribute float aSeed;

varying vec3 vColor;
varying float vSeed;
varying float vOpacity;
varying float vZ;

void main() {
  vec3 pos = position;

  // float frequency = 2.0;
  // pos.y += sin(pos.x * frequency) * 0.5;
  pos.y += aSeed * 1.1;
  pos.z += aSeed * 0.9;

  // Slight float animation
  pos.x += sin(uTime + pos.y + pos.z) * 0.2;
  pos.y += sin(uTime + aSeed * 10.0) * 0.25;
  pos.z += cos(uTime + aSeed * 10.0) * 0.1;

  // Initial position animation
  vec3 init = pos;
  init.y += 1.0;
  init.z += 10.0;
  pos = mix(init, pos, uProgress);

  // Flicker logic
  float offset = fract(sin(dot(vec2(aSeed, aSeed * 13.37), vec2(12.9898, 78.233))) * 43758.5453);
  float period = mix(1.0, 5.0, abs(aSeed));
  float tCycle = mod(uTime + offset * period, period);
  float flickerDuration = period * .3;
  float flickerIn = smoothstep(0.0, flickerDuration, tCycle);
  float flickerOut = 1.0 - smoothstep(period - flickerDuration, period, tCycle);
  vOpacity = flickerIn * flickerOut;

  vSeed = aSeed;
  vColor = aColor;

  vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  gl_Position = projectedPosition;

  float size = aSeed > 0.98 ? 2.0 : aSeed < 0.05 ? 1.0 : mix(1.0, 2.0, abs(aSeed));
  gl_PointSize = mix(uSize / 1.5, uSize, uProgress) * size * 0.0007 * uResolution.y * uPixelRatio;
  gl_PointSize *= (1.0 / -viewPosition.z);

  vZ = viewPosition.z; // Pass z position to fragment shader for depth-based color
}`

export default particlesVertex