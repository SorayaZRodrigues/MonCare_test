const express = require('express');
const {
  getWindows,
  postAppointment,
  getAppointmentById,
  patchAppointmentStatus,
  cancelAppointment
} = require('../controllers/appointmentController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { validateRequiredFields } = require('../middleware/validationMiddleware');
const { attachPatientFromToken } = require('../middleware/accessMiddleware');

const router = express.Router();

router.post('/windows', authenticate, getWindows);

router.post(
  '/',
  authenticate,
  authorize('patient'),
  attachPatientFromToken,
  validateRequiredFields(['serviceName', 'area', 'window', 'symptoms']),
  postAppointment
);

router.get('/:id', authenticate, getAppointmentById);
router.patch('/:id/status', authenticate, validateRequiredFields(['status']), patchAppointmentStatus);
router.patch('/:id/cancel', authenticate, cancelAppointment);

module.exports = router;
