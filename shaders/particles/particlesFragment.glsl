varying vec3 vColor;
varying float vSeed;
varying float vOpacity;
varying float vZ;

void main() {
  // Circular mask
  vec2 uv = gl_PointCoord - vec2(0.5);
  float dist = length(uv); // 0 at center, 0.5 at edge of point

  float sharpCircle = step(0.5, dist);
  float softCircle = smoothstep(0.0, 0.5, dist);

  // Depth-based softness curve
  float softness = 0.0;
  if(vZ > -8.0) {
    softness = smoothstep(-6.0, -2.5, vZ); // Near = blurry
  } else if(vZ < -8.0) {
    softness = 1.0 - smoothstep(-9.0, -6.0, vZ); // Near = blurry
  }

  // fade out near the camera
  float fade = 1.0;
  if(vZ < -0.25 && vZ > -1.0) {
    fade = smoothstep(-0.25, -1.0, vZ); // Fade out
  }

  if(vZ > -0.25)
    discard;

  // Only blend if softness > 0
  float circle = mix(1.0 - sharpCircle, 1.0 - softCircle, softness);

  // Final alpha
  float alpha = circle * vOpacity * fade;

  gl_FragColor = vec4(vColor, alpha);
}