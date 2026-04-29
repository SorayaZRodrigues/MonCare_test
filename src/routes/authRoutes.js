const express = require('express');
const {
  registerPatientController,
  registerProfessionalController,
  loginController
} = require('../controllers/authController');
const { validateRequiredFields } = require('../middleware/validationMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /auth/register/patient:
 *   post:
 *     summary: Register a new patient
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Soraya"
 *               email:
 *                 type: string
 *                 example: "soraya@email.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: Patient registered successfully
 *       400:
 *         description: Validation error
 */
router.post(
  '/register/patient',
  validateRequiredFields(['name', 'email', 'password']),
  registerPatientController
);


/**
 * @swagger
 * /auth/register/professional:
 *   post:
 *     summary: Register a new healthcare professional
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Dr. Silva"
 *               email:
 *                 type: string
 *                 example: "drsilva@email.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *               profession:
 *                 type: string
 *                 example: "doctor"
 *               serviceAreas:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Downtown", "Verdun"]
 *     responses:
 *       201:
 *         description: Professional registered successfully
 *       400:
 *         description: Validation error
 */
router.post(
  '/register/professional',
  validateRequiredFields(['name', 'email', 'password', 'profession', 'serviceAreas']),
  registerProfessionalController
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login and return JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "test@email.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login', validateRequiredFields(['email', 'password']), loginController);

module.exports = router;
