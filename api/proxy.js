const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = async (req, res) => {
  const proxy = createProxyMiddleware({
    target: 'https://annonymous-sage.vercel.app',
    changeOrigin: true,
    pathRewrite: {
      '^/api': '' // Remove /api from the request path
    },
    onProxyReq: (proxyReq, req, res) => {
      // Ensure the query string is forwarded correctly
      if (req.query && Object.keys(req.query).length > 0) {
        const queryString = new URLSearchParams(req.query).toString();
        proxyReq.path += `?${queryString}`;
      }
    },
    onError: (err, req, res) => {
      console.error('Proxy error:', err);
      res.status(500).json({ error: 'Proxy error occurred' });
    }
  });

  return proxy(req, res);
};
