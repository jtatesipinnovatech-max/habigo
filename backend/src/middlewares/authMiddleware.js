const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'No autorizado' });
  }

  try {
    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, 'secreto');

    req.user = decoded;

    next();

  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

module.exports = authMiddleware;