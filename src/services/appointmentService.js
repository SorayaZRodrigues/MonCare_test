const { appointments, services, users } = require('../data/store');
const {
  ACTIVE_STATUSES,
  APPOINTMENT_STATUS,
  EMERGENCY_SYMPTOMS,
  ROLES,
  TIME_WINDOWS
} = require('../utils/constants');
const { nextId } = require('../utils/id');

function isEmergency(symptoms = []) {
  const text = Array.isArray(symptoms) ? symptoms.join(' ').toLowerCase() : String(symptoms).toLowerCase();
  return EMERGENCY_SYMPTOMS.some((keyword) => text.includes(keyword));
}

function hasActiveAppointment(patientId) {
  return appointments.some(
    (a) => a.patientId === patientId && ACTIVE_STATUSES.includes(a.status)
  );
}

function findServiceByName(name) {
  return services.find((s) => s.name.toLowerCase() === String(name).toLowerCase());
}

function findCompatibleProfessional(service, area) {
  return users.find(
    (u) =>
      u.role === ROLES.PROFESSIONAL &&
      u.approved &&
      u.available &&
      service.allowedRoles.includes(u.profession) &&
      Array.isArray(u.serviceAreas) &&
      u.serviceAreas.includes(area)
  );
}

function createAppointment({ patient, serviceName, area, window, symptoms }) {
  const service = findServiceByName(serviceName);
  if (!service) {
    return { error: 'Service not found', status: 404 };
  }

  if (!TIME_WINDOWS.includes(window)) {
    return { error: 'Invalid time window', status: 400 };
  }

  if (!patient.address) {
    return { error: 'Patient must save an address before requesting service', status: 400 };
  }

  if (hasActiveAppointment(patient.id)) {
    return { error: 'Patient already has an active appointment', status: 409 };
  }

  if (isEmergency(symptoms)) {
    const blockedAppointment = {
      id: nextId(appointments),
      patientId: patient.id,
      serviceName,
      area,
      window,
      symptoms,
      professionalId: null,
      status: APPOINTMENT_STATUS.BLOCKED_EMERGENCY,
      createdAt: new Date().toISOString()
    };
    appointments.push(blockedAppointment);
    return {
      error:
        'Emergency symptoms detected. This non-emergency app cannot process this request. Please contact emergency services.',
      status: 403,
      blockedAppointment
    };
  }

  const professional = findCompatibleProfessional(service, area);
  if (!professional) {
    return {
      error: 'No compatible professional available in this service area',
      status: 409
    };
  }

  const appointment = {
    id: nextId(appointments),
    patientId: patient.id,
    serviceName,
    area,
    window,
    symptoms,
    professionalId: professional.id,
    status: APPOINTMENT_STATUS.MATCHED,
    createdAt: new Date().toISOString()
  };

  appointments.push(appointment);
  return { data: appointment };
}

module.exports = {
  appointments,
  createAppointment,
  hasActiveAppointment,
  isEmergency
};
