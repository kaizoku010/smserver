import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

export const verifyToken = (req, res, next) => {
  // Temporarily bypass token verification
  req.user = { role: 'admin' }; // Give admin access
  next();
};

export const isAdmin = (req, res, next) => {
  // Temporarily bypass admin check
  next();
};

export const corsOptions = {
  origin: [
    'http://localhost:3000', // store frontend
    'http://localhost:8080', // admin frontend
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
