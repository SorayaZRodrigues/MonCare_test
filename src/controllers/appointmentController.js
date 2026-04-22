const { appointments } = require('../data/store');
const { createAppointment } = require('../services/appointmentService');
const { APPOINTMENT_STATUS, ROLES, TIME_WINDOWS } = require('../utils/constants');

function getWindows(req, res) {
  return res.json({ windows: TIME_WINDOWS });
}

function postAppointment(req, res) {
  const patient = req.contextPatient;
  const result = createAppointment({
    patient,
    serviceName: req.body.serviceName,
    area: req.body.area,
    window: req.body.window,
    symptoms: req.body.symptoms
  });

  if (result.error) {
    return res.status(result.status).json({
      message: result.error,
      blockedAppointment: result.blockedAppointment
    });
  }

  return res.status(201).json(result.data);
}

function getAppointmentById(req, res) {
  const id = Number(req.params.id);
  const appointment = appointments.find((a) => a.id === id);
  if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

  // Access: admin, patient owner, or assigned professional.
  const canAccess =
    req.user.role === ROLES.ADMIN ||
    appointment.patientId === req.user.id ||
    appointment.professionalId === req.user.id;

  if (!canAccess) return res.status(403).json({ message: 'Forbidden' });
  return res.json(appointment);
}

function patchAppointmentStatus(req, res) {
  const id = Number(req.params.id);
  const { status } = req.body;
  const appointment = appointments.find((a) => a.id === id);
  if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

  const validStatuses = Object.values(APPOINTMENT_STATUS);
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  const canUpdate =
    req.user.role === ROLES.ADMIN ||
    (req.user.role === ROLES.PROFESSIONAL && appointment.professionalId === req.user.id);

  if (!canUpdate) return res.status(403).json({ message: 'Forbidden' });

  appointment.status = status;
  return res.json(appointment);
}

function cancelAppointment(req, res) {
  const id = Number(req.params.id);
  const appointment = appointments.find((a) => a.id === id);
  if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

  const canCancel = req.user.role === ROLES.ADMIN || appointment.patientId === req.user.id;
  if (!canCancel) return res.status(403).json({ message: 'Forbidden' });

  appointment.status = APPOINTMENT_STATUS.CANCELLED;
  return res.json(appointment);
}

module.exports = {
  getWindows,
  postAppointment,
  getAppointmentById,
  patchAppointmentStatus,
  cancelAppointment
};
