// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  devServer: (devServerConfig) => {
    return {
      ...devServerConfig,
      proxy: {
        '/api': 'http://localhost:4001',
      },
    };
  },
};
