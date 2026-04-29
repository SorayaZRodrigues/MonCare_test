const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/jwt');

// Validates JWT and attaches decoded user to req.user.
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Cabeçalho de autorização ausente ou inválido' });
  }

  const token = authHeader.split(' ')[1];
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido ou expirado' });
  }
}

// Restricts endpoint by one or more roles.
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Proibido: permissões insuficientes' });
    }
    return next();
  };
}

module.exports = { authenticate, authorize };
