const bcrypt = require('bcryptjs');
const { signToken } = require('../utils/jwt');
const {
  findByEmail,
  registerPatient,
  registerProfessional,
  sanitizeUser
} = require('../services/userService');

async function registerPatientController(req, res) {
  const result = await registerPatient(req.body);
  if (result.error) return res.status(result.status).json({ message: result.error });
  return res.status(201).json(result.data);
}

async function registerProfessionalController(req, res) {
  const result = await registerProfessional(req.body);
  if (result.error) return res.status(result.status).json({ message: result.error });
  return res.status(201).json(result.data);
}

async function loginController(req, res) {
  const { email, password } = req.body;
  const user = findByEmail(email);
  if (!user) return res.status(401).json({ message: 'Credenciais inválidas' });

  const isValidPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isValidPassword) return res.status(401).json({ message: 'Credenciais inválidas' });

  const token = signToken(user);
  return res.json({ token, user: sanitizeUser(user) });
}

module.exports = {
  registerPatientController,
  registerProfessionalController,
  loginController
};
