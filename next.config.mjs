/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    useSwcCss: true,
    rules: {
      '*.{glsl,vs,fs,vert,frag}': {
        loaders: ['raw-loader', 'glslify-loader'],
        as: '*.js',
      },
    },
  },
};

export default nextConfig;
