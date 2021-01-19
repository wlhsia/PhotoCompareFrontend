module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:5000/",
        changeOrigin: true,
        pathRewrite: {
          "^/api": ""
        },
        proxyTimeout: 1000 * 60 * 60,
        timeout: 1000 * 60 * 60
      },
    }
  },
};