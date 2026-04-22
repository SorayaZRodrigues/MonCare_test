const express = require('express');
const {
  registerPatientController,
  registerProfessionalController,
  loginController
} = require('../controllers/authController');
const { validateRequiredFields } = require('../middleware/validationMiddleware');

const router = express.Router();

router.post(
  '/register/patient',
  validateRequiredFields(['name', 'email', 'password']),
  registerPatientController
);

router.post(
  '/register/professional',
  validateRequiredFields(['name', 'email', 'password', 'profession', 'serviceAreas']),
  registerProfessionalController
);

router.post('/login', validateRequiredFields(['email', 'password']), loginController);

module.exports = router;
