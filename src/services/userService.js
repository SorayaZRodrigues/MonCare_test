const bcrypt = require('bcryptjs');
const { users } = require('../data/store');
const { ROLES, PROFESSIONS } = require('../utils/constants');
const { nextId } = require('../utils/id');

function findByEmail(email) {
  return users.find((u) => u.email.toLowerCase() === String(email).toLowerCase());
}

function sanitizeUser(user) {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

async function registerPatient(data) {
  const existing = findByEmail(data.email);
  if (existing) {
    return { error: 'Este e-mail já está sendo usado', status: 409 };
  }

  const passwordHash = await bcrypt.hash(data.password, 10);
  const patient = {
    id: nextId(users),
    role: ROLES.PATIENT,
    name: data.name,
    email: data.email,
    passwordHash,
    phone: data.phone || null,
    address: data.address || null
  };

  users.push(patient);
  return { data: sanitizeUser(patient) };
}

async function registerProfessional(data) {
  if (!PROFESSIONS.includes(data.profession)) {
    return { error: 'Profissão invalida. Use doutor, enfermeira, ou nutricionista.', status: 400 };
  }

  const existing = findByEmail(data.email);
  if (existing) {
    return { error: 'Este e-mail já está sendo usado', status: 409 };
  }

  const passwordHash = await bcrypt.hash(data.password, 10);
  const professional = {
    id: nextId(users),
    role: ROLES.PROFESSIONAL,
    profession: data.profession,
    name: data.name,
    email: data.email,
    passwordHash,
    approved: false,
    available: Boolean(data.available ?? true),
    serviceAreas: Array.isArray(data.serviceAreas) ? data.serviceAreas : []
  };

  users.push(professional);
  return { data: sanitizeUser(professional) };
}

module.exports = {
  users,
  findByEmail,
  sanitizeUser,
  registerPatient,
  registerProfessional
};
