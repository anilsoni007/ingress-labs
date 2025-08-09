const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createProxyMiddleware } = require('http-proxy-middleware');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});
app.use('/api/', limiter);

// JWT middleware for protected routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, 'your-secret-key', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'api-gateway',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.get('/api/status', (req, res) => {
  res.json({
    gateway: 'operational',
    version: '1.0.0',
    routes: [
      '/api/auth/login',
      '/api/auth/verify',
      '/api/proxy/users',
      '/api/proxy/products'
    ]
  });
});

// Authentication endpoints
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  // Simple auth for demo
  if (username === 'admin' && password === 'password') {
    const token = jwt.sign(
      { username, role: 'admin' },
      'your-secret-key',
      { expiresIn: '1h' }
    );
    res.json({ token, user: { username, role: 'admin' } });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.get('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// Proxy to other services
app.use('/api/proxy/users', createProxyMiddleware({
  target: 'http://user-service:5000',
  changeOrigin: true,
  pathRewrite: { '^/api/proxy/users': '' }
}));

app.use('/api/proxy/products', createProxyMiddleware({
  target: 'http://product-service:8080',
  changeOrigin: true,
  pathRewrite: { '^/api/proxy/products': '' }
}));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});