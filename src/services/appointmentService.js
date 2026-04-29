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
    return { error: 'Serviço não encontrado', status: 404 };
  }

  if (!TIME_WINDOWS.includes(window)) {
    return { error: 'Tempo invalido', status: 400 };
  }

  if (!patient.address) {
    return { error: 'O paciente deve salvar um endereço antes de solicitar o serviço.', status: 400 };
  }

  if (hasActiveAppointment(patient.id)) {
    return { error: 'O paciente já possui uma consulta agendada.', status: 409 };
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
        'Sintomas de emergência detectados. Este aplicativo não emergencial não pode processar esta solicitação. Entre em contato com os serviços de emergência..',
      status: 403,
      blockedAppointment
    };
  }

  const professional = findCompatibleProfessional(service, area);
  if (!professional) {
    return {
      error: 'Não há profissional compatível disponível nesta área de atendimento.',
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
