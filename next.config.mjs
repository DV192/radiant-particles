/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      useSwcCss: true,
      rules: {
        '*.{glsl,vs,fs,vert,frag}': {
          loaders: ['raw-loader'],
          as: '*.js',
        },
      },
    },
  },
};

export default nextConfig;
