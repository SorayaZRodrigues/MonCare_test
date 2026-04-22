const { users } = require('../data/store');

function getProfessional(req, res) {
  const id = Number(req.params.id);
  const professional = users.find((u) => u.id === id && u.role === 'professional');
  if (!professional) return res.status(404).json({ message: 'Professional not found' });

  const { passwordHash, ...safeProfessional } = professional;
  return res.json(safeProfessional);
}

function updateProfessional(req, res) {
  const id = Number(req.params.id);
  const professional = users.find((u) => u.id === id && u.role === 'professional');
  if (!professional) return res.status(404).json({ message: 'Professional not found' });

  professional.name = req.body.name ?? professional.name;
  professional.serviceAreas = req.body.serviceAreas ?? professional.serviceAreas;

  const { passwordHash, ...safeProfessional } = professional;
  return res.json(safeProfessional);
}

function patchAvailability(req, res) {
  const id = Number(req.params.id);
  const professional = users.find((u) => u.id === id && u.role === 'professional');
  if (!professional) return res.status(404).json({ message: 'Professional not found' });

  if (typeof req.body.available !== 'boolean') {
    return res.status(400).json({ message: 'available must be boolean' });
  }

  professional.available = req.body.available;
  const { passwordHash, ...safeProfessional } = professional;
  return res.json(safeProfessional);
}

function approveProfessional(req, res) {
  const id = Number(req.params.id);
  const professional = users.find((u) => u.id === id && u.role === 'professional');
  if (!professional) return res.status(404).json({ message: 'Professional not found' });

  professional.approved = true;
  const { passwordHash, ...safeProfessional } = professional;
  return res.json(safeProfessional);
}

module.exports = {
  getProfessional,
  updateProfessional,
  patchAvailability,
  approveProfessional
};
