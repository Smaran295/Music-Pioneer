// api/proxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = async function (req, res) {
    const proxy = createProxyMiddleware({
        target: 'https://annonymous-sage.vercel.app',
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
    });
    proxy(req, res);
};
