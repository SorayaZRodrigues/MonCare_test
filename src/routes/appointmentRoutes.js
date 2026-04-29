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

/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: Appointment requests
 */

/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Create a new appointment request
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patientId:
 *                 type: string
 *                 example: "patient-1"
 *               serviceId:
 *                 type: string
 *                 example: "service-1"
 *               symptoms:
 *                 type: string
 *                 example: "mild fever and headache"
 *     responses:
 *       201:
 *         description: Appointment created successfully
 *       400:
 *         description: Validation error
 */
router.post(
  '/',
  authenticate,
  authorize('patient'),
  attachPatientFromToken,
  validateRequiredFields(['serviceName', 'area', 'window', 'symptoms']),
  postAppointment
);

/**
 * @swagger
 * /appointments/{id}:
 *   get:
 *     summary: Get appointment by id
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment id
 *     responses:
 *       200:
 *         description: Appointment found
 *       404:
 *         description: Appointment not found
 */
router.get('/:id', authenticate, getAppointmentById);
router.patch('/:id/status', authenticate, validateRequiredFields(['status']), patchAppointmentStatus);
router.patch('/:id/cancel', authenticate, cancelAppointment);

module.exports = router;
