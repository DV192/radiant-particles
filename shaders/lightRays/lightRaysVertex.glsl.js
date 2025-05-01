const lightRaysVertex = `
uniform float uTime;
varying vec2 vUv;

void main() {
  vUv = uv;

  // Optional: slight distortion to simulate wave (you can also keep it simple)
  vec3 pos = position;
  pos.x += 0.01 * sin(uv.y * 10.0 + uTime * 0.5);
  pos.y += 0.01 * sin(uv.x * 12.0 + uTime);

  gl_Position = vec4(pos, 1.0);
}`

export default lightRaysVertex