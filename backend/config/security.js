module.exports = ({ env }) => ({
  settings: {
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "connect-src": ["'self'", "https:", "http:"],
        "img-src": ["'self'", "data:", "blob:", "http://192.168.1.215:1337"],
        "media-src": ["'self'", "data:", "blob:", "http://192.168.1.215:1337"],
        "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        "default-src": ["'self'"],
        upgradeInsecureRequests: null,
      },
    },
  },
});
