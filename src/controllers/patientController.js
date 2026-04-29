const { users } = require('../data/store');

function getPatient(req, res) {
  const id = Number(req.params.id);
  const patient = users.find((u) => u.id === id && u.role === 'patient');
  if (!patient) return res.status(404).json({ message: 'Paciente não encontrado' });

  const { passwordHash, ...safePatient } = patient;
  return res.json(safePatient);
}

function updatePatient(req, res) {
  const id = Number(req.params.id);
  const patient = users.find((u) => u.id === id && u.role === 'patient');
  if (!patient) return res.status(404).json({ message: 'Paciente não encontrado' });

  patient.name = req.body.name ?? patient.name;
  patient.phone = req.body.phone ?? patient.phone;
  patient.address = req.body.address ?? patient.address;

  const { passwordHash, ...safePatient } = patient;
  return res.json(safePatient);
}

module.exports = { getPatient, updatePatient };
