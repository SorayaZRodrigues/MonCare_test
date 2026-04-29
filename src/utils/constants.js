const ROLES = {
  PATIENT: 'patient',
  PROFESSIONAL: 'professional',
  ADMIN: 'admin'
};

const PROFESSIONS = ['doutor', 'enfermeira', 'nutricionista'];

const APPOINTMENT_STATUS = {
  PENDING: 'pendente',
  MATCHED: 'correspondida',
  ON_THE_WAY: 'a caminho',
  COMPLETED: 'concluida',
  CANCELLED: 'canceladp',
  BLOCKED_EMERGENCY: 'emergência_bloqueada'
};

const ACTIVE_STATUSES = [
  APPOINTMENT_STATUS.PENDING,
  APPOINTMENT_STATUS.MATCHED,
  APPOINTMENT_STATUS.ON_THE_WAY
];

const TIME_WINDOWS = [
  '12:00 to 14:00',
  '14:00 to 16:00',
  '16:00 to 18:00'
];

const EMERGENCY_SYMPTOMS = [
  'dor no peito',
  'falta de ar',
  'sangramento intenso',
  'convulsão',
  'perda de consciência',
  'sintomas de AVC'
];

module.exports = {
  ROLES,
  PROFESSIONS,
  APPOINTMENT_STATUS,
  ACTIVE_STATUSES,
  TIME_WINDOWS,
  EMERGENCY_SYMPTOMS
};
