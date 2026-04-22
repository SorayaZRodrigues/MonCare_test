// In-memory store with seed data for learning and QA practice.
// You can later swap this file with a real database implementation.

const services = [
  { id: 1, name: 'wound dressing change', allowedRoles: ['nurse', 'doctor'] },
  { id: 2, name: 'prescription renewal', allowedRoles: ['doctor'] },
  { id: 3, name: 'medical certificate renewal', allowedRoles: ['doctor'] },
  { id: 4, name: 'nutrition consultation', allowedRoles: ['nutritionist'] },
  { id: 5, name: 'blood pressure check', allowedRoles: ['nurse', 'doctor'] }
];

const users = [
  {
    id: 1,
    role: 'admin',
    name: 'Admin User',
    email: 'admin@careapp.com',
    passwordHash: '$2a$10$95IpT3FPQhcb6IaQm3NfkO8v3N9Fk8ca9bn8NKiWkjOfE7wsBhbNO' // admin123
  },
  {
    id: 2,
    role: 'professional',
    profession: 'doctor',
    name: 'Dr. Emily Carter',
    email: 'doctor1@careapp.com',
    passwordHash: '$2a$10$95IpT3FPQhcb6IaQm3NfkO8v3N9Fk8ca9bn8NKiWkjOfE7wsBhbNO',
    approved: true,
    available: true,
    serviceAreas: ['Downtown', 'Westside']
  },
  {
    id: 3,
    role: 'professional',
    profession: 'nurse',
    name: 'Nurse David Lee',
    email: 'nurse1@careapp.com',
    passwordHash: '$2a$10$95IpT3FPQhcb6IaQm3NfkO8v3N9Fk8ca9bn8NKiWkjOfE7wsBhbNO',
    approved: true,
    available: true,
    serviceAreas: ['Downtown', 'Northside']
  },
  {
    id: 4,
    role: 'professional',
    profession: 'nutritionist',
    name: 'Ana Gomez',
    email: 'nutrition1@careapp.com',
    passwordHash: '$2a$10$95IpT3FPQhcb6IaQm3NfkO8v3N9Fk8ca9bn8NKiWkjOfE7wsBhbNO',
    approved: true,
    available: false,
    serviceAreas: ['Westside']
  }
];

const appointments = [];

module.exports = {
  services,
  users,
  appointments
};
