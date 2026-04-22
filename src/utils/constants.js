const ROLES = {
  PATIENT: 'patient',
  PROFESSIONAL: 'professional',
  ADMIN: 'admin'
};

const PROFESSIONS = ['doctor', 'nurse', 'nutritionist'];

const APPOINTMENT_STATUS = {
  PENDING: 'pending',
  MATCHED: 'matched',
  ON_THE_WAY: 'on_the_way',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  BLOCKED_EMERGENCY: 'blocked_emergency'
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
  'chest pain',
  'severe shortness of breath',
  'heavy bleeding',
  'seizure',
  'loss of consciousness',
  'stroke symptoms'
];

module.exports = {
  ROLES,
  PROFESSIONS,
  APPOINTMENT_STATUS,
  ACTIVE_STATUSES,
  TIME_WINDOWS,
  EMERGENCY_SYMPTOMS
};
