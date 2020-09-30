// vue.config.js

// module.exports = {
//     publicPath: '/<repo>/'
//   }

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/production-sub-path/'
    : '/',
  devServer: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:5000/",
        changeOrigin: true,
        pathRewrite: {
          "^/api": ""
        }
      },
    }
  },
};