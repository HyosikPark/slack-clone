const path = require('path');

module.exports = {
  stories: ['../**/*.stories.mdx', '../**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  webpackFinal: async (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@hooks': path.resolve(__dirname, '../hooks'),
      '@components': path.resolve(__dirname, '../components'),
      '@layouts': path.resolve(__dirname, '../layouts'),
      '@pages': path.resolve(__dirname, '../pages'),
      '@utils': path.resolve(__dirname, '../utils'),
      '@typings': path.resolve(__dirname, '../typings'),
    };
    return config;
  },
};
