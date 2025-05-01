/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      rules: {
        '*.{glsl,vs,fs,vert,frag}': {
          loaders: ['raw-loader', 'glslify-loader'],
          as: '*.js',
        },
      },
    },
  },
};

export default nextConfig;
