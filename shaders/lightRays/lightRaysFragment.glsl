uniform float uTime;
uniform float uProgress;
uniform vec3 uColor;
uniform float uIntensity;
uniform float uOpacity;

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

  for(int i = 0; i < NUM_RAYS; i++) {
    float idx = float(i);
    float offset = sin(uTime * 0.4 + idx * 3.14) * 0.1; // animation
    float angle = -1.75 + idx / float(NUM_RAYS - 1) * 0.5 + offset;

    float width = mix(0.1, 0.5, rand(idx)); // varying thickness
    float intensity = mix(0.3, 1.0, rand(idx + 1.0)); // varying brightness
    rays += lineRay(dir, angle, width) * intensity;
  }

  float falloff = smoothstep(1.0, 0.0, dist); // fade away from origin
  float alpha = rays * falloff * uIntensity * mix(0.0, uOpacity, uProgress);

  gl_FragColor = vec4(uColor, alpha);
}