import jwt from 'jsonwebtoken';

function getCookieToken(req) {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) {
    return null;
  }

  const tokenPair = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith('adminToken='));

  if (!tokenPair) {
    return null;
  }

  return decodeURIComponent(tokenPair.slice('adminToken='.length));
}

export function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const bearerToken = authHeader && authHeader.split(' ')[1];
  const token = bearerToken || getCookieToken(req);

  if (!token) {
    return res.status(401).json({ error: 'UNAUTHORIZED: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'FORBIDDEN: Invalid or expired token' });
  }
}
