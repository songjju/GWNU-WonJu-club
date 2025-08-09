// frontend/config-overrides.js
// react-app-rewired를 위한 webpack 설정 오버라이드

const webpack = require('webpack');

module.exports = function override(config, env) {
  // 기존 폴리필 설정
  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    "crypto": require.resolve("crypto-browserify"),
    "stream": require.resolve("stream-browserify"),
    "assert": require.resolve("assert"),
    "http": require.resolve("stream-http"),
    "https": require.resolve("https-browserify"),
    "os": require.resolve("os-browserify"),
    "url": require.resolve("url"),
    // 🔥 process 관련 모듈 해석 문제 해결
    "process": require.resolve("process/browser.js")
  });
  config.resolve.fallback = fallback;
  
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser.js',
      Buffer: ['buffer', 'Buffer']
    })
  ]);

  // 🔥 CSS Minimizer 오류 해결을 위한 추가 설정
  if (env === 'production') {
    // CSS Minimizer 플러그인 제거
    config.optimization.minimizer = config.optimization.minimizer.filter(
      plugin => plugin.constructor.name !== 'CssMinimizerPlugin'
    );
    
    console.log('CSS Minimizer plugin disabled to prevent build errors');
  }
  
  return config;
};