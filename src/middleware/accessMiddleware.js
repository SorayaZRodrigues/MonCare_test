const { users } = require('../data/store');

function allowSelfOrAdmin(paramName = 'id') {
  return (req, res, next) => {
    const resourceId = Number(req.params[paramName]);
    if (req.user.role === 'admin' || req.user.id === resourceId) {
      return next();
    }
    return res.status(403).json({ message: 'Forbidden' });
  };
}

function attachPatientFromToken(req, res, next) {
  const patient = users.find((u) => u.id === req.user.id && u.role === 'patient');
  if (!patient) return res.status(403).json({ message: 'Only patients can request appointments' });
  req.contextPatient = patient;
  return next();
}

module.exports = { allowSelfOrAdmin, attachPatientFromToken };
